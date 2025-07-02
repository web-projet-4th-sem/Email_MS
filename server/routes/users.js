import express from 'express';
import User from '../models/User.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users by role (Admin only)
router.get('/by-role/:role', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['student', 'lecturer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const users = await User.find({ role }).select('-password').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, description, profilePicture } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (description !== undefined) user.description = description;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      description: user.description
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;