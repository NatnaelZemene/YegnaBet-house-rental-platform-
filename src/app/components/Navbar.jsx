import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  Home,
  Search,
  Bell,
  User,
  Menu,
  X,
  Heart,
  Calendar,
  Settings,
  LogOut,
  Building
} from 'lucide-react';

function Navbar({ user, onNavigate, onLogout, currentPage }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [ownerStats, setOwnerStats] = useState({ pendingRequests: 0 });

  // Load owner stats if user is an owner
  useEffect(() => {
    if (user?.role === 'owner') {
      loadOwnerStats();
    }
  }, [user]);

  const loadOwnerStats = async () => {
    try {
      const { ownerAPI } = await import('../../services/api.js');
      const response = await ownerAPI.getDashboard();
      if (response.success) {
        setOwnerStats({
          pendingRequests: response.data.overview.pendingRequests || 0
        });
      }
    } catch (error) {
      console.error('Error loading owner stats:', error);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNavigation = (page, data = null) => {
    console.log('🔄 Navigating to:', page);
    onNavigate(page, data);
    setShowMobileMenu(false);
    setShowUserMenu(false);
    setShowNotifications(false);
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    ...(user && user.role !== 'admin' ? [
      { id: 'my-bookings', label: 'My Bookings', icon: Calendar },
      { id: 'favorites', label: 'Favorites', icon: Heart },
    ] : []),
    ...(user?.role === 'owner' ? [
      { id: 'owner-dashboard', label: 'Owner Dashboard', icon: Building },
    ] : []),
    ...(user?.role === 'admin' ? [
      { id: 'admin-dashboard', label: 'Admin Dashboard', icon: Building },
    ] : [])
  ];

  const mockNotifications = user?.role === 'owner' ? [
    ...(ownerStats.pendingRequests > 0 ? [{
      id: 'pending-bookings',
      title: 'New Booking Requests',
      message: `You have ${ownerStats.pendingRequests} pending booking request${ownerStats.pendingRequests > 1 ? 's' : ''} waiting for approval`,
      time: 'Now',
      unread: true,
      action: () => handleNavigation('owner-bookings')
    }] : []),
    {
      id: 2,
      title: 'Property Performance',
      message: 'Your property "Modern Downtown Apartment" has high engagement',
      time: '1 day ago',
      unread: false
    }
  ] : [
    {
      id: 1,
      title: 'Booking Confirmed',
      message: 'Your booking for Modern Downtown Apartment has been confirmed',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Payment Successful',
      message: 'Payment of 1,200 ETB has been processed successfully',
      time: '1 day ago',
      unread: true
    },
    {
      id: 3,
      title: 'New Property Available',
      message: 'Check out this new luxury penthouse in your area',
      time: '2 days ago',
      unread: false
    }
  ];

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleNavigation('home')}
        >
          <img 
            src="/assets/logo.png" 
            alt="YegnaBet Logo" 
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="text-xl font-bold text-gray-900 hidden sm:block">YegnaBet</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleNotifications}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            if (notification.action) {
                              notification.action();
                            }
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-gray-600 text-sm mt-1">
                                {notification.message}
                              </p>
                              <p className="text-gray-400 text-xs mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <Button 
                        variant="ghost" 
                        className="w-full text-sm"
                        onClick={() => setShowNotifications(false)}
                      >
                        View All Notifications
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </Button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => handleNavigation('user-profile')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        My Wallet & Profile
                      </button>
                      <button
                        onClick={() => handleNavigation('profile')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => handleNavigation('my-bookings')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        My Bookings
                      </button>
                      {user?.role !== 'admin' && (
                        <button
                          onClick={() => handleNavigation('favorites')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Heart className="w-4 h-4" />
                          My Favorites
                        </button>
                      )}
                      {user?.role === 'owner' && (
                        <button
                          onClick={() => handleNavigation('owner-dashboard')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Building className="w-4 h-4" />
                          Owner Dashboard
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleNavigation('admin-dashboard')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Building className="w-4 h-4" />
                          Admin Dashboard
                        </button>
                      )}
                    </div>
                    <div className="border-t py-2">
                      <button
                        onClick={() => {
                          if (onLogout) {
                            onLogout();
                          } else {
                            handleNavigation('login');
                          }
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('login')}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
              <Button onClick={() => handleNavigation('signup')}>
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="md:hidden"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          {/* Mobile menu overlay - only closes menu when clicking outside */}
          <div 
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-25"
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Mobile menu content */}
          <div className="md:hidden border-t bg-white z-50 relative">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              
              {!user && (
                <div className="pt-4 border-t space-y-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleNavigation('login')}
                    className="w-full justify-start"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => handleNavigation('signup')}
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </nav>
  );
}

export default Navbar;