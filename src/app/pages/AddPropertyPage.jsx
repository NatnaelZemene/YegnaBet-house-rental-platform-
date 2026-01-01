import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft,
  Upload,
  X,
  MapPin,
  Home,
  DollarSign,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  Eye,
  Clock
} from 'lucide-react';
import { propertiesAPI, uploadAPI } from '../../services/api.js';

function AddPropertyPage({ user, onNavigate, onPropertyAdded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    floor: '',
    totalFloors: '',
    
    // Location
    address: '',
    subcity: 'Bole',
    woreda: '',
    kebele: '',
    coordinates: { latitude: null, longitude: null }, // Optional coordinates
    
    // Pricing
    monthly: '',
    deposit: '',
    utilities: {
      electricity: false,
      water: false,
      internet: false,
      gas: false,
      maintenance: false
    },
    
    // Features
    furnished: 'unfurnished',
    parkingSpaces: 0,
    yearBuilt: '',
    
    // Amenities
    amenities: [],
    
    // Images
    images: [],
    
    // Availability
    availableFrom: new Date().toISOString().split('T')[0],
    minimumStay: 1,
    maximumStay: 12
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const subcities = [
    'Addis Ketema', 'Akaky Kaliti', 'Arada', 'Bole', 'Gullele',
    'Kirkos', 'Kolfe Keranio', 'Lideta', 'Nifas Silk-Lafto', 'Yeka'
  ];

  const propertyTypes = [
    'Apartment', 'Villa', 'House', 'Studio', 'Penthouse', 'Condo', 'Townhouse'
  ];

  const commonAmenities = [
    'WiFi', 'Air Conditioning', 'Heating', 'Kitchen', 'Laundry', 'Parking',
    'Security', 'Generator', 'Water Tank', 'Garden', 'Balcony', 'Elevator',
    'Gym', 'Swimming Pool', 'Playground', 'CCTV', 'Intercom', 'Backup Water'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were skipped. Only image files under 10MB are allowed.');
    }

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, {
          file,
          url: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) return [];

    try {
      setUploadingImages(true);
      console.log('🖼️ Starting image upload...', selectedImages.length, 'images');
      
      const response = await uploadAPI.propertyImages(selectedImages);
      
      if (response.success) {
        console.log('✅ Images uploaded successfully:', response.data.images.length);
        return response.data.images.map(img => img.url);
      } else {
        throw new Error('Failed to upload images');
      }
    } catch (error) {
      console.error('❌ Error uploading images:', error);
      
      // More specific error messages
      if (error.message.includes('timeout')) {
        throw new Error('Image upload timed out. Please try with smaller images or fewer images at once.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error during image upload. Please check your connection and try again.');
      } else if (error.message.includes('size')) {
        throw new Error('One or more images are too large. Please use images smaller than 10MB.');
      } else {
        throw new Error('Failed to upload images. You can still submit the property without images and add them later.');
      }
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Client-side validation
      if (formData.description.trim().length < 20) {
        setError('Description must be at least 20 characters long');
        setLoading(false);
        return;
      }

      if (formData.title.trim().length < 5) {
        setError('Title must be at least 5 characters long');
        setLoading(false);
        return;
      }

      if (!formData.monthly || parseFloat(formData.monthly) < 1000) {
        setError('Monthly rent must be at least 1,000 ETB');
        setLoading(false);
        return;
      }

      if (!formData.area || parseFloat(formData.area) < 10) {
        setError('Area must be at least 10 square meters');
        setLoading(false);
        return;
      }

      console.log('🚀 Starting property submission...');
      
      // Upload images first
      let imageUrls = [];
      let imageUploadWarning = '';
      
      if (selectedImages.length > 0) {
        console.log('📸 Uploading images...');
        try {
          imageUrls = await uploadImages();
          console.log('✅ Images uploaded successfully');
        } catch (uploadError) {
          console.warn('⚠️ Image upload failed, continuing without images:', uploadError);
          imageUploadWarning = uploadError.message;
          // Continue without images if upload fails
          imageUrls = [];
        }
      }

      // Prepare property data
      const propertyData = {
        ...formData,
        images: imageUrls.length > 0 ? imageUrls.map((url, index) => ({
          url,
          isPrimary: index === 0, // First image is primary
          uploadedAt: new Date()
        })) : [], // Empty array if no images uploaded
        pricing: {
          monthly: parseFloat(formData.monthly),
          deposit: parseFloat(formData.deposit),
          utilities: formData.utilities
        },
        location: {
          address: formData.address,
          subcity: formData.subcity,
          woreda: formData.woreda,
          kebele: formData.kebele,
          city: 'Addis Ababa',
          region: 'Addis Ababa',
          country: 'Ethiopia',
          coordinates: (formData.coordinates?.latitude && formData.coordinates?.longitude) ? {
            latitude: formData.coordinates.latitude,
            longitude: formData.coordinates.longitude
          } : undefined
        },
        features: {
          furnished: formData.furnished,
          parkingSpaces: parseInt(formData.parkingSpaces),
          yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined
        },
        availability: {
          available: true,
          availableFrom: new Date(formData.availableFrom),
          minimumStay: parseInt(formData.minimumStay),
          maximumStay: parseInt(formData.maximumStay)
        },
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        floor: formData.floor ? parseInt(formData.floor) : undefined,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
        status: 'pending' // Properties need admin approval
      };

      console.log('📝 Property data prepared:', {
        title: propertyData.title,
        location: propertyData.location,
        hasCoordinates: !!propertyData.location.coordinates,
        status: propertyData.status
      });

      // Create property
      console.log('🏠 Creating property...');
      const response = await propertiesAPI.create(propertyData);
      
      if (response.success) {
        console.log('✅ Property created successfully:', response.data._id);
        setSuccess(true);
        
        // Show image upload warning if there was one
        if (imageUploadWarning) {
          setError(`Property created successfully! Note: ${imageUploadWarning}`);
          setTimeout(() => setError(null), 5000); // Clear after 5 seconds
        }
        
        // Refresh the properties list
        if (onPropertyAdded) {
          onPropertyAdded();
        }
        setTimeout(() => {
          onNavigate('owner-dashboard');
        }, 2000);
      } else {
        console.error('❌ Property creation failed:', response.error);
        throw new Error(response.error || 'Failed to create property');
      }

    } catch (error) {
      console.error('💥 Property creation error:', error);
      
      // More specific error handling
      if (error.message && error.message.includes('network')) {
        setError('Network connection error. Please check your internet connection and try again.');
      } else if (error.message && error.message.includes('validation')) {
        setError('Please check all required fields and try again.');
      } else if (error.message && error.message.includes('coordinates')) {
        setError('Invalid GPS coordinates. Please check the latitude and longitude values.');
      } else {
        setError(error.message || 'Failed to create property. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your property has been submitted and is now <strong>pending admin approval</strong>. 
              You'll be notified once it's reviewed and approved.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-800">
                <strong>Next Steps:</strong><br/>
                • Admin will review your property<br/>
                • You'll receive approval notification<br/>
                • Property will be visible to renters after approval
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => onNavigate('owner-dashboard')} className="w-full">
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => onNavigate('owner-notifications')} 
                variant="outline" 
                className="w-full"
              >
                View Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('owner-dashboard')}
            className="mb-2 p-2 sm:p-3"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-sm sm:text-base text-gray-600">Submit your property for admin approval</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title * (minimum 5 characters)
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Modern 2BR Apartment in Bole"
                  required
                  minLength={5}
                  className="h-11 sm:h-10 text-base sm:text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/5 characters minimum
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description * (minimum 20 characters)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your property in detail - location, features, amenities, nearby attractions, etc. (minimum 20 characters required)"
                  required
                  minLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/20 characters minimum
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full h-11 sm:h-10 px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (sqm) *
                  </label>
                  <Input
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="120"
                    required
                    className="h-11 sm:h-10 text-base sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms *
                  </label>
                  <Input
                    name="bedrooms"
                    type="number"
                    min="0"
                    max="20"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    required
                    className="h-11 sm:h-10 text-base sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms *
                  </label>
                  <Input
                    name="bathrooms"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    required
                    className="h-11 sm:h-10 text-base sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor
                  </label>
                  <Input
                    name="floor"
                    type="number"
                    min="0"
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="2"
                    className="h-11 sm:h-10 text-base sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Floors
                  </label>
                  <Input
                    name="totalFloors"
                    type="number"
                    min="1"
                    value={formData.totalFloors}
                    onChange={handleInputChange}
                    placeholder="5"
                    className="h-11 sm:h-10 text-base sm:text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., Near Edna Mall, Bole Road"
                  required
                  className="h-11 sm:h-10 text-base sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcity *
                  </label>
                  <select
                    name="subcity"
                    value={formData.subcity}
                    onChange={handleInputChange}
                    className="w-full h-11 sm:h-10 px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {subcities.map(subcity => (
                      <option key={subcity} value={subcity}>{subcity}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Woreda *
                  </label>
                  <Input
                    name="woreda"
                    value={formData.woreda}
                    onChange={handleInputChange}
                    placeholder="e.g., Woreda 03"
                    required
                    className="h-11 sm:h-10 text-base sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kebele
                  </label>
                  <Input
                    name="kebele"
                    value={formData.kebele}
                    onChange={handleInputChange}
                    placeholder="e.g., Kebele 15"
                    className="h-11 sm:h-10 text-base sm:text-sm"
                  />
                </div>
              </div>

              {/* Optional GPS Coordinates */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">📍 GPS Coordinates (Optional)</h4>
                <p className="text-sm text-blue-700 mb-3">
                  You can add exact GPS coordinates for better location accuracy. This is optional and can be added later.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Latitude
                    </label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="9.0320 (optional)"
                      value={formData.coordinates?.latitude || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          coordinates: {
                            ...prev.coordinates,
                            latitude: value ? parseFloat(value) : null
                          }
                        }));
                      }}
                      className="text-sm h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Longitude
                    </label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="38.7469 (optional)"
                      value={formData.coordinates?.longitude || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          coordinates: {
                            ...prev.coordinates,
                            longitude: value ? parseFloat(value) : null
                          }
                        }));
                      }}
                      className="text-sm h-10"
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  💡 Tip: You can find coordinates by right-clicking on Google Maps and selecting the coordinates.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent (ETB) * (minimum 1,000 ETB)
                  </label>
                  <Input
                    name="monthly"
                    type="number"
                    min="1000"
                    value={formData.monthly}
                    onChange={handleInputChange}
                    placeholder="25000"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 1,000 ETB required
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Security Deposit (ETB) *
                  </label>
                  <Input
                    name="deposit"
                    type="number"
                    min="0"
                    value={formData.deposit}
                    onChange={handleInputChange}
                    placeholder="50000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Utilities Included
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.keys(formData.utilities).map(utility => (
                    <label key={utility} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={`utilities.${utility}`}
                        checked={formData.utilities[utility]}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{utility}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features & Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Furnished Status
                  </label>
                  <select
                    name="furnished"
                    value={formData.furnished}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi_furnished">Semi Furnished</option>
                    <option value="fully_furnished">Fully Furnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parking Spaces
                  </label>
                  <Input
                    name="parkingSpaces"
                    type="number"
                    min="0"
                    value={formData.parkingSpaces}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Built
                  </label>
                  <Input
                    name="yearBuilt"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    placeholder="2020"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {commonAmenities.map(amenity => (
                    <label
                      key={amenity}
                      className={`flex items-center space-x-2 p-2 border rounded cursor-pointer ${
                        formData.amenities.includes(amenity)
                          ? 'bg-blue-50 border-blue-300'
                          : 'border-gray-300'
                      }`}
                      onClick={() => handleAmenityToggle(amenity)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => {}} // Handled by label click
                        className="rounded"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">📸 Image Upload Information</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Images are optional - you can submit your property without images</li>
                  <li>• You can add or update images later from your dashboard</li>
                  <li>• Maximum 10MB per image, PNG/JPG/JPEG formats supported</li>
                  <li>• First image will be used as the primary listing image</li>
                  <li>• If upload fails, your property will still be submitted successfully</li>
                </ul>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (Max 10MB each)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click to upload images or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB each</p>
                  </label>
                </div>
              </div>

              {imagePreview.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Selected Images ({imagePreview.length})
                    </p>
                    {uploadingImages && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Uploading images...</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                          disabled={uploadingImages}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2">
                            <Badge className="text-xs bg-blue-600 text-white">
                              Primary
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 The first image will be used as the primary image for your property listing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available From
                  </label>
                  <Input
                    name="availableFrom"
                    type="date"
                    value={formData.availableFrom}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stay (months)
                  </label>
                  <Input
                    name="minimumStay"
                    type="number"
                    min="1"
                    value={formData.minimumStay}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Stay (months)
                  </label>
                  <Input
                    name="maximumStay"
                    type="number"
                    min="1"
                    value={formData.maximumStay}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('owner-dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadingImages}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {uploadingImages ? 'Uploading Images...' : 'Creating Property...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Submit for Approval
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPropertyPage;