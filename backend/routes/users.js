const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('favorites', 'title location price images type');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching user profile',
      code: 'PROFILE_FETCH_ERROR'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const {
      name,
      phone,
      profile: {
        bio,
        dateOfBirth,
        gender,
        occupation,
        location,
        emergencyContact,
        preferences
      } = {}
    } = req.body;

    const user = await User.findById(req.user.id);

    // Update basic info
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Update profile fields
    if (bio) user.profile.bio = bio;
    if (dateOfBirth) user.profile.dateOfBirth = dateOfBirth;
    if (gender) user.profile.gender = gender;
    if (occupation) user.profile.occupation = occupation;
    if (location) user.profile.location = { ...user.profile.location, ...location };
    if (emergencyContact) user.profile.emergencyContact = { ...user.profile.emergencyContact, ...emergencyContact };
    if (preferences) user.profile.preferences = { ...user.profile.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error updating profile',
      code: 'PROFILE_UPDATE_ERROR'
    });
  }
});

// @desc    Upload profile avatar
// @route   POST /api/v1/users/avatar
// @access  Private
router.post('/avatar', protect, async (req, res) => {
  try {
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({
        success: false,
        error: 'Avatar URL is required',
        code: 'AVATAR_URL_REQUIRED'
      });
    }

    const user = await User.findById(req.user.id);
    user.profile.avatar = avatarUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: user.profile.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error updating avatar',
      code: 'AVATAR_UPDATE_ERROR'
    });
  }
});

// @desc    Get user favorites
// @route   GET /api/v1/users/favorites
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favorites',
        match: { status: 'approved' },
        populate: {
          path: 'owner',
          select: 'name profile.avatar'
        }
      });

    res.json({
      success: true,
      count: user.favorites.length,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching favorites',
      code: 'FAVORITES_FETCH_ERROR'
    });
  }
});

// @desc    Add property to favorites
// @route   POST /api/v1/users/favorites/:propertyId
// @access  Private
router.post('/favorites/:propertyId', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    const user = await User.findById(req.user.id);

    if (user.favorites.includes(req.params.propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Property already in favorites',
        code: 'ALREADY_IN_FAVORITES'
      });
    }

    user.favorites.push(req.params.propertyId);
    await user.save();

    res.json({
      success: true,
      message: 'Property added to favorites',
      data: {
        propertyId: req.params.propertyId,
        favoritesCount: user.favorites.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error adding to favorites',
      code: 'ADD_FAVORITE_ERROR'
    });
  }
});

// @desc    Remove property from favorites
// @route   DELETE /api/v1/users/favorites/:propertyId
// @access  Private
router.delete('/favorites/:propertyId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(req.params.propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Property not in favorites',
        code: 'NOT_IN_FAVORITES'
      });
    }

    user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.propertyId);
    await user.save();

    res.json({
      success: true,
      message: 'Property removed from favorites',
      data: {
        propertyId: req.params.propertyId,
        favoritesCount: user.favorites.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error removing from favorites',
      code: 'REMOVE_FAVORITE_ERROR'
    });
  }
});

// @desc    Get user dashboard data
// @route   GET /api/v1/users/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's booking statistics
    const bookingStats = await Booking.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find({ user: userId })
      .sort('-createdAt')
      .limit(5)
      .populate('property', 'title location images price type');

    // Get user's properties if they are an owner
    let userProperties = [];
    if (req.user.role === 'owner') {
      userProperties = await Property.find({ owner: userId })
        .sort('-createdAt')
        .limit(5);
    }

    // Get favorites count
    const user = await User.findById(userId).select('favorites');
    const favoritesCount = user.favorites.length;

    res.json({
      success: true,
      data: {
        bookingStats,
        recentBookings,
        userProperties,
        favoritesCount,
        userRole: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching dashboard data',
      code: 'DASHBOARD_FETCH_ERROR'
    });
  }
});

// @desc    Get user notifications
// @route   GET /api/v1/users/notifications
// @access  Private
router.get('/notifications', protect, async (req, res) => {
  try {
    // This would typically come from a notifications collection
    // For now, we'll return mock notifications based on user activity
    const notifications = [
      {
        id: 1,
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: 'Your booking for Modern Apartment in Bole has been confirmed',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 2,
        type: 'payment_successful',
        title: 'Payment Successful',
        message: 'Payment of ETB 25,000 has been processed successfully',
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: 3,
        type: 'property_available',
        title: 'New Property Available',
        message: 'Check out this new luxury penthouse in Kazanchis area',
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];

    res.json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.read).length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching notifications',
      code: 'NOTIFICATIONS_FETCH_ERROR'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/v1/users/notifications/:id/read
// @access  Private
router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    // In a real implementation, you would update the notification in the database
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error marking notification as read',
      code: 'NOTIFICATION_READ_ERROR'
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/v1/users/account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      user: userId,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete account with active bookings',
        code: 'ACTIVE_BOOKINGS_EXIST'
      });
    }

    // If user is an owner, check for active properties
    if (req.user.role === 'owner') {
      const activeProperties = await Property.countDocuments({
        owner: userId,
        status: 'approved'
      });

      if (activeProperties > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete account with active properties',
          code: 'ACTIVE_PROPERTIES_EXIST'
        });
      }
    }

    // Soft delete - deactivate account instead of hard delete
    await User.findByIdAndUpdate(userId, {
      isActive: false,
      deactivatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error deleting account',
      code: 'ACCOUNT_DELETE_ERROR'
    });
  }
});

module.exports = router;