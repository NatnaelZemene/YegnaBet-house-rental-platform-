const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { protect, authorize } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  }
});

// @desc    Upload property images
// @route   POST /api/v1/upload/property-images
// @access  Private (Property owners and admins)
router.post('/property-images', protect, authorize('admin', 'owner'), upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map(async (file, index) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'yegnabet/properties',
            public_id: `property_${req.user.id}_${Date.now()}_${index}`,
            transformation: [
              { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                originalName: file.originalname,
                size: result.bytes,
                width: result.width,
                height: result.height
              });
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: {
        images: imageUrls
      }
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      error: 'Server error uploading images',
      code: 'UPLOAD_ERROR'
    });
  }
});
// @desc    Upload user avatar
// @route   POST /api/v1/upload/avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No avatar image uploaded'
      });
    }

    // For development, return a mock avatar URL
    const avatarUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face`;

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        url: avatarUrl,
        publicId: `avatar_${req.user.id}_${Date.now()}`,
        width: 300,
        height: 300
      }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      error: 'Server error uploading avatar',
      code: 'AVATAR_UPLOAD_ERROR'
    });
  }
});

// @desc    Upload review images
// @route   POST /api/v1/upload/review-images
// @access  Private
router.post('/review-images', protect, upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // For development, return mock review image URLs
    const imageUrls = req.files.map((file, index) => ({
      url: `https://images.unsplash.com/photo-${1600000000000 + index}?w=800&h=600&fit=crop&crop=center`,
      publicId: `review_${req.user.id}_${Date.now()}_${index}`,
      originalName: file.originalname,
      width: 800,
      height: 600
    }));

    res.status(200).json({
      success: true,
      message: `${imageUrls.length} review images uploaded successfully`,
      data: imageUrls
    });
  } catch (error) {
    console.error('Error uploading review images:', error);
    res.status(500).json({
      success: false,
      error: 'Server error uploading review images',
      code: 'REVIEW_IMAGES_UPLOAD_ERROR'
    });
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/v1/upload/delete/:publicId
// @access  Private
router.delete('/delete/:publicId', protect, async (req, res, next) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting image',
      code: 'DELETE_IMAGE_ERROR'
    });
  }
});

// @desc    Get upload statistics (mock implementation)
// @route   GET /api/v1/upload/stats
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin'), async (req, res, next) => {
  try {
    // Mock upload statistics for development
    res.status(200).json({
      success: true,
      data: {
        storage: {
          used: 1024 * 1024 * 100, // 100MB
          limit: 1024 * 1024 * 1024 * 10, // 10GB
          percentage: 1
        },
        bandwidth: {
          used: 1024 * 1024 * 50, // 50MB
          limit: 1024 * 1024 * 1024 * 100, // 100GB
          percentage: 0.05
        },
        requests: 1250,
        resources: 450,
        folders: {
          properties: 320,
          avatars: 85,
          reviews: 45
        }
      }
    });
  } catch (error) {
    console.error('Error fetching upload stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching upload statistics',
      code: 'UPLOAD_STATS_ERROR'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed'
    });
  }

  next(error);
});

module.exports = router;