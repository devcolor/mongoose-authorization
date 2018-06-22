const test = require('ava');
const mongoose = require('mongoose');
const authz = require('../../');
const IncompatibleMethodError = require('../../src/IncompatibleMethodError');

test.before(async () => {
  await mongoose.connect('mongodb://localhost:27017/ModelCreateTests');
});

test('Model.create should not be callable with plugin installed', (t) => {
  const schema = new mongoose.Schema({ friend: String });
  schema.plugin(authz);
  const MyModel = mongoose.model('ModelCreatePluggedIn', schema);

  t.throws(
    () => MyModel.create({ friend: 'bar' }),
    IncompatibleMethodError,
  );
});

test('Model.create should be callable without the plugin installed', async (t) => {
  const schema = new mongoose.Schema({ friend: String });
  const MyModel = mongoose.model('ModelCreateWithoutPluggin', schema);

  await t.notThrows(MyModel.create({ friend: 'bar' }));
});

test.after.always(async () => {
  await mongoose.disconnect();
});
