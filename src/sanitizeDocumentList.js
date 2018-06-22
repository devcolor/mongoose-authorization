const _ = require('lodash');
const resolveAuthLevel = require('./resolveAuthLevel');
const getAuthorizedFields = require('./getAuthorizedFields');
const embedPermissions = require('./embedPermissions');

async function sanitizeDocument(schema, options, doc) {
  if (!doc) { return; }

  // If there are subschemas that need to be authorized, store a reference to the top
  // level doc so they have context when doing their authorization checks
  const optionAddition = {};
  if (!options.originalDoc && !_.isEmpty(schema.pathsWithPermissionedSchemas)) {
    optionAddition.authPayload = { originalDoc: doc };
  }
  const docOptions = _.merge({}, options, optionAddition);


  const authLevels = await resolveAuthLevel(schema, docOptions, doc);
  const authorizedFields = getAuthorizedFields(schema, authLevels, 'read');

  // Check to see if group has the permission to see the fields that came back.
  // We must edit the document in place to maintain the right reference
  // Also, we use `_.pick` to make sure that we can handle paths that are deep
  // reference to nested objects, like `nested.subpath`.

  // `doc._doc` contains the plain JS object with all the data we care about if `doc` is a
  // Mongoose Document.
  const innerDoc = doc._doc || doc;
  const newDoc = _.pick(innerDoc, authorizedFields);

  // Empty out the object so we can put in other the paths that were `_.pick`ed
  // Then copy back only the info the user is allowed to see
  Object.keys(innerDoc).forEach((pathName) => {
    delete innerDoc[pathName];
  });
  Object.assign(innerDoc, newDoc);

  // Special work. Wipe out the getter for the virtuals that have been set on the
  // schema that are not authorized to come back
  Object.keys(schema.virtuals).forEach((pathName) => {
    if (!_.includes(authorizedFields, pathName)) {
      // These virtuals are set with `Object.defineProperty`. You cannot overwrite them
      // by directly setting the value to undefined, or by deleting the key in the
      // document. This is potentially slow with lots of virtuals
      Object.defineProperty(doc, pathName, {
        value: undefined,
      });
    }
  });

  // Check to see if we're going to be inserting the permissions info
  embedPermissions(schema, docOptions, authLevels, doc);

  // Apply the rules down one level if there are any path specific permissions
  const subDocSanitationPromises = _.map(
    schema.pathsWithPermissionedSchemas,
    async (path, subSchema) => {
      if (innerDoc[path]) {
        // eslint-disable-next-line no-use-before-define
        innerDoc[path] = await sanitizeDocumentList(subSchema, docOptions, innerDoc[path]);
      }
    },
  );

  await Promise.all(subDocSanitationPromises);
}

async function sanitizeDocumentList(schema, options, docs) {
  const multi = _.isArrayLike(docs);

  if (!multi) {
    sanitizeDocument(schema, options, docs);
    return;
  }

  const sanitizationPromises = docs.map(doc => sanitizeDocument(schema, options, doc));
  await Promise.all(sanitizationPromises);

  _.remove(docs, doc => _.isEmpty(doc._doc || doc));
}

module.exports = sanitizeDocumentList;
