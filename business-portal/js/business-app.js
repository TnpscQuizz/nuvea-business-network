/**
 * NBN BUSINESS OWNER PORTAL APPLICATION
 * Dedicated Workspace for Verified Business Owners (Networking + Marketplace)
 */
class NBNBusinessApp {
  constructor() {
    this.currentTab = 'overview';
    this.lang = 'ta';
    this.db = null;
    this.activeMemberId = 'mem_001'; // Default: Sri Murugan Jewellery
    this.init();
  }

  async init() {
    await this.fetchData();
    this.populateMemberSelector();
    this.updateHeaderInfo();
    this.render();
  }

  async fetchData() {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        this.db = await res.json();
      }
    } catch (e) {
      console.error('Error fetching business owner data:', e);
    }
  }

  getActiveMember() {
    return (this.db?.members || []).find(m => m.id === this.activeMemberId) || (this.db?.members || [])[0] || {};
  }

  populateMemberSelector() {
    const sel = document.getElementById('memberSelector');
    if (!sel || !this.db) return;
    sel.innerHTML = (this.db.members || []).map(m => `
      <option value="${m.id}" ${m.id === this.activeMemberId ? 'selected' : ''}>
        ${m.businessName} (${m.ownerName})
      </option>
    `).join('');
  }

  switchMember(memberId) {
    this.activeMemberId = memberId;
    this.updateHeaderInfo();
    this.render();
  }

  updateHeaderInfo() {
    const m = this.getActiveMember();
    const typeBadge = document.getElementById('headerAccountTypeBadge');
    const catTaluk = document.getElementById('headerCategoryTaluk');

    if (typeBadge) {
      const isNet = m.accountType !== 'marketplace_only';
      typeBadge.textContent = isNet ? 'Option A: Networking + Marketplace' : 'Option B: Marketplace Only';
      typeBadge.className = isNet 
        ? 'bg-amber-400/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded border border-amber-400/30 uppercase'
        : 'bg-blue-400/20 text-blue-300 text-[10px] font-black px-2 py-0.5 rounded border border-blue-400/30 uppercase';
    }

    if (catTaluk) {
      catTaluk.textContent = `${(m.talukId || 'harur').toUpperCase()} சாப்டர் • ${m.categoryName || m.categoryId || 'வணிகப் பிரிவு'}`;
    }
  }

  setTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.biz-tab').forEach(el => el.classList.remove('active-tab'));
    const btn = document.getElementById(`nav-${tab}`);
    if (btn) btn.classList.add('active-tab');
    this.render();
  }

  toggleLanguage() {
    this.lang = this.lang === 'ta' ? 'en' : 'ta';
    const btn = document.getElementById('langBtn');
    if (btn) btn.textContent = this.lang === 'ta' ? 'தமிழ் / EN' : 'EN / தமிழ்';
    this.render();
  }

  copyStoreLink() {
    const m = this.getActiveMember();
    const url = `${window.location.origin}/#/biz/${m.id}`;
    navigator.clipboard?.writeText(url);
    alert(`உங்கள் பிரத்யேக கடை லிங்க் காப்பி செய்யப்பட்டது!\n${url}`);
  }

  render() {
    const container = document.getElementById('biz-content');
    if (!container || !this.db) return;

    switch (this.currentTab) {
      case 'overview':
        container.innerHTML = this.renderOverview();
        break;
      case 'profile':
        container.innerHTML = this.renderProfile();
        break;
      case 'networking':
        container.innerHTML = this.renderNetworking();
        break;
      case 'leads':
        container.innerHTML = this.renderLeads();
        break;
      case 'seller':
        container.innerHTML = this.renderSellerHub();
        break;
      case 'forum':
        container.innerHTML = this.renderForum();
        break;
      case 'analytics':
        container.innerHTML = this.renderAnalytics();
        break;
      case 'settings':
        container.innerHTML = this.renderSettings();
        break;
      default:
        container.innerHTML = this.renderOverview();
    }
  }

  // 1. OVERVIEW
  renderOverview() {
    const m = this.getActiveMember();
    const isNetworking = m.accountType !== 'marketplace_only';

    return `
      <!-- TOP BUSINESS HERO -->
      <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${m.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" alt="Logo" class="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md">
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-2xl sm:text-3xl font-black text-white">${m.businessName}</h1>
                <span class="text-emerald-400 text-xs font-black bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">✓ VERIFIED</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                உரிமையாளர்: <strong>${m.ownerName}</strong> • ${m.address || 'Harur, Dharmapuri'}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="bizApp.copyStoreLink()" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5">
              <span>🔗 Share Store Link</span>
            </button>
            <button onclick="bizApp.setTab('leads')" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition">
              <span>🎯 View New Leads</span>
            </button>
          </div>
        </div>
      </div>

      <!-- KPI METRIC CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-black text-slate-400 uppercase tracking-wider">பெற்ற பரிந்துரைகள்</div>
            <div class="text-3xl font-black text-slate-900 mt-1">${m.referralsReceived || 18}</div>
            <div class="text-xs text-emerald-600 font-bold mt-1">✓ 84% நிறைவு விகிதம்</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
            📥
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-black text-slate-400 uppercase tracking-wider">வழங்கிய பரிந்துரைகள்</div>
            <div class="text-3xl font-black text-slate-900 mt-1">${m.referralsGiven || 12}</div>
            <div class="text-xs text-brand-600 font-bold mt-1">சக உறுப்பினர்களுக்கு</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
            📤
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-black text-slate-400 uppercase tracking-wider">ஈட்டிய வர்த்தக மதிப்பு</div>
            <div class="text-3xl font-black text-emerald-600 mt-1">₹${(m.businessWon || 385000).toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-500 font-bold mt-1">நெட்வொர்க் & சந்தை மூலம்</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            💰
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-black text-slate-400 uppercase tracking-wider">ஒழுங்கு நிலை (Strikes)</div>
            <div class="text-3xl font-black text-slate-900 mt-1">0 <span class="text-xs text-slate-400 font-bold">/ 3</span></div>
            <div class="text-xs text-emerald-600 font-bold mt-1">✓ 100% தூய ரெக்கார்டு</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">
            🛡️
          </div>
        </div>

      </div>

      <!-- RECENT ACTIVITY & OPPORTUNITIES -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b pb-3">
            <h3 class="text-base font-black text-slate-900">📥 சமீபத்திய வர்த்தக பரிந்துரைகள் (Recent Referrals)</h3>
            <button onclick="bizApp.setTab('leads')" class="text-xs text-brand-600 font-bold hover:underline">அனைத்தும் ➔</button>
          </div>
          <div class="space-y-3">
            <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <div class="font-black text-xs text-slate-900">திருமண தங்க நகை ஆர்டர் தேவை</div>
                <div class="text-[11px] text-slate-500">பரிந்துரைத்தவர்: <strong>கார்த்திக் (Nuvea Studio)</strong></div>
              </div>
              <span class="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">₹1,50,000</span>
            </div>
            <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <div class="font-black text-xs text-slate-900">கார்ப்பரேட் கிஃப்ட் தங்க நாணயங்கள்</div>
                <div class="text-[11px] text-slate-500">பரிந்துரைத்தவர்: <strong>சரவணன் (காரிமங்கலம் சாப்டர்)</strong></div>
              </div>
              <span class="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">₹75,000</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b pb-3">
            <h3 class="text-base font-black text-slate-900">🎬 Nuvea Studio 4K Branding & Marketing</h3>
            <span class="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded">உறுப்பினர் சலுகை</span>
          </div>
          <div class="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-2">
            <div class="font-black text-xs text-amber-900">உங்கள் கடைக்கான 4K வணிக வீடியோ தயாராக உள்ளது!</div>
            <p class="text-[11px] text-amber-800 leading-relaxed">
              Nuvea Studio தயாரித்த பிரத்யேக விளம்பர வீடியோ உங்கள் சுயவிவரத்தில் இணைக்கப்பட்டுள்ளது. இதை வாட்ஸ்அப் மற்றும் இன்ஸ்டாகிராமில் நேரடியாக பகிரலாம்.
            </p>
            <div class="pt-2">
              <a href="${m.videoUrl || 'https://www.youtube.com'}" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 text-amber-400 text-xs font-black rounded-lg shadow-xs">
                <span>▶ வீடியோவை பார்க்க</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // 2. PROFILE & STOREFRONT
  renderProfile() {
    const m = this.getActiveMember();

    return `
      <div class="space-y-6 max-w-4xl">
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 class="text-xl font-black text-slate-900">🏢 வணிக விவரம் & டிஜிட்டல் ஸ்டோர் (Profile)</h2>
              <p class="text-xs text-slate-500 font-medium">வாடிக்கையாளர்களும் பிற உறுப்பினர்களும் காணும் பொது சுயவிவரம்.</p>
            </div>
            <button onclick="bizApp.copyStoreLink()" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-xs transition">
              🔗 கடை லிங்க் காப்பி
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label class="block text-slate-500 mb-1">வணிக நிறுவனம்</label>
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-black text-slate-900">${m.businessName}</div>
            </div>
            <div>
              <label class="block text-slate-500 mb-1">தொழில் பிரிவு (Category Monopoly)</label>
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-black text-slate-900">${m.categoryName || m.categoryId}</div>
            </div>
            <div>
              <label class="block text-slate-500 mb-1">உரிமையாளர் பெயர்</label>
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-black text-slate-900">${m.ownerName}</div>
            </div>
            <div>
              <label class="block text-slate-500 mb-1">தொடர்பு தொலைபேசி</label>
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-black text-slate-900">${m.phone}</div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-slate-500 mb-1">முகவரி & தாலுகா</label>
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-900">${m.address || 'Harur Town, Dharmapuri'}</div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-slate-500 mb-1">வணிக அறிமுகம் (About Description)</label>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-700 leading-relaxed">
                ${m.description || 'தருமபுரி & அரூர் பகுதியின் முன்னணி 916 BIS Hallmarked தங்க நகை நிறுவனம். தரமான ஆபரணங்கள் மற்றும் சிறந்த சேவை.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 3. NETWORKING (OPTION A MEMBERS)
  renderNetworking() {
    const m = this.getActiveMember();
    const isNetworking = m.accountType !== 'marketplace_only';

    if (!isNetworking) {
      return `
        <div class="bg-white rounded-3xl p-8 border-2 border-amber-400 shadow-xl text-center max-w-2xl mx-auto space-y-5">
          <div class="w-16 h-16 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto">
            🏛️
          </div>
          <h2 class="text-2xl font-black text-slate-900">Option A சாப்டர் நெட்வொர்க்கிங் சலுகை</h2>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            தற்போது உங்கள் கணக்கு <strong>Marketplace Only (Option B)</strong> பிரிவில் உள்ளது. 100% தாலுகா ஏகபோக சீட், வாராந்திர நேரடி கூட்டங்கள் மற்றும் சக உறுப்பினர்களின் நேரடி வணிகப் பரிந்துரைகளைப் பெற உங்கள் கணக்கை மேம்படுத்தவும்!
          </p>
          <div class="pt-2">
            <button onclick="alert('உங்கள் விண்ணப்பம் அட்மினுக்கு அனுப்பப்பட்டது! விரைவில் தொடர்பு கொள்வார்கள்.')" class="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition">
              🚀 Upgrade to Networking Member (Option A) ➔
            </button>
          </div>
        </div>
      `;
    }

    const chapterMembers = (this.db?.members || []).filter(x => x.chapterId === m.chapterId && x.id !== m.id);

    return `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-slate-900">🏛️ NBN சாப்டர் நெட்வொர்க் (Chapter Networking)</h2>
            <p class="text-xs text-slate-500 font-medium">உங்கள் சாப்டர் உறுப்பினர்களுடன் 1-to-1 சந்திப்பு மற்றும் பரிந்துரைகள் பரிமாற்றம்.</p>
          </div>
          <button onclick="bizApp.openPassReferralModal()" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-xs transition">
            + புதிய பரிந்துரை வழங்க
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${chapterMembers.map(cm => `
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 hover:border-amber-400 transition">
              <div class="flex items-center gap-3">
                <img src="${cm.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}" class="w-11 h-11 rounded-xl object-cover border">
                <div>
                  <div class="font-black text-xs text-slate-900">${cm.businessName}</div>
                  <div class="text-[11px] text-amber-700 font-bold">${cm.categoryName || cm.categoryId}</div>
                </div>
              </div>
              <div class="text-xs text-slate-500">
                உரிமையாளர்: <strong>${cm.ownerName}</strong> • 📞 ${cm.phone}
              </div>
              <div class="border-t pt-2 flex items-center justify-between text-xs font-bold">
                <button onclick="alert('1-to-1 சந்திப்பு கோரிக்கை அனுப்பப்பட்டது!')" class="text-brand-600 hover:underline">
                  🤝 1-to-1 சந்திக்க
                </button>
                <button onclick="bizApp.openPassReferralModal('${cm.id}')" class="text-amber-600 hover:underline">
                  📤 பரிந்துரை வழங்க
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 4. LEADS & REQUIREMENTS
  renderLeads() {
    const requirements = this.db?.marketplaceRequirements || [];

    return `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-slate-900">🎯 வாடிக்கையாளர் தேவைகள் & லீட்கள் (Live Requirements)</h2>
            <p class="text-xs text-slate-500 font-medium">வாடிக்கையாளர்கள் சமர்ப்பித்த தேவைகளுக்கு நேரடியாக கொட்டேஷன் அனுப்பி ஆர்டர் எடுக்கலாம்.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${requirements.map(r => `
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-blue-400 transition">
              <div class="flex items-center justify-between">
                <span class="font-black text-slate-900 text-sm">${r.title}</span>
                <span class="text-[10px] font-black bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">${(r.status || 'open').toUpperCase()}</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">${r.description || ''}</p>
              <div class="text-xs text-slate-500 border-t pt-2 flex justify-between font-semibold">
                <span>பட்ஜெட்: <strong class="text-slate-900">₹${(r.budget || 0).toLocaleString('en-IN')}</strong></span>
                <span>அமைவிடம்: <strong class="text-slate-900">${r.talukId || 'தருமபுரி'}</strong></span>
              </div>
              <div class="border-t pt-3 flex justify-end">
                <button onclick="bizApp.openBidModal('${r.id}')" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition">
                  ⚡ கொட்டேஷன் சமர்ப்பிக்க (Submit Quote) ➔
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 5. SELLER HUB
  renderSellerHub() {
    return `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-slate-900">🛒 விற்பனையாளர் மையம் (Seller Hub)</h2>
            <p class="text-xs text-slate-500 font-medium">தயாரிப்புகள் பட்டியல், நேரடி வாடிக்கையாளர் ஆர்டர்கள் மற்றும் 18% GST இன்வாய்ஸ்.</p>
          </div>
          <button onclick="alert('புதிய தயாரிப்பு சேர்க்கும் படிவம் திறக்கப்படுகிறது!')" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-xs transition">
            + புதிய தயாரிப்பு சேர்க்க
          </button>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h3 class="text-base font-black text-slate-900 border-b pb-3">📦 உங்கள் செயலில் உள்ள ஆர்டர்கள்</h3>
          <div class="py-8 text-center text-slate-400 font-semibold text-xs">
            அனைத்து ஆர்டர்களும் வெற்றிகரமாக அனுப்பப்பட்டு வாடிக்கையாளருக்கு விநியோகிக்கப்பட்டுள்ளன.
          </div>
        </div>
      </div>
    `;
  }

  // 6. B2B FORUM
  renderForum() {
    return `
      <div class="space-y-6 max-w-3xl">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h2 class="text-xl font-black text-slate-900">💬 NBN வணிகக் கலந்துரையாடல் (B2B Forum)</h2>
          <p class="text-xs text-slate-500 font-medium mt-1">சாப்டர் மற்றும் மண்டல அளவிலான தொழில் அதிபர்களுடன் கலந்துரையாடுங்கள்.</p>

          <div class="mt-4 space-y-3">
            <div class="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-black text-xs text-slate-900">கார்த்திக் குமார் (Nuvea Studio)</span>
                <span class="text-[10px] text-slate-400">இன்று காலை 9:30</span>
              </div>
              <p class="text-xs text-slate-600">
                வணக்கம் நண்பர்களே, அடுத்த வாரம் புதன்கிழமை அரூர் சாப்டரின் மெகா பிசினஸ் மீட்டிங் நடைபெற உள்ளது. அனைவரும் வருகை தர வேண்டுகிறோம்!
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 7. ANALYTICS
  renderAnalytics() {
    const m = this.getActiveMember();
    return `
      <div class="space-y-6 max-w-3xl">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h2 class="text-xl font-black text-slate-900">📈 வணிக வளர்ச்சி அனலிட்டிக்ஸ் (Business Growth)</h2>
          <div class="p-6 bg-slate-50 rounded-xl border text-center space-y-2">
            <div class="text-3xl font-black text-emerald-600">₹${(m.businessWon || 385000).toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-500 font-bold">NBN மூலம் இதுவரை ஈட்டிய மொத்த வர்த்தக மதிப்பு</div>
          </div>
        </div>
      </div>
    `;
  }

  // 8. SETTINGS
  renderSettings() {
    const m = this.getActiveMember();
    return `
      <div class="space-y-6 max-w-2xl">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h2 class="text-xl font-black text-slate-900">⚙️ கணக்கு அமைப்புகள் & வங்கி விவரங்கள்</h2>
          <form onsubmit="event.preventDefault(); alert('அமைப்புகள் சேமிக்கப்பட்டன!');" class="space-y-3 text-xs font-semibold">
            <div>
              <label class="block mb-1">விற்பனை தொகை செலுத்தும் வங்கி கணக்கு எண்</label>
              <input type="text" value="9876543210123" class="w-full p-2.5 rounded-xl border border-slate-300">
            </div>
            <div>
              <label class="block mb-1">IFSC குறியீடு</label>
              <input type="text" value="SBIN0001234" class="w-full p-2.5 rounded-xl border border-slate-300">
            </div>
            <div class="pt-3 border-t">
              <button type="submit" class="px-5 py-2.5 bg-slate-900 text-white font-black rounded-xl">சேமிக்க</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // MODALS
  openModal(html) {
    const modal = document.getElementById('biz-modal');
    const content = document.getElementById('biz-modal-content');
    if (modal && content) {
      content.innerHTML = html;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeModal() {
    const modal = document.getElementById('biz-modal');
    if (modal) {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }
  }

  openPassReferralModal(toMemberId = '') {
    this.openModal(`
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="text-lg font-black text-slate-900">புதிய பிசினஸ் பரிந்துரை வழங்குதல்</h3>
          <button onclick="bizApp.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
        </div>
        <form onsubmit="event.preventDefault(); bizApp.closeModal(); alert('பரிந்துரை வெற்றிகரமாக வழங்கப்பட்டது!');" class="space-y-3 text-xs font-semibold">
          <div>
            <label class="block mb-1">வாடிக்கையாளர் பெயர்</label>
            <input type="text" required placeholder="எ.கா: சுரேஷ் குமார்" class="w-full p-2.5 rounded-xl border border-slate-300">
          </div>
          <div>
            <label class="block mb-1">வாடிக்கையாளர் தொலைபேசி</label>
            <input type="tel" required placeholder="9876543210" class="w-full p-2.5 rounded-xl border border-slate-300">
          </div>
          <div>
            <label class="block mb-1">தோராய வர்த்தக மதிப்பு (₹)</label>
            <input type="number" required placeholder="50000" class="w-full p-2.5 rounded-xl border border-slate-300">
          </div>
          <div class="pt-3 border-t flex justify-end gap-2">
            <button type="button" onclick="bizApp.closeModal()" class="px-4 py-2 bg-slate-100 font-bold rounded-xl">ரத்து</button>
            <button type="submit" class="px-4 py-2 bg-amber-400 font-black rounded-xl">பரிந்துரையை அனுப்புக ➔</button>
          </div>
        </form>
      </div>
    `);
  }

  openBidModal(reqId) {
    this.openModal(`
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="text-lg font-black text-slate-900">கொட்டேஷன் சமர்ப்பிக்க (Submit Quotation)</h3>
          <button onclick="bizApp.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
        </div>
        <form onsubmit="event.preventDefault(); bizApp.closeModal(); alert('உங்கள் கொட்டேஷன் வாடிக்கையாளருக்கு அனுப்பப்பட்டது!');" class="space-y-3 text-xs font-semibold">
          <div>
            <label class="block mb-1">அடிப்படை விலை (₹)</label>
            <input type="number" id="bidBase" required placeholder="45000" class="w-full p-2.5 rounded-xl border border-slate-300">
          </div>
          <div class="p-3 bg-slate-50 rounded-xl text-slate-600">
            GST வரி (18%) மற்றும் பில்லிங் தானாகவே கணக்கிடப்பட்டு வாடிக்கையாளருக்கு அனுப்பப்படும்.
          </div>
          <div class="pt-3 border-t flex justify-end gap-2">
            <button type="button" onclick="bizApp.closeModal()" class="px-4 py-2 bg-slate-100 font-bold rounded-xl">ரத்து</button>
            <button type="submit" class="px-4 py-2 bg-slate-900 text-white font-black rounded-xl">சமர்ப்பிக்க ➔</button>
          </div>
        </form>
      </div>
    `);
  }
}

// Global initialization
window.bizApp = new NBNBusinessApp();
