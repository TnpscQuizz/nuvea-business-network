const express = require('express');
const router = express.Router();
const db = require('../database/db');

// 1. PUBLIC DIRECTORY SEARCH & FILTER
router.get('/directory', (req, res) => {
  const { talukId, categoryId, search } = req.query;
  const businesses = db.getTable('businesses');
  const categories = db.getTable('categories');
  const memberships = db.getTable('memberships');
  const taluks = db.getTable('taluks');

  let results = businesses.filter(b => b.status === 'active');

  if (talukId) {
    results = results.filter(b => b.talukId === talukId);
  }

  if (categoryId) {
    results = results.filter(b => b.categoryId === categoryId);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(b => 
      b.businessName.toLowerCase().includes(q) ||
      b.ownerName.toLowerCase().includes(q) ||
      b.tagline.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q)
    );
  }

  const enriched = results.map(b => {
    const cat = categories.find(c => c.id === b.categoryId) || {};
    const mem = memberships.find(m => m.businessId === b.id && m.status === 'active') || {};
    const tal = taluks.find(t => t.id === b.talukId) || {};
    const cleanPhone = b.phone.replace(/\D/g, '');
    const waText = encodeURIComponent(`வணக்கம் ${b.ownerName}, Nuvea Business Network (NBN) டைரக்டரி மூலமாக உங்கள் ${b.businessName} பற்றிய தகவல் பார்த்தேன். விவரம் அறிய விரும்புகிறேன்.`);

    return {
      ...b,
      categoryNameTa: cat.nameTa || '',
      categoryNameEn: cat.nameEn || '',
      categoryGroup: cat.group || '',
      categoryIcon: cat.icon || 'star',
      talukNameTa: tal.nameTa || '',
      talukNameEn: tal.nameEn || '',
      forumNameTa: tal.forumNameTa || '',
      tier: mem.tier || 'taluk',
      whatsappUrl: `https://wa.me/${cleanPhone}?text=${waText}`
    };
  });

  res.json({
    total: enriched.length,
    businesses: enriched
  });
});

// 2. 100 CATEGORY MONOPOLY LOCKER WITH LIVE SLOT STATUS
router.get('/category-slots', (req, res) => {
  const talukId = req.query.talukId || 'harur';
  const categories = db.getTable('categories');
  const businesses = db.getTable('businesses');
  const memberships = db.getTable('memberships');
  const taluks = db.getTable('taluks');

  const talukObj = taluks.find(t => t.id === talukId) || taluks[0];
  const activeMemberships = memberships.filter(m => m.talukId === talukId && m.status === 'active');

  const memberCategoryMap = {};
  activeMemberships.forEach(m => {
    const b = businesses.find(item => item.id === m.businessId) || {};
    memberCategoryMap[m.categoryId] = {
      membershipId: m.id,
      businessName: b.businessName || 'பதிவு செய்யப்பட்ட நிறுவனம்',
      ownerName: b.ownerName || 'உரிமையாளர்',
      phone: b.phone || '',
      rating: b.rating || 5,
      reviewCount: b.reviewCount || 1,
      tagline: b.tagline || '',
      address: b.address || '',
      videoBenefitStatus: b.videoBenefitStatus || 'scheduled',
      tier: m.tier
    };
  });

  const slots = categories.map((cat, index) => {
    const occupant = memberCategoryMap[cat.id];
    return {
      slotNumber: index + 1,
      categoryId: cat.id,
      nameTa: cat.nameTa,
      nameEn: cat.nameEn,
      group: cat.group,
      icon: cat.icon,
      isLocked: !!occupant,
      status: occupant ? 'OCCUPIED' : 'AVAILABLE',
      occupant: occupant || null,
      price: 1500,
      currency: 'INR'
    };
  });

  const occupancy = db.getTalukOccupancy(talukId);

  res.json({
    taluk: talukObj,
    occupancy,
    totalCategories: slots.length,
    lockedCount: activeMemberships.length,
    availableCount: Math.max(0, occupancy.maxSeats - activeMemberships.length),
    slots
  });
});

// 3. TALUKS LIST WITH SEAT OCCUPANCY
router.get('/taluks', (req, res) => {
  const taluks = db.getTable('taluks');
  const enriched = taluks.map(t => {
    const occ = db.getTalukOccupancy(t.id);
    return {
      ...t,
      occupancy: occ
    };
  });
  res.json(enriched);
});

