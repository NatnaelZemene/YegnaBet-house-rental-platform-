import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  MapPin, 
  Users,
  MessageSquare,
  AlertCircle,
  Loader2,
  Eye,
  Home
} from 'lucide-react';
import { bookingsAPI } from '../../services/api.js';

/**
 * OwnerBookingManagement Component
 * 
 * Allows property owners to:
 * 1. View pending booking requests (status: pending_owner_approval)
 * 2. Approve bookings (status: pending_owner_approval -> confirmed, property: approved -> booked)
 * 3. Reject bookings (status: pending_owner_approval -> rejected, property remains available)
 * 4. View booking details and guest information
 */
function OwnerBookingManagement({ user, onNavigate, onStatsUpdate }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingBookingId, setProcessingBookingId] = useState(null);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    loadOwnerBookings();
  }, []);

  const loadOwnerBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get all bookings for properties owned by this user
      const response = await bookingsAPI.getOwnerBookings({ 
        status: 'pending_owner_approval,confirmed,rejected'
      });
      
      if (response.success) {
        setBookings(response.data || []);
      } else {
        setError('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error loading owner bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      setProcessingBookingId(bookingId);
      setError('');

      console.log('🟢 Approving booking:', bookingId);
      
      // Add retry logic for network issues
      let retryCount = 0;
      const maxRetries = 3;
      let response;
      
      while (retryCount < maxRetries) {
        try {
          response = await bookingsAPI.updateStatus(bookingId, 'confirmed');
          break; // Success, exit retry loop
        } catch (networkError) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw networkError;
          }
          console.log(`🔄 Retry ${retryCount}/${maxRetries} for booking approval...`);
          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (response && response.success) {
        console.log('✅ Booking approved successfully');
        
        // Update local state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'confirmed' }
            : booking
        ));
        
        // Notify parent component to update stats
        if (onStatsUpdate) {
          onStatsUpdate();
        }
        
        // Show success message
        alert('🎉 Booking approved successfully!\n\n✅ Property marked as booked\n💰 Payment distributed to your account\n📧 Guest has been notified');
      } else {
        throw new Error(response?.error || 'Failed to approve booking');
      }
    } catch (error) {
      console.error('❌ Error approving booking:', error);
      
      // More user-friendly error messages
      let errorMessage = 'Failed to approve booking. ';
      if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage += 'Request timed out. Please try again.';
      } else {
        errorMessage += error.message || 'Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleRejectBooking = async (bookingId, reason) => {
    try {
      setProcessingBookingId(bookingId);
      setError('');

      console.log('🔴 Rejecting booking:', bookingId, 'Reason:', reason);
      
      // Add retry logic for network issues
      let retryCount = 0;
      const maxRetries = 3;
      let response;
      
      while (retryCount < maxRetries) {
        try {
          response = await bookingsAPI.updateStatus(bookingId, 'rejected', reason);
          break; // Success, exit retry loop
        } catch (networkError) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw networkError;
          }
          console.log(`🔄 Retry ${retryCount}/${maxRetries} for booking rejection...`);
          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (response && response.success) {
        console.log('✅ Booking rejected successfully');
        
        // Update local state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'rejected', rejectionReason: reason }
            : booking
        ));
        
        // Notify parent component to update stats
        if (onStatsUpdate) {
          onStatsUpdate();
        }
        
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedBooking(null);
        
        // Show success message
        alert('❌ Booking rejected successfully.\n\n🏠 Property remains available\n📧 Guest has been notified\n💰 Payment will be refunded');
      } else {
        throw new Error(response?.error || 'Failed to reject booking');
      }
    } catch (error) {
      console.error('❌ Error rejecting booking:', error);
      
      // More user-friendly error messages
      let errorMessage = 'Failed to reject booking. ';
      if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage += 'Request timed out. Please try again.';
      } else {
        errorMessage += error.message || 'Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedBooking(null);
    setRejectionReason('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_owner_approval':
        return <Badge className="bg-amber-500">Pending Your Approval</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.ceil(diffDays / 30);
    return months;
  };

  // Filter bookings by status
  const pendingBookings = bookings.filter(b => b.status === 'pending_owner_approval');
  const approvedBookings = bookings.filter(b => b.status === 'confirmed');
  const rejectedBookings = bookings.filter(b => b.status === 'rejected');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading booking requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
              <p className="text-gray-600 mt-1">Manage booking requests for your properties</p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('owner-dashboard')}>
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-900">Pending Approval</span>
              </div>
              <p className="text-2xl font-bold text-amber-600 mt-1">{pendingBookings.length}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Approved</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">{approvedBookings.length}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-900">Rejected</span>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-1">{rejectedBookings.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Pending Bookings Section */}
        {pendingBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Pending Your Approval ({pendingBookings.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingBookings.map((booking) => (
                <Card key={booking._id} className="border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{booking.property?.title}</CardTitle>
                        <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.property?.location?.subcity}</span>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Enhanced Guest Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-900 mb-3">
                        <User className="w-4 h-4" />
                        Guest Profile
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <div className="font-medium text-gray-900">
                            {booking.user?.firstName} {booking.user?.lastName}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <div className="font-medium text-gray-900">{booking.user?.email}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <div className="font-medium text-gray-900">
                            {booking.user?.phone || 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Member Since:</span>
                          <div className="font-medium text-gray-900">
                            {booking.user?.createdAt ? 
                              new Date(booking.user.createdAt).toLocaleDateString() : 
                              'N/A'
                            }
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Bookings:</span>
                          <div className="font-medium text-gray-900">
                            {booking.user?.stats?.totalBookings || 0} bookings
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Account Status:</span>
                          <div className="font-medium">
                            <Badge variant={booking.user?.status === 'active' ? 'default' : 'secondary'}>
                              {booking.user?.status || 'Active'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Guest Details from Booking */}
                      {booking.guestDetails && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <div className="text-xs text-blue-700 font-medium mb-2">Booking Details:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">Nationality:</span>
                              <span className="ml-1 font-medium">{booking.guestDetails.nationality || 'Ethiopian'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Contact:</span>
                              <span className="ml-1 font-medium">{booking.guestDetails.phone || booking.user?.phone}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Check-in:</span>
                        <div className="font-medium">{formatDate(booking.checkIn)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Check-out:</span>
                        <div className="font-medium">{formatDate(booking.checkOut)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <div className="font-medium">
                          {calculateDuration(booking.checkIn, booking.checkOut)} month(s)
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Guests:</span>
                        <div className="font-medium flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {booking.guests?.adults || booking.guests || 1}
                        </div>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <span className="text-lg font-bold text-green-600">
                          ETB {booking.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Payment Status: {booking.paymentStatus === 'simulated' ? 'Simulated' : booking.paymentStatus}
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <MessageSquare className="w-4 h-4" />
                          Special Requests:
                        </div>
                        <div className="text-sm text-gray-600 mt-1 p-2 bg-blue-50 rounded">
                          {booking.specialRequests}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => handleApproveBooking(booking._id)}
                        disabled={processingBookingId === booking._id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {processingBookingId === booking._id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve & Distribute Payment
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => openRejectModal(booking)}
                        disabled={processingBookingId === booking._id}
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Booking
                      </Button>
                    </div>

                    {/* Booking Created Time */}
                    <div className="text-xs text-gray-500 text-center pt-2 border-t">
                      Requested {new Date(booking.createdAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Approved/Rejected Bookings */}
        {(approvedBookings.length > 0 || rejectedBookings.length > 0) && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Decisions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...approvedBookings, ...rejectedBookings]
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 6)
                .map((booking) => (
                <Card key={booking._id} className="opacity-75">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{booking.property?.title}</CardTitle>
                        <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                          <User className="w-4 h-4" />
                          <span>{booking.user?.firstName} {booking.user?.lastName}</span>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Check-in:</span>
                        <div className="font-medium">{formatDate(booking.checkIn)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <div className="font-medium">ETB {booking.totalAmount?.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    {booking.status === 'rejected' && booking.rejectionReason && (
                      <div className="mt-3 p-2 bg-red-50 rounded text-sm">
                        <span className="font-medium text-red-800">Rejection Reason:</span>
                        <div className="text-red-700 mt-1">{booking.rejectionReason}</div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 text-center pt-3 border-t mt-3">
                      {booking.status === 'confirmed' ? 'Approved' : 'Rejected'} {new Date(booking.updatedAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Booking Requests</h3>
            <p className="text-gray-600 mb-6">
              You don't have any booking requests yet. When guests book your properties, 
              they'll appear here for your approval.
            </p>
            <Button onClick={() => onNavigate('owner-dashboard')}>
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Booking Request
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this booking request. This will help the guest understand your decision.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows="4"
                placeholder="e.g., Property is not available for those dates, guest requirements don't match property rules, etc."
                required
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={closeRejectModal}
                className="flex-1"
                disabled={processingBookingId === selectedBooking._id}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRejectBooking(selectedBooking._id, rejectionReason)}
                disabled={!rejectionReason.trim() || processingBookingId === selectedBooking._id}
                className="flex-1"
              >
                {processingBookingId === selectedBooking._id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Reject Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerBookingManagement;