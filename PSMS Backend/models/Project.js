const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  code: String, // Optional project code (e.g., OXF/ENG/01)
  description: String,
  technologies: [String],
  members: [String], // regNo or student names
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
