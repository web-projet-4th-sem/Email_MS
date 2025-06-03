const Project = require('../models/Project');
const Review = require('../models/LecturerReview');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ lecturerId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.submitReview = async (req, res) => {
  const { projectId, content } = req.body;
  try {
    const review = new Review({
      projectId,
      lecturerId: req.user.id,
      content,
    });
    await review.save();
    res.json({ message: 'Review submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
};
