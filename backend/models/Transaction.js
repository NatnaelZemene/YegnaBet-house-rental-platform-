const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  // Transaction ID
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Related entities
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: false // Not required for deposit transactions
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: false // Not required for deposit transactions
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false // Not required for deposit transactions
  },
  
  // Transaction details
  type: {
    type: String,
    enum: ['payment', 'refund', 'commission', 'payout', 'deposit'],
    required: true
  },
  
  // Amounts in ETB
  amounts: {
    total: {
      type: Number,
      required: true
    },
    baseAmount: {
      type: Number,
      required: true
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    adminCommission: {
      type: Number,
      default: 0
    },
    ownerPayout: {
      type: Number,
      required: true
    }
  },
  
  // Payment details
  paymentMethod: {
    type: String,
    enum: ['chapa', 'telebirr', 'cbe-birr', 'bank-transfer', 'cash', 'balance'],
    required: true
  },
  paymentProvider: {
    type: String,
    default: 'chapa'
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // External payment reference
  externalReference: {
    type: String
  },
  
  // Processing details
  processedAt: Date,
  failureReason: String,
  
  // Metadata
  metadata: {
    userBalance: {
      before: Number,
      after: Number
    },
    ownerBalance: {
      before: Number,
      after: Number
    },
    adminBalance: {
      before: Number,
      after: Number
    },
    currency: {
      type: String,
      default: 'ETB'
    },
    exchangeRate: {
      type: Number,
      default: 1
    }
  }
}, {
  timestamps: true
});

// Indexes
TransactionSchema.index({ transactionId: 1 });
TransactionSchema.index({ booking: 1 });
TransactionSchema.index({ user: 1 });
TransactionSchema.index({ owner: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ createdAt: -1 });

// Generate transaction ID
TransactionSchema.pre('save', function(next) {
  if (this.isNew && !this.transactionId) {
    this.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);