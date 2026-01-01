const express = require('express');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const User = require('../models/User');
const { protect, authorize, isOwnerOrAdmin } = require('../middleware/auth');
const { validateBooking, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all bookings with filtering and pagination
// @route   GET /api/v1/bookings
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    let query = Booking.find();

    // Filtering
    const { status, propertyId, userId, startDate, endDate } = req.query;

    let filter = {};

    if (status) {
      filter.status = { $in: status.split(',') };
    }

    if (propertyId) {
      filter.property = propertyId;
    }

    if (userId) {
      filter.user = userId;
    }

    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    query = query.find(filter);

    // Sorting
    const sortBy = req.query.sort || '-createdAt';
    query = query.sort(sortBy);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Booking.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    // Populate related data
    query = query.populate('user', 'name email phone profile')
                 .populate('property', 'title location price images type');

    const bookings = await query;

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
      count: bookings.length,
      total,
      pagination,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching bookings',
      code: 'BOOKINGS_FETCH_ERROR'
    });
  }
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private (User's own booking, property owner, or admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone profile')
      .populate('property', 'title location price images type owner')
      .populate('payment');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        code: 'BOOKING_NOT_FOUND'
      });
    }

    // Check authorization
    const isOwner = booking.user._id.toString() === req.user.id;
    const isPropertyOwner = booking.property.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isPropertyOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking',
        code: 'NOT_AUTHORIZED'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching booking',
      code: 'BOOKING_FETCH_ERROR'
    });
  }
});

// @desc    Create new booking (WITH BALANCE CHECK)
// @route   POST /api/v1/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    console.log('📝 Booking request with balance check:', req.body);

    const { property, checkInDate, checkOutDate, guests, specialRequests, paymentMethod } = req.body;

    // Basic validation
    if (!property) {
      return res.status(400).json({
        success: false,
        error: 'Property ID is required'
      });
    }

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        error: 'Check-in and check-out dates are required'
      });
    }

    // Check if property exists
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    // Calculate pricing
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const months = Math.max(1, Math.ceil(days / 30));
    const monthlyPrice = propertyDoc.pricing?.monthly || 5000;
    const basePrice = months * monthlyPrice;
    const serviceFee = Math.round(basePrice * 0.005); // 0.5%
    const totalAmount = basePrice + serviceFee;

    console.log('💰 Pricing calculation:', {
      days,
      months,
      monthlyPrice,
      basePrice,
      serviceFee,
      totalAmount
    });

    // CHECK USER BALANCE - This is the key part!
    const User = require('../models/User');
    const currentUser = await User.findById(req.user.id);
    
    // Initialize financial data if missing
    if (!currentUser.financial || currentUser.financial.balance === undefined) {
      console.log('🔧 Initializing user wallet...');
      currentUser.financial = {
        balance: 10000, // Start with 10,000 ETB
        earnings: { total: 0, thisMonth: 0, lastMonth: 0, pending: 0 },
        commission: { total: 0, thisMonth: 0, rate: 0.005 },
        transactions: []
      };
      await currentUser.save();
      console.log('✅ User wallet initialized with 10,000 ETB');
    }

    const userBalance = currentUser.financial.balance;
    console.log(`💳 User balance: ${userBalance} ETB, Required: ${totalAmount} ETB`);

    // Check if user has sufficient balance
    if (userBalance < totalAmount) {
      return res.status(400).json({
        success: false,
        error: `Insufficient balance. You have ${userBalance.toLocaleString()} ETB but need ${totalAmount.toLocaleString()} ETB`,
        code: 'INSUFFICIENT_BALANCE',
        data: {
          currentBalance: userBalance,
          requiredAmount: totalAmount,
          shortfall: totalAmount - userBalance
        }
      });
    }

    // DEDUCT BALANCE - Simulate payment by reducing balance
    const newBalance = userBalance - totalAmount;
    await User.findByIdAndUpdate(req.user.id, {
      $set: { 'financial.balance': newBalance },
      $inc: { 'stats.totalSpent': totalAmount, 'stats.totalBookings': 1 }
    });

    console.log(`💸 Balance deducted: ${userBalance} → ${newBalance} ETB`);

    // Generate booking ID
    const bookingId = `YB${Date.now().toString().slice(-6)}`;

    // Create booking
    const booking = await Booking.create({
      bookingId,
      user: req.user.id,
      property: property,
      checkIn: new Date(checkInDate),
      checkOut: new Date(checkOutDate),
      guests: {
        adults: typeof guests === 'number' ? guests : (guests?.adults || 1),
        children: guests?.children || 0
      },
      guestDetails: {
        firstName: req.user.firstName || 'Guest',
        lastName: req.user.lastName || 'User',
        email: req.user.email || 'guest@example.com',
        phone: req.user.phone || '+251911000000',
        nationality: 'Ethiopian'
      },
      totalAmount: totalAmount,
      priceBreakdown: {
        basePrice: basePrice,
        months: months,
        serviceFee: serviceFee,
        taxes: 0
      },
      specialRequests: specialRequests || '',
      status: 'pending_owner_approval',
      paymentStatus: 'paid', // Mark as paid since we deducted balance
      paymentMethod: 'balance' // Using wallet balance
    });

    console.log('✅ Booking created with balance deduction:', booking._id);

    // Populate property info
    await booking.populate('property', 'title location images pricing');

    // Payment confirmation
    const paymentConfirmation = {
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      method: 'wallet',
      amount: totalAmount,
      currency: 'ETB',
      status: 'paid',
      balanceBefore: userBalance,
      balanceAfter: newBalance,
      message: 'Payment successful - amount deducted from wallet',
      timestamp: new Date().toISOString()
    };

    console.log('💳 Payment processed:', paymentConfirmation);

    res.status(201).json({
      success: true,
      message: 'Booking created and payment processed successfully',
      data: {
        booking: booking,
        payment: paymentConfirmation,
        newBalance: newBalance
      }
    });

  } catch (error) {
    console.error('❌ Booking with balance error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      details: error.message
    });
  }
});

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id/status
// @access  Private (Property owner or admin)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate('property', 'owner title')
      .populate('user', 'firstName lastName email phone createdAt stats status');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        code: 'BOOKING_NOT_FOUND'
      });
    }

    // Check authorization
    const isPropertyOwner = booking.property.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isPropertyOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this booking',
        code: 'NOT_AUTHORIZED'
      });
    }

    // Validate status transition
    const validStatuses = ['pending', 'pending_owner_approval', 'confirmed', 'rejected', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking status',
        code: 'INVALID_STATUS'
      });
    }

    const oldStatus = booking.status;
    booking.status = status;
    
    if (status === 'rejected' && rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }

    // Handle simple status updates when booking is confirmed
    if (status === 'confirmed' && oldStatus !== 'confirmed') {
      console.log('💰 Processing financial distribution for approved booking...');
      
      // Get the booking with full details for financial processing
      const fullBooking = await Booking.findById(req.params.id)
        .populate('property', 'owner title')
        .populate('user', 'firstName lastName email');
      
      const totalAmount = fullBooking.totalAmount;
      const serviceFeeRate = 0.005; // 0.5%
      const serviceFee = Math.round(totalAmount * serviceFeeRate);
      const ownerPayout = totalAmount - serviceFee;
      
      console.log(`💰 Financial breakdown:
        - Total: ${totalAmount} ETB
        - Service fee (0.5%): ${serviceFee} ETB  
        - Owner payout: ${ownerPayout} ETB`);
      
      // Update owner balance (add payout)
      const User = require('../models/User');
      await User.findByIdAndUpdate(fullBooking.property.owner, {
        $inc: {
          'financial.balance': ownerPayout,
          'financial.earnings.total': ownerPayout,
          'financial.earnings.thisMonth': ownerPayout
        }
      });
      
      // Update admin balance (add service fee)
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await User.findByIdAndUpdate(admin._id, {
          $inc: {
            'financial.balance': serviceFee,
            'financial.commission.total': serviceFee,
            'financial.commission.thisMonth': serviceFee
          }
        });
      }
      
      console.log('✅ Financial distribution completed');
      
      // Mark property as booked when booking is confirmed
      await Property.findByIdAndUpdate(booking.property._id, { 
        status: 'booked',
        'availability.isAvailable': false 
      });
      console.log('✅ Property marked as booked');
    } else if (status === 'rejected' || status === 'cancelled') {
      // Make property available again when booking is rejected or cancelled
      await Property.findByIdAndUpdate(booking.property._id, { 
        status: 'approved',
        'availability.isAvailable': true 
      });
      console.log('✅ Property made available again');
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });
  } catch (error) {
    console.error('Booking status update error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating booking status',
      code: 'BOOKING_STATUS_UPDATE_ERROR'
    });
  }
});

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private (Booking owner only)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        code: 'BOOKING_NOT_FOUND'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking',
        code: 'NOT_AUTHORIZED'
      });
    }

    // Check if booking can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        error: 'Booking cannot be cancelled',
        code: 'CANNOT_CANCEL'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error cancelling booking',
      code: 'BOOKING_CANCEL_ERROR'
    });
  }
});

