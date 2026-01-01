import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Star,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { paymentsAPI, bookingsAPI } from '../../services/api.js';

function PaymentPage({ bookingData, user, onNavigate }) {
  const [userBalance, setUserBalance] = useState(0);
  const [booking] = useState(bookingData);
  
  // Payment methods (all simulated)
  const [paymentMethods] = useState([
    {
      id: 'balance',
      name: 'YegnaBet Wallet',
      description: 'Pay from your YegnaBet wallet balance (SIMULATION)',
      fees: { percentage: 0, minimum: 0 },
      simulation: true
    },
    {
      id: 'chapa',
      name: 'Chapa Payment',
      description: 'Credit/debit card or mobile money (95% success rate - SIMULATION)',
      fees: { percentage: 2.5, minimum: 10 },
      simulation: true
    },
    {
      id: 'telebirr',
      name: 'TeleBirr',
      description: 'TeleBirr mobile wallet (98% success rate - SIMULATION)',
      fees: { percentage: 1.5, minimum: 5 },
      simulation: true
    },
    {
      id: 'cbe-birr',
      name: 'CBE Birr',
      description: 'CBE Birr mobile banking (97% success rate - SIMULATION)',
      fees: { percentage: 1.0, minimum: 5 },
      simulation: true
    }
  ]);
  
  const [selectedMethod, setSelectedMethod] = useState('balance');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    if (!bookingData) {
      setError('No booking data provided');
      setLoading(false);
    } else {
      loadUserBalance();
    }
  }, [bookingData]);

  const loadUserBalance = async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getFinancialSummary();
      if (response.success) {
        setUserBalance(response.data.balance || 0);
      }
    } catch (error) {
      console.error('Error loading user balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    try {
      const amount = prompt('Enter amount to add (ETB):');
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        return;
      }

      const response = await paymentsAPI.addFunds(parseFloat(amount), 'Demo funds added');
      if (response.success) {
        setUserBalance(response.data.newBalance);
        alert(`Successfully added ${amount} ETB to your account!`);
      } else {
        alert('Failed to add funds: ' + response.error);
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      alert('Failed to add funds');
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError('');

      // Check balance if using balance payment
      if (selectedMethod === 'balance' && userBalance < booking.totalPrice) {
        setError(`Insufficient balance. Available: ${userBalance} ETB, Required: ${booking.totalPrice} ETB`);
        return;
      }

      // Create booking first
      const bookingPayload = {
        property: booking.property._id || booking.property.id,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        guests: booking.guests,
        specialRequests: booking.specialRequests,
        totalAmount: booking.totalPrice
      };

      console.log('Creating booking:', bookingPayload);
      const bookingResponse = await bookingsAPI.create(bookingPayload);
      
      if (!bookingResponse.success) {
        throw new Error(bookingResponse.error || 'Failed to create booking');
      }

      console.log('Booking created:', bookingResponse.data._id);

      // Process payment using the new payment service
      const paymentData = {
        amount: booking.totalPrice,
        currency: 'ETB',
        method: selectedMethod
      };

      console.log('Processing payment:', paymentData);
      const response = await paymentsAPI.process(
        bookingResponse.data._id,
        selectedMethod,
        paymentData
      );

      if (response.success) {
        setSuccess(true);
        setPaymentResult(response.data);
        
        // Update user balance display
        if (selectedMethod === 'balance') {
          setUserBalance(response.data.balances.user);
        }
        
        // Redirect after success
        setTimeout(() => {
          onNavigate('my-bookings');
        }, 3000);
      } else {
        setError(response.error || 'Payment failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const getPaymentIcon = (methodId) => {
    switch (methodId) {
      case 'balance':
        return <Wallet className="h-6 w-6" />;
      case 'chapa':
        return <CreditCard className="h-6 w-6" />;
      case 'telebirr':
        return <Smartphone className="h-6 w-6" />;
      case 'cbe-birr':
        return <Smartphone className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Simulation Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your fake payment has been processed successfully. This was a simulation for testing purposes.
            </p>
            {paymentResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-left">
                <h3 className="font-semibold text-green-900 mb-2">Simulation Results:</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <p>🎭 Transaction ID: {paymentResult.transactionId}</p>
                  <p>💰 Amount: ETB {paymentResult.amounts?.total?.toLocaleString()}</p>
                  <p>💳 Method: {paymentResult.paymentMethod?.toUpperCase()}</p>
                  {paymentResult.balances && (
                    <p>💼 New Balance: ETB {paymentResult.balances.user?.toLocaleString()}</p>
                  )}
                  <p className="text-blue-600 font-medium">✨ This was a fake payment simulation</p>
                </div>
              </div>
            )}
            <Button onClick={() => onNavigate('my-bookings')}>
              View My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">
              The booking you're trying to pay for could not be found.
            </p>
            <Button onClick={() => onNavigate('my-bookings')}>
              Back to Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('my-bookings')}
            className="mb-2 p-2 sm:p-3"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="text-sm sm:text-base">Back to Bookings</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-sm sm:text-base text-gray-600">Secure payment for your booking</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Simulation Notice */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full flex-shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Payment Simulation Mode</h3>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">
                This is a fake payment simulation for testing purposes. No real money will be charged.
                Different payment methods have different simulated success rates for demonstration.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* User Balance Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="flex items-center gap-2 text-lg sm:text-xl">
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
                  Account Balance
                </span>
                <Button variant="outline" size="sm" onClick={handleAddFunds} className="w-full sm:w-auto">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="text-sm">Add Funds</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    ETB {userBalance.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Available for payments</p>
                </div>
                {userBalance < booking.totalPrice && (
                  <div className="text-left sm:text-right">
                    <Badge variant="destructive" className="text-xs">Insufficient Balance</Badge>
                    <p className="text-xs sm:text-sm text-red-600 mt-1">
                      Need ETB {(booking.totalPrice - userBalance).toLocaleString()} more
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">{booking.property?.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {booking.property?.location?.subcity}, {booking.property?.location?.woreda}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Check-in:</span>
                  <p className="font-medium">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Check-out:</span>
                  <p className="font-medium">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Guests:</span>
                  <p className="font-medium">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <p className="font-medium">{booking.stayDuration} month{booking.stayDuration > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>ETB {booking.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
                Pending Payment
              </Badge>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      method.id === 'balance' && userBalance < booking.totalPrice
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={() => {
                      if (method.id === 'balance' && userBalance < booking.totalPrice) {
                        return;
                      }
                      setSelectedMethod(method.id);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        disabled={method.id === 'balance' && userBalance < booking.totalPrice}
                        onChange={() => {
                          if (method.id === 'balance' && userBalance < booking.totalPrice) {
                            return;
                          }
                          setSelectedMethod(method.id);
                        }}
                        className="text-blue-600 mt-1 flex-shrink-0"
                      />
                      <div className="flex-shrink-0">
                        {getPaymentIcon(method.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base">{method.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{method.description}</p>
                        {method.id === 'balance' && userBalance < booking.totalPrice && (
                          <p className="text-xs text-red-500 mt-1">
                            Insufficient balance (Available: ETB {userBalance.toLocaleString()})
                          </p>
                        )}
                        {method.fees.percentage > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Fee: {method.fees.percentage}% (min {method.fees.minimum} ETB)
                          </p>
                        )}
                        {method.simulation && (
                          <p className="text-xs text-blue-500 font-medium mt-1">
                            🎭 SIMULATION MODE
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-11 sm:h-10 text-sm sm:text-base"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Simulating Payment...
                  </>
                ) : (
                  `🎭 Simulate Payment - ETB ${booking.totalPrice?.toLocaleString()}`
                )}
              </Button>

              <div className="text-center text-xs sm:text-sm text-gray-500 space-y-1">
                <p>🔒 This is a fake payment simulation for testing</p>
                <p>No real money will be charged</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;