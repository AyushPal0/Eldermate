const Mood = require('../models/moodModel');

// Create a new mood entry with mock functionality
exports.createMood = async (req, res, next) => {
  try {
    // Add user ID from protected route
    req.body.user = req.user.id;
    
    // Create a mock mood entry
    const newMood = {
      _id: Date.now().toString(),
      user: req.user.id,
      mood: req.body.mood,
      notes: req.body.notes || '',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Generate AI response based on mood
    let aiResponse = '';
    
    switch(newMood.mood) {
      case 'Happy':
        aiResponse = "It's wonderful to hear you're feeling happy! What's been the highlight of your day so far?";
        break;
      case 'Okay':
        aiResponse = "You're doing okay today. Remember that it's fine to have neutral days. Is there anything specific on your mind?";
        break;
      case 'Sad':
        aiResponse = "I'm sorry to hear you're feeling sad. Would you like to talk about what's troubling you? Sometimes sharing can help lighten the burden.";
        break;
      case 'Worried':
        aiResponse = "I notice you're feeling worried. Taking deep breaths can help in the moment. Would you like to discuss what's causing your concern?";
        break;
      default:
        aiResponse = "Thank you for sharing how you're feeling. Is there anything specific you'd like to talk about?";
    }
    
    // Add AI response to the mood entry
    newMood.aiResponse = aiResponse;
    
    // Store in mock database
    console.log('Mock mood created:', newMood);
    
    res.status(201).json({
      status: 'success',
      data: {
        mood: newMood
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get all mood entries for the current user with mock functionality
exports.getAllMoods = async (req, res, next) => {
  try {
    // Return empty array for mock implementation
    const moods = [];
    
    console.log('Mock getAllMoods called for user:', req.user.id);
    
    res.status(200).json({
      status: 'success',
      results: moods.length,
      data: {
        moods
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get a single mood entry with mock functionality
exports.getMood = async (req, res, next) => {
  try {
    console.log('Mock getMood called for ID:', req.params.id);
    
    // Return 404 for mock implementation
    return res.status(404).json({
      status: 'fail',
      message: 'No mood found with that ID'
    });
  } catch (err) {
    next(err);
  }
};

// Update a mood entry
exports.updateMood = async (req, res, next) => {
  try {
    const mood = await Mood.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!mood) {
      return res.status(404).json({
        status: 'fail',
        message: 'No mood found with that ID'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        mood
      }
    });
  } catch (err) {
    next(err);
  }
};

// Delete a mood entry
exports.deleteMood = async (req, res, next) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!mood) {
      return res.status(404).json({
        status: 'fail',
        message: 'No mood found with that ID'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

// Get mood statistics
exports.getMoodStats = async (req, res, next) => {
  try {
    const stats = await Mood.getMoodStats(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get mood trends
exports.getMoodTrends = async (req, res, next) => {
  try {
    const days = req.query.days * 1 || 30;
    const trends = await Mood.getMoodTrends(req.user.id, days);
    
    res.status(200).json({
      status: 'success',
      data: {
        trends
      }
    });
  } catch (err) {
    next(err);
  }
};