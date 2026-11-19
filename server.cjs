const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Global Exception & Rejection Handlers to Prevent Server Crash on Remote Network Timeouts
const logFile = path.join(__dirname, 'server.log');
function logServerEvent(msg) {
  try {
    const entry = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(logFile, entry);
    console.log(msg);
  } catch (e) {}
}

process.on('uncaughtException', (err) => {
  logServerEvent(`[UNCAUGHT EXCEPTION]: ${err.stack || err.message || err}`);
});

process.on('unhandledRejection', (reason) => {
  logServerEvent(`[UNHANDLED REJECTION]: ${reason?.stack || reason?.message || reason}`);
});

process.on('exit', (code) => {
  logServerEvent(`[PROCESS EXIT]: Exiting with code: ${code}`);
});

process.on('SIGINT', () => {
  logServerEvent('[SIGNAL]: Received SIGINT');
});

process.on('SIGTERM', () => {
  logServerEvent('[SIGNAL]: Received SIGTERM');
});

logServerEvent(`[SERVER STARTUP]: PID ${process.pid} at ${new Date().toISOString()}`);

const db = require('./backend/database/db');

// Modular Route Handlers
const publicRoutes = require('./backend/routes/publicRoutes');
const authRoutes = require('./backend/routes/authRoutes');
const monopolyRoutes = require('./backend/routes/monopolyRoutes');
const memberRoutes = require('./backend/routes/memberRoutes');
const meetingRoutes = require('./backend/routes/meetingRoutes');
const elevationRoutes = require('./backend/routes/elevationRoutes');
const adminRoutes = require('./backend/routes/adminRoutes');
const paymentRoutes = require('./backend/routes/paymentRoutes');
const marketplaceRoutes = require('./backend/routes/marketplaceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount Dedicated Sub-Project Portals
app.use('/admin', express.static(path.join(__dirname, 'admin-portal')));
app.use('/business', express.static(path.join(__dirname, 'business-portal')));
app.use('/user', express.static(path.join(__dirname, 'user-portal')));
app.use('/flutter', express.static(path.join(__dirname, 'flutter_nbn_app', 'build', 'web')));

// Mount React 19 App as primary frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Mount Main Public Web Application
app.use(express.static(path.join(__dirname, 'public')));

// Mount Modular Endpoints
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/monopoly', monopolyRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/elevation', elevationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Chapters & Opportunities APIs
app.get('/api/chapters', (req, res) => {
  const { talukId, districtId, forumType } = req.query;
  let chapters = db.getTable('chapters');
  if (talukId) chapters = chapters.filter(c => c.talukId === talukId);
  if (districtId) chapters = chapters.filter(c => c.districtId === districtId);
  if (forumType) chapters = chapters.filter(c => c.forumType === forumType);
  res.json(chapters.map(c => {
    const occ = db.getChapterOccupancy(c.id);
    return {
      ...c,
      filledSeats: occ.filledSeats > 0 ? occ.filledSeats : (c.filledSeats || 0),
      availableSeats: Math.max(0, 100 - (occ.filledSeats > 0 ? occ.filledSeats : (c.filledSeats || 0)))
    };
  }));
});

app.post('/api/chapters', (req, res) => {
  try {
    const created = db.createChapter(req.body);
    res.json({ success: true, message: 'புதிய சாப்டர் வெற்றிகரமாக துவங்கப்பட்டது!', chapter: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chapters/apply-director', (req, res) => {
  try {
    const created = db.applyChapterDirector(req.body);
    res.json({ success: true, message: 'சாப்டர் டைரக்டர் விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! Nuvea Studio உங்களை விரைவில் தொடர்பு கொள்ளும்.', application: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/opportunities', (req, res) => {
  res.json({
    dealRequests: db.getTable('dealRequests'),
    directorApplications: db.getTable('chapterDirectorApplications'),
    totalChapters: db.getTable('chapters').length
  });
});

app.post('/api/opportunities', (req, res) => {
  try {
    const created = db.postDealRequest(req.body);
    res.json({ success: true, message: 'B2B வணிக வாய்ப்பு வெற்றிகரமாக பதிவு செய்யப்பட்டது!', deal: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Best Price & Special Offers Map for Verified Businesses
const bestPriceOffers = {
  'biz_001': { offer: '4K சினிமாடிக் விளம்பரம் ₹15,000 (வழக்கம் ₹35,000) • 55% தள்ளுபடி', bestPrice: '₹15,000', discount: '55% OFF', rank: 99, tag: 'சிறந்த சலுகை விலை' },
  'biz_002': { offer: '0% தங்கச் சேதாரம் (0% Making Charges) • 1 கிராமுக்கு ₹150 நேரடி தள்ளுபடி', bestPrice: '0% சேதாரம்', discount: '₹150/gm OFF', rank: 98, tag: 'ஹால்மார்க் விலை கேரண்டி' },
  'biz_003': { offer: 'ஹோல்சேல் சானிட்டரி & பிளம்பிங் • எம்ஆர்பியில் 35% நேரடி தள்ளுபடி', bestPrice: '35% தள்ளுபடி', discount: '35% OFF', rank: 94, tag: 'மொத்த விலை' },
  'biz_004': { offer: 'காஞ்சிபுரம் பட்டுப்புடவைகள் நெசவாளர் விலைக்கே • 25% தள்ளுபடி', bestPrice: 'நெசவாளர் விலை', discount: '25% OFF', rank: 95, tag: 'ஹோல்சேல் விலை' },
  'biz_005': { offer: '4-கேமரா HD CCTV ஃபுல் செட் ₹9,999 மட்டுமே • இலவச இன்ஸ்டாலேஷன்', bestPrice: '₹9,999 மட்டுமே', discount: 'இலவச இன்ஸ்டாலேஷன்', rank: 96, tag: 'குறைந்த விலை உத்தரவாதம்' },
  'biz_006': { offer: 'வீடு கட்ட சதுர அடி ₹1,650 மட்டுமே • இலவச 3D எலிவேஷன் பிளான்', bestPrice: '₹1,650/sqft', discount: 'இலவச 3D பிளான்', rank: 97, tag: 'குறைந்த சதுர அடி விலை' },
  'biz_007': { offer: 'மாடுலர் கிச்சன் தொழிற்சாலை நேரடி விலை • 20% நேரடி கேஷ்பேக்', bestPrice: 'தொழிற்சாலை விலை', discount: '20% கேஷ்பேக்', rank: 93, tag: 'தொழிற்சாலை விலை' },
  'biz_008': { offer: 'அரசு சோலார் மானியம் 40% + குறைந்த விலை உத்தரவாதம்', bestPrice: '40% மானிய விலை', discount: '40% மானியம்', rank: 96, tag: 'அரசு மானிய விலை' },
  'biz_009': { offer: '0% புரோக்கரேஜ் கட்டணம் • நேரடி நில உரிமையாளர் சிறந்த விலை', bestPrice: '0% புரோக்கரேஜ்', discount: '0% கமிஷன்', rank: 98, tag: 'நேரடி சிறந்த விலை' },
  'biz_010': { offer: 'RO வாட்டர் பியூரிஃபையர் ₹4,999 ஆரம்பம் • 1 ஆண்டு இலவச சர்வீஸ்', bestPrice: '₹4,999 முதல்', discount: '1 ஆண்டு ஃப்ரீ சர்வீஸ்', rank: 92, tag: 'ஆபர் விலை' },
  'biz_011': { offer: 'எலக்ட்ரிக்கல் வயரிங் & உபகரணங்கள் ஹோல்சேல் ரேட் • 15% தள்ளுபடி', bestPrice: 'ஹோல்சேல் ரேட்', discount: '15% OFF', rank: 94, tag: 'மொத்த விலை' }
};

// Standalone Public Business Profile API
app.get('/api/business/:id', (req, res) => {
  const { id } = req.params;
  const businesses = db.getTable('businesses');
  const memberships = db.getTable('memberships');
  const categories = db.getTable('categories');
  const chapters = db.getTable('chapters');

  const biz = businesses.find(b => b.id === id || b.userId === id);
  if (!biz) return res.status(404).json({ error: 'வணிகக் கணக்கு கிடைக்கவில்லை' });

  const mem = memberships.find(m => m.businessId === biz.id) || {};
  const cat = categories.find(c => c.id === biz.categoryId) || {};
  const chap = chapters.find(c => c.id === (biz.chapterId || mem.chapterId)) || {};

  const offerData = bestPriceOffers[biz.id] || {
    offer: biz.specialOffer || 'நேரடி உரிமையாளர் குறைந்தபட்ச விலை கேரண்டி & NBN சிறப்பு சலுகை',
    bestPrice: biz.bestPrice || 'சிறந்த விலை',
    discount: 'NBN சிறப்பு சலுகை',
    rank: 90,
    tag: 'சிறந்த விலை உத்தரவாதம்'
  };

  res.json({
    ...biz,
    specialOffer: biz.specialOffer || offerData.offer,
    bestPrice: biz.bestPrice || offerData.bestPrice,
    priceTag: offerData.tag,
    discount: offerData.discount,
    categoryNameTa: cat.nameTa || biz.categoryId,
    categoryNameEn: cat.nameEn || biz.categoryId,
    chapterNameTa: chap.nameTa || 'ஹரூர் சாப்டர்',
    membershipStatus: mem.status || 'active',
    shareableUrl: `/biz/${biz.id}`
  });
});

// Direct Lead / Order Submission to a specific business storefront
app.post('/api/business/:id/lead', (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, clientPhone, requirement, expectedValue } = req.body;
    if (!clientName || !clientPhone) {
      return res.status(400).json({ error: 'பெயர் மற்றும் போன் எண் அவசியம் (Name and phone required)' });
    }
    const businesses = db.getTable('businesses');
    const memberships = db.getTable('memberships');
    const referrals = db.getTable('referrals');

    const biz = businesses.find(b => b.id === id || b.userId === id);
    if (!biz) return res.status(404).json({ error: 'வணிகக் கணக்கு கிடைக்கவில்லை' });

    const mem = memberships.find(m => m.businessId === biz.id) || { id: `mem_${biz.id}` };

    const newLead = {
      id: `lead_${Date.now()}`,
      fromMemberId: 'public_customer',
      fromBusinessName: 'நேரடி வாடிக்கையாளர் (Direct Customer)',
      toMemberId: mem.id,
      toBusinessName: biz.businessName,
      clientName,
      clientPhone: String(clientPhone).replace(/\D/g, ''),
      requirement: requirement || 'டிஜிட்டல் ஸ்டோர் நேரடி ஆர்டர் / விசாரணை',
      expectedValue: Number(expectedValue) || 10000,
      closedValue: 0,
      status: 'submitted', // submitted -> accepted -> contacted -> negotiation -> won/lost
      notes: 'NBN டிஜிட்டல் ஸ்டோர் மூலம் பெறப்பட்ட நேரடி வாடிக்கையாளர் ஆர்டர்',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    referrals.unshift(newLead);
    db.persist();

    res.json({
      success: true,
      message: `உங்கள் தகவல் ${biz.businessName} உரிமையாளருக்கு உடனடியாக அனுப்பப்பட்டது!`,
      lead: newLead
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Compatibility Endpoints for existing client requests
app.get('/api/state', (req, res) => {
  const chaptersList = db.getTable('chapters').map(c => {
    const occ = db.getChapterOccupancy(c.id);
    return {
      ...c,
      filledSeats: occ.filledSeats > 0 ? occ.filledSeats : (c.filledSeats || 0),
      availableSeats: Math.max(0, 100 - (occ.filledSeats > 0 ? occ.filledSeats : (c.filledSeats || 0)))
    };
  });

  res.json({
    settings: db.getSettings(),
    districts: db.getTable('districts'),
    chapters: chaptersList,
    dealRequests: db.getTable('dealRequests'),
    chapterDirectorApplications: db.getTable('chapterDirectorApplications'),
    taluks: db.getTable('taluks').reduce((acc, t) => {
      const occ = db.getTalukOccupancy(t.id);
      acc[t.id] = {
        id: t.id,
        districtId: t.districtId,
        name: `${t.nameTa} (${t.nameEn})`,
        forumName: t.forumNameTa,
        totalSeats: occ.maxSeats,
        filledSeats: occ.filledSeats,
        availableSeats: occ.availableSeats,
        weeklyMeeting: `${t.weeklyMeetingDay} ${t.weeklyMeetingTime}`,
        totalBusinessClosed: '₹64.5 லட்சம்',
        leadsExchanged: 482,
        rating: 4.9
      };
      return acc;
    }, {}),
    categories: db.getTable('categories'),
    members: db.getTable('businesses').map(b => {
      const mem = db.getTable('memberships').find(m => m.businessId === b.id) || {};
      const perf = db.getTable('performanceScores').find(p => p.memberId === mem.id) || {};
      const chap = chaptersList.find(c => c.id === b.chapterId) || {};
      
      const bestPriceOffers = {
        'biz_001': { offer: '4K சினிமாடிக் விளம்பரம் ₹15,000 (வழக்கம் ₹35,000) • 55% தள்ளுபடி', bestPrice: '₹15,000', discount: '55% OFF', rank: 99, tag: 'சிறந்த சலுகை விலை' },
        'biz_002': { offer: '0% தங்கச் சேதாரம் (0% Making Charges) • 1 கிராமுக்கு ₹150 நேரடி தள்ளுபடி', bestPrice: '0% சேதாரம்', discount: '₹150/gm OFF', rank: 98, tag: 'ஹால்மார்க் விலை கேரண்டி' },
        'biz_003': { offer: 'ஹோல்சேல் சானிட்டரி & பிளம்பிங் • எம்ஆர்பியில் 35% நேரடி தள்ளுபடி', bestPrice: '35% தள்ளுபடி', discount: '35% OFF', rank: 94, tag: 'மொத்த விலை' },
        'biz_004': { offer: 'காஞ்சிபுரம் பட்டுப்புடவைகள் நெசவாளர் விலைக்கே • 25% தள்ளுபடி', bestPrice: 'நெசவாளர் விலை', discount: '25% OFF', rank: 95, tag: 'ஹோல்சேல் விலை' },
        'biz_005': { offer: '4-கேமரா HD CCTV ஃபுல் செட் ₹9,999 மட்டுமே • இலவச இன்ஸ்டாலேஷன்', bestPrice: '₹9,999 மட்டுமே', discount: 'இலவச இன்ஸ்டாலேஷன்', rank: 96, tag: 'குறைந்த விலை உத்தரவாதம்' },
        'biz_006': { offer: 'வீடு கட்ட சதுர அடி ₹1,650 மட்டுமே • இலவச 3D எலிவேஷன் பிளான்', bestPrice: '₹1,650/sqft', discount: 'இலவச 3D பிளான்', rank: 97, tag: 'குறைந்த சதுர அடி விலை' },
        'biz_007': { offer: 'மாடுலர் கிச்சன் தொழிற்சாலை நேரடி விலை • 20% நேரடி கேஷ்பேக்', bestPrice: 'தொழிற்சாலை விலை', discount: '20% கேஷ்பேக்', rank: 93, tag: 'தொழிற்சாலை விலை' },
        'biz_008': { offer: 'அரசு சோலார் மானியம் 40% + குறைந்த விலை உத்தரவாதம்', bestPrice: '40% மானிய விலை', discount: '40% மானியம்', rank: 96, tag: 'அரசு மானிய விலை' },
        'biz_009': { offer: '0% புரோக்கரேஜ் கட்டணம் • நேரடி நில உரிமையாளர் சிறந்த விலை', bestPrice: '0% புரோக்கரேஜ்', discount: '0% கமிஷன்', rank: 98, tag: 'நேரடி சிறந்த விலை' },
        'biz_010': { offer: 'RO வாட்டர் பியூரிஃபையர் ₹4,999 ஆரம்பம் • 1 ஆண்டு இலவச சர்வீஸ்', bestPrice: '₹4,999 முதல்', discount: '1 ஆண்டு ஃப்ரீ சர்வீஸ்', rank: 92, tag: 'ஆபர் விலை' },
        'biz_011': { offer: 'எலக்ட்ரிக்கல் வயரிங் & உபகரணங்கள் ஹோல்சேல் ரேட் • 15% தள்ளுபடி', bestPrice: 'ஹோல்சேல் ரேட்', discount: '15% OFF', rank: 94, tag: 'மொத்த விலை' }
      };

      const offerData = bestPriceOffers[b.id] || {
        offer: 'நேரடி உரிமையாளர் குறைந்தபட்ச விலை கேரண்டி & NBN சிறப்பு சலுகை',
        bestPrice: 'சிறந்த விலை',
        discount: 'NBN சிறப்பு சலுகை',
        rank: 90,
        tag: 'சிறந்த விலை உத்தரவாதம்'
      };

      return {
        id: mem.id || b.id,
        businessId: b.id,
        talukId: b.talukId,
        chapterId: b.chapterId || (b.talukId === 'harur' ? 'harur_titans' : `${b.talukId}_titans`),
        chapterName: chap.nameTa || 'ஹரூர் டைட்டன்ஸ்',
        forumType: chap.forumType || 'titans',
        categoryId: b.categoryId,
        businessName: b.businessName,
        ownerName: b.ownerName,
        phone: b.phone,
        email: b.email,
        address: b.address,
        lat: b.lat,
        lng: b.lng,
        instagram: b.instagram,
        instagramUrl: b.instagramUrl,
        followers: b.followers,
        posts: b.posts,
        tagline: b.tagline,
        description: b.description,
        specialOffer: offerData.offer,
        bestPrice: offerData.bestPrice,
        discount: offerData.discount,
        bestPriceRank: offerData.rank,
        priceTag: offerData.tag,
        reelsVideo: b.reelsVideo,
        reelsTitle: b.reelsTitle,
        photos: b.photos || [],
        videoBenefitStatus: b.videoBenefitStatus,
        tier: mem.tier || 'Taluk Member',
        status: b.status === 'active' ? 'Verified Elite' : 'Pending',
        leadsGiven: perf.leadsGiven || 0,
        leadsReceived: perf.leadsReceived || 0,
        businessDone: `₹${((perf.closedValue || 0) / 100000).toFixed(1)} லட்சம்`,
        attendance: perf.attendancePercent || 100,
        rating: b.rating || 5.0,
        reviewCount: b.reviewCount || 1,
        isElevated: mem.tier === 'district_vip' || mem.tier === 'state_titan'
      };
    }),
    meetingAgenda: db.getTable('speakerQueue'),
    states: db.getTable('states'),
    applications: db.getTable('applications'),
    oneToOneMeetings: db.getTable('oneToOneMeetings'),
    guests: db.getTable('guests'),
    certificates: db.getTable('certificates'),
    announcements: db.getTable('announcements'),
    notifications: db.getTable('notifications'),
    awards: db.getTable('awards'),
    customerRequirements: db.getTable('customerRequirements'),
    quotations: db.getTable('quotations'),
    marketplaceOrders: db.getTable('marketplaceOrders'),
    transactionReviews: db.getTable('transactionReviews'),
    disputes: db.getTable('disputes'),
    recentLeads: db.getTable('referrals').slice(0, 20).map(r => ({
      id: r.id,
      from: r.fromBusinessName || r.fromMemberId,
      to: r.toBusinessName || r.toMemberId,
      clientName: r.clientName,
      dealValue: `₹${(Number(r.verifiedClosedValue || r.closedValue || r.expectedValue) || 0).toLocaleString('en-IN')}`,
      status: r.status === 'won' ? 'Closed Won' : (r.status === 'negotiation' ? 'Negotiation' : (r.status === 'contacted' ? 'Contacted' : 'Submitted')),
      time: 'சமீபத்தில்'
    }))
  });
});

app.post('/api/register', (req, res) => {
  const monopolyService = require('./backend/services/monopolyService');
  try {
    const result = monopolyService.reserveCategorySeat(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// Single Page Application Fallback
app.use((req, res) => {
  // If an unmatched API route is requested, return 404 JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: `API route not found: ${req.path}` });
  }

  const distIndex = path.join(__dirname, 'dist', 'index.html');
  const pubIndex = path.join(__dirname, 'public', 'index.html');
  const target = fs.existsSync(distIndex) ? distIndex : (fs.existsSync(pubIndex) ? pubIndex : null);

  if (target) {
    try {
      const html = fs.readFileSync(target, 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (e) {
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(404).send('Not Found');
  }
});

// Express Central Error Handling Middleware (Catches All Unhandled Route & Stream Errors)
app.use((err, req, res, next) => {
  logServerEvent(`[EXPRESS ROUTE ERROR]: ${err.stack || err.message || err}`);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
});

// Start Server
if (require.main === module) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(` NUVEA BUSINESS NETWORK (NBN) SAAS PLATFORM RUNNING`);
    console.log(` URL: http://localhost:${PORT} (Bound to 0.0.0.0:${PORT})`);
    console.log(` Commercial B2B Digital Networking for Dharmapuri & Salem`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    logServerEvent(`[HTTP SERVER ERROR]: ${err.stack || err.message || err}`);
  });

  // Keep event loop alive indefinitely
  setInterval(() => {
    // Keepalive heartbeat
  }, 60000);

  process.on('exit', (code) => {
    console.log(`[PROCESS EXIT]: Exiting with code: ${code}`);
  });
}

module.exports = app;
