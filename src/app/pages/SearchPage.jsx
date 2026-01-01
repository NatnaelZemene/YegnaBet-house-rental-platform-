import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Search,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { propertiesAPI } from '../../services/api.js';

function SearchPage({ user, onNavigate, onRefreshProperties }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('relevance');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: 'all',
    amenities: [],
    location: ''
  });

  const [favorites, setFavorites] = useState([]);

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading properties from API...');
      
      const response = await propertiesAPI.getAll();
      console.log('API Response:', response);
      
      if (response.success) {
        setProperties(response.data);
        console.log('✅ Loaded properties:', response.data.length);
        console.log('First property:', response.data[0]);
      } else {
        console.error('❌ API Error:', response.error);
        setError('Failed to load properties');
      }
    } catch (error) {
      console.error('❌ Error loading properties:', error);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const amenitiesList = [
    'WiFi', 'Parking', 'Pool', 'Gym', 'Garden', 'Pet Friendly',
    'Air Conditioning', 'Balcony', 'Fireplace', 'Laundry'
  ];

  const propertyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'studio', label: 'Studio' },
    { value: 'penthouse', label: 'Penthouse' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Filter and sort properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchTerm || 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.subcity?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !filters.location || 
      property.location?.address?.toLowerCase().includes(filters.location.toLowerCase()) ||
      property.location?.subcity?.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesPrice = (!filters.priceMin || property.pricing?.monthly >= parseInt(filters.priceMin)) &&
                        (!filters.priceMax || property.pricing?.monthly <= parseInt(filters.priceMax));
    
    const matchesBedrooms = !filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms);
    const matchesBathrooms = !filters.bathrooms || property.bathrooms >= parseInt(filters.bathrooms);
    const matchesType = filters.propertyType === 'all' || property.propertyType?.toLowerCase() === filters.propertyType;
    
    const matchesAmenities = filters.amenities.length === 0 || 
      filters.amenities.every(amenity => property.amenities?.includes(amenity));

    return matchesSearch && matchesLocation && matchesPrice && 
           matchesBedrooms && matchesBathrooms && matchesType && matchesAmenities;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.pricing?.monthly || 0) - (b.pricing?.monthly || 0);
      case 'price-high':
        return (b.pricing?.monthly || 0) - (a.pricing?.monthly || 0);
      case 'rating':
        return (b.stats?.rating?.average || 0) - (a.stats?.rating?.average || 0);
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: 'all',
      amenities: [],
      location: ''
    });
    setSearchTerm('');
  };

  const handleToggleFavorite = (propertyId) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value && value !== 'all'
  ).length + (searchTerm ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Search Properties</h1>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by location, property name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 sm:h-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-11 sm:h-12 px-4 sm:px-6"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-blue-600 text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {onRefreshProperties && (
              <Button
                variant="outline"
                onClick={onRefreshProperties}
                className="h-11 sm:h-12 px-3 sm:px-4"
              >
                🔄
              </Button>
            )}
          </div>

          {/* Results Summary and Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-gray-600 text-sm sm:text-base">
              {filteredProperties.length} properties found
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-2 text-blue-600 p-0 h-auto"
                >
                  Clear all filters
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {/* View Mode - Hidden on mobile */}
              <div className="hidden sm:flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar - Mobile Overlay */}
          {showFilters && (
            <>
              {/* Mobile Overlay */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
              
              {/* Filters Panel */}
              <div className={`
                ${showFilters ? 'block' : 'hidden'} 
                fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
                w-80 lg:w-80 flex-shrink-0 bg-white lg:bg-transparent
                overflow-y-auto lg:overflow-visible
                lg:block
              `}>
                <Card className="h-full lg:h-auto lg:sticky lg:top-4 rounded-none lg:rounded-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Filters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(false)}
                        className="lg:hidden"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Enter location"
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Range (per month)
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              type="number"
                              placeholder="Min"
                              value={filters.priceMin}
                              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <div className="relative flex-1">
                            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.priceMax}
                              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Property Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Type
                        </label>
                        <select
                          value={filters.propertyType}
                          onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          {propertyTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Bedrooms */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Bedrooms
                        </label>
                        <div className="relative">
                          <Bed className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            value={filters.bedrooms}
                            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                            className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2"
                          >
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                          </select>
                        </div>
                      </div>

                      {/* Bathrooms */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Bathrooms
                        </label>
                        <div className="relative">
                          <Bath className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            value={filters.bathrooms}
                            onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                            className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2"
                          >
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                          </select>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amenities
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {amenitiesList.map(amenity => (
                            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filters.amenities.includes(amenity)}
                                onChange={() => handleAmenityToggle(amenity)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-700">{amenity}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full mt-6"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-12 sm:py-16">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Loading Properties...</h2>
                <p className="text-sm sm:text-base text-gray-600">Finding the best properties for you</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Error Loading Properties</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
                <Button onClick={loadProperties}>
                  Try Again
                </Button>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'
                  : 'space-y-4 sm:space-y-6'
              }>
                {filteredProperties.map(property => (
                  <PropertyCard
                    key={property._id || property.id}
                    property={property}
                    onNavigate={onNavigate}
                    isFavorite={favorites.includes(property._id || property.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No properties found</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;