const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');

// Create mock JWT token
const signToken = id => {
  // Using a simple string as token for development
  return `mock-jwt-token-${id}-${Date.now()}`;
};

// Send JWT token in response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Register new user with mock functionality
exports.signup = async (req, res, next) => {
  try {
    // Create a mock user without database interaction
    const newUser = {
      _id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: 'hashed_password', // In a real app, this would be hashed
      role: req.body.role || 'user'
    };

    console.log('Mock user created:', newUser);
    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

// Login user with mock functionality
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // For development, accept any credentials
    const mockUser = {
      _id: Date.now().toString(),
      name: 'Mock User',
      email: email,
      role: 'user'
    };

    console.log('Mock login successful for:', email);
    // If everything ok, send token to client
    createSendToken(mockUser, 200, res);
  } catch (err) {
    next(err);
  }
};

// Protect routes - mock middleware that always passes authentication
exports.protect = async (req, res, next) => {
  try {
    // For development, we'll bypass token verification
    // and set a mock user in the request
    req.user = {
      id: '123456789',
      name: 'Mock User',
      email: 'mock@example.com',
      role: 'user'
    };
    
    console.log('Mock authentication successful');
    next();
    
    // The following code is commented out as it references undefined variables
    // and causes errors in the mock environment
    /*
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password. Please log in again.'
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
    */
  } catch (err) {
    next(err);
  }
};

// Restrict to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};