# NUVEA BUSINESS NETWORK (NBN) — B2B NETWORKING SAAS PLATFORM

> **தமிழ்நாட்டின் முதல் தாலுகா அளவிலான டிஜிட்டல் B2B நெட்வொர்க்**  
> **நிறுவனர் & வீடியோ தயாரிப்பு பங்குதாரர்:** நுவேவா ஸ்டுடியோ (Nuvea Studio) — சந்திரா (Chandru), போன்: +91 7548820641  
> **இயக்க வட்டாரம்:** ஹரூர், பாலக்கோடு, காரிமங்கலம், தருமபுரி டவுன், பென்னாகரம் (விரிவாக்கம்: 38 மாவட்டங்கள்)  

---

## 🌟 1. எக்சிகியூட்டிவ் சம்மரி (Executive Summary)

**Nuvea Business Network (NBN)** என்பது BNI (Business Network International) மற்றும் BNC நெட்வொர்க்கிங் அமைப்புகளின் உயர் வருவாய் மாடலை தழுவி, கிராமப்புற மற்றும் சிறு நகர வணிகர்களுக்காக பிரத்யேகமாக உருவாக்கப்பட்ட முழுமையான டிஜிட்டல் B2B SaaS பிளாட்பார்ம் ஆகும்.

### முக்கிய வணிக விதிகள் (Core Business Invariants):
1. **100% கேட்டகிரி மோனோபோலி (Category Monopoly):** ஒரு தாலுகாவில் ஒரு வணிகப் பிரிவுக்கு (Category) **ஒரே ஒரு அங்கீகரிக்கப்பட்ட கடை மட்டுமே** அனுமதி. போட்டியாளர்கள் நுழைய முடியாது.
2. **100 சீட் வரம்பு (Taluk Capacity):** ஒரு தாலுகா சாப்டரில் அதிகபட்சம் 100 தொழில்முனைவோர் மட்டுமே இணைய முடியும்.
3. **4-அடுக்கு பதவி உயர்வு (4-Tier Elevation Engine):** தாலுகா (Level 1) ➔ மாவட்ட VIP (Level 2) ➔ மாநில Titans (Level 3) ➔ தேசிய Apex (Level 4) என லீட்கள் மற்றும் வருகையின் அடிப்படையில் தானாக பதவி உயர்வு.
4. **தானியங்கி Google Meet AI கண்டக்டர்:** 45-வினாடி கவுண்டவுன் டைமர், 10 விநாடி ஆடியோ எச்சரிக்கை, 3-புள்ளி டெலிப்ராம்ப்டர் ஸ்கிரிப்ட், மற்றும் வாட்ஸ்அப் அலர்ட்.
5. **₹25,000 மதிப்பிலான இலவச 4K சினிமாடிக் வீடியோ:** இணையும் ஒவ்வொரு தாலுகா கடைக்கும் Nuvea Studio மூலம் Sony A7 IV & FX3 Cinema கேமராக்களில் படம்பிடிக்கப்படும் 4K விளம்பர வீடியோ பலன்.

---

## 🚀 2. தொடங்குதல் (Quickstart & Setup)

### தேவைப்படுபவை (Prerequisites)
- Node.js v18+ அல்லது v24+
- npm v9+

### இயக்க வழிமுறைகள் (Execution Steps)
```powershell
# 1. ப்ராஜெக்ட் டைரக்டரிக்கு செல்லவும்
cd "C:\Users\chand\.gemini\antigravity\scratch\nuvea-business-network"

# 2. டிபென்டன்ஸிகளை நிறுவவும்
npm install

# 3. சர்வரை துவங்கவும்
npm start

# 4. பிரவுசரில் அணுகவும்
http://localhost:3000
```

---

## 🧪 3. தானியங்கி டெஸ்ட் சூட் (Automated Test Suite)

ப்ராஜெக்ட்டில் உள்ள 12 முக்கிய வணிக விதிகள் மற்றும் API எண்ட்பாயிண்ட்களை சோதிக்க:

```powershell
node tests/run-tests.js
```

### சோதிக்கப்படும் 12 அம்சங்கள்:
1. பயனர் பதிவு மற்றும் SHA-256 கடவுச்சொல் ஹாஷிங்
2. JWT அங்கீகாரம் மற்றும் டோக்கன் சரிபார்ப்பு
3. RBAC ரோல் அனுமதிகள் (Member vs Super Admin)
4. கேட்டகிரி மோனோபோலி மோதல் தடுப்பு (HTTP 409 Conflict)
5. வெற்றிகரமான சீட் லாக் மற்றும் 4K வீடியோ திட்டம் துவக்கம்
6. 100 நிஜ கேட்டகிரிகள் மற்றும் 38 தமிழக மாவட்டங்கள் சரிபார்ப்பு
7. B2B லீட் வாழ்க்கை சுழற்சி (Submitted ➔ Won)
8. 4-அடுக்கு பதவி உயர்வு மற்றும் லீடர்போர்டு கணக்கீடு
9. AI கூகுள் மீட் கண்டக்டர் மற்றும் ஆட்டோ ரிப்போர்ட்
10. 3-ஸ்ட்ரைக் ஒழுங்குமுறை மற்றும் அப்பீல் நடைமுறை
11. அட்மின் அமைப்புகள் நிகழ்நேர சேமிப்பு (Zero Restart)
12. 18% GST வரி விலைப்பட்டியல் (9% CGST + 9% SGST) மற்றும் SAC Code 998314

---

## 📐 4. கணினி கட்டமைப்பு (System Architecture)

```
nuvea-business-network/
├── backend/
│   ├── database/
│   │   ├── db.js                     # ACID Transactional Relational Database Engine
│   │   └── seeds/
│   │       ├── categories.json       # 100 Practical Business Categories
│   │       ├── districts.json        # 38 Tamil Nadu Districts
│   │       └── taluks.json           # Initial 5 Taluk Chapters
│   ├── middleware/
│   │   └── auth.js                   # JWT Verification & Role-Based Access Control
│   ├── routes/
│   │   ├── adminRoutes.js            # Super Admin & Settings Controller
│   │   ├── authRoutes.js             # Authentication & Demo Role Switcher
│   │   ├── elevationRoutes.js        # Leaderboard & Tier Eligibility Engine
│   │   ├── meetingRoutes.js          # Google Meet Conductor & 45s Timer Queue
│   │   ├── memberRoutes.js           # Member Dashboard & Referral Lifecycle
│   │   ├── monopolyRoutes.js         # Category Monopoly Reservation & 409 Conflict Guard
│   │   ├── paymentRoutes.js          # Razorpay Gateway & GST Tax Invoices
│   │   └── publicRoutes.js           # Directory Search & Live Platform Counters
│   └── services/
│       ├── authService.js            # Crypto Hashing & JWT Minting
│       ├── elevationService.js       # 4-Tier Composite Scoring Formula
│       ├── meetingService.js         # Speaker Transition & Post-Meet Reports
│       ├── monopolyService.js        # Category Locking & Capacity Enforcer
│       ├── notificationService.js    # WhatsApp Cloud API Payload Builder
│       ├── paymentService.js         # Razorpay Verification & GST Calculator
│       └── strikeService.js          # 3-Strike Warning, Notice & Appeal Engine
├── data/
│   └── db.json                       # Structured JSON Relational Database
├── public/
│   ├── index.html                    # Commercial Frontend SPA (Tailwind + Bilingual TA/EN)
│   ├── css/custom.css                # Enterprise Card & Badge Styles
│   └── js/app.js                     # Modular Client Controller & Web Audio Chimes
├── tests/
│   └── run-tests.js                  # 12-Test Automated Verification Suite
├── server.cjs                        # Main Express HTTP Server
├── package.json                      # Manifest & Dependencies
└── README.md                         # Documentation
```

---

## 💰 5. கட்டண அமைப்புகள் & விலைப்பட்டியல் (Pricing & GST Invoicing)

- **தாலுகா சாப்டர் (Level 1):** ₹15,000 / ஆண்டு + 18% GST (₹2,700) = **₹17,700**
  - ₹25,000 மதிப்பிலான Nuvea Studio 4K வீடியோ தயாரிப்பு பலன் உள்ளடங்கியது.
- **மாவட்ட VIP சாப்டர் (Level 2):** ₹25,000 / ஆண்டு
- **மாநில Titans சாப்டர் (Level 3):** ₹50,000 / ஆண்டு
- **தேசிய Apex சாப்டர் (Level 4):** ₹1,00,000 / ஆண்டு
- **வரி விபரம்:** SAC Code `998314` (Advertising & B2B Representation), 9% CGST + 9% SGST.

---

## 🔒 6. பாதுகாப்பு & அங்கீகாரம் (Security & Roles)

1. **பார்வையாளர் (Public Visitor):** கடைகளைத் தேடலாம், WhatsApp/Call செய்யலாம், காலியான சீட்களைப் பார்த்து விண்ணப்பிக்கலாம்.
2. **வணிக உறுப்பினர் (Business Member):** லீட்கள் பகிரலாம், பெற்ற லீட்களை 'Won/Lost' என அப்டேட் செய்யலாம், மீட்டிங்கில் பங்கேற்கலாம், வரி விலைப்பட்டியலை பதிவிறக்கம் செய்யலாம்.
3. **சூப்பர் அட்மின் (Super Admin - Chandru):** கட்டணங்களை மாற்றலாம், மீட்டிங் நேரத்தை நிர்ணயிக்கலாம், ஸ்ட்ரைக் நோட்டீஸ் வழங்கலாம், முழு உறுப்பினர் தரவுகளையும் CSV வடிவில் பதிவிறக்கம் செய்யலாம்.

---

## 📞 7. தொடர்பு & தொழில்நுட்ப ஆதரவு
- **நிறுவனர்:** சந்திரா (Chandru), Nuvea Studio
- **தொலைபேசி:** +91 7548820641
- **Instagram:** [@nuvea_studio](https://instagram.com/nuvea_studio)
- **முகவரி:** ஹரூர் & தருமபுரி, தமிழ்நாடு, இந்தியா.
