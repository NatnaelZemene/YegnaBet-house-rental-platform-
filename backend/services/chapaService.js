const axios = require('axios');
const crypto = require('crypto');

class ChapaService {
  constructor() {
    this.baseURL = 'https://api.chapa.co/v1';
    this.secretKey = process.env.CHAPA_SECRET_KEY;
    this.publicKey = process.env.CHAPA_PUBLIC_KEY;
  }

  // Initialize payment
  async initializePayment(paymentData) {
    try {
      const {
        amount,
        currency = 'ETB',
        email,
        firstName,
        lastName,
        phone,
        txRef,
        callbackUrl,
        returnUrl,
        description
      } = paymentData;

      const payload = {
        amount: amount.toString(),
        currency,
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        tx_ref: txRef,
        callback_url: callbackUrl,
        return_url: returnUrl,
        description,
        customization: {
          title: 'YegnaBet Property Booking',
          description: 'Payment for property booking on YegnaBet'
        }
      };

      const response = await axios.post(`${this.baseURL}/transaction/initialize`, payload, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Chapa initialization error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment initialization failed'
      };
    }
  }

  // Verify payment
  async verifyPayment(txRef) {
    try {
      const response = await axios.get(`${this.baseURL}/transaction/verify/${txRef}`, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`
        }
      });

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Chapa verification error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment verification failed'
      };
    }
  }

  // Generate transaction reference
  generateTxRef(bookingId) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `YB_${bookingId}_${timestamp}_${random}`;
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CHAPA_WEBHOOK_SECRET || 'default-secret')
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  }

  // Mock payment for sandbox/testing
  async mockPayment(paymentData) {
    // Simulate Chapa sandbox response
    const txRef = paymentData.txRef;
    
    return {
      success: true,
      data: {
        message: 'Payment initialized successfully',
        status: 'success',
        data: {
          checkout_url: `https://checkout.chapa.co/checkout/payment/${txRef}`,
          tx_ref: txRef
        }
      }
    };
  }

  // Mock verification for sandbox/testing
  async mockVerification(txRef) {
    // Simulate successful payment verification
    return {
      success: true,
      data: {
        message: 'Payment verified successfully',
        status: 'success',
        data: {
          id: `chapa_${Date.now()}`,
          tx_ref: txRef,
          status: 'success',
          amount: '10000000',
          currency: 'ETB',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    };
  }
}

module.exports = new ChapaService();