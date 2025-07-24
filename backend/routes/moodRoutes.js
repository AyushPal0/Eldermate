const express = require('express');
const moodController = require('../controllers/moodController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Get mood statistics and trends
router.get('/stats', moodController.getMoodStats);
router.get('/trends', moodController.getMoodTrends);

// Standard CRUD routes
router
  .route('/')
  .get(moodController.getAllMoods)
  .post(moodController.createMood);

router
  .route('/:id')
  .get(moodController.getMood)
  .patch(moodController.updateMood)
  .delete(moodController.deleteMood);

module.exports = router;