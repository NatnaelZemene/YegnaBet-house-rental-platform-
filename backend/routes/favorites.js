const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @desc    Get user's favorite properties
// @route   GET /api/v1/favorites
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Find user and populate favorite properties
    const user = await User.findById(req.user.id).populate('favoriteProperties');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Get detailed property information
    const favoriteProperties = await Property.find({
      _id: { $in: user.favoriteProperties }
    }).populate('owner', 'firstName lastName email phone');

    res.json({
      success: true,
      count: favoriteProperties.length,
      data: favoriteProperties
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching favorite properties',
      code: 'FAVORITES_FETCH_ERROR'
    });
  }
});

// @desc    Add property to favorites
// @route   POST /api/v1/favorites/:propertyId
// @access  Private
router.post('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if already in favorites
    if (user.favoriteProperties.includes(propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Property already in favorites',
        code: 'ALREADY_FAVORITED'
      });
    }

    // Add to favorites
    user.favoriteProperties.push(propertyId);
    await user.save();

    // Update property stats
    property.stats.totalLikes = (property.stats.totalLikes || 0) + 1;
    property.stats.likedBy.push({
      user: req.user.id,
      userType: 'User',
      likedAt: new Date()
    });
    await property.save();

    res.json({
      success: true,
      message: 'Property added to favorites successfully'
    });

  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      error: 'Server error adding property to favorites',
      code: 'ADD_FAVORITE_ERROR'
    });
  }
});

// @desc    Remove property from favorites
// @route   DELETE /api/v1/favorites/:propertyId
// @access  Private
router.delete('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if property is in favorites
    if (!user.favoriteProperties.includes(propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Property not in favorites',
        code: 'NOT_FAVORITED'
      });
    }

    // Remove from favorites
    user.favoriteProperties = user.favoriteProperties.filter(
      id => id.toString() !== propertyId
    );
    await user.save();

    // Update property stats
    const property = await Property.findById(propertyId);
    if (property) {
      property.stats.totalLikes = Math.max((property.stats.totalLikes || 1) - 1, 0);
      property.stats.likedBy = property.stats.likedBy.filter(
        like => like.user.toString() !== req.user.id
      );
      await property.save();
    }

    res.json({
      success: true,
      message: 'Property removed from favorites successfully'
    });

  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      error: 'Server error removing property from favorites',
      code: 'REMOVE_FAVORITE_ERROR'
    });
  }
});

// @desc    Check if property is favorited
// @route   GET /api/v1/favorites/check/:propertyId
// @access  Private
router.get('/check/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const isFavorited = user.favoriteProperties.includes(propertyId);

    res.json({
      success: true,
      data: {
        isFavorited,
        propertyId
      }
    });

  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({
      success: false,
      error: 'Server error checking favorite status',
      code: 'CHECK_FAVORITE_ERROR'
    });
  }
});

// @desc    Get property likes analytics (for owners)
// @route   GET /api/v1/favorites/analytics/:propertyId
// @access  Private
router.get('/analytics/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    // Check if user is the owner of this property
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only view analytics for your own properties.',
        code: 'ACCESS_DENIED'
      });
    }

    const analytics = {
      totalLikes: property.stats.totalLikes || 0,
      likedBy: property.stats.likedBy || [],
      recentLikes: (property.stats.likedBy || [])
        .sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt))
        .slice(0, 10)
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching property analytics',
      code: 'ANALYTICS_FETCH_ERROR'
    });
  }
});

module.exports = router;