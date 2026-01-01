const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to find user in User collection first
    let user = await User.findById(decoded.id).select('-password');
    
    // If not found in User collection, try Owner collection
    if (!user) {
      const Owner = require('../models/Owner');
      user = await Owner.findById(decoded.id).select('-password');
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
      code: 'INVALID_TOKEN'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this route`,
        code: 'FORBIDDEN'
      });
    }
    next();
  };
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
      code: 'ADMIN_ONLY'
    });
  }
};

// Check if user is owner or admin
exports.isOwnerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'owner' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Property owner or admin access required',
      code: 'OWNER_OR_ADMIN_ONLY'
    });
  }
};
