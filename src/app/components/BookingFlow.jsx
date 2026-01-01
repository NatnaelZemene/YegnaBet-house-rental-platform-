import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  MapPin, 
  Star,
  Bed,
  Bath,
  Maximize,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Minus,
  Plus,
  Wallet,
  Smartphone,
  Building2,
  Loader2,
  Clock
} from 'lucide-react';
import { bookingsAPI } from '../../services/api.js';

/**
 * BookingFlow Component - Handles the complete booking process
 * 
 * Flow Steps:
 * 1. User selects dates and guests
 * 2. User reviews booking details
 * 3. User selects payment method (simulated)
 * 4. Booking is created with status: pending_owner_approval
 * 5. Owner receives notification to approve/reject
 * 6. If approved: booking status -> confirmed, property status -> booked
 * 7. If rejected: booking status -> rejected, property remains available
 */
function BookingFlow({ property, user, onNavigate, onBookingComplete }) {
  // Early return if property is not provided
  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Property Not Found</h2>
            <p className="text-gray-600 mt-2">The property you're trying to book could not be loaded.</p>
          </div>
          <Button onClick={() => onNavigate('home')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Details, 2: Review, 3: Payment, 4: Confirmation
  
  // Booking form data
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    specialRequests: '',
    agreeToTerms: false
  });
  
  // Payment data
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('balance');
  const [userBalance, setUserBalance] = useState(0);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    loadUserBalance();
  }, []);

  const loadUserBalance = async () => {
    try {
      const { paymentsAPI } = await import('../../services/api.js');
      const response = await paymentsAPI.getFinancialSummary();
      if (response.success) {
        setUserBalance(response.data.balance || 0);
      }
    } catch (error) {
      console.error('Error loading user balance:', error);
    }
  };

  // Calculate booking details
  const calculateStayDuration = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 30); // Convert days to months
  };

  const stayDuration = calculateStayDuration();
  const basePrice = (property.pricing?.monthly || property.price?.monthly || 5000) * stayDuration;
  const serviceFee = Math.round(basePrice * 0.005); // 0.5% service fee
  const totalPrice = basePrice + serviceFee;

  // Payment methods (wallet-based) - moved after price calculation
  const paymentMethods = [
    {
      id: 'balance',
      name: 'YegnaBet Wallet',
      description: `Pay from your wallet balance (${userBalance.toLocaleString()} ETB available)`,
      icon: <Wallet className="h-5 w-5" />,
      fees: { percentage: 0, minimum: 0 },
      available: userBalance >= totalPrice
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear errors when user makes changes
  };

  const handleGuestChange = (increment) => {
    const newGuests = formData.guests + increment;
    if (newGuests >= 1 && newGuests <= 10) {
      handleInputChange('guests', newGuests);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.checkInDate && 
               formData.checkOutDate && 
               formData.guests > 0 && 
               formData.agreeToTerms && 
               stayDuration > 0;
      case 2:
        return true; // Review step is always valid if we got here
      case 3:
        return selectedPaymentMethod && userBalance >= totalPrice; // Check balance
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleBookingSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🏠 Creating booking with pending_owner_approval status...');
      console.log('📝 Property ID:', property._id);
      console.log('📅 Check-in date:', formData.checkInDate);
      console.log('📅 Check-out date:', formData.checkOutDate);
      console.log('👥 Guests:', formData.guests);
      console.log('💰 Total price:', totalPrice);
      
      // Create booking directly (payment is always simulated)
      const bookingPayload = {
        property: property._id,
        checkInDate: new Date(formData.checkInDate).toISOString(),
        checkOutDate: new Date(formData.checkOutDate).toISOString(),
        guests: formData.guests,
        guestDetails: {
          firstName: user?.firstName || 'Guest',
          lastName: user?.lastName || 'User',
          email: user?.email || 'guest@example.com',
          phone: user?.phone || '+251911000000',
          nationality: 'Ethiopian'
        },
        specialRequests: formData.specialRequests,
        totalAmount: totalPrice,
        paymentMethod: selectedPaymentMethod
      };

      console.log('🏠 Creating booking with payload:', bookingPayload);

      const bookingResponse = await bookingsAPI.create(bookingPayload);
      
      if (!bookingResponse.success) {
        console.error('❌ Booking creation failed:', bookingResponse);
        
        // Show detailed error if available
        if (bookingResponse.details && Array.isArray(bookingResponse.details)) {
          const errorMessages = bookingResponse.details.map(err => err.msg).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        
        throw new Error(bookingResponse.error || 'Failed to create booking');
      }

      console.log('✅ Booking created successfully:', bookingResponse.data._id);

      // Simulate payment success (always succeeds)
      const simulatedPaymentResult = {
        transactionId: `SIM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentMethod: selectedPaymentMethod,
        amounts: {
          total: totalPrice,
          currency: 'ETB'
        },
        status: 'simulated',
        timestamp: new Date().toISOString(),
        message: 'Payment simulation completed - awaiting owner approval'
      };

      console.log('✅ Payment simulation completed successfully');
      
      setBookingResult({
        booking: bookingResponse.data,
        payment: simulatedPaymentResult
      });
      setSuccess(true);
      setCurrentStep(4); // Move to confirmation step
      
      // Notify parent component
      if (onBookingComplete) {
        onBookingComplete(bookingResponse.data);
      }

    } catch (error) {
      console.error('❌ Booking submission error:', error);
      setError(error.message || 'Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Booking Details
  const renderBookingDetails = () => (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkin">Check-in Date</Label>
              <Input
                id="checkin"
                type="date"
                value={formData.checkInDate}
                onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="checkout">Check-out Date</Label>
              <Input
                id="checkout"
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          {stayDuration > 0 && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <strong>{stayDuration} month{stayDuration > 1 ? 's' : ''}</strong> selected
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guest Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Guests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Number of Guests</div>
              <div className="text-sm text-gray-600">Maximum 10 guests</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleGuestChange(-1)}
                disabled={formData.guests <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-medium">{formData.guests}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleGuestChange(1)}
                disabled={formData.guests >= 10}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Special Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="requests">Any special requests or requirements?</Label>
          <textarea
            id="requests"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg resize-none"
            rows="3"
            placeholder="Early check-in, late check-out, accessibility needs, etc."
            value={formData.specialRequests}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              className="mt-1"
            />
            <div className="text-sm">
              <label htmlFor="terms" className="cursor-pointer">
                I agree to the{' '}
                <span className="text-blue-600 hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-blue-600 hover:underline">Cancellation Policy</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 2: Booking Summary
  const renderBookingSummary = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Check-in:</span>
              <div className="font-medium">{new Date(formData.checkInDate).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-gray-600">Check-out:</span>
              <div className="font-medium">{new Date(formData.checkOutDate).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <div className="font-medium">{stayDuration} month{stayDuration > 1 ? 's' : ''}</div>
            </div>
            <div>
              <span className="text-gray-600">Guests:</span>
              <div className="font-medium">{formData.guests} guest{formData.guests > 1 ? 's' : ''}</div>
            </div>
          </div>
          
          {formData.specialRequests && (
            <div className="pt-4 border-t">
              <span className="text-gray-600 text-sm">Special Requests:</span>
              <div className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{formData.specialRequests}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">Pending Owner Approval</div>
              <div className="text-gray-600">Your booking will be sent to the property owner for approval</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">Simulated Payment</div>
              <div className="text-gray-600">This is a demo - no real money will be charged</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">Approval Process</div>
              <div className="text-gray-600">Owner has 24 hours to respond to your booking request</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 3: Payment Method Selection
  const renderPaymentSelection = () => (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Your Wallet Balance
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-green-600">
                ETB {userBalance.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Available for bookings</p>
            </div>
            {userBalance < totalPrice && (
              <div className="text-right">
                <Badge variant="destructive" className="text-xs">Insufficient Balance</Badge>
                <p className="text-xs text-red-600 mt-1">
                  Need ETB {(totalPrice - userBalance).toLocaleString()} more
                </p>
              </div>
            )}
          </div>
          
          {userBalance < totalPrice && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900">Insufficient Balance</h3>
                  <p className="text-sm text-red-700 mt-1">
                    You need ETB {totalPrice.toLocaleString()} but only have ETB {userBalance.toLocaleString()}.
                    Please add funds to your wallet to complete this booking.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => onNavigate('profile')}
                  >
                    Add Funds to Wallet
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPaymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => method.available && setSelectedPaymentMethod(method.id)}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => method.available && setSelectedPaymentMethod(method.id)}
                  disabled={!method.available}
                  className="text-blue-600 mt-1"
                />
                <div className="flex-shrink-0">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{method.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                  {!method.available && (
                    <p className="text-sm text-red-600 mt-1">
                      Insufficient balance for this payment method
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Base Amount:</span>
              <span>ETB {basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Fee (0.5%):</span>
              <span>ETB {serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-3 border-t">
              <span>Total Amount:</span>
              <span>ETB {totalPrice.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              💡 Amount will be deducted from your wallet balance
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 4: Booking Confirmation
  const renderBookingConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Completed Successfully!</h2>
        <p className="text-gray-600">
          Your booking has been submitted and payment processed. Please wait for approval from the property owner.
        </p>
      </div>

      {bookingResult && (
        <Card className="text-left">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Booking ID:</span>
                <div className="font-medium">{bookingResult.booking._id}</div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <Badge variant="secondary">Pending Owner Approval</Badge>
              </div>
              <div>
                <span className="text-gray-600">Payment:</span>
                <Badge variant="outline">Processed (Simulation)</Badge>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <div className="font-medium">ETB {totalPrice.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-amber-800 space-y-1 text-left">
          <li>• Property owner will review your booking request</li>
          <li>• You'll receive a notification when they respond</li>
          <li>• If approved, payment will be processed and booking confirmed</li>
          <li>• If rejected, you can book other available properties</li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={() => onNavigate('my-bookings')}>
          View My Bookings
        </Button>
        <Button variant="outline" onClick={() => onNavigate('home')}>
          Browse More Properties
        </Button>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => {
              if (currentStep > 1) {
                handlePreviousStep();
              } else {
                onNavigate('property-details', property);
              }
            }}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep > 1 ? 'Back' : 'Back to Property'}
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStep === 1 ? 'Book Your Stay' : 
                 currentStep === 2 ? 'Review Booking' :
                 currentStep === 3 ? 'Payment' : 'Booking Confirmed'}
              </h1>
              <div className="flex items-center gap-2">
                <Badge className={currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}>
                  1. Details
                </Badge>
                <Badge className={currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}>
                  2. Review
                </Badge>
                <Badge className={currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}>
                  3. Payment
                </Badge>
                <Badge className={currentStep >= 4 ? 'bg-green-600' : 'bg-gray-300'}>
                  4. Confirmed
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {currentStep === 1 && renderBookingDetails()}
            {currentStep === 2 && renderBookingSummary()}
            {currentStep === 3 && renderPaymentSelection()}
            {currentStep === 4 && renderBookingConfirmation()}
          </div>

          {/* Right Column - Property Summary & Actions */}
          {currentStep < 4 && (
            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="flex gap-4 mb-4">
                    <img
                      src={
                        property.images?.[0]?.url || 
                        property.images?.[0] || 
                        `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center`
                      }
                      alt={property.title || 'Property'}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-2">{property.title || 'Property'}</h3>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{property.location?.subcity || 'Location'}, {property.location?.woreda || ''}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium text-gray-700">
                          {property.stats?.rating?.average?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms || 0}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms || 0}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Maximize className="w-4 h-4" />
                      <span>{property.area || 0}m²</span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {stayDuration > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>ETB {(property.pricing?.monthly || property.price?.monthly || 5000).toLocaleString()} × {stayDuration} month{stayDuration > 1 ? 's' : ''}</span>
                        <span>ETB {basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fee (0.5%)</span>
                        <span>ETB {serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                        <span>Total</span>
                        <span>ETB {totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full mt-6"
                    size="lg"
                    onClick={currentStep === 3 ? handleBookingSubmit : handleNextStep}
                    disabled={!isStepValid(currentStep) || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : currentStep === 1 ? (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Review Booking
                      </>
                    ) : currentStep === 2 ? (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Proceed to Payment
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete Booking
                      </>
                    )}
                  </Button>

                  {!isStepValid(currentStep) && (
                    <div className="text-sm text-gray-500 text-center mt-2">
                      {currentStep === 1 && (
                        !formData.checkInDate || !formData.checkOutDate ? 'Please select dates' :
                        !formData.agreeToTerms ? 'Please agree to terms' :
                        stayDuration <= 0 ? 'Invalid date range' : ''
                      )}
                      {currentStep === 3 && !selectedPaymentMethod && (
                        'Please select a payment method'
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingFlow;