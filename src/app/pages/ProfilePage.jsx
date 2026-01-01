import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  Edit3,
  Save,
  X,
  Shield,
  Bell,
  CreditCard,
  Key,
  Settings,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

function ProfilePage({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    bio: 'Travel enthusiast and property lover. Always looking for unique places to stay.',
    dateOfBirth: '1990-01-15',
    occupation: 'Software Engineer',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailBookingConfirmations: true,
    emailPromotions: false,
    smsBookingReminders: true,
    smsPromotions: false,
    pushNotifications: true,
    weeklyNewsletter: true
  });

  const [savedCards] = useState([
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8888',
      expiryMonth: '08',
      expiryYear: '2026',
      isDefault: false
    }
  ]);

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    console.log('Saving profile:', profileData);
    setIsEditing(false);
    // Show success message
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    // In a real app, this would make an API call
    console.log('Changing password');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordChange(false);
    alert('Password changed successfully!');
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAvatarUpload = () => {
    // In a real app, this would open a file picker and upload the image
    console.log('Avatar upload clicked');
    alert('Avatar upload functionality would be implemented here');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-blue-600" />
                )}
              </div>
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
                onClick={handleAvatarUpload}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.email}</p>
              <Badge className="mt-2">
                {user?.role === 'owner' ? 'Property Owner' : 'Guest'}
              </Badge>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={profileData.occupation}
                onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                value={profileData.emergencyContact}
                onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={profileData.address}
              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows="3"
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Password & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Password</div>
              <div className="text-sm text-gray-600">Last changed 3 months ago</div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
            >
              Change Password
            </Button>
          </div>

          {showPasswordChange && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handlePasswordChange}>
                  Update Password
                </Button>
                <Button variant="outline" onClick={() => setShowPasswordChange(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">SMS Authentication</div>
              <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
            </div>
            <Button variant="outline">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Booking Confirmations</div>
                <div className="text-sm text-gray-600">Receive confirmation emails for your bookings</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailBookingConfirmations}
                onChange={() => handleNotificationChange('emailBookingConfirmations')}
                className="h-4 w-4"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Promotions & Offers</div>
                <div className="text-sm text-gray-600">Get notified about special deals and promotions</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailPromotions}
                onChange={() => handleNotificationChange('emailPromotions')}
                className="h-4 w-4"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Weekly Newsletter</div>
                <div className="text-sm text-gray-600">Stay updated with our weekly newsletter</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyNewsletter}
                onChange={() => handleNotificationChange('weeklyNewsletter')}
                className="h-4 w-4"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">SMS Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Booking Reminders</div>
                <div className="text-sm text-gray-600">Get SMS reminders before your check-in</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.smsBookingReminders}
                onChange={() => handleNotificationChange('smsBookingReminders')}
                className="h-4 w-4"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Promotions</div>
                <div className="text-sm text-gray-600">Receive SMS about special offers</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.smsPromotions}
                onChange={() => handleNotificationChange('smsPromotions')}
                className="h-4 w-4"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Push Notifications</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Browser Notifications</div>
              <div className="text-sm text-gray-600">Get instant notifications in your browser</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.pushNotifications}
              onChange={() => handleNotificationChange('pushNotifications')}
              className="h-4 w-4"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Saved Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savedCards.map((card) => (
            <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  {card.type.toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">•••• •••• •••• {card.last4}</div>
                  <div className="text-sm text-gray-600">Expires {card.expiryMonth}/{card.expiryYear}</div>
                </div>
                {card.isDefault && (
                  <Badge variant="secondary">Default</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Add New Payment Method
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

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
          
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === tab.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'payment' && renderPaymentTab()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;