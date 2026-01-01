const express = require('express');
const Property = require('../models/Property');
const User = require('../models/User');
const { protect, authorize, isOwnerOrAdmin } = require('../middleware/auth');
const { validateProperty, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all properties with filtering, sorting, and pagination
// @route   GET /api/v1/properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Fetching all properties...');
    
    let query = Property.find({ status: 'approved' });

    // Filtering
    const {
      area,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      amenities,
      search,
      featured,
      available
    } = req.query;

    // Build filter object
    let filter = { status: 'approved' };

    if (area) {
      filter['location.subcity'] = { $in: area.split(',') };
    }

    if (type) {
      filter.propertyType = { $in: type.split(',') };
    }

    if (minPrice || maxPrice) {
      filter['pricing.monthly'] = {};
      if (minPrice) filter['pricing.monthly'].$gte = parseInt(minPrice);
      if (maxPrice) filter['pricing.monthly'].$lte = parseInt(maxPrice);
    }

    if (bedrooms) {
      filter.bedrooms = { $gte: parseInt(bedrooms) };
    }

    if (bathrooms) {
      filter.bathrooms = { $gte: parseInt(bathrooms) };
    }

    if (amenities) {
      filter.amenities = { $in: amenities.split(',') };
    }

    if (featured === 'true') {
      filter['stats.featured'] = true;
    }

    if (available === 'true') {
      filter['availability.isAvailable'] = true;
    }

    // Text search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.subcity': { $regex: search, $options: 'i' } }
      ];
    }

    query = query.find(filter);

    // Sorting
    const sortBy = req.query.sort || '-createdAt';
    query = query.sort(sortBy);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    // Populate owner information
    query = query.populate('owner', 'firstName lastName email phone profile.avatar');

    const properties = await query;
    
    console.log(`✅ Found ${properties.length} properties (total: ${total})`);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.json({
      success: true,
      count: properties.length,
      total,
      pagination,
      data: properties
    });
  } catch (error) {
    console.error('Properties fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching properties',
      code: 'PROPERTIES_FETCH_ERROR'
    });
  }
});

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone profile');

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    // Increment view count
    property.stats.views += 1;
    await property.save();

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Property fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching property',
      code: 'PROPERTY_FETCH_ERROR'
    });
  }
});

// @desc    Create new property
// @route   POST /api/v1/properties
// @access  Private (Owner/Admin)
router.post('/', protect, authorize('owner', 'admin'), validateProperty, handleValidationErrors, async (req, res) => {
  try {
    console.log('🏠 Creating property with data:', JSON.stringify(req.body, null, 2));
    
    // Add owner to property
    req.body.owner = req.user.id;
    
    // Properties start as pending and need admin approval
    req.body.status = 'pending';

    const property = await Property.create(req.body);

    console.log('✅ Property created successfully:', property._id);

    res.status(201).json({
      success: true,
      message: 'Property submitted successfully! It will be visible after admin approval.',
      data: property
    });
  } catch (error) {
    console.error('❌ Property creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating property',
      code: 'PROPERTY_CREATE_ERROR',
      details: error.message
    });
  }
});

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private (Owner of property or Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    // Check if user is owner of property or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this property',
        code: 'NOT_AUTHORIZED'
      });
    }

    // If property is being updated by owner, set status back to pending
    if (req.user.role !== 'admin' && property.status === 'approved') {
      req.body.status = 'pending';
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error updating property',
      code: 'PROPERTY_UPDATE_ERROR'
    });
  }
});

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private (Owner of property or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    // Check if user is owner of property or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this property',
        code: 'NOT_AUTHORIZED'
      });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error deleting property',
      code: 'PROPERTY_DELETE_ERROR'
    });
  }
});

// @desc    Get properties by owner
// @route   GET /api/v1/properties/owner/my-properties
// @access  Private (Owner/Admin)
router.get('/owner/my-properties', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id })
      .sort('-createdAt')
      .populate('reviews');

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching owner properties',
      code: 'OWNER_PROPERTIES_FETCH_ERROR'
    });
  }
});

// @desc    Get featured properties
// @route   GET /api/v1/properties/featured
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    console.log('🔍 Fetching featured properties...');
    
    // First try to get featured properties
    let properties = await Property.find({ 
      'stats.featured': true, 
      status: 'approved',
      'availability.isAvailable': true
    })
      .limit(6)
      .sort('-createdAt')
      .populate('owner', 'firstName lastName profile.avatar');

    console.log(`Found ${properties.length} featured properties`);

    // If no featured properties, get the latest approved properties
    if (properties.length === 0) {
      console.log('No featured properties found, getting latest approved properties...');
      properties = await Property.find({ 
        status: 'approved',
        'availability.isAvailable': true
      })
        .limit(6)
        .sort('-createdAt')
        .populate('owner', 'firstName lastName profile.avatar');
      
      console.log(`Found ${properties.length} approved properties`);
    }

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Featured properties error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching featured properties',
      code: 'FEATURED_PROPERTIES_FETCH_ERROR'
    });
  }
});

// @desc    Get properties by area
// @route   GET /api/v1/properties/area/:area
// @access  Public
router.get('/area/:area', async (req, res) => {
  try {
    const { area } = req.params;
    const validAreas = ['Bole', 'Kazanchis', 'Piazza', 'CMC', 'Old Airport', 'Megenagna', 'Gerji', 'Sarbet'];
    
    if (!validAreas.includes(area)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid area specified',
        code: 'INVALID_AREA'
      });
    }

    const properties = await Property.find({ 
      'location.area': area,
      status: 'approved'
    })
      .sort('-createdAt')
      .populate('owner', 'firstName lastName profile.avatar');

    res.json({
      success: true,
      count: properties.length,
      area,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching properties by area',
      code: 'AREA_PROPERTIES_FETCH_ERROR'
    });
  }
});

// @desc    Toggle property favorite
// @route   PUT /api/v1/properties/:id/favorite
// @access  Private
router.put('/:id/favorite', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    const user = await User.findById(req.user.id);
    const isFavorite = user.favorites.includes(req.params.id);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.id);
    } else {
      // Add to favorites
      user.favorites.push(req.params.id);
    }

    await user.save();

    res.json({
      success: true,
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      isFavorite: !isFavorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error toggling favorite',
      code: 'FAVORITE_TOGGLE_ERROR'
    });
  }
});

// @desc    Get property statistics
// @route   GET /api/v1/properties/stats/overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments({ status: 'approved' });
    const availableProperties = await Property.countDocuments({ 
      status: 'approved',
      'availability.status': 'available'
    });
    
    const areaStats = await Property.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$location.area', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const typeStats = await Property.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const priceStats = await Property.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalProperties,
        availableProperties,
        occupancyRate: ((totalProperties - availableProperties) / totalProperties * 100).toFixed(1),
        areaStats,
        typeStats,
        priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching property statistics',
      code: 'PROPERTY_STATS_ERROR'
    });
  }
});

module.exports = router;