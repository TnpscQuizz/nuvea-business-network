const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth } = require('../middleware/auth');
const { submitAppeal } = require('../services/strikeService');

router.get('/dashboard', requireAuth, (req, res) => {
  const userId = req.user.id;
  const businesses = db.getTable('businesses');
  const memberships = db.getTable('memberships');
  const performanceScores = db.getTable('performanceScores');
  const referrals = db.getTable('referrals');
  const videoProjects = db.getTable('videoProjects');
  const strikes = db.getTable('strikes');
  const meetings = db.getTable('meetings');
  const chapters = db.getTable('chapters');

  // Find user's business and membership, or fallback gracefully
  const biz = businesses.find(b => b.userId === userId) || businesses.find(b => b.phone === req.user.phone) || businesses[0];
  const mem = memberships.find(m => m.businessId === biz.id) || memberships[0];
  const perf = performanceScores.find(p => p.memberId === mem.id) || {
    leadsGiven: 0, leadsReceived: 0, closedValue: 0, attendancePercent: 100, score: 50.0, eligibleTier: 'Taluk Member'
  };

  const chapterId = mem.chapterId || biz.chapterId || 'harur_titans';
  const chapter = chapters.find(c => c.id === chapterId);

  // Find all members belonging to THIS chapter/forum
  const forumMemberIds = memberships.filter(m => (m.chapterId || biz.chapterId) === chapterId).map(m => m.id);

  // PRIVATE LEADS: Received by this member specifically
  const myReferralsReceived = referrals.filter(r => r.toMemberId === mem.id);

  // LEADS GIVEN: Passed by this member
  const myReferralsGiven = referrals.filter(r => r.fromMemberId === mem.id);

  // FORUM LEADS: STRICTLY ISOLATED to this Chapter/Forum only!
  const forumReferrals = referrals.filter(r => 
    forumMemberIds.includes(r.fromMemberId) || forumMemberIds.includes(r.toMemberId)
  );

  const myVideo = videoProjects.find(v => v.businessId === biz.id);
  const myStrikes = strikes.filter(s => s.memberId === mem.id);

  res.json({
    business: biz,
    membership: mem,
    chapter: chapter || { id: chapterId, nameTa: 'ஹரூர் சாப்டர்', nameEn: 'Harur Chapter' },
    performance: perf,
    myLeads: myReferralsReceived,
    givenLeads: myReferralsGiven,
    forumLeads: forumReferrals,
    referralsGivenCount: myReferralsGiven.length,
    referralsReceivedCount: myReferralsReceived.length,
    videoProject: myVideo || null,
    activeStrikes: myStrikes.filter(s => s.status !== 'resolved_dismissed'),
    nextMeeting: meetings[0] || null,
    shareableUrl: `/biz/${biz.id}`
  });
});

