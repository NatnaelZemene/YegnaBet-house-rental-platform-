import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Menu,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  MoreVertical
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { mockProperties } from '../../data/mockData';

function ManageListingsPage({ user, currentPage, onNavigate, sidebarOpen, onSidebarToggle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showActions, setShowActions] = useState(null);

  // In a real app, this would come from an API
  const properties = mockProperties.map(prop => ({
    ...prop,
    views: Math.floor(Math.random() * 1000) + 100,
    bookings: Math.floor(Math.random() * 50) + 5,
    revenue: prop.price * (Math.floor(Math.random() * 10) + 1)
  }));

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  const handleEdit = (property) => {
    console.log('Editing property:', property.id);
    alert(`Edit functionality for ${property.title} would open here`);
  };

  const handleDelete = (property) => {
    if (window.confirm(`Are you sure you want to delete "${property.title}"?`)) {
      console.log('Deleting property:', property.id);
      alert('Property deleted successfully!');
    }
  };

  const handleToggleVisibility = (property) => {
    console.log('Toggling visibility for:', property.id);
    alert(`Property ${property.status === 'available' ? 'hidden' : 'published'} successfully!`);
  };

  const handleViewDetails = (property) => {
    onNavigate('property-details', property);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        currentPage={currentPage}
        onNavigate={onNavigate}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={onSidebarToggle}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSidebarToggle}
                  className="lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Manage Listings</h1>
                  <p className="text-gray-600">{filteredProperties.length} properties</p>
                </div>
              </div>
              
              <Button onClick={() => onNavigate('add-property')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Property Image */}
                      <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Property Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {property.title}
                            </h3>
                            <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{property.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="font-medium text-gray-700">{property.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(property.status)}>
                              {property.status}
                            </Badge>
                            <div className="relative">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setShowActions(showActions === property.id ? null : property.id)}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                              
                              {showActions === property.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                                  <button
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                                    onClick={() => handleViewDetails(property)}
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  <button
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                                    onClick={() => handleEdit(property)}
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                                    onClick={() => handleToggleVisibility(property)}
                                  >
                                    {property.status === 'available' ? (
                                      <>
                                        <EyeOff className="w-4 h-4" />
                                        Hide
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-4 h-4" />
                                        Publish
                                      </>
                                    )}
                                  </button>
                                  <button
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                    onClick={() => handleDelete(property)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Bed className="w-4 h-4" />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Bath className="w-4 h-4" />
                            <span>{property.bathrooms} Baths</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Maximize className="w-4 h-4" />
                            <span>{property.area} sqft</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold text-blue-600">${property.price}/mo</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-gray-600">Views: </span>
                            <span className="font-medium">{property.views}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Bookings: </span>
                            <span className="font-medium">{property.bookings}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Revenue: </span>
                            <span className="font-medium text-green-600">${property.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No matching properties' : 'No properties yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding your first property'
                }
              </p>
              <Button onClick={() => onNavigate('add-property')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageListingsPage;