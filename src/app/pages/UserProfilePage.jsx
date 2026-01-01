import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Wallet, 
  Plus, 
  History, 
  CreditCard,
  TrendingUp,
  RefreshCw,
  User,
  Mail,
  Phone,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { paymentsAPI } from '../../services/api.js';

function UserProfilePage({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('wallet');
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState({
    balance: 0,
    totalSpent: 0,
    totalBookings: 0,
    transactions: []
  });
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [addFundsLoading, setAddFundsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await paymentsAPI.getFinancialSummary();
      if (response.success) {
        setWalletData(response.data);
      } else {
        setError('Failed to load wallet data');
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!addFundsAmount || isNaN(addFundsAmount) || parseFloat(addFundsAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(addFundsAmount);
    if (amount < 100) {
      setError('Minimum amount is 100 ETB');
      return;
    }

    if (amount > 100000) {
      setError('Maximum amount is 100,000 ETB');
      return;
    }

    try {
      setAddFundsLoading(true);
      setError('');
      setSuccess('');
      
      const response = await paymentsAPI.addFunds(amount, 'Wallet top-up');
      
      if (response.success) {
        setSuccess(`Successfully added ${amount.toLocaleString()} ETB to your wallet!`);
        setAddFundsAmount('');
        
        // Update wallet data
        setWalletData(prev => ({
          ...prev,
          balance: response.data.newBalance
        }));
        
        // Reload full wallet data to get updated transactions
        setTimeout(() => {
          loadWalletData();
          setSuccess('');
        }, 2000);
      } else {
        setError(response.error || 'Failed to add funds');
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      setError('Failed to add funds');
    } finally {
      setAddFundsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ET', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-red-600" />;
      case 'refund':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default:
        return <History className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderWalletTab = () => (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-green-600 mb-2">
              ETB {walletData.balance?.toLocaleString() || '0'}
            </div>
            <p className="text-gray-600">Available Balance</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {walletData.totalBookings || 0}
              </div>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                ETB {walletData.totalSpent?.toLocaleString() || '0'}
              </div>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Funds Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Funds
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (ETB)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount (min: 100, max: 100,000)"
              value={addFundsAmount}
              onChange={(e) => setAddFundsAmount(e.target.value)}
              min="100"
              max="100000"
              step="100"
            />
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex gap-2 flex-wrap">
            {[500, 1000, 2000, 5000, 10000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setAddFundsAmount(amount.toString())}
              >
                {amount.toLocaleString()} ETB
              </Button>
            ))}
          </div>
          
          <Button 
            onClick={handleAddFunds} 
            disabled={addFundsLoading || !addFundsAmount}
            className="w-full"
          >
            {addFundsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Funds...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Funds (Simulation)
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            💡 This is a simulation - no real money will be charged
          </p>
        </CardContent>
      </Card>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadWalletData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading transactions...</p>
            </div>
          ) : walletData.transactions && walletData.transactions.length > 0 ? (
            <div className="space-y-4">
              {walletData.transactions.slice(0, 10).map((transaction, index) => (
                <div key={transaction._id || index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <div className="font-medium">
                        {transaction.type === 'deposit' ? 'Funds Added' : 
                         transaction.type === 'payment' ? 'Booking Payment' : 
                         transaction.type === 'refund' ? 'Refund Received' : 'Transaction'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(transaction.createdAt || transaction.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.type === 'deposit' || transaction.type === 'refund' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                      ETB {transaction.amounts?.total?.toLocaleString() || transaction.amount?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.status || 'completed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Transactions Yet</h3>
              <p className="text-gray-500">Your transaction history will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <span>{user?.firstName || 'Not provided'}</span>
              </div>
            </div>
            <div>
              <Label>Last Name</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <span>{user?.lastName || 'Not provided'}</span>
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{user?.email || 'Not provided'}</span>
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{user?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Label>Account Type</Label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Badge variant={user?.role === 'owner' ? 'default' : 'secondary'}>
                {user?.role === 'owner' ? 'Property Owner' : 'Guest'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
          
          {/* Tabs */}
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'wallet' ? 'default' : 'outline'}
              onClick={() => setActiveTab('wallet')}
              className="flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              Wallet
            </Button>
            <Button
              variant={activeTab === 'transactions' ? 'default' : 'outline'}
              onClick={() => setActiveTab('transactions')}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Transactions
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'outline'}
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'wallet' && renderWalletTab()}
          {activeTab === 'transactions' && renderTransactionsTab()}
          {activeTab === 'profile' && renderProfileTab()}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;