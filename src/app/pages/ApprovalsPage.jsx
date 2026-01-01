import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Menu,
  CheckCircle,
  X,
  Eye,
  AlertCircle,
  Clock,
  Building,
  MapPin,
  DollarSign,
  Star
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

function ApprovalsPage({ user, currentPage, onNavigate, sidebarOpen, onSidebarToggle }) {
  const [pendingProperties] = useState([
    {
      id: 'PROP001',
      title: 'Luxury Beachfront Villa',
      location: 'Miami Beach, FL',
      price: 4500,
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      type: 'Villa',
      owner: 'Emma Wilson',
      submittedDate: '2024-01-20',
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'],
      description: 'Stunning beachfront villa with panoramic ocean views and private beach access.',
      status: 'pending'
    },
    {
      id: 'PROP002',
      title: 'Modern City Loft',
      location: 'Downtown Seattle, WA',
      price: 2200,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      type: 'Loft',
      owner: 'David Chen',
      submittedDate: '2024-01-22',
      images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop'],
      description: 'Contemporary loft in the heart of downtown with city skyline views.',
      status: 'pending'
    }
  ]);

  const handleApprove = (propertyId) => {
    console.log('Approving property:', propertyId);
    alert('Property approved and published successfully!');
  };

  const handleReject = (propertyId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      console.log('Rejecting property:', propertyId, 'Reason:', reason);
      alert('Property rejected. Owner will be notified.');
    }
  };

  const handleViewDetails = (property) => {
    onNavigate('property-details', property);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        currentPage={currentPage}
        onNavigate={onNavigate}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={onSidebarToggle}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-4">
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
                <h1 className="text-2xl font-bold text-gray-900">Property Approvals</h1>
                <p className="text-gray-600">{pendingProperties.length} properties pending approval</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {pendingProperties.length > 0 ? (
            <div className="space-y-6">
              {pendingProperties.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {property.title}
                            </h3>
                            <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{property.location}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Submitted by: <span className="font-medium">{property.owner}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Date: {new Date(property.submittedDate).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <Badge className="bg-yellow-500 text-white">
                            <Clock className="w-4 h-4 mr-1" />
                            Pending Review
                          </Badge>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{property.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Building className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                            <div className="font-medium">{property.type}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-600" />
                            <div className="font-medium">${property.price}/mo</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Beds/Baths</span>
                            <div className="font-medium">{property.bedrooms}/{property.bathrooms}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Area</span>
                            <div className="font-medium">{property.area} sqft</div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApprove(property.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve & Publish
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => handleReject(property.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => handleViewDetails(property)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">All caught up!</h3>
              <p className="text-gray-500">No properties pending approval at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApprovalsPage;