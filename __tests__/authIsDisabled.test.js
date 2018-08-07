const test = require('ava');
const authIsDisabled = require('../src/authIsDisabled');

test.todo('Create tests for authIsDisabled');
test('works with no options', (t) => {
  t.false(authIsDisabled(), 'should handle undefined input');
  t.false(authIsDisabled(false), 'should handle false input');
  t.false(authIsDisabled(''), 'should handle empty string input');
  t.false(authIsDisabled({}), 'should handle empty object input');
});

test('handles authLevel correctly', (t) => {
  t.true(authIsDisabled({ authLevel: false }), 'false AuthLevel should disable authorization');
  t.false(authIsDisabled({ authLevel: 0 }), 'authLevel of 0 should not disable authorization');
  t.false(
    authIsDisabled({ authLevel: '' }),
    'authLevel of empty string should not disable authorization',
  );
});
