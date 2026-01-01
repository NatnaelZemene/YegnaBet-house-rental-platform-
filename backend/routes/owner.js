const express = require('express');
const mongoose = require('mongoose');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require owner authentication
router.use(protect);
router.use(authorize('owner', 'admin'));

// @desc    Get owner dashboard statistics
// @route   GET /api/v1/owner/dashboard
// @access  Private (Owner only)
router.get('/dashboard', async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.id);

    // Get all properties owned by the user
    const properties = await Property.find({ owner: ownerId });
    const propertyIds = properties.map(p => p._id);

    // Basic counts
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === 'approved').length;
    const pendingProperties = properties.filter(p => p.status === 'pending').length;

    // Booking statistics
    const totalBookings = await Booking.countDocuments({ 
      property: { $in: propertyIds } 
    });
    
    const pendingRequests = await Booking.countDocuments({ 
      property: { $in: propertyIds },
      status: 'pending'
    });
    
    const confirmedBookings = await Booking.countDocuments({ 
      property: { $in: propertyIds },
      status: 'confirmed'
    });

    const completedBookings = await Booking.countDocuments({ 
      property: { $in: propertyIds },
      status: 'completed'
    });

    // Revenue calculations
    const revenueStats = await Booking.aggregate([
      { 
        $match: { 
          property: { $in: propertyIds },
          status: { $in: ['confirmed', 'completed'] },
          paymentStatus: 'paid'
        } 
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageBookingValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;
    const averageBookingValue = revenueStats.length > 0 ? revenueStats[0].averageBookingValue : 0;

    // Monthly revenue (current month)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Booking.aggregate([
      { 
        $match: { 
          property: { $in: propertyIds },
          status: { $in: ['confirmed', 'completed'] },
          paymentStatus: 'paid',
          createdAt: { $gte: currentMonth }
        } 
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$totalAmount' },
          monthlyBookings: { $sum: 1 }
        }
      }
    ]);

    const thisMonthRevenue = monthlyRevenue.length > 0 ? monthlyRevenue[0].monthlyRevenue : 0;
    const thisMonthBookings = monthlyRevenue.length > 0 ? monthlyRevenue[0].monthlyBookings : 0;

    // Occupancy rate calculation
    const occupiedProperties = await Booking.countDocuments({
      property: { $in: propertyIds },
      status: 'confirmed',
      checkIn: { $lte: new Date() },
      checkOut: { $gte: new Date() }
    });

    const occupancyRate = activeProperties > 0 ? Math.round((occupiedProperties / activeProperties) * 100) : 0;

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentBookings = thisMonthBookings;
    const newProperties = await Property.countDocuments({
      owner: ownerId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Property performance
    const propertyPerformance = await Property.aggregate([
      { $match: { owner: ownerId } },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'property',
          as: 'bookings'
        }
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'property',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          totalBookings: { $size: '$bookings' },
          totalRevenue: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$bookings',
                    cond: { 
                      $and: [
                        { $in: ['$$this.status', ['confirmed', 'completed']] },
                        { $eq: ['$$this.paymentStatus', 'paid'] }
                      ]
                    }
                  }
                },
                as: 'booking',
                in: '$$booking.totalAmount'
              }
            }
          },
          averageRating: { $avg: '$reviews.rating.overall' },
          totalReviews: { $size: '$reviews' }
        }
      },
      {
        $project: {
          title: 1,
          location: 1,
          pricing: 1,
          status: 1,
          images: 1,
          totalBookings: 1,
          totalRevenue: 1,
          averageRating: { $ifNull: ['$averageRating', 0] },
          totalReviews: 1,
          createdAt: 1
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProperties,
          activeProperties,
          pendingProperties,
          totalBookings,
          pendingRequests,
          confirmedBookings,
          completedBookings,
          totalRevenue,
          thisMonthRevenue,
          thisMonthBookings,
          occupancyRate,
          averageBookingValue,
          recentBookings,
          newProperties
        },
        propertyPerformance: propertyPerformance.slice(0, 10) // Top 10 performing properties
      }
    });

  } catch (error) {
    console.error('Error fetching owner dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching owner dashboard data',
      code: 'OWNER_DASHBOARD_FETCH_ERROR'
    });
  }
});

// @desc    Get owner's properties with detailed stats
// @route   GET /api/v1/owner/properties
// @access  Private (Owner only)
router.get('/properties', async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.id);
    const { status, page = 1, limit = 10, search } = req.query;

    let filter = { owner: ownerId };

    if (status) {
      filter.status = { $in: status.split(',') };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.subcity': { $regex: search, $options: 'i' } }
      ];
    }

    const startIndex = (page - 1) * limit;
    const total = await Property.countDocuments(filter);

    const properties = await Property.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'property',
          as: 'bookings'
        }
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'property',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          totalBookings: { $size: '$bookings' },
          totalRevenue: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$bookings',
                    cond: { 
                      $and: [
                        { $in: ['$$this.status', ['confirmed', 'completed']] },
                        { $eq: ['$$this.paymentStatus', 'paid'] }
                      ]
                    }
                  }
                },
                as: 'booking',
                in: '$$booking.totalAmount'
              }
            }
          },
          averageRating: { $avg: '$reviews.rating.overall' },
          totalReviews: { $size: '$reviews' },
          currentTenant: {
            $let: {
              vars: {
                currentBooking: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$bookings',
                        cond: {
                          $and: [
                            { $eq: ['$$this.status', 'confirmed'] },
                            { $lte: ['$$this.checkIn', new Date()] },
                            { $gte: ['$$this.checkOut', new Date()] }
                          ]
                        }
                      }
                    },
                    0
                  ]
                }
              },
              in: '$$currentBooking.user'
            }
          },
          occupancyStatus: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$bookings',
                        cond: {
                          $and: [
                            { $eq: ['$$this.status', 'confirmed'] },
                            { $lte: ['$$this.checkIn', new Date()] },
                            { $gte: ['$$this.checkOut', new Date()] }
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              },
              then: 'occupied',
              else: 'vacant'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'currentTenant',
          foreignField: '_id',
          as: 'tenantInfo'
        }
      },
      {
        $addFields: {
          tenant: {
            $cond: {
              if: { $gt: [{ $size: '$tenantInfo' }, 0] },
              then: {
                $let: {
                  vars: { tenant: { $arrayElemAt: ['$tenantInfo', 0] } },
                  in: {
                    name: { $concat: ['$$tenant.firstName', ' ', '$$tenant.lastName'] },
                    email: '$$tenant.email',
                    phone: '$$tenant.phone'
                  }
                }
              },
              else: null
            }
          }
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          propertyType: 1,
          bedrooms: 1,
          bathrooms: 1,
          area: 1,
          location: 1,
          pricing: 1,
          images: 1,
          amenities: 1,
          status: 1,
          availability: 1,
          totalBookings: 1,
          totalRevenue: 1,
          averageRating: { $ifNull: ['$averageRating', 0] },
          totalReviews: 1,
          occupancyStatus: 1,
          tenant: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: startIndex },
      { $limit: parseInt(limit) }
    ]);

    // Pagination
    const pagination = {};
    const endIndex = page * limit;

    if (endIndex < total) {
      pagination.next = {
        page: parseInt(page) + 1,
        limit: parseInt(limit)
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: parseInt(page) - 1,
        limit: parseInt(limit)
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
    console.error('Error fetching owner properties:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching owner properties',
      code: 'OWNER_PROPERTIES_FETCH_ERROR'
    });
  }
});

// @desc    Get owner's bookings with detailed information
// @route   GET /api/v1/owner/bookings
// @access  Private (Owner only)
router.get('/bookings', async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { status, page = 1, limit = 10, property } = req.query;

    // Get all properties owned by the user
    let propertyFilter = { owner: ownerId };
    if (property) {
      propertyFilter._id = property;
    }

    const properties = await Property.find(propertyFilter).select('_id');
    const propertyIds = properties.map(p => p._id);

    let filter = { property: { $in: propertyIds } };

    if (status) {
      filter.status = { $in: status.split(',') };
    }

    const startIndex = (page - 1) * limit;
    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
      .sort('-createdAt')
      .skip(startIndex)
      .limit(parseInt(limit))
      .populate('property', 'title location images pricing propertyType')
      .populate('user', 'firstName lastName email phone');

    // Pagination
    const pagination = {};
    const endIndex = page * limit;

    if (endIndex < total) {
      pagination.next = {
        page: parseInt(page) + 1,
        limit: parseInt(limit)
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: parseInt(page) - 1,
        limit: parseInt(limit)
      };
    }

    res.json({
      success: true,
      count: bookings.length,
      total,
      pagination,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching owner bookings',
      code: 'OWNER_BOOKINGS_FETCH_ERROR'
    });
  }
});

// @desc    Get owner's financial summary
// @route   GET /api/v1/owner/financial
// @access  Private (Owner only)
router.get('/financial', async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { year = new Date().getFullYear(), month } = req.query;

    // Get all properties owned by the user
    const properties = await Property.find({ owner: ownerId }).select('_id');
    const propertyIds = properties.map(p => p._id);

    // Base filter for paid bookings
    const baseFilter = {
      property: { $in: propertyIds },
      status: { $in: ['confirmed', 'completed'] },
      paymentStatus: 'paid'
    };

    // Monthly revenue breakdown
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          ...baseFilter,
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(parseInt(year) + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Current month revenue
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const monthStart = new Date(year, currentMonth - 1, 1);
    const monthEnd = new Date(year, currentMonth, 0, 23, 59, 59);

    const currentMonthStats = await Booking.aggregate([
      {
        $match: {
          ...baseFilter,
          createdAt: { $gte: monthStart, $lte: monthEnd }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 },
          averageBookingValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Year-to-date revenue
    const ytdStats = await Booking.aggregate([
      {
        $match: {
          ...baseFilter,
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date()
          }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      }
    ]);

    // Recent payments
    const recentPayments = await Booking.find({
      ...baseFilter,
      'paymentDetails.paymentDate': { $exists: true }
    })
      .sort('-paymentDetails.paymentDate')
      .limit(10)
      .populate('property', 'title location')
      .populate('user', 'firstName lastName email')
      .select('totalAmount paymentDetails property user createdAt');

    // Property revenue breakdown
    const propertyRevenue = await Booking.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: '$property',
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: '_id',
          as: 'property'
        }
      },
      {
        $unwind: '$property'
      },
      {
        $project: {
          propertyTitle: '$property.title',
          propertyLocation: '$property.location.address',
          revenue: 1,
          bookings: 1
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        currentMonth: {
          revenue: currentMonthStats.length > 0 ? currentMonthStats[0].revenue : 0,
          bookings: currentMonthStats.length > 0 ? currentMonthStats[0].bookings : 0,
          averageBookingValue: currentMonthStats.length > 0 ? currentMonthStats[0].averageBookingValue : 0
        },
        yearToDate: {
          revenue: ytdStats.length > 0 ? ytdStats[0].revenue : 0,
          bookings: ytdStats.length > 0 ? ytdStats[0].bookings : 0
        },
        monthlyBreakdown: monthlyRevenue,
        recentPayments,
        propertyRevenue
      }
    });

  } catch (error) {
    console.error('Error fetching owner financial data:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching financial data',
      code: 'OWNER_FINANCIAL_FETCH_ERROR'
    });
  }
});

// @desc    Update booking status (approve/reject)
// @route   PUT /api/v1/owner/bookings/:id/status
// @access  Private (Owner only)
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status, reason } = req.body;
    const bookingId = req.params.id;

    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be confirmed or cancelled',
        code: 'INVALID_STATUS'
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate('property', 'owner title')
      .populate('user', 'firstName lastName email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        code: 'BOOKING_NOT_FOUND'
      });
    }

    // Check if user is the property owner
    if (booking.property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this booking',
        code: 'NOT_AUTHORIZED'
      });
    }

    // Update booking status
    booking.status = status;
    if (reason) {
      booking.cancellationReason = reason;
    }
    booking.statusUpdatedAt = new Date();
    booking.statusUpdatedBy = req.user.id;

    await booking.save();

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating booking status',
      code: 'BOOKING_STATUS_UPDATE_ERROR'
    });
  }
});

// @desc    Update property status (for resubmission)
// @route   PUT /api/v1/owner/properties/:id/status
// @access  Private (Owner only)
router.put('/properties/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const propertyId = req.params.id;

    // Validate status
    if (!['pending', 'draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Only pending and draft are allowed for owner updates.',
        code: 'INVALID_STATUS'
      });
    }

    // Find property and verify ownership
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    // Verify ownership
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this property',
        code: 'NOT_AUTHORIZED'
      });
    }

    // Only allow resubmission of rejected or draft properties
    if (!['rejected', 'draft'].includes(property.status)) {
      return res.status(400).json({
        success: false,
        error: 'Only rejected or draft properties can be resubmitted',
        code: 'INVALID_PROPERTY_STATUS'
      });
    }

    // Update status and clear rejection reason
    property.status = status;
    if (property.approval && property.approval.rejectionReason) {
      property.approval.rejectionReason = null;
      property.approval.rejectedAt = null;
      property.approval.rejectedBy = null;
    }

    await property.save();

    res.json({
      success: true,
      message: `Property status updated to ${status}`,
      data: property
    });

  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating property status',
      code: 'PROPERTY_STATUS_UPDATE_ERROR'
    });
  }
});

module.exports = router;