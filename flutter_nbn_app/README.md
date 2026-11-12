# NBN (Nuvea Business Network) – Flutter Multiplatform App (Web & Android)

இந்த Flutter ப்ராஜெக்ட் **Web App** மற்றும் **Android App** ஆகிய இரண்டு இயங்குதளங்களிலும் ஒரே குறியீட்டுத் தொகுப்பில் (Single Codebase) 100% நேர்த்தியாக இயங்குமாறு வடிவமைக்கப்பட்டுள்ளது.

---

## 🚀 முக்கிய சிறப்பம்சங்கள் (Core Features)

1. **இரு இயங்குதள ஆதரவு (Web & Android):**
   - **Android (மொபைல்):** தானாகவே மொபைல் ஸ்கிரீன் அளவுக்கு தகவமைத்து, கீழே உள்ள **Bottom Navigation Bar** (`முகப்பு`, `வணிகர்`, `வாடிக்கையாளர்`, `அட்மின்`) மூலம் எளிதாக இயங்கும்.
   - **Web (டெஸ்க்டாப் / லேப்டாப்):** பெரிய திரைக்கு ஏற்ற அகன்ற **AppBar**, தேடல் மற்றும் டேப் பில்டர் மூலம் நவீன கார்ப்பரேட் போர்டலாக இயங்கும்.

2. **அனைத்து 4 முதன்மை தொகுதிகள் (All 4 Integrated Portals):**
   - 🌟 **முகப்பு (Gateway):** `NBN நெட்வொர்க்கிங்` (சாப்டர் மாடல்) மற்றும் `NBN பிசினஸ் மார்க்கெட்பிளேஸ்` (வர்த்தக சந்தை) தேர்வு.
   - 🏢 **வணிகர் போர்டல் (Business Owner Hub):** 34+ உறுப்பினர்களின் கணக்குகளை டிராப்டவுன் மூலம் தேர்வு செய்யும் வசதி, பரிந்துரைகள் (Referrals), 1-to-1 சந்திப்பு, நேரடி லீட்கள் & கொட்டேஷன் பிடிங்.
   - 👤 **வாடிக்கையாளர் போர்டல் (Customer Hub):** தாலுகா வாரியான வணிகர்கள் தேடல், மொத்த தேவை சமர்ப்பித்தல், 18% GST வரி பில்லிங் மற்றும் ஷாப்பிங் கார்ட்.
   - 🛡️ **அட்மின் கன்சோல் (Super Admin Console):** சாப்டர்கள் நிலவரம், 100 தொழில் ஏகபோக சீட் காலியிடங்கள், பயனர் அடைவு மற்றும் GMV வர்த்தக அளவுகள்.

3. **நேரடி API இணைப்பு & ஆஃப்லைன் ஆதரவு (API & Offline Ready):**
   - நமது Node.js/Express சர்வரான `http://localhost:3000/api/state` உடன் நேரடியாக இணையும்.
   - சர்வர் இல்லாத போதும் முழுமையான டெமோ தரவுகளுடன் (Mock Data) சுமூகமாக இயங்கும்.

---

## 📱 எப்படி இயக்குவது? (How to Run)

### 1. Flutter Web App இயக்குதல்:
டெவலப்மென்ட் மோடில் பிரவுசரில் இயக்க:
```bash
cd flutter_nbn_app
flutter run -d chrome
```
அல்லது நேரடியாக நமது சர்வரில் இருந்து பார்க்க:
👉 **`http://localhost:3000/flutter`**

### 2. Android App (மொபைல் அல்லது எமுலேட்டரில்) இயக்குதல்:
உங்கள் Android போனை USB மூலம் இணைத்து அல்லது Android Emulator திறந்து:
```bash
cd flutter_nbn_app
flutter run
```

### 3. Android APK பில்ட் செய்தல் (Release APK):
வாடிக்கையாளர்கள் மற்றும் வணிகர்களுக்கு பகிர்வதற்கான APK ஃபைலை உருவாக்க:
```bash
cd flutter_nbn_app
flutter build apk --release
```
உருவாகும் APK ஃபைல்:
`flutter_nbn_app/build/app/outputs/flutter-apk/app-release.apk`

---

## 📁 Flutter கோப்பு கட்டமைப்பு (Project Structure)

```text
flutter_nbn_app/
├── lib/
│   ├── main.dart                          --> பிரதான என்ட்ரி பாயிண்ட் (Theme & App Init)
│   ├── core/
│   │   ├── theme.dart                     --> NBN கார்ப்பரேட் நேவி, தங்கம் & பச்சை தீம்
│   │   └── constants.dart                 --> Web & Android API URL மற்றும் தாலுகா பட்டியல்
│   ├── data/
│   │   └── api_service.dart               --> /api/state நேரடி இணைப்பு, கார்ட் & ஆஃப்லைன் தரவு
│   └── ui/
│       └── screens/
│           ├── main_screen.dart           --> Web & Android அடாப்டிவ் லேஅவுட் & கார்ட் ஷீட்
│           ├── gateway_screen.dart        --> NBN நெட்வொர்க்கிங் & மார்க்கெட்பிளேஸ் நுழைவு
│           ├── business_portal_screen.dart--> வணிகர் போர்டல் (34+ உறுப்பினர்கள், லீட்கள் & பரிந்துரைகள்)
│           ├── customer_portal_screen.dart--> வாடிக்கையாளர் தேடல், தேவை சமர்ப்பிப்பு & கார்ட்
│           └── admin_portal_screen.dart   --> மத்திய அட்மின் டேஷ்போர்டு & சாப்டர் கட்டுப்பாட்டகம்
└── pubspec.yaml                           --> Dependencies (http, google_fonts, intl)
```
