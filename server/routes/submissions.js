import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Submission from '../models/Submission.js';
import Project from '../models/Project.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only documents and archives are allowed'));
    }
  }
});

// Submit proposal (Students only)
router.post('/', authenticateToken, upload.single('proposal'), async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit proposals' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { projectId } = req.body;

    // Verify project exists and student is assigned to it
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.students.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not assigned to this project' });
    }

    const submission = new Submission({
      project: projectId,
      student: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filepath: req.file.path
    });

    await submission.save();
    await submission.populate(['project', 'student']);

    res.status(201).json(submission);
  } catch (error) {
    // Clean up uploaded file if database save fails
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get submissions for a project
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
    
    // Students can only see their own submissions
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    const submissions = await Submission.find(query)
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download submission file
router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('project');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if user has access to download this file
    const hasAccess = req.user.role === 'admin' ||
                     submission.project.supervisor.toString() === req.user._id.toString() ||
                     submission.student.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const filePath = submission.filepath;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, submission.originalName);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;