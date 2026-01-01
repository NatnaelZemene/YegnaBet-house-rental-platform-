import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Menu,
  X,
  Home,
  Building,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../../services/api.js';

function AdminDashboardPage({ user, currentPage, onNavigate, sidebarOpen, onSidebarToggle }) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [pendingPropertiesCount, setPendingPropertiesCount] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load dashboard data and pending properties count
  useEffect(() => {
    loadDashboardData();
    loadPendingProperties();
    
    // Auto-refresh every 30 seconds to check for new submissions
    const interval = setInterval(() => {
      loadPendingProperties();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingProperties = async () => {
    try {
      const response = await adminAPI.getPendingProperties({ limit: 1 });
      if (response.success) {
        setPendingPropertiesCount(response.total || 0);
      }
    } catch (error) {
      console.error('Error loading pending properties:', error);
    }
  };

  // Mock analytics data - Ethiopian context
  const stats = {
    totalRevenue: 1250000, // ETB
    revenueChange: 15.2,
    totalBookings: 89,
    bookingsChange: 12.8,
    totalProperties: 28,
    propertiesChange: 6.5,
    occupancyRate: 82.3,
    occupancyChange: 3.7
  };

  const recentBookings = [
    {
      id: 'YB001234',
      property: 'Modern Apartment in Bole',
      guest: 'Dawit Tadesse',
      checkIn: '2024-12-25',
      amount: 25000,
      status: 'confirmed'
    },
    {
      id: 'YB001235',
      property: 'Luxury Penthouse in Kazanchis',
      guest: 'Sara Alemayehu',
      checkIn: '2024-12-26',
      amount: 80000,
      status: 'pending'
    },
    {
      id: 'YB001236',
      property: 'Executive Apartment in Megenagna',
      guest: 'Michael Haile',
      checkIn: '2024-12-27',
      amount: 55000,
      status: 'confirmed'
    },
    {
      id: 'YB001237',
      property: 'Family House in CMC',
      guest: 'Hanan Mohammed',
      checkIn: '2024-12-28',
      amount: 35000,
      status: 'pending'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'booking',
      message: 'New booking received for Modern Apartment in Bole',
      time: '5 minutes ago',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'property',
      message: 'Property "Spacious Villa in Gerji" was approved and published',
      time: '20 minutes ago',
      icon: Building,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'user',
      message: 'New user registration: Meron Bekele from Addis Ababa',
      time: '45 minutes ago',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'payment',
      message: 'Payment of 25,000 ETB received for booking YB001230',
      time: '1 hour ago',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 5,
      type: 'property',
      message: 'New property submitted for approval in Kazanchis area',
      time: '2 hours ago',
      icon: Building,
      color: 'text-yellow-600'
    },
    {
      id: 6,
      type: 'booking',
      message: 'Booking YB001228 was cancelled by guest',
      time: '3 hours ago',
      icon: Calendar,
      color: 'text-red-600'
    }
  ];

  const topProperties = [
    {
      id: 1,
      name: 'Luxury Penthouse in Kazanchis',
      bookings: 18,
      revenue: 1440000, // ETB
      rating: 4.9,
      location: 'Kazanchis'
    },
    {
      id: 2,
      name: 'Modern Apartment in Bole',
      bookings: 15,
      revenue: 375000, // ETB
      rating: 4.8,
      location: 'Bole'
    },
    {
      id: 3,
      name: 'Spacious Villa in Gerji',
      bookings: 12,
      revenue: 780000, // ETB
      rating: 4.8,
      location: 'Gerji'
    },
    {
      id: 4,
      name: 'Executive Apartment in Megenagna',
      bookings: 10,
      revenue: 550000, // ETB
      rating: 4.7,
      location: 'Megenagna'
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }) => (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            <div className="flex items-center mt-1 sm:mt-2">
              {change > 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 mr-1" />
              )}
              <span className={`text-xs sm:text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs sm:text-sm text-gray-600 ml-1 hidden sm:inline">vs last month</span>
            </div>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        currentPage={currentPage}
        onNavigate={onNavigate}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={onSidebarToggle}
        pendingCount={pendingPropertiesCount}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSidebarToggle}
                  className="lg:hidden h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Welcome back, {user?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                
                <Button size="icon" variant="outline" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                
                <Button onClick={() => onNavigate('add-property')} className="hidden sm:flex">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
                
                <Button onClick={() => onNavigate('add-property')} size="icon" className="sm:hidden h-8 w-8">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {/* Pending Properties Notification */}
          {pendingPropertiesCount > 0 && (
            <Card className="mb-4 sm:mb-6 border-orange-200 bg-orange-50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-orange-100 rounded-full flex-shrink-0">
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-orange-800 text-sm sm:text-base">
                        {pendingPropertiesCount} Property{pendingPropertiesCount > 1 ? 'ies' : 'y'} Awaiting Approval
                      </h3>
                      <p className="text-xs sm:text-sm text-orange-600">
                        New property submissions need your review
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => onNavigate('property-approvals')}
                    className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto text-sm"
                    size="sm"
                  >
                    Review Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              title="Total Revenue"
              value={stats.totalRevenue}
              change={stats.revenueChange}
              icon={DollarSign}
              prefix="ETB "
            />
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              change={stats.bookingsChange}
              icon={Calendar}
            />
            <StatCard
              title="Properties"
              value={stats.totalProperties}
              change={stats.propertiesChange}
              icon={Building}
            />
            <StatCard
              title="Occupancy Rate"
              value={stats.occupancyRate}
              change={stats.occupancyChange}
              icon={TrendingUp}
              suffix="%"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue Overview (ETB)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p>Revenue chart would be displayed here</p>
                    <p className="text-sm">(Recharts integration)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ethiopian Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Addis Ababa Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Bole Area</p>
                      <p className="text-sm text-blue-700">High demand, premium pricing</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-900">85% occupancy</p>
                      <p className="text-sm text-blue-700">Avg: ETB 45,000</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Kazanchis</p>
                      <p className="text-sm text-green-700">Business district, luxury market</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-900">78% occupancy</p>
                      <p className="text-sm text-green-700">Avg: ETB 65,000</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">CMC & Gerji</p>
                      <p className="text-sm text-yellow-700">Family-friendly, growing market</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-900">72% occupancy</p>
                      <p className="text-sm text-yellow-700">Avg: ETB 35,000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Bookings */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Bookings</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => onNavigate('view-bookings')}>
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{booking.property}</div>
                        <div className="text-sm text-gray-600">
                          {booking.guest} • Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">ID: {booking.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">ETB {booking.amount.toLocaleString()}</div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* YegnaBet Admin Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    onClick={() => onNavigate('add-property')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Property
                  </Button>
                  <Button 
                    onClick={() => onNavigate('property-approvals')} 
                    className="w-full justify-start relative"
                    variant={pendingPropertiesCount > 0 ? "default" : "outline"}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Review Approvals
                    {pendingPropertiesCount > 0 && (
                      <Badge 
                        className="ml-auto bg-red-500 text-white text-xs px-2 py-1 animate-pulse"
                        variant="destructive"
                      >
                        {pendingPropertiesCount}
                      </Badge>
                    )}
                  </Button>
                  <Button 
                    onClick={() => onNavigate('view-bookings')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Manage Bookings
                  </Button>
                  <Button 
                    onClick={() => onNavigate('reports')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                  <Button 
                    onClick={() => onNavigate('manage-listings')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Manage Properties
                  </Button>
                </div>
                
                {/* Ethiopian Market Status */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">Market Status</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Addis Ababa property market is performing well with high demand in Bole and Kazanchis areas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities & Top Properties */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Properties */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Performing Properties in Addis Ababa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Property</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Bookings</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProperties.map((property) => (
                        <tr key={property.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{property.name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-xs">
                              {property.location}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{property.bookings}</td>
                          <td className="py-3 px-4">ETB {property.revenue.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span>{property.rating}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-xs ${
                                      i < Math.floor(property.rating) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;