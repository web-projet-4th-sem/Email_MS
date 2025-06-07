const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Group = require('../models/Group');
const authMiddleware = require('../middleware/auth');

//  1. Dashboard Stats
router.get('/dashboard', authMiddleware(['student']), async (req, res) => {
  try {
    res.json({ message: 'Student dashboard' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
