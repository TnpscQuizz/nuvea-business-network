const fs = require('fs');

const appJsPath = 'C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/public/js/app.js';
let content = fs.readFileSync(appJsPath, 'utf8');

// 1. Prepare New Enhanced renderHomeView and Methods
const newHomeBlock = `
  // ==========================================
  // VIEW: HOME (MASTER ENTERPRISE SEARCH, MESH MAP & VACANCY SCANNER)
  // ==========================================
  renderHomeView() {
    const isTa = this.lang === 'ta';
    const chapters = this.db.chapters || [];
    const members = this.db.members || [];
    const categories = this.db.categories || [];

    // Filter states
    const searchQuery = (this.homeSearchQuery || '').toLowerCase().trim();
    const talukFilter = this.homeTalukFilter || 'all';
    const landmarkFilter = (this.homeLandmarkFilter || '').toLowerCase().trim();
    const vacancyOnly = !!this.homeVacancyOnly;

    // Filtered members calculation for live results
    const filteredMembers = members.filter(m => {
      // Taluk check
      if (talukFilter !== 'all' && (m.talukId || '').toLowerCase() !== talukFilter.toLowerCase()) {
        return false;
      }
      // Landmark check
      if (landmarkFilter && !(m.address || '').toLowerCase().includes(landmarkFilter)) {
        return false;
      }
      // Search query check
      if (searchQuery) {
        const catObj = categories.find(c => c.id === m.categoryId) || {};
        const catTa = (catObj.nameTa || '').toLowerCase();
        const catEn = (catObj.nameEn || '').toLowerCase();
        const hay = [
          m.businessName || '',
          m.ownerName || '',
          m.categoryId || '',
          m.category || '',
          catTa,
          catEn,
          m.address || '',
          m.talukId || '',
          m.specialOffer || '',
          m.tagline || ''
        ].join(' ').toLowerCase();

        if (!hay.includes(searchQuery)) return false;
      }
      return true;
    });

    // Filtered chapters calculation
    const filteredChapters = chapters.filter(c => {
      if (talukFilter !== 'all' && (c.talukId || '').toLowerCase() !== talukFilter.toLowerCase()) {
        return false;
      }
      if (landmarkFilter && !(c.landmark || '').toLowerCase().includes(landmarkFilter) && !(c.meetingVenue || '').toLowerCase().includes(landmarkFilter)) {
        return false;
      }
      if (vacancyOnly && (c.availableSeats !== undefined && c.availableSeats <= 0)) {
        return false;
      }
      if (searchQuery) {
        const hay = [
          c.nameTa || '',
          c.nameEn || '',
          c.directorName || '',
          c.presidentName || '',
          c.landmark || '',
          c.town || '',
          c.talukId || ''
        ].join(' ').toLowerCase();
        if (!hay.includes(searchQuery)) return false;
      }
      return true;
    });

    // Active featured chapter
    const activeChapter = chapters.find(c => talukFilter !== 'all' ? c.talukId === talukFilter : c.id === 'harur_titans') || chapters[0] || {};
    const chapMembers = members.filter(m => (m.chapterId || (m.talukId === 'harur' ? 'harur_titans' : \`\${m.talukId}_titans\`)) === activeChapter.id);
    const filledCount = activeChapter.filledSeats !== undefined ? activeChapter.filledSeats : (chapMembers.length > 0 ? chapMembers.length : 10);
    const maxCapacity = activeChapter.capacity === 'unlimited' ? 100 : (parseInt(activeChapter.capacity) || 100);
    const availCount = Math.max(0, maxCapacity - filledCount);
    const utilPct = Math.min(100, Math.round((filledCount / maxCapacity) * 100));

    // Has active search / filter
    const hasActiveFilter = !!(searchQuery || talukFilter !== 'all' || landmarkFilter || vacancyOnly);

    return \`
      <div class="space-y-8 max-w-6xl mx-auto">
        
        <!-- ========================================== -->
        <!-- TOP CATCHY HERO (CONVERSATIONAL BUSINESS OWNER APPEAL) -->
        <!-- ========================================== -->
        <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-slate-800 overflow-hidden">
          <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="max-w-3xl space-y-4 relative z-10">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>🔥 உங்கள் பகுதியில் சாப்டர் சேர்க்கை நடப்பில் உள்ளது • Category Exclusivity (ஒரு தொழிலுக்கு ஒருவர் மட்டுமே)</span>
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

              <button onclick="app.scrollToSection('master-search-section')" class="px-4 py-3.5 bg-transparent hover:bg-white/5 text-amber-300 font-bold text-xs sm:text-sm rounded-2xl border border-amber-400/30 transition flex items-center gap-2">
                <span>🔍 நேரலை சர்ச் & பில்டர்</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- MASTER SEARCH & MULTI-FACET FILTER ENGINE -->
        <!-- ========================================== -->
        <div id="master-search-section" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-900 border border-amber-300 mb-1.5">
                <span>⚡ மின்னல் வேக நேரலை தேடல் (Instant Live Search)</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900">
                வணிகர், தொழில் பிரிவு, தாலுகா அல்லது லேண்ட்மார்க் மூலம் தேடுங்கள்
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                டேட்டாபேஸில் உள்ள அனைத்து சாப்டர்கள், வணிகர்கள் மற்றும் காலி இடங்களை உடனடியாக கண்டறியலாம்.
              </p>
            </div>

            <!-- Clear Filter / Status Badge -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-400 text-xs font-black">
                \${filteredMembers.length} வணிகர்கள் • \${filteredChapters.length} சாப்டர்கள்
              </span>
              \${hasActiveFilter ? \`
                <button onclick="app.clearHomeFilters()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-300 flex items-center gap-1">
                  <span>✕ பில்டர் நீக்கு</span>
                </button>
              \` : ''}
            </div>
          </div>

          <!-- Instant Search Input Box -->
          <div class="relative search-glow rounded-2xl border-2 border-slate-200 transition bg-slate-50 p-1.5 flex items-center">
            <span class="pl-3.5 pr-2 text-slate-400 text-lg">🔍</span>
            <input 
              type="text" 
              id="home-master-search-input"
              value="\${this.homeSearchQuery || ''}"
              oninput="app.onHomeSearchInput(this.value)"
              placeholder="வணிகப் பெயர் (எ.கா: Nuvea), தொழில் (எ.கா: சிமெண்ட், நகைக்கடை), தாலுகா, அல்லது லேண்ட்மார்க் (எ.கா: காளியம்மன் கோவில், பைபாஸ்)..."
              class="w-full bg-transparent px-2 py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
            />
            \${this.homeSearchQuery ? \`
              <button onclick="app.onHomeSearchInput('')" class="pr-3 text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            \` : ''}
          </div>

          <!-- Taluk Filter Pills -->
          <div class="space-y-2">
            <div class="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>📍 தாலுகா வாரியாக வடிகட்டு (Taluk Filter):</span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              \${[
                { id: 'all', label: 'அனைத்து பகுதிகள் (All)' },
                { id: 'harur', label: 'ஹரூர் (Harur)' },
                { id: 'palacode', label: 'பாலக்கோடு' },
                { id: 'karimangalam', label: 'காரிமங்கலம்' },
                { id: 'dharmapuri_town', label: 'தருமபுரி டவுன்' },
                { id: 'pennagaram', label: 'பென்னாகரம்' },
                { id: 'salem', label: 'சேலம் (Salem)' },
                { id: 'hosur', label: 'ஓசூர் (Hosur)' }
              ].map(t => \`
                <button 
                  onclick="app.setHomeTalukFilter('\${t.id}')" 
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition \${talukFilter === t.id ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}">
                  \${t.label}
                </button>
              \`).join('')}
            </div>
          </div>

          <!-- Popular Landmark / Town Filter Tags -->
          <div class="space-y-2 pt-1 border-t border-slate-100">
            <div class="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>🏛️ முக்கிய லேண்ட்மார்க் / இடங்கள் (Landmark Filter):</span>
              <button 
                onclick="app.toggleHomeVacancyOnly()" 
                class="px-3 py-1 rounded-lg text-xs font-bold border transition \${vacancyOnly ? 'bg-amber-400 text-slate-950 border-amber-500 font-black shadow-xs' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}">
                \${vacancyOnly ? '✓ காலியிடங்கள் உள்ளவை மட்டும் (Active)' : '🔥 காலியிடங்கள் உள்ள சாப்டர்கள் மட்டும்'}
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              \${[
                { key: 'காளியம்மன் கோவில்', label: '📍 காளியம்மன் கோவில் ரோடு' },
                { key: 'பைபாஸ்', label: '📍 பைபாஸ் ரோடு (Bypass)' },
                { key: 'பஸ்', label: '📍 பஸ் நிலையம் (Bus Stand)' },
                { key: 'உழவர் சந்தை', label: '📍 உழவர் சந்தை எதிரில்' },
                { key: 'மெயின் ரோடு', label: '📍 மெயின் ரோடு (Main Road)' },
                { key: '4 ரோடு', label: '📍 4 ரோடு சந்திப்பு' },
                { key: 'கலெக்டரேட்', label: '📍 கலெக்டரேட் ரோடு' }
              ].map(lm => \`
                <button 
                  onclick="app.setHomeLandmarkFilter('\${landmarkFilter === lm.key ? '' : lm.key}')" 
                  class="landmark-pill px-3 py-1.5 rounded-lg text-xs font-semibold border transition \${landmarkFilter === lm.key ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}">
                  \${lm.label}
                </button>
              \`).join('')}
            </div>
          </div>

          <!-- LIVE FILTERED RESULTS GRID (Shows immediately when search or filter is active) -->
          \${hasActiveFilter ? \`
            <div class="space-y-4 pt-4 border-t border-slate-200">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>🎯 தேடல் முடிவுகள்:</span>
                  <span class="text-xs font-bold text-slate-500">(\${filteredMembers.length} வணிகர்கள், \${filteredChapters.length} சாப்டர்கள் பொருந்தின)</span>
                </h3>
              </div>

              <!-- Matching Businesses Grid -->
              \${filteredMembers.length > 0 ? \`
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  \${filteredMembers.slice(0, 6).map(m => {
                    const cleanPhone = (m.phone || '').replace(/\\D/g, '');
                    const waText = encodeURIComponent(\`வணக்கம் \${m.ownerName}, NBN நெட்வொர்க் மூலம் தொடர்பு கொள்கிறேன்.\`);
                    return \`
                      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition space-y-2.5">
                        <div class="flex items-start justify-between gap-2">
                          <div>
                            <div class="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mb-1">
                              🔒 Category Exclusivity
                            </div>
                            <div class="text-sm font-black text-slate-900 leading-tight">
                              \${m.businessName}
                            </div>
                            <div class="text-xs text-slate-600 font-semibold mt-0.5">
                              உரிமையாளர்: \${m.ownerName}
                            </div>
                          </div>
                          <span class="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                            ✓ Verified
                          </span>
                        </div>

                        <div class="text-xs text-slate-500 flex items-center gap-1">
                          <span>📍</span>
                          <span class="truncate">\${m.address || 'தமிழ்நாடு'}</span>
                        </div>

                        \${m.specialOffer ? \`
                          <div class="text-[11px] font-bold text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-200">
                            🎁 \${m.specialOffer}
                          </div>
                        \` : ''}

                        <div class="flex items-center gap-2 pt-1">
                          <a href="https://wa.me/\${cleanPhone}?text=\${waText}" target="_blank" class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl text-center transition">
                            💬 வாட்ஸ்அப்
                          </a>
                          <button onclick="app.openStandaloneBiz('\${m.id}')" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition">
                            விவரம் ➔
                          </button>
                        </div>
                      </div>
                    \`;
                  }).join('')}
                </div>
              \` : \`
                <div class="bg-slate-50 rounded-2xl p-6 text-center text-slate-500 text-xs font-semibold">
                  குறிப்பிட்ட தேடலுக்கு வணிகர்கள் கிடைக்கவில்லை. கீழே உள்ள சாப்டரில் உங்கள் தொழிலை உடனே பதிவு செய்யலாம்!
                </div>
              \`}
            </div>
          \` : ''}
        </div>

        <!-- ========================================== -->
        <!-- ACTIVE CHAPTER CARD WITH DIRECTORS & LEADS METRICS -->
        <!-- ========================================== -->
        <div class="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-slate-50 rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-sm space-y-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-amber-200/60 pb-6">
            
            <div class="space-y-3 max-w-2xl">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 font-mono text-xs font-black">
                  \${activeChapter.code || 'NBN-HAR-01'}
                </span>
                <h3 class="text-xl sm:text-2xl font-black text-slate-900">
                  \${activeChapter.nameTa || 'ஹரூர் டைட்டன்ஸ் சாப்டர்'}
                </h3>
                <span class="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  ✓ சேர்க்கை நடப்பில் உள்ளது (Open for Enrollment)
                </span>
              </div>

              <p class="text-xs sm:text-sm text-slate-600 font-medium">
                மீட்டிங் நேரம்: <strong class="text-slate-900">\${activeChapter.meetingDay || 'வெள்ளிக்கிழமை'} \${activeChapter.meetingTime || 'காலை 07:30 AM'}</strong> • இடம்: \${activeChapter.meetingVenue || 'ஹரூர் NBN பிசினஸ் சென்டர்'}
              </p>

              <!-- Chapter Leadership Profile Photos & Trust Badges -->
              <div class="flex flex-wrap items-center gap-4 pt-1">
                <!-- Chapter Director -->
                <div class="flex items-center gap-2.5 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-xs">
                  <img 
                    src="\${activeChapter.directorPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" 
                    alt="Director" 
                    class="w-10 h-10 rounded-full object-cover director-avatar-ring shrink-0"
                  />
                  <div>
                    <div class="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider">சாப்டர் இயக்குனர்</div>
                    <div class="text-xs font-black text-slate-900 leading-tight">\${activeChapter.directorName || 'சந்திரா (Nuvea Studio)'}</div>
                    <div class="text-[10px] text-slate-500 font-semibold">\${activeChapter.directorPhone || '917548820641'}</div>
                  </div>
                </div>

                <!-- Chapter President -->
                <div class="flex items-center gap-2.5 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-xs">
                  <img 
                    src="\${activeChapter.presidentPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}" 
                    alt="President" 
                    class="w-10 h-10 rounded-full object-cover director-avatar-ring shrink-0"
                  />
                  <div>
                    <div class="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider">சாப்டர் தலைவர்</div>
                    <div class="text-xs font-black text-slate-900 leading-tight">\${activeChapter.presidentName || activeChapter.leadership?.presidentName || 'ஆர். சுப்ரமணியம்'}</div>
                    <div class="text-[10px] text-slate-500 font-semibold">SBR Cements</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chapter Leads Generated & Business Volume Counter Card -->
            <div class="bg-white p-5 rounded-2xl border border-amber-300 shadow-sm shrink-0 space-y-3 min-w-[260px]">
              <div class="text-xs font-black uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                <span>💰 சாப்டர் வர்த்தக சாதனை</span>
              </div>
              <div>
                <div class="text-2xl font-black text-slate-900 tracking-tight">
                  \${activeChapter.totalBusinessDone || '₹64.5 லட்சம்'}
                </div>
                <div class="text-xs font-bold text-emerald-700 mt-0.5">
                  உருவாக்கப்பட்ட நேரடி வர்த்தகம்
                </div>
              </div>
              <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                <span>பரிமாறப்பட்ட லீட்கள்:</span>
                <span class="text-slate-900 font-black font-mono">\${activeChapter.leadsGeneratedCount || 48}+ லீட்கள்</span>
              </div>
            </div>

          </div>

          <!-- Capacity Utilization & Urgent Vacancy Callout -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            
            <!-- Capacity Progress -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-700">Chapter Capacity & Seats (சாப்டர் சீட்கள்):</span>
                <span class="text-slate-900 font-mono font-black">\${filledCount} / \${maxCapacity} சீட்கள்</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 bg-amber-500" style="width: \${utilPct}%"></div>
              </div>
              <div class="flex items-center justify-between text-xs font-bold pt-0.5">
                <span class="text-amber-800 font-black">\${utilPct}% நிரம்பியது</span>
                <span class="urgent-vacancy-pulse px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-black">
                  🔥 இன்னும் \${availCount} இடங்கள் மட்டுமே காலியாக உள்ளன!
                </span>
              </div>
            </div>

            <!-- Instant Category Vacancy Checker -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div class="text-xs font-black text-slate-800 flex items-center justify-between">
                <span>🔍 உங்க கேட்டகிரி காலியா இருக்கான்னு பாருங்க:</span>
                <span class="text-[10px] text-amber-700 font-bold">100% Exclusive</span>
              </div>
              <div class="relative">
                <input 
                  type="text" 
                  id="home-cat-check-input" 
                  oninput="app.checkHomeCategoryVacancy(this.value, '\${activeChapter.id}')"
                  placeholder="எ.கா: சிமெண்ட், இண்டீரியர், எலக்ட்ரிக்கல், நகைக்கடை..." 
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
                ★ 100% Category Exclusivity பின்கள்
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
            <span class="font-bold text-brand-900">25+ இணைக்கப்பட்ட வணிகர்கள் • 11 சாப்டர்கள்</span>
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
                1. 100% Category Exclusivity
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
                ஒவ்வொரு வார மீட்டிங்கிலும் மத்த எல்லா பிசினஸ்மேன் முன்னாடியும் உங்க ஸ்பெஷல் ஆஃபர் என்ன, இந்த வாரம் உங்களுக்கு என்ன கஸ்டமர் வேணும்னு நேரடியா பேசி ஆர்டர் எடுக்கலாம்.
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
                வாட்ஸ்அப்பில் கஸ்டமர்களுக்கு ஷேர் பண்ண தனித்துவமான டிஜிட்டல் கார்டு லிங்க் & NBN அதிகாரப்பூர்வ தொழில் உரிமை சான்றிதழ் வழங்கப்படும்.
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
  // HOME SEARCH & FILTER ENGINE ACTIONS
  // ==========================================
  onHomeSearchInput(query) {
    this.homeSearchQuery = query;
    this.render();
    setTimeout(() => this.initHomeMap(), 80);
  }

  setHomeTalukFilter(talukId) {
    this.homeTalukFilter = talukId;
    this.render();
    setTimeout(() => {
      this.initHomeMap();
      this.focusHomeMapTaluk(talukId);
    }, 80);
  }

  setHomeLandmarkFilter(landmark) {
    this.homeLandmarkFilter = landmark;
    this.render();
    setTimeout(() => this.initHomeMap(), 80);
  }

  toggleHomeVacancyOnly() {
    this.homeVacancyOnly = !this.homeVacancyOnly;
    this.render();
    setTimeout(() => this.initHomeMap(), 80);
  }

  clearHomeFilters() {
    this.homeSearchQuery = '';
    this.homeTalukFilter = 'all';
    this.homeLandmarkFilter = '';
    this.homeVacancyOnly = false;
    this.render();
    setTimeout(() => this.initHomeMap(), 80);
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
      pennagaram: [12.1340, 77.8990],
      salem: [11.6643, 78.1460],
      hosur: [12.7409, 77.8253]
    };

    const targetTaluk = this.homeTalukFilter || 'harur';
    const targetCenter = talukCoords[targetTaluk] || talukCoords.harur;
    const targetZoom = targetTaluk === 'all' ? 10 : 14;

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
    const categories = this.db.categories || [];

    const searchQuery = (this.homeSearchQuery || '').toLowerCase().trim();
    const talukFilter = this.homeTalukFilter || 'all';
    const landmarkFilter = (this.homeLandmarkFilter || '').toLowerCase().trim();

    // Group matching businesses by taluk
    const talukGroups = {};
    members.forEach(m => {
      if (!m.lat || !m.lng) return;

      // Filter checks
      if (talukFilter !== 'all' && (m.talukId || '').toLowerCase() !== talukFilter.toLowerCase()) return;
      if (landmarkFilter && !(m.address || '').toLowerCase().includes(landmarkFilter)) return;
      if (searchQuery) {
        const catObj = categories.find(c => c.id === m.categoryId) || {};
        const hay = [
          m.businessName || '',
          m.ownerName || '',
          m.categoryId || '',
          m.category || '',
          catObj.nameTa || '',
          catObj.nameEn || '',
          m.address || '',
          m.talukId || ''
        ].join(' ').toLowerCase();
        if (!hay.includes(searchQuery)) return;
      }

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
                🔒 Category Exclusivity
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
    this.homeTalukFilter = talukId;

    const talukCoords = {
      all: [12.1211, 78.2200],
      harur: [12.0583, 78.4916],
      palacode: [12.2882, 78.0811],
      karimangalam: [12.3082, 78.2045],
      dharmapuri_town: [12.1211, 78.1582],
      pennagaram: [12.1340, 77.8990],
      salem: [11.6643, 78.1460],
      hosur: [12.7409, 77.8253]
    };

    if (this.homeMap && talukCoords[talukId]) {
      const zoom = talukId === 'all' ? 10 : 14;
      this.homeMap.flyTo(talukCoords[talukId], zoom, { duration: 1.2 });
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

// Locate renderHomeView() start and scrollToSection() end
const startPattern = 'renderHomeView() {';
const endPattern = '  // ==========================================\n  // VIEW: CHAPTERS';

const startIndex = content.indexOf(startPattern);
const endIndex = content.indexOf(endPattern);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find boundaries for renderHomeView in app.js!');
  process.exit(1);
}

// Replace the block
content = content.substring(0, startIndex) + newHomeBlock.trim() + '\n\n' + content.substring(endIndex);

// Also replace "கொள்ளளவு" and "மோனோபோலி" in other views where relevant
content = content.replace(/🏛️ சாப்டர்கள் & கொள்ளளவு/g, '🏛️ Chapters & Seats (சாப்டர்கள் & சீட்கள்)');
content = content.replace(/100% மோனோபோலி/g, '100% Category Exclusivity (தொழில் உரிமை)');
content = content.replace(/மோனோபோலி உரிமை/g, 'Category Exclusivity (தொழில் உரிமை)');

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('Successfully updated app.js with master search & filter engine!');
