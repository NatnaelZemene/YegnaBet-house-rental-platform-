import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Star,
  Eye,
  Download,
  X,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Phone,
  Mail,
  Filter,
  Search,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { bookingsAPI } from '../../services/api.js';

function MyBookingsPage({ user, onNavigate }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMyBookings();
  }, []);

  const loadMyBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await bookingsAPI.getMyBookings();
      
      if (response.success) {
        setBookings(response.data || []);
      } else {
        setError('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500 text-white';
      case 'pending_owner_approval':
        return 'bg-amber-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'completed':
        return 'bg-blue-500 text-white';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending_owner_approval':
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending_owner_approval':
        return 'Pending Approval';
      case 'confirmed':
        return 'Confirmed';
      case 'rejected':
        return 'Rejected';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return status || 'Unknown';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = booking.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking._id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await bookingsAPI.cancel(bookingId, 'Cancelled by user');
        if (response.success) {
          alert('Booking cancelled successfully!');
          loadMyBookings(); // Refresh the list
        } else {
          alert('Failed to cancel booking: ' + response.error);
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const handleDownloadReceipt = (bookingId) => {
    console.log('Downloading receipt for booking:', bookingId);
    alert('Receipt download feature coming soon!');
  };

  const calculateDuration = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.ceil(diffDays / 30);
    return months;
  };

  const renderBookingCard = (booking) => (
    <Card key={booking._id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Property Image */}
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={booking.property?.images?.[0]?.url || booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center'}
              alt={booking.property?.title || 'Property'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center';
              }}
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{booking.property?.title || 'Property'}</h3>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{booking.property?.location?.subcity}, {booking.property?.location?.woreda}</span>
                </div>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {getStatusIcon(booking.status)}
                <span className="ml-1">{getStatusText(booking.status)}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="block font-medium text-gray-900">Check-in</span>
                {new Date(booking.checkIn).toLocaleDateString()}
              </div>
              <div>
                <span className="block font-medium text-gray-900">Check-out</span>
                {new Date(booking.checkOut).toLocaleDateString()}
              </div>
              <div>
                <span className="block font-medium text-gray-900">Duration</span>
                {calculateDuration(booking.checkIn, booking.checkOut)} month(s)
              </div>
              <div>
                <span className="block font-medium text-gray-900">Total</span>
                ETB {booking.totalAmount?.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <div>Booking ID: {booking._id?.slice(-8)}</div>
                <div>Payment: {booking.paymentStatus === 'simulated' ? 'Simulated' : booking.paymentStatus}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(booking)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
                
                {(booking.status === 'pending_owner_approval' || booking.status === 'confirmed') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadReceipt(booking._id)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDetailsModal = () => {
    if (!selectedBooking || !showDetailsModal) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowDetailsModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Property Info */}
            <div className="flex gap-4 mb-6">
              <img
                src={selectedBooking.property?.images?.[0]?.url || selectedBooking.property?.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center'}
                alt={selectedBooking.property?.title || 'Property'}
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center';
                }}
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{selectedBooking.property?.title || 'Property'}</h3>
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedBooking.property?.location?.subcity}, {selectedBooking.property?.location?.woreda}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium text-gray-700">
                    {selectedBooking.property?.stats?.rating?.average?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-3">Booking Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{selectedBooking._id?.slice(-8) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {getStatusIcon(selectedBooking.status)}
                      <span className="ml-1">{getStatusText(selectedBooking.status)}</span>
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booked on:</span>
                    <span className="font-medium">{new Date(selectedBooking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium">
                      {selectedBooking.paymentStatus === 'simulated' ? 'Simulated' : selectedBooking.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Stay Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">{new Date(selectedBooking.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">{new Date(selectedBooking.checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium">
                      {typeof selectedBooking.guests === 'object' ? 
                        selectedBooking.guests.adults || selectedBooking.guests : 
                        selectedBooking.guests || 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">ETB {selectedBooking.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {selectedBooking.specialRequests && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Special Requests</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedBooking.specialRequests}
                </p>
              </div>
            )}

            {/* Guest Details */}
            {selectedBooking.guestDetails && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Guest Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <div className="font-medium">
                      {selectedBooking.guestDetails.firstName} {selectedBooking.guestDetails.lastName}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div className="font-medium">{selectedBooking.guestDetails.email}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <div className="font-medium">{selectedBooking.guestDetails.phone}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Nationality:</span>
                    <div className="font-medium">{selectedBooking.guestDetails.nationality}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Info */}
            {selectedBooking.status === 'rejected' && selectedBooking.rejectionReason && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Rejection Reason</h4>
                <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">
                  {selectedBooking.rejectionReason}
                </p>
              </div>
            )}

            {/* Cancellation Info */}
            {selectedBooking.status === 'cancelled' && selectedBooking.cancellationReason && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Cancellation Reason</h4>
                <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">
                  {selectedBooking.cancellationReason}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleDownloadReceipt(selectedBooking._id)}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              {(selectedBooking.status === 'pending_owner_approval' || selectedBooking.status === 'confirmed') && (
                <Button
                  variant="outline"
                  onClick={() => handleCancelBooking(selectedBooking._id)}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Booking
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
              
              {/* Stats Summary */}
              {bookings.length > 0 && (
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Total: {bookings.length}</span>
                  <span>•</span>
                  <span>Pending: {bookings.filter(b => b.status === 'pending_owner_approval').length}</span>
                  <span>•</span>
                  <span>Confirmed: {bookings.filter(b => b.status === 'confirmed').length}</span>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={loadMyBookings}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
          
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Bookings</option>
                <option value="pending_owner_approval">Pending Approval</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <span className="text-red-700">{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadMyBookings}
                  className="ml-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && bookings.length === 0 && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map(renderBookingCard)}
          </div>
        ) : !loading && bookings.length > 0 && filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No matching bookings</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : !loading && bookings.length === 0 && !error ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-4">
              Start exploring properties to make your first booking
            </p>
            <Button onClick={() => onNavigate('home')}>
              Browse Properties
            </Button>
          </div>
        ) : null}
      </div>

      {/* Details Modal */}
      {renderDetailsModal()}
    </div>
  );
}

export default MyBookingsPage;