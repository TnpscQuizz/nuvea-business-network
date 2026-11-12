const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'public', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

console.log('--- REBUILDING NBN HOME VIEW WITH INTERACTIVE CONNECTED NETWORK MAP ---');

// 1. In render(), make sure case 'home': calls initHomeMap()
code = code.replace(
  "case 'home':\n        container.innerHTML = this.renderHomeView();\n        break;",
  `case 'home':
        container.innerHTML = this.renderHomeView();
        setTimeout(() => this.initHomeMap(), 80);
        break;`
);

// 2. Prepare the new renderHomeView() and initHomeMap()
const newHomeMethods = `
  // ==========================================
  // VIEW: HOME (CONVERSATIONAL, HIGH-CONVERSION & INTERACTIVE NETWORK MAP)
  // ==========================================
  renderHomeView() {
    const isTa = this.lang === 'ta';
    const chapters = this.db.chapters || [];
    const members = this.db.members || [];
    const categories = this.db.categories || [];

    const activeTaluk = this.homeMapTalukFilter || 'harur';
    const activeChapter = chapters.find(c => c.talukId === activeTaluk) || chapters[0] || {};
    const chapMembers = members.filter(m => (m.chapterId || (m.talukId === 'harur' ? 'harur_titans' : \`\${m.talukId}_titans\`)) === activeChapter.id);
    const filledCount = chapMembers.length > 0 ? chapMembers.length : (activeChapter.filledSeats || 22);
    const maxCapacity = activeChapter.capacity === 'unlimited' ? 100 : (parseInt(activeChapter.capacity) || 100);
    const availCount = Math.max(0, maxCapacity - filledCount);
    const utilPct = Math.min(100, Math.round((filledCount / maxCapacity) * 100));

    return \`
      <div class="space-y-8 max-w-6xl mx-auto">
        
        <!-- TOP CATCHY HERO (CONVERSATIONAL BUSINESS OWNER APPEAL) -->
        <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-slate-800 overflow-hidden">
          <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="max-w-3xl space-y-4 relative z-10">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>🔥 உங்கள் பகுதியில் சாப்டர் சேர்க்கை நடப்பில் உள்ளது • 100% மோனோபோலி உரிமை</span>
            </div>

            <h1 class="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              உங்கள் ஏரியாவில் NBN சாப்டர் இருக்கா? <br class="hidden sm:block"/>
              <span class="text-amber-400">காலி சீட் இருக்கான்னு உடனே செக் பண்ணுங்க!</span>
            </h1>

            <p class="text-xs sm:text-base text-slate-300 font-medium leading-relaxed">
              ஒரு ஊர்ல, ஒரு பிசினஸுக்கு <strong>ஒருத்தருக்கு மட்டும்தான் வாய்ப்பு!</strong> சக பிசினஸ் ஓனர்ஸுடன் இணைந்து வாரம் தோறும் புதிய கஸ்டமர்கள் & நேரடி ஆர்டர்களைப் பெறுங்கள். எந்த விளம்பர செலவும் இல்லாம உங்கள் வியாபாரத்தை வளர்க்கலாம்.
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button onclick="app.openApplyModal('\${activeChapter.id}')" class="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition flex items-center gap-2 transform hover:-translate-y-0.5">
                <span>🚀 காலி சீட்டை உடனே புக் பண்ணுங்க (Join Now) ➔</span>
              </button>

              <button onclick="app.openGuestModal('\${activeChapter.id}')" class="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition flex items-center gap-2">
                <span>🎟️ பார்வையாளராக கலந்து கொள்ளுங்கள்</span>
              </button>

              <button onclick="app.scrollToSection('chapter-vacancy-scanner')" class="px-4 py-3.5 bg-transparent hover:bg-white/5 text-amber-300 font-bold text-xs sm:text-sm rounded-2xl border border-amber-400/30 transition flex items-center gap-2">
                <span>🔍 காலி இடங்கள் பட்டியல்</span>
              </button>
            </div>
          </div>
        </div>

        <!-- AREA SELECTOR & CHAPTER VACANCY SCANNER -->
        <div id="chapter-vacancy-scanner" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-brand-50 text-brand-900 border border-brand-200 mb-1.5">
                <span>📍 பகுதி வாரியான சாப்டர் நிலவரம்</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900">
                உங்க தாலுகாவை தேர்வு செய்து காலி இடங்களை பாருங்கள்
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                மேப்பில் கிளிக் செய்தும் பார்க்கலாம் அல்லது கீழே உள்ள பட்டனை அழுத்தவும்.
              </p>
            </div>

            <!-- Area Quick Filter Pills -->
            <div class="flex flex-wrap items-center gap-2 shrink-0">
              \${[
                { id: 'harur', label: 'ஹரூர் (Harur)' },
                { id: 'palacode', label: 'பாலக்கோடு' },
                { id: 'karimangalam', label: 'காரிமங்கலம்' },
                { id: 'dharmapuri_town', label: 'தருமபுரி டவுன்' },
                { id: 'pennagaram', label: 'பென்னாகரம்' }
              ].map(t => \`
                <button 
                  onclick="app.focusHomeMapTaluk('\${t.id}')" 
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition \${activeTaluk === t.id ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                  \${t.label}
                </button>
              \`).join('')}
            </div>
          </div>

          <!-- Active Chapter Vacancy Alert Card -->
          <div class="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-slate-50 rounded-2xl p-5 sm:p-6 border border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 font-mono text-xs font-black">
                  \${activeChapter.code || 'NBN-HAR-01'}
                </span>
                <h3 class="text-xl font-black text-slate-900">
                  \${activeChapter.nameTa || 'ஹரூர் டைட்டன்ஸ் சாப்டர்'}
                </h3>
                <span class="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900">
                  ✓ சேர்க்கை நடப்பில் உள்ளது
                </span>
              </div>

              <p class="text-xs sm:text-sm text-slate-600 font-medium">
                மீட்டிங் நேரம்: <strong class="text-slate-900">\${activeChapter.meetingDay || 'வெள்ளிக்கிழமை'} \${activeChapter.meetingTime || 'காலை 07:30 AM'}</strong> • இடம்: \${activeChapter.meetingVenue || 'ஹரூர் NBN பிசினஸ் சென்டர்'}
              </p>

              <!-- Capacity Utilization Gauge -->
              <div class="pt-2 max-w-md space-y-1.5">
                <div class="flex items-center justify-between text-xs font-bold">
                  <span class="text-slate-700">கொள்ளளவு நிலை:</span>
                  <span class="text-slate-900 font-mono font-black">\${filledCount} / \${maxCapacity} சீட்கள்</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500 bg-amber-500" style="width: \${utilPct}%"></div>
                </div>
                <div class="flex items-center justify-between text-[11px] font-bold">
                  <span class="text-amber-800">\${utilPct}% நிரம்பியது</span>
                  <span class="text-emerald-700 font-black">🔥 இன்னும் \${availCount} இடங்கள் மட்டுமே காலியாக உள்ளது!</span>
                </div>
              </div>
            </div>

            <!-- Instant Category Vacancy Checker -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 shrink-0 max-w-sm w-full">
              <div class="text-xs font-black text-slate-800">
                🔍 உங்க கேட்டகிரி காலியா இருக்கான்னு பாருங்க:
              </div>
              <div class="relative">
                <input 
                  type="text" 
                  id="home-cat-check-input" 
                  oninput="app.checkHomeCategoryVacancy(this.value, '\${activeChapter.id}')"
                  placeholder="எ.கா: சிமெண்ட், இண்டீரியர், எலக்ட்ரிக்கல்..." 
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
              </div>
              <div id="home-cat-check-result" class="text-[11px] font-bold text-slate-500">
                மேலே உங்கள் தொழிலை டைப் செய்து உடனே சோதிக்கவும்.
              </div>
              <button onclick="app.openApplyModal('\${activeChapter.id}')" class="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition text-center">
                இந்த சாப்டரில் சேர விண்ணப்பி ➔
              </button>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- THE HERO MAP: LIVE CONNECTED NETWORK MESH -->
        <!-- ========================================== -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 class="text-xl sm:text-2xl font-black text-slate-900">
                  📍 உங்கள் ஏரியா வணிகர்களின் நேரலை நெட்வொர்க் மேப்
                </h3>
              </div>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">
                சாப்டரில் உள்ள வணிகர்கள் ஒருவருக்கொருவர் பரிந்துரைகள் பரிமாறும் <strong>நேரலை இணைப்பு வரைபடம் (Connected Business Network)</strong>.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black border border-amber-300">
                ★ 100% மோனோபோலி பின்கள்
              </span>
            </div>
          </div>

          <!-- Map Container -->
          <div class="relative rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
            <div id="nbn-home-leaflet-map" style="height: 540px; width: 100%; z-index: 10;"></div>

            <!-- Floating Map Badge Overlay -->
            <div class="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md text-white p-3.5 rounded-2xl border border-slate-800 shadow-xl max-w-xs space-y-1 pointer-events-none">
              <div class="flex items-center gap-2 text-xs font-black text-amber-400">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>இணைக்கப்பட்ட வணிக நெட்வொர்க்</span>
              </div>
              <p class="text-[11px] text-slate-300 leading-tight">
                ஒளிரும் கோடுகள் வணிகர்கள் ஒருவருக்கொருவர் வாடிக்கையாளர்களைப் பரிந்துரைப்பதைக் காட்டுகின்றன.
              </p>
            </div>
          </div>

          <div class="text-[11px] text-slate-500 font-medium flex items-center justify-between pt-1">
            <span>💡 வரைபடத்தில் உள்ள வணிகர்களை கிளிக் செய்து அவர்களின் ஆஃபர் மற்றும் தொடர்பு விவரங்களை அறியலாம்.</span>
            <span class="font-bold text-brand-900">25+ இணைக்கப்பட்ட வணிகர்கள்</span>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- WHAT DO BUSINESS OWNERS GET? (KEY BENEFITS) -->
        <!-- ========================================== -->
        <div class="space-y-6">
          <div class="text-center max-w-3xl mx-auto space-y-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase">
              <span>💎 நேரடி நன்மைகள் (Business Owner Benefits)</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-slate-900">
              NBN-ல் இணைவதால் ஒரு பிசினஸ் ஓனருக்கு என்ன கிடைக்கும்?
            </h2>
            <p class="text-xs sm:text-sm text-slate-600">
              வெறும் வாட்ஸ்அப் குரூப் அல்ல; உங்கள் தாலுகாவில் உங்கள் வணிகத்தை அசைக்க முடியாத சக்தியாக மாற்றும் 6 பிரம்மாண்ட நன்மைகள்:
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <!-- Benefit 1 -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-950 flex items-center justify-center font-black text-2xl shadow-xs">
                🔒
              </div>
              <h3 class="text-base font-black text-slate-900">
                1. 100% மோனோபோலி உரிமை
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed font-medium">
                உங்க ஊர் சாப்டர்ல உங்க பிசினஸ்ல <strong>நீங்க மட்டும்தான் ஒரே ராஜா!</strong> வேற எந்த போட்டியாளரும் உள்ள வர முடியாது. சக 50+ உறுப்பினர்களும் உங்கள் நேரடி விற்பனை தூதர்கள்.
              </p>
            </div>

            <!-- Benefit 2 -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 flex items-center justify-center font-black text-2xl shadow-xs">
                🤝
              </div>
              <h3 class="text-base font-black text-slate-900">
                2. வாரம் தோறும் நேரடி ஆர்டர்கள்
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed font-medium">
                விளம்பர செலவே பண்ண தேவையில்லை! சக பிசினஸ் ஓனர்ஸ் மூலமா வாரம் வாரம் தொடர்ந்து புதிய கஸ்டமர்கள் & பெரிய கொள்முதல் ஆர்டர்கள் உங்கள் கடைக்கு வரும்.
              </p>
            </div>

            <!-- Benefit 3 -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-950 flex items-center justify-center font-black text-2xl shadow-xs">
                ⏱️
              </div>
              <h3 class="text-base font-black text-slate-900">
                3. வாராந்திர 45-செகண்ட் லைவ் பிட்ச்
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed font-medium">
                ஒவ்வொரு வெள்ளிக்கிழமை காலையிலும் மத்த எல்லா பிசினஸ்மேன் முன்னாடியும் உங்க ஸ்பெஷல் ஆஃபர் என்ன, இந்த வாரம் உங்களுக்கு என்ன கஸ்டமர் வேணும்னு நேரடியா பேசி ஆர்டர் எடுக்கலாம்.
              </p>
            </div>

            <!-- Benefit 4 -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-950 flex items-center justify-center font-black text-2xl shadow-xs">
                🛒
              </div>
              <h3 class="text-base font-black text-slate-900">
                4. NBN மார்க்கெட்பிளேஸ் ஆர்டர்கள்
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed font-medium">
                உள்ளூர் மட்டுமில்லாம, மாவட்டம் முழுவதிலும் இருந்து வாடிக்கையாளர்கள் கேட்கும் பெரிய தேவைகளுக்கு கொட்டேஷன் அனுப்பி பெரிய ஆர்டர்களை எடுக்கும் வாய்ப்பு.
              </p>
            </div>

            <!-- Benefit 5 -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-rose-400 hover:shadow-md transition space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-950 flex items-center justify-center font-black text-2xl shadow-xs">
                📲
              </div>
              <h3 class="text-base font-black text-slate-900">
                5. டிஜிட்டல் ஸ்டோர் & QR சான்றிதழ்
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed font-medium">
                வாட்ஸ்அப்பில் கஸ்டமர்களுக்கு ஷேர் பண்ண தனித்துவமான டிஜிட்டல் கார்டு லிங்க் & அரசு மற்றும் NBN அதிகாரப்பூர்வ மோனோபோலி சான்றிதழ் வழங்கப்படும்.
              </p>
            </div>

            <!-- Benefit 6 -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-950 flex items-center justify-center font-black text-2xl shadow-xs">
                💰
              </div>
              <h3 class="text-base font-black text-slate-900">
                6. பூஜ்ஜிய கமிஷன் (0% Commission)
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed font-medium">
                உங்களுக்கு வர்ற எந்த ஆர்டர்களுக்கும் NBN-க்கு ஒரு ரூபாய் கூட கமிஷன் கொடுக்க தேவையில்லை; முழு லாபமும் உங்களுக்கே சேரும்!
              </p>
            </div>

          </div>
        </div>

        <!-- HIGH-CONVERSION BOTTOM CALL TO ACTION -->
        <div class="bg-gradient-to-r from-slate-950 via-brand-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl border border-slate-800">
          <div class="max-w-2xl mx-auto space-y-3">
            <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-white">
              உங்க ஏரியாவில் உள்ள காலி இடத்தை <br class="hidden sm:block"/>
              <span class="text-amber-400">இப்போதே புக் செய்யுங்கள்!</span>
            </h2>
            <p class="text-xs sm:text-sm text-slate-300 font-medium">
              ஒரு முறை இன்னொருவர் புக் செய்துவிட்டால், அந்த சாப்டரில் உங்கள் தொழில் பிரிவுக்கு மீண்டும் இடம் கிடைக்காது. முந்துங்கள்!
            </p>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-4">
            <button onclick="app.openApplyModal('\${activeChapter.id}')" class="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-2xl transition transform hover:scale-105">
              🚀 உறுப்பினர் விண்ணப்பம் சமர்ப்பிக்கவும் ➔
            </button>
            <a href="https://wa.me/917548820641?text=வணக்கம்%20சந்திரா,%20NBN%20சாப்டரில்%20இணைய%20விரும்புகிறேன்." target="_blank" class="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition flex items-center gap-2">
              <span>💬 சந்திராவுடன் (Nuvea Studio) பேசுக</span>
            </a>
          </div>
        </div>

      </div>
    \`;
  }

  // ==========================================
  // HOME INTERACTIVE MAP INITIALIZER WITH ANIMATED CONNECTED NETWORK MESH
  // ==========================================
  initHomeMap() {
    const mapEl = document.getElementById('nbn-home-leaflet-map');
    if (!mapEl || typeof L === 'undefined') return;

    if (this.homeMap) {
      try { this.homeMap.remove(); } catch(e){}
      this.homeMap = null;
    }

    const talukCoords = {
      all: [12.1211, 78.2200],
      harur: [12.0583, 78.4916],
      palacode: [12.2882, 78.0811],
      karimangalam: [12.3082, 78.2045],
      dharmapuri_town: [12.1211, 78.1582],
      pennagaram: [12.1340, 77.8990]
    };

    const targetTaluk = this.homeMapTalukFilter || 'harur';
    const targetCenter = talukCoords[targetTaluk] || talukCoords.harur;
    const targetZoom = targetTaluk === 'all' ? 11 : 14;

    this.homeMap = L.map('nbn-home-leaflet-map').setView(targetCenter, targetZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | Nuvea Business Network'
    }).addTo(this.homeMap);

    setTimeout(() => {
      if (this.homeMap && typeof this.homeMap.invalidateSize === 'function') {
        this.homeMap.invalidateSize();
      }
    }, 150);

    const members = this.db.members || [];
    const chapters = this.db.chapters || [];

    // Group businesses by taluk for network connections
    const talukGroups = {};
    members.forEach(m => {
      if (!m.lat || !m.lng) return;
      const t = (m.talukId || 'harur').toLowerCase();
      if (!talukGroups[t]) talukGroups[t] = [];
      talukGroups[t].push(m);
    });

    // Draw Chapter Hubs & Animated Connected Network Lines
    Object.keys(talukGroups).forEach(talukKey => {
      const center = talukCoords[talukKey] || talukCoords.harur;
      const groupMembers = talukGroups[talukKey];
      const chap = chapters.find(c => c.talukId === talukKey) || {};

      // 1. Chapter Hub Marker with Pulsing Radar
      const hubHtml = \`
        <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
          <div class="radar-hub-circle" style="position: absolute; width: 48px; height: 48px; border-radius: 50%; background: rgba(245, 158, 11, 0.4); border: 2px solid #f59e0b;"></div>
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #0f172a; border: 3px solid #f59e0b; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-weight: 900; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 5;">
            🏛️
          </div>
        </div>
      \`;
      const hubIcon = L.divIcon({
        className: 'chapter-hub-marker',
        html: hubHtml,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });
      L.marker(center, { icon: hubIcon }).addTo(this.homeMap)
        .bindPopup(\`
          <div style="padding: 12px; font-family: sans-serif; min-width: 200px;">
            <div style="font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase;">NBN சாப்டர் தலைமையிடம்</div>
            <div style="font-size: 14px; font-weight: 900; color: #0f172a; margin-top: 2px;">\${chap.nameTa || 'சாப்டர் மையம்'}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">\${groupMembers.length} இணைக்கப்பட்ட வணிகர்கள்</div>
          </div>
        \`);

      // 2. DRAW ANIMATED GLOWING NETWORK LINES FROM HUB TO MEMBERS & PEER-TO-PEER
      groupMembers.forEach((m, idx) => {
        // Line from hub to member
        const lineCoords = [center, [m.lat, m.lng]];
        L.polyline(lineCoords, {
          color: '#f59e0b',
          weight: 2.5,
          opacity: 0.8,
          className: 'animated-network-line'
        }).addTo(this.homeMap);

        // Peer-to-peer line connecting neighboring members in the chapter
        if (idx > 0) {
          const prev = groupMembers[idx - 1];
          L.polyline([[prev.lat, prev.lng], [m.lat, m.lng]], {
            color: '#3b82f6',
            weight: 1.8,
            opacity: 0.65,
            className: 'animated-network-line-blue'
          }).addTo(this.homeMap);
        }

        // 3. Member Instagram-Style Glowing Pin Marker
        const markerHtml = \`
          <div style="background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); width: 44px; height: 44px; border-radius: 50%; padding: 3px; box-shadow: 0 4px 14px rgba(220, 39, 67, 0.45); display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer;">
            <div style="background: white; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; color: #0f3b7a; border: 2px solid white;">
              \${(m.businessName || 'N').charAt(0)}
            </div>
            <div style="position: absolute; bottom: -7px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #dc2743;"></div>
          </div>
        \`;

        const customIcon = L.divIcon({
          className: 'custom-pin-marker',
          html: markerHtml,
          iconSize: [44, 52],
          iconAnchor: [22, 52],
          popupAnchor: [0, -50]
        });

        const cleanPhone = (m.phone || '').replace(/\\D/g, '');
        const waText = encodeURIComponent(\`வணக்கம் \${m.ownerName}, NBN நெட்வொர்க் மேப் மூலம் தொடர்பு கொள்கிறேன்.\`);

        const popupContent = \`
          <div style="padding: 14px; font-family: sans-serif; min-width: 240px; border-radius: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 9px; font-weight: 800; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 6px; border: 1px solid #fde68a;">
                🔒 100% மோனோபோலி
              </span>
              <span style="font-size: 9px; font-weight: 700; color: #059669;">✓ VERIFIED</span>
            </div>
            <div style="font-size: 14px; font-weight: 900; color: #0f172a; line-height: 1.2;">
              \${m.businessName}
            </div>
            <div style="font-size: 11px; color: #64748b; font-weight: 600; margin-top: 2px;">
              உரிமையாளர்: <strong>\${m.ownerName}</strong>
            </div>
            <div style="font-size: 11px; font-weight: 800; color: #b45309; margin-top: 4px;">
              \${m.category || m.categoryId}
            </div>
            \${m.specialOffer ? \`
              <div style="font-size: 10px; color: #334155; background: #f8fafc; padding: 6px; border-radius: 8px; margin-top: 6px; border: 1px solid #e2e8f0;">
                🎁 \${m.specialOffer}
              </div>
            \` : ''}
            <div style="margin-top: 10px; display: flex; gap: 6px;">
              <a href="https://wa.me/\${cleanPhone}?text=\${waText}" target="_blank" style="flex: 1; background: #16a34a; color: white; padding: 6px; border-radius: 8px; font-size: 11px; font-weight: 800; text-align: center; text-decoration: none;">
                💬 வாட்ஸ்அப்
              </a>
              <button onclick="app.openStandaloneBiz('\${m.id}')" style="flex: 1; background: #0f172a; color: white; padding: 6px; border-radius: 8px; font-size: 11px; font-weight: 700; text-align: center; border: none; cursor: pointer;">
                விவரம் ➔
              </button>
            </div>
          </div>
        \`;

        L.marker([m.lat, m.lng], { icon: customIcon }).addTo(this.homeMap)
          .bindPopup(popupContent);
      });
    });
  }

  focusHomeMapTaluk(talukId) {
    this.homeMapTalukFilter = talukId;
    this.render();

    const talukCoords = {
      all: [12.1211, 78.2200],
      harur: [12.0583, 78.4916],
      palacode: [12.2882, 78.0811],
      karimangalam: [12.3082, 78.2045],
      dharmapuri_town: [12.1211, 78.1582],
      pennagaram: [12.1340, 77.8990]
    };

    if (this.homeMap && talukCoords[talukId]) {
      this.homeMap.flyTo(talukCoords[talukId], 14, { duration: 1.2 });
    }
  }

  checkHomeCategoryVacancy(catQuery, chapterId) {
    const q = (catQuery || '').toLowerCase().trim();
    const resultEl = document.getElementById('home-cat-check-result');
    if (!resultEl) return;

    if (!q) {
      resultEl.innerHTML = 'மேலே உங்கள் தொழிலை டைப் செய்து உடனே சோதிக்கவும்.';
      resultEl.className = 'text-[11px] font-bold text-slate-500';
      return;
    }

    const members = (this.db.members || []).filter(m => (m.chapterId || (m.talukId === 'harur' ? 'harur_titans' : \`\${m.talukId}_titans\`)) === chapterId);
    const categories = this.db.categories || [];

    const isOccupied = members.some(m => {
      const catObj = categories.find(c => c.id === m.categoryId) || {};
      const catTa = (catObj.nameTa || '').toLowerCase();
      const catEn = (catObj.nameEn || '').toLowerCase();
      return (m.category || '').toLowerCase().includes(q) || (m.categoryId || '').toLowerCase().includes(q) || catTa.includes(q) || catEn.includes(q);
    });

    if (isOccupied) {
      resultEl.innerHTML = '🔒 <strong>இந்த சாப்டரில் இந்த தொழில் ஏற்கனவே லாக் செய்யப்பட்டுள்ளது!</strong> மாற்று சாப்டரில் விண்ணப்பிக்கவும்.';
      resultEl.className = 'text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200';
    } else {
      resultEl.innerHTML = '✅ <strong>இந்த தொழில் இந்த சாப்டரில் காலியாக உள்ளது!</strong> உடனே விண்ணப்பித்து இடத்தை லாக் செய்யுங்கள்.';
      resultEl.className = 'text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200';
    }
  }

  scrollToSection(elemId) {
    const el = document.getElementById(elemId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
`;

// Replace renderHomeView() in public/js/app.js
const startIdx = code.indexOf('renderHomeView() {');
const endIdx = code.indexOf('renderChaptersView() {');

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + newHomeMethods + '\n  // ==========================================\n  // VIEW: CHAPTERS\n  // ==========================================\n  ' + code.substring(endIdx);
  fs.writeFileSync(appJsPath, code, 'utf8');
  console.log('✓ Successfully injected transformed Home View with interactive animated network map');
} else {
  console.error('Could not find renderHomeView slice in app.js');
}
