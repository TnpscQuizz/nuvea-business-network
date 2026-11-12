const fs = require('fs');
const path = require('path');

const dbJsonPath = path.join(__dirname, 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

console.log('--- EXTENDING NBN DATABASE SCHEMA FOR MODULE B: MARKETPLACE ---');

// 1. Initialize customerRequirements
if (!dbData.customerRequirements) {
  dbData.customerRequirements = [
    {
      id: 'REQ-2026-001',
      customerId: 'cust_001',
      customerName: 'சரவணன் (Saravanan Constructions)',
      customerPhone: '9842100112',
      customerEmail: 'saravanan.build@gmail.com',
      title: '500 மூட்டை அல்ட்ராடெக் / டால்மியா சிமெண்ட் தேவை',
      categoryId: 'cat_001',
      categoryName: 'சிமெண்ட் & கட்டுமானப் பொருட்கள்',
      quantity: 500,
      unit: 'மூட்டை (Bags)',
      brandPreference: 'UltraTech / Dalmia',
      specifications: '53 Grade OPC Cement. தளம் அமைக்கும் வேலைக்காக உடனடியாக தேவைப்படுகிறது.',
      deliveryDistrict: 'dharmapuri',
      deliveryTaluk: 'harur',
      deliveryAddress: 'ஹரூர் பைபாஸ் ரோடு, தருமபுரி',
      pinCode: '636903',
      deliveryRequired: true,
      requiredDate: '2026-11-20',
      status: 'open',
      matchedChapterIds: ['harur_titans', 'palacode_titans', 'dharmapuri_central'],
      matchedMemberIds: ['mem_001', 'mem_002'],
      selectedQuotationId: null,
      selectedSupplierId: null,
      contactConsent: false,
      consentTimestamp: null,
      createdAt: '2026-11-10T10:00:00.000Z',
      deadline: '2026-11-18T18:00:00.000Z'
    },
    {
      id: 'REQ-2026-002',
      customerId: 'cust_002',
      customerName: 'கார்த்திகேயன் (ஹோட்டல் ஆனந்தா)',
      customerPhone: '9443211223',
      customerEmail: 'karthik.anandha@gmail.com',
      title: 'ஹோட்டல் புதிய கிளைக்கான 3BHK இன்டீரியர் & மர வேலைப்பாடுகள்',
      categoryId: 'cat_004',
      categoryName: 'இன்டீரியர் டிசைன் & மாடுலர் கிச்சன்',
      quantity: 1,
      unit: 'முழு திட்டம் (Full Project)',
      brandPreference: 'Greenlam / Century Ply',
      specifications: '3000 சதுர அடி ரெஸ்டாரன்ட் இன்டீரியர், அக்ரிலிக் பினிஷ் மற்றும் ஃபால்ஸ் சீலிங்.',
      deliveryDistrict: 'dharmapuri',
      deliveryTaluk: 'dharmapuri_town',
      deliveryAddress: 'நேதாஜி பைபாஸ், தருமபுரி டவுன்',
      pinCode: '636701',
      deliveryRequired: true,
      requiredDate: '2026-12-05',
      status: 'open',
      matchedChapterIds: ['dharmapuri_central', 'harur_titans'],
      matchedMemberIds: ['mem_004'],
      selectedQuotationId: null,
      selectedSupplierId: null,
      contactConsent: false,
      consentTimestamp: null,
      createdAt: '2026-11-11T12:00:00.000Z',
      deadline: '2026-11-22T18:00:00.000Z'
    }
  ];
}

// 2. Initialize quotations
if (!dbData.quotations) {
  dbData.quotations = [
    {
      id: 'QUO-2026-001',
      requirementId: 'REQ-2026-001',
      supplierMemberId: 'mem_001',
      supplierBusinessName: 'ஹரூர் சிமெண்ட் ஏஜென்சி (Harur Cement)',
      supplierChapterId: 'harur_titans',
      supplierPhone: '9842511223',
      unitPrice: 345,
      quantity: 500,
      subtotal: 172500,
      gstAmount: 31050,
      deliveryCharges: 1500,
      installationCharges: 0,
      discount: 1050,
      finalTotal: 204000,
      deliveryTimeline: '24 மணி நேரத்திற்குள் டெலிவரி (Within 24 Hours)',
      validityDays: 7,
      validUntil: '2026-11-18',
      stockAvailability: 'ரெடி ஸ்டாக் (Ready in Stock)',
      paymentTerms: 'பொருட்கள் இறக்கியவுடன் 100% NEFT/Cash',
      warrantyTerms: 'அல்ட்ராடெக் அசல் நிறுவன தயாரிப்பு உத்தரவாதம்',
      notes: 'நேரடி தொழிற்சாலை லோடு. தளத்திற்கு இலவச லோடிங்/அன்லோடிங் ஏற்பாடு செய்யப்படும்.',
      status: 'submitted',
      version: 1,
      history: [],
      createdAt: '2026-11-10T14:30:00.000Z',
      updatedAt: '2026-11-10T14:30:00.000Z'
    },
    {
      id: 'QUO-2026-002',
      requirementId: 'REQ-2026-001',
      supplierMemberId: 'mem_002',
      supplierBusinessName: 'பாலக்கோடு பில்டர்ஸ் மார்ட் (Palacode Mart)',
      supplierChapterId: 'palacode_titans',
      supplierPhone: '9443677889',
      unitPrice: 340,
      quantity: 500,
      subtotal: 170000,
      gstAmount: 30600,
      deliveryCharges: 2500,
      installationCharges: 0,
      discount: 2100,
      finalTotal: 201000,
      deliveryTimeline: '2 நாட்களுக்குள் (Within 2 Days)',
      validityDays: 5,
      validUntil: '2026-11-17',
      stockAvailability: 'ரெடி ஸ்டாக்',
      paymentTerms: '50% அட்வான்ஸ், 50% டெலிவரியின் போது',
      warrantyTerms: 'நிறுவன நேரடி பில்லிங்',
      notes: 'பாலக்கோட்டிலிருந்து நேரடியாக சப்ளை செய்யப்படுகிறது. குறைந்த விலை உத்தரவாதம்.',
      status: 'submitted',
      version: 1,
      history: [],
      createdAt: '2026-11-10T16:00:00.000Z',
      updatedAt: '2026-11-10T16:00:00.000Z'
    }
  ];
}

// 3. Initialize marketplaceOrders
if (!dbData.marketplaceOrders) {
  dbData.marketplaceOrders = [
    {
      id: 'ORD-2026-001',
      requirementId: 'REQ-2026-000',
      quotationId: 'QUO-2026-000',
      customerId: 'cust_003',
      customerName: 'வெங்கடேஷ் (ஹரூர்)',
      customerPhone: '9842998877',
      customerEmail: 'venkat@gmail.com',
      supplierMemberId: 'mem_001',
      supplierBusinessName: 'ஹரூர் சிமெண்ட் ஏஜென்சி',
      itemTitle: '300 மூட்டை சிமெண்ட் கொள்முதல்',
      finalDealValue: 122400,
      orderStatus: 'delivered',
      orderDate: '2026-11-02T10:00:00.000Z',
      expectedDeliveryDate: '2026-11-04',
      completedDate: '2026-11-04T16:00:00.000Z',
      verifiedBusinessValue: 122400,
      statusUpdates: [
        { status: 'confirmed', note: 'ஆர்டர் உறுதி செய்யப்பட்டது', time: '2026-11-02T10:30:00.000Z' },
        { status: 'in_progress', note: 'வாகனத்தில் லோடு ஏற்றப்பட்டது', time: '2026-11-03T11:00:00.000Z' },
        { status: 'delivered', note: 'பொருட்கள் தளத்தில் இறக்கப்பட்டது', time: '2026-11-04T16:00:00.000Z' }
      ],
      disputeId: null
    }
  ];
}

// 4. Initialize transactionReviews
if (!dbData.transactionReviews) {
  dbData.transactionReviews = [
    {
      id: 'REV-2026-001',
      orderId: 'ORD-2026-001',
      customerId: 'cust_003',
      customerName: 'வெங்கடேஷ் (ஹரூர்)',
      supplierMemberId: 'mem_001',
      supplierBusinessName: 'ஹரூர் சிமெண்ட் ஏஜென்சி',
      rating: 5,
      qualityRating: 5,
      communicationRating: 5,
      deliveryRating: 5,
      comment: 'மிகச்சிறந்த தரம் மற்றும் குறிப்பிட்ட நேரத்தில் டெலிவரி செய்து கொடுத்தார்கள். NBN நெட்வொர்க் சேவை மிக அருமை!',
      createdAt: '2026-11-05T10:00:00.000Z',
      verifiedPurchase: true
    }
  ];
}

// 5. Initialize disputes
if (!dbData.disputes) {
  dbData.disputes = [];
}

fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log('✓ Successfully populated db.json with marketplace entities: customerRequirements, quotations, marketplaceOrders, transactionReviews, disputes');
