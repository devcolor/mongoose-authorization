const mongoose = require('mongoose');

const goodSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  birthday: String,
  nested: { thing: String },
});
goodSchema.permissions = {
  defaults: {
    read: ['_id', 'name'],
    write: [],
    create: false,
  },
  admin: {
    read: ['address', 'phone', 'birthday'],
    write: ['address', 'phone', 'birthday'],
    create: true,
    remove: true,
  },
  self: {
    read: ['address', 'phone', 'birthday'],
    write: ['address', 'phone'],
  },
  stranger: {},
  hasVirtuals: {
    read: ['virtual_name'],
  },
  nested_top: {
    read: ['nested'],
  },
  nested_deep: {
    read: ['nested.thing'],
  },
};
goodSchema.virtual('virtual_name').get(function getVirtualName() {
  return `virtual${this.name}`;
});
goodSchema.getAuthLevel = function getAuthLevel(payload) {
  return payload && payload.authLevel;
};

module.exports = goodSchema;
