const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { createOrder, verifyPaymentSignature, generateInvoicePdfData } = require('../services/paymentService');

// Create Order (supports 1 INR test or custom amount)
router.post('/create-order', (req, res) => {
  const { membershipId, amount } = req.body;
  const numAmount = amount !== undefined ? Number(amount) : 1;
  const order = createOrder({ membershipId, amount: numAmount });
  res.json(order);
});

// Verify Payment & Activate Membership
router.post('/verify', (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, membershipId } = req.body;

  const isValid = verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
  if (!isValid) {
    return res.status(400).json({ error: 'கட்டண கையொப்பம் சரிபார்க்க முடியவில்லை (Payment verification failed)' });
  }

  const memberships = db.getTable('memberships');
  const mem = memberships.find(m => m.id === membershipId);
  if (mem) {
    mem.status = 'active';
  }

  const payments = db.getTable('payments');
  const paidAmount = Number(req.body.amount) || (mem ? mem.totalAmount : 1500);
  const newPayment = {
    id: `pay_${Date.now()}`,
    membershipId,
    amount: mem ? mem.annualFee : paidAmount,
    gstAmount: mem ? mem.gstAmount : 0,
    totalAmount: paidAmount,
    currency: 'INR', // Strictly Indian Rupee (INR) only
    razorpayOrderId,
    razorpayPaymentId: razorpayPaymentId || `pay_demo_${Date.now()}`,
    status: 'captured',
    paymentUrl: 'https://rzp.io/rzp/qsujcmuB',
    invoiceNumber: mem ? mem.invoiceNumber : `INV-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  payments.push(newPayment);
  db.logAudit('payment_gateway', 'PAYMENT_CAPTURED', 'payments', newPayment.id, { totalAmount: newPayment.totalAmount });
  db.persist();

  res.json({
    success: true,
    message: 'கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது! உங்கள் உறுப்பினர் அந்தஸ்து செயல்படுத்தப்பட்டது.',
    payment: newPayment
  });
});

// Get Tax Invoice Details
router.get('/invoice/:id', (req, res) => {
  try {
    const data = generateInvoicePdfData(req.params.id);
    res.json(data);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

module.exports = router;
