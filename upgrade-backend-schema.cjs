const fs = require('fs');
const path = require('path');
const db = require('./backend/database/db');

console.log('--- NBN ENTERPRISE SCHEMA UPGRADE ---');

// 1. Ensure States collection
if (!db.data.states || db.data.states.length === 0) {
  db.data.states = [
    {
      id: "TN",
      code: "TN",
      nameTa: "தமிழ்நாடு",
      nameEn: "Tamil Nadu",
      country: "இந்தியா (India)",
      status: "active",
      totalDistricts: 38,
      assignedAdminId: "usr_admin",
      createdAt: "2024-01-01"
    },
    {
      id: "KA",
      code: "KA",
      nameTa: "கர்நாடகா",
      nameEn: "Karnataka",
      country: "இந்தியா (India)",
      status: "planning",
      totalDistricts: 31,
      assignedAdminId: null,
      createdAt: "2024-06-01"
    }
  ];
  console.log('✓ Seeded States (Tamil Nadu, Karnataka)');
}

// 2. Ensure Districts have stateId
if (db.data.districts) {
  db.data.districts.forEach(d => {
    if (!d.stateId) d.stateId = 'TN';
    if (!d.status) d.status = 'active';
  });
  console.log(`✓ Verified ${db.data.districts.length} Districts linked to stateId: TN`);
}

// 3. Ensure Chapters have complete enterprise fields
if (db.data.chapters) {
  const chapterCodes = {
    'harur_titans': 'NBN-HAR-01',
    'palacode_prime': 'NBN-PAL-01',
    'dharmapuri_apex': 'NBN-DPI-01',
    'karimangalam_arena': 'NBN-KRM-01',
    'pennagaram_apex': 'NBN-PNG-01',
    'salem_steel': 'NBN-SLM-01',
    'hosur_tech': 'NBN-HSR-01'
  };

  db.data.chapters.forEach(c => {
    if (!c.stateId) c.stateId = 'TN';
    if (!c.districtId) {
      c.districtId = (c.talukId === 'salem' ? 'salem' : c.talukId === 'hosur' ? 'krishnagiri' : 'dharmapuri');
    }
    if (!c.code) c.code = chapterCodes[c.id] || `NBN-${(c.talukId || 'CHP').substring(0, 3).toUpperCase()}-01`;
    if (!c.capacity) c.capacity = c.maxSeats || 100;
    if (!c.meetingType) c.meetingType = 'physical'; // physical, online, hybrid
    if (!c.meetingVenue) c.meetingVenue = `${c.nameTa} ஹெட் குவாட்டர்ஸ் & கான்பரன்ஸ் ஹால்`;
    if (!c.googleMeetUrl) c.googleMeetUrl = `https://meet.google.com/nbn-${c.id}`;
    if (!c.leadership) {
      c.leadership = {
        presidentId: 'usr_002',
        presidentName: 'ஆர். சுப்ரமணியம்',
        vpId: 'usr_003',
        vpName: 'எம். தினேஷ் குமார்',
        secretaryId: 'usr_004',
        secretaryName: 'கே. ரமேஷ்',
        membershipCommittee: ['usr_005']
      };
    }
    if (!c.capacityChangeHistory) {
      c.capacityChangeHistory = [
        {
          changedAt: "2024-01-01",
          oldCapacity: 50,
          newCapacity: 100,
          reason: "சாப்டர் உறுப்பினர்கள் வளர்ச்சி & விரிவாக்க அனுமதி",
          adminId: "usr_admin"
        }
      ];
    }
    if (!c.waitingList) c.waitingList = [];
  });
  console.log(`✓ Enhanced ${db.data.chapters.length} Chapters with Capacity, Leadership, Code, and Governance`);
}

// 4. Ensure Applications collection
if (!db.data.applications || db.data.applications.length === 0) {
  db.data.applications = [
    {
      id: "app_101",
      userId: "usr_1794462353911",
      applicantName: "வி. செல்வகுமார்",
      phone: "9842119873",
      whatsapp: "9842119873",
      email: "selva.auto@gmail.com",
      businessName: "செல்வா ஆட்டோமொபைல்ஸ் & சர்வீஸ்",
      categoryId: "automobile",
      subcategory: "இருசக்கர & நான்கு சக்கர வாகன உதிரிபாகங்கள்",
      businessDescription: "20 ஆண்டுகளாக தருமபுரி & அரூர் வட்டத்தில் உதிரிபாகங்கள் மொத்த மற்றும் சில்லறை விற்பனை.",
      yearsInBusiness: 20,
      website: "https://selvaauto.com",
      gstNumber: "33AAECS1234F1Z8",
      address: "மெயின் ரோடு, ஹரூர்",
      preferredChapterId: "harur_titans",
      districtId: "dharmapuri",
      idealCustomer: "டிரான்ஸ்போர்ட் உரிமையாளர்கள் மற்றும் லோக்கல் கேரேஜ்கள்",
      referralExpectations: "மாதம் 10-15 மொத்த கொள்முதல் பரிந்துரைகள்",
      membershipPlan: "annual_15k",
      status: "pending_verification", // draft, submitted, pending_verification, under_review, approved, rejected, payment_pending, active
      committeeReviewNotes: "கடை ஆவணங்கள் மற்றும் வணிக அனுபவம் நேரில் சரிபார்க்கப்பட்டது. பரிந்துரைக்கப்படுகிறது.",
      reviewedBy: "usr_005",
      appliedAt: "2024-11-05",
      updatedAt: "2024-11-08"
    },
    {
      id: "app_102",
      userId: "usr_1794462375508",
      applicantName: "கே. கார்த்திகேயன்",
      phone: "9842227401",
      whatsapp: "9842227401",
      email: "karthik.silks@gmail.com",
      businessName: "கார்த்திக் சில்க்ஸ் & டெக்ஸ்டைல்ஸ்",
      categoryId: "textiles",
      subcategory: "பாரம்பரிய பட்டு & ஆடைகள்",
      businessDescription: "காஞ்சிபுரம் & சேலம் பட்டுப்புடவைகள் நேரடி நெசவாளர் விலைக்கே கிடைக்கும்.",
      yearsInBusiness: 12,
      website: "",
      gstNumber: "33AABCK5678H1Z1",
      address: "பஜார் வீதி, பாலக்கோடு",
      preferredChapterId: "palacode_prime",
      districtId: "dharmapuri",
      idealCustomer: "திருமண குடும்பங்கள் & துணிக்கடை மொத்த வியாபாரிகள்",
      referralExpectations: "திருமண பட்டுப்புடவை ஆர்டர்கள்",
      membershipPlan: "annual_15k",
      status: "under_review",
      committeeReviewNotes: "பாலக்கோடு சாப்டரில் டெக்ஸ்டைல் பிரிவு காலியாக உள்ளது. ஒப்புதலுக்கு சமர்ப்பிக்கப்பட்டது.",
      reviewedBy: "usr_005",
      appliedAt: "2024-11-08",
      updatedAt: "2024-11-10"
    },
    {
      id: "app_103",
      userId: "usr_004",
      applicantName: "கே. ரமேஷ்",
      phone: "919443210987",
      whatsapp: "919443210987",
      email: "ramesh@krrinfra.com",
      businessName: "கே.ஆர்.ஆர் கன்ஸ்ட்ரக்ஷன்ஸ்",
      categoryId: "construction",
      subcategory: "கட்டிட ஒப்பந்ததாரர் & 3D எலிவேஷன்",
      businessDescription: "தருமபுரி மற்றும் அரூர் வட்டாரத்தில் 50-க்கும் மேற்பட்ட தரமான வீடுகள் மற்றும் வணிக வளாகங்கள் கட்டியுள்ளோம்.",
      yearsInBusiness: 15,
      website: "https://krrinfra.com",
      gstNumber: "33AAECK4321M1Z3",
      address: "ஹரூர் பஸ் ஸ்டாண்ட் அருகில்",
      preferredChapterId: "harur_titans",
      districtId: "dharmapuri",
      idealCustomer: "வீடு, வில்லா மற்றும் வணிக வளாகம் கட்ட விரும்புவோர்",
      referralExpectations: "புதிய கட்டிட ஒப்பந்தங்கள்",
      membershipPlan: "annual_15k",
      status: "active",
      approvedBy: "usr_admin",
      appliedAt: "2024-03-01",
      updatedAt: "2024-03-10"
    }
  ];
  console.log('✓ Seeded Applications workflow records');
}

