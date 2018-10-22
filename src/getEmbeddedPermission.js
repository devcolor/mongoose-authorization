const _ = require('lodash');

module.exports = function getEmbeddedPermission(doc, options, action) {
  let permsKey = 'permissions';
  if (options.permissions && options.permissions !== true) {
    permsKey = options.permissions;
  }

  return _.get(doc, `${permsKey}.${action}`);
};
