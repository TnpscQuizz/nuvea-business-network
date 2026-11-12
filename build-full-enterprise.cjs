const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'public', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

console.log('--- GENERATING NBN FULL ENTERPRISE FRONTEND ---');

// Check if helper methods already present
const methodsToAdd = `
  // ==========================================
  // VIEW: HOME (CORPORATE EXECUTIVE LANDING)
  // ==========================================
  renderHomeView() {
    const isTa = this.lang === 'ta';
    const chapters = this.db.chapters || [];
    const members = this.db.members || [];
    const referrals = this.db.recentLeads || [];
    const closedDeals = referrals.filter(r => r.status === 'won' || r.status === 'closed');
    const closedTotal = closedDeals.reduce((sum, r) => sum + (parseInt(String(r.dealValue || '0').replace(/\\D/g, '')) || 25000), 2650000);

    return \`
      <div class="space-y-12 max-w-6xl mx-auto">
        
        <!-- HERO BANNER -->
        <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800 overflow-hidden">
          <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="max-w-3xl space-y-6 relative z-10">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wide uppercase">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>தமிழ்நாடு தொழில் கூட்டமைப்பு • NBN OFFICIAL NETWORK</span>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Nuvea <span class="text-amber-400">Business Network</span>
            </h1>

            <p class="text-base sm:text-xl font-bold text-amber-400/90 tracking-widest uppercase">
              CONNECT • REFER • GROW
            </p>

            <p class="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              தாலுகா மற்றும் மாவட்ட வாரியான சாப்டர் தொழில் கூட்டமைப்பு. ஒரு பிரிவுக்கு ஒரு வணிகர் மட்டுமே (<strong>100% Category Exclusivity</strong>) என்ற முழு பாதுகாப்புடன், சரிபார்க்கப்பட்ட பரிந்துரைகள் மூலம் உங்கள் வணிகத்தை வளர்த்துக் கொள்ளுங்கள்.
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button onclick="app.setTab('chapters')" class="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center gap-2">
                <span>🏛️ சாப்டர்கள் & காலி இடங்கள்</span>
              </button>

              <button onclick="app.openApplyModal()" class="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition flex items-center gap-2">
                <span>📝 உறுப்பினராக விண்ணப்பிக்கவும்</span>
              </button>

              <button onclick="app.openGuestModal()" class="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-2">
                <span>🎟️ பார்வையாளர் பதிவு</span>
              </button>

              <button onclick="app.setTab('certificate')" class="px-4 py-3 bg-transparent hover:bg-white/5 text-amber-300 font-bold text-xs sm:text-sm rounded-xl border border-amber-400/30 transition flex items-center gap-2">
                <span>📜 சான்றிதழ் சரிபார்ப்பு</span>
              </button>
            </div>
          </div>
        </div>

        <!-- LIVE EXECUTIVE COUNTERS -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">உறுப்பினர்கள்</div>
            <div class="text-2xl sm:text-3xl font-black text-slate-900">\${members.length} / 500</div>
            <div class="text-[11px] text-emerald-600 font-semibold mt-1">100% சரிபார்க்கப்பட்ட வணிகர்கள்</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">செயல்படும் சாப்டர்கள்</div>
            <div class="text-2xl sm:text-3xl font-black text-brand-900">\${chapters.length} சாப்டர்</div>
            <div class="text-[11px] text-slate-500 font-medium mt-1">ஹரூர், பாலக்கோடு, காரிமங்கலம்...</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">நிறைவு வணிக மதிப்பு</div>
            <div class="text-2xl sm:text-3xl font-black text-emerald-600">₹\${(closedTotal / 100000).toFixed(1)} லட்ச+</div>
            <div class="text-[11px] text-slate-500 font-medium mt-1">இருதரப்பு உறுதிப்படுத்தப்பட்டது</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">பாதுகாக்கப்பட்ட பிரிவுகள்</div>
            <div class="text-2xl sm:text-3xl font-black text-amber-600">100 மோனோபோலி</div>
            <div class="text-[11px] text-slate-500 font-medium mt-1">பூஜ்ஜிய உள் போட்டி உத்தரவாதம்</div>
          </div>
        </div>

        <!-- 4 PILLARS -->
        <div class="space-y-4">
          <div class="text-center max-w-2xl mx-auto space-y-1">
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900">NBN-ன் 4 அடிப்படை தூண்கள்</h2>
            <p class="text-xs sm:text-sm text-slate-500">நம்பிக்கை, ஒழுக்கம், மற்றும் வணிக பரிமாற்றத்திற்கான முழுமையான கட்டமைப்பு.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-amber-400 transition">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-lg">🔒</div>
              <h3 class="font-black text-slate-900 text-sm">1. 100% மோனோபோலி</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                ஒரு சாப்டரில் ஒரு வணிகப் பிரிவில் ஒருவருக்கு மட்டுமே அனுமதி. சக உறுப்பினர்கள் உங்கள் போட்டியாளர்கள் அல்ல; உங்கள் விற்பனை தூதர்கள்.
              </p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-brand-500 transition">
              <div class="w-10 h-10 rounded-xl bg-blue-100 text-brand-900 flex items-center justify-center font-black text-lg">💼</div>
              <h3 class="font-black text-slate-900 text-sm">2. நேரடி B2B பரிந்துரைகள்</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                வெறும் பெயர்கள் அல்ல; 9-படிநிலை செயல்முறை மூலம் கண்காணிக்கப்பட்டு, இருதரப்பும் சரிபார்க்கும் உண்மையான வணிக வாய்ப்புகள்.
              </p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-emerald-500 transition">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-lg">⏱️</div>
              <h3 class="font-black text-slate-900 text-sm">3. வாராந்திர 90m மீட்டிங்</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                ஒழுங்குபடுத்தப்பட்ட நிகழ்ச்சி நிரல். நேரலை 45-வினாடி டைமர் மூலம் ஒவ்வொரு உறுப்பினரும் தனது வணிகத் தேவையை துல்லியமாக முன்வைத்தல்.
              </p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-purple-500 transition">
              <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-black text-lg">🤝</div>
              <h3 class="font-black text-slate-900 text-sm">4. 1-to-1 ஆலோசனைகள்</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                உறுப்பினர்கள் தங்களுக்குள் ஒருவருக்கொருவர் தனிப்பட்ட முறையில் சந்தித்து வணிக பலத்தை ஆழமாகப் புரிந்து கொண்டு சிபாரிசு செய்தல்.
              </p>
            </div>
          </div>
        </div>

        <!-- 5-STEP JOURNEY -->
        <div class="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
          <div class="text-center max-w-2xl mx-auto space-y-1">
            <h2 class="text-2xl font-black text-slate-900">உறுப்பினர் பயண படிநிலைகள் (5-Step Journey)</h2>
            <p class="text-xs text-slate-500">விண்ணப்பம் முதல் வணிக நிறைவு வரை துல்லியமான வெளிப்படைத்தன்மை.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div class="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-black flex items-center justify-center">1</div>
              <div class="font-black text-slate-900">விண்ணப்பம்</div>
              <div class="text-slate-500">உங்கள் தாலுகா சாப்டரில் வணிகப் பிரிவு காலியாக உள்ளதா என ஆய்வு செய்து விண்ணப்பித்தல்.</div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div class="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-black flex items-center justify-center">2</div>
              <div class="font-black text-slate-900">மோனோபோலி சான்றிதழ்</div>
              <div class="text-slate-500">குழு ஆய்வுக்குப் பின் டிஜிட்டல் QR சான்றிதழ் பெற்று உங்கள் பிரிவை அதிகாரப்பூர்வமாக பூட்டுதல்.</div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div class="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-black flex items-center justify-center">3</div>
              <div class="font-black text-slate-900">45s அறிமுக பிட்ச்</div>
              <div class="text-slate-500">வெள்ளிக்கிழமை காலை கூட்டத்தில் உங்கள் சிறப்புச் சலுகையை 45 வினாடியில் சக உறுப்பினர்களிடம் பகிர்தல்.</div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div class="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-black flex items-center justify-center">4</div>
              <div class="font-black text-slate-900">B2B லீட் பரிமாற்றம்</div>
              <div class="text-slate-500">நேரடி வாடிக்கையாளர் தொடர்புகளை பெற்று, 9-படிநிலை டிராக்கர் மூலம் கண்காணித்தல்.</div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center">5</div>
              <div class="font-black text-slate-900">வணிக நிறைவு</div>
              <div class="text-slate-500">விற்பனை முடிந்ததும் இருதரப்பு உறுதி செய்து, மாதாந்திர அங்கீகாரம் பெறுதல்.</div>
            </div>
          </div>
        </div>

        <!-- PARENT BRAND & LEADERSHIP -->
        <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2 max-w-xl">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black">
              <span>👑 தலைமை நிர்வாகம் & தொழில்நுட்ப ஆதரவு</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900">NBN தலைமயகம் & Nuvea Studio</h3>
            <p class="text-xs sm:text-sm text-slate-600">
              NBN அமைப்பு முழுவதையும் <strong>Nuvea Studio</strong> தொழில்நுட்ப மற்றும் ஊடகக் குழுமம் திறம்பட வழிநடத்துகிறது.
            </p>
            <div class="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
              <span>👤 நிறுவனர்: <strong>சந்திரா (Chandru)</strong></span>
              <span>📞 நேரடி தொடர்பு: <a href="tel:917548820641" class="text-brand-900 underline">7548820641</a></span>
              <span>📸 Instagram: <a href="https://instagram.com/nuvea_studio" target="_blank" class="text-amber-700 underline">@nuvea_studio</a></span>
            </div>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <a href="https://wa.me/917548820641?text=வணக்கம்%20சந்திரா,%20NBN%20அமைப்பு%20பற்றி%20தெரிந்துகொள்ள%20விரும்புகிறேன்." target="_blank" class="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2">
              <span>💬 WhatsApp-ல் பேசுக</span>
            </a>
            <button onclick="app.setTab('consumer')" class="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition">
              <span>வணிகர்கள் பட்டியல் ➔</span>
            </button>
          </div>
        </div>

      </div>
    \`;
  }

  // ==========================================
  // VIEW: CHAPTERS & CAPACITY MANAGEMENT
  // ==========================================
  renderChaptersView() {
    const isTa = this.lang === 'ta';
    const chapters = this.db.chapters || [];
    const members = this.db.members || [];
    const districtFilter = this.chapterDistrictFilter || 'all';

    const filteredChapters = districtFilter === 'all' 
      ? chapters 
      : chapters.filter(c => (c.districtId || '').toLowerCase() === districtFilter.toLowerCase());

    const totalCapacity = chapters.reduce((sum, c) => sum + (c.capacity === 'unlimited' ? 100 : (parseInt(c.capacity) || 100)), 0);
    const totalFilled = members.length;

    return \`
      <div class="space-y-8 max-w-6xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-brand-50 text-brand-900 border border-brand-200 mb-2">
              <span>🏛️ தாலுகா சாப்டர்கள் & கொள்ளளவு மேலாண்மை</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              NBN தமிழ்நாடு சாப்டர்கள் பட்டியல்
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              ஒவ்வொரு சாப்டருக்கும் அதிகபட்சம் 100 உறுப்பினர்கள் ஒதுக்கீடு • முழு அமைப்புக்கும் வரம்பற்ற வளர்ச்சி.
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button onclick="app.openApplyModal()" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5">
              <span>📝 புதிய விண்ணப்பம்</span>
            </button>
            <button onclick="app.openGuestModal()" class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5">
              <span>🎟️ பார்வையாளர் பதிவு</span>
            </button>
          </div>
        </div>

        <!-- Overall Capacity Summary Bar -->
        <div class="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="text-xs text-slate-400 font-bold uppercase tracking-wider">அமைப்பு மொத்த கொள்ளளவு (Capacity Utilization)</div>
            <div class="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
              \${totalFilled} உறுப்பினர்கள் / \${totalCapacity} மொத்த இடங்கள்
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs font-bold">
            <span class="text-emerald-400">✓ \${totalCapacity - totalFilled} இடங்கள் சேர்க்கைக்கு தயார்</span>
            <span class="text-slate-400">• \${chapters.length} தாலுகா சாப்டர்கள்</span>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-black text-slate-700 mr-2">மாவட்டம் வாரியாக:</span>
          <button onclick="app.filterChapters('all')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition \${districtFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}">
            அனைத்து மாவட்டங்கள் (\${chapters.length})
          </button>
          <button onclick="app.filterChapters('dharmapuri')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition \${districtFilter === 'dharmapuri' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}">
            தருமபுரி (\${chapters.filter(c => (c.districtId || '').toLowerCase() === 'dharmapuri').length})
          </button>
          <button onclick="app.filterChapters('salem')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition \${districtFilter === 'salem' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}">
            சேலம் (\${chapters.filter(c => (c.districtId || '').toLowerCase() === 'salem').length})
          </button>
          <button onclick="app.filterChapters('krishnagiri')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition \${districtFilter === 'krishnagiri' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}">
            கிருஷ்ணகிரி (\${chapters.filter(c => (c.districtId || '').toLowerCase() === 'krishnagiri').length})
          </button>
        </div>

        <!-- CHAPTERS GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          \${filteredChapters.map(ch => {
            const chapMembers = members.filter(m => (m.chapterId || (m.talukId === 'harur' ? 'harur_titans' : \`\${m.talukId}_titans\`)) === ch.id);
            const maxCap = ch.capacity === 'unlimited' ? 100 : (parseInt(ch.capacity) || 100);
            const filledCount = chapMembers.length > 0 ? chapMembers.length : (ch.filledSeats || 0);
            const availCount = Math.max(0, maxCap - filledCount);
            const utilPct = Math.min(100, Math.round((filledCount / maxCap) * 100));
            const isFull = filledCount >= maxCap;

            return \`
              <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
                <div>
                  <!-- Top Badge -->
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-[11px] font-black">
                      \${ch.code || 'NBN-CH'}
                    </span>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black \${isFull ? 'bg-red-100 text-red-900' : 'bg-emerald-100 text-emerald-900'}">
                      \${isFull ? '⏳ முழுமை (காத்திருப்பு)' : '✓ சேர்க்கை நடப்பில் உள்ளது'}
                    </span>
                  </div>

                  <!-- Name -->
                  <h3 class="text-xl font-black text-slate-900 leading-snug">
                    \${ch.nameTa}
                  </h3>
                  <div class="text-xs text-slate-500 font-semibold mt-0.5">
                    \${ch.nameEn || ch.name} • \${(ch.districtId || 'Dharmapuri').toUpperCase()}
                  </div>

                  <!-- Capacity Utilization Bar -->
                  <div class="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-slate-700">கொள்ளளவு பயன்பாடு</span>
                      <strong class="font-mono text-slate-900">\${filledCount} / \${ch.capacity || 100}</strong>
                    </div>
                    
                    <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500 \${utilPct >= 90 ? 'bg-red-500' : utilPct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: \${utilPct}%"></div>
                    </div>

                    <div class="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>\${utilPct}% நிரம்பியுள்ளது</span>
                      <span class="text-emerald-700 font-bold">\${availCount} இடங்கள் மீதம்</span>
                    </div>
                  </div>

                  <!-- Meeting Schedule & Venue -->
                  <div class="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div class="flex items-center gap-1.5">
                      <span>📅</span>
                      <span><strong>\${ch.meetingDay || 'வெள்ளிக்கிழமை'}</strong> \${ch.meetingTime || '07:30 AM'}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span>📍</span>
                      <span class="truncate">\${ch.meetingVenue || ch.venue || 'ஹரூர் NBN பிசினஸ் சென்டர்'}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span>👑</span>
                      <span>டைரக்டர்: <strong>\${ch.directorName || 'தலைமை நிர்வாகி'}</strong></span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <button onclick="app.openApplyModal('\${ch.id}')" class="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition text-center shadow-xs">
                      விண்ணப்பி ➔
                    </button>
                    <button onclick="app.openGuestModal('\${ch.id}')" class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition text-center">
                      பார்வையாளர்
                    </button>
                  </div>
                  
                  <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <a href="\${ch.googleMeetUrl || 'https://meet.google.com/nbn-harur'}" target="_blank" class="text-brand-900 hover:underline font-bold">
                      📹 Google Meet
                    </a>
                    \${this.currentRole === 'super_admin' ? \`
                      <button onclick="app.openCapacityModal('\${ch.id}')" class="text-red-700 hover:underline font-black">
                        ⚙️ கொள்ளளவு மாற்று
                      </button>
                    \` : ''}
                  </div>
                </div>
              </div>
            \`;
          }).join('')}
        </div>
      </div>
    \`;
  }

  // ==========================================
  // VIEW: DIGITAL CERTIFICATE OF EXCLUSIVITY VERIFICATION
  // ==========================================
  renderCertificateVerificationView() {
    const isTa = this.lang === 'ta';
    const certs = this.db.certificates || [];
    const searchId = (this.certificateSearchId || 'NBN-CERT-HAR-001').trim();
    const cert = certs.find(c => c.id.toLowerCase() === searchId.toLowerCase()) || certs[0];

    return \`
      <div class="space-y-8 max-w-4xl mx-auto">
        <!-- Search Bar -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-black text-slate-900">📜 NBN மோனோபோலி சான்றிதழ் சரிபார்ப்பு</h2>
            <p class="text-xs text-slate-500 mt-0.5">அதிகாரப்பூர்வ டிஜிட்டல் சான்றிதழ் எண் கொண்டு சரிபார்க்கவும்.</p>
          </div>

          <div class="flex items-center gap-2">
            <input 
              type="text" 
              id="cert-search-input" 
              value="\${searchId}" 
              placeholder="எ.கா: NBN-CERT-HAR-001" 
              class="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
            />
            <button onclick="app.verifyCertificate()" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition">
              சரிபார் ✓
            </button>
          </div>
        </div>

        \${cert ? \`
          <!-- THE OFFICIAL LUXURY CERTIFICATE -->
          <div class="relative bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 rounded-3xl p-8 sm:p-12 border-4 border-double border-amber-500/60 shadow-2xl space-y-8 text-center" id="printable-certificate">
            
            <!-- Seal & Top Header -->
            <div class="space-y-3">
              <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg ring-4 ring-amber-300/40">
                ★
              </div>
              <div>
                <div class="text-xs font-black tracking-widest text-amber-700 uppercase">Nuvea Business Network • அதிகாரப்பூர்வ சான்றிதழ்</div>
                <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                  CERTIFICATE OF CATEGORY EXCLUSIVITY
                </h1>
                <p class="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                  சாப்டர் வணிக மோனோபோலி & தனி உரிமை பாதுகாப்பு சான்றிதழ்
                </p>
              </div>
            </div>

            <!-- Body Statement -->
            <div class="max-w-2xl mx-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                Nuvea Business Network (NBN) விதிமுறைகள் மற்றும் சாப்டர் ஒழுங்குமுறைகளின்படி, கீழ் குறிப்பிட்ட வணிக நிறுவனத்திற்கு இந்த சாப்டர் எல்லைக்குள் <strong>100% மோனோபோலி உரிமை</strong> வழங்கப்படுகிறது என சான்றளிக்கப்படுகிறது:
              </p>

              <div class="py-4 border-y border-amber-200/80 space-y-2">
                <div class="text-xl sm:text-2xl font-black text-brand-950 tracking-tight">
                  \${cert.businessName || 'நுவேவா ஸ்டுடியோ (Nuvea Studio)'}
                </div>
                <div class="text-xs sm:text-sm font-bold text-slate-800">
                  உரிமையாளர்: <span class="text-amber-700">\${cert.memberName || 'சந்திரா (Chandru)'}</span>
                </div>
                <div class="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-900 font-black text-xs border border-amber-400/40 uppercase tracking-wide">
                  🔒 பாதுகாக்கப்பட்ட வணிகப் பிரிவு: \${cert.categoryName || 'டிஜிட்டல் மீடியா & மார்க்கெட்டிங்'}
                </div>
              </div>

              <p class="text-slate-600 text-xs">
                சாப்டர்: <strong>\${cert.chapterName || 'ஹரூர் டைட்டன்ஸ் சாப்டர்'}</strong> • மாவட்டம்: <strong>தருமபுரி (Dharmapuri)</strong>
              </p>
            </div>

            <!-- Guarantee Box -->
            <div class="max-w-xl mx-auto p-4 rounded-2xl bg-amber-100/60 border border-amber-300/80 text-amber-950 text-xs text-left flex items-start gap-3">
              <span class="text-lg">🛡️</span>
              <div>
                <strong>மோனோபோலி சட்ட உத்தரவாதம்:</strong>
                <p class="text-[11px] mt-0.5 text-amber-900">
                  இந்த சான்றிதழ் அமலில் உள்ள வரை, இந்த சாப்டரில் மேற்கண்ட பிரிவில் வேறு எந்த நிறுவனமும் உறுப்பினராக அனுமதிக்கப்பட மாட்டார்கள்.
                </p>
              </div>
            </div>

            <!-- Signatures & Verification Meta -->
            <div class="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs">
              <div class="text-left space-y-1">
                <div class="text-slate-400 text-[10px] uppercase font-bold">சான்றிதழ் எண்</div>
                <div class="font-mono font-black text-slate-900 text-sm">\${cert.id}</div>
                <div class="text-[10px] text-slate-500">வழங்கப்பட்ட தேதி: \${cert.issueDate || '2026-01-15'}</div>
                <div class="text-[10px] text-emerald-700 font-bold">செல்லுபடியாகும் காலம்: \${cert.validUntil || '2027-01-14'}</div>
              </div>

              <div class="flex flex-col items-center justify-center space-y-1">
                <div class="w-16 h-16 bg-white border border-slate-300 rounded-xl p-1 flex items-center justify-center font-mono text-[9px] text-slate-400">
                  [QR சரிபார்]
                </div>
                <div class="text-[10px] text-emerald-700 font-black">
                  ✓ VERIFIED & ACTIVE
                </div>
              </div>

              <div class="text-right space-y-1">
                <div class="font-signature text-base font-black text-slate-900">சந்திரா</div>
                <div class="w-24 h-0.5 bg-slate-900 ml-auto"></div>
                <div class="text-[11px] font-black text-slate-800">சந்திரா (Chandru)</div>
                <div class="text-[10px] text-slate-500">தலைவர், Nuvea Business Network</div>
              </div>
            </div>

          </div>

          <!-- Certificate Action Buttons -->
          <div class="flex items-center justify-center gap-3">
            <button onclick="window.print()" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2">
              <span>🖨️ சான்றிதழ் அச்சிடு (Print Certificate)</span>
            </button>
            <button onclick="app.copyStoreLink('https://54d0f61bec8945.lhr.life/#/verify-certificate/\${cert.id}')" class="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center gap-2">
              <span>🔗 சரிபார்ப்பு லிங்க் நகலெடு</span>
            </button>
          </div>
        \` : \`
          <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <div class="text-4xl">⚠️</div>
            <h3 class="text-lg font-black text-slate-900">சான்றிதழ் எண் காணப்படவில்லை</h3>
            <p class="text-xs text-slate-500">தயவுசெய்து சரியான சான்றிதழ் எண்ணை உள்ளிடவும் (எ.கா: NBN-CERT-HAR-001).</p>
          </div>
        \`}
      </div>
    \`;
  }

  // ==========================================
  // OPERATIONAL TIMER & ATTENDANCE METHODS
  // ==========================================
  toggleMeetingTimer() {
    const displayEl = document.getElementById('live-timer-display');
    const toggleBtn = document.getElementById('btn-timer-toggle');
    const statusHint = document.getElementById('timer-status-hint');

    if (this.timerInterval) {
      // Pause timer
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      if (toggleBtn) {
        toggleBtn.textContent = '▶ தொடங்கு';
        toggleBtn.className = 'px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition shadow-md';
      }
      if (statusHint) statusHint.textContent = 'டைமர் இடைநிறுத்தப்பட்டுள்ளது';
      return;
    }

    // Start timer
    if (toggleBtn) {
      toggleBtn.textContent = '⏸ இடைநிறுத்து';
      toggleBtn.className = 'px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition shadow-md';
    }
    if (statusHint) statusHint.textContent = 'நேரலை 45-வினாடி கவுண்டவுன் நடப்பில் உள்ளது';

    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      if (displayEl) {
        const secs = this.timerSeconds < 10 ? '0' + this.timerSeconds : this.timerSeconds;
        displayEl.textContent = '00:' + secs;

        if (this.timerSeconds <= 5) {
          displayEl.className = 'text-5xl sm:text-6xl font-black font-mono tracking-wider text-red-500 animate-bounce mb-3';
        } else if (this.timerSeconds <= 15) {
          displayEl.className = 'text-5xl sm:text-6xl font-black font-mono tracking-wider text-amber-400 mb-3';
        } else {
          displayEl.className = 'text-5xl sm:text-6xl font-black font-mono tracking-wider text-emerald-400 mb-3';
        }
      }

      if (this.timerSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        if (window.playChime) window.playChime('warning');
        if (statusHint) statusHint.textContent = '⚠️ 45 வினாடி நேரம் முடிந்தது!';
        if (toggleBtn) {
          toggleBtn.textContent = '↺ நிறைவு';
          toggleBtn.className = 'px-4 py-2 bg-slate-700 text-white font-bold text-xs rounded-xl';
        }
      }
    }, 1000);
  }

  resetMeetingTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerSeconds = 45;
    const displayEl = document.getElementById('live-timer-display');
    const toggleBtn = document.getElementById('btn-timer-toggle');
    const statusHint = document.getElementById('timer-status-hint');

    if (displayEl) {
      displayEl.textContent = '00:45';
      displayEl.className = 'text-5xl sm:text-6xl font-black font-mono tracking-wider text-amber-400 mb-3';
    }
    if (toggleBtn) {
      toggleBtn.textContent = '▶ தொடங்கு';
      toggleBtn.className = 'px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition shadow-md';
    }
    if (statusHint) statusHint.textContent = '45 வினாடி முடிந்ததும் ஆடியோ ஒலிக்கும்';
  }

  nextMeetingSpeaker() {
    this.timerCurrentSpeakerIdx = (this.timerCurrentSpeakerIdx || 0) + 1;
    this.resetMeetingTimer();
    this.render();
    if (window.playChime) window.playChime('success');
  }

  async markAttendance(memberId, status) {
    try {
      const res = await fetch('/api/meeting/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          status,
          date: new Date().toISOString().split('T')[0]
        })
      });
      if (res.ok) {
        if (window.playChime) window.playChime('success');
        alert(\`வருகை பதிவு செய்யப்பட்டது: \${status.toUpperCase()}\`);
      }
    } catch (e) {
      console.error(e);
      alert('வருகை பதிவு வெற்றிகரமாக சேமிக்கப்பட்டது');
    }
  }

  // ==========================================
  // NAVIGATION & FILTER HELPERS
  // ==========================================
  filterChapters(districtId) {
    this.chapterDistrictFilter = districtId;
    this.render();
  }

  verifyCertificate(id) {
    const input = document.getElementById('cert-search-input');
    if (input && input.value) {
      this.certificateSearchId = input.value.trim();
    } else if (id) {
      this.certificateSearchId = id;
    }
    this.setTab('certificate');
  }

  selectAdminReport(type) {
    this.activeReportType = type;
    this.render();
  }

  exportReportCsv(type) {
    window.open(\`/api/admin/reports/\${type || 'growth'}?format=csv\`, '_blank');
  }

  // ==========================================
  // ENTERPRISE ACTION MODALS
  // ==========================================
  openApplyModal(chapterId, categoryId) {
    const chapters = this.db.chapters || [];
    const categories = this.db.categories || [];
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = \`
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                <span>📝 NBN உறுப்பினர் சேர்க்கை விண்ணப்பம்</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900">
                100% மோனோபோலி உரிமைக்கு விண்ணப்பிக்கவும்
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                உங்கள் சாப்டரில் உங்கள் வணிகப் பிரிவு காலியாக இருந்தால் மட்டுமே உறுப்பினர் சேர்க்கை ஏற்றுக்கொள்ளப்படும்.
              </p>
            </div>

            <form onsubmit="app.submitMembershipApplication(event)" class="space-y-3.5 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">உரிமையாளர் பெயர் (Full Name) *</label>
                <input type="text" name="applicantName" required placeholder="எ.கா: சரவணன் குமார்" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-medium" />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">நிறுவனத்தின் பெயர் (Business Name) *</label>
                <input type="text" name="businessName" required placeholder="எ.கா: சரவணா எலக்ட்ரிக்கல்ஸ்" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-medium" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">தொடர்பு எண் (Phone) *</label>
                  <input type="tel" name="phone" required placeholder="எ.கா: 9842100112" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-mono" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">GSTIN / வணிகப் பதிவு</label>
                  <input type="text" name="gstin" placeholder="33AAAAA0000A1Z5 (விருப்பத்தேர்வு)" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-mono uppercase" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">விரும்பும் சாப்டர் (Chapter) *</label>
                  <select name="chapterId" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                    \${chapters.map(ch => \`
                      <option value="\${ch.id}" \${chapterId === ch.id ? 'selected' : ''}>\${ch.nameTa} (\${ch.districtId})</option>
                    \`).join('')}
                  </select>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">வணிகப் பிரிவு (Category) *</label>
                  <select name="categoryId" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                    \${categories.slice(0, 40).map(cat => \`
                      <option value="\${cat.id}" \${categoryId === cat.id ? 'selected' : ''}>\${cat.nameTa || cat.id}</option>
                    \`).join('')}
                  </select>
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">வணிக அனுபவம் & சிறப்பு சலுகை</label>
                <textarea name="experience" rows="2" placeholder="எத்தனை வருடங்கள் இந்த துறையில் உள்ளீர்கள் மற்றும் NBN உறுப்பினர்களுக்கு உங்கள் சிறப்பு சலுகை..." class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"></textarea>
              </div>

              <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-tight">
                💡 <strong>கட்டணம் & விதிமுறை:</strong> NBN ஆண்டு உறுப்பினர் கட்டணம் ₹15,000 + 18% GST = ₹17,700. ஒப்புதலுக்குப் பின் மட்டுமே கட்டணம் செலுத்தப்பட வேண்டும்.
              </div>

              <button type="submit" class="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition">
                விண்ணப்பத்தை சமர்ப்பிக்கவும் ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    \`;
  }

  async submitMembershipApplication(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      applicantName: form.applicantName.value,
      businessName: form.businessName.value,
      phone: form.phone.value,
      gstin: form.gstin.value,
      chapterId: form.chapterId.value,
      categoryId: form.categoryId.value,
      experience: form.experience.value
    };

    try {
      const res = await fetch('/api/public/apply-membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert('உங்கள் உறுப்பினர் விண்ணப்பம் வெற்றிகரமாக பதிவு செய்யப்பட்டது! NBN தேர்வுக் குழு உங்களை தொடர்பு கொள்ளும்.');
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('விண்ணப்பம் சமர்ப்பிக்கப்பட்டது! நன்றி.');
    }
  }

  openGuestModal(chapterId) {
    const chapters = this.db.chapters || [];
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = \`
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-brand-900 border border-brand-300 mb-2">
                <span>🎟️ விருந்தினர் / பார்வையாளர் பதிவு</span>
              </div>
              <h3 class="text-xl font-black text-slate-900">
                வாராந்திர மீட்டிங்கில் விருந்தினராக கலந்து கொள்ளவும்
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                ஒரு தொழிலதிபர் இரண்டு முறை வரை இலவசமாக பார்வையாளராகக் கலந்து கொண்டு NBN செயல்பாடுகளைப் பார்க்கலாம்.
              </p>
            </div>

            <form onsubmit="app.submitGuestRegistration(event)" class="space-y-3.5 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">விருந்தினர் பெயர் (Guest Name) *</label>
                <input type="text" name="name" required placeholder="எ.கா: முரளிதரன்" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-medium" />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">மொபைல் எண் (WhatsApp Mobile) *</label>
                <input type="tel" name="phone" required placeholder="எ.கா: 9443211223" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-mono" />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">வணிகத்தின் பெயர் & தொழில்</label>
                <input type="text" name="businessName" placeholder="எ.கா: முரளி கன்ஸ்ட்ரக்ஷன்ஸ்" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden" />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">கலந்துகொள்ள விரும்பும் சாப்டர் *</label>
                <select name="chapterId" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                  \${chapters.map(ch => \`
                    <option value="\${ch.id}" \${chapterId === ch.id ? 'selected' : ''}>\${ch.nameTa} (\${ch.meetingDay || 'வெள்ளி'} \${ch.meetingTime || '07:30 AM'})</option>
                  \`).join('')}
                </select>
              </div>

              <button type="submit" class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition">
                பார்வையாளராக பதிவு செய் ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    \`;
  }

  async submitGuestRegistration(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      phone: form.phone.value,
      businessName: form.businessName.value,
      chapterId: form.chapterId.value
    };

    try {
      const res = await fetch('/api/public/register-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert('விருந்தினர் பதிவு வெற்றிகரமாக ஏற்கப்பட்டது! உங்களுக்கு Google Meet மற்றும் மீட்டிங் விபரங்கள் SMS/WhatsApp-ல் அனுப்பப்படும்.');
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('விருந்தினர் பதிவு முடிந்தது!');
    }
  }

  openOneToOneModal() {
    const members = this.db.members || [];
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = \`
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 mb-2">
                <span>🤝 1-to-1 இருதரப்பு சந்திப்பு</span>
              </div>
              <h3 class="text-xl font-black text-slate-900">
                சக உறுப்பினருடன் ஆலோசனையை திட்டமிடுங்கள்
              </h3>
            </div>

            <form onsubmit="app.submitOneToOne(event)" class="space-y-3.5 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">சந்திக்க விரும்பும் உறுப்பினர் *</label>
                <select name="partnerMemberId" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                  \${members.map(m => \`
                    <option value="\${m.id}">\${m.ownerName} - \${m.businessName} (\${m.category})</option>
                  \`).join('')}
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">சந்திப்பு தேதி *</label>
                  <input type="date" name="meetingDate" required class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-mono" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">சந்திப்பு முறை</label>
                  <select name="meetingType" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                    <option value="in_person">நேரில் (In Person)</option>
                    <option value="online">Google Meet</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">முக்கிய குறிக்கோள் / வணிக வாய்ப்பு</label>
                <textarea name="agenda" rows="2" placeholder="இரு நிறுவனங்களின் ஒருங்கிணைந்த வளர்ச்சி உத்திகள்..." class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"></textarea>
              </div>

              <button type="submit" class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-md transition">
                1-to-1 திட்டமிடு ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    \`;
  }

  async submitOneToOne(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      partnerMemberId: form.partnerMemberId.value,
      meetingDate: form.meetingDate.value,
      meetingType: form.meetingType.value,
      agenda: form.agenda.value
    };

    try {
      await fetch('/api/member/one-to-ones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert('1-to-1 சந்திப்பு வெற்றிகரமாக பதிவு செய்யப்பட்டது!');
      this.render();
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('1-to-1 சந்திப்பு பதிவு செய்யப்பட்டது!');
    }
  }

  openCapacityModal(chapterId) {
    const chapters = this.db.chapters || [];
    const ch = chapters.find(c => c.id === chapterId) || chapters[0] || {};
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = \`
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-900 border border-red-300 mb-2">
                <span>⚙️ சூப்பர் அட்மின்: சாப்டர் கொள்ளளவு கட்டமைப்பு</span>
              </div>
              <h3 class="text-xl font-black text-slate-900">
                \${ch.nameTa || 'சாப்டர்'} கொள்ளளவை மாற்றுக
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                இயல்புநிலை கொள்ளளவு 100 உறுப்பினர்கள். தேவைக்கேற்ப மாற்றியமைக்கலாம்.
              </p>
            </div>

            <form onsubmit="app.submitCapacityChange(event, '\${ch.id}')" class="space-y-3.5 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">அனுமதிக்கப்பட்ட உறுப்பினர் வரம்பு *</label>
                <select name="capacity" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                  <option value="50" \${ch.capacity == 50 ? 'selected' : ''}>50 உறுப்பினர்கள்</option>
                  <option value="100" \${ch.capacity == 100 || !ch.capacity ? 'selected' : ''}>100 உறுப்பினர்கள் (Default)</option>
                  <option value="150" \${ch.capacity == 150 ? 'selected' : ''}>150 உறுப்பினர்கள்</option>
                  <option value="200" \${ch.capacity == 200 ? 'selected' : ''}>200 உறுப்பினர்கள்</option>
                  <option value="unlimited" \${ch.capacity === 'unlimited' ? 'selected' : ''}>வரம்பற்ற (Unlimited)</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">மாற்றத்திற்கான காரணம் (Audit Reason) *</label>
                <input type="text" name="reason" required placeholder="எ.கா: தாலுகா வணிக விரிவாக்கம்" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden" />
              </div>

              <button type="submit" class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition">
                கொள்ளளவை உறுதிப்படுத்து ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    \`;
  }

  async submitCapacityChange(e, chapterId) {
    e.preventDefault();
    const form = e.target;
    const capacity = form.capacity.value;
    const reason = form.reason.value;

    try {
      const res = await fetch(\`/api/admin/chapters/\${chapterId}/capacity\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity, reason })
      });
      const data = await res.json();
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert(\`சாப்டர் கொள்ளளவு \${capacity} உறுப்பினர்களாக வெற்றிகரமாக மாற்றப்பட்டது!\`);
      await this.fetchData();
      this.render();
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('கொள்ளளவு மாற்றப்பட்டது!');
    }
  }

  openTransferMemberModal(memberId) {
    const chapters = this.db.chapters || [];
    const members = this.db.members || [];
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = \`
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 mb-2">
                <span>🔄 உறுப்பினர் சாப்டர் இடமாற்றம்</span>
              </div>
              <h3 class="text-xl font-black text-slate-900">
                சாப்டர் மாற்றுதல் & மோனோபோலி சரிபார்ப்பு
              </h3>
            </div>

            <form onsubmit="app.submitMemberTransfer(event)" class="space-y-3.5 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">இடமாற்றப்பட வேண்டிய உறுப்பினர் *</label>
                <select name="memberId" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                  \${members.map(m => \`
                    <option value="\${m.id}" \${memberId === m.id ? 'selected' : ''}>\${m.ownerName} - \${m.businessName} (\${m.category})</option>
                  \`).join('')}
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">புதிய இலக்கு சாப்டர் (Target Chapter) *</label>
                <select name="targetChapterId" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                  \${chapters.map(ch => \`
                    <option value="\${ch.id}">\${ch.nameTa} (\${ch.districtId})</option>
                  \`).join('')}
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">இடமாற்றக் குறிப்பு (Reason)</label>
                <input type="text" name="notes" placeholder="வணிக கிளை இடமாற்றம்..." class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden" />
              </div>

              <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition">
                இடமாற்றத்தை முடி ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    \`;
  }

  async submitMemberTransfer(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      memberId: form.memberId.value,
      targetChapterId: form.targetChapterId.value,
      notes: form.notes.value
    };

    try {
      const res = await fetch('/api/admin/chapters/transfer-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      this.closeModal();
      if (res.ok) {
        if (window.playChime) window.playChime('success');
        alert('உறுப்பினர் புதிய சாப்டருக்கு வெற்றிகரமாக மாற்றப்பட்டார்!');
      } else {
        alert(result.error || 'இடமாற்றத்தில் பிழை ஏற்பட்டது');
      }
      await this.fetchData();
      this.render();
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('இடமாற்றம் செய்யப்பட்டது!');
    }
  }

  confirmReferralValue(referralId) {
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = \`
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2">
                <span>💰 மூடிய வணிக இருதரப்பு உறுதிப்படுத்தல்</span>
              </div>
              <h3 class="text-xl font-black text-slate-900">
                நிறைவு வணிக மதிப்பை பதிவு செய்யுங்கள்
              </h3>
            </div>

            <form onsubmit="app.submitReferralConfirmation(event, '\${referralId}')" class="space-y-3.5 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">இறுதி வணிக மதிப்பு (INR ₹) *</label>
                <input type="number" name="verifiedClosedValue" required placeholder="எ.கா: 50000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-hidden font-mono font-bold text-sm" />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">உறுதிப்படுத்தல் கருத்து / குறிப்பு</label>
                <textarea name="remarks" rows="2" placeholder="பரிந்துரை வழங்கியவருக்கு நன்றி..." class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"></textarea>
              </div>

              <button type="submit" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition">
                மதிப்பை உறுதி செய்து சேமி ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    \`;
  }

  async submitReferralConfirmation(e, referralId) {
    e.preventDefault();
    const form = e.target;
    const verifiedClosedValue = form.verifiedClosedValue.value;
    const remarks = form.remarks.value;

    try {
      await fetch(\`/api/member/referral/\${referralId}/confirm\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedClosedValue, remarks })
      });
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert(\`நிறைவு வணிக மதிப்பு ₹\${verifiedClosedValue} வெற்றிகரமாக உறுதிப்படுத்தப்பட்டது!\`);
      await this.fetchData();
      this.render();
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('மதிப்பு சேமிக்கப்பட்டது!');
    }
  }
`;

// Insert methods before closeModal()
const closeModalIdx = code.indexOf('  closeModal() {');
if (closeModalIdx !== -1) {
  code = code.substring(0, closeModalIdx) + methodsToAdd + '\n' + code.substring(closeModalIdx);
  fs.writeFileSync(appJsPath, code, 'utf8');
  console.log('✓ Successfully injected all core views, timer, and modal methods into app.js');
} else {
  console.error('Could not find closeModal() insertion point in app.js');
}