// 5. Ensure One-to-One Meetings collection
if (!db.data.oneToOneMeetings || db.data.oneToOneMeetings.length === 0) {
  db.data.oneToOneMeetings = [
    {
      id: "oto_001",
      chapterId: "harur_titans",
      hostMemberId: "mem_001",
      hostMemberName: "சந்திரா (Nuvea Studio)",
      inviteeMemberId: "mem_002",
      inviteeMemberName: "ஆர். சுப்ரமணியம் (ஸ்ரீ லட்சுமி ஜூவல்லர்ஸ்)",
      meetingDate: "2024-11-15",
      meetingTime: "04:30 PM",
      format: "physical", // physical, online
      locationOrLink: "ஸ்ரீ லட்சுமி ஜூவல்லர்ஸ் விஐபி லவுஞ்ச், ஹரூர்",
      purpose: "தீபாவளி மற்றும் திருமண சீசன் விளம்பர திட்டமிடல் & பரஸ்பர லீட் பரிமாற்றம்",
      status: "completed", // requested, accepted, rescheduled, completed, cancelled
      learnings: "ஸ்ரீ லட்சுமி ஜுவல்லரிக்கு 25 சவரன் திருமண நகை ஆர்டர் தரும் குடும்பங்களுக்கு Nuvea Studio 4K வெட்டிங் டீசர் பிரத்யேகமாக வழங்கலாம் என முடிவு செய்யப்பட்டது.",
      referralOpportunities: "அரூர் பில்டர்ஸ் சங்க தலைவர் ஆனந்தன் குடும்ப திருமண ஆர்டர் லீட் அடையாளம் காணப்பட்டது.",
      completedAt: "2024-11-15T17:30:00Z",
      createdAt: "2024-11-10"
    },
    {
      id: "oto_002",
      chapterId: "harur_titans",
      hostMemberId: "mem_001",
      hostMemberName: "சந்திரா (Nuvea Studio)",
      inviteeMemberId: "mem_003",
      inviteeMemberName: "எம். தினேஷ் குமார் (ஆக்ஸிஃபிக்ஸ்)",
      meetingDate: "2024-11-20",
      meetingTime: "05:00 PM",
      format: "physical",
      locationOrLink: "ஆக்ஸிஃபிக்ஸ் இன்ஃப்ராமார்ட் ஷோரூம், ஹரூர்",
      purpose: "புதிய 4K வீடியோ ஷோரூம் ரீல் வெளியீடு மற்றும் பிளம்பிங் காண்ட்ராக்டர்கள் சங்க லீட்கள்",
      status: "accepted",
      learnings: "",
      referralOpportunities: "",
      createdAt: "2024-11-12"
    },
    {
      id: "oto_003",
      chapterId: "harur_titans",
      hostMemberId: "mem_002",
      hostMemberName: "ஆர். சுப்ரமணியம் (ஸ்ரீ லட்சுமி ஜூவல்லர்ஸ்)",
      inviteeMemberId: "mem_004",
      inviteeMemberName: "கே. ரமேஷ் (கே.ஆர்.ஆர் கன்ஸ்ட்ரக்ஷன்ஸ்)",
      meetingDate: "2024-11-25",
      meetingTime: "11:00 AM",
      format: "physical",
      locationOrLink: "ஹரூர் NBN பிசினஸ் சென்டர்",
      purpose: "புதிய வில்லா புராஜெக்ட் வாடிக்கையாளர்களுக்கு தங்க நாணயம் கிஃப்ட் திட்டம்",
      status: "requested",
      learnings: "",
      referralOpportunities: "",
      createdAt: "2024-11-12"
    }
  ];
  console.log('✓ Seeded One-to-One Networking Meetings');
}

