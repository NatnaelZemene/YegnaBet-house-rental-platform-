import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api.js';

function SignupPage({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Default to user
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    // Clear previous errors
    setError('');
    
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    
    if (formData.firstName.trim().length < 2) {
      setError('First name must be at least 2 characters long');
      return false;
    }
    
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    
    if (formData.lastName.trim().length < 2) {
      setError('Last name must be at least 2 characters long');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    
    // Ethiopian phone number validation
    if (!formData.phone.match(/^(\+251|0)[79]\d{8}$/)) {
      setError('Please enter a valid Ethiopian phone number (e.g., +251911123456 or 0911123456)');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Password strength validation
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }
    
    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role
      };

      console.log('Submitting registration data:', { ...userData, password: '[HIDDEN]' });

      const response = await authAPI.register(userData);
      
      if (response.success) {
        setSuccess('Account created successfully! Redirecting to login page...');
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: 'user'
        });
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          onNavigate('login');
        }, 2000);
      } else {
        setError(response.error || response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific validation errors
      if (error.message && error.message.includes('validation')) {
        setError('Please check your input and try again. Password must contain uppercase, lowercase, and number.');
      } else if (error.message && error.message.includes('already exists')) {
        setError('An account with this email already exists. Please use a different email or try logging in.');
      } else if (error.message && error.message.includes('connection') || error.message && error.message.includes('network')) {
        setError('Please check your connection and try again.');
      } else if (error.message && error.message.includes('phone')) {
        setError('Please enter a valid Ethiopian phone number (e.g., +251911123456 or 0911123456)');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img 
            src="/assets/logo.png" 
            alt="YegnaBet Logo" 
            className="h-8 w-8 object-contain"
          />
          <span className="text-2xl font-bold">YegnaBet</span>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center px-6 py-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Join YegnaBet to find your perfect home in Addis Ababa
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Abebe"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Kebede"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="abebe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+251911123456 or 0911123456"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Ethiopian phone number format</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Account Type *
                </Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">Property Seeker (User)</option>
                  <option value="owner">Property Owner</option>
                </select>
                <p className="text-xs text-gray-500">
                  Choose "Property Owner" if you want to list properties for rent
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Must contain at least 6 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  disabled={loading}
                  className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to YegnaBet's{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 underline"
                    onClick={() => onNavigate('terms')}
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 underline"
                    onClick={() => onNavigate('privacy')}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <button
                onClick={() => onNavigate('login')}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                disabled={loading}
              >
                Sign in
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Ethiopian Context */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🇪🇹 Join thousands of Ethiopians finding homes in Addis Ababa
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;