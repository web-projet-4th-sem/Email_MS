const express = require('express');
const router = express.Router();
const { getProjects, submitReview } = require('../controllers/lecturerController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/lecturer/dashboard - Get all projects supervised by the lecturer
router.get('/dashboard', authMiddleware, getProjects);

// POST /api/lecturer/review - Submit a review for a project
router.post('/review', authMiddleware, submitReview);

module.exports = router;
