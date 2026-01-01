const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Property Details
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['Apartment', 'Villa', 'House', 'Studio', 'Penthouse', 'Condo', 'Townhouse']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative'],
    max: [20, 'Maximum 20 bedrooms allowed']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [1, 'At least 1 bathroom is required'],
    max: [20, 'Maximum 20 bathrooms allowed']
  },
  area: {
    type: Number,
    required: [true, 'Property area is required'],
    min: [10, 'Minimum area is 10 square meters'],
    max: [10000, 'Maximum area is 10000 square meters']
  },
  floor: {
    type: Number,
    min: [0, 'Floor cannot be negative']
  },
  totalFloors: {
    type: Number,
    min: [1, 'Total floors must be at least 1']
  },
  
  // Location (Ethiopian Context)
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    subcity: {
      type: String,
      required: [true, 'Subcity is required'],
      enum: [
        'Addis Ketema', 'Akaky Kaliti', 'Arada', 'Bole', 'Gullele',
        'Kirkos', 'Kolfe Keranio', 'Lideta', 'Nifas Silk-Lafto', 'Yeka'
      ]
    },
    woreda: {
      type: String,
      required: [true, 'Woreda is required']
    },
    kebele: String,
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
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Invalid latitude'],
        max: [90, 'Invalid latitude']
      },
      longitude: {
        type: Number,
        min: [-180, 'Invalid longitude'],
        max: [180, 'Invalid longitude']
      }
    },
    nearbyPlaces: [{
      name: String,
      type: {
        type: String,
        enum: ['school', 'hospital', 'mall', 'restaurant', 'bank', 'transport', 'mosque', 'church', 'market']
      },
      distance: Number // in meters
    }]
  },
  
  // Pricing (Ethiopian Birr)
  pricing: {
    monthly: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [1000, 'Minimum rent is 1000 ETB'],
      max: [1000000, 'Maximum rent is 1,000,000 ETB']
    },
    currency: {
      type: String,
      default: 'ETB'
    },
    deposit: {
      type: Number,
      default: function() {
        return this.pricing.monthly * 2; // Default 2 months rent
      }
    },
    serviceCharge: {
      type: Number,
      default: 0
    },
    utilities: {
      electricity: {
        type: Boolean,
        default: false
      },
      water: {
        type: Boolean,
        default: false
      },
      internet: {
        type: Boolean,
        default: false
      },
      gas: {
        type: Boolean,
        default: false
      },
      maintenance: {
        type: Boolean,
        default: false
      }
    },
    negotiable: {
      type: Boolean,
      default: false
    }
  },
  
  // Amenities (Ethiopian Context)
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'Parking', 'Security', 'Generator', 'Water Tank', 'Garden',
      'Elevator', 'Modern Kitchen', 'Kitchen', 'Balcony', 'Maid Quarter', 'School Nearby',
      'Near Transport', 'Historic Area', 'Furnished', 'City View', 'Pool', 'Swimming Pool',
      'Gym', 'Laundry', 'Air Conditioning', 'Heating', 'Fireplace',
      'Storage', 'Terrace', 'Garage', 'CCTV', 'Intercom', 'Backup Water',
      'Solar Power', 'Satellite TV', 'Playground', 'Shopping Nearby'
    ]
  }],
  
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String, // Cloudinary public ID
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Property Status
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'rented', 'booked', 'maintenance', 'inactive'],
    default: 'pending'
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: {
      type: Date,
      default: Date.now
    },
    minimumStay: {
      type: Number,
      default: 1, // months
      min: [1, 'Minimum stay must be at least 1 month']
    },
    maximumStay: {
      type: Number,
      default: 12 // months
    }
  },
  
  // Owner Information
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required']
  },
  
  // Property Features
  features: {
    furnished: {
      type: String,
      enum: ['fully_furnished', 'semi_furnished', 'unfurnished'],
      default: 'unfurnished'
    },
    petPolicy: {
      allowed: {
        type: Boolean,
        default: false
      },
      deposit: Number,
      restrictions: String
    },
    smokingPolicy: {
      type: String,
      enum: ['allowed', 'not_allowed', 'outdoor_only'],
      default: 'not_allowed'
    },
    parkingSpaces: {
      type: Number,
      default: 0
    },
    yearBuilt: {
      type: Number,
      min: [1900, 'Year built cannot be before 1900'],
      max: [new Date().getFullYear(), 'Year built cannot be in the future']
    },
    lastRenovated: {
      type: Number,
      min: [1900, 'Renovation year cannot be before 1900'],
      max: [new Date().getFullYear(), 'Renovation year cannot be in the future']
    }
  },
  
  // Rules and Policies
  rules: {
    guestPolicy: String,
    partyPolicy: String,
    quietHours: {
      start: String, // "22:00"
      end: String    // "07:00"
    },
    additionalRules: [String]
  },
  
  // Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    inquiries: {
      type: Number,
      default: 0
    },
    bookings: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    likedBy: [{
      user: {
        type: mongoose.Schema.ObjectId,
        refPath: 'stats.likedBy.userType'
      },
      userType: {
        type: String,
        enum: ['User', 'Owner']
      },
      likedAt: {
        type: Date,
        default: Date.now
      }
    }],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
      },
      count: {
        type: Number,
        default: 0
      }
    },
    featured: {
      type: Boolean,
      default: false
    },
    featuredUntil: Date
  },
  
  // SEO and Search
  seo: {
    slug: {
      type: String,
      unique: true
    },
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  // Approval Information
  approval: {
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    rejectedAt: Date,
    rejectionReason: String,
    notes: String
  },
  
  // Timestamps
  publishedAt: Date,
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for property URL
PropertySchema.virtual('url').get(function() {
  return `/properties/${this._id}`;
});

// Virtual for primary image
PropertySchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Virtual for total monthly cost
PropertySchema.virtual('totalMonthlyCost').get(function() {
  let total = (this.pricing?.monthly || 0) + (this.pricing?.serviceCharge || 0);
  
  // Add utility costs if not included
  if (this.pricing?.utilities) {
    if (!this.pricing.utilities.electricity) {
      total += 500; // Default electricity cost
    }
    if (!this.pricing.utilities.water) {
      total += 300; // Default water cost
    }
    if (!this.pricing.utilities.internet) {
      total += 800; // Default internet cost
    }
    if (!this.pricing.utilities.gas) {
      total += 400; // Default gas cost
    }
  }
  
  return total;
});

// Indexes for performance and search
PropertySchema.index({ 'location.subcity': 1 });
PropertySchema.index({ 'location.woreda': 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ 'pricing.monthly': 1 });
PropertySchema.index({ bedrooms: 1 });
PropertySchema.index({ bathrooms: 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ 'availability.isAvailable': 1 });
PropertySchema.index({ owner: 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ 'stats.featured': -1 });
PropertySchema.index({ 'stats.rating.average': -1 });
PropertySchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });

