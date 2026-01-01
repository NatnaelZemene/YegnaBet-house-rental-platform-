import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Menu,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Users,
  Building
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

function ReportsPage({ user, currentPage, onNavigate, sidebarOpen, onSidebarToggle }) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('revenue');

  const reportTypes = [
    { id: 'revenue', label: 'Revenue Report', icon: DollarSign },
    { id: 'bookings', label: 'Booking Report', icon: Calendar },
    { id: 'properties', label: 'Property Performance', icon: Building },
    { id: 'users', label: 'User Analytics', icon: Users }
  ];

  const mockRevenueData = {
    totalRevenue: 125680,
    revenueChange: 15.2,
    totalBookings: 342,
    bookingsChange: 8.7,
    avgBookingValue: 367,
    avgBookingChange: 6.1,
    topProperties: [
      { name: 'Luxury Penthouse Suite', revenue: 28400, bookings: 8 },
      { name: 'Modern Downtown Apartment', revenue: 21600, bookings: 18 },
      { name: 'Waterfront Condo', revenue: 19800, bookings: 9 }
    ]
  };

  const handleDownloadReport = () => {
    console.log('Downloading report:', selectedReport, selectedPeriod);
    alert('Report download started! Check your downloads folder.');
  };

  const StatCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-600 ml-1">vs last period</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            <div className="flex items-center justify-between">
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
                  <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                  <p className="text-gray-600">Business intelligence and insights</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                
                <Button onClick={handleDownloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Report Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {reportTypes.map((report) => {
              const IconComponent = report.icon;
              return (
                <Card
                  key={report.id}
                  className={`cursor-pointer transition-colors ${
                    selectedReport === report.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <CardContent className="p-4 text-center">
                    <IconComponent className={`w-8 h-8 mx-auto mb-2 ${
                      selectedReport === report.id ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <div className={`font-medium ${
                      selectedReport === report.id ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {report.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Revenue Report */}
          {selectedReport === 'revenue' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  title="Total Revenue"
                  value={mockRevenueData.totalRevenue}
                  change={mockRevenueData.revenueChange}
                  icon={DollarSign}
                  prefix="$"
                />
                <StatCard
                  title="Total Bookings"
                  value={mockRevenueData.totalBookings}
                  change={mockRevenueData.bookingsChange}
                  icon={Calendar}
                />
                <StatCard
                  title="Avg Booking Value"
                  value={mockRevenueData.avgBookingValue}
                  change={mockRevenueData.avgBookingChange}
                  icon={TrendingUp}
                  prefix="$"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Revenue Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                        <p>Revenue trend chart</p>
                        <p className="text-sm">(Chart integration needed)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockRevenueData.topProperties.map((property, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{property.name}</div>
                            <div className="text-sm text-gray-600">{property.bookings} bookings</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">${property.revenue.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Other Report Types */}
          {selectedReport !== 'revenue' && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {reportTypes.find(r => r.id === selectedReport)?.label} Coming Soon
                </h3>
                <p className="text-gray-500 mb-4">
                  This report type is currently under development and will be available soon.
                </p>
                <Button variant="outline" onClick={() => setSelectedReport('revenue')}>
                  View Revenue Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;