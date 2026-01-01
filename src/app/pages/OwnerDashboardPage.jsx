import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Home, 
  Plus, 
  Edit, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  Settings,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  CreditCard,
  Building,
  MapPin,
  Phone,
  Mail,
  Star,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { ownerAPI } from '../../services/api.js';

function OwnerDashboardPage({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingRequests: 0,
    confirmedBookings: 0,
    occupancyRate: 0
  });
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [financialData, setFinancialData] = useState(null);
  const [error, setError] = useState(null);

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dashboard overview
      const dashboardResponse = await ownerAPI.getDashboard();
      if (dashboardResponse.success) {
        const overview = dashboardResponse.data.overview;
        setStats({
          totalProperties: overview.totalProperties,
          totalBookings: overview.totalBookings,
          totalRevenue: overview.totalRevenue,
          pendingRequests: overview.pendingRequests,
          confirmedBookings: overview.confirmedBookings,
          occupancyRate: overview.occupancyRate,
          thisMonthRevenue: overview.thisMonthRevenue,
          thisMonthBookings: overview.thisMonthBookings,
          averageBookingValue: overview.averageBookingValue,
          recentBookings: overview.recentBookings,
          newProperties: overview.newProperties
        });
      }

      // Load properties
      const propertiesResponse = await ownerAPI.getProperties({ limit: 20 });
      if (propertiesResponse.success) {
        setProperties(propertiesResponse.data);
      }

      // Load bookings
      const bookingsResponse = await ownerAPI.getBookings({ limit: 20 });
      if (bookingsResponse.success) {
        setBookings(bookingsResponse.data);
      }

      // Load financial data
      const { paymentsAPI } = await import('../../services/api.js');
      const financialResponse = await paymentsAPI.getFinancialSummary();
      if (financialResponse.success) {
        setFinancialData(financialResponse.data);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProperty = (property) => {
    onNavigate('property-details', property);
  };

  const handleEditProperty = (property) => {
    // Navigate to edit property page with property data
    onNavigate('edit-property', property);
  };

  const handleResubmitProperty = async (propertyId) => {
    try {
      const response = await ownerAPI.updatePropertyStatus(propertyId, 'pending');
      if (response.success) {
        // Update local state
        setProperties(prev => prev.map(property => 
          property._id === propertyId 
            ? { ...property, status: 'pending', approval: { ...property.approval, rejectionReason: null } }
            : property
        ));
        alert('Property resubmitted for approval successfully!');
      }
    } catch (error) {
      console.error('Error resubmitting property:', error);
      alert('Failed to resubmit property. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'draft':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-ET', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      const response = await ownerAPI.updateBookingStatus(bookingId, 'confirmed');
      if (response.success) {
        // Update local state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'confirmed' }
            : booking
        ));
        setStats(prev => ({ 
          ...prev, 
          pendingRequests: prev.pendingRequests - 1,
          confirmedBookings: prev.confirmedBookings + 1
        }));
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      setError('Failed to approve booking. Please try again.');
    }
  };

  const handleRejectBooking = async (bookingId, reason = 'Rejected by owner') => {
    try {
      const response = await ownerAPI.updateBookingStatus(bookingId, 'cancelled', reason);
      if (response.success) {
        // Update local state
        setBookings(prev => prev.filter(booking => booking._id !== bookingId));
        setStats(prev => ({ 
          ...prev, 
          pendingRequests: prev.pendingRequests - 1
        }));
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      setError('Failed to reject booking. Please try again.');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadDashboardData}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                    <p className="text-xs text-green-600 mt-1">↗ +{stats.newProperties || 0} this month</p>
                  </div>
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                    <p className="text-xs text-green-600 mt-1">↗ +{stats.recentBookings || 0} this month</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">ETB {(financialData?.earnings?.total || 0).toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">↗ ETB {(financialData?.earnings?.thisMonth || 0).toLocaleString()} this month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Account Balance</p>
                    <p className="text-2xl font-bold text-gray-900">ETB {(financialData?.balance || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Available for withdrawal</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => onNavigate('add-property')}
                  className="flex items-center gap-2 h-12"
                >
                  <Plus className="h-4 w-4" />
                  Add New Property
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onNavigate('owner-bookings')}
                  className="flex items-center gap-2 h-12"
                >
                  <Clock className="h-4 w-4" />
                  Manage Bookings ({stats.pendingRequests})
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('bookings')}
                  className="flex items-center gap-2 h-12"
                >
                  <Calendar className="h-4 w-4" />
                  View All Bookings
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('financial')}
                  className="flex items-center gap-2 h-12"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.user?.firstName} {booking.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{booking.property?.title}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(booking.totalAmount)}</p>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent bookings</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.slice(0, 3).map((property) => (
                    <div key={property._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{property.title}</p>
                        <p className="text-sm text-gray-600">{property.location?.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-500">{property.averageRating?.toFixed(1) || 'No rating'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(property.totalRevenue || 0)}</p>
                        <p className="text-xs text-gray-500">{property.totalBookings || 0} bookings</p>
                      </div>
                    </div>
                  ))}
                  {properties.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No properties found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
        <Button className="flex items-center gap-2" onClick={() => onNavigate('add-property')}>
          <Plus className="h-4 w-4" />
          Add New Property
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge className={getStatusColor(property.status)}>
                    {property.status}
                  </Badge>
                  <Badge variant={property.occupancyStatus === 'occupied' ? 'destructive' : 'outline'}>
                    {property.occupancyStatus || 'Available'}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {property.location?.address}
                </p>

                {/* Rejection Reason Display */}
                {property.status === 'rejected' && property.approval?.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                        <p className="text-sm text-red-700 mt-1">{property.approval.rejectionReason}</p>
                        {property.approval.rejectedAt && (
                          <p className="text-xs text-red-600 mt-1">
                            Rejected on {formatDate(property.approval.rejectedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval Status Info */}
                {property.status === 'approved' && property.approval?.approvedAt && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-green-800">
                        Approved on {formatDate(property.approval.approvedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Pending Status Info */}
                {property.status === 'pending' && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        Waiting for admin approval
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Rent:</span>
                    <span className="font-semibold">{formatCurrency(property.pricing?.monthly || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Revenue:</span>
                    <span className="font-semibold">{formatCurrency(property.totalRevenue || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bookings:</span>
                    <span className="font-semibold">{property.totalBookings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {property.averageRating?.toFixed(1) || 'No rating'}
                    </span>
                  </div>
                  {property.tenant && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Tenant:</span>
                      <span className="font-semibold text-sm">{property.tenant.name}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewProperty(property)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditProperty(property)}
                      disabled={property.status === 'approved' && property.occupancyStatus === 'occupied'}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewProperty(property)}
                    >
                      <BarChart3 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Resubmit Button for Rejected Properties */}
                  {property.status === 'rejected' && (
                    <Button 
                      size="sm" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleResubmitProperty(property._id)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Resubmit for Approval
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {properties.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first property to the platform.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Pending Requests */}
      {bookings.filter(b => b.status === 'pending').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Pending Requests ({bookings.filter(b => b.status === 'pending').length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.filter(b => b.status === 'pending').map((booking) => (
                <div key={booking._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{booking.property?.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(booking.totalAmount)}</p>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {booking.user?.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {booking.user?.email}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApproveBooking(booking._id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRejectBooking(booking._id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user?.firstName} {booking.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{booking.user?.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.property?.title}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600">Bookings will appear here once guests start booking your properties.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Financial Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={loadDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Revenue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(financialData?.currentMonth?.revenue || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {financialData?.currentMonth?.bookings || 0} bookings
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Year</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(financialData?.yearToDate?.revenue || stats.totalRevenue)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {financialData?.yearToDate?.bookings || stats.totalBookings} bookings
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average/Booking</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(financialData?.currentMonth?.averageBookingValue || stats.averageBookingValue || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Per booking</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData?.recentPayments?.length > 0 ? (
                  financialData.recentPayments.slice(0, 5).map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.user?.firstName} {payment.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{payment.property?.title}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(payment.paymentDetails?.paymentDate || payment.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(payment.totalAmount)}</p>
                        <Badge variant="default">Completed</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recent payments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Revenue Breakdown */}
          {financialData?.propertyRevenue?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Property Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.propertyRevenue.map((property, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{property.propertyTitle}</p>
                        <p className="text-sm text-gray-600">{property.propertyLocation}</p>
                        <p className="text-xs text-gray-500">{property.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(property.revenue)}</p>
                        <p className="text-xs text-gray-500">Total revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Primary Account</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bank Name:</span>
                      <span className="text-sm font-medium">Commercial Bank of Ethiopia</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account Number:</span>
                      <span className="text-sm font-medium">1000123456789</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account Holder:</span>
                      <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Account Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Verification:</span>
                      <Badge variant="default">Verified</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Auto Deposit:</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Update Bank Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const renderTenants = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tenant Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search tenants..." className="pl-10 w-64" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            name: 'Sara Alemayehu',
            email: 'sara@example.com',
            phone: '+251911123456',
            property: 'Modern Apartment in Bole',
            moveIn: '2024-01-15',
            rent: 25000,
            status: 'active',
            rating: 4.8
          },
          {
            name: 'Michael Haile',
            email: 'michael@example.com',
            phone: '+251922234567',
            property: 'Luxury Villa in Old Airport',
            moveIn: '2023-12-01',
            rent: 45000,
            status: 'active',
            rating: 4.9
          }
        ].map((tenant, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                  <p className="text-sm text-gray-600">{tenant.property}</p>
                </div>
                <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                  {tenant.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-3 w-3" />
                  {tenant.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-3 w-3" />
                  {tenant.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  Move-in: {formatDate(tenant.moveIn)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-3 w-3" />
                  {formatCurrency(tenant.rent)}/month
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-3 w-3 text-yellow-500" />
                  {tenant.rating} rating
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="h-3 w-3 mr-1" />
                  Contact
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <Input defaultValue={`${user?.firstName} ${user?.lastName} Properties`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <Input defaultValue={user?.email} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input defaultValue={user?.phone} />
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">New booking requests</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Payment confirmations</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Property reviews</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Monthly reports</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Property Owner Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.firstName}! Manage your properties and bookings.</p>
            </div>
            <Button onClick={() => onNavigate('home')} variant="outline" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex flex-wrap gap-2 sm:space-x-8 sm:gap-0">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'properties', label: 'Properties', icon: Home },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'financial', label: 'Financial', icon: DollarSign },
              { id: 'tenants', label: 'Tenants', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'properties' && renderProperties()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'financial' && renderFinancial()}
        {activeTab === 'tenants' && renderTenants()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
}

export default OwnerDashboardPage;