const test = require('ava');
const mongoose = require('mongoose');
const authz = require('../../');
const IncompatibleMethodError = require('../../src/IncompatibleMethodError');

test.before(async () => {
  await mongoose.connect('mongodb://localhost:27017/ModelRemoveTests');
});

test('Model.remove should not be callable with plugin installed', (t) => {
  const schema = new mongoose.Schema({ friend: String });
  schema.plugin(authz);
  const MyModel = mongoose.model('ModelRemovePluggedIn', schema);

  t.throws(
    () => MyModel.remove({ friend: 'bar' }).exec(),
    IncompatibleMethodError,
  );
});

test('Model.remove should be callable without the plugin installed', async (t) => {
  const schema = new mongoose.Schema({ friend: String });
  const MyModel = mongoose.model('ModelRemoveWithoutPlugin', schema);

  await t.notThrows(MyModel.remove({}).exec());
});

test.after.always(async () => {
  await mongoose.disconnect();
});
