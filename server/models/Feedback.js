import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Feedback', feedbackSchema);