// 6. Ensure Guests collection (Visitor Management)
if (!db.data.guests || db.data.guests.length === 0) {
  db.data.guests = [
    {
      id: "gst_001",
      name: "மு. கார்த்திகேயன்",
      phone: "9842555666",
      email: "karthik@karthiktextiles.in",
      businessName: "கார்த்திக் சில்க்ஸ் & ரெடிமேட்ஸ்",
      category: "துணி & ஆடை (Textiles)",
      invitedByMemberId: "mem_001",
      invitedByMemberName: "சந்திரா (Nuvea Studio)",
      chapterId: "harur_titans",
      meetingDate: "2024-11-22",
      status: "attended", // registered, confirmed, attended, follow_up, application_submitted, converted, not_interested
      attendanceRecorded: true,
      followUpNotes: "மீட்டிங் கலாச்சாரம் & லீட் பரிமாற்றம் பிடித்துள்ளது. அடுத்த வாரம் உறுப்பினர் சேர்க்கை விண்ணப்பம் தர ஒப்புதல் அளித்துள்ளார்.",
      convertedApplicationId: "app_102",
      createdAt: "2024-11-10"
    },
    {
      id: "gst_002",
      name: "பி. சரவணன்",
      phone: "9443777888",
      email: "saravanan.agro@gmail.com",
      businessName: "ஹரூர் அக்ரோ சீட்ஸ் & ஃபெர்ட்டிலைசர்ஸ்",
      category: "விவசாய உரங்கள் & விதைகள் (Agro)",
      invitedByMemberId: "mem_003",
      invitedByMemberName: "எம். தினேஷ் குமார் (ஆக்ஸிஃபிக்ஸ்)",
      chapterId: "harur_titans",
      meetingDate: "2024-11-29",
      status: "confirmed",
      attendanceRecorded: false,
      followUpNotes: "முதல் முறை பார்வையாளராக கலந்து கொள்ள அழைக்கப்பட்டுள்ளார்.",
      createdAt: "2024-11-11"
    }
  ];
  console.log('✓ Seeded Guests / Visitor Management records');
}

// 7. Ensure Certificates collection (Category Exclusivity Certificates)
if (!db.data.certificates || db.data.certificates.length === 0) {
  db.data.certificates = [
    {
      id: "NBN-CERT-HAR-001",
      certificateNumber: "NBN/2024/HAR/001",
      memberId: "mem_001",
      businessId: "biz_001",
      businessName: "நுவேவா ஸ்டுடியோ (Nuvea Studio)",
      ownerName: "சந்திரா (Chandru)",
      categoryId: "digital_marketing",
      categoryNameTa: "டிஜிட்டல் மார்க்கெட்டிங் & வீடியோ தயாரிப்பு",
      categoryNameEn: "Digital Marketing & 4K Cinema Production",
      chapterId: "harur_titans",
      chapterNameTa: "ஹரூர் டைட்டன்ஸ் சாப்டர்",
      districtNameTa: "தருமபுரி மாவட்டம்",
      stateNameTa: "தமிழ்நாடு",
      validFrom: "2024-01-15",
      validUntil: "2025-01-14",
      status: "active",
      verificationUrl: "https://54d0f61bec8945.lhr.life/#/verify-certificate/NBN-CERT-HAR-001",
      policyStatement: "NBN சாப்டர் விதிகளின்படி ஹரூர் சாப்டரில் டிஜிட்டல் மார்க்கெட்டிங் பிரிவில் 100% அதிகாரப்பூர்வ பிரத்யேக இட ஒதுக்கீடு (Chapter Category Exclusivity) வழங்கப்பட்டுள்ளது."
    },
    {
      id: "NBN-CERT-HAR-002",
      certificateNumber: "NBN/2024/HAR/002",
      memberId: "mem_002",
      businessId: "biz_002",
      businessName: "ஸ்ரீ லட்சுமி தங்கம் & வைரம் (Sri Lakshmi Jewellers)",
      ownerName: "ஆர். சுப்ரமணியம்",
      categoryId: "jewellery",
      categoryNameTa: "தங்க நகை & வைரம்",
      categoryNameEn: "Jewellery & Diamonds",
      chapterId: "harur_titans",
      chapterNameTa: "ஹரூர் டைட்டன்ஸ் சாப்டர்",
      districtNameTa: "தருமபுரி மாவட்டம்",
      stateNameTa: "தமிழ்நாடு",
      validFrom: "2024-02-01",
      validUntil: "2025-01-31",
      status: "active",
      verificationUrl: "https://54d0f61bec8945.lhr.life/#/verify-certificate/NBN-CERT-HAR-002",
      policyStatement: "NBN சாப்டர் விதிகளின்படி ஹரூர் சாப்டரில் தங்க நகை & வைரம் பிரிவில் 100% அதிகாரப்பூர்வ பிரத்யேக இட ஒதுக்கீடு (Chapter Category Exclusivity) வழங்கப்பட்டுள்ளது."
    },
    {
      id: "NBN-CERT-HAR-003",
      certificateNumber: "NBN/2024/HAR/003",
      memberId: "mem_003",
      businessId: "biz_003",
      businessName: "ஆக்ஸிஃபிக்ஸ் இன்ஃப்ராமார்ட் (Oxifix Infra Mart)",
      ownerName: "எம். தினேஷ் குமார்",
      categoryId: "plumbing",
      categoryNameTa: "பிளம்பிங் & சானிட்டரி ஃபிட்டிங்ஸ்",
      categoryNameEn: "Plumbing & Sanitaryware",
      chapterId: "harur_titans",
      chapterNameTa: "ஹரூர் டைட்டன்ஸ் சாப்டர்",
      districtNameTa: "தருமபுரி மாவட்டம்",
      stateNameTa: "தமிழ்நாடு",
      validFrom: "2024-02-18",
      validUntil: "2025-02-17",
      status: "active",
      verificationUrl: "https://54d0f61bec8945.lhr.life/#/verify-certificate/NBN-CERT-HAR-003",
      policyStatement: "NBN சாப்டர் விதிகளின்படி ஹரூர் சாப்டரில் பிளம்பிங் & சானிட்டரி பிரிவில் 100% அதிகாரப்பூர்வ பிரத்யேக இட ஒதுக்கீடு (Chapter Category Exclusivity) வழங்கப்பட்டுள்ளது."
    }
  ];
  console.log('✓ Seeded Digital Category Exclusivity Certificates with verification IDs');
}

