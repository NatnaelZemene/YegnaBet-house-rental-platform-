import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Search, Star, MapPin, TrendingUp, Users, Shield, Building, ArrowRight } from 'lucide-react';
import { propertiesAPI } from '../../services/api.js';
import PropertyCard from '../components/PropertyCard';

function HomePage({ user, onNavigate, properties = [], favorites = [], onToggleFavorite, onRefreshProperties }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeaturedProperties();
  }, [properties]);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      // First try to get featured properties from API
      const response = await propertiesAPI.getFeatured();
      if (response.success && response.data.length > 0) {
        setFeaturedProperties(response.data);
      } else {
        // Fallback to getting all properties and showing first 6
        const allPropertiesResponse = await propertiesAPI.getAll();
        if (allPropertiesResponse.success) {
          setFeaturedProperties(allPropertiesResponse.data.slice(0, 6));
        } else {
          // Fallback to featured properties from props
          setFeaturedProperties(properties.filter(p => p.featured));
        }
      }
    } catch (error) {
      console.error('Error loading featured properties:', error);
      // Fallback to featured properties from props
      setFeaturedProperties(properties.filter(p => p.featured));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    onNavigate('search', { searchTerm });
  };

  const handleToggleFavorite = (propertyId) => {
    if (onToggleFavorite) {
      onToggleFavorite(propertyId);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=1080&fit=crop&crop=center&q=80" 
            alt="Beautiful Addis Ababa cityscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-900/80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6">
              Find Your Perfect Home in{' '}
              <span className="text-yellow-400">Addis Ababa</span>
            </h1>
            <p className="text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
              Discover amazing properties in Ethiopia's capital. From modern apartments to luxury villas.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search in Bole, Kazanchis, Piazza, CMC..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 pr-4 py-4 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSearch}
                  className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                5,000+
              </div>
              <div className="text-base text-gray-600">Properties</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                25,000+
              </div>
              <div className="text-base text-gray-600">Happy Tenants</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                10+
              </div>
              <div className="text-base text-gray-600">Sub-cities</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                4.9★
              </div>
              <div className="text-base text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose YegnaBet?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ethiopia's most trusted property rental platform - making your home search simple and secure
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Prices in ETB</h3>
              <p className="text-base text-gray-600">
                Competitive pricing in Ethiopian Birr with transparent costs and no hidden fees.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Properties</h3>
              <p className="text-base text-gray-600">
                All properties in Addis Ababa are verified and inspected for quality and safety.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-base text-gray-600">
                Round the clock customer support to help you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Featured Properties
              </h2>
              <p className="text-lg text-gray-600">
                Hand-picked properties just for you
              </p>
            </div>
            <div className="flex gap-3">
              {onRefreshProperties && (
                <Button variant="outline" onClick={onRefreshProperties} className="text-base">
                  🔄 Refresh
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => onNavigate('search')}
                className="text-base"
              >
                View All Properties
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              [...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="bg-white p-4 rounded-b-lg border border-t-0">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map(property => (
                <PropertyCard 
                  key={property._id || property.id}
                  property={property}
                  onNavigate={onNavigate}
                  isFavorite={favorites.includes(property._id || property.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <Building className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Properties Available
                </h3>
                <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
                  There are currently no featured properties available. Check back later or browse all properties.
                </p>
                <Button onClick={() => onNavigate('search')}>
                  Browse All Properties
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied tenants who found their perfect home through YegnaBet
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => onNavigate('search')}
              className="text-blue-700 hover:text-blue-800 px-8 py-4"
            >
              Start Searching
            </Button>
            {!user && (
              <Button 
                size="lg"
                variant="outline"
                onClick={() => onNavigate('signup')}
                className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4"
              >
                Sign Up Free
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;