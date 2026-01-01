const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const path = require('path');

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

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  }
});

// Middleware to upload multiple images
const uploadImages = upload.array('images', 10);

// Middleware to upload single image
const uploadSingle = upload.single('image');

// Middleware to upload avatar
const uploadAvatar = upload.single('avatar');

// Middleware to process uploaded images
const processImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const processedImages = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      try {
        // Process image with Sharp
        const processedBuffer = await sharp(file.buffer)
          .resize(1200, 800, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({
            quality: 85,
            progressive: true
          })
          .toBuffer();

        // Create thumbnail
        const thumbnailBuffer = await sharp(file.buffer)
          .resize(400, 300, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({
            quality: 80
          })
          .toBuffer();

        // Upload main image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: getCloudinaryFolder(req.route.path),
              public_id: `${getImagePrefix(req.route.path)}_${Date.now()}_${i}`,
              transformation: [
                { width: 1200, height: 800, crop: 'fill', quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(processedBuffer);
        });

        // Upload thumbnail
        const thumbnailResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: `${getCloudinaryFolder(req.route.path)}/thumbnails`,
              public_id: `${getImagePrefix(req.route.path)}_thumb_${Date.now()}_${i}`,
              transformation: [
                { width: 400, height: 300, crop: 'fill', quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(thumbnailBuffer);
        });

        processedImages.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          thumbnail: {
            url: thumbnailResult.secure_url,
            publicId: thumbnailResult.public_id
          },
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          size: uploadResult.bytes,
          originalName: file.originalname
        });
      } catch (error) {
        console.error(`Error processing image ${i}:`, error);
        // Continue with other images even if one fails
        continue;
      }
    }

    req.processedImages = processedImages;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to process single image
const processSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const file = req.file;
    
    // Determine image dimensions based on type
    let width = 800;
    let height = 600;
    
    if (req.route.path.includes('avatar')) {
      width = 300;
      height = 300;
    } else if (req.route.path.includes('property')) {
      width = 1200;
      height = 800;
    }

    // Process image with Sharp
    const processedBuffer = await sharp(file.buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 90
      })
      .toBuffer();

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: getCloudinaryFolder(req.route.path),
          public_id: `${getImagePrefix(req.route.path)}_${req.user?.id || 'anonymous'}_${Date.now()}`,
          transformation: [
            { width, height, crop: 'fill', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(processedBuffer);
    });

    req.processedImage = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      size: uploadResult.bytes,
      originalName: file.originalname
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Helper function to get Cloudinary folder based on route
function getCloudinaryFolder(routePath) {
  if (routePath.includes('property')) {
    return 'yegnabet/properties';
  } else if (routePath.includes('avatar')) {
    return 'yegnabet/avatars';
  } else if (routePath.includes('review')) {
    return 'yegnabet/reviews';
  }
  return 'yegnabet/misc';
}

// Helper function to get image prefix based on route
function getImagePrefix(routePath) {
  if (routePath.includes('property')) {
    return 'property';
  } else if (routePath.includes('avatar')) {
    return 'avatar';
  } else if (routePath.includes('review')) {
    return 'review';
  }
  return 'image';
}

// Middleware to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

// Middleware to delete multiple images
const deleteImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => cloudinary.uploader.destroy(publicId));
    const results = await Promise.all(deletePromises);
    return results.every(result => result.result === 'ok');
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    return false;
  }
};

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
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
};

module.exports = {
  uploadImages,
  uploadSingle,
  uploadAvatar,
  processImages,
  processSingleImage,
  deleteImage,
  deleteImages,
  handleUploadError
};