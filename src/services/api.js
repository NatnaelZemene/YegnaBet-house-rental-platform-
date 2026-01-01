// API Configuration
const API_BASE_URL = 'http://localhost:5001/api/v1';

const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  PROPERTIES: {
    GET_ALL: '/properties',
    GET_BY_ID: (id) => `/properties/${id}`,
    CREATE: '/properties',
    UPDATE: (id) => `/properties/${id}`,
    DELETE: (id) => `/properties/${id}`,
    SEARCH: '/properties/search',
    FEATURED: '/properties/featured'
  },
  BOOKINGS: {
    GET_ALL: '/bookings',
    GET_BY_ID: (id) => `/bookings/${id}`,
    CREATE: '/bookings',
    UPDATE: (id) => `/bookings/${id}`,
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
    CONFIRM: (id) => `/bookings/${id}/confirm`,
    MY_BOOKINGS: '/bookings/my/bookings',
    OWNER_BOOKINGS: '/bookings/property-owner/bookings'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    PROPERTIES: '/admin/properties',
    PENDING_PROPERTIES: '/admin/properties/pending',
    BOOKINGS: '/admin/bookings',
    APPROVE_PROPERTY: (id) => `/admin/properties/${id}/approval`,
    ANALYTICS: '/admin/analytics'
  },
  PAYMENTS: {
    PROCESS: '/payments/process',
    STATUS: (bookingId) => `/payments/status/${bookingId}`,
    METHODS: '/payments/methods',
    CALCULATE_FEES: '/payments/calculate-fees',
    FINANCIAL_SUMMARY: '/payments/financial-summary',
    ADD_FUNDS: '/payments/add-funds'
  },
  REVIEWS: {
    GET_BY_PROPERTY: (propertyId) => `/reviews/property/${propertyId}`,
    GET_USER_REVIEWS: '/reviews/user',
    CREATE: '/reviews',
    UPDATE: (id) => `/reviews/${id}`,
    DELETE: (id) => `/reviews/${id}`,
    MARK_HELPFUL: (id) => `/reviews/${id}/helpful`,
    REPORT: (id) => `/reviews/${id}/report`,
    RESPOND: (id) => `/reviews/${id}/respond`
  },
  UPLOAD: {
    PROPERTY_IMAGES: '/upload/property-images',
    AVATAR: '/upload/avatar',
    REVIEW_IMAGES: '/upload/review-images',
    DELETE_IMAGE: (publicId) => `/upload/delete/${publicId}`
  },
  FAVORITES: {
    GET_ALL: '/favorites',
    ADD: (propertyId) => `/favorites/${propertyId}`,
    REMOVE: (propertyId) => `/favorites/${propertyId}`,
    CHECK: (propertyId) => `/favorites/check/${propertyId}`,
    ANALYTICS: (propertyId) => `/favorites/analytics/${propertyId}`
  },
  OWNER: {
    DASHBOARD: '/owner/dashboard',
    PROPERTIES: '/owner/properties',
    BOOKINGS: '/owner/bookings',
    FINANCIAL: '/owner/financial',
    UPDATE_BOOKING_STATUS: (bookingId) => `/owner/bookings/${bookingId}/status`
  }
};

const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

const getMultipartHeaders = (token) => ({
  'Authorization': `Bearer ${token}`
  // Don't set Content-Type for FormData, let browser set it with boundary
});

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('yegnabet_token');
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem('yegnabet_token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('yegnabet_token');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('yegnabet_user');
  return user ? JSON.parse(user) : null;
};

// Set current user in localStorage
export const setCurrentUser = (user) => {
  localStorage.setItem('yegnabet_user', JSON.stringify(user));
};

// Remove current user from localStorage
export const removeCurrentUser = () => {
  localStorage.removeItem('yegnabet_user');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const config = {
    method: options.method || HTTP_METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  // Don't stringify body if it's FormData
  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        removeToken();
        removeCurrentUser();
        window.location.href = '/login';
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
      } else if (response.status === 403) {
        throw new Error(ERROR_MESSAGES.FORBIDDEN);
      } else if (response.status === 404) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      } else if (response.status >= 500) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      } else {
        throw new Error(data.message || ERROR_MESSAGES.VALIDATION_ERROR);
      }
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: HTTP_METHODS.POST,
      body: { email, password }
    });
    
    if (response.success && response.token) {
      setToken(response.token);
      setCurrentUser(response.data.user);
    }
    
    return response;
  },

  register: async (userData) => {
    const response = await apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: HTTP_METHODS.POST,
      body: userData
    });
    
    if (response.success && response.token) {
      setToken(response.token);
      setCurrentUser(response.data.user);
    }
    
    return response;
  },

  logout: async () => {
    try {
      await apiRequest(API_ENDPOINTS.AUTH.LOGOUT, {
        method: HTTP_METHODS.POST
      });
    } finally {
      removeToken();
      removeCurrentUser();
    }
  },

  forgotPassword: async (email) => {
    return await apiRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: HTTP_METHODS.POST,
      body: { email }
    });
  },

  resetPassword: async (token, password) => {
    return await apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: HTTP_METHODS.PUT,
      body: { token, password }
    });
  }
};

// Properties API
export const propertiesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.PROPERTIES.GET_ALL}?${queryString}` : API_ENDPOINTS.PROPERTIES.GET_ALL;
    return await apiRequest(endpoint);
  },

  getById: async (id) => {
    return await apiRequest(API_ENDPOINTS.PROPERTIES.GET_BY_ID(id));
  },

  create: async (propertyData) => {
    return await apiRequest(API_ENDPOINTS.PROPERTIES.CREATE, {
      method: HTTP_METHODS.POST,
      body: propertyData
    });
  },

  update: async (id, propertyData) => {
    return await apiRequest(API_ENDPOINTS.PROPERTIES.UPDATE(id), {
      method: HTTP_METHODS.PUT,
      body: propertyData
    });
  },

  delete: async (id) => {
    return await apiRequest(API_ENDPOINTS.PROPERTIES.DELETE(id), {
      method: HTTP_METHODS.DELETE
    });
  },

  search: async (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    return await apiRequest(`${API_ENDPOINTS.PROPERTIES.SEARCH}?${queryString}`);
  },

  getFeatured: async () => {
    return await apiRequest(API_ENDPOINTS.PROPERTIES.FEATURED);
  }
};

// Bookings API
export const bookingsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.BOOKINGS.GET_ALL}?${queryString}` : API_ENDPOINTS.BOOKINGS.GET_ALL;
    return await apiRequest(endpoint);
  },

  getById: async (id) => {
    return await apiRequest(API_ENDPOINTS.BOOKINGS.GET_BY_ID(id));
  },

  create: async (bookingData) => {
    return await apiRequest(API_ENDPOINTS.BOOKINGS.CREATE, {
      method: HTTP_METHODS.POST,
      body: bookingData
    });
  },

  update: async (id, bookingData) => {
    return await apiRequest(API_ENDPOINTS.BOOKINGS.UPDATE(id), {
      method: HTTP_METHODS.PUT,
      body: bookingData
    });
  },

  updateStatus: async (id, status, rejectionReason = '') => {
    return await apiRequest(API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(id), {
      method: HTTP_METHODS.PUT,
      body: { status, rejectionReason }
    });
  },

  cancel: async (id, reason) => {
    return await apiRequest(API_ENDPOINTS.BOOKINGS.CANCEL(id), {
      method: HTTP_METHODS.PUT,
      body: { cancellationReason: reason }
    });
  },

  confirm: async (id) => {
    return await apiRequest(API_ENDPOINTS.BOOKINGS.CONFIRM(id), {
      method: HTTP_METHODS.POST
    });
  },

  getMyBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.BOOKINGS.MY_BOOKINGS}?${queryString}` : API_ENDPOINTS.BOOKINGS.MY_BOOKINGS;
    return await apiRequest(endpoint);
  },

  getOwnerBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.BOOKINGS.OWNER_BOOKINGS}?${queryString}` : API_ENDPOINTS.BOOKINGS.OWNER_BOOKINGS;
    return await apiRequest(endpoint);
  }
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    return await apiRequest(API_ENDPOINTS.USERS.PROFILE);
  },

  updateProfile: async (userData) => {
    return await apiRequest(API_ENDPOINTS.USERS.UPDATE_PROFILE, {
      method: HTTP_METHODS.PUT,
      body: userData
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return await apiRequest(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
      method: HTTP_METHODS.PUT,
      body: { currentPassword, newPassword }
    });
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return await apiRequest(API_ENDPOINTS.USERS.UPLOAD_AVATAR, {
      method: HTTP_METHODS.POST,
      headers: getMultipartHeaders(getToken()),
      body: formData
    });
  }
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    return await apiRequest(API_ENDPOINTS.ADMIN.DASHBOARD);
  },

  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.ADMIN.USERS}?${queryString}` : API_ENDPOINTS.ADMIN.USERS;
    return await apiRequest(endpoint);
  },

  getProperties: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.ADMIN.PROPERTIES}?${queryString}` : API_ENDPOINTS.ADMIN.PROPERTIES;
    return await apiRequest(endpoint);
  },

  getPendingProperties: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.ADMIN.PENDING_PROPERTIES}?${queryString}` : API_ENDPOINTS.ADMIN.PENDING_PROPERTIES;
    return await apiRequest(endpoint);
  },

  getBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.ADMIN.BOOKINGS}?${queryString}` : API_ENDPOINTS.ADMIN.BOOKINGS;
    return await apiRequest(endpoint);
  },

  approveProperty: async (id, approved, reason = '') => {
    return await apiRequest(API_ENDPOINTS.ADMIN.APPROVE_PROPERTY(id), {
      method: HTTP_METHODS.PUT,
      body: { status: approved ? 'approved' : 'rejected', rejectionReason: reason }
    });
  },

  getAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.ADMIN.ANALYTICS}?${queryString}` : API_ENDPOINTS.ADMIN.ANALYTICS;
    return await apiRequest(endpoint);
  }
};

// Payments API
export const paymentsAPI = {
  process: async (bookingId, paymentMethod, paymentDetails) => {
    return await apiRequest(API_ENDPOINTS.PAYMENTS.PROCESS, {
      method: HTTP_METHODS.POST,
      body: { bookingId, paymentMethod, paymentDetails }
    });
  },

  getStatus: async (bookingId) => {
    return await apiRequest(API_ENDPOINTS.PAYMENTS.STATUS(bookingId));
  },

  getMethods: async () => {
    return await apiRequest(API_ENDPOINTS.PAYMENTS.METHODS);
  },

  calculateFees: async (amount, paymentMethod) => {
    return await apiRequest(API_ENDPOINTS.PAYMENTS.CALCULATE_FEES, {
      method: HTTP_METHODS.POST,
      body: { amount, paymentMethod }
    });
  },

  getFinancialSummary: async () => {
    return await apiRequest(API_ENDPOINTS.PAYMENTS.FINANCIAL_SUMMARY);
  },

  addFunds: async (amount, description) => {
    return await apiRequest(API_ENDPOINTS.PAYMENTS.ADD_FUNDS, {
      method: HTTP_METHODS.POST,
      body: { amount, description }
    });
  }
};

// Reviews API
export const reviewsAPI = {
  getByProperty: async (propertyId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? 
      `${API_ENDPOINTS.REVIEWS.GET_BY_PROPERTY(propertyId)}?${queryString}` : 
      API_ENDPOINTS.REVIEWS.GET_BY_PROPERTY(propertyId);
    return await apiRequest(endpoint);
  },

  getUserReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.REVIEWS.GET_USER_REVIEWS}?${queryString}` : API_ENDPOINTS.REVIEWS.GET_USER_REVIEWS;
    return await apiRequest(endpoint);
  },

  create: async (reviewData, images = []) => {
    const formData = new FormData();
    
    // Add review data
    Object.keys(reviewData).forEach(key => {
      if (Array.isArray(reviewData[key])) {
        reviewData[key].forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, reviewData[key]);
      }
    });
    
    // Add images
    images.forEach(image => {
      formData.append('images', image);
    });
    
    return await apiRequest(API_ENDPOINTS.REVIEWS.CREATE, {
      method: HTTP_METHODS.POST,
      headers: getMultipartHeaders(getToken()),
      body: formData
    });
  },

  update: async (id, reviewData, images = []) => {
    const formData = new FormData();
    
    Object.keys(reviewData).forEach(key => {
      if (Array.isArray(reviewData[key])) {
        reviewData[key].forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, reviewData[key]);
      }
    });
    
    images.forEach(image => {
      formData.append('images', image);
    });
    
    return await apiRequest(API_ENDPOINTS.REVIEWS.UPDATE(id), {
      method: HTTP_METHODS.PUT,
      headers: getMultipartHeaders(getToken()),
      body: formData
    });
  },

  delete: async (id) => {
    return await apiRequest(API_ENDPOINTS.REVIEWS.DELETE(id), {
      method: HTTP_METHODS.DELETE
    });
  },

  markHelpful: async (id) => {
    return await apiRequest(API_ENDPOINTS.REVIEWS.MARK_HELPFUL(id), {
      method: HTTP_METHODS.POST
    });
  },

  report: async (id, reason, description) => {
    return await apiRequest(API_ENDPOINTS.REVIEWS.REPORT(id), {
      method: HTTP_METHODS.POST,
      body: { reason, description }
    });
  },

  respond: async (id, message) => {
    return await apiRequest(API_ENDPOINTS.REVIEWS.RESPOND(id), {
      method: HTTP_METHODS.POST,
      body: { message }
    });
  }
};

// Upload API
export const uploadAPI = {
  propertyImages: async (images) => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    
    // Create a timeout promise for image upload
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Image upload timeout')), 30000); // 30 seconds
    });
    
    const uploadPromise = apiRequest(API_ENDPOINTS.UPLOAD.PROPERTY_IMAGES, {
      method: HTTP_METHODS.POST,
      headers: getMultipartHeaders(getToken()),
      body: formData
    });
    
    // Race between upload and timeout
    return await Promise.race([uploadPromise, timeoutPromise]);
  },

  avatar: async (image) => {
    const formData = new FormData();
    formData.append('avatar', image);
    
    return await apiRequest(API_ENDPOINTS.UPLOAD.AVATAR, {
      method: HTTP_METHODS.POST,
      headers: getMultipartHeaders(getToken()),
      body: formData
    });
  },

  reviewImages: async (images) => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    
    return await apiRequest(API_ENDPOINTS.UPLOAD.REVIEW_IMAGES, {
      method: HTTP_METHODS.POST,
      headers: getMultipartHeaders(getToken()),
      body: formData
    });
  },

  deleteImage: async (publicId) => {
    return await apiRequest(API_ENDPOINTS.UPLOAD.DELETE_IMAGE(publicId), {
      method: HTTP_METHODS.DELETE
    });
  }
};

