const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Group = require('../models/Group');
const authMiddleware = require('../middleware/auth');

//  1. Dashboard Stats (Total admins, lecturers, students, projects)
router.get('/dashboard', authMiddleware(['admin']), async (req, res) => {
  try {
    res.json({ message: 'Admin dashboard' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// 2. Get All Users
router.get('/users', authMiddleware(['admin']), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

//  3. Get One User
router.get('/users/:id', authMiddleware(['admin']), async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

//  4. Edit User
router.put('/users/:id', authMiddleware(['admin']), async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

//  5. Delete User
router.delete('/users/:id', authMiddleware(['admin']), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

//  6. Add Group
router.post('/groups', authMiddleware(['admin']), async (req, res) => {
  const group = new Group(req.body);
  await group.save();
  res.status(201).json(group);
});

//  7. Get All Groups
router.get('/groups', authMiddleware(['admin']), async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});

//  8. Settings (placeholder)
router.get('/settings', authMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Settings fetched successfully.' });
});

module.exports = router;