// Update Member Business Profile
router.put('/profile', requireAuth, (req, res) => {
  try {
    const userId = req.user.id;
    const businesses = db.getTable('businesses');
    const biz = businesses.find(b => b.userId === userId) || businesses.find(b => b.phone === req.user.phone);

    if (!biz) {
      return res.status(404).json({ error: 'வணிகக் கணக்கு கிடைக்கவில்லை' });
    }

    const {
      businessName,
      ownerName,
      phone,
      email,
      address,
      tagline,
      description,
      specialOffer,
      bestPrice,
      discount,
      photos
    } = req.body;

    if (businessName) biz.businessName = businessName;
    if (ownerName) biz.ownerName = ownerName;
    if (phone) biz.phone = phone.replace(/\D/g, '');
    if (email) biz.email = email;
    if (address) biz.address = address;
    if (tagline) biz.tagline = tagline;
    if (description) biz.description = description;
    if (specialOffer) biz.specialOffer = specialOffer;
    if (bestPrice) biz.bestPrice = bestPrice;
    if (discount) biz.discount = discount;
    if (photos && Array.isArray(photos)) biz.photos = photos;

    db.logAudit(userId, 'UPDATE_BUSINESS_PROFILE', 'businesses', biz.id, req.body);
    db.persist();

    res.json({
      success: true,
      message: 'உங்கள் வணிக விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன!',
      business: biz
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Refer a new B2B Lead
router.post('/referral/create', requireAuth, (req, res) => {
  const { toMemberId, clientName, clientPhone, requirement, expectedValue, notes } = req.body;
  if (!toMemberId || !clientName || !clientPhone) {
    return res.status(400).json({ error: 'வாடிக்கையாளர் பெயர் மற்றும் போன் எண் அவசியம்' });
  }

  const memberships = db.getTable('memberships');
  const businesses = db.getTable('businesses');
  const senderMem = memberships.find(m => m.userId === req.user.id) || memberships[0];
  const toMem = memberships.find(m => m.id === toMemberId);

  if (!toMem) {
    return res.status(404).json({ error: 'பெறுநர் உறுப்பினர் கிடைக்கவில்லை' });
  }

  const senderBiz = businesses.find(b => b.id === senderMem.businessId) || {};
  const toBiz = businesses.find(b => b.id === toMem.businessId) || {};

  const newRef = {
    id: `ref_${Date.now()}`,
    fromMemberId: senderMem.id,
    fromBusinessName: senderBiz.businessName || 'உறுப்பினர்',
    toMemberId: toMem.id,
    toBusinessName: toBiz.businessName || 'உறுப்பினர்',
    clientName,
    clientPhone: clientPhone.replace(/\D/g, ''),
    requirement: requirement || 'வணிக தேவை',
    expectedValue: Number(expectedValue) || 50000,
    closedValue: 0,
    status: 'submitted', // submitted -> accepted -> contacted -> negotiation -> won/lost
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const referrals = db.getTable('referrals');
  referrals.unshift(newRef);

  db.logAudit(req.user.id, 'PASS_REFERRAL', 'referrals', newRef.id, {
    toMemberId,
    clientName,
    expectedValue
  });

  db.persist();

  res.json({
    success: true,
    message: 'லீட் வெற்றிகரமாக பகிரப்பட்டது! (Referral submitted successfully)',
    referral: newRef
  });
});

// Update Lead Status Lifecycle
router.patch('/referral/:id/status', requireAuth, (req, res) => {
  const { id } = req.params;
  const { status, closedValue, notes } = req.body;
  const referrals = db.getTable('referrals');
  const ref = referrals.find(r => r.id === id);

  if (!ref) {
    return res.status(404).json({ error: 'லீட் விபரம் கிடைக்கவில்லை' });
  }

  const validStatuses = ['submitted', 'accepted', 'contacted', 'negotiation', 'won', 'lost'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'தவறான நிலை (Invalid status)' });
  }

  ref.status = status;
  if (closedValue !== undefined) ref.closedValue = Number(closedValue);
  if (notes) ref.notes = notes;
  ref.updatedAt = new Date().toISOString();

  db.logAudit(req.user.id, 'UPDATE_REFERRAL_STATUS', 'referrals', id, { status, closedValue });
  db.persist();

  res.json({
    success: true,
    message: `லீட் நிலை "${status}" என மாற்றப்பட்டது!`,
    referral: ref
  });
});

// Get member referrals
router.get('/referrals', requireAuth, (req, res) => {
  const memberships = db.getTable('memberships');
  const mem = memberships.find(m => m.userId === req.user.id) || memberships[0];
  const referrals = db.getTable('referrals');

  const given = referrals.filter(r => r.fromMemberId === mem.id);
  const received = referrals.filter(r => r.toMemberId === mem.id);

  res.json({
    given,
    received
  });
});

// Submit Strike Appeal
router.post('/strikes/appeal', requireAuth, (req, res) => {
  const { strikeId, appealNote } = req.body;
  if (!strikeId || !appealNote) {
    return res.status(400).json({ error: 'விளக்கக் குறிப்பு அவசியம் (Appeal note required)' });
  }

  try {
    const memberships = db.getTable('memberships');
    const mem = memberships.find(m => m.userId === req.user.id) || memberships[0];
    const updated = submitAppeal(strikeId, appealNote, mem.id);
    res.json({ success: true, message: 'உங்கள் மேல்முறையீடு அட்மினுக்கு அனுப்பப்பட்டுள்ளது.', strike: updated });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// --- ONE-TO-ONE MEETINGS ---
router.get('/one-to-ones', requireAuth, (req, res) => {
  const memberships = db.getTable('memberships');
  const mem = memberships.find(m => m.userId === req.user.id) || memberships[0];
  const meetings = db.getTable('oneToOneMeetings');

  const myMeetings = meetings.filter(m => m.hostMemberId === mem.id || m.inviteeMemberId === mem.id);
  res.json(myMeetings);
});

router.post('/one-to-ones', requireAuth, (req, res) => {
  try {
    const memberships = db.getTable('memberships');
    const businesses = db.getTable('businesses');
    const senderMem = memberships.find(m => m.userId === req.user.id) || memberships[0];
    const senderBiz = businesses.find(b => b.id === senderMem.businessId) || {};

    const inviteeMem = memberships.find(m => m.id === req.body.inviteeMemberId);
    const inviteeBiz = inviteeMem ? (businesses.find(b => b.id === inviteeMem.businessId) || {}) : {};

    const meeting = db.scheduleOneToOne({
      ...req.body,
      hostMemberId: senderMem.id,
      hostMemberName: senderBiz.businessName || 'உறுப்பினர்',
      inviteeMemberName: inviteeBiz.businessName || 'உறுப்பினர்',
      chapterId: senderMem.chapterId || 'harur_titans'
    });

    res.json({ success: true, message: 'ஒன்-டு-ஒன் சந்திப்பு கோரிக்கை அனுப்பப்பட்டது!', meeting });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.patch('/one-to-ones/:id', requireAuth, (req, res) => {
  try {
    const updated = db.updateOneToOne(req.params.id, req.body);
    res.json({ success: true, message: 'சந்திப்பு விவரங்கள் புதுப்பிக்கப்பட்டன!', meeting: updated });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// --- GUESTS & VISITOR MANAGEMENT ---
router.get('/guests', requireAuth, (req, res) => {
  const memberships = db.getTable('memberships');
  const mem = memberships.find(m => m.userId === req.user.id) || memberships[0];
  const guests = db.getTable('guests');

  // Member sees guests they invited, or all chapter guests if chapter leadership
  const myGuests = guests.filter(g => g.invitedByMemberId === mem.id || g.chapterId === mem.chapterId);
  res.json(myGuests);
});

router.post('/guests', requireAuth, (req, res) => {
  try {
    const memberships = db.getTable('memberships');
    const businesses = db.getTable('businesses');
    const mem = memberships.find(m => m.userId === req.user.id) || memberships[0];
    const biz = businesses.find(b => b.id === mem.businessId) || {};

    const guest = db.registerGuest({
      ...req.body,
      invitedByMemberId: mem.id,
      invitedByMemberName: biz.businessName || 'உறுப்பினர்',
      chapterId: mem.chapterId || 'harur_titans'
    });

    res.json({ success: true, message: 'பார்வையாளர் அழைப்பு பதிவு செய்யப்பட்டது!', guest });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// --- OFFICIAL CERTIFICATES ---
router.get('/certificates', requireAuth, (req, res) => {
  const memberships = db.getTable('memberships');
  const mem = memberships.find(m => m.userId === req.user.id) || memberships[0];
  const certificates = db.getTable('certificates');

  const myCerts = certificates.filter(c => c.memberId === mem.id || c.businessId === mem.businessId);
  res.json(myCerts);
});

// --- IN-APP NOTIFICATIONS ---
router.get('/notifications', requireAuth, (req, res) => {
  const notifications = db.getTable('notifications');
  const myNotifs = notifications.filter(n => n.userId === req.user.id || n.userId === 'all');
  res.json(myNotifs);
});

router.patch('/notifications/:id/read', requireAuth, (req, res) => {
  const notifications = db.getTable('notifications');
  const notif = notifications.find(n => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    db.persist();
  }
  res.json({ success: true });
});

// --- MUTUAL REFERRAL CONVERSION CONFIRMATION ---
router.post('/referral/:id/confirm', requireAuth, (req, res) => {
  const referrals = db.getTable('referrals');
  const ref = referrals.find(r => r.id === req.params.id);
  if (!ref) return res.status(404).json({ error: 'லீட் விபரம் கிடைக்கவில்லை' });

  const { confirmedValue, notes } = req.body;
  ref.status = 'won';
  ref.stage = 'won';
  ref.verifiedClosedValue = Number(confirmedValue) || ref.estimatedValue || 50000;
  ref.confirmedByBoth = true;
  ref.conversionDate = new Date().toISOString().split('T')[0];
  if (notes) ref.notes = notes;

  db.logAudit(req.user.id, 'CONFIRM_REFERRAL_CONVERSION', 'referrals', ref.id, {
    verifiedClosedValue: ref.verifiedClosedValue
  });
  db.persist();

  res.json({
    success: true,
    message: 'வாழ்த்துகள்! வர்த்தக வெற்றி அதிகாரப்பூர்வமாக உறுதி செய்யப்பட்டது!',
    referral: ref
  });
});

module.exports = router;
