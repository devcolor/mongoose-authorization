const _ = require('lodash');
const cleanAuthLevels = require('./cleanAuthLevels');

async function resolveAuthLevel(schema, options, doc) {
  // Look into options the options and try to find authLevels. Always prefer to take
  // authLevels from the direct authLevel option as opposed to the computed
  // ones from getAuthLevel in the schema object.
  let authLevels = [];
  if (options) {
    if (options.authLevel) {
      authLevels = _.castArray(options.authLevel);
    } else if (typeof schema.getAuthLevel === 'function') {
      if (!options.authPayload) {
        throw new Error('An `authPayload` must exist with a `getAuthLevel` method.');
      }
      if (!doc) {
        throw new Error('This type of query is not compatible with using a getAuthLevel method.');
      }
      authLevels = _.castArray(await schema.getAuthLevel(options.authPayload, doc));
    }
  }

  // Add `defaults` to the list of levels since you should always be able to do what's specified
  // in defaults.
  authLevels.push('defaults');

  return cleanAuthLevels(schema, authLevels);
}

module.exports = resolveAuthLevel;
