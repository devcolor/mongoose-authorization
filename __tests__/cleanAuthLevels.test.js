const test = require('ava');
const mongoose = require('mongoose');
// const cleanAuthLevels = require('../src/cleanAuthLevels');

test.before((t) => {
  t.context.schema = new mongoose.Schema({ friend: String });
});

test.todo('Schema passed in is not valid');
test.todo('Falsey authLevel value');
test.todo('Empty array authLevel value');
test.todo('Remove duplicate entries');
test.todo('Remove false entries');
test.todo('Remove entries that are not in the permissions object');
test.todo('authLevel with no issues');

