const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { requireAuth } = require('../middleware/auth');
const db = require('../database/db');

router.post('/register', (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'பெயர் மற்றும் மொபைல் எண் அவசியம் (Name and phone required)' });
    }
    const result = authService.registerUser({ name, email, phone, password, role });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/register-customer', (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'பெயர் மற்றும் மொபைல் எண் அவசியம்' });
    }
    const result = authService.registerUser({ name, email, phone, password, role: 'customer' });
    res.json({ success: true, message: 'வாடிக்கையாளர் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!', ...result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Full Business Registration with Category Seat Reservation
router.post('/register-business', (req, res) => {
  try {
    const {
      name,
      phone,
      password,
      businessName,
      talukId,
      chapterId,
      categoryId,
      address,
      tagline,
      description,
      specialOffer,
      bestPrice
    } = req.body;

    if (!name || !phone || !businessName || !talukId || !categoryId) {
      return res.status(400).json({ error: 'அனைத்து முக்கிய விவரங்களையும் நிரப்பவும் (Missing required fields)' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const users = db.getTable('users');
    let user = users.find(u => u.phone === cleanPhone);

    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        name,
        email: `${cleanPhone}@nbn.in`,
        phone: cleanPhone,
        role: 'member',
        passwordHash: authService.hashPassword(password || 'password'),
        createdAt: new Date().toISOString()
      };
      users.push(user);
    }

    const monopolyService = require('../services/monopolyService');
    const seatResult = monopolyService.reserveCategorySeat({
      userId: user.id,
      talukId,
      chapterId,
      categoryId,
      businessName,
      ownerName: name,
      phone: cleanPhone,
      email: user.email,
      address: address || `${talukId}, தமிழ்நாடு`,
      tagline: tagline || 'அங்கீகரிக்கப்பட்ட வணிகம்',
      description: description || 'NBN அதிகாரப்பூர்வ உறுப்பினர்.'
    });

    if (specialOffer && seatResult.business) {
      seatResult.business.specialOffer = specialOffer;
      seatResult.business.bestPrice = bestPrice || 'சிறந்த விலை';
    }

    db.persist();

    const token = authService.generateToken(user);
    res.json({
      success: true,
      message: `வாழ்த்துகள் ${name}! உங்கள் ${businessName} கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!`,
      user: authService.sanitizeUser(user),
      business: seatResult.business,
      membership: seatResult.membership,
      token,
      shareableUrl: `/biz/${seatResult.business.id}`
    });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message, occupiedBy: err.occupiedBy || null });
  }
});

router.post('/login', (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'மொபைல் எண் மற்றும் கடவுச்சொல் அவசியம் (Credentials required)' });
    }
    const result = authService.loginUser(identifier, password);
    res.json(result);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

// Quick 1-Click Demo Login Switcher (for local showcase and evaluator ease)
router.post('/demo-login', (req, res) => {
  const { role = 'super_admin' } = req.body;
  const users = db.getTable('users');
  let targetUser = null;

  if (role === 'super_admin') {
    targetUser = users.find(u => u.role === 'super_admin') || users[0];
  } else if (role === 'district_admin') {
    targetUser = users.find(u => u.role === 'district_admin') || {
      id: 'usr_dist_admin',
      name: 'தருமபுரி மாவட்ட நிர்வாகி (District Admin)',
      phone: '9842100001',
      role: 'district_admin',
      districtId: 'dharmapuri'
    };
  } else if (role === 'chapter_president') {
    targetUser = users.find(u => u.id === 'usr_002') || users.find(u => u.role === 'member');
    if (targetUser) targetUser = { ...targetUser, role: 'chapter_president', title: 'சாப்டர் தலைவர் (President)' };
  } else if (role === 'chapter_secretary') {
    targetUser = users.find(u => u.id === 'usr_004') || users.find(u => u.role === 'member');
    if (targetUser) targetUser = { ...targetUser, role: 'chapter_secretary', title: 'சாப்டர் செயலாளர் (Secretary)' };
  } else if (role === 'membership_committee') {
    targetUser = users.find(u => u.id === 'usr_005') || users.find(u => u.role === 'member');
    if (targetUser) targetUser = { ...targetUser, role: 'membership_committee', title: 'உறுப்பினர் சேர்க்கை குழு' };
  } else if (role === 'customer') {
    targetUser = {
      id: 'cust_001',
      name: 'சரவணன் (பொது வாடிக்கையாளர் / Public Customer)',
      phone: '9842100112',
      email: 'saravanan.build@gmail.com',
      role: 'customer'
    };
  } else if (role === 'guest') {
    targetUser = {
      id: 'usr_guest_demo',
      name: 'மு. கார்த்திகேயன் (Guest Visitor)',
      phone: '9842555666',
      email: 'guest@nbn.in',
      role: 'guest'
    };
  } else {
    targetUser = users.find(u => u.role === 'member') || users[1];
  }

  if (!targetUser) {
    return res.status(404).json({ error: 'Demo user not available' });
  }

  const token = authService.generateToken(targetUser);
  res.json({
    user: authService.sanitizeUser(targetUser),
    token
  });
});

router.get('/me', requireAuth, (req, res) => {
  const users = db.getTable('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'பயனர் கிடைக்கவில்லை' });
  res.json({ user: authService.sanitizeUser(user) });
});


// ==========================================
// MASTER MULTI-STEP BUSINESS OWNER REGISTRATION (OPTIONS A & B)
// ==========================================
router.post('/register-owner-full', (req, res) => {
  try {
    const {
      // Step 1: Owner Information
      fullName,
      profilePhoto,
      phone,
      whatsapp,
      email,
      password,
      designation,

      // Step 2: Business Information
      businessName,
      logo,
      cover,
      categoryId,
      subcategory,
      description,
      yearEstablished,
      gstNumber,
      website,
      socialLinks,
      address,
      districtId,
      talukId,
      pinCode,

      // Step 3: Products and Services
      productsServices,

      // Step 4: Account Type
      accountType, // 'networking_marketplace' | 'marketplace_only'
      preferredChapterId,

      // Step 5: Verification Documents & Consent
      documents,
      termsAccepted
    } = req.body;

    if (!fullName || !phone || !businessName) {
      return res.status(400).json({ error: 'உரிமையாளர் பெயர், மொபைல் எண் மற்றும் வணிகப் பெயர் கட்டாயம் (Required fields missing)' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const users = db.getTable('users');
    let user = users.find(u => u.phone === cleanPhone);

    const isNetworking = accountType === 'networking_marketplace';
    const assignedRole = isNetworking ? 'member' : 'marketplace_owner';

    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        name: fullName,
        email: email || `${cleanPhone}@nbn.in`,
        phone: cleanPhone,
        whatsapp: whatsapp || cleanPhone,
        role: assignedRole,
        accountType: accountType || 'networking_marketplace',
        designation: designation || 'நிறுவனர் / உரிமையாளர்',
        profilePhoto: profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        passwordHash: authService.hashPassword(password || 'password123'),
        createdAt: new Date().toISOString()
      };
      users.push(user);
    } else {
      user.role = assignedRole;
      user.accountType = accountType || 'networking_marketplace';
      user.name = fullName;
      if (designation) user.designation = designation;
      if (profilePhoto) user.profilePhoto = profilePhoto;
    }

    const regId = 'REG-' + Date.now().toString(36).toUpperCase();
    let seatResult = null;

    if (isNetworking) {
      // Module A: Networking + Marketplace with Chapter Category Exclusivity
      const monopolyService = require('../services/monopolyService');
      seatResult = monopolyService.reserveCategorySeat({
        userId: user.id,
        talukId: talukId || 'harur',
        chapterId: preferredChapterId || 'harur_titans',
        categoryId: categoryId || 'digital_marketing',
        businessName,
        ownerName: fullName,
        phone: cleanPhone,
        email: user.email,
        address: address || `${talukId || 'ஹரூர்'}, தமிழ்நாடு`,
        tagline: `அங்கீகரிக்கப்பட்ட ${businessName}`,
        description: description || 'NBN அதிகாரப்பூர்வ நெட்வொர்க்கிங் உறுப்பினர்.'
      });

      if (seatResult.business) {
        seatResult.business.logo = logo || '';
        seatResult.business.cover = cover || '';
        seatResult.business.subcategory = subcategory || '';
        seatResult.business.yearEstablished = yearEstablished || '2024';
        seatResult.business.gstNumber = gstNumber || '';
        seatResult.business.website = website || '';
        seatResult.business.socialLinks = socialLinks || {};
        seatResult.business.pinCode = pinCode || '';
        seatResult.business.productsServices = productsServices || [];
        seatResult.business.accountType = 'networking_marketplace';
        seatResult.business.registrationId = regId;
        seatResult.business.verificationStatus = 'submitted';
      }
    } else {
      // Module B: Marketplace Only - No chapter assignment, no category exclusivity
      const businesses = db.getTable('businesses');
      const bizId = `biz_${Date.now()}`;
      const newBiz = {
        id: bizId,
        userId: user.id,
        talukId: talukId || 'harur',
        chapterId: null, // No chapter for marketplace-only
        categoryId: categoryId || 'general_trade',
        businessName,
        ownerName: fullName,
        phone: cleanPhone,
        email: user.email,
        address: address || 'தமிழ்நாடு',
        logo: logo || '',
        cover: cover || '',
        subcategory: subcategory || '',
        description: description || 'NBN அங்கீகரிக்கப்பட்ட மார்க்கெட்பிளேஸ் சப்ளையர்.',
        yearEstablished: yearEstablished || '2024',
        gstNumber: gstNumber || '',
        website: website || '',
        socialLinks: socialLinks || {},
        pinCode: pinCode || '',
        productsServices: productsServices || [],
        accountType: 'marketplace_only',
        status: 'active',
        verificationStatus: 'submitted',
        registrationId: regId,
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
      };
      businesses.push(newBiz);
      seatResult = { business: newBiz, membership: null };
    }

    // Save formal application record
    const applications = db.getTable('applications');
    applications.push({
      id: `app_${Date.now()}`,
      registrationId: regId,
      userId: user.id,
      applicantName: fullName,
      phone: cleanPhone,
      whatsapp: whatsapp || cleanPhone,
      email: user.email,
      businessName,
      accountType: accountType || 'networking_marketplace',
      categoryId: categoryId || 'general_trade',
      subcategory: subcategory || '',
      preferredChapterId: isNetworking ? (preferredChapterId || 'harur_titans') : null,
      districtId: districtId || 'dharmapuri',
      talukId: talukId || 'harur',
      productsServicesCount: (productsServices || []).length,
      documents: documents || {},
      status: 'submitted',
      appliedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    });

    db.persist();

    const token = authService.generateToken(user);
    res.json({
      success: true,
      message: `வணக்கம் ${fullName}! உங்கள் ${businessName} பதிவு எண் ${regId} உருவாக்கப்பட்டது!`,
      registrationId: regId,
      user: authService.sanitizeUser(user),
      business: seatResult.business,
      membership: seatResult.membership,
      token,
      accountType
    });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message, occupiedBy: err.occupiedBy || null });
  }
});

