const _ = require('lodash');
const cleanAuthLevels = require('./cleanAuthLevels');

function hasPermission(schema, authLevels, action) {
  const perms = schema.permissions || {};

  // look for any permissions setting for this action that is set to true (for these authLevels)
  const cleanedLevels = cleanAuthLevels(schema, authLevels);
  return _.some(cleanedLevels, level => perms[level][action]);
}

module.exports = hasPermission;
