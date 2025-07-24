const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Import routes
const moodRoutes = require('./routes/moodRoutes');
const userRoutes = require('./routes/userRoutes');

// Mount routes
app.use('/api/moods', moodRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Eldermate API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong!'
  });
});

// Temporarily bypass MongoDB connection for development
console.log('MongoDB connection bypassed for development');

// Mock the mongoose model functionality
const mockDB = {
  users: [],
  moods: []
};

// Override mongoose models with mock implementations
mongoose.model = function(modelName) {
  console.log(`Mock model created for: ${modelName}`);
  return {
    create: function(data) {
      const newItem = { ...data, _id: Date.now().toString() };
      if (modelName.toLowerCase() === 'user') {
        mockDB.users.push(newItem);
      } else if (modelName.toLowerCase() === 'mood') {
        mockDB.moods.push(newItem);
      }
      return Promise.resolve(newItem);
    },
    find: function() {
      return {
        sort: () => Promise.resolve(modelName.toLowerCase() === 'user' ? mockDB.users : mockDB.moods)
      };
    },
    findOne: function() {
      return Promise.resolve(null);
    },
    findById: function() {
      return Promise.resolve(null);
    },
    findOneAndUpdate: function() {
      return Promise.resolve(null);
    },
    findOneAndDelete: function() {
      return Promise.resolve(null);
    }
  };
};

console.log('Mock database initialized');

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});