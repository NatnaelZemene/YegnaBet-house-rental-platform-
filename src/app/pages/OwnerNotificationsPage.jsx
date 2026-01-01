import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Bell,
  BellOff,
  Trash2,
  Eye,
  Calendar,
  Home,
  Loader2
} from 'lucide-react';

function OwnerNotificationsPage({ user, onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Mock notifications for now - in real app, fetch from API
      const mockNotifications = [
        {
          id: 1,
          type: 'property_approved',
          title: 'Property Approved!',
          message: 'Your property "Modern Apartment in Bole" has been approved and is now live on YegnaBet.',
          propertyId: 'prop123',
          propertyTitle: 'Modern Apartment in Bole',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          icon: CheckCircle,
          color: 'green'
        },
        {
          id: 2,
          type: 'property_rejected',
          title: 'Property Needs Attention',
          message: 'Your property "Studio in Kazanchis" was rejected. Reason: Images are unclear and property description needs more details.',
          propertyId: 'prop124',
          propertyTitle: 'Studio in Kazanchis',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          read: false,
          icon: XCircle,
          color: 'red'
        },
        {
          id: 3,
          type: 'property_pending',
          title: 'Property Under Review',
          message: 'Your property "Family House in CMC" is currently being reviewed by our admin team.',
          propertyId: 'prop125',
          propertyTitle: 'Family House in CMC',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
          icon: Clock,
          color: 'yellow'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('owner-dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">
                Stay updated on your property status and approvals
              </p>
            </div>
            
            {unreadCount > 0 && (
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600 text-white">
                  {unreadCount} unread
                </Badge>
                <Button onClick={markAllAsRead} variant="outline" size="sm">
                  Mark all as read
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Notifications</h2>
              <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              const colorClasses = {
                green: 'bg-green-50 border-green-200 text-green-800',
                red: 'bg-red-50 border-red-200 text-red-800',
                yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800'
              };

              return (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-2 rounded-full ${colorClasses[notification.color]}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                            <span className="text-sm text-gray-500">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">
                          {notification.message}
                        </p>

                        {/* Property Info */}
                        <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                          <Home className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {notification.propertyTitle}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => onNavigate('property-details', { id: notification.propertyId })}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Property
                          </Button>

                          {!notification.read && (
                            <Button
                              onClick={() => markAsRead(notification.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <BellOff className="w-4 h-4 mr-2" />
                              Mark as read
                            </Button>
                          )}

                          <Button
                            onClick={() => deleteNotification(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerNotificationsPage;