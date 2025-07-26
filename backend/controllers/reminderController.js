const Reminder = require('../models/reminderModel');

// Helper function to create error responses
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Get all reminders for the current user
exports.getAllReminders = async (req, res, next) => {
  try {
    // In a real app, we would filter by req.user.id from the auth middleware
    // For now, we'll use a mock user ID or the one provided in the request
    const userId = req.user?.id || 'mock-user-id';
    
    // Optional filter by type
    const filter = { user: userId };
    if (req.query.type && ['medication', 'appointment', 'activity'].includes(req.query.type)) {
      filter.type = req.query.type;
    }
    
    // Get reminders from the mock database
    const reminders = await Reminder.find(filter);
    
    res.status(200).json({
      status: 'success',
      results: reminders.length,
      data: {
        reminders
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get a single reminder by ID
exports.getReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    
    if (!reminder) {
      return next(createError(404, 'No reminder found with that ID'));
    }
    
    // Check if the reminder belongs to the current user
    if (reminder.user !== (req.user?.id || 'mock-user-id')) {
      return next(createError(403, 'You do not have permission to access this reminder'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        reminder
      }
    });
  } catch (err) {
    next(err);
  }
};

// Create a new reminder
exports.createReminder = async (req, res, next) => {
  try {
    // Set the user ID from the authenticated user
    req.body.user = req.user?.id || 'mock-user-id';
    
    // Validate the reminder type
    if (!req.body.type || !['medication', 'appointment', 'activity'].includes(req.body.type)) {
      return next(createError(400, 'Please provide a valid reminder type'));
    }
    
    // Create the reminder
    const newReminder = await Reminder.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        reminder: newReminder
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update a reminder
exports.updateReminder = async (req, res, next) => {
  try {
    // Find the reminder
    const reminder = await Reminder.findById(req.params.id);
    
    if (!reminder) {
      return next(createError(404, 'No reminder found with that ID'));
    }
    
    // Check if the reminder belongs to the current user
    if (reminder.user !== (req.user?.id || 'mock-user-id')) {
      return next(createError(403, 'You do not have permission to update this reminder'));
    }
    
    // Update the reminder
    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        reminder: updatedReminder
      }
    });
  } catch (err) {
    next(err);
  }
};

// Delete a reminder
exports.deleteReminder = async (req, res, next) => {
  try {
    // Find the reminder
    const reminder = await Reminder.findById(req.params.id);
    
    if (!reminder) {
      return next(createError(404, 'No reminder found with that ID'));
    }
    
    // Check if the reminder belongs to the current user
    if (reminder.user !== (req.user?.id || 'mock-user-id')) {
      return next(createError(403, 'You do not have permission to delete this reminder'));
    }
    
    // Delete the reminder
    await Reminder.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

// Mark a reminder as completed or not completed
exports.toggleReminderCompletion = async (req, res, next) => {
  try {
    // Find the reminder
    const reminder = await Reminder.findById(req.params.id);
    
    if (!reminder) {
      return next(createError(404, 'No reminder found with that ID'));
    }
    
    // Check if the reminder belongs to the current user
    if (reminder.user !== (req.user?.id || 'mock-user-id')) {
      return next(createError(403, 'You do not have permission to update this reminder'));
    }
    
    // Toggle the completed status
    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { completed: !reminder.completed },
      { new: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        reminder: updatedReminder
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get upcoming reminders for today
exports.getTodayReminders = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'mock-user-id';
    
    // In a real app with MongoDB, we would use aggregation to filter by today's date
    // For our mock implementation, we'll just return all reminders
    const reminders = await Reminder.find({ user: userId, completed: false });
    
    res.status(200).json({
      status: 'success',
      results: reminders.length,
      data: {
        reminders
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get reminders by type
exports.getRemindersByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    
    if (!['medication', 'appointment', 'activity'].includes(type)) {
      return next(createError(400, 'Invalid reminder type'));
    }
    
    const userId = req.user?.id || 'mock-user-id';
    
    const reminders = await Reminder.find({ user: userId, type });
    
    res.status(200).json({
      status: 'success',
      results: reminders.length,
      data: {
        reminders
      }
    });
  } catch (err) {
    next(err);
  }
};