const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation failed for:', req.path);
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    console.log('🚫 Validation errors:', errors.array());
    
    return res.status(400).json({
      success: false,
      error: 'Please check your input and try again',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }
  next();
};

// User registration validation
exports.validateUserRegistration = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 25 })
    .withMessage('First name must be between 2 and 25 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 25 })
    .withMessage('Last name must be between 2 and 25 characters'),
  
  // Custom validation to ensure either name OR (firstName + lastName) is provided
  body().custom((value, { req }) => {
    const { name, firstName, lastName } = req.body;
    if (!name && (!firstName || !lastName)) {
      throw new Error('Either name or both firstName and lastName are required');
    }
    return true;
  }),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phone')
    .optional()
    .matches(/^(\+251|0)[79]\d{8}$/)
    .withMessage('Please provide a valid Ethiopian phone number'),
  
  body('role')
    .optional()
    .isIn(['user', 'owner'])
    .withMessage('Role must be either user or owner')
];

// User login validation
exports.validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Property validation
exports.validateProperty = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Property title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  
  body('pricing.monthly')
    .isFloat({ min: 1000, max: 1000000 })
    .withMessage('Monthly rent must be between 1,000 and 1,000,000 ETB'),
  
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  
  body('location.city')
    .optional()
    .trim()
    .equals('Addis Ababa')
    .withMessage('Currently only supporting properties in Addis Ababa'),
  
  body('location.subcity')
    .trim()
    .isIn(['Addis Ketema', 'Akaky Kaliti', 'Arada', 'Bole', 'Gullele', 'Kirkos', 'Kolfe Keranio', 'Lideta', 'Nifas Silk-Lafto', 'Yeka'])
    .withMessage('Please select a valid sub-city in Addis Ababa'),
  
  body('bedrooms')
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be between 0 and 20'),
  
  body('bathrooms')
    .isInt({ min: 1, max: 20 })
    .withMessage('Bathrooms must be between 1 and 20'),
  
  body('area')
    .isFloat({ min: 10, max: 10000 })
    .withMessage('Area must be between 10 and 10000 square meters'),
  
  body('propertyType')
    .isIn(['Apartment', 'Villa', 'House', 'Studio', 'Penthouse', 'Condo', 'Townhouse'])
    .withMessage('Please select a valid property type'),
  
  body('amenities')
    .isArray()
    .withMessage('Amenities must be an array'),
  
  body('amenities.*')
    .isIn(['WiFi', 'Parking', 'Security', 'Generator', 'Water Tank', 'Garden', 'Elevator', 'Modern Kitchen', 'Kitchen', 'Balcony', 'Maid Quarter', 'School Nearby', 'Near Transport', 'Historic Area', 'Furnished', 'City View', 'Pool', 'Swimming Pool', 'Gym', 'Laundry', 'Air Conditioning', 'Heating', 'Fireplace', 'Storage', 'Terrace', 'Garage', 'CCTV', 'Intercom', 'Backup Water', 'Solar Power', 'Satellite TV', 'Playground', 'Shopping Nearby'])
    .withMessage('Invalid amenity selected')
];

// Review validation
exports.validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters'),
  
  body('propertyId')
    .isMongoId()
    .withMessage('Invalid property ID')
];

// Password reset validation
exports.validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

// New password validation
exports.validateNewPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

// Review validation
exports.validateReview = [
  body('property')
    .notEmpty()
    .withMessage('Property ID is required')
    .isMongoId()
    .withMessage('Invalid property ID'),
  body('booking')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .withMessage('Invalid booking ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
  exports.handleValidationErrors
];

// Review update validation
exports.validateReviewUpdate = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
  exports.handleValidationErrors
];

// Property validation
// Booking validation
exports.validateBooking = [
  body('property')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom((value) => {
      // Check if it's a valid MongoDB ObjectId (24 hex characters)
      if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        throw new Error('Invalid property ID format');
      }
      return true;
    }),
  body('checkInDate')
    .notEmpty()
    .withMessage('Check-in date is required')
    .custom((value) => {
      const checkInDate = new Date(value);
      if (isNaN(checkInDate.getTime())) {
        throw new Error('Invalid check-in date format');
      }
      // Remove past date validation for demo purposes
      return true;
    }),
  body('checkOutDate')
    .notEmpty()
    .withMessage('Check-out date is required')
    .custom((value, { req }) => {
      const checkOutDate = new Date(value);
      if (isNaN(checkOutDate.getTime())) {
        throw new Error('Invalid check-out date format');
      }
      const checkInDate = new Date(req.body.checkInDate);
      if (checkOutDate <= checkInDate) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
  body('guests')
    .optional()
    .custom((value) => {
      // Handle both number and object formats, make very lenient
      if (value === undefined || value === null) {
        return true; // Will default to 1 in the route
      }
      if (typeof value === 'number') {
        if (value < 1 || value > 20) {
          throw new Error('Number of guests must be between 1 and 20');
        }
      } else if (typeof value === 'object') {
        if (value.adults && (value.adults < 1 || value.adults > 20)) {
          throw new Error('Adults must be between 1 and 20');
        }
        if (value.children && (value.children < 0 || value.children > 20)) {
          throw new Error('Children must be between 0 and 20');
        }
      }
      return true;
    }),
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Special requests cannot exceed 1000 characters'),
  body('totalAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  body('paymentMethod')
    .optional()
    .isIn(['chapa', 'telebirr', 'cbe-birr', 'cash', 'bank-transfer'])
    .withMessage('Invalid payment method'),
  body('guestDetails')
    .optional(),
  body('guestDetails.firstName')
    .optional()
    .trim(),
  body('guestDetails.lastName')
    .optional()
    .trim(),
  body('guestDetails.email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  body('guestDetails.phone')
    .optional()
    .trim()
];