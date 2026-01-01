import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api.js';

function LoginPage({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.email.trim()) {
        setError('Email is required');
        return;
      }
      
      if (!formData.password.trim()) {
        setError('Password is required');
        return;
      }

      const response = await authAPI.login(formData.email.trim(), formData.password);
      
      if (response.success) {
        onLogin(response.data.user, response.token);
      } else {
        setError(response.error || response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error.message.includes('connection') || error.message.includes('network')) {
        setError('Please check your connection and try again.');
      } else if (error.message.includes('credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
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
          <span className="text-2xl font-bold text-gray-900">YegnaBet</span>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">Sign in to your YegnaBet account</CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className={`w-full ${error && error.includes('email') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
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
                    className={`w-full pr-10 ${error && error.includes('password') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
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
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-sm text-blue-600 hover:text-blue-500"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <button
                onClick={() => onNavigate('signup')}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                disabled={loading}
              >
                Sign up
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Ethiopian Context */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🇪🇹 Find your perfect home in Addis Ababa
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;