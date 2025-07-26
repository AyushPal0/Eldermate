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
const reminderRoutes = require('./routes/reminderRoutes');

// Mount routes
app.use('/api/moods', moodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reminders', reminderRoutes);

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
  moods: [],
  reminders: []
};

// Override mongoose models with mock implementations
mongoose.model = function(modelName) {
  console.log(`Mock model created for: ${modelName}`);
  
  // Helper to get the collection based on model name
  const getCollection = () => {
    const name = modelName.toLowerCase();
    if (name === 'user') return mockDB.users;
    if (name === 'mood') return mockDB.moods;
    if (name === 'reminder') return mockDB.reminders;
    return [];
  };
  
  return {
    create: function(data) {
      const newItem = { ...data, _id: Date.now().toString() };
      getCollection().push(newItem);
      return Promise.resolve(newItem);
    },
    find: function(query = {}) {
      const collection = getCollection();
      let results = [...collection];
      
      // Apply filters if query is provided
      if (query && Object.keys(query).length > 0) {
        results = results.filter(item => {
          return Object.entries(query).every(([key, value]) => {
            return item[key] === value;
          });
        });
      }
      
      return {
        sort: () => Promise.resolve(results)
      };
    },
    findOne: function(query = {}) {
      const collection = getCollection();
      const item = collection.find(item => {
        return Object.entries(query).every(([key, value]) => {
          return item[key] === value;
        });
      });
      return Promise.resolve(item || null);
    },
    findById: function(id) {
      const collection = getCollection();
      const item = collection.find(item => item._id === id);
      return Promise.resolve(item || null);
    },
    findByIdAndUpdate: function(id, updateData, options = {}) {
      const collection = getCollection();
      const index = collection.findIndex(item => item._id === id);
      
      if (index === -1) return Promise.resolve(null);
      
      const updatedItem = { ...collection[index], ...updateData };
      collection[index] = updatedItem;
      
      return Promise.resolve(options.new ? updatedItem : collection[index]);
    },
    findByIdAndDelete: function(id) {
      const collection = getCollection();
      const index = collection.findIndex(item => item._id === id);
      
      if (index === -1) return Promise.resolve(null);
      
      const deletedItem = collection[index];
      collection.splice(index, 1);
      
      return Promise.resolve(deletedItem);
    }
  };
};

console.log('Mock database initialized');

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});