const test = require('ava');
const mongoose = require('mongoose');
const embedPermissions = require('../src/embedPermissions');

test.before((t) => {
  const schema = new mongoose.Schema({ friend: String });
  schema.permissions = {
    default: {},
    manager: {
      read: ['friend'],
      write: ['friend'],
      create: true,
      remove: true,
    },
  };
  t.context.schema = schema;
});

test('No schema', (t) => {
  const blankDoc = {};
  embedPermissions(false, { permissions: true }, ['manager'], blankDoc);
  t.deepEqual(blankDoc, {}, 'Nothing should have been added to doc');
});

test('No document', (t) => {
  t.notThrows(() => { embedPermissions(t.context.schema, { permissions: true }, ['manager'], false); });
});

test('Options say to do nothing', (t) => {
  const blankDoc = {};
  embedPermissions(t.context.schema, false, ['manager'], blankDoc);
  t.deepEqual(blankDoc, {}, 'Should not add permissions for false options');

  embedPermissions(t.context.schema, {}, ['manager'], blankDoc);
  t.deepEqual(blankDoc, {}, 'Should not add permissions for {} options');

  embedPermissions(t.context.schema, { permissions: false }, ['manager'], blankDoc);
  t.deepEqual(blankDoc, {}, 'Should not add permissions for { permissions: false} options');
});

test('Permissions embeded under default key', (t) => {
  const managerDoc = {};
  embedPermissions(t.context.schema, { permissions: true }, ['manager'], managerDoc);
  t.deepEqual(
    managerDoc.permissions,
    {
      read: ['friend'],
      write: ['friend'],
      remove: true,
    },
    'Incorrect permissions embedded',
  );

  const defaultDoc = {};
  embedPermissions(t.context.schema, { permissions: true }, [], defaultDoc);
  t.deepEqual(
    defaultDoc.permissions,
    {
      read: [],
      write: [],
      remove: false,
    },
    'Incorrect permissions embedded',
  );
});
test('Permissions embded under custom key', (t) => {
  const managerDoc = {};
  embedPermissions(t.context.schema, { permissions: 'customKey' }, ['manager'], managerDoc);
  t.deepEqual(
    managerDoc.customKey,
    {
      read: ['friend'],
      write: ['friend'],
      remove: true,
    },
    'Incorrect permissions embedded',
  );

  const defaultDoc = {};
  embedPermissions(t.context.schema, { permissions: 'customKey' }, [], defaultDoc);
  t.deepEqual(
    defaultDoc.customKey,
    {
      read: [],
      write: [],
      remove: false,
    },
    'Incorrect permissions embedded',
  );
});

test('If there\'s already a permissions field', (t) => {
  const doc = { permissions: 'app level info' };
  t.throws(
    () => {
      embedPermissions(t.context.schema, { permissions: true }, ['manager'], doc);
    },
    Error,
    'An error should be thrown when a permissions key is already present in the target object',
  );
});

test('Verify that the permissions data cannot be changed', (t) => {
  const doc = {};
  embedPermissions(t.context.schema, { permissions: true }, ['manager'], doc);

  t.throws(
    () => { doc.permissions.read = []; },
    Error,
    'The permissions object shouldn\'t be writable [read]',
  );

  t.throws(
    () => { doc.permissions.write = []; },
    Error,
    'The permissions object shouldn\'t be writable [write]',
  );

  t.throws(
    () => { doc.permissions.remove = false; },
    Error,
    'The permissions object shouldn\'t be writable [remove]',
  );

  t.throws(
    () => { doc.permissions = {}; },
    Error,
    'The permissions field should not be writable',
  );
});
