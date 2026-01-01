const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  pros: [{
    type: String,
    trim: true,
    maxlength: [200, 'Pro cannot exceed 200 characters']
  }],
  cons: [{
    type: String,
    trim: true,
    maxlength: [200, 'Con cannot exceed 200 characters']
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [100, 'Caption cannot exceed 100 characters']
    }
  }],
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  reported: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'spam', 'fake', 'offensive', 'other'],
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Report description cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  response: {
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Response cannot exceed 500 characters']
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: {
      type: Date
    }
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'pending', 'rejected'],
    default: 'active'
  },
  verifiedStay: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    enum: ['en', 'am'], // English, Amharic
    default: 'en'
  },
  location: {
    accuracy: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    checkIn: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
reviewSchema.index({ property: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ verifiedStay: 1 });

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful ? this.helpful.length : 0;
});

// Virtual for average category rating
reviewSchema.virtual('categoryAverage').get(function() {
  if (!this.location) return this.rating;
  
  const categories = ['accuracy', 'cleanliness', 'communication', 'checkIn', 'value'];
  const total = categories.reduce((sum, category) => sum + (this.location[category] || 0), 0);
  return Math.round((total / categories.length) * 10) / 10;
});

// Prevent duplicate reviews for same booking
reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

// Pre-save middleware
reviewSchema.pre('save', function(next) {
  // Set verified stay based on booking completion
  if (this.booking && !this.verifiedStay) {
    // This would be set when booking is completed
    this.verifiedStay = true;
  }
  next();
});

// Static method to get property average rating
reviewSchema.statics.getPropertyAverageRating = async function(propertyId) {
  const result = await this.aggregate([
    {
      $match: {
        property: mongoose.Types.ObjectId(propertyId),
        status: 'active'
      }
    },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (result.length > 0) {
    const stats = result[0];
    
    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats.ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    return {
      averageRating: Math.round(stats.averageRating * 10) / 10,
      totalReviews: stats.totalReviews,
      distribution
    };
  }

  return {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };
};

// Static method to get user's review summary
reviewSchema.statics.getUserReviewSummary = async function(userId) {
  const result = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        status: 'active'
      }
    },
    {
      $group: {
        _id: '$user',
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        helpfulVotes: { $sum: { $size: '$helpful' } }
      }
    }
  ]);

  return result.length > 0 ? result[0] : {
    totalReviews: 0,
    averageRating: 0,
    helpfulVotes: 0
  };
};

module.exports = mongoose.model('Review', reviewSchema);