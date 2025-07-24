const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Mood must belong to a user']
    },
    mood: {
      type: String,
      required: [true, 'Mood is required'],
      enum: {
        values: ['Happy', 'Okay', 'Sad', 'Worried'],
        message: 'Mood must be one of: Happy, Okay, Sad, Worried'
      }
    },
    notes: {
      type: String,
      trim: true
    },
    aiResponse: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for efficient querying by user and date
moodSchema.index({ user: 1, date: -1 });

// Static method to get mood stats for a user
moodSchema.statics.getMoodStats = async function(userId) {
  return await this.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 },
        latestDate: { $max: '$date' }
      }
    },
    {
      $sort: { latestDate: -1 }
    }
  ]);
};

// Static method to get mood trends over time
moodSchema.statics.getMoodTrends = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' }
        },
        moods: { $push: '$mood' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

const Mood = mongoose.model('Mood', moodSchema);

module.exports = Mood;