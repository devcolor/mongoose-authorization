const _ = require('lodash');

module.exports = function cleanAuthLevels(schema, authLevels) {
  const perms = (schema && schema.permissions) || {};

  return _.chain(authLevels)
    .castArray()
    .filter(level => !!perms[level]) // make sure the level in the permissions dict
    .uniq() // get rid of fields mentioned in multiple levels
    .value();
};
