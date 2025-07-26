const express = require('express');
const reminderController = require('../controllers/reminderController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Get today's reminders
router.get('/today', reminderController.getTodayReminders);

// Get reminders by type
router.get('/type/:type', reminderController.getRemindersByType);

// Toggle reminder completion status
router.patch('/:id/toggle-completion', reminderController.toggleReminderCompletion);

// Standard CRUD routes
router
  .route('/')
  .get(reminderController.getAllReminders)
  .post(reminderController.createReminder);

router
  .route('/:id')
  .get(reminderController.getReminder)
  .patch(reminderController.updateReminder)
  .delete(reminderController.deleteReminder);

module.exports = router;