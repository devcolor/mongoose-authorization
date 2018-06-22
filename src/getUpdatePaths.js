const _ = require('lodash');

function getUpdatePaths(updates) {
  // query._update is sometimes in the form of `{ $set: { foo: 1 } }`, where the top level
  // is atomic operations. See: http://mongoosejs.com/docs/api.html#query_Query-update
  // For findOneAndUpdate, the top level may be the fields that we want to examine.
  return _.flatMap(updates, (val, key) => {
    if (_.startsWith(key, '$')) {
      return Object.keys(val);
    }

    return key;
  });
}

module.exports = getUpdatePaths;
