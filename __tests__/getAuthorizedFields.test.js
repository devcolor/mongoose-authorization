const test = require('ava');
const goodSchema = require('./exampleSchemas/goodSchema');
const bareBonesSchema = require('./exampleSchemas/bareBonesSchema');
const getAuthorizedFields = require('../src/getAuthorizedFields');

test('No authorized fields', (t) => {
  t.deepEqual(
    getAuthorizedFields(bareBonesSchema, 'foobar', 'read'),
    [],
  );
});

test('Handles non-existent authLevels', (t) => {
  t.deepEqual(
    getAuthorizedFields(goodSchema, ['defaults', 'foobar'], 'read').sort(),
    ['_id', 'name'].sort(),
  );
});

test('Combines basic authLevel permissions', (t) => {
  t.deepEqual(
    getAuthorizedFields(goodSchema, ['defaults', 'admin'], 'read').sort(),
    ['_id', 'name', 'address', 'phone', 'birthday'].sort(),
  );
});

test('Handles authLevels that have no permissions specified', (t) => {
  t.deepEqual(
    getAuthorizedFields(goodSchema, ['defaults', 'stranger'], 'read').sort(),
    ['_id', 'name'].sort(),
  );
});

test('Correctly deduping fields that are mentioned in multiple authLevels', (t) => {
  t.deepEqual(
    getAuthorizedFields(goodSchema, ['defaults', 'self', 'admin'], 'read').sort(),
    ['_id', 'name', 'address', 'phone', 'birthday'].sort(),
  );
});

test('Handles basic write permissions', (t) => {
  t.deepEqual(
    getAuthorizedFields(goodSchema, ['defaults', 'self'], 'write').sort(),
    ['address', 'phone'].sort(),
  );
});

test('Handles authorized fields that are not in the schema', (t) => {
  t.deepEqual(
    getAuthorizedFields(bareBonesSchema, 'admin', 'write'),
    [],
  );
});

test('Virtual fields are correctly returned', (t) => {
  t.deepEqual(
    getAuthorizedFields(goodSchema, ['defaults', 'hasVirtuals'], 'read').sort(),
    ['_id', 'name', 'virtual_name'].sort(),
  );
});

test('Top level nested field should be ok as authorized field', (t) => {
  t.deepEqual(
    getAuthorizedFields(goodSchema, ['defaults', 'nested_top'], 'read').sort(),
    ['_id', 'name', 'nested'].sort(),
    'top level nested field should be ok as authorized field',
  );
});
test('Deeply nested field should be ok as authorized field', (t) => {
  t.deepEqual(
    getAuthorizedFields(goodSchema, ['defaults', 'nested_deep'], 'read').sort(),
    ['_id', 'name', 'nested.thing'].sort(),
    'deeply nested field should be ok as authorized field',
  );
});
