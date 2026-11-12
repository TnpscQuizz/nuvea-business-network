const fs = require('fs');

const appJsPath = 'C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/public/js/app.js';
let content = fs.readFileSync(appJsPath, 'utf8');

// 1. Enhanced Business Member Dashboard
const newMemberDashboard = `  // ==========================================
  // VIEW 5: PERSONALIZED BUSINESS OWNER DASHBOARD (OPTIONS A & B)
  // ==========================================
  renderMemberDashboardView() {
    const isTa = this.lang === 'ta';
    const allMembers = this.db.members || [];
    const allReferrals = this.db.recentLeads || [];
    const currentTab = this.bizDashboardTab || 'overview';
    
    // Identify current user's business
    let biz = allMembers[0];
    if (this.currentUser) {
      biz = allMembers.find(m => m.id === this.currentUser.id || m.businessId === this.currentUser.id || (m.phone && m.phone.replace(/\\D/g, '') === this.currentUser.phone)) || allMembers[0];
    }
    const memId = biz.id || biz.businessId;
    const isNetworking = biz.accountType !== 'marketplace_only' && biz.chapterId;
    const currentChapterId = biz.chapterId || (biz.talukId === 'harur' ? 'harur_titans' : \`\${biz.talukId}_titans\`);
    const chap = (this.db.chapters || []).find(c => c.id === currentChapterId) || { nameTa: 'ஹரூர் டைட்டன்ஸ்', nameEn: 'Harur Titans', capacity: 100, filledSeats: 10 };

    const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'http://localhost:3000';
    const storeUrl = \`\${origin}/#/storefront?biz=\${biz.businessId || biz.id}\`;

    // Leads calculation
    const myLeads = allReferrals.filter(r => r.to === biz.businessName || r.toMemberId === memId || r.to === memId);
    const leadsCount = myLeads.length > 0 ? myLeads.length : 14;

    return \`
      <div class="space-y-6 max-w-6xl mx-auto">
        
        <!-- TOP BUSINESS OWNER HEADER -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 text-amber-400 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                \${(biz.businessName || 'B').charAt(0)}
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-xl sm:text-2xl font-black text-slate-900">\${biz.businessName}</h2>
                  \${isNetworking ? \`
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                      🏛️ Option A: Networking + Marketplace
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                      🔒 100% Category Exclusivity
                    </span>
                  \` : \`
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-300">
                      🛒 Option B: Marketplace Only
                    </span>
                  \`}
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ✓ \${biz.status || 'Verified Elite'}
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  உரிமையாளர்: <strong class="text-slate-800">\${biz.ownerName}</strong> • \${isNetworking ? (biz.chapterName || chap.nameTa) : 'மார்க்கெட்பிளேஸ் சப்ளையர்'} • \${biz.address}
                </p>
              </div>
            </div>

            <!-- Header Quick Actions -->
            <div class="flex flex-wrap items-center gap-2">
              <button onclick="app.openStandaloneBiz('\${biz.businessId || biz.id}')" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5">
                <span>👁️ கடை முன்னோட்டம் (Preview Store)</span>
              </button>
              <button onclick="app.openEditProfileModal()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition">
                ✏️ சுயவிவரம் திருத்து
              </button>
              <button onclick="app.downloadInvoice('INV-2024-001')" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition">
                📄 GST பில்
              </button>
            </div>
          </div>

          <!-- Public Shareable Profile Link Box -->
          <div class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-lg">🔗</span>
              <div>
                <span class="font-bold text-amber-950">உங்கள் பிரத்யேக டிஜிட்டல் ஸ்டோர் முகவரி:</span>
                <span class="font-mono text-slate-700 block sm:inline sm:ml-1">\${storeUrl}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="navigator.clipboard.writeText('\${storeUrl}'); alert('லிங்க் காப்பி செய்யப்பட்டது!');" class="px-3 py-1.5 bg-white text-slate-800 font-bold rounded-lg border border-slate-300 hover:bg-slate-50 text-xs">
                📋 காப்பி லிங்க்
              </button>
              <a href="https://wa.me/?text=\${encodeURIComponent('எங்கள் NBN டிஜிட்டல் ஸ்டோர்: ' + storeUrl)}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs">
                💬 வாட்ஸ்அப் பகிர்வு
              </a>
            </div>
          </div>

          <!-- SUB-NAVIGATION TABS (A - G) -->
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 text-xs font-bold">
            <button onclick="app.bizDashboardTab = 'overview'; app.render();" class="px-3.5 py-2 rounded-xl transition \${currentTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              📊 கண்ணோட்டம் (Overview)
            </button>
            <button onclick="app.bizDashboardTab = 'profile'; app.render();" class="px-3.5 py-2 rounded-xl transition \${currentTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              🏢 சுயவிவரம் (Profile)
            </button>
            <button onclick="app.bizDashboardTab = 'networking'; app.render();" class="px-3.5 py-2 rounded-xl transition \${currentTab === 'networking' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              🏛️ NBN Networking \${!isNetworking ? '🔒' : ''}
            </button>
            <button onclick="app.bizDashboardTab = 'leads'; app.render();" class="px-3.5 py-2 rounded-xl transition \${currentTab === 'leads' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              🎯 லீட் மையம் (Leads)
            </button>
            <button onclick="app.bizDashboardTab = 'marketplace'; app.render();" class="px-3.5 py-2 rounded-xl transition \${currentTab === 'marketplace' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              🛒 விற்பனையாளர் மையம் (Seller Hub)
            </button>
            <button onclick="app.bizDashboardTab = 'forum'; app.render();" class="px-3.5 py-2 rounded-xl transition \${currentTab === 'forum' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              💬 வணிக ஃபோரம் & மெசேஜ்
            </button>
            <button onclick="app.bizDashboardTab = 'analytics'; app.render();" class="px-3.5 py-2 rounded-xl transition \${currentTab === 'analytics' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              📈 அனலிட்டிக்ஸ் (Analytics)
            </button>
            <button onclick="app.bizDashboardTab = 'settings'; app.render();" class="px-3.5 py-2 rounded-xl transition \${currentTab === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              ⚙️ அமைப்புகள் (Settings)
            </button>
          </div>
        </div>

        <!-- TAB CONTENT: OVERVIEW -->
        \${currentTab === 'overview' ? \`
          <div class="space-y-6">
            <!-- KPIs -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div class="text-[11px] font-bold text-slate-500 uppercase">சுயவிவர நிறைவு (Profile)</div>
                <div class="text-2xl font-black text-slate-900 mt-1">95%</div>
                <div class="text-[10px] text-emerald-600 font-bold mt-1">✓ முழுமையாக சரிபார்க்கப்பட்டது</div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div class="text-[11px] font-bold text-slate-500 uppercase">புதிய & நேரடி லீட்கள்</div>
                <div class="text-2xl font-black text-brand-900 mt-1">\${leadsCount} லீட்கள்</div>
                <div class="text-[10px] text-amber-700 font-bold mt-1">3 ஃபாலோ-அப் தேவை</div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div class="text-[11px] font-bold text-slate-500 uppercase">கொட்டேஷன் & ஆர்டர்கள்</div>
                <div class="text-2xl font-black text-emerald-700 mt-1">12 / 16</div>
                <div class="text-[10px] text-slate-500 mt-1">75% வெற்றி விகிதம்</div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div class="text-[11px] font-bold text-slate-500 uppercase">மொத்த வர்த்தக மதிப்பு</div>
                <div class="text-2xl font-black text-slate-900 mt-1">\${biz.businessDone || '₹64.5 லட்சம்'}</div>
                <div class="text-[10px] text-emerald-600 font-bold mt-1">0% கமிஷன் லாபம்</div>
              </div>
            </div>

            <!-- Quick Action Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h3 class="text-base font-black text-slate-900 flex items-center justify-between">
                  <span>🎯 சமீபத்திய லீட்கள் (Latest Leads)</span>
                  <button onclick="app.bizDashboardTab = 'leads'; app.render();" class="text-xs text-amber-700 hover:underline">அனைத்தும் காண்க ➔</button>
                </h3>
                <div class="space-y-2 text-xs">
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <div class="font-bold text-slate-900">சரவணன் - சிமெண்ட் & கட்டுமான தேவைகள்</div>
                      <div class="text-[11px] text-slate-500">மதிப்பு: ₹1,20,000 • ஹரூர் பைபாஸ்</div>
                    </div>
                    <span class="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">New Lead</span>
                  </div>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <div class="font-bold text-slate-900">வெற்றிவேல் இன்ஃப்ரா - 4K வீடியோ ஷூட்</div>
                      <div class="text-[11px] text-slate-500">மதிப்பு: ₹35,000 • தருமபுரி டவுன்</div>
                    </div>
                    <span class="px-2 py-0.5 bg-blue-100 text-brand-900 rounded font-bold text-[10px]">Negotiation</span>
                  </div>
                </div>
              </div>

              <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h3 class="text-base font-black text-slate-900 flex items-center justify-between">
                  <span>🛒 மார்க்கெட்பிளேஸ் லைவ் தேவைகள்</span>
                  <button onclick="app.bizDashboardTab = 'marketplace'; app.render();" class="text-xs text-emerald-700 hover:underline">கொட்டேஷன் அனுப்புக ➔</button>
                </h3>
                <div class="space-y-2 text-xs">
                  <div class="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex justify-between items-center">
                    <div>
                      <div class="font-bold text-slate-900">500 மூட்டை போர்ட்லேண்ட் சிமெண்ட் தேவை</div>
                      <div class="text-[11px] text-slate-600">காரிமங்கலம் தாலுகா • டெலிவரி: 24 மணி நேரம்</div>
                    </div>
                    <button onclick="app.openSubmitQuotationModal('REQ-HAR-001')" class="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]">Quote ➔</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        \` : ''}

        <!-- TAB CONTENT: NBN NETWORKING (SECTION B) -->
        \${currentTab === 'networking' ? \`
          \${isNetworking ? \`
            <div class="space-y-6">
              <div class="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-slate-50 p-6 sm:p-7 rounded-3xl border border-amber-300 shadow-sm space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span class="px-2.5 py-0.5 rounded-lg bg-slate-900 text-amber-400 font-mono text-xs font-black">\${chap.code || 'NBN-HAR-01'}</span>
                    <h3 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">\${chap.nameTa} (\${chap.nameEn})</h3>
                    <p class="text-xs text-slate-600 mt-0.5">மாவட்டம்: <strong>தருமபுரி</strong> • தாலுகா: <strong>\${(biz.talukId || 'harur').toUpperCase()}</strong> • இடம்: \${chap.meetingVenue || 'NBN சென்டர்'}</p>
                  </div>
                  <div class="bg-white p-3.5 rounded-2xl border border-amber-300 text-right shrink-0">
                    <div class="text-xs text-slate-500 font-bold">சாப்டர் கொள்ளளவு:</div>
                    <div class="text-xl font-black text-slate-900">\${chap.filledSeats || 10} / \${chap.capacity || 100} சீட்கள்</div>
                    <div class="text-[10px] text-emerald-700 font-bold">Category Exclusivity செயலில் உள்ளது</div>
                  </div>
                </div>

                <!-- Chapter Leadership -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200">
                  <div class="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div class="text-[10px] font-bold text-amber-800 uppercase">சாப்டர் இயக்குனர்</div>
                    <div class="font-black text-slate-900 mt-0.5">\${chap.directorName || 'சந்திரா (Nuvea Studio)'}</div>
                    <div class="text-[10px] text-slate-500 font-semibold">\${chap.directorPhone || '917548820641'}</div>
                  </div>
                  <div class="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div class="text-[10px] font-bold text-indigo-800 uppercase">சாப்டர் தலைவர்</div>
                    <div class="font-black text-slate-900 mt-0.5">\${chap.presidentName || 'ஆர். சுப்ரமணியம் (SBR Cements)'}</div>
                    <div class="text-[10px] text-slate-500 font-semibold">9842100001</div>
                  </div>
                  <div class="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div class="text-[10px] font-bold text-emerald-800 uppercase">அடுத்த வாராந்திர மீட்டிங்</div>
                    <div class="font-black text-slate-900 mt-0.5">\${chap.meetingDay || 'வெள்ளிக்கிழமை'} காலை 07:30 AM</div>
                    <div class="text-[10px] text-emerald-700 font-bold">வருகை சதவீதம்: 100%</div>
                  </div>
                </div>
              </div>

              <!-- Chapter Authorized Member Directory -->
              <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between border-b pb-3">
                  <h3 class="font-black text-slate-900 text-base">👥 சாப்டர் சக உறுப்பினர்கள் பட்டியல் (Authorized Directory)</h3>
                  <button onclick="app.openOneToOneModal()" class="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold">+ 1-to-1 சந்திப்பு பதிவு</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  \${allMembers.slice(0, 6).map(m => \`
                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div class="font-black text-slate-900">\${m.businessName}</div>
                      <div class="text-[11px] text-slate-600 font-semibold">உரிமையாளர்: \${m.ownerName}</div>
                      <div class="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">\${m.category || m.categoryId}</div>
                    </div>
                  \`).join('')}
                </div>
              </div>
            </div>
          \` : \`
            <!-- RESTRICTION FOR MARKETPLACE ONLY -->
            <div class="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl border border-slate-800">
              <div class="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-3xl font-black mx-auto">
                🔒
              </div>
              <h3 class="text-2xl font-black text-white">சாப்டர் நெட்வொர்க்கிங் (Option A உறுப்பினர்களுக்கு மட்டுமே)</h3>
              <p class="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                நீங்கள் தற்போது "Marketplace Only" கணக்கில் உள்ளீர்கள். உங்கள் தாலுகா சாப்டரில் இணைந்து, Category Exclusivity லாக் செய்து, சக பிசினஸ் ஓனர்களுடன் வாரந்தோறும் பரிந்துரைகள் (Referrals) மற்றும் நேரடி பிசினஸ் பரிமாற விரும்பினால் உங்கள் கணக்கை உடனடியாக மேம்படுத்துங்கள்!
              </p>
              <div class="pt-2">
                <button onclick="app.openUpgradeAccountModal()" class="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition">
                  🚀 சாப்டர் நெட்வொர்க்கிங்கிற்கு மேம்படுத்து (Upgrade Now) ➔
                </button>
              </div>
            </div>
          \`}
        \` : ''}

        <!-- TAB CONTENT: LEADS CENTRE (SECTION D) -->
        \${currentTab === 'leads' ? \`
          <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h3 class="text-lg font-black text-slate-900">🎯 லீட் மேலாண்மை மையம் (Lead Generation Centre)</h3>
                <p class="text-xs text-slate-500">பரிந்துரைகள் மற்றும் நேரடி வாடிக்கையாளர் தேவைகளை ஒப்பந்தங்களாக மாற்றுங்கள்.</p>
              </div>
              <button onclick="app.openLeadModal()" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs">
                + புதிய லீட் உருவாக்கு
              </button>
            </div>

            <!-- Pipeline Metrics -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div class="text-[10px] text-slate-500 font-bold uppercase">புதிய லீட்கள்</div>
                <div class="text-xl font-black text-slate-900 mt-0.5">4</div>
              </div>
              <div class="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <div class="text-[10px] text-brand-900 font-bold uppercase">பேச்சுவார்த்தையில்</div>
                <div class="text-xl font-black text-brand-900 mt-0.5">3</div>
              </div>
              <div class="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <div class="text-[10px] text-emerald-800 font-bold uppercase">வெற்றி பெற்றவை</div>
                <div class="text-xl font-black text-emerald-700 mt-0.5">8</div>
              </div>
              <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <div class="text-[10px] text-amber-800 font-bold uppercase">வெற்றி விகிதம்</div>
                <div class="text-xl font-black text-amber-900 mt-0.5">72%</div>
              </div>
            </div>

            <!-- Leads Table -->
            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-700 font-extrabold border-b">
                  <tr>
                    <th class="p-3">வாடிக்கையாளர் / நிறுவனம்</th>
                    <th class="p-3">தேவை & மதிப்பு</th>
                    <th class="p-3">மூலம் (Source)</th>
                    <th class="p-3">நிலை (Status)</th>
                    <th class="p-3">நடவடிக்கை</th>
                  </tr>
                </thead>
                <tbody class="divide-y text-slate-800">
                  <tr class="hover:bg-slate-50">
                    <td class="p-3">
                      <div class="font-bold text-slate-900">கே. சரவணன்</div>
                      <div class="text-[10px] text-slate-500">9842100112 • ஹரூர் பைபாஸ்</div>
                    </td>
                    <td class="p-3 font-bold">சிமெண்ட் & ஸ்டீல் (₹1,45,000)</td>
                    <td class="p-3"><span class="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-bold">NBN Member Referral</span></td>
                    <td class="p-3"><span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded text-[10px] font-bold">Follow-up Required</span></td>
                    <td class="p-3">
                      <a href="https://wa.me/919842100112" target="_blank" class="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]">💬 பேசுக</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        \` : ''}

        <!-- TAB CONTENT: SELLER CENTRE (SECTION E) -->
        \${currentTab === 'marketplace' ? \`
          <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h3 class="text-lg font-black text-slate-900">🛒 மார்க்கெட்பிளேஸ் விற்பனையாளர் மையம் (Seller Centre)</h3>
                <p class="text-xs text-slate-500">வாடிக்கையாளர் தேவைகளுக்கு போட்டி விலைப்புள்ளிகள் அனுப்பி ஆர்டர்களை வெல்லுங்கள்.</p>
              </div>
              <button onclick="app.setTab('marketplace')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs">
                சந்தைக்குச் செல்க ➔
              </button>
            </div>

            <!-- Live Matching Requirements for Seller -->
            <div class="space-y-3">
              <div class="text-xs font-black text-slate-700">உங்களுக்கான நேரலை வாடிக்கையாளர் தேவைகள்:</div>
              \${(this.db.customerRequirements || []).slice(0, 3).map(req => \`
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded font-black">\${req.id}</span>
                      <span class="font-bold text-slate-600">\${req.categoryName || req.categoryId}</span>
                    </div>
                    <div class="font-black text-slate-900 text-sm">\${req.title}</div>
                    <div class="text-slate-500 mt-0.5">அளவு: \${req.quantity} \${req.unit} • இடம்: \${(req.deliveryTaluk || 'harur').toUpperCase()}</div>
                  </div>
                  <button onclick="app.openSubmitQuotationModal('\${req.id}')" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-xs shrink-0">
                    கொட்டேஷன் அனுப்புக ➔
                  </button>
                </div>
              \`).join('')}
            </div>
          </div>
        \` : ''}

        <!-- TAB CONTENT: FORUM & MESSAGING (SECTION C) -->
        \${currentTab === 'forum' ? \`
          <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-lg font-black text-slate-900 border-b pb-3">💬 NBN வணிகர் கலந்துரையாடல் ஃபோரம் (Business Forum)</h3>
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div class="font-bold text-slate-900">ஹரூர் டைட்டன்ஸ் B2B விவாதம்:</div>
              <p class="text-slate-600">இந்த வாரம் எலக்ட்ரிக்கல் மற்றும் இண்டீரியர் திட்டங்களுக்கு தேவையான சப்ளையர்கள் தொடர்பு கொள்ளவும்.</p>
              <div class="flex items-center gap-2 pt-2 border-t border-slate-200">
                <input type="text" placeholder="உங்கள் பதிலை அல்லது கேள்வியை டைப் செய்யவும்..." class="flex-1 px-3 py-2 border rounded-xl text-xs bg-white" />
                <button class="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs">அனுப்பு ➔</button>
              </div>
            </div>
          </div>
        \` : ''}

        <!-- TAB CONTENT: ANALYTICS (SECTION F) -->
        \${currentTab === 'analytics' ? \`
          <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <h3 class="text-lg font-black text-slate-900 border-b pb-3">📈 வணிக பகுப்பாய்வு & செயல்திறன் (Analytics)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div class="p-4 bg-slate-50 rounded-xl border text-center">
                <div class="text-slate-500 font-bold uppercase">கடை பார்வைகள் (Profile Views)</div>
                <div class="text-2xl font-black text-slate-900 mt-1">1,420</div>
                <div class="text-emerald-600 font-bold mt-1">↑ 18% இந்த வாரம்</div>
              </div>
              <div class="p-4 bg-slate-50 rounded-xl border text-center">
                <div class="text-slate-500 font-bold uppercase">வாடிக்கையாளர் விசாரணைகள்</div>
                <div class="text-2xl font-black text-brand-900 mt-1">68</div>
                <div class="text-slate-500 mt-1">நேரடி வாட்ஸ்அப் & கால்</div>
              </div>
              <div class="p-4 bg-slate-50 rounded-xl border text-center">
                <div class="text-slate-500 font-bold uppercase">வாடிக்கையாளர் மதிப்பீடு</div>
                <div class="text-2xl font-black text-amber-600 mt-1">⭐ 4.9 / 5.0</div>
                <div class="text-slate-500 mt-1">48 சரிபார்க்கப்பட்ட மதிப்புரைகள்</div>
              </div>
            </div>
          </div>
        \` : ''}

        <!-- TAB CONTENT: SETTINGS (SECTION G) -->
        \${currentTab === 'settings' ? \`
          <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4 max-w-xl">
            <h3 class="text-lg font-black text-slate-900 border-b pb-3">⚙️ கணக்கு அமைப்புகள் & பாதுகாப்பு</h3>
            <div class="space-y-3 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">கடவுச்சொல் மாற்று</label>
                <input type="password" placeholder="புதிய கடவுச்சொல்" class="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">அறிவிப்பு விருப்பங்கள் (WhatsApp Notifications)</label>
                <label class="flex items-center gap-2 mt-1">
                  <input type="checkbox" checked />
                  <span>புதிய லீட் மற்றும் ஆர்டர்களுக்கு உடனடியாக வாட்ஸ்அப் செய்தி பெறுக</span>
                </label>
              </div>
              <button onclick="alert('அமைப்புகள் சேமிக்கப்பட்டன!');" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-xs">
                சேமி ➔
              </button>
            </div>
          </div>
        \` : ''}

      </div>
    \`;
  }
`;

// Locate renderMemberDashboardView() start and renderAdminView() start
const startPattern = '  renderMemberDashboardView() {';
const endPattern = '  // VIEW 6: NUVEA 4K VIDEO PROMOTION PORTAL';

const startIndex = content.indexOf(startPattern);
const endIndex = content.indexOf(endPattern);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find boundaries for renderMemberDashboardView in app.js!');
  process.exit(1);
}

content = content.substring(0, startIndex) + newMemberDashboard + '\n\n' + content.substring(endIndex);

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('Successfully upgraded Business Owner Dashboard with Options A & B logic!');
