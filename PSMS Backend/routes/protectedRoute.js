const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Protected route: only logged-in users can see this
router.get('/profile', auth, (req, res) => {
  res.json({
    msg: 'This is protected data only visible to logged-in users.',
    user: req.user
  });
});

module.exports = router;
