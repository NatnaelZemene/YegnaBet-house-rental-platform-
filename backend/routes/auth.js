const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  handleValidationErrors 
} = require('../middleware/validation');

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register user or owner
// @route   POST /api/v1/auth/register
// @access  Public
router.post('/register', validateUserRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, name, email, password, phone, role = 'user' } = req.body;

    // Use firstName + lastName if provided, otherwise split name
    let userFirstName, userLastName;
    
    if (firstName && lastName) {
      userFirstName = firstName;
      userLastName = lastName;
    } else if (name) {
      const nameParts = name.trim().split(' ');
      userFirstName = nameParts[0];
      userLastName = nameParts.slice(1).join(' ') || nameParts[0];
    } else {
      return res.status(400).json({
        success: false,
        error: 'Either firstName and lastName, or name is required',
        code: 'NAME_REQUIRED'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Create user with role
    const userData = {
      firstName: userFirstName,
      lastName: userLastName,
      email,
      password, // Will be hashed by pre-save middleware
      phone,
      role: role, // 'user', 'owner', or 'admin'
      profile: {
        bio: '',
        avatar: '',
        preferences: {
          language: 'en',
          currency: 'ETB',
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        }
      }
    };

    const newUser = await User.create(userData);
    const token = newUser.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: `${role === 'owner' ? 'Property Owner' : 'User'} registered successfully`,
      token,
      data: {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          name: `${newUser.firstName} ${newUser.lastName}`,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          isVerified: newUser.isEmailVerified,
          status: newUser.status,
          accountType: role === 'owner' ? 'Property Owner' : 'User',
          createdAt: newUser.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// @desc    Login user or owner
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', validateUserLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email (check all roles)
    let user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    user.stats.lastLogin = new Date();
    await user.save();

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isEmailVerified,
          status: user.status,
          accountType: user.role === 'owner' ? 'Property Owner' : user.role === 'admin' ? 'Administrator' : 'User',
          createdAt: user.createdAt,
          lastLogin: user.stats.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login',
      code: 'LOGIN_ERROR'
    });
  }
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    // Find user by ID from token
    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isEmailVerified,
          status: user.status,
          address: user.address,
          accountType: user.role === 'owner' ? 'Property Owner' : user.role === 'admin' ? 'Administrator' : 'User',
          profile: user.profile,
          createdAt: user.createdAt,
          lastLogin: user.stats.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching user data',
      code: 'USER_FETCH_ERROR'
    });
  }
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during logout',
      code: 'LOGOUT_ERROR'
    });
  }
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found with this email',
        code: 'USER_NOT_FOUND'
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // For now, just return success (email functionality can be added later)
    res.json({
      success: true,
      message: 'Password reset token generated',
      resetToken // In production, this should be sent via email
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error processing forgot password request',
      code: 'FORGOT_PASSWORD_ERROR'
    });
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resettoken
// @access  Public
router.put('/reset-password/:resettoken', async (req, res) => {
  try {
    const { password } = req.body;

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
        code: 'INVALID_RESET_TOKEN'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      message: 'Password reset successful',
      token
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error resetting password',
      code: 'RESET_PASSWORD_ERROR'
    });
  }
});

module.exports = router;