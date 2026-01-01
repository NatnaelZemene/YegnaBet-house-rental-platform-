const express = require('express');
const Property = require('../models/Property');
const User = require('../models/User');

const router = express.Router();

// @desc    Get all properties for debugging (with full details)
// @route   GET /api/v1/debug/properties
// @access  Public (for development only)
router.get('/properties', async (req, res) => {
  try {
    const { realOnly, createdAfter } = req.query;
    
    let filter = {};
    
    // Filter for real properties only (not seed data)
    if (realOnly === 'true' || createdAfter) {
      const filterDate = createdAfter ? new Date(createdAfter) : new Date('2025-12-25T00:00:00.000Z');
      filter.createdAt = { $gte: filterDate };
    }

    const properties = await Property.find(filter)
      .populate('owner', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    const response = {
      success: true,
      count: properties.length,
      filter: realOnly === 'true' ? 'Real properties only (no seed data)' : 'All properties',
      data: properties.map(property => ({
        id: property._id,
        title: property.title,
        description: property.description,
        propertyType: property.propertyType,
        status: property.status,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        floor: property.floor,
        totalFloors: property.totalFloors,
        pricing: property.pricing,
        location: property.location,
        amenities: property.amenities,
        images: property.images,
        features: property.features,
        availability: property.availability,
        owner: property.owner,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching properties',
      details: error.message
    });
  }
});

// @desc    Get property by ID with full details
// @route   GET /api/v1/debug/properties/:id
// @access  Public (for development only)
router.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: property._id,
        title: property.title,
        description: property.description,
        propertyType: property.propertyType,
        status: property.status,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        pricing: property.pricing,
        location: property.location,
        amenities: property.amenities,
        images: property.images,
        features: property.features,
        availability: property.availability,
        owner: property.owner,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
        // Raw MongoDB document
        rawDocument: property.toObject()
      }
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching property',
      details: error.message
    });
  }
});

// @desc    Get database statistics
// @route   GET /api/v1/debug/stats
// @access  Public (for development only)
router.get('/stats', async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOwners = await User.countDocuments({ role: 'owner' });

    const propertyStats = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const subcityStats = await Property.aggregate([
      { $group: { _id: '$location.subcity', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const propertiesWithImages = await Property.countDocuments({
      images: { $exists: true, $ne: [] }
    });

    res.json({
      success: true,
      data: {
        totals: {
          properties: totalProperties,
          users: totalUsers,
          owners: totalOwners,
          propertiesWithImages
        },
        propertyByStatus: propertyStats,
        propertyBySubcity: subcityStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching statistics',
      details: error.message
    });
  }
});

module.exports = router;