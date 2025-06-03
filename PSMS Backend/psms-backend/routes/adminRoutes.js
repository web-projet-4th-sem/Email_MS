const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');

// Admin: View total users and projects
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();

    res.json({
      totalUsers: userCount,
      totalProjects: projectCount
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
