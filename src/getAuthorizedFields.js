const _ = require('lodash');
const cleanAuthLevels = require('./cleanAuthLevels');

function getAuthorizedFields(schema, authLevels, action) {
  const cleanedLevels = cleanAuthLevels(schema, authLevels);

  return _.chain(cleanedLevels)
    .flatMap(level => schema.permissions[level][action])
    .filter(path => schema.pathType(path) !== 'adhocOrUndefined') // ensure fields are in schema
    .uniq() // dropping duplicates
    .value();
}

module.exports = getAuthorizedFields;
