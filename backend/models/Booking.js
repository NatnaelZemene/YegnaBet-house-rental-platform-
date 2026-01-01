const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  guests: {
    adults: {
      type: Number,
      required: true,
      min: [1, 'At least 1 adult is required'],
      max: [10, 'Maximum 10 adults allowed']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children cannot be negative'],
      max: [10, 'Maximum 10 children allowed']
    },
    infants: {
      type: Number,
      default: 0,
      min: [0, 'Infants cannot be negative'],
      max: [5, 'Maximum 5 infants allowed']
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'ETB',
    enum: ['ETB', 'USD', 'EUR']
  },
  priceBreakdown: {
    basePrice: {
      type: Number,
      required: true
    },
    months: {
      type: Number,
      required: true
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    cleaningFee: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'pending_owner_approval', 'confirmed', 'cancelled', 'rejected', 'completed', 'no-show'],
    default: 'pending_owner_approval'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'simulated', 'paid', 'failed', 'refunded', 'partial'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['chapa', 'telebirr', 'cbe-birr', 'cash', 'bank-transfer', 'balance'],
    default: 'chapa'
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    paymentReference: String,
    gatewayResponse: mongoose.Schema.Types.Mixed
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  guestDetails: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    nationality: {
      type: String,
      default: 'Ethiopian'
    },
    idType: {
      type: String,
      enum: ['passport', 'national-id', 'driving-license'],
      default: 'national-id'
    },
    idNumber: String
  },
  checkInDetails: {
    actualCheckIn: Date,
    checkInNotes: String,
    keyHandover: {
      type: Boolean,
      default: false
    }
  },
  checkOutDetails: {
    actualCheckOut: Date,
    checkOutNotes: String,
    damageReport: String,
    keyReturn: {
      type: Boolean,
      default: false
    }
  },
  cancellation: {
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    refundAmount: {
      type: Number,
      default: 0
    },
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    }
  },
  communication: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  reviews: {
    propertyReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    },
    hostReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  },
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    userAgent: String,
    ipAddress: String,
    referrer: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });

// Virtual for number of months
bookingSchema.virtual('months').get(function() {
  if (this.checkIn && this.checkOut) {
    const timeDiff = this.checkOut.getTime() - this.checkIn.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.ceil(days / 30); // Convert days to months
  }
  return 0;
});

// Virtual for number of nights (kept for backward compatibility)
bookingSchema.virtual('nights').get(function() {
  if (this.checkIn && this.checkOut) {
    const timeDiff = this.checkOut.getTime() - this.checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  return 0;
});

// Virtual for total guests
bookingSchema.virtual('totalGuests').get(function() {
  return (this.guests?.adults || 0) + (this.guests?.children || 0) + (this.guests?.infants || 0);
});

// Virtual for booking duration in Ethiopian format
bookingSchema.virtual('durationText').get(function() {
  const months = this.months;
  if (months === 1) return '1 month';
  return `${months} months`;
});

// Pre-save middleware
bookingSchema.pre('save', function(next) {
  // Validate check-in and check-out dates
  if (this.checkIn && this.checkOut) {
    if (this.checkOut <= this.checkIn) {
      return next(new Error('Check-out date must be after check-in date'));
    }
    
    // Check if check-in is not in the past (allow same day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (this.checkIn < today) {
      return next(new Error('Check-in date cannot be in the past'));
    }
  }
  
  // Calculate months and update price breakdown
  if (this.checkIn && this.checkOut && this.priceBreakdown) {
    this.priceBreakdown.months = this.months;
  }
  
  // Set guest details from user if not provided
  if (!this.guestDetails.firstName && this.user) {
    // This would be populated from the user document
  }
  
  next();
});

// Static method to get booking statistics
bookingSchema.statics.getBookingStats = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        averageBookingValue: { $avg: '$totalAmount' },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
        },
        completedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result.length > 0 ? result[0] : {
    totalBookings: 0,
    totalRevenue: 0,
    averageBookingValue: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  };
};

// Static method to get monthly booking trends
bookingSchema.statics.getMonthlyTrends = async function(year = new Date().getFullYear()) {
  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        bookings: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { '_id': 1 } }
  ];
  
  return await this.aggregate(pipeline);
};

// Instance method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  const now = new Date();
  const checkIn = new Date(this.checkIn);
  const daysUntilCheckIn = Math.ceil((checkIn - now) / (1000 * 60 * 60 * 24));
  
  // Ethiopian refund policy
  if (daysUntilCheckIn >= 7) {
    return this.totalAmount * 0.9; // 90% refund
  } else if (daysUntilCheckIn >= 3) {
    return this.totalAmount * 0.5; // 50% refund
  } else if (daysUntilCheckIn >= 1) {
    return this.totalAmount * 0.25; // 25% refund
  } else {
    return 0; // No refund
  }
};

// Instance method to format amount in Ethiopian Birr
bookingSchema.methods.formatAmount = function(amount = this.totalAmount) {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0
  }).format(amount);
};

module.exports = mongoose.model('Booking', bookingSchema);