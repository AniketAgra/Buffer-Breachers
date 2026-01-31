import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { config } from '../config/env.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, preferences, role, agentDetails } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered',
    });
  }
  
  // Validate role if provided
  const userRole = role && ['CLIENT', 'AGENT'].includes(role) ? role : 'CLIENT';
  
  // Prepare user data
  const userData = {
    name,
    email,
    password,
    phone,
    role: userRole,
  };
  
  // Add preferences for clients
  if (userRole === 'CLIENT') {
    userData.preferences = preferences;
  }
  
  // Add agent details for agents
  if (userRole === 'AGENT' && agentDetails) {
    userData.agentDetails = {
      license: agentDetails.license,
      specialization: agentDetails.specialization || [],
      clients: [],
    };
  }
  
  // Create new user
  const user = await User.create(userData);
  
  // Generate token
  const token = generateToken(user._id);
  
  res.status(201).json({
    success: true,
    message: `${userRole === 'AGENT' ? 'Agent' : 'User'} registered successfully`,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferences: user.preferences,
        agentDetails: user.agentDetails,
      },
      token,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }
  
  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }
  
  // Generate token
  const token = generateToken(user._id);
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferences: user.preferences,
        agentDetails: user.agentDetails,
      },
      token,
    },
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferences: user.preferences,
        agentDetails: user.agentDetails,
        createdAt: user.createdAt,
      },
    },
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, preferences } = req.body;
  
  const user = await User.findById(req.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  
  // Update fields
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (preferences) {
    user.preferences = {
      ...user.preferences,
      ...preferences,
    };
  }
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        preferences: user.preferences,
        agentDetails: user.agentDetail
        phone: user.phone,
        preferences: user.preferences,
      },
    },
  });
});
