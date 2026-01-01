import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Bed,
  Bath,
  Maximize,
  DollarSign,
  User,
  Calendar,
  Eye,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { adminAPI } from '../../services/api.js';

function PropertyApprovalsPage({ user, onNavigate }) {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    loadPendingProperties();
  }, []);

  const loadPendingProperties = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingProperties();
      if (response.success) {
        setPendingProperties(response.data);
      } else {
        setError('Failed to load pending properties');
      }
    } catch (error) {
      console.error('Error loading pending properties:', error);
      setError('Failed to load pending properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      setProcessingId(propertyId);
      const response = await adminAPI.approveProperty(propertyId, true);
      
      if (response.success) {
        // Remove from pending list
        setPendingProperties(prev => prev.filter(p => p._id !== propertyId));
        // Show success message
        alert('Property approved successfully! Owner will be notified.');
      } else {
        setError('Failed to approve property');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      setError('Failed to approve property');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedProperty || !rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingId(selectedProperty._id);
      const response = await adminAPI.approveProperty(
        selectedProperty._id, 
        false, 
        rejectionReason.trim()
      );
      
      if (response.success) {
        // Remove from pending list
        setPendingProperties(prev => prev.filter(p => p._id !== selectedProperty._id));
        setShowRejectModal(false);
        setSelectedProperty(null);
        setRejectionReason('');
        alert('Property rejected. Owner will be notified with the reason.');
      } else {
        setError('Failed to reject property');
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      setError('Failed to reject property');
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (property) => {
    setSelectedProperty(property);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading pending properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('admin-dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Property Approvals</h1>
          <p className="text-gray-600">Review and approve pending property listings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {pendingProperties.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
              <p className="text-gray-600">No properties pending approval at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {pendingProperties.length} Properties Pending Approval
              </h2>
              <Button onClick={loadPendingProperties} variant="outline">
                🔄 Refresh
              </Button>
            </div>

            {pendingProperties.map((property) => (
              <Card key={property._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Property Image */}
                    <div className="w-64 h-48 flex-shrink-0">
                      <img
                        src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center'}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center';
                        }}
                      />
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{property.location?.subcity}, {property.location?.woreda}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{property.owner?.firstName} {property.owner?.lastName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>

                      {/* Property Stats */}
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms} beds</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms} baths</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Maximize className="w-4 h-4" />
                          <span>{property.area} m²</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                          <DollarSign className="w-4 h-4" />
                          <span>ETB {property.pricing?.monthly?.toLocaleString()}/month</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => onNavigate('property-details', property)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        
                        <Button
                          onClick={() => handleApprove(property._id)}
                          disabled={processingId === property._id}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          {processingId === property._id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        
                        <Button
                          onClick={() => openRejectModal(property)}
                          disabled={processingId === property._id}
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Reject Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Please provide a reason for rejecting "{selectedProperty?.title}". 
                This will be sent to the property owner.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows="4"
                  placeholder="e.g., Images are unclear, missing required information, property doesn't meet our standards..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowRejectModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || processingId}
                  variant="destructive"
                  className="flex-1"
                >
                  {processingId ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Reject Property
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default PropertyApprovalsPage;