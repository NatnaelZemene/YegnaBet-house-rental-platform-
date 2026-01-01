import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X,
  Home,
  Building,
  Calendar,
  Users,
  CheckCircle,
  BarChart3,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';

function AdminSidebar({ currentPage, onNavigate, sidebarOpen, onSidebarToggle, pendingCount = 0 }) {
  const menuItems = [
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & Analytics'
    },
    {
      id: 'add-property',
      label: 'Add Property',
      icon: Plus,
      description: 'List new property'
    },
    {
      id: 'manage-listings',
      label: 'Manage Listings',
      icon: Building,
      description: 'Edit properties'
    },
    {
      id: 'view-bookings',
      label: 'View Bookings',
      icon: Calendar,
      description: 'Booking management'
    },
    {
      id: 'property-approvals',
      label: 'Approvals',
      icon: CheckCircle,
      description: 'Property approvals'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      description: 'Analytics & Reports'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onSidebarToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/yegnabet-logo.png" 
                alt="YegnaBet Logo" 
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="text-xl font-bold text-gray-900">YegnaBet</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarToggle}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      if (window.innerWidth < 1024) {
                        onSidebarToggle();
                      }
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                      {item.id === 'approvals' && pendingCount > 0 && (
                        <Badge 
                          className="bg-red-500 text-white text-xs px-2 py-1 animate-pulse"
                          variant="destructive"
                        >
                          {pendingCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onNavigate('profile')}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onNavigate('login')}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;