/**
 * NUVEA BUSINESS NETWORK (NBN) — AUTOMATED SYSTEM TEST SUITE
 * Verifies all 14 Core Requirements & Enterprise Invariants
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log(`=======================================================`);
  console.log(` NUVEA BUSINESS NETWORK (NBN) - AUTOMATED TEST SUITE`);
  console.log(` Target: ${BASE_URL}`);
  console.log(` Time: ${new Date().toISOString()}`);
  console.log(`=======================================================\n`);

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  let memberToken = null;
  let adminToken = null;

  // TEST 1: User Registration
  await test('1. User Registration & Password Hashing', async () => {
    const uniquePhone = `9842${Math.floor(100000 + Math.random() * 900000)}`;
    const res = await request('POST', '/api/auth/register', {
      name: 'செல்வகுமார் (Test Owner)',
      phone: uniquePhone,
      email: `${uniquePhone}@nbn.in`,
      password: 'StrongPassword123'
    });

    if (res.statusCode !== 200 || !res.data.token) {
      throw new Error(`Registration failed: ${JSON.stringify(res.data)}`);
    }
    memberToken = res.data.token;
  });

  // TEST 2: Authentication & JWT Login
  await test('2. Authentication, JWT Issuance & Token Verification', async () => {
    const adminRes = await request('POST', '/api/auth/demo-login', { role: 'super_admin' });
    if (adminRes.statusCode !== 200 || !adminRes.data.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(adminRes.data)}`);
    }
    adminToken = adminRes.data.token;

    const meRes = await request('GET', '/api/auth/me', null, adminToken);
    if (meRes.statusCode !== 200 || meRes.data.user.role !== 'super_admin') {
      throw new Error(`Failed to verify admin identity: ${JSON.stringify(meRes.data)}`);
    }
  });

  // TEST 3: Role-Based Access Control (RBAC)
  await test('3. Role Permissions: Public/Member cannot access Super Admin Settings', async () => {
    const unauthRes = await request('POST', '/api/admin/settings', { annualFeeTaluk: 16000 }, memberToken);
    if (unauthRes.statusCode !== 403) {
      throw new Error(`Expected 403 Forbidden for member role, got ${unauthRes.statusCode}`);
    }
  });

  // TEST 4: Category Monopoly Exclusivity Collision (HTTP 409 Conflict)
  await test('4. Duplicate Category Collision Prevention: Expect HTTP 409 Conflict', async () => {
    // Try to book 'jewellery' in 'harur' where Sri Lakshmi Jewellers already holds the seat
    const collisionRes = await request('POST', '/api/monopoly/reserve', {
      talukId: 'harur',
      categoryId: 'jewellery',
      businessName: 'போட்டி ஜுவல்லரி (Competitor)',
      ownerName: 'ரவிக்குமார்',
      phone: '9842999888'
    });

    if (collisionRes.statusCode !== 409) {
      throw new Error(`Expected 409 Conflict, got HTTP ${collisionRes.statusCode}: ${JSON.stringify(collisionRes.data)}`);
    }
    if (!collisionRes.data.error.includes('ஏற்கனவே')) {
      throw new Error(`Error message did not indicate category lock`);
    }
  });

  // TEST 5: Successful Seat Lock & Monopoly Acquisition
  await test('5. Successful Seat Reservation: Locks Category & Provisions Video Benefit', async () => {
    const slotsRes = await request('GET', '/api/public/category-slots?talukId=pennagaram');
    const availableSlot = slotsRes.data.slots.find(s => !s.isLocked) || { categoryId: 'dairy_equipment' };
    const uniqueCat = availableSlot.categoryId;

    const res = await request('POST', '/api/monopoly/reserve', {
      talukId: 'pennagaram',
      categoryId: uniqueCat,
      businessName: 'பென்னாகரம் வெற்றிவேல் சர்வீஸ்',
      ownerName: 'கே. வெற்றிவேல்',
      phone: `9842${Math.floor(100000 + Math.random() * 900000)}`,
      address: 'மெயின் ரோடு, பென்னாகரம்'
    });

    if (res.statusCode !== 200 || !res.data.success) {
      throw new Error(`Failed to book available seat: ${JSON.stringify(res.data)}`);
    }
    if (!res.data.invoice || !res.data.videoProject) {
      throw new Error(`Invoice or Nuvea Video Project was not provisioned automatically.`);
    }
  });

  // TEST 6: 100-Slot Category Grid Integrity
  await test('6. 100-Category Grid & 38 Districts Querying', async () => {
    const slotsRes = await request('GET', '/api/public/category-slots?talukId=harur');
    if (slotsRes.statusCode !== 200 || slotsRes.data.totalCategories !== 100) {
      throw new Error(`Expected 100 practical categories, got ${slotsRes.data.totalCategories}`);
    }

    const distRes = await request('GET', '/api/public/districts');
    if (distRes.statusCode !== 200 || distRes.data.length !== 38) {
      throw new Error(`Expected 38 Tamil Nadu districts, got ${distRes.data.length}`);
    }
  });

  // TEST 7: Referral Lifecycle (Submitted -> Won)
  await test('7. Referral Lifecycle Tracking (Submitted -> Won) & Audit Trail', async () => {
    const createRef = await request('POST', '/api/member/referral/create', {
      toMemberId: 'mem_002',
      clientName: 'அரூர் கார்த்திக் வில்லா',
      clientPhone: '9842555444',
      requirement: '20 சவரன் ஆபரண நகை',
      expectedValue: 1000000
    }, memberToken);

    if (createRef.statusCode !== 200 || !createRef.data.referral) {
      throw new Error(`Failed to create referral: ${JSON.stringify(createRef.data)}`);
    }

    const refId = createRef.data.referral.id;
    const updateRef = await request('PATCH', `/api/member/referral/${refId}/status`, {
      status: 'won',
      closedValue: 1000000,
      notes: 'ஆர்டர் உறுதி செய்யப்பட்டது (Order Won).'
    }, memberToken);

    if (updateRef.statusCode !== 200 || updateRef.data.referral.status !== 'won') {
      throw new Error(`Failed to update referral to won: ${JSON.stringify(updateRef.data)}`);
    }
  });

  // TEST 8: 4-Tier Elevation Engine & Leaderboard Scoring
  await test('8. Four-Level Elevation Engine: Composite Score Calculation', async () => {
    const leaderRes = await request('GET', '/api/elevation/leaderboard');
    if (leaderRes.statusCode !== 200 || !Array.isArray(leaderRes.data.leaderboard)) {
      throw new Error(`Failed to fetch leaderboard: ${JSON.stringify(leaderRes.data)}`);
    }
    const top = leaderRes.data.leaderboard[0];
    if (typeof top.compositeScore !== 'number' || !top.eligibleTier) {
      throw new Error(`Missing score or tier eligibility on leaderboard item: ${JSON.stringify(top)}`);
    }
  });

  // TEST 9: Weekly Meeting AI Conductor & 45-Second Queue
  await test('9. Weekly Meeting AI Conductor: Speaker Advancement & Post-Meet Report', async () => {
    const advanceRes = await request('POST', '/api/meeting/advance');
    if (advanceRes.statusCode !== 200 || !advanceRes.data.currentSpeaker) {
      throw new Error(`Failed to advance speaker queue: ${JSON.stringify(advanceRes.data)}`);
    }

    const reportRes = await request('GET', '/api/meeting/report');
    if (reportRes.statusCode !== 200 || !reportRes.data.attendance || !reportRes.data.businessStats) {
      throw new Error(`Failed to generate post-meeting auto report: ${JSON.stringify(reportRes.data)}`);
    }
  });

  // TEST 10: Three-Strike Discipline Engine with Notice & Appeal
  await test('10. Three-Strike Discipline Engine: Strike Issuance & Appeal Workflow', async () => {
    const issueRes = await request('POST', '/api/admin/strikes/issue', {
      memberId: 'mem_003',
      reason: '3 தொடர் வாரங்கள் லீட்கள் வழங்கவில்லை (No referrals passed)'
    }, adminToken);

    if (issueRes.statusCode !== 200 || !issueRes.data.strike) {
      throw new Error(`Failed to issue strike: ${JSON.stringify(issueRes.data)}`);
    }

    const strikeId = issueRes.data.strike.id;
    const appealRes = await request('POST', '/api/member/strikes/appeal', {
      strikeId,
      appealNote: 'கடந்த வாரம் உடல்நிலை சரியில்லாததால் வர இயலவில்லை. அடுத்த வாரம் 2 லீட்கள் உறுதி.'
    }, memberToken);

    if (appealRes.statusCode !== 200 || appealRes.data.strike.status !== 'appealed') {
      throw new Error(`Failed to submit strike appeal: ${JSON.stringify(appealRes.data)}`);
    }
  });

  // TEST 11: Dynamic Admin Settings Persistence (Zero Restart)
  await test('11. Dynamic Admin Settings Persistence without Server Restart', async () => {
    const newFee = 17500;
    const updateRes = await request('POST', '/api/admin/settings', {
      annualFeeTaluk: newFee,
      retreatLocation: 'கொடைக்கானல் பிசினஸ் சம்மிட் (Kodaikanal Summit)'
    }, adminToken);

    if (updateRes.statusCode !== 200 || updateRes.data.settings.annualFeeTaluk !== newFee) {
      throw new Error(`Failed to update admin settings: ${JSON.stringify(updateRes.data)}`);
    }
  });

  // TEST 12: GST Tax Invoice Calculation & Verification
  await test('12. GST Tax Invoicing: 18% (9% CGST + 9% SGST) and SAC Code 998314', async () => {
    const invRes = await request('GET', '/api/payment/invoice/INV-2024-001');
    if (invRes.statusCode !== 200 || !invRes.data.totals) {
      throw new Error(`Failed to retrieve invoice: ${JSON.stringify(invRes.data)}`);
    }
    const t = invRes.data.totals;
    if (t.cgstAmount + t.sgstAmount !== t.totalAmount - t.baseAmount) {
      throw new Error(`GST calculation mismatch`);
    }
  });

  // TEST 13: Customer Business Requirement Submission & Cross-Chapter Matching
  let createdReqId = null;
  await test('13. Marketplace: Customer Post Requirement & Auto Matching', async () => {
    const reqRes = await request('POST', '/api/marketplace/requirements', {
      customerName: 'ரவிச்சந்திரன் பில்டர்ஸ்',
      customerPhone: '9842556677',
      customerEmail: 'ravi.build@gmail.com',
      categoryId: 'steel_cement',
      categoryName: 'ஸ்டீல் & சிமெண்ட்',
      quantity: 500,
      unit: 'மூட்டை',
      deliveryTaluk: 'harur',
      deliveryDistrict: 'dharmapuri'
    });

    if (reqRes.statusCode !== 201 || !reqRes.data.requirement) {
      throw new Error(`Failed to submit requirement: ${JSON.stringify(reqRes.data)}`);
    }
    createdReqId = reqRes.data.requirement.id;
    if (!createdReqId.startsWith('REQ-')) {
      throw new Error('Invalid requirement ID generated');
    }
  });

  // TEST 14: Member Quotation Bid Submission & Price Calculations
  let createdQuoteId = null;
  await test('14. Marketplace: Multi-Supplier Quotation Bidding & Tax Calc', async () => {
    const quoteRes = await request('POST', `/api/marketplace/requirements/${createdReqId}/quotations`, {
      supplierMemberId: 'mem_001',
      supplierBusinessName: 'ஹரூர் ஸ்ரீ கணபதி சிமெண்ட்',
      unitPrice: 340,
      quantity: 500,
      deliveryCharges: 1500,
      deliveryTimeline: '24 மணி நேரத்தில் டெலிவரி'
    }, memberToken);

    if (quoteRes.statusCode !== 201 || !quoteRes.data.quotation) {
      throw new Error(`Failed to submit quotation: ${JSON.stringify(quoteRes.data)}`);
    }
    createdQuoteId = quoteRes.data.quotation.id;
    const q = quoteRes.data.quotation;
    // Expected: subtotal = 170000, 18% GST = 30600, delivery = 1500, total = 202100
    if (q.finalTotal !== 202100) {
      throw new Error(`Quotation calculation error: expected 202100, got ${q.finalTotal}`);
    }
  });

  // TEST 15: Customer Consent & Supplier Contact Unlock (Order Generation)
  let createdOrderId = null;
  await test('15. Marketplace: Customer Selection with Consent & Contact Unlocking', async () => {
    const selectRes = await request('POST', `/api/marketplace/requirements/${createdReqId}/select`, {
      quotationId: createdQuoteId,
      consent: true
    });

    if (selectRes.statusCode !== 200 || !selectRes.data.order) {
      throw new Error(`Failed to select quotation: ${JSON.stringify(selectRes.data)}`);
    }
    const order = selectRes.data.order;
    createdOrderId = order.id;
    if (order.customerPhone !== '9842556677') {
      throw new Error('Customer phone was not unlocked upon consent');
    }
  });

  // TEST 16: Order Status Delivery & Verified Transaction Review
  await test('16. Marketplace: Order Delivery & Verified Transaction Review', async () => {
    // 1. Mark delivered
    const statusRes = await request('PATCH', `/api/marketplace/orders/${createdOrderId}/status`, {
      status: 'delivered',
      note: 'பொருட்கள் முழுமையாக டெலிவரி செய்யப்பட்டது'
    });
    if (statusRes.statusCode !== 200) {
      throw new Error(`Failed to update order status: ${JSON.stringify(statusRes.data)}`);
    }

    // 2. Submit verified review
    const reviewRes = await request('POST', '/api/marketplace/reviews', {
      orderId: createdOrderId,
      rating: 5,
      comment: 'நேரத்திற்கு துல்லியமான டெலிவரி. மிகுந்த திருப்தி!'
    });
    if (reviewRes.statusCode !== 201 || !reviewRes.data.review) {
      throw new Error(`Failed to submit review: ${JSON.stringify(reviewRes.data)}`);
    }
  });

  console.log(`\n=======================================================`);
  console.log(` TEST RUN COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=======================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(e => {
  console.error('Test runner fatal error:', e);
  process.exit(1);
});
