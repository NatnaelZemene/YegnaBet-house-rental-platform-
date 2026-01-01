import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Heart, 
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { favoritesAPI } from '../../services/api.js';

function PropertyCard({ 
  property,
  onClick,
  onNavigate,
  isFavorite = false,
  onToggleFavorite
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (onNavigate) {
      onNavigate('property-details', property);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (isUpdatingFavorite) return; // Prevent multiple clicks
    
    try {
      setIsUpdatingFavorite(true);
      
      const propertyId = property._id || property.id;
      
      if (isFavorite) {
        // Remove from favorites
        await favoritesAPI.remove(propertyId);
      } else {
        // Add to favorites
        await favoritesAPI.add(propertyId);
      }
      
      // Call parent component's toggle function
      if (onToggleFavorite) {
        onToggleFavorite(propertyId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // You can add a toast notification here
      alert('Failed to update favorites. Please try again.');
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const propertyUrl = `${window.location.origin}?property=${property.id}`;
    navigator.clipboard.writeText(propertyUrl);
    // You can add a toast notification here
    console.log('Property link copied to clipboard!');
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const imageCount = property.images?.length || 0;
    setCurrentImageIndex((prev) => 
      prev === imageCount - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const imageCount = property.images?.length || 0;
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageCount - 1 : prev - 1
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-500 text-white';
      case 'rented':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group">
      <div 
        className="relative h-48 overflow-hidden"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        onClick={handleCardClick}
      >
        {/* Main Image */}
        <img 
          src={property.images?.[currentImageIndex]?.url || property.images?.[currentImageIndex] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center'} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center';
          }}
        />

        {/* Image Navigation - Show on hover if multiple images */}
        {property.images?.length > 1 && isImageHovered && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full shadow-md opacity-90 hover:opacity-100"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full shadow-md opacity-90 hover:opacity-100"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Indicators */}
        {property.images?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Featured Badge */}
        {property.stats?.featured && (
          <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
            Featured
          </Badge>
        )}

        {/* Status Badge */}
        <Badge className={`absolute top-3 right-3 ${getStatusColor(property.status)}`}>
          {property.status}
        </Badge>

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleFavorite && (
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={handleFavoriteClick}
              disabled={isUpdatingFavorite}
            >
              <Heart 
                className={`h-4 w-4 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                } ${isUpdatingFavorite ? 'animate-pulse' : ''}`} 
              />
            </Button>
          )}
          
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-md"
            onClick={handleShareClick}
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4" onClick={handleCardClick}>
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 text-gray-900">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {property.stats?.rating?.average?.toFixed(1) || '0.0'}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {property.location?.subcity}, {property.location?.woreda}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{property.area} m²</span>
          </div>
        </div>

        {/* Price and Type */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ETB {property.pricing?.monthly?.toLocaleString() || '0'}
            </span>
            <span className="text-sm text-gray-600">/month</span>
          </div>
          <Badge variant="outline" className="text-gray-700 border-gray-300">
            {property.propertyType}
          </Badge>
        </div>

        {/* Amenities Preview */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-gray-100 text-gray-700"
                >
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PropertyCard;