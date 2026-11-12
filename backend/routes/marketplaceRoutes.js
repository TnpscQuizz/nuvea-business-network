const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

// ==========================================
// MODULE B: MARKETPLACE REST API ROUTES
// ==========================================

// 1. Search Marketplace Suppliers Across All Chapters
router.get('/search', (req, res) => {
  try {
    const { query, categoryId, districtId, talukId } = req.query;
    const results = db.searchMarketplace(query, categoryId, districtId, talukId);
    
    // Enrich with chapter information and category name
    const chapters = db.getTable('chapters');
    const categories = db.getTable('categories');

    const enriched = results.map(b => {
      const chap = chapters.find(c => c.id === b.chapterId) || {};
      const cat = categories.find(c => c.id === b.categoryId) || {};
      return {
        ...b,
        chapterNameTa: chap.nameTa || 'ஹரூர் டைட்டன்ஸ்',
        chapterNameEn: chap.nameEn || 'Harur Titans',
        categoryNameTa: cat.nameTa || b.category,
        categoryNameEn: cat.nameEn || b.category,
        isVerifiedMember: true,
        rating: b.rating || 4.9
      };
    });

    res.json({
      success: true,
      total: enriched.length,
      suppliers: enriched
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Customer Post Business Requirement
router.post('/requirements', (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      title,
      categoryId,
      categoryName,
      quantity,
      unit,
      brandPreference,
      specifications,
      deliveryDistrict,
      deliveryTaluk,
      deliveryAddress,
      pinCode,
      deliveryRequired,
      requiredDate
    } = req.body;

    if (!customerName || !customerPhone || !categoryId) {
      return res.status(400).json({
        error: 'வாடிக்கையாளர் பெயர், தொடர்பு எண் மற்றும் வணிகப் பிரிவு கட்டாயம் (Name, phone, and category are required)'
      });
    }

    // Attach customer user ID if logged in, otherwise anonymous guest
    const customerId = req.user ? req.user.id : (req.body.customerId || 'cust_' + Date.now().toString(36));

    const requirement = db.createCustomerRequirement({
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      title,
      categoryId,
      categoryName,
      quantity,
      unit,
      brandPreference,
      specifications,
      deliveryDistrict,
      deliveryTaluk,
      deliveryAddress,
      pinCode,
      deliveryRequired,
      requiredDate
    });

    res.status(201).json({
      success: true,
      message: 'உங்கள் தேவை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! பொருத்தமான NBN உறுப்பினர்களுக்கு அறிவிக்கப்பட்டுள்ளது.',
      requirement
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. List Requirements (With privacy filter)
router.get('/requirements', (req, res) => {
  try {
    const requestingUser = req.user || null;
    const reqs = db.getCustomerRequirements(req.query, requestingUser);
    res.json({
      success: true,
      total: reqs.length,
      requirements: reqs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Single Requirement by ID
router.get('/requirements/:id', (req, res) => {
  try {
    const requestingUser = req.user || null;
    const requirement = db.getCustomerRequirementById(req.params.id, requestingUser);
    if (!requirement) {
      return res.status(404).json({ error: 'தேவை விவரம் காணப்படவில்லை (Requirement not found)' });
    }
    res.json({ success: true, requirement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Quotations for a Requirement (With Competitor Quote Privacy)
router.get('/requirements/:id/quotations', (req, res) => {
  try {
    const requestingUser = req.user || null;
    const quotations = db.getQuotationsForRequirement(req.params.id, requestingUser);
    res.json({
      success: true,
      total: quotations.length,
      quotations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Member Submit Quotation Bid
router.post('/requirements/:id/quotations', (req, res) => {
  try {
    const {
      supplierMemberId,
      supplierBusinessName,
      supplierChapterId,
      supplierPhone,
      unitPrice,
      quantity,
      gstAmount,
      deliveryCharges,
      installationCharges,
      discount,
      deliveryTimeline,
      validityDays,
      validUntil,
      stockAvailability,
      paymentTerms,
      warrantyTerms,
      notes
    } = req.body;

    if (!unitPrice || isNaN(parseFloat(unitPrice))) {
      return res.status(400).json({ error: 'சரியான அலகு விலை (Unit price) உள்ளிடவும்' });
    }

    const quotation = db.submitQuotation({
      requirementId: req.params.id,
      supplierMemberId: supplierMemberId || (req.user ? req.user.id : 'mem_001'),
      supplierBusinessName: supplierBusinessName || 'NBN சரிபார்க்கப்பட்ட உறுப்பினர்',
      supplierChapterId,
      supplierPhone,
      unitPrice,
      quantity,
      gstAmount,
      deliveryCharges,
      installationCharges,
      discount,
      deliveryTimeline,
      validityDays,
      validUntil,
      stockAvailability,
      paymentTerms,
      warrantyTerms,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'உங்கள் விலைப்புள்ளி வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
      quotation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Customer Shortlist a Quotation
router.post('/requirements/:id/shortlist', (req, res) => {
  try {
    const { quotationId } = req.body;
    if (!quotationId) {
      return res.status(400).json({ error: 'விலைப்புள்ளி எண் தேவை (quotationId required)' });
    }
    const shortlisted = db.shortlistQuotation(req.params.id, quotationId);
    res.json({
      success: true,
      message: 'விலைப்புள்ளி தேர்வுப் பட்டியலில் சேர்க்கப்பட்டது (Shortlisted)',
      quotation: shortlisted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Customer Select Quotation & Explicit Contact Consent
router.post('/requirements/:id/select', (req, res) => {
  try {
    const { quotationId, consent } = req.body;
    if (!quotationId) {
      return res.status(400).json({ error: 'தேர்வு செய்யப்பட வேண்டிய விலைப்புள்ளி எண் தேவை' });
    }
    if (!consent) {
      return res.status(400).json({
        error: 'தொடர்பு விவரங்களை தேர்வு செய்த உறுப்பினருக்கு பகிர வாடிக்கையாளர் சம்மதம் கட்டாயம் (Consent is required)'
      });
    }

    const result = db.selectQuotationWithConsent(req.params.id, quotationId, consent, req.user);
    res.json({
      success: true,
      message: 'வணிகர் தேர்வு செய்யப்பட்டு ஆர்டர் வெற்றிகரமாக உருவாக்கப்பட்டது! இருதரப்புக்கும் தொடர்பு விவரங்கள் பகிரப்பட்டுள்ளது.',
      ...result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. List Marketplace Orders
router.get('/orders', (req, res) => {
  try {
    let orders = db.getTable('marketplaceOrders') || [];
    const { customerId, supplierMemberId, status } = req.query;

    if (customerId) orders = orders.filter(o => o.customerId === customerId);
    if (supplierMemberId) orders = orders.filter(o => o.supplierMemberId === supplierMemberId);
    if (status) orders = orders.filter(o => o.orderStatus === status);

    res.json({
      success: true,
      total: orders.length,
      orders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Update Order Status
router.patch('/orders/:id/status', (req, res) => {
  try {
    const { status, note } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'புதிய நிலை (status) தேவை' });
    }
    const actorId = req.user ? req.user.id : 'actor_system';
    const updated = db.updateMarketplaceOrderStatus(req.params.id, status, actorId, note);
    res.json({
      success: true,
      message: `ஆர்டர் நிலை "${status}" என வெற்றிகரமாக மாற்றப்பட்டது`,
      order: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Submit Verified Transaction Review
router.post('/reviews', (req, res) => {
  try {
    const { orderId, rating, qualityRating, communicationRating, deliveryRating, comment } = req.body;
    if (!orderId || !rating) {
      return res.status(400).json({ error: 'ஆர்டர் எண் மற்றும் மதிப்பீடு (Rating) தேவை' });
    }

    const customerId = req.user ? req.user.id : req.body.customerId;
    const review = db.submitTransactionReview({
      orderId,
      customerId,
      customerName: req.body.customerName,
      rating,
      qualityRating,
      communicationRating,
      deliveryRating,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'உங்கள் சரிபார்க்கப்பட்ட மதிப்பாய்வு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! நன்றி.',
      review
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 12. Lodge Dispute
router.post('/disputes', (req, res) => {
  try {
    const { orderId, issueType, description } = req.body;
    if (!orderId || !description) {
      return res.status(400).json({ error: 'ஆர்டர் எண் மற்றும் புகார் விவரம் தேவை' });
    }

    const dispute = db.lodgeDispute({
      orderId,
      customerId: req.user ? req.user.id : req.body.customerId,
      supplierMemberId: req.body.supplierMemberId,
      issueType,
      description
    });

    res.status(201).json({
      success: true,
      message: 'உங்கள் புகார் பதிவு செய்யப்பட்டது. NBN நிர்வாகக் குழு ஆய்வு செய்து 24 மணி நேரத்திற்குள் தீர்வு வழங்கும்.',
      dispute
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Resolve Dispute (Admin Only)
router.patch('/disputes/:id/resolve', requireAuth, requireRole('super_admin'), (req, res) => {
  try {
    const { resolutionNotes } = req.body;
    const resolved = db.resolveDispute(req.params.id, resolutionNotes, req.user.id);
    res.json({
      success: true,
      message: 'புகார் வெற்றிகரமாக தீர்க்கப்பட்டது (Dispute Resolved)',
      dispute: resolved
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
