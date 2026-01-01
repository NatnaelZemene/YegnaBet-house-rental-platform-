const express = require('express');
const PaymentService = require('../services/paymentService');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Process payment for booking
// @route   POST /api/v1/payments/process
// @access  Private
router.post('/process', protect, async (req, res) => {
  try {
    const { bookingId, paymentMethod, paymentDetails } = req.body;

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID and payment method are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    console.log(`🏦 Processing payment request:`, {
      bookingId,
      paymentMethod,
      userId: req.user.id
    });

    const result = await PaymentService.processPayment(
      bookingId,
      paymentMethod,
      paymentDetails
    );

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transactionId: result.transaction.transactionId,
        status: result.transaction.status,
        balances: result.balances,
        amounts: result.transaction.amounts
      }
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    
    let statusCode = 500;
    let errorCode = 'PAYMENT_PROCESSING_ERROR';
    
    if (error.message.includes('Insufficient balance')) {
      statusCode = 400;
      errorCode = 'INSUFFICIENT_BALANCE';
    } else if (error.message.includes('not found')) {
      statusCode = 404;
      errorCode = 'RESOURCE_NOT_FOUND';
    }

    res.status(statusCode).json({
      success: false,
      error: error.message,
      code: errorCode
    });
  }
});

// @desc    Get user financial summary
// @route   GET /api/v1/payments/financial-summary
// @access  Private
router.get('/financial-summary', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const Transaction = require('../models/Transaction');
    
    const user = await User.findById(req.user.id).select('financial stats');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Get recent transactions
    const transactions = await Transaction.find({
      $or: [{ user: req.user.id }, { owner: req.user.id }]
    })
      .populate('booking', 'checkIn checkOut')
      .populate('property', 'title')
      .populate('user', 'firstName lastName')
      .sort('-createdAt')
      .limit(20);

    const summary = {
      balance: user.financial?.balance || 0,
      totalSpent: user.stats?.totalSpent || 0,
      totalBookings: user.stats?.totalBookings || 0,
      earnings: user.financial?.earnings || {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
        pending: 0
      },
      commission: user.financial?.commission || {
        total: 0,
        thisMonth: 0,
        rate: 0.005
      },
      transactions: transactions
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error getting financial summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get financial summary',
      code: 'FINANCIAL_SUMMARY_ERROR'
    });
  }
});

// @desc    Add funds to account (demo purposes)
// @route   POST /api/v1/payments/add-funds
// @access  Private
router.post('/add-funds', protect, async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid amount is required',
        code: 'INVALID_AMOUNT'
      });
    }

    const result = await PaymentService.addFunds(
      req.user.id,
      parseFloat(amount),
      description
    );

    res.json({
      success: true,
      message: `${amount} ETB added to your account`,
      data: {
        newBalance: result.newBalance,
        transactionId: result.transaction.transactionId
      }
    });

  } catch (error) {
    console.error('Error adding funds:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add funds',
      code: 'ADD_FUNDS_ERROR'
    });
  }
});

// @desc    Get payment methods
// @route   GET /api/v1/payments/methods
// @access  Public
router.get('/methods', async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'chapa',
        name: 'Chapa Payment',
        description: 'Pay with credit/debit card or mobile money',
        fees: { percentage: 2.5, minimum: 10 },
        supported: true
      },
      {
        id: 'telebirr',
        name: 'TeleBirr',
        description: 'Pay with TeleBirr mobile wallet',
        fees: { percentage: 1.5, minimum: 5 },
        supported: true
      },
      {
        id: 'cbe-birr',
        name: 'CBE Birr',
        description: 'Pay with CBE Birr mobile banking',
        fees: { percentage: 1.0, minimum: 5 },
        supported: true
      },
      {
        id: 'bank-transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer',
        fees: { percentage: 0.5, minimum: 2 },
        supported: true
      }
    ];

    res.json({
      success: true,
      data: paymentMethods
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get payment methods',
      code: 'PAYMENT_METHODS_ERROR'
    });
  }
});

// @desc    Calculate payment fees
// @route   POST /api/v1/payments/calculate-fees
// @access  Public
router.post('/calculate-fees', async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Amount and payment method are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    const feeRates = {
      'chapa': { percentage: 0.025, minimum: 10 },
      'telebirr': { percentage: 0.015, minimum: 5 },
      'cbe-birr': { percentage: 0.01, minimum: 5 },
      'bank-transfer': { percentage: 0.005, minimum: 2 }
    };

    const rate = feeRates[paymentMethod] || feeRates['chapa'];
    const calculatedFee = Math.max(amount * rate.percentage, rate.minimum);
    const totalAmount = amount + calculatedFee;

    res.json({
      success: true,
      data: {
        baseAmount: amount,
        fee: calculatedFee,
        totalAmount: totalAmount,
        feePercentage: rate.percentage * 100
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate fees',
      code: 'FEE_CALCULATION_ERROR'
    });
  }
});

module.exports = router;