// 8. Ensure Announcements (Business Education & Events)
if (!db.data.announcements || db.data.announcements.length === 0) {
  db.data.announcements = [
    {
      id: "anc_001",
      chapterId: "all",
      title: "வணிகக் கல்வி: 'வாடிக்கையாளர் நம்பிக்கையை வெல்லும் 5 எளிய ரகசியங்கள்'",
      category: "Business Education",
      content: "இந்த வார வாராந்திர கூட்டத்தில் உயர்மதிப்பு பரிந்துரைகளை (High-Ticket Referrals) ஈர்ப்பதற்கான நெட்வொர்க்கிங் வழிமுறைகள் பகிரப்படும்.",
      postedBy: "சந்திரா (Nuvea Studio)",
      date: "2024-11-12",
      priority: "high"
    },
    {
      id: "anc_002",
      chapterId: "harur_titans",
      title: "கொடைக்கானல் வருடாந்திர தலைமைத்துவ சம்மிட் (Annual Leadership Retreat)",
      category: "Event",
      content: "நவம்பர் 28 அன்று கொடைக்கானலில் தமிழ்நாட்டின் அனைத்து NBN சாப்டர் தலைவர்கள் மற்றும் டைரக்டர்கள் பங்குபெறும் மாபெரும் பிசினஸ் மாநாடு நடைபெறுகிறது.",
      postedBy: "தலைமை அலுவலகம்",
      date: "2024-11-10",
      priority: "urgent"
    }
  ];
  console.log('✓ Seeded Business Education & Announcements');
}