// Favorites API
export const favoritesAPI = {
  getAll: async () => {
    return await apiRequest(API_ENDPOINTS.FAVORITES.GET_ALL);
  },

  add: async (propertyId) => {
    return await apiRequest(API_ENDPOINTS.FAVORITES.ADD(propertyId), {
      method: HTTP_METHODS.POST
    });
  },

  remove: async (propertyId) => {
    return await apiRequest(API_ENDPOINTS.FAVORITES.REMOVE(propertyId), {
      method: HTTP_METHODS.DELETE
    });
  },

  check: async (propertyId) => {
    return await apiRequest(API_ENDPOINTS.FAVORITES.CHECK(propertyId));
  },

  getAnalytics: async (propertyId) => {
    return await apiRequest(API_ENDPOINTS.FAVORITES.ANALYTICS(propertyId));
  }
};

// Owner Dashboard API
export const ownerAPI = {
  getDashboard: async () => {
    return await apiRequest(API_ENDPOINTS.OWNER.DASHBOARD);
  },

  getProperties: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.OWNER.PROPERTIES}?${queryString}` : API_ENDPOINTS.OWNER.PROPERTIES;
    return await apiRequest(endpoint);
  },

  getBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.OWNER.BOOKINGS}?${queryString}` : API_ENDPOINTS.OWNER.BOOKINGS;
    return await apiRequest(endpoint);
  },

  getFinancial: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.OWNER.FINANCIAL}?${queryString}` : API_ENDPOINTS.OWNER.FINANCIAL;
    return await apiRequest(endpoint);
  },

  updateBookingStatus: async (bookingId, status, reason = '') => {
    return await apiRequest(API_ENDPOINTS.OWNER.UPDATE_BOOKING_STATUS(bookingId), {
      method: HTTP_METHODS.PUT,
      body: { status, reason }
    });
  },

  updatePropertyStatus: async (propertyId, status) => {
    return await apiRequest(`${API_ENDPOINTS.OWNER.PROPERTIES}/${propertyId}/status`, {
      method: HTTP_METHODS.PUT,
      body: { status }
    });
  }
};

// Health check
export const healthCheck = async () => {
  return await apiRequest('/health', { method: HTTP_METHODS.GET });
};

export default {
  auth: authAPI,
  properties: propertiesAPI,
  bookings: bookingsAPI,
  users: usersAPI,
  admin: adminAPI,
  payments: paymentsAPI,
  reviews: reviewsAPI,
  upload: uploadAPI,
  favorites: favoritesAPI,
  owner: ownerAPI,
  healthCheck
};