const User = require('../models/User');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');

class PaymentService {
  
  // Fake payment simulation - mimics real payment processing
  static async processPayment(bookingId, paymentMethod, paymentDetails) {
    try {
      console.log(`🎭 FAKE PAYMENT SIMULATION for booking: ${bookingId}`);
      
      // Get booking with populated data
      const booking = await Booking.findById(bookingId)
        .populate('user')
        .populate('property')
        .populate({
          path: 'property',
          populate: {
            path: 'owner',
            model: 'User'
          }
        });

      if (!booking) {
        throw new Error('Booking not found');
      }

      const user = booking.user;
      const property = booking.property;
      const owner = property.owner;
      
      // Get admin user
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        throw new Error('Admin user not found');
      }

      // Calculate amounts
      const totalAmount = booking.totalAmount;
      const adminCommissionRate = admin.financial?.commission?.rate || 0.013; // 1.3%
      const adminCommission = Math.round(totalAmount * adminCommissionRate);
      const ownerPayout = totalAmount - adminCommission;

      console.log(`💰 FAKE Payment breakdown:`);
      console.log(`   Total: ${totalAmount} ETB`);
      console.log(`   Admin commission (${(adminCommissionRate * 100).toFixed(1)}%): ${adminCommission} ETB`);
      console.log(`   Owner payout: ${ownerPayout} ETB`);

      // Check user balance for balance payments
      const userBalance = user.financial?.balance || 0;
      if (paymentMethod === 'balance' && userBalance < totalAmount) {
        throw new Error(`Insufficient balance. Available: ${userBalance} ETB, Required: ${totalAmount} ETB`);
      }

      // Store original balances
      const originalBalances = {
        user: userBalance,
        owner: owner.financial?.balance || 0,
        admin: admin.financial?.balance || 0
      };

      // Create transaction record
      const transaction = new Transaction({
        booking: bookingId,
        user: user._id,
        property: property._id,
        owner: owner._id,
        type: 'payment',
        amounts: {
          total: totalAmount,
          baseAmount: totalAmount - adminCommission,
          adminCommission: adminCommission,
          ownerPayout: ownerPayout
        },
        paymentMethod: paymentMethod,
        paymentProvider: 'fake_simulation',
        status: 'processing',
        metadata: {
          userBalance: {
            before: originalBalances.user,
            after: paymentMethod === 'balance' ? originalBalances.user - totalAmount : originalBalances.user
          },
          ownerBalance: {
            before: originalBalances.owner,
            after: originalBalances.owner + ownerPayout
          },
          adminBalance: {
            before: originalBalances.admin,
            after: originalBalances.admin + adminCommission
          },
          currency: 'ETB',
          simulationNote: 'This is a fake payment simulation for testing purposes'
        }
      });

      // Generate transaction ID manually if not set
      if (!transaction.transactionId) {
        transaction.transactionId = `FAKE${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      }

      await transaction.save();

      // Simulate payment processing delay (1-3 seconds)
      const delay = Math.random() * 2000 + 1000;
      console.log(`⏳ Simulating payment processing... (${Math.round(delay)}ms)`);
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simulate different payment outcomes based on method
      let paymentSuccess = true;
      let failureReason = null;

      // Add some randomness for demo purposes
      if (paymentMethod === 'chapa') {
        // 95% success rate for Chapa
        paymentSuccess = Math.random() > 0.05;
        if (!paymentSuccess) failureReason = 'Card declined by bank';
      } else if (paymentMethod === 'telebirr') {
        // 98% success rate for TeleBirr
        paymentSuccess = Math.random() > 0.02;
        if (!paymentSuccess) failureReason = 'Insufficient TeleBirr balance';
      } else if (paymentMethod === 'balance') {
        // Always succeed if balance is sufficient (already checked above)
        paymentSuccess = true;
      }

      if (!paymentSuccess) {
        // Mark transaction as failed
        transaction.status = 'failed';
        transaction.failureReason = failureReason;
        await transaction.save();
        
        throw new Error(failureReason);
      }

      // Update balances (fake simulation)
      if (paymentMethod === 'balance') {
        // Only deduct from user balance for balance payments
        await User.findByIdAndUpdate(user._id, {
          $inc: {
            'financial.balance': -totalAmount,
            'stats.totalSpent': totalAmount,
            'stats.totalBookings': 1
          },
          $push: {
            'financial.transactions': transaction._id
          }
        });
      } else {
        // For other payment methods, just update stats (no balance deduction)
        await User.findByIdAndUpdate(user._id, {
          $inc: {
            'stats.totalSpent': totalAmount,
            'stats.totalBookings': 1
          },
          $push: {
            'financial.transactions': transaction._id
          }
        });
      }

      // Update owner balance (add payout)
      await User.findByIdAndUpdate(owner._id, {
        $inc: {
          'financial.balance': ownerPayout,
          'financial.earnings.total': ownerPayout,
          'financial.earnings.thisMonth': ownerPayout
        },
        $push: {
          'financial.transactions': transaction._id
        }
      });

      // Update admin balance (add commission)
      await User.findByIdAndUpdate(admin._id, {
        $inc: {
          'financial.balance': adminCommission,
          'financial.commission.total': adminCommission,
          'financial.commission.thisMonth': adminCommission
        },
        $push: {
          'financial.transactions': transaction._id
        }
      });

      // Update booking status
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: paymentMethod,
        paidAt: new Date(),
        transaction: transaction._id
      });

      // Update property stats
      await Property.findByIdAndUpdate(property._id, {
        $inc: {
          'stats.bookings': 1
        }
      });

      // Mark transaction as completed
      transaction.status = 'completed';
      transaction.processedAt = new Date();
      await transaction.save();

      console.log('✅ FAKE Payment processed successfully');
      console.log(`   Method: ${paymentMethod.toUpperCase()}`);
      if (paymentMethod === 'balance') {
        console.log(`   User balance: ${originalBalances.user} → ${originalBalances.user - totalAmount} ETB`);
      } else {
        console.log(`   User balance: ${originalBalances.user} ETB (unchanged - external payment)`);
      }
      console.log(`   Owner balance: ${originalBalances.owner} → ${originalBalances.owner + ownerPayout} ETB`);
      console.log(`   Admin balance: ${originalBalances.admin} → ${originalBalances.admin + adminCommission} ETB`);

      return {
        success: true,
        transaction: transaction,
        balances: {
          user: paymentMethod === 'balance' ? originalBalances.user - totalAmount : originalBalances.user,
          owner: originalBalances.owner + ownerPayout,
          admin: originalBalances.admin + adminCommission
        },
        simulation: true,
        paymentMethod: paymentMethod
      };

    } catch (error) {
      console.error('❌ FAKE Payment processing failed:', error.message);
      
      // Mark transaction as failed if it exists
      if (error.transactionId) {
        await Transaction.findByIdAndUpdate(error.transactionId, {
          status: 'failed',
          failureReason: error.message
        });
      }

      throw error;
    }
  }

  // Get user financial summary
  static async getUserFinancialSummary(userId) {
    try {
      const user = await User.findById(userId)
        .populate('financial.transactions')
        .select('financial stats');

      if (!user) {
        throw new Error('User not found');
      }

      const recentTransactions = await Transaction.find({
        $or: [{ user: userId }, { owner: userId }]
      })
        .populate('booking', 'checkIn checkOut')
        .populate('property', 'title')
        .populate('user', 'firstName lastName')
        .sort('-createdAt')
        .limit(10);

      return {
        balance: user.financial?.balance || 0,
        totalSpent: user.stats?.totalSpent || 0,
        totalBookings: user.stats?.totalBookings || 0,
        earnings: user.financial?.earnings || {},
        commission: user.financial?.commission || {},
        recentTransactions
      };

    } catch (error) {
      console.error('Error getting financial summary:', error);
      throw error;
    }
  }

  // Add funds to user account (for demo purposes)
  static async addFunds(userId, amount, description = 'Demo funds added') {
    try {
      console.log(`💰 FAKE Adding ${amount} ETB to user account (simulation)`);
      
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $inc: { 'financial.balance': amount }
        },
        { new: true }
      );

      // Create transaction record
      const transaction = new Transaction({
        user: userId,
        type: 'deposit',
        amounts: {
          total: amount,
          baseAmount: amount,
          ownerPayout: amount
        },
        paymentMethod: 'demo',
        paymentProvider: 'fake_simulation',
        status: 'completed',
        processedAt: new Date(),
        metadata: {
          description,
          currency: 'ETB',
          simulationNote: 'Fake funds added for testing purposes'
        }
      });

      // Generate transaction ID
      if (!transaction.transactionId) {
        transaction.transactionId = `DEMO${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      }

      await transaction.save();

      console.log(`✅ FAKE Funds added successfully: ${amount} ETB`);
      console.log(`   New balance: ${user.financial.balance} ETB`);

      return {
        success: true,
        newBalance: user.financial.balance,
        transaction,
        simulation: true
      };

    } catch (error) {
      console.error('Error adding funds:', error);
      throw error;
    }
  }

  // Simulate external payment gateway responses
  static simulateExternalPayment(paymentMethod, amount) {
    const responses = {
      chapa: {
        success: Math.random() > 0.05, // 95% success rate
        reference: `chapa_${Date.now()}`,
        message: 'Payment processed via Chapa gateway',
        processingTime: Math.random() * 3000 + 2000 // 2-5 seconds
      },
      telebirr: {
        success: Math.random() > 0.02, // 98% success rate
        reference: `tb_${Date.now()}`,
        message: 'Payment processed via TeleBirr',
        processingTime: Math.random() * 2000 + 1000 // 1-3 seconds
      },
      'cbe-birr': {
        success: Math.random() > 0.03, // 97% success rate
        reference: `cbe_${Date.now()}`,
        message: 'Payment processed via CBE Birr',
        processingTime: Math.random() * 4000 + 2000 // 2-6 seconds
      }
    };

    return responses[paymentMethod] || responses.chapa;
  }
}

module.exports = PaymentService;