// @desc    Get user's bookings
// @route   GET /api/v1/bookings/my-bookings
// @access  Private
router.get('/my/bookings', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let filter = { user: req.user.id };

    if (status) {
      filter.status = { $in: status.split(',') };
    }

    const startIndex = (page - 1) * limit;
    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
      .sort('-createdAt')
      .skip(startIndex)
      .limit(parseInt(limit))
      .populate('property', 'title location images price type');

    // Pagination result
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
    res.status(500).json({
      success: false,
      error: 'Server error fetching user bookings',
      code: 'USER_BOOKINGS_FETCH_ERROR'
    });
  }
});

// @desc    Get property owner's bookings
// @route   GET /api/v1/bookings/property-owner/bookings
// @access  Private (Property owner or admin)
router.get('/property-owner/bookings', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    // Get all properties owned by the user
    const properties = await Property.find({ owner: req.user.id }).select('_id');
    const propertyIds = properties.map(p => p._id);

    const { status, page = 1, limit = 10 } = req.query;

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
      .populate('property', 'title location images price type')
      .populate('user', 'firstName lastName email phone createdAt stats status profile');

    // Pagination result
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
    res.status(500).json({
      success: false,
      error: 'Server error fetching property owner bookings',
      code: 'OWNER_BOOKINGS_FETCH_ERROR'
    });
  }
});

// @desc    Get booking statistics
// @route   GET /api/v1/bookings/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Revenue statistics
    const revenueStats = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageBookingValue: { $avg: '$totalAmount' },
          totalMonths: { $sum: '$months' }
        }
      }
    ]);

    // Monthly booking trends
    const monthlyStats = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        revenue: revenueStats[0] || { totalRevenue: 0, averageBookingValue: 0, totalMonths: 0 },
        monthlyTrends: monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching booking statistics',
      code: 'BOOKING_STATS_ERROR'
    });
  }
});

module.exports = router;