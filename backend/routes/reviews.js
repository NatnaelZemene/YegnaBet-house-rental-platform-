const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');
const { validateReview, validateReviewUpdate } = require('../middleware/validation');
const { uploadImages, processImages } = require('../middleware/upload');

// @desc    Get all reviews for a property
// @route   GET /api/v1/reviews/property/:propertyId
// @access  Public
router.get('/property/:propertyId', async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      rating,
      language = 'en',
      verified
    } = req.query;

    // Build filter
    const filter = {
      property: propertyId,
      status: 'active'
    };

    if (rating) {
      filter.rating = parseInt(rating);
    }

    if (language) {
      filter.language = language;
    }

    if (verified === 'true') {
      filter.verifiedStay = true;
    }

    // Execute query
    const reviews = await Review.find(filter)
      .populate('user', 'name avatar createdAt')
      .populate('response.respondedBy', 'name role')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const total = await Review.countDocuments(filter);

    // Get property rating summary
    const ratingSummary = await Review.getPropertyAverageRating(propertyId);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      ratingSummary,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's reviews
// @route   GET /api/v1/reviews/user
// @access  Private
router.get('/user', protect, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const reviews = await Review.find({ user: req.user.id })
      .populate('property', 'title images location price')
      .populate('booking', 'checkIn checkOut totalAmount')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ user: req.user.id });

    // Get user review summary
    const summary = await Review.getUserReviewSummary(req.user.id);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      summary,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create a review
// @route   POST /api/v1/reviews
// @access  Private
router.post('/', protect, uploadImages, processImages, validateReview, async (req, res, next) => {
  try {
    const {
      property,
      booking,
      rating,
      title,
      comment,
      pros,
      cons,
      location: categoryRatings,
      language = 'en'
    } = req.body;

    // Check if booking exists and belongs to user
    const bookingDoc = await Booking.findOne({
      _id: booking,
      user: req.user.id,
      status: 'completed'
    });

    if (!bookingDoc) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not completed'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({
      user: req.user.id,
      booking: booking
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this booking'
      });
    }

    // Process uploaded images
    const images = req.processedImages || [];

    // Create review
    const review = await Review.create({
      property,
      user: req.user.id,
      booking,
      rating,
      title,
      comment,
      pros: pros ? pros.split(',').map(p => p.trim()) : [],
      cons: cons ? cons.split(',').map(c => c.trim()) : [],
      images,
      location: categoryRatings,
      language,
      verifiedStay: true
    });

    // Update property rating
    await updatePropertyRating(property);

    // Populate review for response
    await review.populate('user', 'name avatar');
    await review.populate('property', 'title');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
router.put('/:id', protect, uploadImages, processImages, validateReviewUpdate, async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const {
      rating,
      title,
      comment,
      pros,
      cons,
      location: categoryRatings
    } = req.body;

    // Process new images if uploaded
    const newImages = req.processedImages || [];
    const existingImages = review.images || [];
    const images = [...existingImages, ...newImages];

    // Update review
    review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        rating,
        title,
        comment,
        pros: pros ? pros.split(',').map(p => p.trim()) : review.pros,
        cons: cons ? cons.split(',').map(c => c.trim()) : review.cons,
        images,
        location: categoryRatings || review.location
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name avatar');

    // Update property rating
    await updatePropertyRating(review.property);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    // Update property rating
    await updatePropertyRating(review.property);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark review as helpful
// @route   POST /api/v1/reviews/:id/helpful
// @access  Private
router.post('/:id/helpful', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked as helpful
    const alreadyHelpful = review.helpful.some(
      h => h.user.toString() === req.user.id
    );

    if (alreadyHelpful) {
      // Remove helpful mark
      review.helpful = review.helpful.filter(
        h => h.user.toString() !== req.user.id
      );
    } else {
      // Add helpful mark
      review.helpful.push({ user: req.user.id });
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: alreadyHelpful ? 'Helpful mark removed' : 'Review marked as helpful',
      helpfulCount: review.helpful.length
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Report a review
// @route   POST /api/v1/reviews/:id/report
// @access  Private
router.post('/:id/report', protect, async (req, res, next) => {
  try {
    const { reason, description } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Report reason is required'
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already reported this review
    const alreadyReported = review.reported.some(
      r => r.user.toString() === req.user.id
    );

    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this review'
      });
    }

    // Add report
    review.reported.push({
      user: req.user.id,
      reason,
      description
    });

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Respond to a review (Property owner/Admin)
// @route   POST /api/v1/reviews/:id/respond
// @access  Private (Property owner or Admin)
router.post('/:id/respond', protect, authorize('admin', 'owner'), async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }

    const review = await Review.findById(req.params.id).populate('property');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is property owner or admin
    if (req.user.role !== 'admin' && review.property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this review'
      });
    }

    // Add response
    review.response = {
      message,
      respondedBy: req.user.id,
      respondedAt: new Date()
    };

    await review.save();
    await review.populate('response.respondedBy', 'name role');

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to update property rating
async function updatePropertyRating(propertyId) {
  try {
    const ratingSummary = await Review.getPropertyAverageRating(propertyId);
    
    await Property.findByIdAndUpdate(propertyId, {
      rating: ratingSummary.averageRating,
      reviewCount: ratingSummary.totalReviews,
      ratingDistribution: ratingSummary.distribution
    });
  } catch (error) {
    console.error('Error updating property rating:', error);
  }
}

module.exports = router;