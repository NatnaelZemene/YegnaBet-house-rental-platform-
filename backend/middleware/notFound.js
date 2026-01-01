const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
    availableRoutes: {
      auth: '/api/v1/auth',
      properties: '/api/v1/properties',
      bookings: '/api/v1/bookings',
      users: '/api/v1/users',
      admin: '/api/v1/admin',
      upload: '/api/v1/upload'
    }
  });
};

module.exports = notFound;