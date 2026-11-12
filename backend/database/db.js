const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', '..', 'data', 'db.json');
const DISTRICTS_SEED = require('./seeds/districts.json');
const TALUKS_SEED = require('./seeds/taluks.json');
const CATEGORIES_SEED = require('./seeds/categories.json');
const CHAPTERS_SEED = require('./seeds/chapters.json');
const DEALS_SEED = require('./seeds/deals.json');

class DatabaseEngine {
  constructor() {
    this.lock = false;
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.seedDefault();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure new collections exist
        this.ensureStructure();
      } catch (e) {
        console.error('Database read error, restoring defaults:', e);
        this.seedDefault();
      }
    }
  }

  ensureStructure() {
    const defaultKeys = [
      'settings', 'districts', 'taluks', 'categories', 'users', 'businesses',
      'memberships', 'payments', 'invoices', 'referrals', 'meetings',
      'attendance', 'speakerQueue', 'performanceScores', 'strikes',
      'videoProjects', 'auditLogs', 'reviews', 'chapters', 'dealRequests', 'chapterDirectorApplications',
      'states', 'applications', 'oneToOneMeetings', 'guests', 'certificates', 'announcements', 'notifications', 'awards', 'customerRequirements', 'quotations', 'marketplaceOrders', 'transactionReviews', 'disputes'
    ];
    let modified = false;

    defaultKeys.forEach(key => {
      if (!this.data[key]) {
        this.data[key] = (key === 'settings' ? {} : []);
        modified = true;
      }
    });

    // Normalize taluks to array if object
    if (this.data.taluks && !Array.isArray(this.data.taluks)) {
      this.data.taluks = Object.values(this.data.taluks);
      modified = true;
    }

    // Ensure all 100 practical categories are loaded
    if (!this.data.categories || this.data.categories.length < 50) {
      this.data.categories = CATEGORIES_SEED;
      modified = true;
    }

    // Ensure all 38 districts are loaded
    if (!this.data.districts || this.data.districts.length < 10) {
      this.data.districts = DISTRICTS_SEED;
      modified = true;
    }

    // Ensure 5 seed taluks
    if (!this.data.taluks || this.data.taluks.length < 5) {
      this.data.taluks = TALUKS_SEED;
      modified = true;
    }

    // Ensure chapters are populated
    if (!this.data.chapters || this.data.chapters.length === 0) {
      this.data.chapters = CHAPTERS_SEED;
      modified = true;
    }

    // Ensure dealRequests are populated
    if (!this.data.dealRequests || this.data.dealRequests.length === 0) {
      this.data.dealRequests = DEALS_SEED;
      modified = true;
    }

    // Ensure chapterDirectorApplications exist
    if (!this.data.chapterDirectorApplications) {
      this.data.chapterDirectorApplications = [
        {
          id: "dir_app_001",
          name: "கே. சண்முகம்",
          phone: "9842199887",
          taluk: "பர்கூர்",
          district: "கிருஷ்ணகிரி",
          businessExperience: "15 ஆண்டுகள் கிரானைட் எக்ஸ்போர்ட் & தொழில் முனைவோர்",
          proposedChapterName: "பர்கூர் கிரானைட் சிட்டி சாப்டர்",
          status: "pending",
          appliedAt: "2024-11-10"
        },
        {
          id: "dir_app_002",
          name: "ஆர். கீதா லக்ஷ்மி",
          phone: "9842188776",
          taluk: "ஓசூர்",
          district: "கிருஷ்ணகிரி",
          businessExperience: "10 ஆண்டுகள் ஆட்டோமோட்டிவ் ஸ்பேர்ஸ் சப்ளையர்",
          proposedChapterName: "ஓசூர் ஆட்டோ டெக் சாப்டர்",
          status: "pending",
          appliedAt: "2024-11-11"
        }
      ];
      modified = true;
    }

    // Ensure businesses have chapterId
    if (this.data.businesses) {
      this.data.businesses.forEach(b => {
        if (!b.chapterId) {
          if (b.talukId === 'harur') b.chapterId = 'harur_titans';
          else if (b.talukId === 'palacode') b.chapterId = 'palacode_prime';
          else if (b.talukId === 'dharmapuri_town') b.chapterId = 'dharmapuri_apex';
          else if (b.talukId === 'pennagaram') b.chapterId = 'pennagaram_apex';
          else if (b.talukId === 'karimangalam') b.chapterId = 'karimangalam_arena';
          else if (b.talukId === 'salem') b.chapterId = 'salem_steel';
          else b.chapterId = `${b.talukId}_titans`;
          modified = true;
        }
      });
    }

    // Ensure memberships have chapterId
    if (this.data.memberships) {
      this.data.memberships.forEach(m => {
        if (!m.chapterId) {
          const biz = (this.data.businesses || []).find(b => b.id === m.businessId);
          m.chapterId = biz && biz.chapterId ? biz.chapterId : (m.talukId === 'harur' ? 'harur_titans' : `${m.talukId}_titans`);
          modified = true;
        }
      });
    }

    // Ensure businesses are populated
    if (!this.data.businesses || this.data.businesses.length === 0) {
      this.seedDefault();
      return;
    }
    if (modified) this.persist();
  }

  getDefault(key) {
    if (key === 'settings') return {};
    return [];
  }

  seedDefault() {
    const initialSettings = {
      platformName: "Nuvea Business Network (NBN)",
      taglineTa: "தமிழ்நாட்டின் முதல் தாலுகா அளவிலான டிஜிட்டல் B2B நெட்வொர்க்",
      taglineEn: "Tamil Nadu's First Taluk-Level Digital B2B Business Network",
      annualFeeTaluk: 15000,
      annualFeeDistrictVIP: 25000,
      annualFeeStateTitan: 50000,
      annualFeeNationalApex: 100000,
      gstPercentage: 18,
      talukMaxSeats: 100,
      speakerDurationSeconds: 45,
      speakerWarningSeconds: 10,
      strikeThresholdWarning: 1,
      strikeThresholdFinal: 2,
      strikeThresholdRevoke: 3,
      elevationWeights: {
        leadsGiven: 0.30,
        closedBusinessValue: 0.40,
        attendancePercent: 0.20,
        conversionRate: 0.10
      },
      elevationMinLeads: 10,
      elevationMinAttendance: 85,
      retreatLocation: "ஏற்காடு பிசினஸ் ரிட்ரீட் (Yercaud Retreat)",
      retreatDate: "2026-11-28",
      founderAgency: "Nuvea Studio",
      founderName: "சந்திரா (Chandru)",
      founderPhone: "917548820641",
      videoBenefitValue: 25000,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_NBN_DEMO_KEY",
      demoPaymentMode: true
    };

    // Pre-seed demo users
    const demoUsers = [
      {
        id: "usr_admin",
        name: "சந்திரா (Super Admin)",
        phone: "917548820641",
        email: "admin@nbn.in",
        role: "super_admin",
        passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // 'password' sha256
        createdAt: "2024-01-01"
      },
      {
        id: "usr_001",
        name: "சந்திரா (Chandru)",
        phone: "917548820641",
        email: "chandru@nuveastudio.com",
        role: "member",
        passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        createdAt: "2024-01-15"
      },
      {
        id: "usr_002",
        name: "ஆர். சுப்ரமணியம்",
        phone: "919842156789",
        email: "subramaniam@lakshmijewels.com",
        role: "member",
        passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        createdAt: "2024-02-01"
      },
      {
        id: "usr_003",
        name: "எம். தினேஷ் குமார்",
        phone: "919789456123",
        email: "dinesh@oxifix.in",
        role: "member",
        passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        createdAt: "2024-02-18"
      },
      {
        id: "usr_004",
        name: "கே. ரமேஷ்",
        phone: "919443210987",
        email: "ramesh@krsilks.com",
        role: "member",
        passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        createdAt: "2024-03-10"
      },
      {
        id: "usr_005",
        name: "எஸ். பிரவீன்",
        phone: "919842789123",
        email: "praveen@securetech.com",
        role: "member",
        passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        createdAt: "2024-04-05"
      }
    ];

    // Pre-seed demo businesses with category exclusivity
    const demoBusinesses = [
      {
        id: "biz_001",
        userId: "usr_001",
        talukId: "harur",
        categoryId: "digital_marketing",
        businessName: "நுவேவா ஸ்டுடியோ (Nuvea Studio)",
        ownerName: "சந்திரா (Chandru)",
        phone: "917548820641",
        email: "chandru@nuveastudio.com",
        address: "மெயின் ரோடு, ஹரூர், தருமபுரி மாவட்டம்",
        gstNumber: "33AAACN1234F1Z5",
        tagline: "4K சினிமாடிக் விளம்பரங்கள் & மெட்டா ஆட்ஸ் மூலம் பிராண்ட் வளர்ச்சி",
        description: "Sony A7 IV & FX3 சினிமா கேமரா மூலம் தமிழ்நாட்டின் முன்னணி பிராண்டுகளுக்கு 4K விளம்பர வீடியோ தயாரிப்பு.",
        videoBenefitStatus: "delivered",
        videoUrl: "https://www.youtube.com/watch?v=sample",
        rating: 5.0,
        reviewCount: 48,
        status: "active",
        createdAt: "2024-01-15"
      },
      {
        id: "biz_002",
        userId: "usr_002",
        talukId: "harur",
        categoryId: "jewellery",
        businessName: "ஸ்ரீ லட்சுமி தங்கம் & வைரம் (Sri Lakshmi Jewellers)",
        ownerName: "ஆர். சுப்ரமணியம்",
        phone: "919842156789",
        email: "subramaniam@lakshmijewels.com",
        address: "பஜார் வீதி, ஹரூர்",
        gstNumber: "33AABCS5678G1Z2",
        tagline: "916 BIS ஹால்மார்க் ஆபரணங்கள் & திருமண நகை தொகுப்புகள்",
        description: "ஹரூர் வட்டாரத்தில் 30 ஆண்டு பாரம்பரியம் மிக்க நம்பகமான தங்க நகைக் கடை.",
        videoBenefitStatus: "delivered",
        videoUrl: "https://www.youtube.com/watch?v=sample",
        rating: 4.9,
        reviewCount: 82,
        status: "active",
        createdAt: "2024-02-01"
      },
      {
        id: "biz_003",
        userId: "usr_003",
        talukId: "harur",
        categoryId: "plumbing",
        businessName: "ஆக்ஸிஃபிக்ஸ் இன்ஃப்ராமார்ட் (Oxifix Infra Mart)",
        ownerName: "எம். தினேஷ் குமார்",
        phone: "919789456123",
        email: "dinesh@oxifix.in",
        address: "பைபாஸ் ரோடு, ஹரூர்",
        gstNumber: "33AAECO9012H1Z9",
        tagline: "லீக்-ஃப்ரீ பிரீமியம் குழாய்கள் & மாடர்ன் பாத்ரூம் சானிட்டரி ஃபிட்டிங்ஸ்",
        description: "பில்டர்கள் மற்றும் குடியிருப்புகளுக்கான மொத்த சானிட்டரி & பிளம்பிங் விநியோகம்.",
        videoBenefitStatus: "editing",
        videoUrl: "",
        rating: 4.9,
        reviewCount: 41,
        status: "active",
        createdAt: "2024-02-18"
      },
      {
        id: "biz_004",
        userId: "usr_004",
        talukId: "harur",
        categoryId: "silks",
        businessName: "கே.ஆர். சில்க்ஸ் & ரெடிமேட்ஸ் (KR Silks)",
        ownerName: "கே. ரமேஷ்",
        phone: "919443210987",
        email: "ramesh@krsilks.com",
        address: "பஸ் நிலையம் எதிரில், ஹரூர்",
        gstNumber: "33AADCK3456J1Z1",
        tagline: "காஞ்சிபுரம் திருமண பட்டு & முழு குடும்பத்திற்கான ஆடைகள்",
        description: "சொந்த தறி நெசவு பட்டுப்புடவைகள் மற்றும் சுபமுகூர்த்த ஆடைகள்.",
        videoBenefitStatus: "scheduled",
        videoUrl: "",
        rating: 4.8,
        reviewCount: 56,
        status: "active",
        createdAt: "2024-03-10"
      },
      {
        id: "biz_005",
        userId: "usr_005",
        talukId: "harur",
        categoryId: "cctv",
        businessName: "ஹரூர் செக்யூர் டெக் CCTV (SecureTech)",
        ownerName: "எஸ். பிரவீன்",
        phone: "919842789123",
        email: "praveen@securetech.com",
        address: "தருமபுரி மெயின் ரோடு, ஹரூர்",
        gstNumber: "33AAFCS7890K1Z4",
        tagline: "HD/IP கலர் நைட் விஷன் கேமராக்கள் & மொபைல் லைவ் வியூ",
        description: "கடைகள், குடோன்கள், மற்றும் கல்வி நிலையங்களுக்கான பாதுகாப்பு கேமராக்கள்.",
        videoBenefitStatus: "delivered",
        videoUrl: "",
        rating: 4.7,
        reviewCount: 34,
        status: "active",
        createdAt: "2024-04-05"
      }
    ];

    // Pre-seed memberships
    const demoMemberships = demoBusinesses.map((b, i) => ({
      id: `mem_00${i + 1}`,
      businessId: b.id,
      userId: b.userId,
      talukId: b.talukId,
      categoryId: b.categoryId,
      tier: i === 0 ? "district_vip" : "taluk",
      status: "active",
      startDate: "2024-01-01",
      expiryDate: "2025-01-01",
      annualFee: 15000,
      gstAmount: 2700,
      totalAmount: 17700,
      invoiceNumber: `INV-2024-00${i + 1}`
    }));

    // Pre-seed performance stats
    const demoPerformance = [
      { memberId: "mem_001", leadsGiven: 48, leadsReceived: 39, closedValue: 1840000, attendancePercent: 100, conversionRate: 85, score: 94.2, eligibleTier: "District VIP" },
      { memberId: "mem_002", leadsGiven: 34, leadsReceived: 42, closedValue: 3450000, attendancePercent: 96, conversionRate: 80, score: 91.5, eligibleTier: "District VIP" },
      { memberId: "mem_003", leadsGiven: 29, leadsReceived: 35, closedValue: 1680000, attendancePercent: 98, conversionRate: 78, score: 87.2, eligibleTier: "Taluk Member" },
      { memberId: "mem_004", leadsGiven: 22, leadsReceived: 29, closedValue: 1220000, attendancePercent: 92, conversionRate: 72, score: 81.0, eligibleTier: "Taluk Member" },
      { memberId: "mem_005", leadsGiven: 19, leadsReceived: 23, closedValue: 840000, attendancePercent: 90, conversionRate: 70, score: 76.5, eligibleTier: "Taluk Member" }
    ];

    // Pre-seed referrals
    const demoReferrals = [
      {
        id: "ref_101",
        fromMemberId: "mem_001",
        toMemberId: "mem_002",
        clientName: "ஹரூர் ஆனந்தன் ரியல் எஸ்டேட்",
        clientPhone: "9842100111",
        requirement: "குடும்பத் திருமணத்திற்கு 25 சவரன் நகை ஆர்டர்",
        expectedValue: 1250000,
        closedValue: 1250000,
        status: "won",
        notes: "வாடிக்கையாளர் நேரடியாக கடைக்கு வந்து பில் செய்தனர்.",
        createdAt: "2024-10-15",
        updatedAt: "2024-10-20"
      },
      {
        id: "ref_102",
        fromMemberId: "mem_002",
        toMemberId: "mem_003",
        clientName: "பாலக்கோடு டாக்டர் வெங்கடேஷ் வில்லா",
        clientPhone: "9842200222",
        requirement: "புதிய 2-மாடி வீட்டிற்கு முழு சானிட்டரி & பைப்லைன்",
        expectedValue: 350000,
        closedValue: 380000,
        status: "won",
        notes: "ஆக்ஸிஃபிக்ஸ் மாடர்ன் குழாய்கள் தேர்வு செய்யப்பட்டன.",
        createdAt: "2024-10-28",
        updatedAt: "2024-11-02"
      },
      {
        id: "ref_103",
        fromMemberId: "mem_003",
        toMemberId: "mem_005",
        clientName: "காரிமங்கலம் மாடர்ன் ரைஸ் மில்",
        clientPhone: "9842300333",
        requirement: "குடோன் & எடை மேடைக்கு 16 HD CCTV கேமராக்கள்",
        expectedValue: 95000,
        closedValue: 95000,
        status: "won",
        notes: "செக்யூர் டெக் மூலம் கலர் நைட் விஷன் நிறுவப்பட்டது.",
        createdAt: "2024-11-05",
        updatedAt: "2024-11-08"
      },
      {
        id: "ref_104",
        fromMemberId: "mem_004",
        toMemberId: "mem_001",
        clientName: "சேலம் ஸ்ரீ விநாயகா சில்க்ஸ்",
        clientPhone: "9842400444",
        requirement: "தீபாவளி சிறப்பு 4K விளம்பர வீடியோ மற்றும் இன்ஸ்டாகிராம் ஆட்ஸ்",
        expectedValue: 120000,
        closedValue: 120000,
        status: "won",
        notes: "நுவேவா ஸ்டுடியோ மூலம் படம்பிடிக்கப்பட்டது.",
        createdAt: "2024-11-06",
        updatedAt: "2024-11-10"
      }
    ];

    // Seed Speaker Queue for Weekly Meeting Conductor
    const demoSpeakerQueue = [
      {
        id: "spk_1",
        meetingId: "meet_current",
        memberId: "mem_001",
        businessName: "நுவேவா ஸ்டுடியோ (Nuvea Studio)",
        speaker: "சந்திரா",
        category: "டிஜிட்டல் மார்க்கெட்டிங்",
        order: 1,
        speakingPoints: [
          "1. எங்கள் சேவை: 4K சினிமாடிக் விளம்பரங்கள் மற்றும் மெட்டா விளம்பர வளர்ச்சி.",
          "2. எனக்கு வேண்டிய லீட்: புதிய ஷோரூம் அல்லது மருத்துவமனை திறக்கும் உரிமையாளர்கள்.",
          "3. சென்ற வாரம் நான் கொடுத்த லீட்: ஸ்ரீ லட்சுமி நகைகடைக்கு ₹12.5 லட்சம் திருமண நகை ஆர்டர்."
        ],
        status: "active"
      },
      {
        id: "spk_2",
        meetingId: "meet_current",
        memberId: "mem_002",
        businessName: "ஸ்ரீ லட்சுமி தங்கம் & வைரம்",
        speaker: "ஆர். சுப்ரமணியம்",
        category: "தங்க நகைக்கடை",
        order: 2,
        speakingPoints: [
          "1. எங்கள் சேவை: 916 BIS ஹால்மார்க் ஆபரணங்கள் & 100% எக்ஸ்சேஞ்ச் கேரண்டி.",
          "2. எனக்கு வேண்டிய லீட்: அடுத்த மாதம் திருமணம் நடக்கவுள்ள முக்கிய குடும்பங்கள்.",
          "3. சென்ற வாரம் நான் கொடுத்த லீட்: ஆக்ஸிஃபிக்ஸ் தினேஷுக்கு ₹3.8 லட்சம் வில்லா சானிட்டரி ஆர்டர்."
        ],
        status: "upcoming"
      },
      {
        id: "spk_3",
        meetingId: "meet_current",
        memberId: "mem_003",
        businessName: "ஆக்ஸிஃபிக்ஸ் இன்ஃப்ராமார்ட்",
        speaker: "எம். தினேஷ் குமார்",
        category: "பிளம்பிங் சொல்யூஷன்ஸ்",
        order: 3,
        speakingPoints: [
          "1. எங்கள் சேவை: லீக்-ஃப்ரீ பிரீமியம் குழாய்கள் & மாடர்ன் பாத்ரூம் ஃபிட்டிங்ஸ்.",
          "2. எனக்கு வேண்டிய லீட்: புதிய வீடு கட்டும் சிவில் இன்ஜினியர்கள் & பில்டர்கள்.",
          "3. சென்ற வாரம் நான் கொடுத்த லீட்: செக்யூர் டெக் பிரவீனுக்கு ரைஸ் மில் சிசிடிவி ஆர்டர்."
        ],
        status: "upcoming"
      },
      {
        id: "spk_4",
        meetingId: "meet_current",
        memberId: "mem_004",
        businessName: "கே.ஆர். சில்க்ஸ் & ரெடிமேட்ஸ்",
        speaker: "கே. ரமேஷ்",
        category: "பட்டு & ஜவுளி ஆடை",
        order: 4,
        speakingPoints: [
          "1. எங்கள் சேவை: காஞ்சிபுரம் திருமண பட்டுப்புடவைகள் & முழு குடும்ப ஆடைகள்.",
          "2. எனக்கு வேண்டிய லீட்: மொத்த ஜவுளி எடுக்கும் திருமணம் மற்றும் சுபநிகழ்ச்சிகள்.",
          "3. சென்ற வாரம் நான் கொடுத்த லீட்: நுவேவா ஸ்டுடியோவுக்கு பிராண்ட் வீடியோ தயாரிப்பு லீட்."
        ],
        status: "upcoming"
      },
      {
        id: "spk_5",
        meetingId: "meet_current",
        memberId: "mem_005",
        businessName: "ஹரூர் செக்யூர் டெக் CCTV",
        speaker: "எஸ். பிரவீன்",
        category: "CCTV & பாதுகாப்பு",
        order: 5,
        speakingPoints: [
          "1. எங்கள் சேவை: HD/IP கலர் நைட் விஷன் கேமராக்கள் & மொபைல் லைவ் வியூ.",
          "2. எனக்கு வேண்டிய லீட்: குடோன்கள், பண்ணை வீடுகள் மற்றும் தொழிற்சாலைகள்.",
          "3. சென்ற வாரம் நான் கொடுத்த லீட்: கே.ஆர். சில்க்ஸ்-க்கு 8 சிசிடிவி கேமரா ஆர்டர்."
        ],
        status: "upcoming"
      }
    ];

    // Seed Audit Logs
    const demoAuditLogs = [
      { id: "aud_1", actorId: "usr_admin", actorRole: "super_admin", action: "INITIALIZE_SYSTEM", entity: "system", entityId: "nbn", details: "Nuvea Business Network platform initialized.", timestamp: new Date().toISOString() },
      { id: "aud_2", actorId: "usr_admin", actorRole: "super_admin", action: "APPROVE_MEMBERSHIP", entity: "memberships", entityId: "mem_001", details: "Nuvea Studio seat locked in Harur for digital_marketing.", timestamp: new Date().toISOString() }
    ];

    this.data = {
      settings: initialSettings,
      districts: DISTRICTS_SEED,
      taluks: TALUKS_SEED,
      categories: CATEGORIES_SEED,
      users: demoUsers,
      businesses: demoBusinesses,
      memberships: demoMemberships,
      performanceScores: demoPerformance,
      referrals: demoReferrals,
      speakerQueue: demoSpeakerQueue,
      meetings: [
        {
          id: "meet_current",
          talukId: "harur",
          date: "2024-11-16",
          day: "Saturday",
          time: "07:30 AM",
          meetingLink: "https://meet.google.com/nbn-harur-sat",
          status: "live",
          totalAttendees: 48,
          leadsExchanged: 18,
          closedValue: 840000
        }
      ],
      attendance: [],
      payments: demoMemberships.map((m, i) => ({
        id: `pay_00${i + 1}`,
        membershipId: m.id,
        businessId: m.businessId,
        amount: 15000,
        gstAmount: 2700,
        totalAmount: 17700,
        currency: "INR",
        razorpayPaymentId: `pay_demo_${Date.now()}_${i}`,
        status: "captured",
        invoiceNumber: m.invoiceNumber,
        createdAt: "2024-01-01"
      })),
      invoices: demoMemberships.map((m, i) => ({
        id: `inv_00${i + 1}`,
        invoiceNumber: m.invoiceNumber,
        membershipId: m.id,
        businessName: demoBusinesses[i].businessName,
        gstin: demoBusinesses[i].gstNumber,
        baseAmount: 15000,
        cgst: 1350,
        sgst: 1350,
        totalAmount: 17700,
        status: "paid",
        date: "2024-01-01"
      })),
      strikes: [],
      videoProjects: [
        { id: "vid_001", businessId: "biz_001", status: "delivered", shootDate: "2024-01-20", videoUrl: "https://www.youtube.com/watch?v=sample", notes: "4K Hero Video Completed" },
        { id: "vid_002", businessId: "biz_002", status: "delivered", shootDate: "2024-02-10", videoUrl: "https://www.youtube.com/watch?v=sample", notes: "Jewellery Collection 4K Shoot Delivered" },
        { id: "vid_003", businessId: "biz_003", status: "editing", shootDate: "2024-03-05", videoUrl: "", notes: "Color Grading in Progress" },
        { id: "vid_004", businessId: "biz_004", status: "scheduled", shootDate: "2024-11-25", videoUrl: "", notes: "Shoot Scheduled at Showroom" },
        { id: "vid_005", businessId: "biz_005", status: "delivered", shootDate: "2024-04-12", videoUrl: "", notes: "CCTV Installation Showcase Delivered" }
      ],
      auditLogs: demoAuditLogs,
      reviews: [
        { id: "rev_1", businessId: "biz_001", author: "செல்வகுமார், ஹரூர்", rating: 5, comment: "எங்கள் கடை விளம்பர வீடியோ மிகவும் தரமாக செய்து தந்தார்கள்.", date: "2024-05-10" },
        { id: "rev_2", businessId: "biz_002", author: "பழனிசாமி, பாப்பிரெட்டிப்பட்டி", rating: 5, comment: "திருமண நகைகள் மிகச் சிறந்த டிசைன்களில் கிடைத்தது.", date: "2024-06-12" }
      ]
    };

    this.persist();
  }

  // Atomic ACID persistence
  persist() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
      return true;
    } catch (e) {
      console.error('Failed to persist database:', e);
      return false;
    }
  }

  // QUERY HELPERS
  getTable(tableName) {
    const raw = this.data[tableName];
    if (!raw) return [];
    if (!Array.isArray(raw) && typeof raw === 'object') {
      return Object.values(raw);
    }
    return raw;
  }

  getSettings() {
    return this.data.settings || {};
  }

  updateSettings(newSettings, actorId = 'system') {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.logAudit(actorId, 'UPDATE_SETTINGS', 'settings', 'global', newSettings);
    this.persist();
    return this.data.settings;
  }

  logAudit(actorId, action, entity, entityId, details) {
    const entry = {
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      actorId,
      action,
      entity,
      entityId,
      details: typeof details === 'string' ? details : JSON.stringify(details),
      timestamp: new Date().toISOString()
    };
    if (!this.data.auditLogs) this.data.auditLogs = [];
    this.data.auditLogs.unshift(entry);
    if (this.data.auditLogs.length > 500) this.data.auditLogs.pop();
  }

  // ==========================================
  // CATEGORY MONOPOLY & CAPACITY LOGIC
  // ==========================================
  checkCategoryExclusivity(talukId, categoryId, chapterId = null) {
    const activeMemberships = (this.data.memberships || []).filter(m => {
      if (m.status !== 'active') return false;
      if (m.categoryId !== categoryId) return false;
      if (chapterId) {
        return m.chapterId === chapterId;
      }
      return m.talukId === talukId;
    });

    if (activeMemberships.length > 0) {
      const existingMembership = activeMemberships[0];
      const existingBusiness = (this.data.businesses || []).find(b => b.id === existingMembership.businessId);
      return {
        available: false,
        occupiedBy: existingBusiness || null,
        membership: existingMembership
      };
    }
    return { available: true };
  }

  getTalukOccupancy(talukId, chapterId = null) {
    const maxSeats = (this.data.settings && this.data.settings.talukMaxSeats) || 100;
    const activeSeats = (this.data.memberships || []).filter(m => {
      if (m.status !== 'active') return false;
      if (chapterId) return m.chapterId === chapterId;
      return m.talukId === talukId;
    }).length;
    return {
      talukId,
      chapterId,
      maxSeats,
      filledSeats: activeSeats,
      availableSeats: Math.max(0, maxSeats - activeSeats),
      isFull: activeSeats >= maxSeats
    };
  }

  getChapterOccupancy(chapterId) {
    const maxSeats = 100;
    const chapter = (this.data.chapters || []).find(c => c.id === chapterId);
    const activeSeats = (this.data.memberships || []).filter(
      m => m.chapterId === chapterId && m.status === 'active'
    ).length;
    return {
      chapterId,
      chapter,
      maxSeats,
      filledSeats: activeSeats,
      availableSeats: Math.max(0, maxSeats - activeSeats),
      isFull: activeSeats >= maxSeats
    };
  }

  createChapter(chapterData) {
    if (!this.data.chapters) this.data.chapters = [];
    const newId = chapterData.id || `chap_${Date.now()}`;
    const chapter = {
      id: newId,
      talukId: chapterData.talukId || 'harur',
      districtId: chapterData.districtId || 'dharmapuri',
      nameTa: chapterData.nameTa,
      nameEn: chapterData.nameEn || chapterData.nameTa,
      forumType: chapterData.forumType || 'titans',
      forumTypeTa: chapterData.forumTypeTa || 'B2B டைட்டன்ஸ்',
      meetingDay: chapterData.meetingDay || 'வெள்ளிக்கிழமை (Friday)',
      meetingTime: chapterData.meetingTime || 'காலை 07:30 AM',
      directorName: chapterData.directorName || 'சந்திரா (Nuvea Studio)',
      directorPhone: chapterData.directorPhone || '917548820641',
      meetingLink: chapterData.meetingLink || `https://meet.google.com/nbn-${newId}`,
      status: chapterData.status || 'forming',
      maxSeats: 100,
      filledSeats: 0,
      totalBusinessDone: '₹0',
      description: chapterData.description || 'புதிய NBN தொழில் மன்ற சாப்டர்.'
    };
    this.data.chapters.push(chapter);
    this.logAudit('super_admin', 'CREATE_CHAPTER', 'chapters', newId, chapter);
    this.persist();
    return chapter;
  }

  applyChapterDirector(appData) {
    if (!this.data.chapterDirectorApplications) this.data.chapterDirectorApplications = [];
    const app = {
      id: `dir_app_${Date.now()}`,
      name: appData.name,
      phone: appData.phone,
      taluk: appData.taluk,
      district: appData.district || 'தமிழ்நாடு',
      businessExperience: appData.businessExperience || 'தொழில் முனைவோர்',
      proposedChapterName: appData.proposedChapterName || `${appData.taluk} டைட்டன்ஸ் சாப்டர்`,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0]
    };
    this.data.chapterDirectorApplications.unshift(app);
    this.logAudit('public', 'APPLY_CHAPTER_DIRECTOR', 'chapterDirectorApplications', app.id, app);
    this.persist();
    return app;
  }

  postDealRequest(dealData) {
    if (!this.data.dealRequests) this.data.dealRequests = [];
    const deal = {
      id: `deal_${Date.now()}`,
      titleTa: dealData.titleTa,
      titleEn: dealData.titleEn || dealData.titleTa,
      dealValue: dealData.dealValue || '₹5,00,000+',
      dealValueNumber: Number(dealData.dealValueNumber) || 500000,
      talukId: dealData.talukId || 'harur',
      chapterId: dealData.chapterId || 'harur_titans',
      category: dealData.category || 'பொது வணிகம்',
      postedBy: dealData.postedBy,
      contactPhone: dealData.contactPhone || '917548820641',
      status: 'active',
      type: dealData.type || 'buy_lead',
      typeTa: dealData.typeTa || 'கொள்முதல் தேவை',
      verified: true,
      expiresIn: '15 நாட்கள் மீதம்',
      description: dealData.description || 'B2B வணிக வாய்ப்பு.'
    };
    this.data.dealRequests.unshift(deal);
    this.logAudit('member', 'POST_DEAL_REQUEST', 'dealRequests', deal.id, deal);
    this.persist();
    return deal;
  }

  // --- NBN ENTERPRISE METHODS ---

  createState(stateData) {
    if (!this.data.states) this.data.states = [];
    const id = stateData.code ? stateData.code.toUpperCase() : `ST_${Date.now()}`;
    const existing = this.data.states.find(s => s.id === id || s.code === id);
    if (existing) throw new Error('மாநில குறியீடு ஏற்கனவே உள்ளது (State code already exists)');

    const state = {
      id,
      code: id,
      nameTa: stateData.nameTa,
      nameEn: stateData.nameEn || stateData.nameTa,
      country: stateData.country || 'இந்தியா (India)',
      status: stateData.status || 'active',
      totalDistricts: Number(stateData.totalDistricts) || 0,
      assignedAdminId: stateData.assignedAdminId || null,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.data.states.push(state);
    this.logAudit('super_admin', 'CREATE_STATE', 'states', id, state);
    this.persist();
    return state;
  }

  createDistrict(districtData) {
    if (!this.data.districts) this.data.districts = [];
    const id = districtData.id || districtData.nameEn.toLowerCase().replace(/\s+/g, '_');
    const existing = this.data.districts.find(d => d.id === id);
    if (existing) throw new Error('மாவட்டம் ஏற்கனவே உள்ளது (District already exists)');

    const district = {
      id,
      stateId: districtData.stateId || 'TN',
      nameTa: districtData.nameTa,
      nameEn: districtData.nameEn,
      code: districtData.code || id.toUpperCase().substring(0, 4),
      status: 'active',
      taluksCount: Number(districtData.taluksCount) || 1
    };
    this.data.districts.push(district);
    this.logAudit('super_admin', 'CREATE_DISTRICT', 'districts', id, district);
    this.persist();
    return district;
  }

  updateChapterCapacity(chapterId, newCapacity, reason, adminId) {
    const chapter = (this.data.chapters || []).find(c => c.id === chapterId);
    if (!chapter) throw new Error('சாப்டர் கிடைக்கவில்லை (Chapter not found)');

    const oldCap = chapter.capacity || 100;
    const capacityNum = Number(newCapacity);
    if (isNaN(capacityNum) && newCapacity !== 'unlimited') {
      throw new Error('செல்லுபடியாகாத கொள்ளளவு (Invalid capacity number)');
    }

    chapter.capacity = newCapacity === 'unlimited' ? -1 : capacityNum;
    chapter.maxSeats = chapter.capacity === -1 ? 9999 : chapter.capacity;
    if (!chapter.capacityChangeHistory) chapter.capacityChangeHistory = [];

    const historyRecord = {
      changedAt: new Date().toISOString(),
      oldCapacity: oldCap,
      newCapacity: chapter.capacity,
      reason: reason || 'நிர்வாக கொள்ளளவு மாற்றம்',
      adminId: adminId || 'usr_admin'
    };
    chapter.capacityChangeHistory.unshift(historyRecord);

    this.logAudit(adminId || 'usr_admin', 'UPDATE_CHAPTER_CAPACITY', 'chapters', chapterId, historyRecord);
    this.persist();
    return { chapter, history: historyRecord };
  }

  transferMember(memberId, targetChapterId, adminId) {
    const mem = (this.data.memberships || []).find(m => m.id === memberId);
    if (!mem) throw new Error('உறுப்பினர் கணக்கு கிடைக்கவில்லை (Member not found)');

    const targetChapter = (this.data.chapters || []).find(c => c.id === targetChapterId);
    if (!targetChapter) throw new Error('இலக்கு சாப்டர் கிடைக்கவில்லை (Target chapter not found)');

    // Capacity check
    const occ = this.getChapterOccupancy(targetChapterId);
    if (targetChapter.capacity > 0 && occ.filledSeats >= targetChapter.capacity) {
      throw new Error(`இலக்கு சாப்டர் ${targetChapter.nameTa} முழுமையாக நிரம்பியுள்ளது (Chapter is at maximum capacity)`);
    }

    // Category exclusivity check in target chapter
    const conflict = (this.data.memberships || []).find(m => 
      m.chapterId === targetChapterId && 
      m.categoryId === mem.categoryId && 
      m.status === 'active' && 
      m.id !== memberId
    );
    if (conflict) {
      throw new Error(`இலக்கு சாப்டரில் இந்த வணிகப் பிரிவு (${mem.categoryId}) ஏற்கனவே ஒருவரால் எடுக்கப்பட்டுள்ளது!`);
    }

    const oldChapterId = mem.chapterId;
    mem.chapterId = targetChapterId;
    
    // Also update business record
    const biz = (this.data.businesses || []).find(b => b.id === mem.businessId);
    if (biz) {
      biz.chapterId = targetChapterId;
      biz.talukId = targetChapter.talukId;
    }

    const transferAudit = {
      memberId,
      oldChapterId,
      newChapterId: targetChapterId,
      transferredAt: new Date().toISOString(),
      adminId: adminId || 'usr_admin'
    };
    this.logAudit(adminId || 'usr_admin', 'TRANSFER_MEMBER_CHAPTER', 'memberships', memberId, transferAudit);
    this.persist();
    return { success: true, member: mem, transferAudit };
  }

  submitApplication(appData) {
    if (!this.data.applications) this.data.applications = [];

    // Duplicate check
    const cleanPhone = (appData.phone || '').replace(/\D/g, '');
    const dup = this.data.applications.find(a => a.phone === cleanPhone && a.status !== 'rejected');
    if (dup) {
      throw new Error('இந்த மொபைல் எண்ணில் ஏற்கனவே விண்ணப்பம் சமர்ப்பிக்கப்பட்டுள்ளது (Application already exists for this phone)');
    }

    // Category check in preferred chapter
    const activeConflict = (this.data.memberships || []).find(m =>
      m.chapterId === appData.preferredChapterId &&
      m.categoryId === appData.categoryId &&
      m.status === 'active'
    );
    if (activeConflict) {
      throw new Error('தேர்ந்தெடுக்கப்பட்ட சாப்டரில் இந்த வணிக வகை ஏற்கனவே நிரப்பப்பட்டுள்ளது (Category occupied in chapter)');
    }

    const newApp = {
      id: `app_${Date.now()}`,
      userId: appData.userId || null,
      applicantName: appData.applicantName || appData.name,
      phone: cleanPhone,
      whatsapp: (appData.whatsapp || cleanPhone).replace(/\D/g, ''),
      email: appData.email || `${cleanPhone}@nbn.in`,
      businessName: appData.businessName,
      categoryId: appData.categoryId,
      subcategory: appData.subcategory || 'பொது பிரிவு',
      businessDescription: appData.businessDescription || '',
      yearsInBusiness: Number(appData.yearsInBusiness) || 1,
      website: appData.website || '',
      gstNumber: appData.gstNumber || '',
      address: appData.address || '',
      preferredChapterId: appData.preferredChapterId || 'harur_titans',
      districtId: appData.districtId || 'dharmapuri',
      idealCustomer: appData.idealCustomer || 'வணிக கூட்டாளர்கள்',
      referralExpectations: appData.referralExpectations || 'B2B பரிந்துரைகள்',
      membershipPlan: appData.membershipPlan || 'annual_15k',
      status: 'submitted', // submitted -> pending_verification -> under_review -> approved -> rejected -> payment_pending -> active
      committeeReviewNotes: '',
      appliedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    this.data.applications.unshift(newApp);
    this.logAudit('public', 'SUBMIT_APPLICATION', 'applications', newApp.id, newApp);
    this.persist();
    return newApp;
  }

  updateApplicationStatus(appId, newStatus, reviewNotes, adminId) {
    const app = (this.data.applications || []).find(a => a.id === appId);
    if (!app) throw new Error('விண்ணப்பம் கிடைக்கவில்லை (Application not found)');

    app.status = newStatus;
    if (reviewNotes) app.committeeReviewNotes = reviewNotes;
    app.reviewedBy = adminId || 'usr_admin';
    app.updatedAt = new Date().toISOString();

    // If approved, create/activate user & business & membership
    if (newStatus === 'active') {
      const authService = require('../services/authService');
      const cleanPhone = app.phone.replace(/\D/g, '');
      let user = (this.data.users || []).find(u => u.phone === cleanPhone);
      if (!user) {
        user = {
          id: `usr_${Date.now()}`,
          name: app.applicantName,
          email: app.email,
          phone: cleanPhone,
          role: 'member',
          passwordHash: authService.hashPassword('password'),
          createdAt: new Date().toISOString()
        };
        this.data.users.push(user);
      }
      app.userId = user.id;

      // Ensure business and membership
      const monopolyService = require('../services/monopolyService');
      const chap = (this.data.chapters || []).find(c => c.id === app.preferredChapterId) || {};
      try {
        monopolyService.reserveCategorySeat({
          userId: user.id,
          talukId: chap.talukId || 'harur',
          chapterId: app.preferredChapterId,
          categoryId: app.categoryId,
          businessName: app.businessName,
          ownerName: app.applicantName,
          phone: cleanPhone,
          email: app.email,
          address: app.address
        });
      } catch(e) {
        // Seat already reserved or exists
      }
    }

    this.logAudit(adminId || 'usr_admin', 'UPDATE_APPLICATION_STATUS', 'applications', appId, { status: newStatus, reviewNotes });
    this.persist();
    return app;
  }

  scheduleOneToOne(data) {
    if (!this.data.oneToOneMeetings) this.data.oneToOneMeetings = [];
    const newMeeting = {
      id: `oto_${Date.now()}`,
      chapterId: data.chapterId || 'harur_titans',
      hostMemberId: data.hostMemberId,
      hostMemberName: data.hostMemberName || 'உறுப்பினர்',
      inviteeMemberId: data.inviteeMemberId,
      inviteeMemberName: data.inviteeMemberName || 'உறுப்பினர்',
      meetingDate: data.meetingDate,
      meetingTime: data.meetingTime,
      format: data.format || 'physical', // physical or online
      locationOrLink: data.locationOrLink || 'ஹரூர் NBN பிசினஸ் சென்டர்',
      purpose: data.purpose || 'நெட்வொர்க்கிங் மற்றும் வணிக வாய்ப்புகள் பரிசீலனை',
      status: 'requested', // requested -> accepted -> rescheduled -> completed -> cancelled
      learnings: '',
      referralOpportunities: '',
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.data.oneToOneMeetings.unshift(newMeeting);
    this.logAudit(data.hostMemberId, 'SCHEDULE_ONE_TO_ONE', 'oneToOneMeetings', newMeeting.id, newMeeting);
    this.persist();
    return newMeeting;
  }

  updateOneToOne(meetingId, updateData) {
    const meeting = (this.data.oneToOneMeetings || []).find(m => m.id === meetingId);
    if (!meeting) throw new Error('ஒன்-டு-ஒன் சந்திப்பு கிடைக்கவில்லை (Meeting not found)');

    if (updateData.status) meeting.status = updateData.status;
    if (updateData.learnings) meeting.learnings = updateData.learnings;
    if (updateData.referralOpportunities) meeting.referralOpportunities = updateData.referralOpportunities;
    if (updateData.meetingDate) meeting.meetingDate = updateData.meetingDate;
    if (updateData.meetingTime) meeting.meetingTime = updateData.meetingTime;

    if (updateData.status === 'completed') {
      meeting.completedAt = new Date().toISOString();
    }

    this.persist();
    return meeting;
  }

  registerGuest(guestData) {
    if (!this.data.guests) this.data.guests = [];
    const cleanPhone = (guestData.phone || '').replace(/\D/g, '');

    const newGuest = {
      id: `gst_${Date.now()}`,
      name: guestData.name,
      phone: cleanPhone,
      email: guestData.email || '',
      businessName: guestData.businessName,
      category: guestData.category || 'பொது வணிகம்',
      invitedByMemberId: guestData.invitedByMemberId || 'mem_001',
      invitedByMemberName: guestData.invitedByMemberName || 'சந்திரா (Nuvea Studio)',
      chapterId: guestData.chapterId || 'harur_titans',
      meetingDate: guestData.meetingDate || 'அடுத்த வெள்ளிக்கிழமை',
      status: 'registered', // registered, confirmed, attended, follow_up, application_submitted, converted, not_interested
      attendanceRecorded: false,
      followUpNotes: guestData.notes || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.data.guests.unshift(newGuest);
    this.logAudit(guestData.invitedByMemberId || 'guest', 'REGISTER_GUEST', 'guests', newGuest.id, newGuest);
    this.persist();
    return newGuest;
  }

  updateGuestStatus(guestId, status, notes) {
    const guest = (this.data.guests || []).find(g => g.id === guestId);
    if (!guest) throw new Error('விருந்தினர் பதிவு கிடைக்கவில்லை (Guest not found)');

    guest.status = status;
    if (notes) guest.followUpNotes = notes;
    if (status === 'attended') guest.attendanceRecorded = true;

    this.persist();
    return guest;
  }

  createAnnouncement(announcementData) {
    if (!this.data.announcements) this.data.announcements = [];
    const anc = {
      id: `anc_${Date.now()}`,
      chapterId: announcementData.chapterId || 'all',
      title: announcementData.title,
      category: announcementData.category || 'Business Education',
      content: announcementData.content,
      postedBy: announcementData.postedBy || 'Nuvea Studio',
      date: new Date().toISOString().split('T')[0],
      priority: announcementData.priority || 'normal'
    };
    this.data.announcements.unshift(anc);
    this.persist();
    return anc;
  }

  createNotification(userId, data) {
    if (!this.data.notifications) this.data.notifications = [];
    const notif = {
      id: `notif_${Date.now()}`,
      userId,
      title: data.title,
      message: data.message,
      type: data.type || 'system',
      read: false,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  // ==========================================
  // MODULE B: MARKETPLACE DATABASE METHODS
  // ==========================================
  
  createCustomerRequirement(data) {
    if (!this.data.customerRequirements) this.data.customerRequirements = [];
    const id = 'REQ-' + Date.now().toString(36).toUpperCase();
    
    // Auto-match eligible active verified members across ALL chapters
    const allMembers = this.data.businesses || [];
    const matchedMembers = allMembers.filter(m => {
      const catMatch = m.categoryId === data.categoryId || (m.category && m.category.toLowerCase().includes((data.categoryName || '').toLowerCase()));
      return catMatch;
    });

    const matchedChapterIds = Array.from(new Set(matchedMembers.map(m => m.chapterId).filter(Boolean)));
    const matchedMemberIds = matchedMembers.map(m => m.id);

    const reqRecord = {
      id,
      customerId: data.customerId || 'cust_' + Date.now(),
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || '',
      title: data.title || `${data.quantity || ''} ${data.unit || ''} ${data.categoryName || 'தயாரிப்பு'} தேவை`,
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      quantity: parseInt(data.quantity) || 1,
      unit: data.unit || 'அலகுகள் (Units)',
      brandPreference: data.brandPreference || 'விருப்பத்தேர்வு (Any)',
      specifications: data.specifications || '',
      deliveryDistrict: (data.deliveryDistrict || 'dharmapuri').toLowerCase(),
      deliveryTaluk: (data.deliveryTaluk || 'harur').toLowerCase(),
      deliveryAddress: data.deliveryAddress || '',
      pinCode: data.pinCode || '',
      deliveryRequired: data.deliveryRequired !== false,
      requiredDate: data.requiredDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'open',
      matchedChapterIds: matchedChapterIds.length > 0 ? matchedChapterIds : ['harur_titans', 'palacode_titans', 'dharmapuri_central'],
      matchedMemberIds,
      selectedQuotationId: null,
      selectedSupplierId: null,
      contactConsent: false,
      consentTimestamp: null,
      createdAt: new Date().toISOString(),
      deadline: data.deadline || new Date(Date.now() + 5 * 86400000).toISOString()
    };

    this.data.customerRequirements.unshift(reqRecord);

    // Notify matching members
    matchedMemberIds.forEach(memId => {
      this.createNotification(memId, {
        title: '🛒 புதிய மார்க்கெட்பிளேஸ் தேவை (New Marketplace Requirement)',
        message: `உங்கள் பிரிவில் புதிய தேவை சமர்ப்பிக்கப்பட்டுள்ளது: ${reqRecord.title} (${reqRecord.deliveryTaluk.toUpperCase()})`,
        type: 'marketplace_lead'
      });
    });

    this.persist();
    return reqRecord;
  }

  getCustomerRequirements(filter = {}, requestingUser = null) {
    let reqs = this.data.customerRequirements || [];
    
    if (filter.customerId) {
      reqs = reqs.filter(r => r.customerId === filter.customerId);
    }
    if (filter.categoryId) {
      reqs = reqs.filter(r => r.categoryId === filter.categoryId);
    }
    if (filter.status) {
      reqs = reqs.filter(r => r.status === filter.status);
    }
    if (filter.talukId && filter.talukId !== 'all') {
      reqs = reqs.filter(r => r.deliveryTaluk === filter.talukId.toLowerCase());
    }
    if (filter.matchedMemberId) {
      reqs = reqs.filter(r => (r.matchedMemberIds || []).includes(filter.matchedMemberId) || r.selectedSupplierId === filter.matchedMemberId);
    }

    // PRIVACY FILTER: Hide customer direct phone/email from suppliers unless consented & selected!
    return reqs.map(r => {
      const isOwner = requestingUser && (requestingUser.id === r.customerId || requestingUser.role === 'super_admin');
      const isSelectedSupplierWithConsent = requestingUser && requestingUser.id === r.selectedSupplierId && r.contactConsent === true;

      if (isOwner || isSelectedSupplierWithConsent) {
        return r; // Full customer details
      }

      // Mask contact info for bidding suppliers / public
      return {
        ...r,
        customerPhone: r.customerPhone ? r.customerPhone.substring(0, 4) + 'XXXXXX' : 'XXXXXX',
        customerEmail: r.customerEmail ? r.customerEmail.substring(0, 2) + '***@***.com' : '',
        deliveryAddress: r.deliveryTaluk ? `${r.deliveryTaluk.toUpperCase()}, ${r.deliveryDistrict.toUpperCase()} (விவரம் ஆர்டர் தேர்வுக்குப் பின் வெளிப்படும்)` : 'மாவட்டம்'
      };
    });
  }

  getCustomerRequirementById(id, requestingUser = null) {
    const r = (this.data.customerRequirements || []).find(req => req.id === id);
    if (!r) return null;

    const isOwner = requestingUser && (requestingUser.id === r.customerId || requestingUser.role === 'super_admin');
    const isSelectedSupplierWithConsent = requestingUser && requestingUser.id === r.selectedSupplierId && r.contactConsent === true;

    if (isOwner || isSelectedSupplierWithConsent) {
      return r;
    }

    return {
      ...r,
      customerPhone: r.customerPhone ? r.customerPhone.substring(0, 4) + 'XXXXXX' : 'XXXXXX',
      customerEmail: r.customerEmail ? r.customerEmail.substring(0, 2) + '***@***.com' : '',
      deliveryAddress: r.deliveryTaluk ? `${r.deliveryTaluk.toUpperCase()}, ${r.deliveryDistrict.toUpperCase()}` : ''
    };
  }

  submitQuotation(data) {
    if (!this.data.quotations) this.data.quotations = [];
    const id = 'QUO-' + Date.now().toString(36).toUpperCase();

    const unitPrice = parseFloat(data.unitPrice) || 0;
    const quantity = parseInt(data.quantity) || 1;
    const subtotal = unitPrice * quantity;
    const gstAmount = parseFloat(data.gstAmount) !== undefined && !isNaN(parseFloat(data.gstAmount)) ? parseFloat(data.gstAmount) : Math.round(subtotal * 0.18);
    const deliveryCharges = parseFloat(data.deliveryCharges) || 0;
    const installationCharges = parseFloat(data.installationCharges) || 0;
    const discount = parseFloat(data.discount) || 0;
    const finalTotal = subtotal + gstAmount + deliveryCharges + installationCharges - discount;

    const quotation = {
      id,
      requirementId: data.requirementId,
      supplierMemberId: data.supplierMemberId,
      supplierBusinessName: data.supplierBusinessName,
      supplierChapterId: data.supplierChapterId || 'harur_titans',
      supplierPhone: data.supplierPhone || '',
      unitPrice,
      quantity,
      subtotal,
      gstAmount,
      deliveryCharges,
      installationCharges,
      discount,
      finalTotal,
      deliveryTimeline: data.deliveryTimeline || '2-3 நாட்களில் டெலிவரி',
      validityDays: parseInt(data.validityDays) || 7,
      validUntil: data.validUntil || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      stockAvailability: data.stockAvailability || 'ரெடி ஸ்டாக் (Ready in Stock)',
      paymentTerms: data.paymentTerms || 'பொருட்கள் கிடைத்ததும் NEFT/UPI',
      warrantyTerms: data.warrantyTerms || 'நிறுவன தயாரிப்பு உத்தரவாதம்',
      notes: data.notes || '',
      status: 'submitted',
      version: 1,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If quotation already exists from this supplier for this requirement, update version
    const existingIdx = this.data.quotations.findIndex(q => q.requirementId === data.requirementId && q.supplierMemberId === data.supplierMemberId);
    if (existingIdx !== -1) {
      const prev = this.data.quotations[existingIdx];
      quotation.version = (prev.version || 1) + 1;
      quotation.history = [...(prev.history || []), { ...prev, history: undefined }];
      this.data.quotations[existingIdx] = quotation;
    } else {
      this.data.quotations.unshift(quotation);
    }

    // Notify customer
    const req = (this.data.customerRequirements || []).find(r => r.id === data.requirementId);
    if (req) {
      this.createNotification(req.customerId, {
        title: '💼 புதிய விலைப்புள்ளி வந்தது (New Quotation Received)',
        message: `${quotation.supplierBusinessName} உங்கள் தேவைக்கு ₹${finalTotal} விலையை சமர்ப்பித்துள்ளனர்.`,
        type: 'quotation_received'
      });
    }

    this.persist();
    return quotation;
  }

  getQuotationsForRequirement(requirementId, requestingUser = null) {
    const allQuotes = (this.data.quotations || []).filter(q => q.requirementId === requirementId);
    if (allQuotes.length === 0) return [];

    // Calculate minimum finalTotal for the "Lowest Quote" badge
    const minTotal = Math.min(...allQuotes.map(q => q.finalTotal));

    const req = (this.data.customerRequirements || []).find(r => r.id === requirementId);
    const isCustomer = requestingUser && req && (requestingUser.id === req.customerId || requestingUser.role === 'customer');
    const isSuperAdmin = requestingUser && requestingUser.role === 'super_admin';

    // COMPETITOR PRIVACY RULE:
    // If user is a supplier/member, they should ONLY see their own quote!
    if (!isCustomer && !isSuperAdmin) {
      const myQuote = allQuotes.find(q => requestingUser && q.supplierMemberId === requestingUser.id);
      return myQuote ? [{ ...myQuote, isLowestQuote: myQuote.finalTotal === minTotal }] : [];
    }

    // Customer or Admin gets to see all quotes with Lowest Price badge
    return allQuotes.map(q => ({
      ...q,
      isLowestQuote: q.finalTotal === minTotal
    }));
  }

  shortlistQuotation(requirementId, quotationId) {
    const quote = (this.data.quotations || []).find(q => q.id === quotationId && q.requirementId === requirementId);
    if (!quote) throw new Error('விலைப்புள்ளி காணப்படவில்லை (Quotation not found)');

    quote.status = 'shortlisted';
    this.persist();
    return quote;
  }

  selectQuotationWithConsent(requirementId, quotationId, customerConsent, customerUser) {
    if (!customerConsent) {
      throw new Error('வாடிக்கையாளர் சம்மதம் கட்டாயம் (Customer explicit consent is required to share contact details)');
    }

    const req = (this.data.customerRequirements || []).find(r => r.id === requirementId);
    if (!req) throw new Error('தேவை விவரம் காணப்படவில்லை (Requirement not found)');

    const quote = (this.data.quotations || []).find(q => q.id === quotationId && q.requirementId === requirementId);
    if (!quote) throw new Error('விலைப்புள்ளி காணப்படவில்லை (Quotation not found)');

    // 1. Mark requirement as selected & record consent
    req.status = 'selected';
    req.selectedQuotationId = quotationId;
    req.selectedSupplierId = quote.supplierMemberId;
    req.contactConsent = true;
    req.consentTimestamp = new Date().toISOString();

    // 2. Mark winning quotation as selected, others as not_selected
    quote.status = 'selected';
    (this.data.quotations || []).forEach(q => {
      if (q.requirementId === requirementId && q.id !== quotationId) {
        q.status = 'not_selected';
      }
    });

    // 3. Create real Order in marketplaceOrders
    if (!this.data.marketplaceOrders) this.data.marketplaceOrders = [];
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
    const newOrder = {
      id: orderId,
      requirementId: req.id,
      quotationId: quote.id,
      customerId: req.customerId,
      customerName: req.customerName,
      customerPhone: req.customerPhone, // UNLOCKED by consent!
      customerEmail: req.customerEmail || '',
      supplierMemberId: quote.supplierMemberId,
      supplierBusinessName: quote.supplierBusinessName,
      itemTitle: req.title,
      finalDealValue: quote.finalTotal,
      orderStatus: 'confirmed',
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: quote.validUntil || req.requiredDate,
      completedDate: null,
      verifiedBusinessValue: quote.finalTotal,
      statusUpdates: [
        { status: 'confirmed', note: 'வாடிக்கையாளர் விலைப்புள்ளியை தேர்வு செய்து ஆர்டர் உறுதிப்படுத்தினார்', time: new Date().toISOString() }
      ],
      disputeId: null
    };

    this.data.marketplaceOrders.unshift(newOrder);

    // Notify selected supplier with unlocked contact details
    this.createNotification(quote.supplierMemberId, {
      title: '🎉 வாழ்த்துகள்! உங்கள் விலைப்புள்ளி தேர்வு செய்யப்பட்டது (Quotation Selected!)',
      message: `வாடிக்கையாளர் ${req.customerName} உங்கள் ₹${quote.finalTotal} விலைப்புள்ளியை ஏற்றுக்கொண்டார். தொடர்பு எண்: ${req.customerPhone}`,
      type: 'deal_won'
    });

    this.persist();
    return { success: true, order: newOrder, requirement: req, quotation: quote };
  }

  updateMarketplaceOrderStatus(orderId, status, actorId, note = '') {
    const order = (this.data.marketplaceOrders || []).find(o => o.id === orderId);
    if (!order) throw new Error('ஆர்டர் காணப்படவில்லை (Order not found)');

    order.orderStatus = status;
    if (status === 'delivered' || status === 'closed' || status === 'customer_confirmed') {
      order.completedDate = new Date().toISOString();
    }

    if (!order.statusUpdates) order.statusUpdates = [];
    order.statusUpdates.push({
      status,
      note: note || `நிலை "${status}" என மாற்றப்பட்டது`,
      actorId,
      time: new Date().toISOString()
    });

    // If order confirmed or completed, record in closed business analytics
    this.persist();
    return order;
  }

  submitTransactionReview(data) {
    if (!this.data.transactionReviews) this.data.transactionReviews = [];
    
    // Integrity check: Order must exist and be completed
    const order = (this.data.marketplaceOrders || []).find(o => o.id === data.orderId);
    if (!order) throw new Error('சரிபார்க்கப்பட்ட ஆர்டர் எண் தேவை (Valid order required)');

    const reviewId = 'REV-' + Date.now().toString(36).toUpperCase();
    const review = {
      id: reviewId,
      orderId: data.orderId,
      customerId: data.customerId || order.customerId,
      customerName: data.customerName || order.customerName,
      supplierMemberId: order.supplierMemberId,
      supplierBusinessName: order.supplierBusinessName,
      rating: parseInt(data.rating) || 5,
      qualityRating: parseInt(data.qualityRating) || 5,
      communicationRating: parseInt(data.communicationRating) || 5,
      deliveryRating: parseInt(data.deliveryRating) || 5,
      comment: data.comment || '',
      createdAt: new Date().toISOString(),
      verifiedPurchase: true
    };

    this.data.transactionReviews.unshift(review);
    this.persist();
    return review;
  }

  lodgeDispute(data) {
    if (!this.data.disputes) this.data.disputes = [];
    const id = 'DISP-' + Date.now().toString(36).toUpperCase();
    const dispute = {
      id,
      orderId: data.orderId,
      customerId: data.customerId,
      supplierMemberId: data.supplierMemberId,
      issueType: data.issueType || 'general',
      description: data.description,
      supplierResponse: '',
      adminNotes: '',
      status: 'lodged',
      createdAt: new Date().toISOString(),
      resolvedAt: null
    };

    this.data.disputes.unshift(dispute);
    
    // Link to order
    const order = (this.data.marketplaceOrders || []).find(o => o.id === data.orderId);
    if (order) order.disputeId = id;

    this.persist();
    return dispute;
  }

  resolveDispute(disputeId, resolutionNotes, adminId) {
    const disp = (this.data.disputes || []).find(d => d.id === disputeId);
    if (!disp) throw new Error('புகார் விபரம் காணப்படவில்லை (Dispute not found)');

    disp.status = 'resolved';
    disp.adminNotes = resolutionNotes;
    disp.resolvedBy = adminId;
    disp.resolvedAt = new Date().toISOString();

    this.persist();
    return disp;
  }

  searchMarketplace(query = '', categoryId = '', districtId = '', talukId = '') {
    const businesses = this.data.businesses || [];
    const categories = this.data.categories || [];
    const q = (query || '').toLowerCase().trim();

    return businesses.filter(b => {
      const matchCat = !categoryId || b.categoryId === categoryId;
      const matchDist = !districtId || districtId === 'all' || (b.districtId || '').toLowerCase() === districtId.toLowerCase();
      const matchTaluk = !talukId || talukId === 'all' || (b.talukId || '').toLowerCase() === talukId.toLowerCase();
      
      let matchQuery = true;
      if (q) {
        const cat = categories.find(c => c.id === b.categoryId) || {};
        const catTa = (cat.nameTa || '').toLowerCase();
        const catEn = (cat.nameEn || '').toLowerCase();

        matchQuery = (b.businessName || '').toLowerCase().includes(q) ||
                     (b.ownerName || '').toLowerCase().includes(q) ||
                     (b.category || '').toLowerCase().includes(q) ||
                     (b.categoryId || '').toLowerCase().includes(q) ||
                     catTa.includes(q) ||
                     catEn.includes(q) ||
                     (b.description || '').toLowerCase().includes(q) ||
                     (b.specialOffer || '').toLowerCase().includes(q);
      }

      return matchCat && matchDist && matchTaluk && matchQuery;
    });
  }
}

const db = new DatabaseEngine();
module.exports = db;
