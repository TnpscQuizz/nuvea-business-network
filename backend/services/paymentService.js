const crypto = require('crypto');
const db = require('../database/db');

function createOrder({ membershipId, amount, currency = 'INR', keyId }) {
  const settings = db.getSettings();
  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const validAmount = (amount !== undefined && amount !== null && !isNaN(Number(amount))) ? Number(amount) : 1;

  const order = {
    id: orderId,
    membershipId,
    amount: validAmount,
    currency: 'INR', // Strictly Indian Rupee (INR) only
    paymentUrl: settings.razorpayPaymentLink || 'https://rzp.io/rzp/qsujcmuB',
    keyId: keyId || settings.razorpayKeyId || 'rzp_test_NBN_DEMO_KEY',
    isDemo: settings.demoPaymentMode !== false
  };

  return order;
}

function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const settings = db.getSettings();
  if (settings.demoPaymentMode) {
    // In local demo mode, accept demo payments cleanly
    return true;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature === razorpaySignature;
}

function generateInvoicePdfData(invoiceId) {
  const invoices = db.getTable('invoices');
  const invoice = invoices.find(inv => inv.id === invoiceId || inv.invoiceNumber === invoiceId);
  if (!invoice) throw new Error('விலைப்பட்டியல் கிடைக்கவில்லை (Invoice not found)');

  const settings = db.getSettings();

  return {
    invoiceNumber: invoice.invoiceNumber,
    date: invoice.date,
    platform: {
      name: settings.platformName,
      agency: settings.founderAgency,
      founder: settings.founderName,
      phone: settings.founderPhone,
      gstin: '33AABCN7548Z1Z9',
      address: 'ஹரூர், தருமபுரி மாவட்டம், தமிழ்நாடு - 636903'
    },
    client: {
      businessName: invoice.businessName,
      gstin: invoice.gstin || 'UNREGISTERED'
    },
    items: [
      {
        description: 'NBN வருடாந்திர தாலுகா எக்ஸ்க்ளூசிவ் பிசினஸ் மெம்பர்ஷிப் (100% Category Monopoly)',
        sacCode: '998314',
        baseAmount: invoice.baseAmount
      },
      {
        description: 'நுவேவா ஸ்டுடியோ 4K விளம்பர வீடியோ தயாரிப்பு பலன் (Included Promotional Benefit)',
        sacCode: '998314',
        baseAmount: 0 // Promotional benefit included
      }
    ],
    totals: {
      baseAmount: invoice.baseAmount,
      cgstRate: '9%',
      cgstAmount: invoice.cgst,
      sgstRate: '9%',
      sgstAmount: invoice.sgst,
      totalAmount: invoice.totalAmount
    }
  };
}

module.exports = {
  createOrder,
  verifyPaymentSignature,
  generateInvoicePdfData
};
