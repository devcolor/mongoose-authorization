const test = require('ava');
const mongoose = require('mongoose');
const authz = require('../');
const IncompatibleMethodError = require('../lib/IncompatibleMethodError');

test.before((t) => {
  const schema = new mongoose.Schema({ friend: String });
  schema.plugin(authz);
  t.context.MyModel = mongoose.model('MyModel', schema);
});

test('Model.create should not be callable', (t) => {
  const { MyModel } = t.context;
  t.throws(
    () => MyModel.create({ friend: 'bar' }),
    IncompatibleMethodError,
  );
});

test('Model.remove should not be callable', (t) => {
  const { MyModel } = t.context;
  t.throws(
    () => MyModel.remove({}),
    IncompatibleMethodError,
  );
});

