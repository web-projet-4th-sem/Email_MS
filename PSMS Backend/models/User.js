const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'lecturer', 'student'], default: 'student' },
  batch: String,
  department: String,
});

module.exports = mongoose.model('User', userSchema);

