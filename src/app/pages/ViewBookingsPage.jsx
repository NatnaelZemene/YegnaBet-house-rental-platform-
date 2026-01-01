import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Menu,
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  CheckCircle,
  X,
  Eye,
  Phone,
  Mail
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { mockProperties } from '../../data/mockData';

function ViewBookingsPage({ user, currentPage, onNavigate, sidebarOpen, onSidebarToggle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock bookings data
  const mockBookings = [
    {
      id: 'BK001234',
      propertyId: 1,
      property: mockProperties[0],
      guest: { name: 'John Smith', email: 'john@example.com', phone: '+1 (555) 123-4567' },
      checkInDate: '2024-02-15',
      checkOutDate: '2024-02-20',
      guests: 2,
      totalAmount: 6000,
      status: 'confirmed',
      bookingDate: '2024-01-10'
    },
    {
      id: 'BK001235',
      propertyId: 2,
      property: mockProperties[1],
      guest: { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 (555) 987-6543' },
      checkInDate: '2024-03-10',
      checkOutDate: '2024-03-15',
      guests: 4,
      totalAmount: 9000,
      status: 'pending',
      bookingDate: '2024-01-15'
    },
    {
      id: 'BK001236',
      propertyId: 3,
      property: mockProperties[2],
      guest: { name: 'Mike Davis', email: 'mike@example.com', phone: '+1 (555) 456-7890' },
      checkInDate: '2024-01-05',
      checkOutDate: '2024-01-10',
      guests: 2,
      totalAmount: 17500,
      status: 'completed',
      bookingDate: '2023-12-20'
    }
  ];

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.property.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'completed':
        return 'bg-blue-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleApprove = (bookingId) => {
    console.log('Approving booking:', bookingId);
    alert('Booking approved successfully!');
  };

  const handleReject = (bookingId) => {
    if (window.confirm('Are you sure you want to reject this booking?')) {
      console.log('Rejecting booking:', bookingId);
      alert('Booking rejected successfully!');
    }
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
                  <h1 className="text-2xl font-bold text-gray-900">View Bookings</h1>
                  <p className="text-gray-600">{filteredBookings.length} bookings</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search bookings..."
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
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={booking.property.images[0]}
                          alt={booking.property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{booking.property.title}</h3>
                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.property.location}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-600">Guest</span>
                            <div className="font-medium">{booking.guest.name}</div>
                            <div className="text-sm text-gray-600">{booking.guest.email}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Dates</span>
                            <div className="font-medium">
                              {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">{booking.guests} guests</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Total</span>
                            <div className="font-medium text-green-600">${booking.totalAmount}</div>
                            <div className="text-sm text-gray-600">ID: {booking.id}</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(booking.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(booking.id)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-1" />
                            Contact Guest
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
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewBookingsPage;