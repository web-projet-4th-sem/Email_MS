const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  technologies: [String],
  members: [String],
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
    feedback: [
    {
      lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
    status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }

});

module.exports = mongoose.model('Project', projectSchema);
