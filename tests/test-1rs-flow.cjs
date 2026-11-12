const http = require('http');

async function test1RsFlow() {
  console.log('Testing ₹1 Registration & Payment Flow...');

  // 1. Create Order with amount: 1
  const orderData = JSON.stringify({ amount: 1, currency: 'INR' });
  const orderRes = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(orderData)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(orderData);
    req.end();
  });

  console.log('1. Order Created:', orderRes);
  if (orderRes.amount !== 1 || orderRes.currency !== 'INR') {
    throw new Error('Order amount must be 1 INR');
  }

  // 2. Verify Payment with amount: 1
  const verifyData = JSON.stringify({
    razorpayOrderId: orderRes.id,
    razorpayPaymentId: 'pay_test_' + Date.now(),
    razorpaySignature: 'valid_signature',
    amount: 1
  });

  const verifyRes = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(verifyData)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(verifyData);
    req.end();
  });

  console.log('2. Payment Verified:', verifyRes);
  if (verifyRes.payment.totalAmount !== 1 || verifyRes.payment.currency !== 'INR') {
    throw new Error('Verified payment totalAmount must be 1 INR');
  }

  // 3. Register Business Owner
  const phone = '98765' + Math.floor(10000 + Math.random() * 90000);
  const regPayload = JSON.stringify({
    fullName: 'லைவ் டெஸ்ட் உரிமையாளர்',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    phone: phone,
    whatsapp: phone,
    email: 'test' + Date.now() + '@nuvea.in',
    password: 'password123',
    designation: 'உரிமையாளர் (Owner)',
    businessName: 'ஸ்ரீ ஆண்டாள் சில்க்ஸ் ' + Date.now(),
    logo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200',
    categoryId: 'textiles',
    talukId: 'pennagaram',
    preferredChapterId: 'dharmapuri_royals',
    accountType: 'networking_marketplace',
    orderId: orderRes.id,
    paymentId: verifyRes.payment.razorpayPaymentId
  });

  const regRes = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/api/auth/register-owner-full', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(regPayload)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(regPayload);
    req.end();
  });

  console.log('3. Owner Registered:', {
    user: regRes.user.fullName,
    role: regRes.user.role,
    business: regRes.business.businessName,
    status: regRes.business.status
  });

  console.log('\n[SUCCESS] ₹1 INR Full Registration & Payment Flow 100% Verified!');
}

test1RsFlow().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
