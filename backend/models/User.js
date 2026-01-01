const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [
      /^(\+251|0)[79]\d{8}$/,
      'Please provide a valid Ethiopian phone number'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value) {
        return value < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: null
  },
  
  // Address Information (Ethiopian Context)
  address: {
    street: String,
    subcity: {
      type: String,
      enum: [
        'Addis Ketema', 'Akaky Kaliti', 'Arada', 'Bole', 'Gullele',
        'Kirkos', 'Kolfe Keranio', 'Lideta', 'Nifas Silk-Lafto', 'Yeka'
      ]
    },
    woreda: String,
    city: {
      type: String,
      default: 'Addis Ababa'
    },
    region: {
      type: String,
      default: 'Addis Ababa'
    },
    country: {
      type: String,
      default: 'Ethiopia'
    },
    postalCode: String
  },
  
  // Account Settings
  role: {
    type: String,
    enum: ['user', 'owner', 'admin', 'super_admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    default: 'pending_verification'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  // Preferences
  preferences: {
    currency: {
      type: String,
      default: 'ETB'
    },
    language: {
      type: String,
      enum: ['en', 'am', 'or'],
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showPhone: {
        type: Boolean,
        default: false
      },
      showEmail: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Security
  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false
    },
    secret: String,
    backupCodes: [String]
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Email Verification
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  // Statistics
  stats: {
    totalBookings: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    totalProperties: {
      type: Number,
      default: 0
    },
    joinedDate: {
      type: Date,
      default: Date.now
    },
    lastLogin: Date,
    lastActivity: Date
  },
  
  // Financial Information
  financial: {
    // Wallet balance in ETB
    balance: {
      type: Number,
      default: 10000 // Start with 10,000 ETB for demo
    },
    
    // For owners - earnings tracking
    earnings: {
      total: {
        type: Number,
        default: 0
      },
      thisMonth: {
        type: Number,
        default: 0
      },
      lastMonth: {
        type: Number,
        default: 0
      },
      pending: {
        type: Number,
        default: 0
      }
    },
    
    // For admin - commission tracking
    commission: {
      total: {
        type: Number,
        default: 0
      },
      thisMonth: {
        type: Number,
        default: 0
      },
      rate: {
        type: Number,
        default: 0.013 // 1.3%
      }
    },
    
    // Transaction history references
    transactions: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Transaction'
    }],
    
    // Payment methods
    paymentMethods: [{
      type: {
        type: String,
        enum: ['bank', 'mobile', 'telebirr', 'cbe-birr']
      },
      details: {
        accountNumber: String,
        bankName: String,
        accountHolder: String,
        phoneNumber: String
      },
      isDefault: {
        type: Boolean,
        default: false
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Favorites
  favoriteProperties: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Property'
  }],
  
  // Saved Searches
  savedSearches: [{
    name: String,
    criteria: {
      location: String,
      priceRange: {
        min: Number,
        max: Number
      },
      propertyType: String,
      bedrooms: Number,
      amenities: [String]
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ 'address.subcity': 1 });
UserSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      role: this.role,
      email: this.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// Method to generate password reset token
UserSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Method to generate email verification token
UserSchema.methods.getEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Method to handle failed login attempts
UserSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        loginAttempts: 1,
        lockUntil: 1
      }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    }
  });
};

// Static method to find by credentials
UserSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  if (user.isLocked) {
    throw new Error('Account is temporarily locked due to too many failed login attempts');
  }
  
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    await user.incLoginAttempts();
    throw new Error('Invalid credentials');
  }
  
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }
  
  // Update last login
  user.stats.lastLogin = new Date();
  user.stats.lastActivity = new Date();
  await user.save();
  
  return user;
};

module.exports = mongoose.model('User', UserSchema);