const getAuthorizedFields = require('./getAuthorizedFields');
const hasPermission = require('./hasPermission');

function embedPermissions(schema, options, authLevels, doc) {
  if (!options || !options.permissions) { return; }

  const permsKey = options.permissions === true ? 'permissions' : options.permissions;
  doc[permsKey] = {
    read: getAuthorizedFields(schema, authLevels, 'read'),
    write: getAuthorizedFields(schema, authLevels, 'write'),
    remove: hasPermission(schema, authLevels, 'remove'),
  };
}

module.exports = embedPermissions;
