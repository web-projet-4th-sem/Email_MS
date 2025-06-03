const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: String,
  department: String,
  batch: String,
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Group', groupSchema);