// 4. DISTRICTS LIST (38 Tamil Nadu districts)
router.get('/districts', (req, res) => {
  res.json(db.getTable('districts'));
});

// 5. PLATFORM LIVE COUNTER STATS
router.get('/stats', (req, res) => {
  const businesses = db.getTable('businesses');
  const referrals = db.getTable('referrals');
  const memberships = db.getTable('memberships');
  const taluks = db.getTable('taluks');

  const totalClosed = referrals
    .filter(r => r.status === 'won')
    .reduce((acc, r) => acc + (Number(r.closedValue) || 0), 0);

  res.json({
    verifiedBusinessesCount: businesses.filter(b => b.status === 'active').length,
    referralsExchangedCount: referrals.length,
    businessClosedTotal: totalClosed,
    businessClosedFormatted: `₹${(totalClosed / 10000000).toFixed(2)} கோடி`,
    totalTaluksCount: taluks.length,
    activeMembershipsCount: memberships.filter(m => m.status === 'active').length
  });
});

// 6. REAL-TIME CATEGORY AVAILABILITY CHECKER ACROSS CHAPTERS
router.get('/category-availability', (req, res) => {
  const { chapterId, categoryId } = req.query;
  const chapters = db.getTable('chapters');
  const memberships = db.getTable('memberships');
  const businesses = db.getTable('businesses');
  const categories = db.getTable('categories');

  if (!chapterId && !categoryId) {
    return res.status(400).json({ error: 'ChapterId அல்லது CategoryId அவசியம்' });
  }

  const selectedChap = chapters.find(c => c.id === chapterId) || chapters[0];
  const cat = categories.find(c => c.id === categoryId);

  // Check in specific chapter
  const existingMem = memberships.find(m => 
    m.chapterId === selectedChap.id && 
    m.categoryId === categoryId && 
    m.status === 'active'
  );

  const occ = db.getChapterOccupancy(selectedChap.id);
  const isChapterFull = selectedChap.capacity > 0 && occ.filledSeats >= selectedChap.capacity;

  let status = 'available';
  let occupant = null;

  if (existingMem) {
    status = 'occupied';
    const b = businesses.find(item => item.id === existingMem.businessId) || {};
    occupant = {
      businessName: b.businessName,
      ownerName: b.ownerName,
      tier: existingMem.tier,
      validUntil: existingMem.expiryDate
    };
  } else if (isChapterFull) {
    status = 'chapter_full';
  }

  res.json({
    chapter: {
      id: selectedChap.id,
      nameTa: selectedChap.nameTa,
      capacity: selectedChap.capacity || 100,
      filledSeats: occ.filledSeats,
      availableSeats: Math.max(0, (selectedChap.capacity || 100) - occ.filledSeats)
    },
    category: cat || { id: categoryId, nameTa: categoryId },
    status, // available, occupied, chapter_full
    occupant,
    canApply: status === 'available'
  });
});

// 7. ONLINE MEMBERSHIP APPLICATION
router.post('/apply-membership', (req, res) => {
  try {
    const app = db.submitApplication(req.body);
    res.json({
      success: true,
      message: 'உங்கள் NBN உறுப்பினர் சேர்க்கை விண்ணப்பம் வெற்றிகரமாக பெறப்பட்டது! உறுப்பினர் குழுவினர் உங்களை தொடர்பு கொள்வார்கள்.',
      application: app
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 8. VISITOR / GUEST REGISTRATION FOR WEEKLY MEETINGS
router.post('/register-guest', (req, res) => {
  try {
    const guest = db.registerGuest(req.body);
    res.json({
      success: true,
      message: 'விருந்தினர் பதிவு வெற்றிகரமாக முடிந்தது! சந்திப்பு வழிகாட்டுதல் WhatsApp-ல் அனுப்பப்படும்.',
      guest
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 9. PUBLIC CERTIFICATE VERIFICATION
router.get('/verify-certificate/:certId', (req, res) => {
  const { certId } = req.params;
  const certificates = db.getTable('certificates');
  const cert = certificates.find(c => c.id === certId || c.certificateNumber === certId);

  if (!cert) {
    return res.status(404).json({
      verified: false,
      message: 'சான்றிதழ் விபரம் காணப்படவில்லை. இது செல்லுபடியாகாத சான்றிதழ் எண்.'
    });
  }

  res.json({
    verified: true,
    certificate: cert,
    issuer: 'Nuvea Business Network (NBN) • Nuvea Studio',
    verifiedAt: new Date().toISOString()
  });
});

module.exports = router;