// Text index for search
PropertySchema.index({
  title: 'text',
  description: 'text',
  'location.address': 'text',
  'location.subcity': 'text',
  'location.woreda': 'text'
});

// Pre-save middleware to generate slug
PropertySchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.seo.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '-' + this._id.toString().slice(-6);
  }
  
  // Update lastModified
  this.lastModified = new Date();
  
  // Ensure only one primary image
  if (this.images && this.images.length > 0) {
    let primaryCount = 0;
    this.images.forEach((img, index) => {
      if (img.isPrimary) {
        primaryCount++;
        if (primaryCount > 1) {
          this.images[index].isPrimary = false;
        }
      }
    });
    
    // If no primary image, make the first one primary
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;
    }
  }
  
  next();
});

// Static method to get properties by location
PropertySchema.statics.findByLocation = function(subcity, woreda = null) {
  const query = { 'location.subcity': subcity, status: 'approved', 'availability.isAvailable': true };
  if (woreda) {
    query['location.woreda'] = woreda;
  }
  return this.find(query);
};

// Static method to search properties
PropertySchema.statics.searchProperties = function(searchTerm, filters = {}) {
  const query = { status: 'approved', 'availability.isAvailable': true };
  
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }
  
  // Apply filters
  if (filters.subcity) query['location.subcity'] = filters.subcity;
  if (filters.propertyType) query.propertyType = filters.propertyType;
  if (filters.minPrice) query['pricing.monthly'] = { $gte: filters.minPrice };
  if (filters.maxPrice) {
    query['pricing.monthly'] = query['pricing.monthly'] || {};
    query['pricing.monthly'].$lte = filters.maxPrice;
  }
  if (filters.bedrooms) query.bedrooms = filters.bedrooms;
  if (filters.bathrooms) query.bathrooms = { $gte: filters.bathrooms };
  if (filters.amenities && filters.amenities.length > 0) {
    query.amenities = { $in: filters.amenities };
  }
  
  return this.find(query).sort(searchTerm ? { score: { $meta: 'textScore' } } : { createdAt: -1 });
};

// Method to increment view count
PropertySchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save();
};

// Method to update rating
PropertySchema.methods.updateRating = function(newRating) {
  const currentTotal = this.stats.rating.average * this.stats.rating.count;
  this.stats.rating.count += 1;
  this.stats.rating.average = (currentTotal + newRating) / this.stats.rating.count;
  return this.save();
};

module.exports = mongoose.model('Property', PropertySchema);