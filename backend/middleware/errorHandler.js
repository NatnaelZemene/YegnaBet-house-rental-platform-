const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      statusCode: 404,
      code: 'RESOURCE_NOT_FOUND'
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = 'Duplicate field value entered';
    const field = Object.keys(err.keyValue)[0];
    
    if (field === 'email') {
      message = 'Email address is already registered';
    } else if (field === 'phone') {
      message = 'Phone number is already registered';
    }
    
    error = {
      message,
      statusCode: 400,
      code: 'DUPLICATE_FIELD'
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400,
      code: 'VALIDATION_ERROR'
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      statusCode: 401,
      code: 'INVALID_TOKEN'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      statusCode: 401,
      code: 'TOKEN_EXPIRED'
    };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      message: 'File too large. Maximum size is 5MB',
      statusCode: 400,
      code: 'FILE_TOO_LARGE'
    };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = {
      message: 'Too many files. Maximum is 10 files',
      statusCode: 400,
      code: 'TOO_MANY_FILES'
    };
  }

  // Payment errors
  if (err.type === 'StripeCardError') {
    error = {
      message: 'Payment failed. Please check your card details',
      statusCode: 400,
      code: 'PAYMENT_FAILED'
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    code: error.code || 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;