import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create project (Admin only)
router.post('/', authenticateToken, requireRole(['admin']), [
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('deadline').isISO8601().withMessage('Valid deadline is required'),
  body('supervisor').isMongoId().withMessage('Valid supervisor ID is required'),
  body('students').isArray().withMessage('Students must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, deadline, supervisor, students } = req.body;

    // Verify supervisor exists and is a lecturer
    const supervisorUser = await User.findById(supervisor);
    if (!supervisorUser || supervisorUser.role !== 'lecturer') {
      return res.status(400).json({ message: 'Invalid supervisor' });
    }

    // Verify all students exist and are students
    const studentUsers = await User.find({ _id: { $in: students }, role: 'student' });
    if (studentUsers.length !== students.length) {
      return res.status(400).json({ message: 'Invalid student IDs' });
    }

    const project = new Project({
      name,
      description,
      deadline,
      supervisor,
      students,
      createdBy: req.user._id
    });

    await project.save();
    await project.populate(['supervisor', 'students', 'createdBy']);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all projects (Admin can see all, others see their assigned projects)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.students = req.user._id;
    } else if (req.user.role === 'lecturer') {
      query.supervisor = req.user._id;
    }
    
    // Admin can see all projects
    const projects = await Project.find(query)
      .populate('supervisor', 'name email')
      .populate('students', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single project
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('supervisor', 'name email')
      .populate('students', 'name email')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    const hasAccess = req.user.role === 'admin' ||
                     project.supervisor._id.toString() === req.user._id.toString() ||
                     project.students.some(student => student._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update project (Admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, description, deadline, supervisor, students } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (deadline) project.deadline = deadline;
    if (supervisor) project.supervisor = supervisor;
    if (students) project.students = students;

    await project.save();
    await project.populate(['supervisor', 'students', 'createdBy']);

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Delete a project (Admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;