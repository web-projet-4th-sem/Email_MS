const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Project = require('../models/Project');

// Create a new project
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, technologies, members } = req.body;

    const newProject = new Project({
      title,
      description,
      technologies,
      members,
      supervisor: req.user.id // user who is logged in
    });

    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('supervisor', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add feedback to a project
router.post('/:id/feedback', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    const newFeedback = {
      lecturer: req.user.id,
      comment: req.body.comment
    };

    project.feedback.push(newFeedback);
    await project.save();

    res.json({ msg: 'Feedback added', feedback: project.feedback });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Assign a supervisor to a project
router.put('/:id/assign-supervisor', auth, async (req, res) => {
  const { supervisorId } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    project.supervisor = supervisorId;
    await project.save();

    res.json({ msg: 'Supervisor assigned', project });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Student: View their own projects
router.get('/my', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find projects where the student's name or ID is in the members list
    const projects = await Project.find({
      members: { $in: [userId] }
    }).populate('supervisor', 'name email');

    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Lecturer: View supervised projects
router.get('/supervised', auth, async (req, res) => {
  try {
    const lecturerId = req.user.id;

    const projects = await Project.find({ supervisor: lecturerId })
      .populate('members', 'name email') // shows member info
      .populate('supervisor', 'name email'); // shows supervisor info too

    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Student: Update their own project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Only allow update if the user is in the members list
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ msg: 'You are not allowed to update this project' });
    }

    // Update fields if provided
    const { title, description, technologies } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (technologies) project.technologies = technologies;

    await project.save();

    res.json({ msg: 'Project updated', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Supervisor: Approve or reject a project
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Only the assigned supervisor can update status
    if (project.supervisor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You are not the assigned supervisor' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    project.status = status;
    await project.save();

    res.json({ msg: `Project ${status}`, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