// 9. Ensure In-App Notifications
if (!db.data.notifications || db.data.notifications.length === 0) {
  db.data.notifications = [
    {
      id: "notif_001",
      userId: "usr_001",
      title: "புதிய B2B பரிந்துரை லீட்!",
      message: "ஸ்ரீ லட்சுமி ஜூவல்லர்ஸ் நிறுவனம் உங்களுக்கு புதிய 4K சினிமாடிக் விளம்பர ஆர்டர் லீட் வழங்கியுள்ளது.",
      type: "referral",
      read: false,
      createdAt: "2024-11-12T10:30:00Z"
    },
    {
      id: "notif_002",
      userId: "usr_001",
      title: "வாராந்திர சாப்டர் கூட்டம்",
      message: "ஹரூர் டைட்டன்ஸ் சாப்டர் கூட்டம் வரும் வெள்ளிக்கிழமை காலை 07:30 மணிக்கு நடைபெறும். 45-வினாடி அறிமுக உரைக்கு தயாராக இருங்கள்.",
      type: "meeting",
      read: false,
      createdAt: "2024-11-11T09:00:00Z"
    },
    {
      id: "notif_003",
      userId: "usr_admin",
      title: "புதிய உறுப்பினர் விண்ணப்பம்!",
      message: "வி. செல்வகுமார் (செல்வா ஆட்டோமொபைல்ஸ்) உறுப்பினர் சேர்க்கைக்கு விண்ணப்பித்துள்ளார்.",
      type: "application",
      read: false,
      createdAt: "2024-11-05T14:15:00Z"
    }
  ];
  console.log('✓ Seeded In-App Notifications');
}

// 10. Ensure Awards & Recognition
if (!db.data.awards || db.data.awards.length === 0) {
  db.data.awards = [
    {
      id: "awd_001",
      month: "அக்டோபர் 2024",
      awardType: "best_networker",
      title: "🏆 சிறந்த நெட்வொர்க்கர் விருது (Best Networker of the Month)",
      winnerName: "ஆர். சுப்ரமணியம்",
      businessName: "ஸ்ரீ லட்சுமி தங்கம் & வைரம்",
      chapterName: "ஹரூர் டைட்டன்ஸ்",
      achievement: "14 தரமான பரிந்துரைகள் வழங்கியுள்ளார்",
      badgeColor: "amber"
    },
    {
      id: "awd_002",
      month: "அக்டோபர் 2024",
      awardType: "highest_business",
      title: "💰 அதிகபட்ச வர்த்தகம் உருவாக்கியவர் (Highest Business Generated)",
      winnerName: "சந்திரா (Chandru)",
      businessName: "நுவேவா ஸ்டுடியோ (Nuvea Studio)",
      chapterName: "ஹரூர் டைட்டன்ஸ்",
      achievement: "₹18,40,000 மதிப்பிலான வர்த்தகம் முடித்துக் கொடுத்துள்ளார்",
      badgeColor: "emerald"
    },
    {
      id: "awd_003",
      month: "அக்டோபர் 2024",
      awardType: "best_attendance",
      title: "⏱️ 100% வருகைப் பதிவு சாதனையாளர் (100% Attendance)",
      winnerName: "எம். தினேஷ் குமார்",
      businessName: "ஆக்ஸிஃபிக்ஸ் இன்ஃப்ராமார்ட்",
      chapterName: "ஹரூர் டைட்டன்ஸ்",
      achievement: "தொடர்ந்து 24 வாரங்கள் ஒரு கூட்டமும் தவறாமல் பங்கேற்பு",
      badgeColor: "indigo"
    }
  ];
  console.log('✓ Seeded Performance Recognition Awards');
}

// 11. Ensure Referrals follow full 9-stage lifecycle
if (db.data.referrals) {
  db.data.referrals.forEach((r, idx) => {
    if (!r.stage) {
      r.stage = r.status === 'won' ? 'won' : (r.status === 'contacted' ? 'contacted' : 'received');
    }
    if (r.expectedValue && !r.estimatedValue) {
      r.estimatedValue = Number(String(r.expectedValue).replace(/\D/g, '')) || 25000;
    }
    if (r.status === 'won' && !r.verifiedClosedValue) {
      r.verifiedClosedValue = r.closedValue || r.estimatedValue || 50000;
      r.confirmedByBoth = true;
      r.conversionDate = "2024-11-10";
    }
  });
  console.log(`✓ Upgraded ${db.data.referrals.length} referrals to 9-stage verified lifecycle`);
}

// Persist the upgraded database
db.persist();
console.log('=======================================================');
console.log(' DATABASE PERSISTED SUCCESSFULLY WITH ENTERPRISE DATA!');
console.log('=======================================================');
