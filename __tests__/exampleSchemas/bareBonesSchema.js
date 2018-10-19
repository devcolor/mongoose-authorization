const mongoose = require('mongoose');

const bareBonesSchema = new mongoose.Schema({});
bareBonesSchema.permissions = {
  admin: {
    read: ['address', 'phone', 'birthday', 'does_not_exist'],
    write: ['address', 'phone', 'birthday', 'not_here_either'],
    create: true,
    remove: true,
  },
};

module.exports = bareBonesSchema;
