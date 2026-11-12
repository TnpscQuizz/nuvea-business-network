# NBN (Nuvea Business Network) – Modular React 19 Architecture

முழு ப்ராஜெக்ட்டும் உங்கள் விருப்பப்படி **React 19 + TypeScript + Tailwind CSS 4 + Vite**-ல் மிகத் தெளிவாகவும், தனித்தனி மாட்யூல்களாகவும் பிரிக்கப்பட்டு கட்டமைக்கப்பட்டுள்ளது.

---

## 📁 React கோப்பு கட்டமைப்பு (React File Structure)

நீங்கள் நேரடியாக எடிட் செய்யக்கூடிய React ஃபைல்கள் `src/` அடைவுக்குள் மிக நேர்த்தியாகப் பிரிக்கப்பட்டுள்ளன:

```text
nuvea-business-network/
│
├── ⚛️ src/                                  --> [REACT 19 மூலக் குறியீடுகள்]
│   │
│   ├── modules/
│   │   ├── 🛡️ admin/AdminPortal.tsx         --> அட்மினுக்கான பிரத்யேக போர்டல்
│   │   │                                       (சாப்டர்கள், 100 தொழில் ஏகபோக சீட்கள், பயனர் அனுமதி)
│   │   │
│   │   ├── 🏢 business/BusinessPortal.tsx    --> பிசினஸ் ஓனர்ஸுக்கான பிரத்யேக போர்டல்
│   │   │                                       (34+ உறுப்பினர் சுவிட்சர், பரிந்துரைகள், லீட்கள் & கொட்டேஷன்)
│   │   │
│   │   ├── 👤 user/UserPortal.tsx           --> வாடிக்கையாளர் & பையர் போர்டல்
│   │   │                                       (100+ பிரிவு தேடல், தேவை சமர்ப்பிப்பு, கார்ட் & பில்லிங்)
│   │   │
│   │   └── ✨ gateway/GatewayPortal.tsx     --> முகப்பு வாயில் (Dual Master Gateway)
│   │                                           (NBN நெட்வொர்க்கிங் vs NBN பிசினஸ் மார்க்கெட்பிளேஸ்)
│   │
│   ├── components/
│   │   ├── Header.tsx                        --> பிரதான நேவிகேஷன், போர்டல் சுவிட்சர், மொழி & கார்ட்
│   │   ├── CartModal.tsx                     --> 18% GST வரி பில்லிங் மற்றும் செக்அவுட்
│   │   └── PostRequirementModal.tsx          --> மொத்த தேவை சமர்ப்பிக்கும் படிவம்
│   │
│   ├── services/
│   │   └── api.ts                            --> Node.js/Express API இணைப்பு & ஆஃப்லைன் மோக் தரவு
│   │
│   ├── types/
│   │   └── index.ts                          --> அனைத்து TypeScript மாதிரிகள் & வகைகள்
│   │
│   ├── App.tsx                               --> பிரதான React ரூட் காம்பொனென்ட்
│   └── index.css                             --> Tailwind CSS 4 மற்றும் எழுத்துரு ஸ்டைல்கள்
│
├── 🚀 server.cjs                             --> Express Backend & API சர்வர் (Serves React on http://localhost:3000)
├── 💾 data/db.json                           --> நேரடி தரவுத்தளம் (34+ உறுப்பினர்கள், 11 சாப்டர்கள்)
├── ⚡ vite.config.ts                         --> Vite பில்டர் & API Proxy
└── 📦 package.json
```

---

## ✏️ நீங்கள் எங்கு சென்று நேரடியாக எடிட் செய்யலாம்?

| நீங்கள் மாற்ற வேண்டிய பகுதி | செல்ல வேண்டிய React ஃபைல் |
|---|---|
| **🛡️ அட்மின் போர்டல் மாற்றங்கள்** | [`src/modules/admin/AdminPortal.tsx`](file:///C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/src/modules/admin/AdminPortal.tsx) |
| **🏢 பிசினஸ் ஓனர் டேஷ்போர்டு மாற்றங்கள்** | [`src/modules/business/BusinessPortal.tsx`](file:///C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/src/modules/business/BusinessPortal.tsx) |
| **👤 வாடிக்கையாளர் / சந்தை மாற்றங்கள்** | [`src/modules/user/UserPortal.tsx`](file:///C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/src/modules/user/UserPortal.tsx) |
| **✨ முகப்பு வாயில் (Gateway) மாற்றங்கள்** | [`src/modules/gateway/GatewayPortal.tsx`](file:///C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/src/modules/gateway/GatewayPortal.tsx) |
| **🔝 தலைப்பு & நேவிகேஷன்** | [`src/components/Header.tsx`](file:///C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/src/components/Header.tsx) |
| **🛒 கார்ட் & 18% GST வரி கணக்கீடு** | [`src/components/CartModal.tsx`](file:///C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/src/components/CartModal.tsx) |
| **💾 தரவுகள் & ஏபிஐ இணைப்புகள்** | [`src/services/api.ts`](file:///C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/src/services/api.ts) |

---

## 🌐 எப்படி இயக்குவது & பார்ப்பது?

1. **நேரடியாக பிரவுசரில் பார்க்க (Express சர்வர் மூலம்):**
   👉 **`http://localhost:3000/`** (இது React தயாரிப்பு பில்டை உடனடியாகக் காண்பிக்கும்)

2. **React Hot Reloading (வேகமான டெவலப்மென்ட் மோடில்):**
   ```bash
   npm run dev:react
   ```
   👉 **`http://localhost:5173/`** - நீங்கள் ஃபைல்களில் சேமிக்கும் மாற்றங்கள் 1 மில்லி வினாடியில் திரையில் பிரதிபலிக்கும்!

3. **புதிய மாற்றங்களை பில்ட் செய்ய:**
   ```bash
   npm run build
   ```
