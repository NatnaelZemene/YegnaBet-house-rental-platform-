import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { propertiesAPI } from '../../services/api.js';

function EditPropertyPage({ property, user, onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    propertyType: property?.propertyType || 'Apartment',
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    area: property?.area || '',
    floor: property?.floor || '',
    totalFloors: property?.totalFloors || '',
    
    // Location
    address: property?.location?.address || '',
    subcity: property?.location?.subcity || 'Bole',
    woreda: property?.location?.woreda || '',
    kebele: property?.location?.kebele || '',
    
    // Pricing
    monthly: property?.pricing?.monthly || '',
    deposit: property?.pricing?.deposit || '',
    
    // Features
    furnished: property?.features?.furnished || 'unfurnished',
    parkingSpaces: property?.features?.parkingSpaces || 0,
    yearBuilt: property?.features?.yearBuilt || '',
    
    // Amenities
    amenities: property?.amenities || [],
    
    // Availability
    availableFrom: property?.availability?.availableFrom ? 
      new Date(property.availability.availableFrom).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    minimumStay: property?.availability?.minimumStay || 1,
    maximumStay: property?.availability?.maximumStay || 12
  });

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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        propertyType: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        floor: formData.floor ? parseInt(formData.floor) : undefined,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
        
        location: {
          address: formData.address.trim(),
          subcity: formData.subcity,
          woreda: formData.woreda.trim(),
          kebele: formData.kebele.trim(),
          city: 'Addis Ababa',
          region: 'Addis Ababa'
        },
        
        pricing: {
          monthly: parseFloat(formData.monthly),
          deposit: parseFloat(formData.deposit) || 0,
          currency: 'ETB'
        },
        
        features: {
          furnished: formData.furnished,
          parkingSpaces: parseInt(formData.parkingSpaces) || 0,
          yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined
        },
        
        amenities: formData.amenities,
        
        availability: {
          isAvailable: true,
          availableFrom: new Date(formData.availableFrom),
          minimumStay: parseInt(formData.minimumStay),
          maximumStay: parseInt(formData.maximumStay)
        },
        
        status: 'pending' // Reset to pending for re-approval
      };

      console.log('Updating property:', propertyData);

      const response = await propertiesAPI.update(property._id, propertyData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onNavigate('owner-dashboard');
        }, 2000);
      } else {
        setError(response.error || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      setError(error.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
            <p className="text-gray-600 mb-4">
              The property you're trying to edit could not be found.
            </p>
            <Button onClick={() => onNavigate('owner-dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Updated!</h2>
            <p className="text-gray-600 mb-4">
              Your property has been updated and submitted for admin approval.
            </p>
            <Button onClick={() => onNavigate('owner-dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('owner-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
              <p className="text-gray-600">Update your property details</p>
            </div>
            <Badge variant="secondary">
              Status: {property.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Modern 2BR Apartment in Bole"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your property..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (m²) *
                  </label>
                  <Input
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="120"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms *
                  </label>
                  <Input
                    name="bedrooms"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    required
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
                    max="10"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parking Spaces
                  </label>
                  <Input
                    name="parkingSpaces"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.parkingSpaces}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-city *
                  </label>
                  <select
                    name="subcity"
                    value={formData.subcity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {subcities.map(subcity => (
                      <option key={subcity} value={subcity}>{subcity}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Woreda
                  </label>
                  <Input
                    name="woreda"
                    value={formData.woreda}
                    onChange={handleInputChange}
                    placeholder="e.g., 03"
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
                    placeholder="e.g., 12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing (ETB)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent (ETB) *
                  </label>
                  <Input
                    name="monthly"
                    type="number"
                    value={formData.monthly}
                    onChange={handleInputChange}
                    placeholder="25000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Security Deposit (ETB)
                  </label>
                  <Input
                    name="deposit"
                    type="number"
                    value={formData.deposit}
                    onChange={handleInputChange}
                    placeholder="50000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {commonAmenities.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('owner-dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Property
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPropertyPage;