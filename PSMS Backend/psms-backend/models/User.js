const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'lecturer', 'admin'],
    required: true
  },
  department: {
    type: String
  },
  batch: {
    type: String
  },
  regNo: {
    type: String
  }
});

module.exports = mongoose.model('User', UserSchema);
