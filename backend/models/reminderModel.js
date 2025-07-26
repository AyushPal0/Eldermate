const mongoose = require('mongoose');

// Define the base schema for all reminder types
const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: String, // In a real app with MongoDB, this would be mongoose.Schema.ObjectId with a ref to the User model
      required: [true, 'A reminder must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'A reminder must have a title'],
      trim: true,
    },
    time: {
      type: String, // Store as string in HH:MM format for simplicity
      required: [true, 'A reminder must have a time'],
    },
    type: {
      type: String,
      required: [true, 'A reminder must have a type'],
      enum: ['medication', 'appointment', 'activity'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    // Fields specific to medication reminders
    medicationDetails: {
      name: String,
      frequency: {
        type: String,
        enum: ['Daily', 'Weekly'],
      },
    },
    // Fields specific to appointment reminders
    appointmentDetails: {
      datetime: String, // ISO date string
      location: String,
    },
    // Fields specific to activity reminders
    activityDetails: {
      task: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create indexes for efficient querying
reminderSchema.index({ user: 1, time: 1 });
reminderSchema.index({ type: 1 });

// Virtual property to format the time for display
reminderSchema.virtual('formattedTime').get(function() {
  if (!this.time) return '';
  
  // Convert 24-hour format to 12-hour format with AM/PM
  const [hours, minutes] = this.time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `${formattedHour}:${minutes} ${period}`;
});

// Static method to get upcoming reminders for a user
reminderSchema.statics.getUpcomingReminders = function(userId) {
  // In a real MongoDB implementation, this would query the database
  // For now, we'll return a mock implementation
  return this.find({ user: userId, completed: false });
};

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;