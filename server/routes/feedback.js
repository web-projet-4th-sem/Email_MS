import express from 'express';
import { body, validationResult } from 'express-validator';
import Feedback from '../models/Feedback.js';
import Submission from '../models/Submission.js';
import Project from '../models/Project.js';
import { authenticateToken } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Send feedback (Lecturers only)
router.post('/', authenticateToken, [
  body('submissionId').isMongoId().withMessage('Valid submission ID is required'),
  body('message').notEmpty().withMessage('Feedback message is required')
], async (req, res) => {
  try {
    if (req.user.role !== 'lecturer') {
      return res.status(403).json({ message: 'Only lecturers can send feedback' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { submissionId, message } = req.body;

    const submission = await Submission.findById(submissionId).populate('project');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify lecturer is the supervisor of this project
    if (submission.project.supervisor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not the supervisor of this project' });
    }

    const feedback = new Feedback({
      project: submission.project._id,
      student: submission.student,
      lecturer: req.user._id,
      submission: submissionId,
      message
    });

    await feedback.save();
    await feedback.populate(['project', 'student', 'lecturer', 'submission']);

    await Notification.create({
  user: submission.student,
  message: `New feedback received for your submission.`,
  type: 'feedback'
});

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get feedback for a project
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = req.user.role === 'admin' ||
                     project.supervisor.toString() === req.user._id.toString() ||
                     project.students.includes(req.user._id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let query = { project: projectId };
    
    // Students can only see feedback for their submissions
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    const feedback = await Feedback.find(query)
      .populate('student', 'name email')
      .populate('lecturer', 'name email')
      .populate('submission', 'originalName submittedAt')
      .sort({ sentAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get feedback by student for a project
router.get('/project/:projectId/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { projectId, studentId } = req.params;

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access permissions
    const hasAccess = req.user.role === 'admin' ||
                     project.supervisor.toString() === req.user._id.toString() ||
                     (req.user._id.toString() === studentId && project.students.includes(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const feedback = await Feedback.find({ 
      project: projectId, 
      student: studentId 
    })
      .populate('student', 'name email')
      .populate('lecturer', 'name email')
      .populate('submission', 'originalName submittedAt')
      .sort({ sentAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;