// ==========================================
// CUSTOMER FULL REGISTRATION (OPTION C)
// ==========================================
router.post('/register-customer-full', (req, res) => {
  try {
    const { fullName, phone, email, password, address, city, pinCode } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ error: 'பெயர் மற்றும் மொபைல் எண் அவசியம்' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const users = db.getTable('users');
    let user = users.find(u => u.phone === cleanPhone);

    if (!user) {
      user = {
        id: `cust_${Date.now()}`,
        name: fullName,
        email: email || `${cleanPhone}@nbn-customer.in`,
        phone: cleanPhone,
        role: 'customer',
        accountType: 'customer',
        address: address || '',
        city: city || 'தருமபுரி',
        pinCode: pinCode || '',
        savedAddresses: address ? [{ label: 'முதன்மை முகவரி', address, city, pinCode }] : [],
        passwordHash: authService.hashPassword(password || 'customer123'),
        createdAt: new Date().toISOString()
      };
      users.push(user);
      db.persist();
    }

    const token = authService.generateToken(user);
    res.json({
      success: true,
      message: `வணக்கம் ${fullName}! வாடிக்கையாளர் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது.`,
      user: authService.sanitizeUser(user),
      token
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ==========================================
// SECURE ADMIN-ONLY LOGIN
// ==========================================
router.post('/admin-login', (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'அட்மின் மின்னஞ்சல் மற்றும் கடவுச்சொல் அவசியம்' });
    }

    const result = authService.loginUser(identifier, password);
    const userRole = result.user.role;

    if (!['super_admin', 'district_admin', 'taluk_admin'].includes(userRole)) {
      return res.status(403).json({ error: 'பாதுகாப்பு எச்சரிக்கை: நிர்வாகிகளுக்கு மட்டுமே அனுமதி (Restricted to Administrators only)' });
    }

    res.json(result);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

// ==========================================
// UPGRADE ACCOUNT (CUSTOMER -> BUSINESS OWNER)
// ==========================================
router.post('/upgrade-account', requireAuth, (req, res) => {
  try {
    const { targetAccountType, businessName, categoryId, talukId, preferredChapterId } = req.body;
    const users = db.getTable('users');
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'பயனர் கிடைக்கவில்லை' });

    user.accountType = targetAccountType || 'marketplace_only';
    user.role = targetAccountType === 'networking_marketplace' ? 'member' : 'marketplace_owner';

    // Create business profile
    const businesses = db.getTable('businesses');
    let biz = businesses.find(b => b.userId === user.id);
    if (!biz) {
      biz = {
        id: `biz_${Date.now()}`,
        userId: user.id,
        talukId: talukId || 'harur',
        chapterId: targetAccountType === 'networking_marketplace' ? (preferredChapterId || 'harur_titans') : null,
        categoryId: categoryId || 'general_trade',
        businessName: businessName || `${user.name} என்டர்பிரைசஸ்`,
        ownerName: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address || 'தமிழ்நாடு',
        accountType: user.accountType,
        status: 'active',
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
      };
      businesses.push(biz);
    } else {
      biz.accountType = user.accountType;
      biz.chapterId = targetAccountType === 'networking_marketplace' ? (preferredChapterId || 'harur_titans') : null;
    }

    db.persist();
    const token = authService.generateToken(user);
    res.json({
      success: true,
      message: 'உங்கள் கணக்கு வணிகக் கணக்காக வெற்றிகரமாக மேம்படுத்தப்பட்டது!',
      user: authService.sanitizeUser(user),
      business: biz,
      token
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
