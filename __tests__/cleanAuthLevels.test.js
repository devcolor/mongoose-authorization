const test = require('ava');
const mongoose = require('mongoose');
const cleanAuthLevels = require('../src/cleanAuthLevels');

test.before((t) => {
  const schema = new mongoose.Schema({ friend: String });
  schema.permissions = { default: {}, manager: {}, report: {} };
  t.context.schema = schema;
});

test('Schema passed in is not valid', (t) => {
  t.deepEqual(
    cleanAuthLevels(false, ['foo']),
    [],
    'should return empty list when schema is falsy',
  );

  t.deepEqual(
    cleanAuthLevels(false, []),
    [],
    'should return empty list when schema is falsy and there are no authLevels',
  );

  t.deepEqual(
    cleanAuthLevels({}, ['foo']),
    [],
    'should return empty list when schema is empty object',
  );

  t.deepEqual(
    cleanAuthLevels({}, []),
    [],
    'should return empty list when schema is empty object & there are no authLevels',
  );
});

test('Falsey authLevel value', (t) => {
  t.deepEqual(cleanAuthLevels(t.context.schema, false), []);
  t.deepEqual(cleanAuthLevels(t.context.schema, 0), []);
});

test('Empty array authLevel value', (t) => {
  t.deepEqual(cleanAuthLevels(t.context.schema, []), []);
});

test('Remove duplicate entries', (t) => {
  t.deepEqual(cleanAuthLevels(t.context.schema, ['manager', 'manager']), ['manager']);
});

test('Remove false entries', (t) => {
  t.deepEqual(cleanAuthLevels(t.context.schema, [0, 'manager', false]), ['manager']);
});

test('Remove entries that are not in the permissions object', (t) => {
  t.deepEqual(cleanAuthLevels(t.context.schema, ['fake', 'manager', 'notthere']), ['manager']);
  t.deepEqual(cleanAuthLevels(t.context.schema, ['fake', 'notthere']), []);
});

test('authLevel with no issues', (t) => {
  t.deepEqual(
    cleanAuthLevels(t.context.schema, ['manager']),
    ['manager'],
    'should handle single item array',
  );

  t.deepEqual(
    cleanAuthLevels(t.context.schema, ['manager', 'report']),
    ['manager', 'report'],
    'should handle mutliple item array',
  );

  t.deepEqual(
    cleanAuthLevels(t.context.schema, 'manager'),
    ['manager'],
    'should handle single level, not in array',
  );
});

