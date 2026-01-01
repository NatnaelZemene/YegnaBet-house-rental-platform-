import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Star, Eye, Trash2, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { favoritesAPI } from '../../services/api.js';

function FavoritesPage({ user, onNavigate }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getAll();
      if (response.success) {
        setFavorites(response.data);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      const response = await favoritesAPI.remove(propertyId);
      if (response.success) {
        setFavorites(favorites.filter(property => property._id !== propertyId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const filteredFavorites = favorites.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.propertyType === filterType;
    return matchesSearch && matchesType;
  });

  const propertyTypes = [...new Set(favorites.map(p => p.propertyType))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                My Favorites
              </h1>
              <p className="text-gray-600 mt-1">
                {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
            <Button 
              onClick={() => onNavigate('search')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Find More Properties
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start exploring properties and save your favorites by clicking the heart icon on any property you like.
            </p>
            <Button 
              onClick={() => onNavigate('search')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Properties
            </Button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search your favorites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            {searchTerm || filterType !== 'all' ? (
              <div className="mb-4">
                <p className="text-gray-600">
                  Showing {filteredFavorites.length} of {favorites.length} favorites
                </p>
              </div>
            ) : null}

            {/* Properties Grid */}
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No favorites match your current filters.</p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((property) => (
                  <Card key={property._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={property.images?.[0]?.url || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center'}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center';
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge className="bg-blue-600 text-white shadow-md">
                          {property.propertyType}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white hover:bg-red-50 text-red-600 border-red-200"
                          onClick={() => removeFavorite(property._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Heart className="w-6 h-6 text-red-500 fill-current" />
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm line-clamp-1">
                          {property.location?.address || 'Location not specified'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold text-blue-600">
                          ETB {property.pricing?.monthly?.toLocaleString() || 'N/A'}
                          <span className="text-sm text-gray-500 font-normal">/month</span>
                        </div>
                        {property.rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600">
                              {property.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                        <span>{property.area} m²</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => onNavigate('property-details', property)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;