import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Heart,
  Share2,
  Calendar,
  Users,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Trees,
  Shield,
  Phone,
  Mail,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import PropertyGallery from '../components/PropertyGallery';
import PropertyMap from '../components/PropertyMap';

function PropertyDetailsPage({ property, user, onNavigate }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto text-center">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Property not found</h1>
            <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => onNavigate('home')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically make an API call to save the favorite
    console.log('Toggled favorite for property:', property.id);
  };

  const handleShare = () => {
    const propertyUrl = `${window.location.origin}?property=${property.id}`;
    navigator.clipboard.writeText(propertyUrl);
    console.log('Property link copied to clipboard!');
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

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'WiFi': Wifi,
      'Parking': Car,
      'Pool': Waves,
      'Gym': Dumbbell,
      'Garden': Trees,
      'Security': Shield,
      'Air Conditioning': Waves,
      'Balcony': Trees,
      'Fireplace': Trees,
      'Pet Friendly': Heart,
      'Laundry': Waves,
      'High Ceilings': Maximize,
      'Exposed Brick': Shield,
      'Water View': Waves,
      'Marina Access': Waves,
      'Rooftop Terrace': Trees,
      'Concierge': Users,
      'Valet Parking': Car,
      'Spa': Waves,
      'Wine Cellar': Shield,
      'Smart Home': Wifi
    };
    
    const IconComponent = iconMap[amenity] || Shield;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="mb-2 p-2 sm:p-3"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="text-sm sm:text-base">Back to Properties</span>
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">{property.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm sm:text-base truncate">{property.location?.subcity}, {property.location?.woreda}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current flex-shrink-0" />
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">
                    {property.stats?.rating?.average?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <Badge className={`${getStatusColor(property.status)} text-xs sm:text-sm w-fit`}>
                  {property.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavoriteToggle}
                className="h-9 w-9 sm:h-10 sm:w-10"
              >
                <Heart 
                  className={`h-4 w-4 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`} 
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="h-9 w-9 sm:h-10 sm:w-10"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Image Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Property Details */}
            <Card>
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Bed className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold text-sm sm:text-base">{property.bedrooms}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Bath className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold text-sm sm:text-base">{property.bathrooms}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Maximize className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold text-sm sm:text-base">{property.area}</div>
                    <div className="text-xs sm:text-sm text-gray-600">m²</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold text-sm sm:text-base">{property.stats?.rating?.average?.toFixed(1) || '0.0'}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Rating</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Description</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{property.description}</p>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Amenities</h3>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {(showAllAmenities ? property.amenities : property.amenities.slice(0, 6)).map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                          {getAmenityIcon(amenity)}
                          <span className="text-sm sm:text-base text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-500">No amenities listed</p>
                  )}
                  {property.amenities && property.amenities.length > 6 && (
                    <Button
                      variant="ghost"
                      onClick={() => setShowAllAmenities(!showAllAmenities)}
                      className="mt-3 text-sm sm:text-base"
                    >
                      {showAllAmenities ? 'Show Less' : `Show All ${property.amenities.length} Amenities`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card>
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl">Location</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <PropertyMap property={property} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking and Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-4">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                    ETB {property.pricing?.monthly?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600">per month</div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Button 
                    className="w-full h-11 sm:h-10 text-sm sm:text-base"
                    size="lg"
                    onClick={() => onNavigate('booking', property)}
                    disabled={property.status !== 'approved' || !property.availability?.isAvailable}
                  >
                    {(property.status === 'approved' && property.availability?.isAvailable) ? (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Now
                      </>
                    ) : (
                      `Property ${property.availability?.isAvailable ? 'Unavailable' : 'Not Available'}`
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-11 sm:h-10 text-sm sm:text-base"
                    onClick={() => onNavigate('home')}
                  >
                    Continue Browsing
                  </Button>
                </div>

                {/* Quick Info */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="space-y-2 sm:space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium">{property.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available From</span>
                      <span className="font-medium">Immediately</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lease Term</span>
                      <span className="font-medium">12+ months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl">Contact Property Manager</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">Property Manager</div>
                    <div className="text-xs sm:text-sm text-gray-600">Available 9 AM - 6 PM</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start h-10 sm:h-9 text-sm sm:text-base">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-10 sm:h-9 text-sm sm:text-base">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Features */}
            <Card>
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl">Safety & Security</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">24/7 Security</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Verified Property</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Safe Neighborhood</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailsPage;