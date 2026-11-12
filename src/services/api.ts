import type { AppState } from '../types';

export async function fetchAppState(): Promise<AppState> {
  try {
    const res = await fetch('/api/state');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API error, using local fallback state:', err);
  }

  // Fallback rich dataset if API server is not running
  return {
    members: [
      {
        id: 'mem_001',
        businessName: 'ஸ்ரீ முருகன் ஜூவல்லரி (Sri Murugan Jewellery)',
        ownerName: 'கே. எஸ். சந்திரசேகர்',
        categoryId: 'jewellery',
        categoryName: 'தங்கம் & வைர நகைகள் (Jewellery)',
        talukId: 'harur',
        chapterId: 'harur_titans',
        phone: '9842712345',
        address: 'பஜார் தெரு, அரூர் டவுன்',
        specialOffer: 'செய்கூலி, சேதாரம் கிடையாது! 100% BIS 916 ஹால்மார்க் தங்கம்.',
        rating: 4.9,
        accountType: 'networking_marketplace',
        businessWon: 385000,
        referralsReceived: 18,
        referralsGiven: 12,
        logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        id: 'mem_002',
        businessName: 'நுவேவா ஸ்டுடியோ (Nuvea Studio)',
        ownerName: 'சந்துரு & கார்த்திக்',
        categoryId: 'digital_marketing',
        categoryName: '4K வணிக விளம்பரம் & டிஜிட்டல் வளர்ச்சி',
        talukId: 'harur',
        chapterId: 'harur_titans',
        phone: '9443298765',
        address: 'மெயின் ரோடு, அரூர்',
        specialOffer: '4K பிசினஸ் விளம்பர வீடியோ + சோசியல் மீடியா லீட்ஸ் தொகுப்பு.',
        rating: 5.0,
        accountType: 'networking_marketplace',
        businessWon: 420000,
        referralsReceived: 24,
        referralsGiven: 19,
        logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        status: 'active'
      },
      {
        id: 'mem_003',
        businessName: 'பாலக்கோடு இயற்கை ஆர்கானிக்ஸ்',
        ownerName: 'எம். ராஜேந்திரன்',
        categoryId: 'agriculture',
        categoryName: 'இயற்கை விவசாயம் & உழவர் சந்தை',
        talukId: 'palacode',
        chapterId: 'palacode_pride',
        phone: '9788112233',
        address: 'உழவர் சந்தை எதிரில், பாலக்கோடு',
        specialOffer: 'பாரம்பரிய நாட்டு விதைகள் மற்றும் சுத்தமான மரச்செக்கு எண்ணெய்.',
        rating: 4.8,
        accountType: 'marketplace_only',
        businessWon: 150000,
        referralsReceived: 8,
        referralsGiven: 4,
        logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        status: 'active'
      }
    ],
    chapters: [
      {
        id: 'harur_titans',
        name: 'Harur Titans',
        nameTa: 'ஹரூர் டைட்டன்ஸ் சாப்டர்',
        nameEn: 'Harur Titans Chapter',
        talukId: 'harur',
        districtId: 'dharmapuri',
        location: 'அரூர் டவுன்',
        meetingDay: 'புதன்கிழமை காலை 7:00 AM',
        directorName: 'சந்துரு',
        filledSeats: 12,
        availableSeats: 88
      },
      {
        id: 'palacode_pride',
        name: 'Palacode Pride',
        nameTa: 'பாலக்கோடு பிரைட் சாப்டர்',
        nameEn: 'Palacode Pride Chapter',
        talukId: 'palacode',
        districtId: 'dharmapuri',
        location: 'பாலக்கோடு மெயின் ரோடு',
        meetingDay: 'வியாழக்கிழமை காலை 7:00 AM',
        directorName: 'ராஜேந்திரன்',
        filledSeats: 8,
        availableSeats: 92
      },
      {
        id: 'dharmapuri_royals',
        name: 'Dharmapuri Royals',
        nameTa: 'தருமபுரி ராயல்ஸ் சாப்டர்',
        nameEn: 'Dharmapuri Royals Chapter',
        talukId: 'dharmapuri_town',
        districtId: 'dharmapuri',
        location: 'தருமபுரி நகரம்',
        meetingDay: 'செவ்வாய்க்கிழமை காலை 7:00 AM',
        directorName: 'செந்தில்குமார்',
        filledSeats: 15,
        availableSeats: 85
      }
    ],
    marketplaceRequirements: [
      {
        id: 'req_001',
        title: '100 திருமண பட்டுப் புடவைகள் & வேஷ்டிகள் மொத்த ஆர்டர்',
        category: 'textiles',
        budget: 150000,
        description: 'நவம்பர் திருமணத்திற்கான பிரத்யேக காஞ்சிபுரம் பட்டு ஆடைகள் தேவை.',
        talukId: 'harur',
        urgency: 'urgent',
        status: 'open',
        createdAt: new Date().toISOString(),
        quotes: [
          {
            id: 'quote_1',
            supplierId: 'mem_003',
            supplierName: 'பாலக்கோடு சில்க்ஸ்',
            basePrice: 130000,
            taxAmount: 23400,
            totalPrice: 153400,
            notes: 'முழுமையான 18% GST வரி பில்லிங் மற்றும் இலவச டெலிவரி',
            createdAt: new Date().toISOString()
          }
        ]
      }
    ],
    marketplaceOrders: [
      {
        id: 'ORD-8942',
        totalAmount: 25000,
        taxAmount: 4500,
        status: 'delivered',
        sellerName: 'ஸ்ரீ முருகன் ஜூவல்லரி',
        createdAt: new Date().toISOString()
      }
    ],
    users: [
      {
        id: 'usr_001',
        fullName: 'சந்துரு (Super Admin)',
        email: 'admin@nuvea.in',
        phone: '9842712345',
        role: 'super_admin',
        status: 'active'
      },
      {
        id: 'usr_002',
        fullName: 'கே. எஸ். சந்திரசேகர்',
        email: 'murugan@jewels.com',
        phone: '9842712345',
        role: 'member',
        accountType: 'networking_marketplace',
        registrationNumber: 'REG-HAR-001',
        status: 'active'
      }
    ]
  };
}
