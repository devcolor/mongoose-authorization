const getAuthorizedFields = require('./getAuthorizedFields');
const hasPermission = require('./hasPermission');

function embedPermissions(schema, options, authLevels, doc) {
  if (!schema || !options || !options.permissions || !doc) { return; }

  const permsKey = options.permissions === true ? 'permissions' : options.permissions;

  if (doc[permsKey]) {
    // There's already something at the key where we're supposed to inset the permissions
    // Throw an excpetion to help the developer avoid this error.
    throw new Error(`Cannot embed permissions into mongoose document at \`${permsKey}\`because the key is already present in the document. Please specify a custom key.`);
  }

  doc[permsKey] = {
    read: getAuthorizedFields(schema, authLevels, 'read'),
    write: getAuthorizedFields(schema, authLevels, 'write'),
    remove: hasPermission(schema, authLevels, 'remove'),
  };

  // Freeze the object so this data can't be altered (even accidentally)
  Object.freeze(doc[permsKey]);
}

module.exports = embedPermissions;
