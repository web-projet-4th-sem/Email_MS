const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String, // hashed
  role: String // ✅ not "roles"
});

module.exports = mongoose.model('User', userSchema);
