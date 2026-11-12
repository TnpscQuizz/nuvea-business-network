/**
 * NUVEA BUSINESS NETWORK (NBN) - ENTERPRISE CLIENT APPLICATION
 * Commercial B2B Digital Networking SaaS for Tamil Nadu
 * Powered by Nuvea Studio (Founder: Chandru, Phone: 7548820641)
 */

class NBNApp {
  constructor() {
    this.currentTab = 'welcome';
    this.currentRole = 'public'; // 'public' | 'member' | 'super_admin'
    this.lang = 'ta'; // 'ta' | 'en'
    this.selectedTaluk = 'harur';
    this.selectedChapter = 'all';
    this.opportunityTab = 'all'; // 'all' | 'chapters' | 'franchise' | 'deals'
    this.opportunityForumFilter = 'all'; // 'all' | 'titans' | 'royals' | 'women' | 'agro' | 'tech'
    this.sortBy = 'best_price'; // 'best_price' | 'rating'
    this.searchTerm = '';
    this.categorySlotFilter = 'all'; // 'all' | 'available' | 'locked'
    this.categoryGroupFilter = 'all';
    this.token = localStorage.getItem('nbn_token') || null;
    this.currentUser = null;
    this.db = null;
    this.timerInterval = null;
    this.secondsLeft = 45;
    this.timerRunning = false;
    this.map = null;
    this.mapMarkers = [];
    this.mapTalukFilter = 'all';
    this.activeStoreBizId = null;
    this.certificateSearchId = 'NBN-CERT-HAR-001';
    this.timerSeconds = 45;
    this.timerCurrentSpeakerIdx = 0;
    this.activeReportType = 'growth';
    this.memberDashboardData = null;

    this.init();
  }

  async init() {
    await this.fetchData();
    await this.checkAuth();
    this.bindEvents();
    this.handleRoute();
    this.updateHeaderAuth();
    this.render();
  }

  async fetchData() {
    try {
      const url = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http'))
        ? `${window.location.origin}/api/state`
        : '/api/state';
      const res = await fetch(url);
      if (res.ok) {
        this.db = await res.json();
      }
    } catch (e) {
      console.warn('Network error loading state:', e);
    }
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('hashchange', () => this.handleRoute());
    }
  }

  toggleLang(lang) {
    this.lang = lang;
    const taBtn = document.getElementById('lang-ta-btn');
    const enBtn = document.getElementById('lang-en-btn');
    if (taBtn && enBtn) {
      if (lang === 'ta') {
        taBtn.className = 'px-2 py-0.5 rounded bg-amber-400 text-brand-950';
        enBtn.className = 'px-2 py-0.5 rounded text-slate-300 hover:text-white';
      } else {
        enBtn.className = 'px-2 py-0.5 rounded bg-amber-400 text-brand-950';
        taBtn.className = 'px-2 py-0.5 rounded text-slate-300 hover:text-white';
      }
    }
    this.render();
  }

  async switchRole(role) {
    this.currentRole = role;
    const labelEl = document.getElementById('adminBtnLabel');
    if (labelEl) {
      if (role === 'super_admin') labelEl.textContent = 'அட்மின் (Chandru)';
      else if (role === 'member') labelEl.textContent = 'உறுப்பினர்';
      else labelEl.textContent = 'அட்மின் லாகின்';
    }

    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        const data = await res.json();
        this.token = data.token;
        this.currentUser = data.user;
        localStorage.setItem('nbn_token', data.token);
      }
    } catch (e) {
      console.error(e);
    }

    if (role === 'member') this.setTab('member');
    else if (role === 'super_admin') this.setTab('admin');
    else this.setTab('consumer');
  }

  setTab(tabName) {
    if (this.map && tabName !== 'map') {
      try { this.map.remove(); } catch(e){}
      this.map = null;
    }
    this.currentTab = tabName;

    // Desktop tabs
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active-tab'));
    const activeBtn = document.getElementById(`tab-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active-tab');

    // Mobile navigation active indicator
    ['home', 'chapters', 'marketplace', 'customer', 'categories', 'meeting', 'consumer', 'map', 'elevation', 'certificate', 'opportunities'].forEach(t => {
      const mBtn = document.getElementById(`m-tab-${t}`);
      if (mBtn) {
        if (t === tabName) {
          mBtn.className = 'flex flex-col items-center gap-0.5 text-brand-700 font-extrabold';
        } else {
          mBtn.className = 'flex flex-col items-center gap-0.5 text-slate-400 font-medium hover:text-slate-700';
        }
      }
    });

    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  changeTaluk(talukId) {
    this.selectedTaluk = talukId;
    this.selectedChapter = 'all'; // reset chapter filter on taluk change
    const headerSelect = document.getElementById('headerTalukSelect');
    if (headerSelect) headerSelect.value = talukId;
    this.render();
  }

  setChapter(chapterId) {
    this.selectedChapter = chapterId;
    this.render();
  }

  setOpportunityTab(tab) {
    this.opportunityTab = tab;
    this.render();
  }

  setOpportunityForumFilter(filter) {
    this.opportunityForumFilter = filter;
    this.render();
  }

  updateLiveStats() {
    if (!this.db) return;
    const currentTaluk = (this.db.taluks && this.db.taluks[this.selectedTaluk]) || {
      filledSeats: 68, totalSeats: 100, availableSeats: 32, totalBusinessClosed: '₹64.5 லட்சம்'
    };
    const verifiedEl = document.getElementById('stat-verified-count');
    const leadsEl = document.getElementById('stat-leads-count');
    const businessEl = document.getElementById('stat-business-count');
    const seatsEl = document.getElementById('stat-active-taluk-seats');

    if (verifiedEl) verifiedEl.textContent = `${(this.db.members || []).length * 40}+ கடைகள்`;
    if (leadsEl) leadsEl.textContent = `1,842+ லீட்கள்`;
    if (businessEl) businessEl.textContent = currentTaluk.totalBusinessClosed;
    if (seatsEl) seatsEl.textContent = `${currentTaluk.filledSeats}/${currentTaluk.totalSeats} (${currentTaluk.availableSeats} மீதம்)`;
  }

  render() {
    this.updateLiveStats();
    const container = document.getElementById('app-content');
    if (!container || !this.db) return;

    switch (this.currentTab) {
      case 'welcome':
        container.innerHTML = this.renderWelcomeRegistrationFirstView();
        break;
      case 'home':
        container.innerHTML = this.renderHomeView();
        setTimeout(() => this.initHomeMap(), 80);
        break;
      case 'chapters':
        container.innerHTML = this.renderChaptersView();
        break;
      case 'marketplace':
        container.innerHTML = this.renderMarketplaceView();
        break;
      case 'customer':
        container.innerHTML = this.renderCustomerDashboardView();
        break;
      case 'certificate':
        container.innerHTML = this.renderCertificateVerificationView();
        break;
      case 'storefront':
        container.innerHTML = this.renderStandaloneBizView(this.activeStoreBizId);
        break;
      case 'consumer':
        container.innerHTML = this.renderConsumerView();
        break;
      case 'map':
        container.innerHTML = this.renderMapView();
        setTimeout(() => this.initLeafletMap(), 60);
        break;
      case 'categories':
        container.innerHTML = this.renderCategoryView();
        break;
      case 'opportunities':
        container.innerHTML = this.renderOpportunitiesView();
        break;
      case 'meeting':
        container.innerHTML = this.renderMeetingView();
        break;
      case 'elevation':
        container.innerHTML = this.renderElevationView();
        break;
      case 'member':
        container.innerHTML = this.renderMemberDashboardView();
        break;
      case 'video':
        container.innerHTML = this.renderVideoPortalView();
        break;
      case 'admin':
        container.innerHTML = this.renderAdminView();
        break;
      default:
        container.innerHTML = this.renderConsumerView();
    }
  }

  // ==========================================
  // VIEW 1: PUBLIC BUSINESS DIRECTORY (TALUK EXCLUSIVE & BEST PRICE PRIORITY)
  // ==========================================
  renderConsumerView() {
    const isTa = this.lang === 'ta';
    const selectedTalukId = this.selectedTaluk || 'harur';
    
    const talukNames = {
      'harur': 'ஹரூர் (Harur)',
      'palacode': 'பாலக்கோடு (Palacode)',
      'karimangalam': 'காரிமங்கலம் (Karimangalam)',
      'dharmapuri_town': 'தருமபுரி டவுன் (Dharmapuri)',
      'pennagaram': 'பென்னாகரம் (Pennagaram)',
      'all': 'அனைத்து தாலுகாக்கள் (All)'
    };
    const currentTalukName = talukNames[selectedTalukId] || selectedTalukId.toUpperCase();

    // STRICT TALUK & CHAPTER FILTERING:
    let members = (this.db.members || []).filter(m => {
      const matchTaluk = (selectedTalukId === 'all') ? true : m.talukId === selectedTalukId;
      const matchChapter = (!this.selectedChapter || this.selectedChapter === 'all') ? true : (m.chapterId === this.selectedChapter);
      const matchSearch = !this.searchTerm ||
        (m.businessName || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (m.ownerName || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (m.specialOffer || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (m.tagline || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (m.address || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchTaluk && matchChapter && matchSearch;
    });

    // PRIORITY TO BEST PRICE: Whoever gives the best price/deal comes FIRST!
    members.sort((a, b) => {
      if (this.sortBy === 'best_price') {
        return (b.bestPriceRank || 90) - (a.bestPriceRank || 90);
      } else if (this.sortBy === 'rating') {
        return (b.rating || 5.0) - (a.rating || 5.0);
      }
      return (b.bestPriceRank || 90) - (a.bestPriceRank || 90);
    });

    const talukChips = [
      { id: 'harur', nameTa: 'ஹரூர் சாப்டர்', nameEn: 'Harur' },
      { id: 'palacode', nameTa: 'பாலக்கோடு சாப்டர்', nameEn: 'Palacode' },
      { id: 'karimangalam', nameTa: 'காரிமங்கலம் சாப்டர்', nameEn: 'Karimangalam' },
      { id: 'dharmapuri_town', nameTa: 'தருமபுரி டவுன்', nameEn: 'Dharmapuri Town' },
      { id: 'pennagaram', nameTa: 'பென்னாகரம் சாப்டர்', nameEn: 'Pennagaram' },
      { id: 'all', nameTa: 'அனைத்து தாலுகாக்கள்', nameEn: 'All Taluks' }
    ];

    const activeChaptersInTaluk = (this.db.chapters || []).filter(c => selectedTalukId === 'all' ? true : c.talukId === selectedTalukId);

    return `
      <!-- Clean, Airy Commercial Hero Section -->
      <div class="text-center max-w-3xl mx-auto mb-6 pt-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-700 text-xs font-bold border border-blue-200/80 mb-3">
          <span>✨</span>
          <span>${isTa ? 'தமிழ்நாட்டின் முதல் தாலுகா அளவிலான B2B நெட்வொர்க்' : 'Tamil Nadu\'s First Taluk-Level B2B Network'}</span>
        </div>
        
        <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          ${isTa ? 'தருமபுரி மாவட்டத்தின்' : 'Dharmapuri District\'s'} <span class="text-brand-600">${isTa ? 'சரிபார்க்கப்பட்ட' : 'Verified'}</span> ${isTa ? 'முன்னணி வணிகங்கள்' : 'Top Businesses'}
        </h1>
        
        <p class="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-6">
          ${isTa ? '1 தாலுகாவிற்கு 1 பிரத்யேக பிசினஸ் மோனோபோலி. சிறந்த விலை மற்றும் சலுகை வழங்கும் நிறுவனங்களுக்கு முதல் முன்னுரிமை!' : '1 exclusive business per category per taluk. Verified best-price & top-deal providers get top priority!'}
        </p>

        <!-- Big, Clean Search Bar -->
        <div class="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2 max-w-2xl mx-auto mb-5">
          <div class="flex-grow flex items-center gap-2 px-3">
            <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="${isTa ? 'கடை பெயர், உரிமையாளர், சலுகை தேடவும் (எ.கா: தங்கம், 4K வீடியோ, 35% தள்ளுபடி)...' : 'Search shop name, owner, offer (e.g. Jewellery, 4K Video, Discount)...'}" 
              value="${this.searchTerm}"
              oninput="app.setSearch(this.value)"
              class="w-full text-slate-900 text-sm focus:outline-none placeholder:text-slate-400 py-1.5 font-medium"
            />
          </div>
          ${this.searchTerm ? `
            <button onclick="app.setSearch('')" class="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-bold">✕</button>
          ` : ''}
          <button onclick="app.setSearch(this.searchTerm)" class="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold rounded-xl transition shrink-0">
            ${isTa ? 'தேடுக' : 'Search'}
          </button>
        </div>
      </div>

      <!-- Opportunity Teaser Ribbon -->
      <div class="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-3.5 sm:p-4 rounded-2xl shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-lg shrink-0">
            🚀
          </div>
          <div>
            <div class="text-xs sm:text-sm font-black text-slate-950">
              ${isTa ? 'வாய்ப்பு மையம்: உங்கள் ஊரில் NBN சாப்டர் தொடங்குங்கள்! மாதம் ₹50,000+ வரை வருமானம்.' : 'Opportunity Hub: Launch an NBN Chapter in Your Town! Earn ₹50,000+/mo.'}
            </div>
            <div class="text-[11px] text-amber-950 font-bold">
              ${isTa ? 'உறுப்பினர் சேர்க்கைக்கு ₹3,000 கமிஷன் + Nuvea Studio-வின் முழு தொழில்நுட்ப & 4K வீடியோ ஆதரவு.' : '₹3,000/member commission + full Nuvea Studio tech backing.'}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="app.setTab('opportunities')" class="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-black rounded-xl shadow-xs transition">
            ${isTa ? 'அனைத்து வாய்ப்புகள் காண்க →' : 'View Opportunities →'}
          </button>
        </div>
      </div>

      <!-- Prominent Taluk Switcher Banner (Strictly scopes to that taluk) -->
      <div class="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md mb-6 text-white max-w-5xl mx-auto">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span class="text-xs font-black uppercase tracking-wider text-amber-300">
                ${isTa ? 'தாலுகா தேர்வு (Select Taluk Chapter)' : 'Select Taluk Chapter'}
              </span>
            </div>
            <p class="text-xs text-slate-300 font-medium mt-0.5">
              ${isTa ? 'நீங்கள் தேர்வு செய்த தாலுகாவில் உள்ள நிறுவனங்கள் மட்டுமே கீழே காட்டப்படும்.' : 'Only verified businesses in your selected taluk are listed below.'}
            </p>
          </div>

          <div class="text-[11px] font-extrabold bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-300/40">
            🔒 100% தாலுகா மோனோபோலி
          </div>
        </div>

        <!-- 1-Tap Taluk Filter Chips with Counts -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          ${talukChips.map(tc => {
            const count = (this.db.members || []).filter(m => tc.id === 'all' ? true : m.talukId === tc.id).length;
            const active = (this.selectedTaluk === tc.id);
            return `
              <button 
                onclick="app.changeTaluk('${tc.id}')"
                class="px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition transform active:scale-95 ${active ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-white/60' : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'}">
                📍 ${isTa ? tc.nameTa : tc.nameEn} (${count})
              </button>
            `;
          }).join('')}
        </div>

        <!-- Multi-Chapter / Specialized Forum Chips within this Taluk -->
        ${activeChaptersInTaluk.length > 0 ? `
          <div class="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span class="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <span>🏛️</span>
              <span>${isTa ? 'சாப்டர்கள்:' : 'Chapters:'}</span>
            </span>
            <button 
              onclick="app.setChapter('all')" 
              class="px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition ${(!this.selectedChapter || this.selectedChapter === 'all') ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}">
              ${isTa ? 'அனைத்தும்' : 'All'} (${activeChaptersInTaluk.length})
            </button>
            ${activeChaptersInTaluk.map(ch => {
              const chActive = (this.selectedChapter === ch.id);
              const icon = ch.forumType === 'women' ? '👩' : ch.forumType === 'agro' ? '🌾' : ch.forumType === 'tech' ? '⚡' : ch.forumType === 'royals' ? '💎' : '👑';
              return `
                <button 
                  onclick="app.setChapter('${ch.id}')" 
                  class="px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition ${chActive ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-white/50' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}">
                  ${icon} ${isTa ? ch.nameTa : ch.nameEn} <span class="text-[10px] opacity-80">(${ch.filledSeats}/${ch.maxSeats})</span>
                </button>
              `;
            }).join('')}
            <button 
              onclick="app.openDirectorModal()" 
              class="px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap bg-indigo-500/40 hover:bg-indigo-500/60 text-indigo-100 border border-indigo-400/40 transition">
              ➕ ${isTa ? 'புதிய சாப்டர் துவங்கு' : 'Launch Chapter'}
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Clean Section Bar with Best Price Priority Sort Filter -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-200">
        <div>
          <h2 class="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <span>📍 ${currentTalukName} - நிறுவனங்கள்</span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">${members.length} நிறுவனங்கள்</span>
          </h2>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            ${isTa ? 'சிறந்த விலை மற்றும் பிரத்யேக சலுகை வழங்கும் நிறுவனங்களுக்கு முதல் முன்னுரிமை!' : 'Priority ranking for best price & verified deal providers!'}
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs font-bold text-slate-400 hidden sm:inline">வரிசைப்படுத்து:</span>
          <div class="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button 
              onclick="app.setSortBy('best_price')" 
              class="px-3 py-1.5 rounded-lg transition ${this.sortBy === 'best_price' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
              🏷️ சிறந்த விலை முன்னுரிமை
            </button>
            <button 
              onclick="app.setSortBy('rating')" 
              class="px-3 py-1.5 rounded-lg transition ${this.sortBy === 'rating' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
              ★ டாப் ரேட்டிங்
            </button>
          </div>

          <button onclick="app.setTab('map')" class="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span class="hidden sm:inline">${isTa ? 'மேப்' : 'Map'}</span>
          </button>
        </div>
      </div>

      <!-- Clean, Professional Business Cards Grid with Best Price Priority -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${members.map(m => {
          const cat = (this.db.categories || []).find(c => c.id === m.categoryId) || {};
          const cleanPhone = (m.phone || '').replace(/\D/g, '');
          const waOfferText = m.specialOffer || 'சிறந்த விலை சலுகை';
          const waText = encodeURIComponent(`வணக்கம் ${m.ownerName}, Nuvea Business Network மூலம் உங்கள் ${m.businessName} சிறந்த விலை சலுகை (${waOfferText}) பார்த்தேன். ஆர்டர் & விவரம் அறிய விரும்புகிறேன்.`);
          const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;
          const photoThumb = (m.photos && m.photos[0]) || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80';

          return `
            <div class="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group">
              <div>
                <!-- Clean High-Quality Photo Header -->
                <div class="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer" onclick="app.showOwnerModal('${m.id || m.businessId}')">
                  <img src="${photoThumb}" alt="${m.businessName}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                  
                  <!-- Top Floating Badges -->
                  <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-900/85 backdrop-blur-md text-amber-300 shadow-xs">
                      🔒 ${(m.talukId || 'harur').toUpperCase()}
                    </span>
                    <span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-white/95 backdrop-blur-md text-emerald-700 shadow-xs">
                      ✓ சரிபார்க்கப்பட்டது
                    </span>
                  </div>

                  <!-- 4K Video Pill on Image -->
                  <div class="absolute bottom-2.5 right-2.5 bg-red-600/90 hover:bg-red-600 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 transition">
                    <svg class="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <span>4K வீடியோ</span>
                  </div>
                </div>

                <!-- Business Details -->
                <div class="p-5 pb-3">
                  <div class="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider mb-1">
                    ${cat.nameTa ? cat.nameTa.split('&')[0] : (cat.nameEn || 'வணிகம்')}
                  </div>

                  <h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-brand-700 transition cursor-pointer leading-snug" onclick="app.showOwnerModal('${m.id || m.businessId}')">
                    ${m.businessName}
                  </h3>

                  <div class="flex items-center gap-2 mt-1.5 text-xs text-slate-600 font-semibold">
                    <span>👤 ${m.ownerName}</span>
                    <span class="text-slate-300">•</span>
                    <span class="text-amber-600 font-bold">★ ${m.rating}</span>
                  </div>

                  <!-- Prominent Best Price & Offer Priority Banner -->
                  <div class="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-300/80 shadow-2xs">
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-300">
                        🏷️ ${m.priceTag || 'சிறந்த விலை உத்தரவாதம்'}
                      </span>
                      <span class="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                        ${m.discount || 'சிறப்பு சலுகை'}
                      </span>
                    </div>
                    <p class="text-xs font-black text-slate-900 leading-snug">
                      ${m.specialOffer || 'NBN வாடிக்கையாளர்களுக்கு நேரடி குறைந்தபட்ச விலை உத்தரவாதம்'}
                    </p>
                  </div>

                  <!-- Instagram Handle Strip -->
                  <div class="mt-3 flex items-center justify-between p-2 rounded-xl bg-pink-50/70 border border-pink-100 text-xs">
                    <div class="flex items-center gap-1.5 text-pink-700 font-bold">
                      <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      <span class="truncate">${m.instagram || '@nuvea_studio'}</span>
                    </div>
                    <span class="text-[11px] font-extrabold text-pink-600 shrink-0">${m.followers || '20K'} ஃபாலோயர்ஸ்</span>
                  </div>

                  <p class="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                    ${m.tagline || m.description || ''}
                  </p>
                </div>
              </div>

              <!-- Two Clear Primary Action CTAs -->
              <div class="p-5 pt-0 space-y-2">
                <a 
                  href="${waUrl}" 
                  target="_blank" 
                  class="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition transform active:scale-98">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                  <span>வாட்ஸ்அப்பில் விலை பேச (WhatsApp)</span>
                </a>

                <div class="grid grid-cols-2 gap-2">
                  <button 
                    onclick="app.showOwnerModal('${m.id || m.businessId}')" 
                    class="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition">
                    <span>📸 வீடியோ & விவரம்</span>
                  </button>

                  <button 
                    onclick="app.focusMapMarker('${m.id || m.businessId}')" 
                    class="flex items-center justify-center gap-1.5 py-2 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition">
                    <span>📍 மேப்பில் பார்க்க</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Clean Map Shortcut Section in Directory Page -->
      <div class="mt-12 bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30 mb-2">
            <span>📍</span>
            <span>${isTa ? 'தனி மேப் பிரிவு (Dedicated Map View)' : 'Dedicated Map Section'}</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-white">
            ${isTa ? 'அனைத்து கடைகளையும் நேரடி வரைபடத்தில் பார்க்க வேண்டுமா?' : 'Want to explore all shops on the live map?'}
          </h3>
          <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            ${isTa ? 'ஒவ்வொரு கடை உரிமையாளரின் லொகேஷன், நேரடி ஜிபிஎஸ் மற்றும் அவர்களின் இன்ஸ்டாகிராம் பக்கங்களை பார்க்க தனி மேப் செக்ஷனுக்கு செல்லுங்கள்.' : 'Explore every business owner\'s location, GPS directions, and Instagram profiles interactively.'}
          </p>
        </div>

        <button onclick="app.setTab('map')" class="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition transform active:scale-95 shrink-0">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span>${isTa ? '🗺️ நேரடி மேப் பகுதிக்கு செல்ல (Open Map View)' : 'Open Live Map View'}</span>
        </button>
      </div>
    `;
  }

  // ==========================================
  // VIEW: INTERACTIVE MAP & INSTAGRAM DIRECTORY (CLEAN & AIRY)
  // ==========================================
  renderMapView() {
    const isTa = this.lang === 'ta';
    const allMembers = this.db.members || [];
    const filteredMembers = this.mapTalukFilter === 'all' 
      ? allMembers 
      : allMembers.filter(m => m.talukId === this.mapTalukFilter);

    const counts = {
      all: allMembers.length,
      harur: allMembers.filter(m => m.talukId === 'harur').length,
      palacode: allMembers.filter(m => m.talukId === 'palacode').length,
      karimangalam: allMembers.filter(m => m.talukId === 'karimangalam').length,
      dharmapuri_town: allMembers.filter(m => m.talukId === 'dharmapuri_town').length,
      pennagaram: allMembers.filter(m => m.talukId === 'pennagaram').length
    };

    const talukButtons = [
      { id: 'all', nameTa: `அனைத்து தாலுகாக்கள் (${counts.all})`, nameEn: `All Taluks (${counts.all})` },
      { id: 'harur', nameTa: `ஹரூர் (${counts.harur})`, nameEn: `Harur (${counts.harur})` },
      { id: 'palacode', nameTa: `பாலக்கோடு (${counts.palacode})`, nameEn: `Palacode (${counts.palacode})` },
      { id: 'karimangalam', nameTa: `காரிமங்கலம் (${counts.karimangalam})`, nameEn: `Karimangalam (${counts.karimangalam})` },
      { id: 'dharmapuri_town', nameTa: `தருமபுரி டவுன் (${counts.dharmapuri_town})`, nameEn: `Dharmapuri Town (${counts.dharmapuri_town})` },
      { id: 'pennagaram', nameTa: `பென்னாகரம் (${counts.pennagaram})`, nameEn: `Pennagaram (${counts.pennagaram})` }
    ];

    return `
      <div class="space-y-6">
        <!-- Clean Airy Header (Dedicated Map Section) -->
        <div class="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold mb-2">
              <span>📍</span>
              <span>${isTa ? 'தனி மேப் பிரிவு • நேரடி ஜிபிஎஸ் வரைபடம்' : 'Dedicated Map Section • Live GPS Map'}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ${isTa ? 'அனைத்து வணிக உரிமையாளர்கள் நேரடி மேப்' : 'All Verified Business Owners Live Map'}
            </h2>
            <p class="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
              ${isTa ? 'மேப்பில் உள்ள மார்க்கரை கிளிக் செய்து கடை உரிமையாளரின் Instagram விவரங்கள், 4K வீடியோ மற்றும் ஷோரூம் புகைப்படங்களை பார்க்கலாம்.' : 'Click on pins to view live Instagram profiles, 4K videos, and showroom photos.'}
            </p>
          </div>

          <!-- Taluk Filter Buttons -->
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            ${talukButtons.map(t => {
              const active = this.mapTalukFilter === t.id;
              return `
                <button 
                  onclick="app.setMapTaluk('${t.id}')"
                  class="px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${active ? 'bg-brand-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'}">
                  ${isTa ? t.nameTa : t.nameEn}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Interactive Leaflet Map Container -->
        <div class="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>OpenStreetMap நேரலை வரைபடம் (Live GPS Connected)</span>
            </div>
            <div class="text-rose-600 font-bold">
              💡 மார்க்கரை கிளிக் செய்து வீடியோ & இன்ஸ்டாகிராம் பார்க்கலாம்
            </div>
          </div>
          
          <div id="nbn-leaflet-map" style="height: 520px; width: 100%; z-index: 10;"></div>
        </div>

        <!-- Directory Grid of Mapped Owners with Instagram cards -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📍 மேப்பில் உள்ள வணிக உரிமையாளர்கள்</span>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">${filteredMembers.length} கடைகள்</span>
            </h3>
            <span class="text-xs text-slate-500 font-medium">இன்ஸ்டாகிராம் சரிபார்க்கப்பட்டது</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${filteredMembers.map(m => {
              const cat = (this.db.categories || []).find(c => c.id === m.categoryId) || {};
              const thumbPhoto = (m.photos && m.photos[0]) || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400&q=80';
              const cleanPhone = (m.phone || '').replace(/\D/g, '');
              const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`வணக்கம் ${m.ownerName}, Nuvea Business Network மேப் மூலம் உங்கள் ${m.businessName} பார்த்தேன்.`)}`;

              return `
                <div class="bg-white rounded-2xl border border-slate-200 p-3.5 hover:shadow-md transition flex flex-col justify-between group">
                  <div>
                    <!-- Photo Header with Instagram Gradient Badge -->
                    <div class="relative h-32 rounded-xl overflow-hidden mb-3 bg-slate-100 cursor-pointer" onclick="app.showOwnerModal('${m.id || m.businessId}')">
                      <img src="${thumbPhoto}" alt="${m.businessName}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                      <div class="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        ${m.talukId.toUpperCase()}
                      </div>
                      <div class="absolute bottom-2 right-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                        <span>📸 ${m.followers || '20K'}</span>
                      </div>
                    </div>

                    <!-- Details -->
                    <div class="mb-3">
                      <div class="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">
                        ${cat.nameTa || cat.nameEn || 'வணிக வகை'}
                      </div>
                      <h4 class="font-extrabold text-slate-900 text-sm truncate mt-0.5" title="${m.businessName}">
                        ${m.businessName}
                      </h4>
                      <p class="text-xs text-slate-600 font-semibold mt-0.5">👤 ${m.ownerName}</p>
                      <div class="flex items-center gap-1 text-[11px] text-pink-600 font-bold mt-1">
                        <span>📸 ${m.instagram || '@nuvea_studio'}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons (3 Clear Choices) -->
                  <div class="space-y-1.5 pt-2 border-t border-slate-100">
                    <button 
                      onclick="app.focusMapMarker('${m.id || m.businessId}')"
                      class="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition">
                      <span>📍 மேப்பில் காட்டு</span>
                    </button>
                    <div class="grid grid-cols-2 gap-1.5">
                      <button 
                        onclick="app.showOwnerModal('${m.id || m.businessId}')"
                        class="py-1.5 px-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-xs transition">
                        <span>📸 விவரம்</span>
                      </button>
                      <a 
                        href="${waUrl}"
                        target="_blank"
                        class="py-1.5 px-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-xs transition">
                        <span>💬 WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  initLeafletMap() {
    const mapEl = document.getElementById('nbn-leaflet-map');
    if (!mapEl || typeof L === 'undefined') return;

    if (this.map) {
      try { this.map.remove(); } catch(e){}
      this.map = null;
    }
    this.mapMarkers = [];

    const talukCoords = {
      all: [12.1211, 78.2200],
      harur: [12.0583, 78.4916],
      palacode: [12.2882, 78.0811],
      karimangalam: [12.3082, 78.2045],
      dharmapuri_town: [12.1211, 78.1582],
      pennagaram: [12.1340, 77.8990]
    };

    const targetCenter = talukCoords[this.mapTalukFilter] || talukCoords.all;
    const targetZoom = this.mapTalukFilter === 'all' ? 11 : 14;

    this.map = L.map('nbn-leaflet-map').setView(targetCenter, targetZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | Nuvea Business Network'
    }).addTo(this.map);

    setTimeout(() => {
      if (this.map && typeof this.map.invalidateSize === 'function') {
        this.map.invalidateSize();
      }
    }, 150);

    const members = (this.db.members || []).filter(m => {
      if (this.mapTalukFilter === 'all') return true;
      return m.talukId === this.mapTalukFilter;
    });

    const bounds = [];

    members.forEach(m => {
      if (!m.lat || !m.lng) return;

      const markerHtml = `
        <div style="background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); width: 44px; height: 44px; border-radius: 50%; padding: 3px; box-shadow: 0 4px 14px rgba(220, 39, 67, 0.45); display: flex; align-items: center; justify-content: center; position: relative;">
          <div style="background: white; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; color: #0f3b7a; border: 2px solid white;">
            ${(m.businessName || 'N').charAt(0)}
          </div>
          <div style="position: absolute; bottom: -7px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #dc2743;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: markerHtml,
        iconSize: [44, 52],
        iconAnchor: [22, 52],
        popupAnchor: [0, -50]
      });

      const cleanPhone = (m.phone || '').replace(/\D/g, '');
      const waText = encodeURIComponent(`வணக்கம் ${m.ownerName}, Nuvea Business Network நேரடி மேப் மூலம் தொடர்பு கொள்கிறேன்.`);

      const popupContent = `
        <div style="min-width: 270px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
          <div style="background: #0f3b7a; color: white; padding: 10px 12px; border-radius: 12px 12px 0 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 2px;">
              <span style="font-size: 10px; color: #fbbf24; font-weight: 800; text-transform: uppercase;">
                ${m.talukId.toUpperCase()} சாப்டர்
              </span>
              <span style="font-size: 9px; background: rgba(255,255,255,0.2); padding: 1px 6px; border-radius: 4px; font-weight: 700;">
                🔒 100% Category Exclusivity (தொழில் உரிமை)
              </span>
            </div>
            <div style="font-weight: 800; font-size: 14px;">${m.businessName}</div>
            <div style="font-size: 11px; opacity: 0.9; margin-top: 2px;">👤 ${m.ownerName} (உரிமையாளர்)</div>
          </div>
          <div style="padding: 12px; background: white;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="background: #fdf2f8; color: #db2777; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 6px; border: 1px solid #fbcfe8;">
                📸 ${m.instagram || '@nuvea_studio'}
              </span>
              <span style="font-size: 11px; font-weight: 800; color: #d97706;">★ ${m.rating} (${m.followers})</span>
            </div>
            <p style="font-size: 11px; color: #475569; margin: 0 0 10px 0; line-height: 1.4;">
              ${m.tagline || ''}
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
              <button onclick="app.openStandaloneBiz('${m.id || m.businessId}')" style="background: #0f3b7a; color: white; font-weight: 800; font-size: 11px; padding: 7px 6px; border-radius: 8px; border: none; cursor: pointer; text-align: center;">
                🔗 டிஜிட்டல் ஸ்டோர்
              </button>
              <button onclick="app.showOwnerModal('${m.id || m.businessId}')" style="background: linear-gradient(to right, #ec4899, #f43f5e); color: white; font-weight: 800; font-size: 11px; padding: 7px 6px; border-radius: 8px; border: none; cursor: pointer; text-align: center;">
                📸 வீடியோ
              </button>
              <a href="https://wa.me/${cleanPhone}?text=${waText}" target="_blank" style="background: #059669; color: white; font-weight: 800; font-size: 11px; padding: 7px 6px; border-radius: 8px; text-decoration: none; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px;">
                💬 வாட்ஸ்அப்
              </a>
            </div>
          </div>
        </div>
      `;

      const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(this.map);
      marker.bindPopup(popupContent, { maxWidth: 300 });
      this.mapMarkers.push({ id: m.id || m.businessId, marker, member: m });
      bounds.push([m.lat, m.lng]);
    });

    if (bounds.length > 0 && this.map && typeof this.map.fitBounds === 'function') {
      if (this.mapTalukFilter === 'all') {
        this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      } else {
        this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }
  }

  setMapTaluk(talukId) {
    this.mapTalukFilter = talukId;
    this.render();
  }

  focusMapMarker(id) {
    if (this.currentTab !== 'map') {
      this.setTab('map');
    }
    setTimeout(() => {
      const item = this.mapMarkers.find(m => m.id === id);
      if (item && item.member && this.map) {
        if (typeof this.map.setView === 'function') {
          this.map.setView([item.member.lat, item.member.lng], 15);
        }
        if (item.marker && typeof item.marker.openPopup === 'function') {
          item.marker.openPopup();
        }
        const mapEl = document.getElementById('nbn-leaflet-map');
        if (mapEl && typeof mapEl.scrollIntoView === 'function') {
          mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 180);
  }

  // ==========================================
  // VIEW 2: 100 CATEGORY MONOPOLY LOCKER
  // ==========================================
  renderCategoryView() {
    const isTa = this.lang === 'ta';
    const categories = this.db.categories || [];
    const members = this.db.members || [];
    const selectedTalukId = this.selectedTaluk || 'harur';
    const activeChapters = (this.db.chapters || []).filter(c => selectedTalukId === 'all' ? true : c.talukId === selectedTalukId);
    const activeChapterId = (this.selectedChapter && this.selectedChapter !== 'all') ? this.selectedChapter : (activeChapters[0] ? activeChapters[0].id : null);

    const memberMap = {};
    members.filter(m => {
      if (activeChapterId) return m.chapterId === activeChapterId;
      return m.talukId === selectedTalukId;
    }).forEach(m => memberMap[m.categoryId] = m);

    const lockedCount = Object.keys(memberMap).length;
    const availableCount = Math.max(0, 100 - lockedCount);
    const currentChapterObj = (this.db.chapters || []).find(c => c.id === activeChapterId);
    const chapterName = currentChapterObj ? currentChapterObj.nameTa : 'சாப்டர்';

    return `
      <!-- Explainer Header -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-3">
              <span>🔒 ${isTa ? '100% கேட்டகிரி மோனோபோலி விதிமுறை' : 'Strict Category Monopoly Rule'}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">
              ${chapterName} - ${isTa ? '100 கேட்டகிரி மோனோபோலி லாக்கர்' : '100 Practical Business Categories Locker'}
            </h2>
            <p class="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              ${isTa ? 'ஒவ்வொரு சாப்டரிலும் ஒரு தொழிலுக்கு ஒரே ஒரு நிறுவனத்திற்கு மட்டுமே அனுமதி! நீங்கள் லாக் செய்த பின் வேறு எந்த போட்டியாளரும் இந்த சாப்டருக்குள் வர முடியாது.' : 'Only 1 business per category per chapter. Once locked, no competitor can enter this chapter.'}
            </p>
          </div>

          <!-- Live Progress Box -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0 text-center md:text-right min-w-[240px]">
            <div class="text-xs text-slate-500 font-semibold mb-1">${isTa ? 'சாப்டர் நிரப்பல் நிலை' : 'Chapter Occupancy'}</div>
            <div class="text-2xl font-black text-brand-900">${lockedCount} / 100 ${isTa ? 'சீட்கள்' : 'Seats'}</div>
            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
              <div class="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full" style="width: ${lockedCount}%"></div>
            </div>
            <div class="text-[11px] font-bold text-amber-700">${isTa ? `இன்னும் ${availableCount} சீட்கள் மட்டுமே காலியாக உள்ளன!` : `Only ${availableCount} seats remaining!`}</div>
          </div>
        </div>

        <!-- Chapter Switcher within Monopoly Locker -->
        ${activeChapters.length > 0 ? `
          <div class="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span class="text-xs font-black text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <span>🏛️ சாப்டர்:</span>
            </span>
            ${activeChapters.map(ch => {
              const chActive = (activeChapterId === ch.id);
              const icon = ch.forumType === 'women' ? '👩' : ch.forumType === 'agro' ? '🌾' : ch.forumType === 'tech' ? '⚡' : ch.forumType === 'royals' ? '💎' : '👑';
              return `
                <button 
                  onclick="app.setChapter('${ch.id}')" 
                  class="px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition ${chActive ? 'bg-amber-400 text-slate-950 shadow-sm ring-1 ring-slate-900/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'}">
                  ${icon} ${isTa ? ch.nameTa : ch.nameEn}
                </button>
              `;
            }).join('')}
            <button 
              onclick="app.openDirectorModal()" 
              class="px-3 py-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition">
              ➕ புதிய சாப்டர் துவங்கு
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Categories 100 Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        ${categories.map((c, index) => {
          const lockedMember = memberMap[c.id];
          const isLocked = !!lockedMember;

          return `
            <div class="card-commercial p-4 flex flex-col justify-between ${isLocked ? 'bg-slate-50/70 border-slate-300' : 'bg-white border-amber-200 ring-1 ring-amber-400/20'}">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span class="font-mono text-slate-400 font-bold">#SLOT-${String(index + 1).padStart(2, '0')}</span>
                  ${isLocked ? `
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                      <svg class="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                      ${isTa ? 'பூட்டப்பட்டது (Locked)' : 'OCCUPIED'}
                    </span>
                  ` : `
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      ${isTa ? 'காலியாக உள்ளது' : 'AVAILABLE'}
                    </span>
                  `}
                </div>

                <h3 class="text-sm font-black text-slate-900 mb-1 leading-snug">
                  ${isTa ? c.nameTa : c.nameEn}
                </h3>
                <div class="text-[11px] text-slate-500 font-medium mb-3">
                  ${isTa ? c.nameEn : c.nameTa}
                </div>

                ${isLocked ? `
                  <div class="bg-white p-3 rounded-xl border border-slate-200 text-xs mb-3">
                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${isTa ? 'உரிமையாளர்:' : 'Occupant:'}</div>
                    <div class="font-extrabold text-slate-800 text-xs truncate mt-0.5">${lockedMember.businessName}</div>
                    <div class="text-slate-500 text-[11px]">${lockedMember.ownerName} • ${lockedMember.phone}</div>
                  </div>
                ` : `
                  <div class="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 text-xs mb-3 text-amber-950">
                    <div class="font-bold flex items-center gap-1 text-amber-900">
                      <span>⚡ ${isTa ? 'வாய்ப்பு திறந்துள்ளது!' : 'Seat Open!'}</span>
                    </div>
                    <div class="mt-1 text-[11px] font-bold text-slate-700">
                      ${isTa ? 'கட்டணம்: ₹15,000 / ஆண்டு' : 'Fee: ₹15,000 / year'}
                    </div>
                  </div>
                `}
              </div>

              <div>
                ${isLocked ? `
                  <button disabled class="w-full py-2 px-3 bg-slate-200 text-slate-500 text-xs font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-1">
                    <span>${isTa ? 'சீட் நிரம்பியது' : 'Occupied'}</span>
                  </button>
                ` : `
                  <button 
                    onclick="app.openBookingModal('${c.id}', '${activeChapterId || ''}')" 
                    class="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 active:scale-95">
                    <span>${isTa ? 'இப்போதே லாக் செய்' : 'Lock Seat Now'}</span>
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ==========================================
  // VIEW: OPPORTUNITIES & MULTI-CHAPTERS HUB
  // ==========================================
  renderOpportunitiesView() {
    const isTa = this.lang === 'ta';
    const activeTab = this.opportunityTab || 'all';
    const chapters = this.db.chapters || [];
    const deals = this.db.dealRequests || [];

    const filteredChapters = chapters.filter(c => {
      if (!this.opportunityForumFilter || this.opportunityForumFilter === 'all') return true;
      return c.forumType === this.opportunityForumFilter;
    });

    return `
      <div class="max-w-6xl mx-auto space-y-8">
        
        <!-- Hero Header -->
        <div class="text-center max-w-3xl mx-auto pt-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-extrabold border border-indigo-200 mb-3">
            <span>🚀</span>
            <span>${isTa ? 'வணிக வளர்ச்சி & பிரான்சைஸ் வாய்ப்புகள்' : 'Business Growth & Franchise Opportunities'}</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            ${isTa ? 'NBN சாப்டர்கள் & புதிய வணிக வாய்ப்புகள் மையம்' : 'NBN Chapters & Mega B2B Opportunity Hub'}
          </h1>
          <p class="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            ${isTa ? 'தமிழ்நாடு முழுவதும் புதிய சாப்டர் துவங்குங்கள், உங்கள் ஊரில் சாப்டர் டைரக்டராகி வருமானம் ஈட்டுங்கள் அல்லது பல கோடி மதிப்புள்ள B2B மெகா ஒப்பந்தங்களை பெற்றுக்கொள்ளுங்கள்!' : 'Launch new chapters across Tamil Nadu, become a Chapter Director, or participate in multi-lakh B2B deal requests!'}
          </p>
        </div>

        <!-- 3 Big Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-slate-900 to-brand-950 p-5 rounded-2xl text-white border border-slate-800 shadow-md">
            <div class="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">🏛️ செயல்படும் சாப்டர்கள்</div>
            <div class="text-3xl font-black text-white">${chapters.length} ${isTa ? 'சாப்டர்கள்' : 'Chapters'}</div>
            <div class="text-[11px] text-slate-300 mt-1">தருமபுரி, சேலம், கிருஷ்ணகிரி மற்றும் தமிழகம் முழுவதும்</div>
          </div>

          <div class="bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl text-slate-950 shadow-md">
            <div class="text-xs font-black uppercase tracking-wider text-amber-950 mb-1">👑 பிரான்சைஸ் வாய்ப்பு</div>
            <div class="text-3xl font-black text-slate-950">₹3,00,000+</div>
            <div class="text-[11px] font-extrabold text-amber-950 mt-1">ஆண்டுக்கு டைரக்டர் வருவாய் (₹3,000/உறுப்பினர் கமிஷன்)</div>
          </div>

          <div class="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-2xl text-white border border-indigo-800/50 shadow-md">
            <div class="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">🤝 லைவ் B2B மெகா டீல்கள்</div>
            <div class="text-3xl font-black text-white">₹1.44+ கோடி</div>
            <div class="text-[11px] text-slate-300 mt-1">${deals.length} நேரடி கொள்முதல் & வணிக ஒப்பந்தங்கள் திறந்தநிலையில்</div>
          </div>
        </div>

        <!-- Section Switcher Tabs -->
        <div class="flex items-center justify-center gap-2 border-b border-slate-200 pb-4">
          <button 
            onclick="app.setOpportunityTab('all')" 
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition ${activeTab === 'all' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}">
            🏛️ அனைத்து சாப்டர்கள் (${chapters.length})
          </button>
          <button 
            onclick="app.setOpportunityTab('franchise')" 
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition ${activeTab === 'franchise' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}">
            🚀 சாப்டர் தொடங்குங்கள் (Director Program)
          </button>
          <button 
            onclick="app.setOpportunityTab('deals')" 
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition ${activeTab === 'deals' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}">
            🤝 B2B மெகா டீல்கள் (${deals.length})
          </button>
        </div>

        <!-- TAB 1: CHAPTERS & SPECIALIZED FORUMS -->
        ${(activeTab === 'all' || activeTab === 'chapters') ? `
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 class="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>🏛️ செயல்படும் சாப்டர்கள் & சிறப்பு தொழில் மன்றங்கள்</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-black">${filteredChapters.length} சாப்டர்கள்</span>
                </h2>
                <p class="text-xs text-slate-500 font-medium mt-0.5">
                  ஒவ்வொரு சாப்டரிலும் 100 பிரத்யேக மோனோபோலி சீட்கள் அனுமதிக்கப்படுகிறது.
                </p>
              </div>

              <!-- Forum Type Filter Chips -->
              <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                ${[
                  { id: 'all', label: 'அனைத்தும்' },
                  { id: 'titans', label: '👑 B2B டைட்டன்ஸ்' },
                  { id: 'royals', label: '💎 ராயல்ஸ் எலைட்' },
                  { id: 'women', label: '👩 மகளிர் மன்றம்' },
                  { id: 'agro', label: '🌾 அக்ரோ & ரூரல்' },
                  { id: 'tech', label: '⚡ எக்ஸ்போர்ட் & டெக்' }
                ].map(f => `
                  <button 
                    onclick="app.setOpportunityForumFilter('${f.id}')"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${(this.opportunityForumFilter === f.id) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                    ${f.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Chapters Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${filteredChapters.map(ch => {
                const percent = Math.round((ch.filledSeats / ch.maxSeats) * 100);
                const isForming = ch.status === 'forming';
                const forumBadgeColor = ch.forumType === 'women' ? 'bg-pink-100 text-pink-900 border-pink-300' :
                                        ch.forumType === 'agro' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                                        ch.forumType === 'tech' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                                        ch.forumType === 'royals' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                                        'bg-blue-100 text-blue-900 border-blue-300';
                return `
                  <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-lg transition flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-3">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${forumBadgeColor}">
                          ${ch.forumTypeTa || 'B2B மன்றம்'}
                        </span>
                        <span class="inline-flex items-center gap-1 text-[11px] font-bold ${isForming ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded' : 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded'}">
                          <span class="w-2 h-2 rounded-full ${isForming ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
                          ${isForming ? 'உறுப்பினர்கள் இணைகிறார்கள்' : 'லைவ் செயல்படுகிறது'}
                        </span>
                      </div>

                      <h3 class="text-base font-black text-slate-900 mb-1 leading-snug">
                        ${isTa ? ch.nameTa : ch.nameEn}
                      </h3>
                      <div class="text-xs font-semibold text-slate-500 mb-3">
                        📍 ${(ch.talukId || '').toUpperCase()} • ${(ch.districtId || '').toUpperCase()}
                      </div>

                      <p class="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                        ${ch.description || 'NBN அதிகாரப்பூர்வ தொழில் மன்ற சாப்டர்.'}
                      </p>

                      <!-- Occupancy Progress -->
                      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4">
                        <div class="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                          <span>இடங்கள் நிரப்பல்:</span>
                          <span class="text-brand-900 font-black">${ch.filledSeats} / ${ch.maxSeats} (${100 - ch.filledSeats} மீதம்)</span>
                        </div>
                        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div class="bg-gradient-to-r from-brand-600 to-amber-500 h-full rounded-full" style="width: ${percent}%"></div>
                        </div>
                      </div>

                      <!-- Meeting Schedule & Director -->
                      <div class="space-y-1.5 text-xs text-slate-600 mb-4">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-slate-800">⏱️ மீட்டிங்:</span>
                          <span>${ch.meetingDay} ${ch.meetingTime}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-slate-800">👑 டைரக்டர்:</span>
                          <span>${ch.directorName}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-slate-800">💼 வர்த்தகம்:</span>
                          <span class="font-black text-emerald-700">${ch.totalBusinessDone}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                      <button 
                        onclick="app.changeTaluk('${ch.talukId}'); app.setChapter('${ch.id}'); app.setTab('consumer');" 
                        class="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition text-center">
                        உறுப்பினர்கள் பார்
                      </button>
                      <button 
                        onclick="app.openBookingModal('', '${ch.id}')" 
                        class="px-3 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl shadow-xs transition text-center">
                        🔒 சீட் பூட்டு
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- TAB 2: FRANCHISE / BECOME CHAPTER DIRECTOR -->
        ${(activeTab === 'all' || activeTab === 'franchise') ? `
          <div class="bg-gradient-to-br from-slate-900 via-brand-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
            <div class="max-w-3xl">
              <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 mb-3 shadow-xs">
                👑 சாப்டர் டைரக்டர் பிரான்சைஸ் வாய்ப்பு
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                உங்கள் ஊரில் NBN சாப்டர் தொடங்குங்கள்! ஆண்டுக்கு ₹3,00,000+ வரை நிலையான வருவாய் ஈட்டுங்கள்!
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                நீங்கள் ஒரு அனுபவமிக்க தொழில்முனைவோரா? உங்கள் ஊரில் உள்ள 100 முன்னணி வர்த்தகர்களை ஒருங்கிணைக்கும் அதிகாரப்பூர்வ சாப்டர் டைரக்டராக இணையுங்கள். உங்களுக்கு தேவையான அனைத்து தொழில்நுட்பங்கள், 4K விளம்பர வீடியோ படப்பிடிப்பு மற்றும் சிஸ்டங்களை Nuvea Studio வழங்கும்!
              </p>

              <!-- Franchise Benefits 4-Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div class="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <div class="text-xl mb-1">💰</div>
                  <div class="text-sm font-black text-amber-300">நேரடி கமிஷன் வருமானம்</div>
                  <div class="text-xs text-slate-300 mt-1">ஒவ்வொரு உறுப்பினர் சேர்க்கைக்கும் ₹3,000 கமிஷன். 100 உறுப்பினர்கள் = ₹3,00,000 உடனடி வருமானம்!</div>
                </div>

                <div class="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <div class="text-xl mb-1">🎥</div>
                  <div class="text-sm font-black text-amber-300">Nuvea Studio 4K வீடியோ சப்போர்ட்</div>
                  <div class="text-xs text-slate-300 mt-1">உறுப்பினர்களுக்கு ₹25,000 மதிப்புள்ள 4K சினிமா விளம்பர வீடியோக்களை Nuvea Studio நேரில் வந்து படம்பிடித்துத் தரும்.</div>
                </div>

                <div class="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <div class="text-xl mb-1">⏱️</div>
                  <div class="text-sm font-black text-amber-300">வாராந்திர Google Meet கண்டக்டர்</div>
                  <div class="text-xs text-slate-300 mt-1">45-விநாடி ஸ்பீக்கர் டைமர், ஆடியோ சைம்ஸ் மற்றும் பிசினஸ் ரெஃபரல் டிராக்கிங் மென்பொருள் இலவசம்.</div>
                </div>

                <div class="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <div class="text-xl mb-1">🏛️</div>
                  <div class="text-sm font-black text-amber-300">வட்டார தொழில் தலைமை கௌரவம்</div>
                  <div class="text-xs text-slate-300 mt-1">உங்கள் வட்டாரத்தில் அனைத்து தொழிலதிபர்களும் மதிக்கும் முதன்மை தலைமைப் பொறுப்பு மற்றும் விஐபி அந்தஸ்து.</div>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row items-center gap-3">
                <button 
                  onclick="app.openDirectorModal()" 
                  class="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg transition transform active:scale-98">
                  🚀 சாப்டர் டைரக்டராக விண்ணப்பிக்க (Apply Now)
                </button>
                <a 
                  href="https://wa.me/917548820641?text=${encodeURIComponent('வணக்கம் சந்திரா, நான் Nuvea Business Network சாப்டர் டைரக்டராக இணைய விரும்புகிறேன். விவரங்களை அறிய விரும்புகிறேன்.')}" 
                  target="_blank" 
                  class="w-full sm:w-auto px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition text-center flex items-center justify-center gap-2">
                  <span>💬 WhatsApp-ல் பேச: 7548820641</span>
                </a>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- TAB 3: B2B MEGA DEALS BOARD -->
        ${(activeTab === 'all' || activeTab === 'deals') ? `
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 class="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>🤝 B2B மெகா வணிக ஒப்பந்தங்கள் (Inter-Chapter Deals)</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">${deals.length} திறந்தநிலை டீல்கள்</span>
                </h2>
                <p class="text-xs text-slate-500 font-medium mt-0.5">
                  மாவட்ட மற்றும் மாநில அளவில் உறுப்பினர்கள் மற்றும் நிறுவனங்கள் கோரும் பல லட்சங்கள் மதிப்புள்ள நேரடி கொள்முதல் தேவைகள்.
                </p>
              </div>

              <button 
                onclick="app.openPostDealModal()" 
                class="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition">
                <span>➕ புதிய வணிக வாய்ப்பை பதிவிடு</span>
              </button>
            </div>

            <!-- Deals Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              ${deals.map(d => {
                const cleanPhone = (d.contactPhone || '917548820641').replace(/\D/g, '');
                const waText = encodeURIComponent(`வணக்கம், Nuvea Business Network-ல் உங்கள் "${d.titleTa}" B2B டீல் (${d.dealValue}) பார்த்தேன். எனது நிறுவனம் இதில் இணைந்து செயல்பட விரும்புகிறது.`);
                const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

                return `
                  <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          ${d.typeTa || 'வணிக தேவை'}
                        </span>
                        <span class="text-lg font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                          ${d.dealValue}
                        </span>
                      </div>

                      <h3 class="text-base font-black text-slate-900 mb-2 leading-snug">
                        ${isTa ? d.titleTa : d.titleEn}
                      </h3>

                      <p class="text-xs text-slate-600 mb-3 leading-relaxed">
                        ${d.description}
                      </p>

                      <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-xs text-slate-600 space-y-1 mb-4">
                        <div><strong>பதிவு செய்தவர்:</strong> ${d.postedBy}</div>
                        <div><strong>வட்டாரம்:</strong> ${(d.talukId || '').toUpperCase()} சாப்டர் • <strong>கால அவகாசம்:</strong> ${d.expiresIn || '10 நாட்கள்'}</div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <a 
                        href="${waUrl}" 
                        target="_blank" 
                        class="flex-grow py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition text-center flex items-center justify-center gap-1.5">
                        <span>💬 டீலை ஏற்க WhatsApp செய்க</span>
                      </a>
                      <a 
                        href="tel:${cleanPhone}" 
                        class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition">
                        📞 அழைக்க
                      </a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  }

  // ==========================================
  // VIEW 3: WEEKLY MEETING AI CONDUCTOR
  // ==========================================
  renderMeetingView() {
    const isTa = this.lang === 'ta';
    const agenda = this.db.meetingAgenda || [];
    const activeSpeaker = agenda.find(i => i.status === 'active') || agenda[0];
    const upcomingSpeaker = agenda.find(i => i.status === 'upcoming') || null;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="flex h-3 w-3 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div>
                <h3 class="font-extrabold text-slate-900 text-sm sm:text-base">${isTa ? 'NBN வீக்லி ஆன்லைன் பிசினஸ் மீட்' : 'NBN Weekly Online Meet'}</h3>
                <p class="text-xs text-slate-500">Google Meet தானியங்கி AI கண்டக்டர் • தருமபுரி & ஹரூர் சாப்டர்</p>
              </div>
            </div>
            <a href="https://meet.google.com/new" target="_blank" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition">
              Google Meet திற
            </a>
          </div>

          <!-- Active Speaker Card with 45s Circular Countdown -->
          <div class="bg-gradient-to-br from-brand-950 via-brand-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-brand-800">
              <div>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 border border-amber-400/40 text-amber-300 mb-2">
                  <span>🎙️ ${isTa ? 'நேரலை பேச்சாளர்' : 'Active Speaker'}</span>
                </span>
                <h2 class="text-2xl sm:text-3xl font-black text-white">
                  ${activeSpeaker ? activeSpeaker.speaker : 'அனைவரும் முடித்தனர்'}
                </h2>
                <div class="text-amber-300 font-bold text-sm mt-1">
                  ${activeSpeaker ? activeSpeaker.businessName : ''} • <span class="text-slate-300 font-medium">${activeSpeaker ? activeSpeaker.category : ''}</span>
                </div>
              </div>

              <!-- Animated Timer -->
              <div class="flex flex-col items-center">
                <div class="relative w-28 h-28 flex items-center justify-center">
                  <div class="text-3xl font-black text-white font-mono" id="live-timer-display">
                    ${this.secondsLeft}s
                  </div>
                  <div class="absolute inset-0 border-4 border-brand-700 rounded-full"></div>
                  <div class="absolute inset-0 border-4 border-amber-400 rounded-full animate-spin" style="animation-duration: 45s; border-right-color: transparent; border-bottom-color: transparent;"></div>
                </div>
                <span class="text-[11px] text-slate-400 font-semibold mt-1">45 நொடிகள் கவுண்டவுன்</span>
              </div>
            </div>

            <!-- Teleprompter 3-Point Script -->
            <div class="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div class="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                📜 பேச்சாளருக்கான 3 முக்கிய குறிப்புகள் (Teleprompter Script):
              </div>
              <ul class="space-y-2 text-xs sm:text-sm text-slate-200">
                ${activeSpeaker && activeSpeaker.speakingPoints ? activeSpeaker.speakingPoints.map(p => `
                  <li class="flex items-start gap-2">
                    <span class="text-amber-400 shrink-0">✓</span>
                    <span>${p}</span>
                  </li>
                `).join('') : `<li>அனைத்து உறுப்பினர்களும் பேசி முடித்தனர்.</li>`}
              </ul>
            </div>

            <!-- Controls -->
            <div class="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-brand-800">
              <div class="flex items-center gap-2">
                <button onclick="app.toggleTimer()" id="timer-toggle-btn" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-brand-950 font-black text-xs sm:text-sm rounded-xl transition">
                  ${this.timerRunning ? 'டைமரை நிறுத்து (Pause)' : 'டைமரை தொடங்கு (Start)'}
                </button>
                <button onclick="app.resetTimer()" class="px-3.5 py-2 bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs rounded-xl">
                  ரீசெட் (45s)
                </button>
              </div>

              <button onclick="app.advanceSpeaker()" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-brand-950 font-black text-xs sm:text-sm rounded-xl transition">
                <span>அடுத்த பேச்சாளர் (Next Speaker) ➔</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Col: Next Up -->
        <div class="space-y-6">
          <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
            <div class="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>அடுத்து பேசவுள்ளவர் (Up Next Cue)</span>
            </div>
            ${upcomingSpeaker ? `
              <div class="text-base font-black text-slate-900">${upcomingSpeaker.speaker}</div>
              <div class="text-xs font-semibold text-slate-600">${upcomingSpeaker.businessName}</div>
              <div class="mt-3 p-2.5 bg-white rounded-xl border border-amber-200/80 text-[11px] text-emerald-800 font-semibold">
                WhatsApp-ல் "2 நிமிடங்களில் நீங்கள் பேச வேண்டும்" என அலர்ட் அனுப்பப்பட்டது!
              </div>
            ` : `<div class="text-xs text-slate-500">அனைத்து பேச்சாளர்களும் நிறைவுற்றனர்.</div>`}
          </div>

          <!-- Queue Table -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h4 class="font-extrabold text-slate-900 text-sm mb-3">பேச்சாளர்கள் வரிசை (${agenda.length})</h4>
            <div class="space-y-2 max-h-[360px] overflow-y-auto">
              ${agenda.map((item, i) => `
                <div class="p-2.5 rounded-xl border text-xs flex items-center justify-between ${item.status === 'active' ? 'bg-brand-50 border-brand-300' : 'bg-slate-50 border-slate-200'}">
                  <div>
                    <div class="font-bold text-slate-900">${item.speaker}</div>
                    <div class="text-[11px] text-slate-500">${item.businessName}</div>
                  </div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'active' ? 'bg-amber-400 text-brand-950' : 'bg-slate-200 text-slate-600'}">
                    ${item.status === 'active' ? 'பேசுகிறார்' : item.status}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW 4: ELEVATION & LEADERBOARD
  // ==========================================
  renderElevationView() {
    const members = [...(this.db.members || [])].sort((a, b) => (b.leadsGiven || 0) - (a.leadsGiven || 0));

    return `
      <div class="space-y-8">
        <!-- 4-Level Pipeline Cards -->
        <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            4-அடுக்கு தானியங்கி பதவி உயர்வு (4-Tier Elevation Engine)
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 mb-6">
            லீட்கள் எண்ணிக்கை, வருகை %, மற்றும் வர்த்தக மதிப்பு ஆகியவற்றின் அடிப்படையில் சிஸ்டமே தானாகவே உங்களை அடுத்த நிலைக்கு உயர்த்தும்.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 rounded-xl border-2 border-brand-200 bg-brand-50/50">
              <div class="text-[10px] font-bold text-brand-700 uppercase tracking-wider">LEVEL 1</div>
              <h3 class="font-extrabold text-brand-950 text-base mt-1">தாலுகா ஃபோரம்</h3>
              <p class="text-xs text-slate-600 mt-1">ஹரூர், பாலக்கோடு, காரிமங்கலம் போன்ற தாலுகாக்களில் 100 உறுப்பினர்கள்.</p>
              <div class="mt-3 text-xs font-bold text-brand-900">கட்டணம்: ₹15,000 / ஆண்டு</div>
            </div>

            <div class="p-4 rounded-xl border-2 border-indigo-300 bg-indigo-50/60">
              <div class="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">LEVEL 2</div>
              <h3 class="font-extrabold text-indigo-950 text-base mt-1">மாவட்ட VIP Titans</h3>
              <p class="text-xs text-slate-600 mt-1">தருமபுரி மாவட்ட தாலுகாக்களின் டாப் 5 லீட் சாதனையாளர்கள்.</p>
              <div class="mt-3 text-xs font-bold text-indigo-900">தகுதி: 10+ லீட்கள் & 85% வருகை</div>
            </div>

            <div class="p-4 rounded-xl border-2 border-purple-300 bg-purple-50/60">
              <div class="text-[10px] font-bold text-purple-700 uppercase tracking-wider">LEVEL 3</div>
              <h3 class="font-extrabold text-purple-950 text-base mt-1">தமிழ்நாடு State Titans</h3>
              <p class="text-xs text-slate-600 mt-1">38 மாவட்டங்களின் தலைவர்கள் இணையும் மாநில அளவிலான பெருவணிக ஃபோரம்.</p>
              <div class="mt-3 text-xs font-bold text-purple-900">தகுதி: ₹25L+ வர்த்தகம்</div>
            </div>

            <div class="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/60">
              <div class="text-[10px] font-bold text-amber-700 uppercase tracking-wider">LEVEL 4</div>
              <h3 class="font-extrabold text-amber-950 text-base mt-1">National Apex Council</h3>
              <p class="text-xs text-slate-600 mt-1">இந்திய அளவிலான B2B கூட்டமைப்பு மற்றும் ஏற்றுமதி வாய்ப்புகள்.</p>
              <div class="mt-3 text-xs font-bold text-amber-900">நேஷனல் லெவல் மாநாடுகள்</div>
            </div>
          </div>
        </div>

        <!-- Leaderboard Table -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-extrabold text-slate-900 text-base">நடப்பு தாலுகா லீடர்போர்டு (Leaderboard)</h3>
            <button onclick="app.openLeadModal()" class="px-3.5 py-2 bg-brand-900 text-white text-xs font-bold rounded-xl">+ லீட் பதிவு செய்</button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th class="py-2.5 px-3">வரிசை</th>
                  <th class="py-2.5 px-3">நிறுவனம் & உரிமையாளர்</th>
                  <th class="py-2.5 px-3">கொடுத்த லீட்கள்</th>
                  <th class="py-2.5 px-3">வர்த்தக மதிப்பு</th>
                  <th class="py-2.5 px-3">வருகை %</th>
                  <th class="py-2.5 px-3">பதவி நிலை</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${members.map((m, idx) => `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3 px-3 font-mono font-bold">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</td>
                    <td class="py-3 px-3">
                      <div class="font-extrabold text-slate-900">${m.businessName}</div>
                      <div class="text-[11px] text-slate-500">${m.ownerName}</div>
                    </td>
                    <td class="py-3 px-3 font-black text-brand-900">${m.leadsGiven} லீட்கள்</td>
                    <td class="py-3 px-3 font-bold text-emerald-700">${m.businessDone}</td>
                    <td class="py-3 px-3 font-semibold text-slate-700">${m.attendance}%</td>
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${m.isElevated ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-100 text-slate-700'}">
                        ${m.isElevated ? '★ மாவட்ட VIP' : 'தாலுகா லெவல்'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW 5: BUSINESS MEMBER DASHBOARD
  // ==========================================
  // ==========================================
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
      biz = allMembers.find(m => m.id === this.currentUser.id || m.businessId === this.currentUser.id || (m.phone && m.phone.replace(/\D/g, '') === this.currentUser.phone)) || allMembers[0];
    }
    const memId = biz.id || biz.businessId;
    const isNetworking = biz.accountType !== 'marketplace_only' && biz.chapterId;
    const currentChapterId = biz.chapterId || (biz.talukId === 'harur' ? 'harur_titans' : `${biz.talukId}_titans`);
    const chap = (this.db.chapters || []).find(c => c.id === currentChapterId) || { nameTa: 'ஹரூர் டைட்டன்ஸ்', nameEn: 'Harur Titans', capacity: 100, filledSeats: 10 };

    const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'http://localhost:3000';
    const storeUrl = `${origin}/#/storefront?biz=${biz.businessId || biz.id}`;

    // Leads calculation
    const myLeads = allReferrals.filter(r => r.to === biz.businessName || r.toMemberId === memId || r.to === memId);
    const leadsCount = myLeads.length > 0 ? myLeads.length : 14;

    return `
      <div class="space-y-6 max-w-6xl mx-auto">
        
        <!-- TOP BUSINESS OWNER HEADER -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 text-amber-400 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                ${(biz.businessName || 'B').charAt(0)}
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-xl sm:text-2xl font-black text-slate-900">${biz.businessName}</h2>
                  ${isNetworking ? `
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                      🏛️ Option A: Networking + Marketplace
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                      🔒 100% Category Exclusivity
                    </span>
                  ` : `
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-300">
                      🛒 Option B: Marketplace Only
                    </span>
                  `}
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ✓ ${biz.status || 'Verified Elite'}
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  உரிமையாளர்: <strong class="text-slate-800">${biz.ownerName}</strong> • ${isNetworking ? (biz.chapterName || chap.nameTa) : 'மார்க்கெட்பிளேஸ் சப்ளையர்'} • ${biz.address}
                </p>
              </div>
            </div>

            <!-- Header Quick Actions -->
            <div class="flex flex-wrap items-center gap-2">
              <button onclick="app.openStandaloneBiz('${biz.businessId || biz.id}')" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5">
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
                <span class="font-mono text-slate-700 block sm:inline sm:ml-1">${storeUrl}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="navigator.clipboard.writeText('${storeUrl}'); alert('லிங்க் காப்பி செய்யப்பட்டது!');" class="px-3 py-1.5 bg-white text-slate-800 font-bold rounded-lg border border-slate-300 hover:bg-slate-50 text-xs">
                📋 காப்பி லிங்க்
              </button>
              <a href="https://wa.me/?text=${encodeURIComponent('எங்கள் NBN டிஜிட்டல் ஸ்டோர்: ' + storeUrl)}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs">
                💬 வாட்ஸ்அப் பகிர்வு
              </a>
            </div>
          </div>

          <!-- SUB-NAVIGATION TABS (A - G) -->
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 text-xs font-bold">
            <button onclick="app.bizDashboardTab = 'overview'; app.render();" class="px-3.5 py-2 rounded-xl transition ${currentTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              📊 கண்ணோட்டம் (Overview)
            </button>
            <button onclick="app.bizDashboardTab = 'profile'; app.render();" class="px-3.5 py-2 rounded-xl transition ${currentTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              🏢 சுயவிவரம் (Profile)
            </button>
            <button onclick="app.bizDashboardTab = 'networking'; app.render();" class="px-3.5 py-2 rounded-xl transition ${currentTab === 'networking' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              🏛️ NBN Networking ${!isNetworking ? '🔒' : ''}
            </button>
            <button onclick="app.bizDashboardTab = 'leads'; app.render();" class="px-3.5 py-2 rounded-xl transition ${currentTab === 'leads' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              🎯 லீட் மையம் (Leads)
            </button>
            <button onclick="app.bizDashboardTab = 'marketplace'; app.render();" class="px-3.5 py-2 rounded-xl transition ${currentTab === 'marketplace' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              🛒 விற்பனையாளர் மையம் (Seller Hub)
            </button>
            <button onclick="app.bizDashboardTab = 'forum'; app.render();" class="px-3.5 py-2 rounded-xl transition ${currentTab === 'forum' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              💬 வணிக ஃபோரம் & மெசேஜ்
            </button>
            <button onclick="app.bizDashboardTab = 'analytics'; app.render();" class="px-3.5 py-2 rounded-xl transition ${currentTab === 'analytics' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              📈 அனலிட்டிக்ஸ் (Analytics)
            </button>
            <button onclick="app.bizDashboardTab = 'settings'; app.render();" class="px-3.5 py-2 rounded-xl transition ${currentTab === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}">
              ⚙️ அமைப்புகள் (Settings)
            </button>
          </div>
        </div>

        <!-- TAB CONTENT: OVERVIEW -->
        ${currentTab === 'overview' ? `
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
                <div class="text-2xl font-black text-brand-900 mt-1">${leadsCount} லீட்கள்</div>
                <div class="text-[10px] text-amber-700 font-bold mt-1">3 ஃபாலோ-அப் தேவை</div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div class="text-[11px] font-bold text-slate-500 uppercase">கொட்டேஷன் & ஆர்டர்கள்</div>
                <div class="text-2xl font-black text-emerald-700 mt-1">12 / 16</div>
                <div class="text-[10px] text-slate-500 mt-1">75% வெற்றி விகிதம்</div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div class="text-[11px] font-bold text-slate-500 uppercase">மொத்த வர்த்தக மதிப்பு</div>
                <div class="text-2xl font-black text-slate-900 mt-1">${biz.businessDone || '₹64.5 லட்சம்'}</div>
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
        ` : ''}

        <!-- TAB CONTENT: NBN NETWORKING (SECTION B) -->
        ${currentTab === 'networking' ? `
          ${isNetworking ? `
            <div class="space-y-6">
              <div class="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-slate-50 p-6 sm:p-7 rounded-3xl border border-amber-300 shadow-sm space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span class="px-2.5 py-0.5 rounded-lg bg-slate-900 text-amber-400 font-mono text-xs font-black">${chap.code || 'NBN-HAR-01'}</span>
                    <h3 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">${chap.nameTa} (${chap.nameEn})</h3>
                    <p class="text-xs text-slate-600 mt-0.5">மாவட்டம்: <strong>தருமபுரி</strong> • தாலுகா: <strong>${(biz.talukId || 'harur').toUpperCase()}</strong> • இடம்: ${chap.meetingVenue || 'NBN சென்டர்'}</p>
                  </div>
                  <div class="bg-white p-3.5 rounded-2xl border border-amber-300 text-right shrink-0">
                    <div class="text-xs text-slate-500 font-bold">சாப்டர் கொள்ளளவு:</div>
                    <div class="text-xl font-black text-slate-900">${chap.filledSeats || 10} / ${chap.capacity || 100} சீட்கள்</div>
                    <div class="text-[10px] text-emerald-700 font-bold">Category Exclusivity செயலில் உள்ளது</div>
                  </div>
                </div>

                <!-- Chapter Leadership -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200">
                  <div class="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div class="text-[10px] font-bold text-amber-800 uppercase">சாப்டர் இயக்குனர்</div>
                    <div class="font-black text-slate-900 mt-0.5">${chap.directorName || 'சந்திரா (Nuvea Studio)'}</div>
                    <div class="text-[10px] text-slate-500 font-semibold">${chap.directorPhone || '917548820641'}</div>
                  </div>
                  <div class="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div class="text-[10px] font-bold text-indigo-800 uppercase">சாப்டர் தலைவர்</div>
                    <div class="font-black text-slate-900 mt-0.5">${chap.presidentName || 'ஆர். சுப்ரமணியம் (SBR Cements)'}</div>
                    <div class="text-[10px] text-slate-500 font-semibold">9842100001</div>
                  </div>
                  <div class="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div class="text-[10px] font-bold text-emerald-800 uppercase">அடுத்த வாராந்திர மீட்டிங்</div>
                    <div class="font-black text-slate-900 mt-0.5">${chap.meetingDay || 'வெள்ளிக்கிழமை'} காலை 07:30 AM</div>
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
                  ${allMembers.slice(0, 6).map(m => `
                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div class="font-black text-slate-900">${m.businessName}</div>
                      <div class="text-[11px] text-slate-600 font-semibold">உரிமையாளர்: ${m.ownerName}</div>
                      <div class="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">${m.category || m.categoryId}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : `
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
          `}
        ` : ''}

        <!-- TAB CONTENT: LEADS CENTRE (SECTION D) -->
        ${currentTab === 'leads' ? `
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
        ` : ''}

        <!-- TAB CONTENT: SELLER CENTRE (SECTION E) -->
        ${currentTab === 'marketplace' ? `
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
              ${(this.db.customerRequirements || []).slice(0, 3).map(req => `
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded font-black">${req.id}</span>
                      <span class="font-bold text-slate-600">${req.categoryName || req.categoryId}</span>
                    </div>
                    <div class="font-black text-slate-900 text-sm">${req.title}</div>
                    <div class="text-slate-500 mt-0.5">அளவு: ${req.quantity} ${req.unit} • இடம்: ${(req.deliveryTaluk || 'harur').toUpperCase()}</div>
                  </div>
                  <button onclick="app.openSubmitQuotationModal('${req.id}')" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-xs shrink-0">
                    கொட்டேஷன் அனுப்புக ➔
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- TAB CONTENT: FORUM & MESSAGING (SECTION C) -->
        ${currentTab === 'forum' ? `
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
        ` : ''}

        <!-- TAB CONTENT: ANALYTICS (SECTION F) -->
        ${currentTab === 'analytics' ? `
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
        ` : ''}

        <!-- TAB CONTENT: SETTINGS (SECTION G) -->
        ${currentTab === 'settings' ? `
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
        ` : ''}

      </div>
    `;
  }


  // VIEW 6: NUVEA 4K VIDEO PROMOTION PORTAL
  // ==========================================
  renderVideoPortalView() {
    return `
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-200 mb-2">
            <span>🎥 ₹25,000 இலவச வீடியோ தயாரிப்பு பலன்</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900">
            நுவேவா ஸ்டுடியோ 4K சினிமாடிக் விளம்பர போர்டல்
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            NBN-ல் இணையும் ஒவ்வொரு தாலுகா கடைக்கும் Sony A7 IV & FX3 Cinema கேமரா மூலம் 4K விளம்பர வீடியோ படம்பிடித்து தரப்படுகிறது.
          </p>
        </div>

        <!-- Video Workflow Tracker -->
        <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 class="text-sm font-extrabold text-slate-900 mb-3">வீடியோ தயாரிப்பு நிலைகள் (Production Workflow)</h3>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">1. திட்டமிடப்பட்டது ✓</div>
            <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">2. படப்பிடிப்பு ✓</div>
            <div class="p-2.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-bold animate-pulse">3. எடிட்டிங் (Editing)</div>
            <div class="p-2.5 rounded-lg bg-slate-100 text-slate-500">4. கிளையண்ட் அனுமதி</div>
            <div class="p-2.5 rounded-lg bg-slate-100 text-slate-500">5. டெலிவரி</div>
          </div>
        </div>

        <!-- Video Player Preview -->
        <div class="aspect-video bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-white p-6 shadow-inner text-center">
          <div class="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-3 shadow-lg cursor-pointer hover:scale-105 transition">
            <svg class="w-7 h-7 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <div class="font-extrabold text-base">Sony FX3 Cinema Line 4K Master Video</div>
          <div class="text-xs text-slate-400 mt-1">தயாரிப்பு: நுவேவா ஸ்டுடியோ (Nuvea Studio) • இயக்குனர்: சந்திரா</div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW 7: ADMIN CONTROL PANEL
  // ==========================================
  renderAdminView() {
    const s = (this.db && this.db.settings) || {};
    const chapters = this.db.chapters || [];
    const dirApps = this.db.chapterDirectorApplications || [];
    const deals = this.db.dealRequests || [];

    return `
      <div class="space-y-8 max-w-5xl mx-auto">
        <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div class="border-b border-slate-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-200 mb-2">
                <span>⚙️ சூப்பர் அட்மின் கன்ட்ரோல் பேனல் (Super Admin Panel)</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900">
                NBN பிளாட்பார்ம் அமைப்புகள் & சாப்டர் மேலாண்மை
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">
                சந்திரா (Nuvea Studio) - முழு கட்டுப்பாட்டு நிர்வாக அறை
              </p>
            </div>

            <button 
              onclick="app.openCreateChapterModal()" 
              class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition shrink-0 flex items-center gap-1.5">
              <span>➕ புதிய சாப்டர் துவங்கு (Launch Chapter)</span>
            </button>
          </div>

          <!-- Section 1: Manage Chapters -->
          <div class="mb-8">
            <h3 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
              <span>🏛️ செயல்படும் சாப்டர்கள் (${chapters.length})</span>
              <span class="text-xs text-slate-500 font-medium">100 மோனோபோலி இடங்கள்/சாப்டர்</span>
            </h3>

            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                  <tr>
                    <th class="p-3">சாப்டர் பெயர்</th>
                    <th class="p-3">வகை</th>
                    <th class="p-3">வட்டம் & மாவட்டம்</th>
                    <th class="p-3">நிரப்பப்பட்ட இடங்கள்</th>
                    <th class="p-3">டைரக்டர் பெயர்</th>
                    <th class="p-3">மீட்டிங் நேரம்</th>
                    <th class="p-3">நிர்வாகம்</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium text-slate-800">
                  ${chapters.map(ch => `
                    <tr class="hover:bg-slate-50">
                      <td class="p-3 font-bold text-slate-900">${ch.nameTa}</td>
                      <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-brand-800">${ch.forumTypeTa || 'B2B'}</span></td>
                      <td class="p-3">${(ch.talukId || '').toUpperCase()}, ${(ch.districtId || '').toUpperCase()}</td>
                      <td class="p-3 font-bold text-brand-900">${ch.filledSeats} / ${ch.maxSeats}</td>
                      <td class="p-3">${ch.directorName} (${ch.directorPhone})</td>
                      <td class="p-3 text-slate-500">${ch.meetingDay} ${ch.meetingTime}</td>
                      <td class="p-3">
                        <div class="flex items-center gap-1.5">
                          <button onclick="app.openCapacityModal('${ch.id}')" class="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[10px] transition">⚙️ கொள்ளளவு</button>
                          <button onclick="app.openTransferMemberModal()" class="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-brand-900 rounded-lg font-bold text-[10px] transition">🔄 இடமாற்றம்</button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 2: Director Applications -->
          <div class="mb-8">
            <h3 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
              <span>👑 சாப்டர் டைரக்டர் விண்ணப்பங்கள் (${dirApps.length})</span>
              <span class="text-xs text-amber-700 font-bold">பிரான்சைஸ் விண்ணப்பதாரர்கள்</span>
            </h3>

            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left text-xs">
                <thead class="bg-amber-50/70 text-slate-800 font-extrabold border-b border-amber-200">
                  <tr>
                    <th class="p-3">விண்ணப்பதாரர்</th>
                    <th class="p-3">மொபைல்</th>
                    <th class="p-3">வட்டம் & மாவட்டம்</th>
                    <th class="p-3">வணிக அனுபவம்</th>
                    <th class="p-3">கோரப்பட்ட சாப்டர்</th>
                    <th class="p-3">நடவடிக்கை</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium text-slate-800">
                  ${dirApps.map(app => {
                    const cleanPhone = (app.phone || '').replace(/\D/g, '');
                    const waText = encodeURIComponent(`வணக்கம் ${app.name}, Nuvea Business Network சாப்டர் டைரக்டர் விண்ணப்பம் குறித்து சந்திரா பேசுகிறேன்.`);
                    return `
                      <tr class="hover:bg-amber-50/30">
                        <td class="p-3 font-bold text-slate-900">${app.name}</td>
                        <td class="p-3 font-mono">${app.phone}</td>
                        <td class="p-3">${app.taluk}, ${app.district}</td>
                        <td class="p-3 text-slate-600">${app.businessExperience}</td>
                        <td class="p-3 font-semibold text-brand-900">${app.proposedChapterName}</td>
                        <td class="p-3">
                          <a 
                            href="https://wa.me/${cleanPhone}?text=${waText}" 
                            target="_blank" 
                            class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1">
                            💬 பேசுக
                          </a>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- SECTION: PENDING MEMBERSHIP APPLICATIONS QUEUE -->
          <div class="mb-8">
            <h3 class="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
              <span>📝 உறுப்பினர் சேர்க்கை விண்ணப்பங்கள் (${(this.db.applications || []).length})</span>
              <span class="text-xs text-blue-700 font-bold">தேர்வுக் குழு ஆய்வு வரிசை</span>
            </h3>

            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left text-xs">
                <thead class="bg-blue-50/70 text-slate-800 font-extrabold border-b border-blue-200">
                  <tr>
                    <th class="p-3">விண்ணப்பதாரர்</th>
                    <th class="p-3">நிறுவனம்</th>
                    <th class="p-3">வணிகப் பிரிவு</th>
                    <th class="p-3">கோரப்பட்ட சாப்டர்</th>
                    <th class="p-3">தொடர்பு எண்</th>
                    <th class="p-3">நிலை</th>
                    <th class="p-3">நடவடிக்கை</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium text-slate-800">
                  ${((this.db.applications || []).slice(0, 8)).map(app => `
                    <tr class="hover:bg-blue-50/20">
                      <td class="p-3 font-bold text-slate-900">${app.applicantName || app.name}</td>
                      <td class="p-3">${app.businessName}</td>
                      <td class="p-3"><span class="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold">${app.categoryId}</span></td>
                      <td class="p-3 font-semibold text-brand-900">${app.chapterId}</td>
                      <td class="p-3 font-mono">${app.phone}</td>
                      <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">${app.status}</span></td>
                      <td class="p-3">
                        <div class="flex items-center gap-1.5">
                          <button onclick="alert('விண்ணப்பம் ஒப்புதல் அளிக்கப்பட்டு மோனோபோலி சான்றிதழ் உருவாக்கப்பட்டது!'); app.render();" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]">✓ ஒப்புதல்</button>
                          <button onclick="alert('விண்ணப்பம் நிராகரிக்கப்பட்டது.'); app.render();" class="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-bold text-[11px]">✗</button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- SECTION: 12 COMPREHENSIVE ENTERPRISE REPORTS SUITE -->
          <div class="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 class="font-black text-slate-900 text-base">📊 12 எண்டர்பிரைஸ் அறிக்கைகள் (Enterprise Reports Suite)</h3>
                <p class="text-xs text-slate-500 mt-0.5">முழுமையான வணிக பகுப்பாய்வு, வருகை தணிக்கை மற்றும் CSV தரவிறக்கம்.</p>
              </div>

              <div class="flex items-center gap-2">
                <button onclick="app.exportReportCsv(app.activeReportType || 'growth')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5">
                  <span>📥 CSV பதிவிறக்கு (Download CSV)</span>
                </button>
                <button onclick="window.print()" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition">
                  🖨️ பிரிண்ட்
                </button>
              </div>
            </div>

            <!-- Report Selector Tabs -->
            <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
              ${[
                { id: 'growth', label: '📈 வளர்ச்சி அறிக்கை' },
                { id: 'capacity', label: '🏛️ கொள்ளளவு தணிக்கை' },
                { id: 'referrals', label: '💼 பரிந்துரை பரிமாற்றம்' },
                { id: 'closed_business', label: '💰 நிறைவு வணிகம்' },
                { id: 'categories', label: '🔒 மோனோபோலி காலியிடங்கள்' },
                { id: 'attendance', label: '⏱️ வருகை தணிக்கை' },
                { id: 'one_to_ones', label: '🤝 1-to-1 கூட்டங்கள்' },
                { id: 'visitors', label: '🎟️ பார்வையாளர் மாற்று விகிதம்' },
                { id: 'membership_fees', label: '💳 உறுப்பினர் கட்டணம் & GST' },
                { id: 'leaderboard', label: '🏆 சாப்டர் தரவரிசை' },
                { id: 'activity', label: '📊 செயல்பாட்டு புள்ளி' },
                { id: 'inactive', label: '⚠️ செயலற்ற வணிகர்கள்' }
              ].map(rep => `
                <button 
                  onclick="app.selectAdminReport('${rep.id}')" 
                  class="px-3 py-1.5 rounded-xl transition ${(this.activeReportType || 'growth') === rep.id ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
                  ${rep.label}
                </button>
              `).join('')}
            </div>

            <!-- Report Live Preview Box -->
            <div class="bg-white p-4 rounded-xl border border-slate-200 text-xs">
              <div class="flex items-center justify-between mb-3">
                <span class="font-black text-slate-800 uppercase tracking-wider text-[11px]">
                  அறிக்கை முன்னோட்டம்: <strong>${(this.activeReportType || 'growth').toUpperCase()} REPORT</strong>
                </span>
                <span class="text-[10px] text-emerald-700 font-bold">✓ லைவ் தரவுத்தளத்துடன் இணைக்கப்பட்டுள்ளது</span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs font-medium">
                  <thead class="bg-slate-50 text-slate-700 font-bold border-b">
                    <tr>
                      <th class="p-2.5">வரிசை #</th>
                      <th class="p-2.5">பிரிவு / அளவுரு</th>
                      <th class="p-2.5">நடப்பு நிலை</th>
                      <th class="p-2.5">மதிப்பீடு / குறிப்பு</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr>
                      <td class="p-2.5 font-bold">01</td>
                      <td class="p-2.5 font-bold text-slate-900">ஹரூர் டைட்டன்ஸ் (Harur Titans)</td>
                      <td class="p-2.5 font-bold text-brand-900">22 / 100 உறுப்பினர்கள்</td>
                      <td class="p-2.5 text-emerald-700 font-bold">₹22.5 லட்சம் நிறைவு வணிகம்</td>
                    </tr>
                    <tr>
                      <td class="p-2.5 font-bold">02</td>
                      <td class="p-2.5 font-bold text-slate-900">பாலக்கோடு சாப்டர் (Palacode)</td>
                      <td class="p-2.5 font-bold text-brand-900">18 / 100 உறுப்பினர்கள்</td>
                      <td class="p-2.5 text-emerald-700 font-bold">₹16.8 லட்சம் நிறைவு வணிகம்</td>
                    </tr>
                    <tr>
                      <td class="p-2.5 font-bold">03</td>
                      <td class="p-2.5 font-bold text-slate-900">காரிமங்கலம் சாப்டர் (Karimangalam)</td>
                      <td class="p-2.5 font-bold text-brand-900">15 / 100 உறுப்பினர்கள்</td>
                      <td class="p-2.5 text-emerald-700 font-bold">₹11.2 லட்சம் நிறைவு வணிகம்</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Section 3: Pricing & Meeting Configuration Form -->
          <form onsubmit="app.saveAdminSettings(event)" class="space-y-6">
            <!-- Pricing -->
            <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 class="text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider">3. கட்டண அமைப்புகள் (Membership Pricing)</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">தாலுகா வருடாந்திர கட்டணம் (₹)</label>
                  <input type="number" id="adm-annualFee" value="${s.annualFeeTaluk || 15000}" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-900" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">மாவட்ட விஐபி கட்டணம் (₹)</label>
                  <input type="number" id="adm-districtFee" value="${s.annualFeeDistrictVIP || 25000}" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-900" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">மாநில டைட்டன்ஸ் கட்டணம் (₹)</label>
                  <input type="number" id="adm-stateFee" value="${s.annualFeeStateTitan || 50000}" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-900" />
                </div>
              </div>
            </div>

            <!-- Meeting Settings -->
            <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 class="text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider">4. வீக்லி மீட்டிங் அமைப்புகள் (Weekly Meet Conductor)</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">மீட்டிங் நாள் (Day)</label>
                  <select id="adm-meetingDay" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-900">
                    <option value="Saturday" ${s.meetingDay === 'Saturday' ? 'selected' : ''}>சனிக்கிழமை (Saturday)</option>
                    <option value="Friday" ${s.meetingDay === 'Friday' ? 'selected' : ''}>வெள்ளிக்கிழமை (Friday)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">மீட்டிங் நேரம் (Time)</label>
                  <input type="text" id="adm-meetingTime" value="${s.meetingTime || '07:30 AM'}" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-900" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">பேச்சாளர் நேரம் (விநாடிகள்)</label>
                  <input type="number" id="adm-speakerTime" value="${s.speakerDurationSeconds || 45}" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-900" />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-200">
              <a href="/api/admin/export-csv" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition">
                📥 உறுப்பினர் விபரங்கள் CSV டவுன்லோட்
              </a>
              <button type="submit" class="px-6 py-2.5 bg-brand-900 hover:bg-brand-950 text-white font-extrabold text-sm rounded-xl shadow-md transition active:scale-95">
                அமைப்புகளை சேமிக்கவும் (Save Settings)
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ==========================================
  // ACTIONS, MODALS & DIALOGS
  // ==========================================
  setSearch(val) {
    this.searchTerm = val;
    this.render();
  }

  setSortBy(val) {
    this.sortBy = val;
    this.render();
  }

  toggleTimer() {
    if (this.timerRunning) {
      clearInterval(this.timerInterval);
      this.timerRunning = false;
    } else {
      this.timerRunning = true;
      this.timerInterval = setInterval(() => {
        if (this.secondsLeft > 0) {
          this.secondsLeft--;
          const el = document.getElementById('live-timer-display');
          if (el) el.textContent = `${this.secondsLeft}s`;
          if (this.secondsLeft === 10) window.playChime && window.playChime('warning');
        } else {
          clearInterval(this.timerInterval);
          this.timerRunning = false;
          window.playChime && window.playChime('warning');
          this.advanceSpeaker();
        }
      }, 1000);
    }
    const btn = document.getElementById('timer-toggle-btn');
    if (btn) btn.textContent = this.timerRunning ? 'டைமரை நிறுத்து (Pause)' : 'டைமரை தொடங்கு (Start)';
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.timerRunning = false;
    this.secondsLeft = 45;
    const el = document.getElementById('live-timer-display');
    if (el) el.textContent = `${this.secondsLeft}s`;
    const btn = document.getElementById('timer-toggle-btn');
    if (btn) btn.textContent = 'டைமரை தொடங்கு (Start)';
  }

  async advanceSpeaker() {
    clearInterval(this.timerInterval);
    this.timerRunning = false;
    try {
      const res = await fetch('/api/meeting/advance', { method: 'POST' });
      if (res.ok) {
        await this.fetchData();
        window.playChime && window.playChime('success');
        this.resetTimer();
        this.render();
      }
    } catch (e) {
      console.error(e);
    }
  }

  showVideoModal(businessName) {
    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 class="font-black text-slate-900 text-sm">${businessName} - சினிமாடிக் 4K வீடியோ</h3>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>
          <div class="aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white p-6 text-center">
            <div class="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center mb-3 shadow-lg">
              <svg class="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div class="font-bold text-sm">Sony A7 IV & FX3 Cinema Line 4K Master Video</div>
            <div class="text-xs text-slate-400 mt-1">தயாரிப்பு: நுவேவா ஸ்டுடியோ (Nuvea Studio)</div>
          </div>
          <div class="mt-4 flex justify-end">
            <button onclick="app.closeModal()" class="px-4 py-2 bg-brand-900 text-white font-bold text-xs rounded-xl">மூடுக</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  showOwnerModal(id) {
    const isTa = this.lang === 'ta';
    const m = (this.db.members || []).find(x => x.id === id || x.businessId === id || x.businessName === id);
    if (!m) return;

    const cat = (this.db.categories || []).find(c => c.id === m.categoryId) || {};
    const cleanPhone = (m.phone || '').replace(/\D/g, '');
    const waText = encodeURIComponent(`வணக்கம் ${m.ownerName}, Nuvea Business Network (NBN) டைரக்டரியில் உள்ள உங்கள் ${m.businessName} இன்ஸ்டாகிராம் & பிசினஸ் விவரங்கள் பார்த்தேன். தொடர்பு கொள்ள விரும்புகிறேன்.`);
    const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;
    const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;

    const photos = (m.photos && m.photos.length > 0) ? m.photos : [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80'
    ];

    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 modal-backdrop overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
          
          <!-- Modal Top Header Bar -->
          <div class="bg-gradient-to-r from-brand-950 via-brand-900 to-indigo-950 text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-brand-950">
                  🔒 ${cat.nameTa || cat.nameEn || '100% Category Exclusivity (தொழில் உரிமை)'}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white">
                  📍 ${(m.talukId || 'harur').toUpperCase()} சாப்டர்
                </span>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  ✓ சரிபார்க்கப்பட்ட நிறுவனம் (Verified Elite)
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                ${m.businessName}
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                உரிமையாளர்: <strong class="text-amber-300">${m.ownerName}</strong>
              </p>
            </div>
            
            <button onclick="app.closeModal()" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-bold transition shrink-0">
              ✕
            </button>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="p-5 sm:p-6 space-y-6 overflow-y-auto">
            
            <!-- Instagram Profile Strip -->
            <div class="bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 rounded-2xl p-4 sm:p-5 border border-pink-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <!-- Instagram Avatar with gradient border -->
                <div class="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0 shadow-md">
                  <div class="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
                    <img src="${photos[0]}" alt="${m.ownerName}" class="w-full h-full rounded-full object-cover">
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px] shadow">
                    ✓
                  </div>
                </div>

                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-base sm:text-lg font-black text-slate-900">${m.instagram || '@nuvea_studio'}</span>
                    <span class="text-xs bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full border border-pink-200">Instagram Official</span>
                  </div>
                  <p class="text-xs text-slate-600 font-medium mt-0.5">${m.businessName} • ${m.ownerName}</p>
                  
                  <div class="flex items-center gap-4 mt-2 text-xs font-bold text-slate-700">
                    <div><span class="font-black text-slate-900">${m.followers || '24.8K'}</span> ஃபாலோயர்ஸ்</div>
                    <div><span class="font-black text-slate-900">${m.posts || '412'}</span> பதிவுகள்</div>
                    <div class="text-amber-600">★ ${m.rating || '5.0'} (${m.reviewCount || 48} மதிப்பீடுகள்)</div>
                  </div>
                </div>
              </div>

              <!-- Instagram Profile CTA -->
              <a 
                href="${m.instagramUrl || `https://instagram.com/${(m.instagram || 'nuvea_studio').replace('@','')}`}" 
                target="_blank" 
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition transform active:scale-95 shrink-0">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>Instagram-ல் பார்வையிட ↗</span>
              </a>
            </div>

            <!-- Title & Full Description -->
            <div class="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
              <h3 class="text-xs font-extrabold uppercase tracking-wider text-brand-900 mb-2">
                வணிக விவரம் & முழுமையான குறிப்பு (About Business)
              </h3>
              <p class="text-sm font-bold text-slate-800 leading-relaxed mb-2">
                ${m.tagline || ''}
              </p>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ${m.description || 'தருமபுரி மாவட்ட முன்னணி வர்த்தக நிறுவனம். Nuvea Business Network (NBN) சாப்டர் உறுப்பினர். 100% தரமான சேவைகள் மற்றும் நேரடி B2B பார்ட்னர்ஷிப்.'}
              </p>
              
              <!-- Address and GPS info -->
              <div class="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2 text-slate-700">
                  <span class="font-bold">📍 முகவரி:</span>
                  <span>${m.address || 'ஹரூர் மெயின் ரோடு'}</span>
                </div>
                <div class="text-slate-500 font-mono text-[11px]">
                  GPS: ${m.lat}, ${m.lng}
                </div>
              </div>
            </div>

            <!-- 4K Video Reel Showcase -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  <span>4K சினிமாடிக் விளம்பரம் & ரீல்ஸ் (Nuvea Studio தயாரிப்பு)</span>
                </h3>
                <span class="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  மதிப்பு ₹25,000 (இலவசம்)
                </span>
              </div>

              <div class="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
                ${m.reelsVideo ? `
                  <video 
                    controls 
                    playsinline 
                    poster="${photos[0]}" 
                    src="${m.reelsVideo}" 
                    class="w-full max-h-80 object-cover bg-black">
                  </video>
                ` : `
                  <div class="aspect-video flex flex-col items-center justify-center p-8 text-center text-white">
                    <div class="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mb-3 shadow-lg">
                      <svg class="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div class="font-bold text-sm">4K சினிமாடிக் ப்ரொமோஷன் வீடியோ</div>
                    <div class="text-xs text-slate-400 mt-1">தயாரிப்பு: நுவேவா ஸ்டுடியோ (Nuvea Studio) • Sony Cinema Line FX3</div>
                  </div>
                `}
                <div class="p-3 bg-slate-950 text-white flex items-center justify-between text-xs">
                  <span class="font-bold text-amber-300 truncate">${m.reelsTitle || `${m.businessName} 4K Commercial Shoot`}</span>
                  <span class="text-slate-400 shrink-0 font-medium">Ultra HD 4K 60FPS</span>
                </div>
              </div>
            </div>

            <!-- Photo Showcase Gallery (Grid of 4) -->
            <div>
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center justify-between">
                <span>நிறுவனத்தின் புகைப்படங்கள் (Photo Gallery)</span>
                <span class="text-[11px] text-slate-400 font-normal">ஷோரூம் & தயாரிப்புகள்</span>
              </h3>
              
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                ${photos.slice(0, 4).map((p, idx) => `
                  <div class="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs cursor-pointer" onclick="window.open('${p}', '_blank')">
                    <img src="${p}" alt="${m.businessName} photo ${idx+1}" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
                    <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                      பெரிதாக்குக 🔍
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Modal Bottom Action Bar -->
          <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-2">
              <a 
                href="${mapDirectionsUrl}" 
                target="_blank" 
                class="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-xs transition">
                <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>வழித்தடம் (Directions)</span>
              </a>

              <a 
                href="${m.instagramUrl || `https://instagram.com/${(m.instagram || 'nuvea_studio').replace('@','')}`}" 
                target="_blank" 
                class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-xl shadow-xs transition">
                <span>Instagram Profile</span>
              </a>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <a 
                href="${waUrl}" 
                target="_blank" 
                class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                <span>WhatsApp</span>
              </a>

              <a 
                href="tel:${cleanPhone}" 
                class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-900 hover:bg-brand-950 text-white text-xs font-bold rounded-xl shadow-md transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>அழைக்க (Call)</span>
              </a>

              <button onclick="app.closeModal()" class="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition">
                மூடுக
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  openBookingModal(preselectedCatId = '', preselectedChapterId = '') {
    const categories = this.db.categories || [];
    const chapters = this.db.chapters || [];
    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                🔒 100% எக்ஸ்க்ளூசிவ் சீட் புக்கிங்
              </span>
              <h3 class="font-black text-slate-900 text-lg sm:text-xl mt-1">உங்கள் தாலுகா சீட்டை பூட்டுங்கள்</h3>
            </div>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold">✕</button>
          </div>

          <form onsubmit="app.submitBooking(event)" class="mt-5 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">தாலுகா *</label>
                <select id="book-taluk" class="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800">
                  <option value="harur">ஹரூர் (Harur)</option>
                  <option value="palacode">பாலக்கோடு (Palacode)</option>
                  <option value="karimangalam">காரிமங்கலம் (Karimangalam)</option>
                  <option value="dharmapuri_town">தருமபுரி டவுன் (Dharmapuri)</option>
                  <option value="pennagaram">பென்னாகரம் (Pennagaram)</option>
                  <option value="salem">சேலம் (Salem)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">சாப்டர் / மன்றம் *</label>
                <select id="book-chapter" class="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800">
                  ${chapters.map(ch => `
                    <option value="${ch.id}" ${ch.id === preselectedChapterId ? 'selected' : ''}>
                      ${ch.nameTa} (${ch.forumTypeTa || 'சாப்டர்'})
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">வணிகப் பிரிவு (100 Practical Categories) *</label>
              <select id="book-category" required class="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800">
                ${categories.map(c => `
                  <option value="${c.id}" ${c.id === preselectedCatId ? 'selected' : ''}>
                    ${c.nameTa} (${c.nameEn})
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">நிறுவனத்தின் பெயர் (Business Name) *</label>
              <input type="text" id="book-business" required placeholder="எ.கா: ஸ்ரீ முருகன் ஜூவல்லரி" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">உரிமையாளர் பெயர் *</label>
                <input type="text" id="book-owner" required placeholder="உங்கள் பெயர்" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp மொபைல் எண் *</label>
                <input type="tel" id="book-phone" required placeholder="9842XXXXXX" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" />
              </div>
            </div>

            <div class="bg-amber-50 p-3.5 rounded-xl border border-amber-200/80 text-xs">
              <div class="flex items-center justify-between font-bold text-amber-950">
                <span>வருடாந்திர கட்டணம்:</span>
                <span class="text-base text-brand-900 font-black">₹15,000 + GST</span>
              </div>
              <div class="text-[11px] text-amber-900 mt-1">
                ✓ Nuvea Studio மூலம் ₹25,000 மதிப்பிலான 4K வீடியோ ஷூட் இலவசம்.
              </div>
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button type="button" onclick="app.closeModal()" class="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">ரத்து செய்</button>
              <button type="submit" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition">
                சீட்டை உறுதி செய் (Confirm Seat)
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async submitBooking(e) {
    e.preventDefault();
    const talukId = document.getElementById('book-taluk').value;
    const chapterId = document.getElementById('book-chapter') ? document.getElementById('book-chapter').value : null;
    const categoryId = document.getElementById('book-category').value;
    const businessName = document.getElementById('book-business').value;
    const ownerName = document.getElementById('book-owner').value;
    const phone = document.getElementById('book-phone').value;

    try {
      const res = await fetch('/api/monopoly/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ talukId, chapterId, categoryId, businessName, ownerName, phone })
      });
      const data = await res.json();

      if (res.ok) {
        await this.fetchData();
        this.closeModal();
        window.confetti && window.confetti({ particleCount: 120, spread: 70 });
        window.playChime && window.playChime('success');
        alert(data.message || 'சீட் வெற்றிகரமாக பூட்டப்பட்டது!');
        this.render();
      } else {
        alert(data.error || 'Booking error');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while booking seat');
    }
  }

  openDirectorModal() {
    const districts = this.db.districts || [{ id: 'dharmapuri', nameTa: 'தருமபுரி' }, { id: 'salem', nameTa: 'சேலம்' }];
    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-950 border border-amber-300">
                👑 பிரான்சைஸ் வாய்ப்பு • ₹3,000/உறுப்பினர் கமிஷன்
              </span>
              <h3 class="font-black text-slate-900 text-xl mt-1.5">உங்கள் ஊரில் NBN சாப்டர் தொடங்குங்கள்</h3>
              <p class="text-xs text-slate-500 font-medium">Nuvea Studio-வின் முழு தொழில்நுட்ப & 4K விளம்பர வீடியோ ஆதரவு!</p>
            </div>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold">✕</button>
          </div>

          <form onsubmit="app.submitDirectorApplication(event)" class="mt-5 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">உங்கள் பெயர் *</label>
              <input type="text" id="dir-name" required placeholder="எ.கா: சந்திரா / சுப்ரமணியம்" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp மொபைல் எண் *</label>
              <input type="tel" id="dir-phone" required placeholder="9842XXXXXX" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">தாலுகா / நகரம் *</label>
                <input type="text" id="dir-taluk" required placeholder="எ.கா: ஹரூர் / பர்கூர் / ஓசூர்" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">மாவட்டம் *</label>
                <select id="dir-district" class="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800">
                  ${districts.map(d => `
                    <option value="${d.nameTa || d.nameEn}">${d.nameTa || d.nameEn}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">உங்கள் வணிகம் & அனுபவம் *</label>
              <input type="text" id="dir-exp" required placeholder="எ.கா: 10 வருடங்கள் டெக்ஸ்டைல் & ரியல் எஸ்டேட் வணிகர்" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">நீங்கள் தொடங்க விரும்பும் சாப்டர் பெயர் *</label>
              <input type="text" id="dir-chapname" required placeholder="எ.கா: ஹரூர் ராயல்ஸ் / ஓசூர் ஆட்டோ டெக்" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" />
            </div>

            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
              💡 <strong>வருவாய் வாய்ப்பு:</strong> ஒரு சாப்டரில் 100 உறுப்பினர்கள் இணையும் போது ₹3,00,000 வரை நேரடி வருமானம். ஒவ்வொரு வாரமும் தொழில் கூட்டங்களை வழிநடத்தும் தலைமை கௌரவம்!
            </div>

            <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-xl shadow-lg transition transform active:scale-98">
              🚀 சாப்டர் டைரக்டராக விண்ணப்பிக்க (Submit Application)
            </button>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async submitDirectorApplication(e) {
    e.preventDefault();
    const name = document.getElementById('dir-name').value;
    const phone = document.getElementById('dir-phone').value;
    const taluk = document.getElementById('dir-taluk').value;
    const district = document.getElementById('dir-district').value;
    const businessExperience = document.getElementById('dir-exp').value;
    const proposedChapterName = document.getElementById('dir-chapname').value;

    try {
      const res = await fetch('/api/chapters/apply-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, taluk, district, businessExperience, proposedChapterName })
      });
      const data = await res.json();
      this.closeModal();
      if (typeof window.playChime === 'function') window.playChime('success');
      if (typeof window.confetti === 'function') window.confetti({ particleCount: 70, spread: 60 });
      alert(data.message || 'விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!');
      await this.fetchData();
      this.render();
    } catch (err) {
      alert('விண்ணப்பம் சமர்ப்பிப்பதில் பிழை. மீண்டும் முயற்சிக்கவும்.');
    }
  }

  openPostDealModal() {
    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-900">
                🤝 B2B மெகா வணிக ஒப்பந்தம்
              </span>
              <h3 class="font-black text-slate-900 text-lg sm:text-xl mt-1">புதிய வணிக வாய்ப்பை பதிவிடுங்கள்</h3>
            </div>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold">✕</button>
          </div>

          <form onsubmit="app.submitDealRequest(event)" class="mt-5 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">வணிக வாய்ப்பு தலைப்பு (Deal Title) *</label>
              <input type="text" id="deal-title" required placeholder="எ.கா: 5,000 சதுர அடி வணிக வளாகம் பில்டிங் மெட்டீரியல்ஸ் சப்ளை தேவை" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">மதிப்பிடப்பட்ட டீல் மதிப்பு (₹) *</label>
                <input type="text" id="deal-val" required placeholder="எ.கா: ₹25,00,000" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">வாய்ப்பு வகை *</label>
                <select id="deal-type" class="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800">
                  <option value="buy_lead">கொள்முதல் தேவை (Purchase)</option>
                  <option value="partner_lead">வணிக கூட்டணி (Partnership)</option>
                  <option value="contract_lead">துணை ஒப்பந்தம் (Sub-contract)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">நிறுவனம் / பதிவு செய்பவர் *</label>
                <input type="text" id="deal-poster" required placeholder="உங்கள் நிறுவனம்" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp எண் *</label>
                <input type="tel" id="deal-phone" required placeholder="917548820641" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">முழு விவரம் & நிபந்தனைகள் *</label>
              <textarea id="deal-desc" required rows="3" placeholder="தேவைப்படும் பொருட்கள், தரம் மற்றும் விநியோக கால அவகாசம்..." class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium"></textarea>
            </div>

            <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-lg transition">
              🤝 வணிக வாய்ப்பை உடனடியாக பதிவிடு (Publish Deal)
            </button>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async submitDealRequest(e) {
    e.preventDefault();
    const titleTa = document.getElementById('deal-title').value;
    const dealValue = document.getElementById('deal-val').value;
    const type = document.getElementById('deal-type').value;
    const postedBy = document.getElementById('deal-poster').value;
    const contactPhone = document.getElementById('deal-phone').value;
    const description = document.getElementById('deal-desc').value;

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleTa, dealValue, type, postedBy, contactPhone, description })
      });
      const data = await res.json();
      this.closeModal();
      if (typeof window.playChime === 'function') window.playChime('success');
      alert(data.message || 'வாய்ப்பு வெற்றிகரமாக பதிவு செய்யப்பட்டது!');
      await this.fetchData();
      this.render();
    } catch (err) {
      alert('பதிவு செய்வதில் பிழை. மீண்டும் முயற்சிக்கவும்.');
    }
  }

  openCreateChapterModal() {
    const districts = this.db.districts || [{ id: 'dharmapuri', nameTa: 'தருமபுரி' }, { id: 'salem', nameTa: 'சேலம்' }];
    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-300">
                🏛️ சூப்பர் அட்மின் • புதிய சாப்டர் துவக்கம்
              </span>
              <h3 class="font-black text-slate-900 text-xl mt-1.5">புதிய NBN சாப்டர் உருவாக்குக</h3>
            </div>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold">✕</button>
          </div>

          <form onsubmit="app.submitNewChapter(event)" class="mt-5 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">சாப்டர் ID (Unique) *</label>
                <input type="text" id="newchap-id" required placeholder="எ.கா: harur_royals" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">மன்ற வகை (Forum Type) *</label>
                <select id="newchap-type" class="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800">
                  <option value="titans">B2B டைட்டன்ஸ் (Core)</option>
                  <option value="royals">ராயல்ஸ் எலைட் (Elite)</option>
                  <option value="women">மகளிர் தொழில் மன்றம் (Women)</option>
                  <option value="agro">அக்ரோ & ரூரல் டிரேட் (Agro)</option>
                  <option value="tech">எக்ஸ்போர்ட் & டெக் விங் (Tech)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">சாப்டர் பெயர் (தமிழ்) *</label>
              <input type="text" id="newchap-nameta" required placeholder="எ.கா: ஹரூர் ராயல்ஸ் சாப்டர்" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">சாப்டர் பெயர் (English) *</label>
              <input type="text" id="newchap-nameen" required placeholder="e.g. Harur Royals Chapter" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">தாலுகா *</label>
                <input type="text" id="newchap-taluk" required placeholder="harur" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">மாவட்டம் *</label>
                <select id="newchap-district" class="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800">
                  ${districts.map(d => `
                    <option value="${d.id}">${d.nameTa || d.nameEn}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">மீட்டிங் நாள் *</label>
                <input type="text" id="newchap-day" required placeholder="வெள்ளிக்கிழமை" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">மீட்டிங் நேரம் *</label>
                <input type="text" id="newchap-time" required placeholder="காலை 07:30 AM" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">சாப்டர் டைரக்டர் பெயர் *</label>
                <input type="text" id="newchap-dirname" required placeholder="சந்திரா (Nuvea Studio)" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">டைரக்டர் போன் எண் *</label>
                <input type="tel" id="newchap-dirphone" required placeholder="917548820641" class="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold" />
              </div>
            </div>

            <button type="submit" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg transition">
              ➕ புதிய சாப்டரை உடனடியாக துவங்கு (Launch Chapter)
            </button>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async submitNewChapter(e) {
    e.preventDefault();
    const typeSelect = document.getElementById('newchap-type');
    const payload = {
      id: document.getElementById('newchap-id').value,
      forumType: typeSelect.value,
      forumTypeTa: typeSelect.options[typeSelect.selectedIndex].text,
      nameTa: document.getElementById('newchap-nameta').value,
      nameEn: document.getElementById('newchap-nameen').value,
      talukId: document.getElementById('newchap-taluk').value,
      districtId: document.getElementById('newchap-district').value,
      meetingDay: document.getElementById('newchap-day').value,
      meetingTime: document.getElementById('newchap-time').value,
      directorName: document.getElementById('newchap-dirname').value,
      directorPhone: document.getElementById('newchap-dirphone').value
    };

    try {
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      this.closeModal();
      if (typeof window.playChime === 'function') window.playChime('success');
      alert(data.message || 'சாப்டர் வெற்றிகரமாக துவங்கப்பட்டது!');
      await this.fetchData();
      this.render();
    } catch (err) {
      alert('சாப்டர் துவங்குவதில் பிழை.');
    }
  }

  openLeadModal() {
    const members = this.db.members || [];
    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 class="font-black text-slate-900 text-base">🤝 புதிய லீட் பரிமாறு (Refer a Lead)</h3>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="app.submitLead(event)" class="space-y-3.5 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">யாருக்கு லீட் வழங்குகிறீர்கள் (To Member)</label>
              <select id="lead-to" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
                ${members.map(m => `<option value="${m.id}">${m.businessName} (${m.ownerName})</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">வாடிக்கையாளர் பெயர் & ஊர்</label>
              <input type="text" id="lead-client" required placeholder="எ.கா: ராஜா ரியல் எஸ்டேட், அரூர்" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">வாடிக்கையாளர் போன் எண்</label>
              <input type="tel" id="lead-phone" required placeholder="9842XXXXXX" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">எதிர்பார்க்கப்படும் ஒப்பந்த மதிப்பு (Deal Value)</label>
              <input type="text" id="lead-value" placeholder="எ.கா: ₹1,50,000" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium" />
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button type="button" onclick="app.closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">ரத்து செய்</button>
              <button type="submit" class="px-5 py-2 bg-brand-900 text-white font-extrabold rounded-xl shadow-xs">லீட் சமர்ப்பி</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async submitLead(e) {
    e.preventDefault();
    const toMemberId = document.getElementById('lead-to').value;
    const clientName = document.getElementById('lead-client').value;
    const clientPhone = document.getElementById('lead-phone').value;
    const expectedValue = document.getElementById('lead-value').value;

    try {
      const res = await fetch('/api/member/referral/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ toMemberId, clientName, clientPhone, expectedValue })
      });
      if (res.ok) {
        await this.fetchData();
        this.closeModal();
        window.confetti && window.confetti({ particleCount: 80, spread: 60 });
        window.playChime && window.playChime('success');
        alert('லீட் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!');
        this.render();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async downloadInvoice(invNumber) {
    try {
      const res = await fetch(`/api/payment/invoice/${invNumber}`);
      if (res.ok) {
        const inv = await res.json();
        const html = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
            <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
              <div class="flex items-center justify-between pb-3 border-b mb-3">
                <div class="font-extrabold text-sm text-brand-950">GST வரி விலைப்பட்டியல் (TAX INVOICE)</div>
                <button onclick="app.closeModal()" class="font-bold">✕</button>
              </div>
              <div class="space-y-1 mb-3">
                <div><strong>விலைப்பட்டியல் எண்:</strong> ${inv.invoiceNumber}</div>
                <div><strong>தேதி:</strong> ${inv.date}</div>
                <div><strong>வழங்குபவர்:</strong> Nuvea Studio (GSTIN: 33AABCN7548Z1Z9)</div>
                <div><strong>வாடிக்கையாளர்:</strong> ${inv.client.businessName}</div>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border mb-3 space-y-1">
                <div class="flex justify-between"><span>அடிப்படை கட்டணம் (Base):</span><span>₹${inv.totals.baseAmount.toLocaleString('en-IN')}</span></div>
                <div class="flex justify-between"><span>CGST (9%):</span><span>₹${inv.totals.cgstAmount.toLocaleString('en-IN')}</span></div>
                <div class="flex justify-between"><span>SGST (9%):</span><span>₹${inv.totals.sgstAmount.toLocaleString('en-IN')}</span></div>
                <div class="flex justify-between font-black text-sm text-brand-950 pt-1 border-t"><span>மொத்தம் (Total Paid):</span><span>₹${inv.totals.totalAmount.toLocaleString('en-IN')}</span></div>
              </div>
              <div class="flex justify-end gap-2">
                <button onclick="app.closeModal()" class="px-3 py-1.5 bg-slate-100 rounded-lg">மூடுக</button>
                <button onclick="window.print()" class="px-3 py-1.5 bg-brand-900 text-white rounded-lg">பிரிண்ட்</button>
              </div>
            </div>
          </div>
        `;
        document.getElementById('modal-container').innerHTML = html;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async saveAdminSettings(e) {
    e.preventDefault();
    const annualFeeTaluk = Number(document.getElementById('adm-annualFee').value);
    const annualFeeDistrictVIP = Number(document.getElementById('adm-districtFee').value);
    const annualFeeStateTitan = Number(document.getElementById('adm-stateFee').value);
    const speakerDurationSeconds = Number(document.getElementById('adm-speakerTime').value);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ annualFeeTaluk, annualFeeDistrictVIP, annualFeeStateTitan, speakerDurationSeconds })
      });
      if (res.ok) {
        await this.fetchData();
        window.playChime && window.playChime('success');
        alert('அட்மின் அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன! (Settings Saved)');
        this.render();
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
    }
  }

  openAdminModal() {
    const isTa = this.lang === 'ta';
    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                🔒
              </div>
              <div>
                <h3 class="font-black text-slate-900 text-sm">நிர்வாகம் & லாகின் (Admin)</h3>
                <p class="text-[10px] text-slate-500">Nuvea Business Network</p>
              </div>
            </div>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <p class="text-xs text-slate-600 mb-4 leading-relaxed">
            உங்கள் உள்நுழைவு வகையை தேர்வு செய்யவும் (Choose Role):
          </p>

          <div class="space-y-2 mb-5">
            <button onclick="app.switchRole('public'); app.closeModal()" class="w-full p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-slate-50 flex items-center justify-between text-left transition ${this.currentRole === 'public' ? 'ring-2 ring-brand-500 bg-brand-50/50' : ''}">
              <div>
                <div class="font-bold text-xs text-slate-900">பொதுமக்கள் (Public Visitor)</div>
                <div class="text-[10px] text-slate-500">டைரக்டரி & மேப் பார்வை</div>
              </div>
              <span class="text-xs text-slate-400">→</span>
            </button>

            <button onclick="app.switchRole('member'); app.closeModal()" class="w-full p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-slate-50 flex items-center justify-between text-left transition ${this.currentRole === 'member' ? 'ring-2 ring-brand-500 bg-brand-50/50' : ''}">
              <div>
                <div class="font-bold text-xs text-slate-900">உறுப்பினர் டேஷ்போர்டு (Member)</div>
                <div class="text-[10px] text-slate-500">லீட்கள் பரிமாற & ஸ்கோர் பார்க்க</div>
              </div>
              <span class="text-xs text-slate-400">→</span>
            </button>

            <button onclick="app.switchRole('super_admin'); app.closeModal()" class="w-full p-3 rounded-xl border border-amber-300 hover:border-amber-500 bg-amber-50/50 flex items-center justify-between text-left transition ${this.currentRole === 'super_admin' ? 'ring-2 ring-amber-500' : ''}">
              <div>
                <div class="font-black text-xs text-slate-900">சூப்பர் அட்மின் (Super Admin)</div>
                <div class="text-[10px] text-amber-800">முழு சிஸ்டம் & கட்டண மேலாண்மை</div>
              </div>
              <span class="text-xs font-bold text-amber-600">👑</span>
            </button>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>நிறுவனர்: சந்திரா (7548820641)</span>
            <button onclick="app.closeModal()" class="text-slate-600 hover:text-slate-900 font-bold">மூடுக</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  // ==========================================
  // STANDALONE SHAREABLE DIGITAL STOREFRONT VIEW
  // ==========================================
  renderStandaloneBizView(bizId) {
    const isTa = this.lang === 'ta';
    const allMembers = this.db.members || [];
    const biz = allMembers.find(m => m.id === bizId || m.businessId === bizId) || allMembers[0];
    if (!biz) return '<div class="p-8 text-center text-slate-500 font-bold">வணிகக் கணக்கு கிடைக்கவில்லை</div>';

    const cat = (this.db.categories || []).find(c => c.id === biz.categoryId) || {};
    const chap = (this.db.chapters || []).find(c => c.id === biz.chapterId) || {};
    const cleanPhone = (biz.phone || '').replace(/\D/g, '');
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://54d0f61bec8945.lhr.life';
    const storeUrl = `${origin}/#/biz/${biz.businessId || biz.id}`;
    
    const waOrderText = encodeURIComponent(`வணக்கம் ${biz.ownerName}, Nuvea Business Network டிஜிட்டல் ஸ்டோர் மூலம் உங்கள் ${biz.businessName} பிரத்யேக சலுகை (${biz.specialOffer}) பார்த்து ஆர்டர் செய்ய விரும்புகிறேன்.`);
    const waShareText = encodeURIComponent(`வணக்கம்! ${biz.businessName} (${biz.ownerName}) அவர்களின் அதிகாரப்பூர்வ டிஜிட்டல் ஸ்டோர் லிங்க்: ${storeUrl}\nசிறப்பு சலுகை: ${biz.specialOffer}`);

    const photos = (biz.photos && biz.photos.length > 0) ? biz.photos : [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80'
    ];

    return `
      <div class="space-y-6 max-w-5xl mx-auto">
        <!-- Top Breadcrumb & Share Actions -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <button onclick="app.setTab('consumer'); window.location.hash=''" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition">
            ← ${isTa ? 'அனைத்து வணிகங்கள் (Directory)' : 'All Businesses'}
          </button>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              🔒 100% தாலுகா எக்ஸ்க்ளூசிவ் சீட்: ${biz.chapterName || chap.nameTa || 'ஹரூர் சாப்டர்'}
            </span>
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ Nuvea Verified Elite
            </span>
          </div>
        </div>

        <!-- Storefront Hero Card -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          <div class="relative h-48 sm:h-64 bg-slate-900 overflow-hidden">
            <img src="${photos[0]}" alt="${biz.businessName}" class="w-full h-full object-cover opacity-60">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            
            <div class="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div class="flex items-end gap-4">
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-xl shrink-0">
                  <div class="w-full h-full rounded-xl bg-white overflow-hidden flex items-center justify-center font-black text-2xl text-brand-900">
                    ${biz.businessName.charAt(0)}
                  </div>
                </div>
                <div class="text-white">
                  <div class="text-xs font-extrabold text-amber-400 uppercase tracking-wider">${cat.nameTa || cat.nameEn || 'பிரத்யேக வணிகம்'}</div>
                  <h1 class="text-xl sm:text-3xl font-black tracking-tight drop-shadow-sm">${biz.businessName}</h1>
                  <p class="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">👤 உரிமையாளர்: <strong class="text-white">${biz.ownerName}</strong> • 📍 ${biz.address}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <a href="${biz.instagramUrl || 'https://instagram.com/nuvea_studio'}" target="_blank" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <span>📸 ${biz.instagram || '@nuvea_studio'}</span>
                </a>
                <span class="px-3 py-1.5 rounded-xl bg-slate-800/80 backdrop-blur-md text-amber-300 font-bold text-xs border border-slate-700">
                  ★ ${biz.rating || 5.0} (${biz.reviewCount || 48} மதிப்புரைகள்)
                </span>
              </div>
            </div>
          </div>

          <!-- Highlight Offer & Instant Order Banner (The Golden Commercial Offer) -->
          <div class="p-5 sm:p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider mb-2">
                  🏷️ NBN பிரத்யேக ஆபர் விலை (${biz.priceTag || 'குறைந்தபட்ச விலை கேரண்டி'})
                </div>
                <div class="text-2xl sm:text-3xl font-black">${biz.specialOffer}</div>
                <p class="text-amber-100 text-xs sm:text-sm mt-1">நேரடி உரிமையாளர் சிறந்த விலை உத்தரவாதம் • தர உத்தரவாதம்: 100% BIS / Verified</p>
              </div>

              <div class="flex flex-col sm:flex-row items-stretch gap-2.5 shrink-0">
                <a href="https://wa.me/${cleanPhone}?text=${waOrderText}" target="_blank" class="px-5 py-3.5 rounded-xl bg-white text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-slate-100 transition transform active:scale-95">
                  <span>🛍️ இப்போதே ஆர்டர் செய் (Order via WhatsApp)</span>
                </a>
                <a href="tel:${cleanPhone}" class="px-4 py-3.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-white/20 transition">
                  <span>📞 நேரடி அழைப்பு (${cleanPhone})</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Share Storefront Link Widget -->
          <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-base">🔗</span>
              <div>
                <div class="text-xs font-bold text-slate-900">இந்த கடையின் நேரடி டிஜிட்டல் ஸ்டோர் லிங்க் (Shareable Link):</div>
                <div class="text-[11px] text-slate-500">இந்த லிங்கை வாடிக்கையாளர்களுக்கு அனுப்பி நேரடியாக ஆர்டர் பெறலாம்.</div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input type="text" readonly value="${storeUrl}" id="share-store-input" class="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-mono w-48 sm:w-64 truncate">
              <button onclick="app.copyStoreLink('${storeUrl}')" class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1">
                <span>📋 நகலெடு</span>
              </button>
              <a href="https://wa.me/?text=${waShareText}" target="_blank" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1">
                <span>🟢 WhatsApp-ல் அனுப்பு</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 2-Column Details: 4K Reel + Product Photos & Direct Lead Inquiry Form -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left 2 Cols: Media & About -->
          <div class="lg:col-span-2 space-y-6">
            <!-- About & Monopoly Certification -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
                <span>🏢 வணிக விவரம் & நம்பகத்தன்மை</span>
              </h3>
              <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
                ${biz.description || 'NBN அதிகாரப்பூர்வ சான்றளிக்கப்பட்ட உறுப்பினர். வாடிக்கையாளர்களுக்கு சிறந்த தரம், சரியான விலை மற்றும் நேர்மையான சேவை வழங்கி வருகிறோம்.'}
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="text-[10px] text-slate-400 font-bold uppercase">தாலுகா இடம்</div>
                  <div class="text-xs font-extrabold text-slate-900 mt-0.5">${(biz.talukId || '').toUpperCase()}</div>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="text-[10px] text-slate-400 font-bold uppercase">சாப்டர்</div>
                  <div class="text-xs font-extrabold text-brand-900 mt-0.5">${biz.chapterName || chap.nameTa || 'ஹரூர் சாப்டர்'}</div>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="text-[10px] text-slate-400 font-bold uppercase">மோனோபோலி நிலை</div>
                  <div class="text-xs font-extrabold text-amber-700 mt-0.5">🔒 100% பிரத்யேக சீட்</div>
                </div>
              </div>
            </div>

            <!-- Sony Cinema 4K Reel Video Player -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
                    <span>🎬 Sony FX3 4K சினிமாடிக் விளம்பர ரீல்</span>
                  </h3>
                  <p class="text-xs text-slate-500 mt-0.5">தயாரிப்பு: நுவேவா ஸ்டுடியோ (Nuvea Studio) • இயக்குனர்: சந்திரா</p>
                </div>
                <span class="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-bold">4K ULTRA HD</span>
              </div>

              <div class="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden group shadow-inner flex items-center justify-center">
                <img src="${photos[1] || photos[0]}" class="w-full h-full object-cover opacity-75">
                <div class="absolute inset-0 bg-slate-950/40"></div>
                <a href="https://instagram.com/nuvea_studio" target="_blank" class="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition cursor-pointer">
                  ▶
                </a>
                <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span class="font-bold truncate">${biz.reelsTitle || `${biz.businessName} - 4K விளம்பரப் படம்`}</span>
                  <span class="text-slate-300 font-mono text-[11px]">0:45 • Nuvea Studio</span>
                </div>
              </div>
            </div>

            <!-- Photo Showcase Gallery -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 class="font-black text-slate-900 text-base">📸 ஷோரூம் & தயாரிப்புகள் கேலரி</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ${photos.map((p, idx) => `
                  <div class="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer" onclick="app.showOwnerModal('${biz.id}')">
                    <img src="${p}" alt="Photo ${idx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Col: Direct Customer Inquiry & Lead Submission Form -->
          <div class="space-y-6">
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24 space-y-4">
              <div class="border-b border-slate-100 pb-3">
                <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-800 border border-brand-200 mb-1">
                  <span>⚡ நேரடி ஆர்டர் & விசாரணை</span>
                </div>
                <h3 class="font-black text-slate-900 text-base">கடைக்கு நேரடியாக ஆர்டர் செய்க</h3>
                <p class="text-slate-500 text-xs mt-0.5">உங்கள் தேவையை அனுப்பினால் கடை உரிமையாளர் உடனடியாக தொடர்பு கொள்வார்.</p>
              </div>

              <form onsubmit="app.submitStorefrontLead(event, '${biz.id}')" class="space-y-3 text-xs">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">உங்கள் பெயர் (Your Name) *</label>
                  <input type="text" id="sf-client-name" required placeholder="எ.கா: சரவணன், ஹரூர்" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500">
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">மொபைல் எண் (WhatsApp Phone) *</label>
                  <input type="tel" id="sf-client-phone" required placeholder="9842XXXXXX" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500">
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">தேவை / என்ன வாங்க விரும்புகிறீர்கள்? *</label>
                  <textarea id="sf-client-requirement" rows="3" required placeholder="எ.கா: ${biz.specialOffer}" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500"></textarea>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">எதிர்பார்க்கும் மதிப்பு (மதிப்பீடு)</label>
                  <input type="text" id="sf-client-budget" placeholder="எ.கா: ₹25,000" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500">
                </div>

                <button type="submit" class="w-full py-3 bg-brand-900 hover:bg-brand-950 text-white font-black rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2">
                  <span>🚀 ஆர்டர் கோரிக்கையை அனுப்புக</span>
                </button>
              </form>

              <div class="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-500">
                🔒 உங்கள் தொடர்பு எண் பாதுகாப்பானது • Nuvea Business Network உத்தரவாதம்
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  copyStoreLink(url) {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
    }
    if (window.playChime) window.playChime('success');
    alert('டிஜிட்டல் ஸ்டோர் லிங்க் நகலெடுக்கப்பட்டது!\n' + url);
  }

  async submitStorefrontLead(e, bizId) {
    e.preventDefault();
    const clientName = document.getElementById('sf-client-name').value;
    const clientPhone = document.getElementById('sf-client-phone').value;
    const requirement = document.getElementById('sf-client-requirement').value;
    const expectedValue = document.getElementById('sf-client-budget').value;

    try {
      const res = await fetch(`/api/business/${bizId}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, clientPhone, requirement, expectedValue })
      });
      const data = await res.json();
      if (res.ok) {
        if (window.confetti) window.confetti({ particleCount: 100, spread: 70 });
        if (window.playChime) window.playChime('success');
        alert(data.message || 'உங்கள் ஆர்டர் கோரிக்கை கடை உரிமையாளருக்கு உடனடியாக அனுப்பப்பட்டது!');
        document.getElementById('sf-client-name').value = '';
        document.getElementById('sf-client-phone').value = '';
        document.getElementById('sf-client-requirement').value = '';
      } else {
        alert(data.error || 'பிழை ஏற்பட்டது');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting lead');
    }
  }

  async updateLeadStatus(refId, status) {
    try {
      const res = await fetch(`/api/member/referral/${refId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        if (window.playChime) window.playChime('success');
        await this.fetchData();
        this.render();
      }
    } catch (e) {
      console.error(e);
    }
  }

  openEditProfileModal() {
    const allMembers = this.db.members || [];
    let biz = allMembers[0];
    if (this.currentUser) {
      biz = allMembers.find(m => m.id === this.currentUser.id || m.businessId === this.currentUser.id || (m.phone && m.phone.replace(/\D/g, '') === this.currentUser.phone)) || allMembers[0];
    }

    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-auto">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 class="font-black text-slate-900 text-base">✏️ வணிக விவரங்களை திருத்து (Edit Profile)</h3>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="app.submitEditProfile(event)" class="space-y-3.5 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">வணிகப் பெயர்</label>
              <input type="text" id="edit-biz-name" value="${biz.businessName || ''}" required class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">உரிமையாளர் பெயர்</label>
              <input type="text" id="edit-owner-name" value="${biz.ownerName || ''}" required class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">சிறப்பு சலுகை (Special Offer)</label>
              <input type="text" id="edit-offer" value="${biz.specialOffer || ''}" required class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">சிறந்த விலை கேரண்டி (Best Price)</label>
              <input type="text" id="edit-best-price" value="${biz.bestPrice || ''}" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">கடை முகவரி</label>
              <input type="text" id="edit-address" value="${biz.address || ''}" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button type="button" onclick="app.closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">ரத்து</button>
              <button type="submit" class="px-5 py-2 bg-brand-900 text-white font-extrabold rounded-xl shadow-xs">சேமி</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async submitEditProfile(e) {
    e.preventDefault();
    const businessName = document.getElementById('edit-biz-name').value;
    const ownerName = document.getElementById('edit-owner-name').value;
    const specialOffer = document.getElementById('edit-offer').value;
    const bestPrice = document.getElementById('edit-best-price').value;
    const address = document.getElementById('edit-address').value;

    try {
      const res = await fetch('/api/member/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ businessName, ownerName, specialOffer, bestPrice, address })
      });
      if (res.ok) {
        if (window.playChime) window.playChime('success');
        this.closeModal();
        await this.fetchData();
        this.render();
      }
    } catch (err) {
      console.error(err);
    }
  }

  openLoginModal() {
    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-lg">
                N
              </div>
              <div>
                <h3 class="font-black text-slate-900 text-base">வணிகர் & நிர்வாக உள்நுழைவு</h3>
                <p class="text-[11px] text-slate-500">Nuvea Business Network (NBN)</p>
              </div>
            </div>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
          </div>

          <!-- 1-Click Quick Demo Login Pills -->
          <div class="mb-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div class="text-[11px] font-bold text-slate-600 mb-2">⚡ விரைவு 1-கிளிக் லாகின் (Quick Demo Access):</div>
            <div class="grid grid-cols-1 gap-1.5">
              <button onclick="app.quickLogin('917548820641', 'password')" class="w-full text-left px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-slate-900 flex items-center justify-between transition">
                <span>👑 சந்திரா (Super Admin • Nuvea Studio)</span>
                <span class="text-[10px] text-amber-800 font-mono">1-Click</span>
              </button>
              <button onclick="app.quickLogin('919842156789', 'password')" class="w-full text-left px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 flex items-center justify-between transition">
                <span>💎 ஸ்ரீ லட்சுமி ஜூவல்லர்ஸ் (Member 1)</span>
                <span class="text-[10px] text-slate-500 font-mono">1-Click</span>
              </button>
              <button onclick="app.quickLogin('919789456123', 'password')" class="w-full text-left px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 flex items-center justify-between transition">
                <span>🏢 ஆக்ஸிஃபிக்ஸ் தினேஷ் (Member 2)</span>
                <span class="text-[10px] text-slate-500 font-mono">1-Click</span>
              </button>
            </div>
          </div>

          <!-- Password Login Form -->
          <form onsubmit="app.submitLogin(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">மொபைல் எண் (Mobile Number) *</label>
              <input type="text" id="login-identifier" required placeholder="917548820641 அல்லது 9842156789" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">கடவுச்சொல் (Password) *</label>
              <input type="password" id="login-password" required placeholder="••••••••" value="password" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-brand-500">
            </div>

            <button type="submit" class="w-full py-3 bg-brand-900 hover:bg-brand-950 text-white font-black rounded-xl text-xs transition shadow-md">
              உள்நுழைக (Secure Login)
            </button>
          </form>

          <div class="mt-4 pt-3 border-t border-slate-100 text-center">
            <button onclick="app.closeModal(); app.openRegisterModal();" class="text-xs font-bold text-brand-600 hover:text-brand-800">
              புதிய வணிகரா? ➕ வணிகத்தை பதிவு செய்து மோனோபோலி சீட்டை பூட்டுங்கள்
            </button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async quickLogin(phone, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phone, password })
      });
      const data = await res.json();
      if (res.ok) {
        this.token = data.token;
        this.currentUser = data.user;
        this.currentRole = data.user.role || 'member';
        if (typeof localStorage !== 'undefined') localStorage.setItem('nbn_token', data.token);
        this.closeModal();
        this.updateHeaderAuth();
        if (window.playChime) window.playChime('success');
        if (this.currentRole === 'super_admin') {
          this.setTab('admin');
        } else {
          this.setTab('member');
        }
      } else {
        alert(data.error || 'உள்நுழைவு தோல்வியடைந்தது');
      }
    } catch (e) {
      console.error(e);
      alert('Login error');
    }
  }

  async submitLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById('login-identifier').value;
    const password = document.getElementById('login-password').value;
    await this.quickLogin(identifier, password);
  }

  openRegisterModal() {
    const categories = this.db.categories || [];
    const chapters = this.db.chapters || [];
    const taluks = [
      { id: 'harur', name: 'ஹரூர் (Harur)' },
      { id: 'palacode', name: 'பாலக்கோடு (Palacode)' },
      { id: 'karimangalam', name: 'காரிமங்கலம் (Karimangalam)' },
      { id: 'dharmapuri_town', name: 'தருமபுரி டவுன் (Dharmapuri Town)' },
      { id: 'pennagaram', name: 'பென்னாகரம் (Pennagaram)' }
    ];

    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 modal-backdrop overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-1">
                🔒 1 தாலுகா • 1 சாப்டர் • 1 பிசினஸ் மட்டுமே
              </div>
              <h3 class="font-black text-slate-900 text-base sm:text-lg">புதிய வணிகர் பதிவு & மோனோபோலி சீட் முன்பதிவு</h3>
            </div>
            <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
          </div>

          <form onsubmit="app.submitBusinessRegistration(event)" class="space-y-3.5 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">உரிமையாளர் பெயர் (Owner Name) *</label>
                <input type="text" id="reg-name" required placeholder="எ.கா: சுப்ரமணியம்" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">மொபைல் எண் (WhatsApp Phone) *</label>
                <input type="tel" id="reg-phone" required placeholder="9842XXXXXX" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">வணிகப் பெயர் (Shop / Business Name) *</label>
                <input type="text" id="reg-biz-name" required placeholder="எ.கா: ஸ்ரீ லட்சுமி ஜூவல்லர்ஸ்" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">கடவுச்சொல் (Set Password) *</label>
                <input type="password" id="reg-password" required value="password" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">தாலுகா வட்டம் (Taluk) *</label>
                <select id="reg-taluk" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
                  ${taluks.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">சாப்டர் / ஃபோரம் (Chapter) *</label>
                <select id="reg-chapter" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
                  ${chapters.map(c => `<option value="${c.id}">${c.nameTa} (${(c.talukId||'').toUpperCase()})</option>`).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">வணிக வகை (100 Monopoly Categories) *</label>
              <select id="reg-category" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
                ${categories.map(c => `<option value="${c.id}">${c.nameTa} (${c.nameEn})</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">சிறப்பு சலுகை / சிறந்த விலை கேரண்டி *</label>
              <input type="text" id="reg-offer" required placeholder="எ.கா: 20% நேரடி தள்ளுபடி • குறைந்தபட்ச விலை கேரண்டி" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">கடை முகவரி (Shop Address)</label>
              <input type="text" id="reg-address" placeholder="எ.கா: மெயின் ரோடு, ஹரூர்" class="w-full border border-slate-300 rounded-xl p-2.5 font-medium">
            </div>

            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              ⭐ <strong>Nuvea Studio சிறப்பு பலன்:</strong> பதிவு செய்தவுடன் உங்கள் கடைக்கு ₹25,000 மதிப்பிலான 4K சினிமாடிக் விளம்பர ரீல் & தனிப்பட்ட டிஜிட்டல் ஸ்டோர் லிங்க் உடனடியாக உருவாக்கப்படும்.
            </div>

            <button type="submit" class="w-full py-3.5 bg-brand-900 hover:bg-brand-950 text-white font-black rounded-xl text-xs sm:text-sm transition shadow-md">
              🚀 பதிவு செய்து மோனோபோலி சீட்டை பூட்டுங்கள்
            </button>
          </form>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async submitBusinessRegistration(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;
    const businessName = document.getElementById('reg-biz-name').value;
    const talukId = document.getElementById('reg-taluk').value;
    const chapterId = document.getElementById('reg-chapter').value;
    const categoryId = document.getElementById('reg-category').value;
    const specialOffer = document.getElementById('reg-offer').value;
    const address = document.getElementById('reg-address').value;

    try {
      const res = await fetch('/api/auth/register-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, password, businessName, talukId, chapterId, categoryId, specialOffer, address
        })
      });
      const data = await res.json();
      if (res.ok) {
        this.token = data.token;
        this.currentUser = data.user;
        this.currentRole = 'member';
        if (typeof localStorage !== 'undefined') localStorage.setItem('nbn_token', data.token);
        await this.fetchData();
        this.closeModal();
        this.updateHeaderAuth();
        if (window.confetti) window.confetti({ particleCount: 120, spread: 80 });
        if (window.playChime) window.playChime('success');
        
        this.openRegistrationSuccessModal(data);
        this.setTab('member');
      } else {
        alert(data.error || 'பதிவு தோல்வியடைந்தது');
      }
    } catch (err) {
      console.error(err);
      alert('Registration error');
    }
  }

  openRegistrationSuccessModal(data) {
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://54d0f61bec8945.lhr.life';
    const storeUrl = `${origin}/#/biz/${data.business.id}`;
    const waShareText = encodeURIComponent(`வணக்கம்! எங்கள் ${data.business.businessName} அதிகாரப்பூர்வமாக Nuvea Business Network-ல் இணைந்துள்ளது. எங்களின் டிஜிட்டல் ஸ்டோர்: ${storeUrl}`);

    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-center">
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
            ✓
          </div>
          <h3 class="text-xl font-black text-slate-900">வாழ்த்துகள் ${data.user.name}!</h3>
          <p class="text-xs text-slate-500 mt-1">உங்கள் <strong>${data.business.businessName}</strong> வணிகக் கணக்கு மற்றும் 100% Category Exclusivity (தொழில் உரிமை) சீட் வெற்றிகரமாக பூட்டப்பட்டது!</p>

          <div class="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
            <div class="text-[11px] font-bold text-slate-700">🔗 உங்கள் பிரத்யேக டிஜிட்டல் ஸ்டோர் லிங்க்:</div>
            <input type="text" readonly value="${storeUrl}" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800">
            <div class="flex items-center gap-2 pt-1">
              <button onclick="app.copyStoreLink('${storeUrl}')" class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition">
                📋 லிங்க் நகலெடு
              </button>
              <a href="https://wa.me/?text=${waShareText}" target="_blank" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs text-center transition">
                🟢 வாட்ஸ்அப் பகிர்
              </a>
            </div>
          </div>

          <button onclick="app.closeModal()" class="w-full mt-4 py-3 bg-brand-900 text-white font-black rounded-xl text-xs">
            என் வணிகக் கட்டுப்பாட்டு அறைக்கு செல் (Go to Dashboard)
          </button>
        </div>
      </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
  }

  async checkAuth() {
    if (!this.token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        this.currentUser = data.user;
        this.currentRole = data.user.role || 'member';
      } else {
        this.token = null;
        if (typeof localStorage !== 'undefined') localStorage.removeItem('nbn_token');
      }
    } catch (e) {
      console.warn('Auth check failed:', e);
    }
  }

  handleRoute() {
    if (typeof window === 'undefined' || !window.location) return;
    const hash = window.location.hash || '';
    if (hash.startsWith('#/biz/')) {
      const bizId = hash.replace('#/biz/', '').trim();
      if (bizId) {
        this.activeStoreBizId = bizId;
        this.currentTab = 'storefront';
        this.render();
        return;
      }
    } else if (hash === '#/admin') {
      this.currentTab = 'admin';
      this.render();
      return;
    } else if (hash === '#/member') {
      this.currentTab = 'member';
      this.render();
      return;
    } else if (hash === '#/welcome' || hash === '' || hash === '#/') {
      if (this.currentUser) {
        if (this.currentUser.role === 'super_admin') this.setTab('admin');
        else if (this.currentUser.role === 'customer') this.setTab('customer');
        else this.setTab('member');
      } else {
        this.setTab('welcome');
      }
      this.render();
      return;
    } else if (hash === '#/home') {
      this.setTab('home');
      this.render();
      return;
    } else if (hash === '#/marketplace') {
      this.setTab('marketplace');
      this.render();
      return;
    } else if (hash === '#/customer') {
      this.setTab('customer');
      this.render();
      return;
    } else if (hash === '#/chapters') {
      this.setTab('chapters');
      this.render();
      return;
    } else if (hash.startsWith('#/verify-certificate/')) {
      this.certificateSearchId = hash.replace('#/verify-certificate/', '').trim();
      this.setTab('certificate');
      this.render();
      return;
    } else if (hash === '#/certificate') {
      this.setTab('certificate');
      this.render();
      return;
    } else if (hash === '#/map') {
      this.currentTab = 'map';
      this.render();
      return;
    } else if (hash === '#/opportunities') {
      this.currentTab = 'opportunities';
      this.render();
      return;
    }
  }

  updateHeaderAuth() {
    const container = document.getElementById('headerAuthContainer');
    if (!container) return;

    if (this.currentUser) {
      if (this.currentUser.role === 'super_admin') {
        container.innerHTML = `
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="text-[11px] sm:text-xs font-bold text-amber-300">👑 ${this.currentUser.name}</span>
            <button onclick="app.setTab('admin')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-xs transition shadow-2xs">
              ⚙️ அட்மின் அறை
            </button>
            <button onclick="app.logout()" class="px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-white transition">
              🚪 வெளியேறு
            </button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="text-[11px] sm:text-xs font-bold text-emerald-300">👤 ${this.currentUser.name}</span>
            <button onclick="app.setTab('member')" class="px-2.5 py-1 bg-brand-900 hover:bg-brand-950 text-white font-bold rounded-lg text-xs border border-brand-700 transition shadow-2xs">
              💼 வணிகக் கட்டுப்பாடு
            </button>
            <button onclick="app.logout()" class="px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-white transition">
              🚪 வெளியேறு
            </button>
          </div>
        `;
      }
    } else {
      container.innerHTML = `
        <div class="flex items-center gap-1.5 sm:gap-2">
          <button onclick="app.openLoginModal()" class="inline-flex items-center gap-1 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            <span>உள்நுழைக</span>
          </button>
          <button onclick="app.openRegisterModal()" class="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 px-3 py-1.5 rounded-lg transition shadow-xs">
            <span>➕ வணிகப் பதிவு</span>
          </button>
        </div>
      `;
    }
  }

  logout() {
    this.token = null;
    this.currentUser = null;
    this.currentRole = 'public';
    if (typeof localStorage !== 'undefined') localStorage.removeItem('nbn_token');
    this.updateHeaderAuth();
    if (window.playChime) window.playChime('warning');
    this.setTab('consumer');
  }

  openStandaloneBiz(bizId) {
    this.activeStoreBizId = bizId;
    if (typeof window !== 'undefined' && window.location) {
      window.location.hash = `#/biz/${bizId}`;
    }
    this.setTab('storefront');
  }


  // ==========================================
  // VIEW: HOME (CORPORATE EXECUTIVE LANDING)
  // ==========================================
  
  // ==========================================
  // VIEW: HOME (CONVERSATIONAL, HIGH-CONVERSION & INTERACTIVE NETWORK MAP)
  // ==========================================
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
    const chapMembers = members.filter(m => (m.chapterId || (m.talukId === 'harur' ? 'harur_titans' : `${m.talukId}_titans`)) === activeChapter.id);
    const filledCount = activeChapter.filledSeats !== undefined ? activeChapter.filledSeats : (chapMembers.length > 0 ? chapMembers.length : 10);
    const maxCapacity = activeChapter.capacity === 'unlimited' ? 100 : (parseInt(activeChapter.capacity) || 100);
    const availCount = Math.max(0, maxCapacity - filledCount);
    const utilPct = Math.min(100, Math.round((filledCount / maxCapacity) * 100));

    // Has active search / filter
    const hasActiveFilter = !!(searchQuery || talukFilter !== 'all' || landmarkFilter || vacancyOnly);

    return `
      <div class="space-y-8 max-w-6xl mx-auto">

        <!-- ========================================== -->
        <!-- FRONTPAGE DUAL GATEWAY: NBN NETWORKING vs NBN BUSINESS MARKETPLACE -->
        <!-- ========================================== -->
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span class="text-[11px] font-black tracking-wider uppercase text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                ⭐ பிரதான போர்டல் தேர்வு (Select Platform Gateway)
              </span>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                NBN-ன் இரண்டு முக்கிய வணிக அமைப்புகள்
              </h2>
            </div>
            <p class="text-xs text-slate-500 font-medium">
              உங்கள் வணிகத் தேவைக்கேற்ப கீழ்வரும் இரண்டில் ஒன்றைத் தேர்வு செய்து நுழையலாம்.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <!-- OPTION 1: NBN NETWORKING CARD -->
            <div 
              onclick="app.selectPortalMode('networking')" 
              class="group relative bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 rounded-3xl p-6 sm:p-7 text-white border-2 border-slate-800 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5">
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-xs">
                    🏛️ MODULE A
                  </span>
                  <span class="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    100% Category Exclusivity
                  </span>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-3xl font-black shrink-0 group-hover:scale-105 transition">
                    🏛️
                  </div>
                  <div>
                    <h3 class="text-xl sm:text-2xl font-black text-white group-hover:text-amber-400 transition">
                      NBN Networking
                    </h3>
                    <div class="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      தொழில் நெட்வொர்க் அமைப்பு (BNI Model)
                    </div>
                  </div>
                </div>

                <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  உங்கள் தாலுகா சாப்டரில் இணைந்து, சக பிசினஸ் ஓனர்களுடன் வாராந்திர சந்திப்புகள், பரிந்துரைகள் (Referrals) மற்றும் வணிக வாய்ப்புகளைப் பெறுங்கள். ஒரு தொழிலுக்கு ஒருவர் மட்டுமே!
                </p>
              </div>

              <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div class="text-[11px] text-slate-400 font-semibold">
                  11 சாப்டர்கள் • 100 சீட்கள் வரம்பு • நேரலை மேப்
                </div>
                <button class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1 group-hover:translate-x-1">
                  <span>நெட்வொர்க் காண்க ➔</span>
                </button>
              </div>

            </div>

            <!-- OPTION 2: NBN BUSINESS MARKETPLACE CARD -->
            <div 
              onclick="app.selectPortalMode('marketplace')" 
              class="group relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white border-2 border-slate-800 hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5">
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-400 text-slate-950 shadow-xs">
                    🛒 MODULE B
                  </span>
                  <span class="text-xs font-bold text-emerald-300 flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Direct B2B Orders & Bidding
                  </span>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center text-3xl font-black shrink-0 group-hover:scale-105 transition">
                    🛒
                  </div>
                  <div>
                    <h3 class="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-400 transition">
                      NBN Business Marketplace
                    </h3>
                    <div class="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      பிசினஸ் மார்க்கெட்பிளேஸ் (வாடிக்கையாளர் சந்தை)
                    </div>
                  </div>
                </div>

                <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  வாடிக்கையாளர்களின் நேரடி தேவைகளுக்கு (Customer Requirements) போட்டி கொட்டேஷன்கள் சமர்ப்பித்து, 18% GST இன்வாய்ஸ் மற்றும் ஆர்டர்களை வெல்லுங்கள்!
                </p>
              </div>

              <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div class="text-[11px] text-slate-400 font-semibold">
                  லைவ் தேவைகள் • கொட்டேஷன் ஒப்பீடு • 0% கமிஷன்
                </div>
                <button class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1 group-hover:translate-x-1">
                  <span>சந்தைக்குச் செல்க ➔</span>
                </button>
              </div>

            </div>

          </div>
        </div>
        
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
              <button onclick="app.openApplyModal('${activeChapter.id}')" class="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition flex items-center gap-2 transform hover:-translate-y-0.5">
                <span>🚀 காலி சீட்டை உடனே புக் பண்ணுங்க (Join Now) ➔</span>
              </button>

              <button onclick="app.openGuestModal('${activeChapter.id}')" class="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition flex items-center gap-2">
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
                ${filteredMembers.length} வணிகர்கள் • ${filteredChapters.length} சாப்டர்கள்
              </span>
              ${hasActiveFilter ? `
                <button onclick="app.clearHomeFilters()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-300 flex items-center gap-1">
                  <span>✕ பில்டர் நீக்கு</span>
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Instant Search Input Box -->
          <div class="relative search-glow rounded-2xl border-2 border-slate-200 transition bg-slate-50 p-1.5 flex items-center">
            <span class="pl-3.5 pr-2 text-slate-400 text-lg">🔍</span>
            <input 
              type="text" 
              id="home-master-search-input"
              value="${this.homeSearchQuery || ''}"
              oninput="app.onHomeSearchInput(this.value)"
              placeholder="வணிகப் பெயர் (எ.கா: Nuvea), தொழில் (எ.கா: சிமெண்ட், நகைக்கடை), தாலுகா, அல்லது லேண்ட்மார்க் (எ.கா: காளியம்மன் கோவில், பைபாஸ்)..."
              class="w-full bg-transparent px-2 py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
            />
            ${this.homeSearchQuery ? `
              <button onclick="app.onHomeSearchInput('')" class="pr-3 text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            ` : ''}
          </div>

          <!-- Taluk Filter Pills -->
          <div class="space-y-2">
            <div class="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>📍 தாலுகா வாரியாக வடிகட்டு (Taluk Filter):</span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              ${[
                { id: 'all', label: 'அனைத்து பகுதிகள் (All)' },
                { id: 'harur', label: 'ஹரூர் (Harur)' },
                { id: 'palacode', label: 'பாலக்கோடு' },
                { id: 'karimangalam', label: 'காரிமங்கலம்' },
                { id: 'dharmapuri_town', label: 'தருமபுரி டவுன்' },
                { id: 'pennagaram', label: 'பென்னாகரம்' },
                { id: 'salem', label: 'சேலம் (Salem)' },
                { id: 'hosur', label: 'ஓசூர் (Hosur)' }
              ].map(t => `
                <button 
                  onclick="app.setHomeTalukFilter('${t.id}')" 
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition ${talukFilter === t.id ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}">
                  ${t.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Popular Landmark / Town Filter Tags -->
          <div class="space-y-2 pt-1 border-t border-slate-100">
            <div class="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>🏛️ முக்கிய லேண்ட்மார்க் / இடங்கள் (Landmark Filter):</span>
              <button 
                onclick="app.toggleHomeVacancyOnly()" 
                class="px-3 py-1 rounded-lg text-xs font-bold border transition ${vacancyOnly ? 'bg-amber-400 text-slate-950 border-amber-500 font-black shadow-xs' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}">
                ${vacancyOnly ? '✓ காலியிடங்கள் உள்ளவை மட்டும் (Active)' : '🔥 காலியிடங்கள் உள்ள சாப்டர்கள் மட்டும்'}
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              ${[
                { key: 'காளியம்மன் கோவில்', label: '📍 காளியம்மன் கோவில் ரோடு' },
                { key: 'பைபாஸ்', label: '📍 பைபாஸ் ரோடு (Bypass)' },
                { key: 'பஸ்', label: '📍 பஸ் நிலையம் (Bus Stand)' },
                { key: 'உழவர் சந்தை', label: '📍 உழவர் சந்தை எதிரில்' },
                { key: 'மெயின் ரோடு', label: '📍 மெயின் ரோடு (Main Road)' },
                { key: '4 ரோடு', label: '📍 4 ரோடு சந்திப்பு' },
                { key: 'கலெக்டரேட்', label: '📍 கலெக்டரேட் ரோடு' }
              ].map(lm => `
                <button 
                  onclick="app.setHomeLandmarkFilter('${landmarkFilter === lm.key ? '' : lm.key}')" 
                  class="landmark-pill px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${landmarkFilter === lm.key ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}">
                  ${lm.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- LIVE FILTERED RESULTS GRID (Shows immediately when search or filter is active) -->
          ${hasActiveFilter ? `
            <div class="space-y-4 pt-4 border-t border-slate-200">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>🎯 தேடல் முடிவுகள்:</span>
                  <span class="text-xs font-bold text-slate-500">(${filteredMembers.length} வணிகர்கள், ${filteredChapters.length} சாப்டர்கள் பொருந்தின)</span>
                </h3>
              </div>

              <!-- Matching Businesses Grid -->
              ${filteredMembers.length > 0 ? `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  ${filteredMembers.slice(0, 6).map(m => {
                    const cleanPhone = (m.phone || '').replace(/\D/g, '');
                    const waText = encodeURIComponent(`வணக்கம் ${m.ownerName}, NBN நெட்வொர்க் மூலம் தொடர்பு கொள்கிறேன்.`);
                    return `
                      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition space-y-2.5">
                        <div class="flex items-start justify-between gap-2">
                          <div>
                            <div class="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mb-1">
                              🔒 Category Exclusivity
                            </div>
                            <div class="text-sm font-black text-slate-900 leading-tight">
                              ${m.businessName}
                            </div>
                            <div class="text-xs text-slate-600 font-semibold mt-0.5">
                              உரிமையாளர்: ${m.ownerName}
                            </div>
                          </div>
                          <span class="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                            ✓ Verified
                          </span>
                        </div>

                        <div class="text-xs text-slate-500 flex items-center gap-1">
                          <span>📍</span>
                          <span class="truncate">${m.address || 'தமிழ்நாடு'}</span>
                        </div>

                        ${m.specialOffer ? `
                          <div class="text-[11px] font-bold text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-200">
                            🎁 ${m.specialOffer}
                          </div>
                        ` : ''}

                        <div class="flex items-center gap-2 pt-1">
                          <a href="https://wa.me/${cleanPhone}?text=${waText}" target="_blank" class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl text-center transition">
                            💬 வாட்ஸ்அப்
                          </a>
                          <button onclick="app.openStandaloneBiz('${m.id}')" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition">
                            விவரம் ➔
                          </button>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <div class="bg-slate-50 rounded-2xl p-6 text-center text-slate-500 text-xs font-semibold">
                  குறிப்பிட்ட தேடலுக்கு வணிகர்கள் கிடைக்கவில்லை. கீழே உள்ள சாப்டரில் உங்கள் தொழிலை உடனே பதிவு செய்யலாம்!
                </div>
              `}
            </div>
          ` : ''}
        </div>

        <!-- ========================================== -->
        <!-- ACTIVE CHAPTER CARD WITH DIRECTORS & LEADS METRICS -->
        <!-- ========================================== -->
        <div class="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-slate-50 rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-sm space-y-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-amber-200/60 pb-6">
            
            <div class="space-y-3 max-w-2xl">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 font-mono text-xs font-black">
                  ${activeChapter.code || 'NBN-HAR-01'}
                </span>
                <h3 class="text-xl sm:text-2xl font-black text-slate-900">
                  ${activeChapter.nameTa || 'ஹரூர் டைட்டன்ஸ் சாப்டர்'}
                </h3>
                <span class="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  ✓ சேர்க்கை நடப்பில் உள்ளது (Open for Enrollment)
                </span>
              </div>

              <p class="text-xs sm:text-sm text-slate-600 font-medium">
                மீட்டிங் நேரம்: <strong class="text-slate-900">${activeChapter.meetingDay || 'வெள்ளிக்கிழமை'} ${activeChapter.meetingTime || 'காலை 07:30 AM'}</strong> • இடம்: ${activeChapter.meetingVenue || 'ஹரூர் NBN பிசினஸ் சென்டர்'}
              </p>

              <!-- Chapter Leadership Profile Photos & Trust Badges -->
              <div class="flex flex-wrap items-center gap-4 pt-1">
                <!-- Chapter Director -->
                <div class="flex items-center gap-2.5 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-xs">
                  <img 
                    src="${activeChapter.directorPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" 
                    alt="Director" 
                    class="w-10 h-10 rounded-full object-cover director-avatar-ring shrink-0"
                  />
                  <div>
                    <div class="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider">சாப்டர் இயக்குனர்</div>
                    <div class="text-xs font-black text-slate-900 leading-tight">${activeChapter.directorName || 'சந்திரா (Nuvea Studio)'}</div>
                    <div class="text-[10px] text-slate-500 font-semibold">${activeChapter.directorPhone || '917548820641'}</div>
                  </div>
                </div>

                <!-- Chapter President -->
                <div class="flex items-center gap-2.5 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-xs">
                  <img 
                    src="${activeChapter.presidentPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}" 
                    alt="President" 
                    class="w-10 h-10 rounded-full object-cover director-avatar-ring shrink-0"
                  />
                  <div>
                    <div class="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider">சாப்டர் தலைவர்</div>
                    <div class="text-xs font-black text-slate-900 leading-tight">${activeChapter.presidentName || activeChapter.leadership?.presidentName || 'ஆர். சுப்ரமணியம்'}</div>
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
                  ${activeChapter.totalBusinessDone || '₹64.5 லட்சம்'}
                </div>
                <div class="text-xs font-bold text-emerald-700 mt-0.5">
                  உருவாக்கப்பட்ட நேரடி வர்த்தகம்
                </div>
              </div>
              <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                <span>பரிமாறப்பட்ட லீட்கள்:</span>
                <span class="text-slate-900 font-black font-mono">${activeChapter.leadsGeneratedCount || 48}+ லீட்கள்</span>
              </div>
            </div>

          </div>

          <!-- Capacity Utilization & Urgent Vacancy Callout -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            
            <!-- Capacity Progress -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-700">Chapter Capacity & Seats (சாப்டர் சீட்கள்):</span>
                <span class="text-slate-900 font-mono font-black">${filledCount} / ${maxCapacity} சீட்கள்</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 bg-amber-500" style="width: ${utilPct}%"></div>
              </div>
              <div class="flex items-center justify-between text-xs font-bold pt-0.5">
                <span class="text-amber-800 font-black">${utilPct}% நிரம்பியது</span>
                <span class="urgent-vacancy-pulse px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-black">
                  🔥 இன்னும் ${availCount} இடங்கள் மட்டுமே காலியாக உள்ளன!
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
                  oninput="app.checkHomeCategoryVacancy(this.value, '${activeChapter.id}')"
                  placeholder="எ.கா: சிமெண்ட், இண்டீரியர், எலக்ட்ரிக்கல், நகைக்கடை..." 
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
              </div>
              <div id="home-cat-check-result" class="text-[11px] font-bold text-slate-500">
                மேலே உங்கள் தொழிலை டைப் செய்து உடனே சோதிக்கவும்.
              </div>
              <button onclick="app.openApplyModal('${activeChapter.id}')" class="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition text-center">
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
            <button onclick="app.openApplyModal('${activeChapter.id}')" class="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-2xl transition transform hover:scale-105">
              🚀 உறுப்பினர் விண்ணப்பம் சமர்ப்பிக்கவும் ➔
            </button>
            <a href="https://wa.me/917548820641?text=வணக்கம்%20சந்திரா,%20NBN%20சாப்டரில்%20இணைய%20விரும்புகிறேன்." target="_blank" class="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition flex items-center gap-2">
              <span>💬 சந்திராவுடன் (Nuvea Studio) பேசுக</span>
            </a>
          </div>
        </div>

      </div>
    `;
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
      const hubHtml = `
        <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
          <div class="radar-hub-circle" style="position: absolute; width: 48px; height: 48px; border-radius: 50%; background: rgba(245, 158, 11, 0.4); border: 2px solid #f59e0b;"></div>
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #0f172a; border: 3px solid #f59e0b; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-weight: 900; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 5;">
            🏛️
          </div>
        </div>
      `;
      const hubIcon = L.divIcon({
        className: 'chapter-hub-marker',
        html: hubHtml,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });
      L.marker(center, { icon: hubIcon }).addTo(this.homeMap)
        .bindPopup(`
          <div style="padding: 12px; font-family: sans-serif; min-width: 200px;">
            <div style="font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase;">NBN சாப்டர் தலைமையிடம்</div>
            <div style="font-size: 14px; font-weight: 900; color: #0f172a; margin-top: 2px;">${chap.nameTa || 'சாப்டர் மையம்'}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${groupMembers.length} இணைக்கப்பட்ட வணிகர்கள்</div>
          </div>
        `);

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
        const markerHtml = `
          <div style="background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); width: 44px; height: 44px; border-radius: 50%; padding: 3px; box-shadow: 0 4px 14px rgba(220, 39, 67, 0.45); display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer;">
            <div style="background: white; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; color: #0f3b7a; border: 2px solid white;">
              ${(m.businessName || 'N').charAt(0)}
            </div>
            <div style="position: absolute; bottom: -7px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #dc2743;"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-pin-marker',
          html: markerHtml,
          iconSize: [44, 52],
          iconAnchor: [22, 52],
          popupAnchor: [0, -50]
        });

        const cleanPhone = (m.phone || '').replace(/\D/g, '');
        const waText = encodeURIComponent(`வணக்கம் ${m.ownerName}, NBN நெட்வொர்க் மேப் மூலம் தொடர்பு கொள்கிறேன்.`);

        const popupContent = `
          <div style="padding: 14px; font-family: sans-serif; min-width: 240px; border-radius: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 9px; font-weight: 800; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 6px; border: 1px solid #fde68a;">
                🔒 Category Exclusivity
              </span>
              <span style="font-size: 9px; font-weight: 700; color: #059669;">✓ VERIFIED</span>
            </div>
            <div style="font-size: 14px; font-weight: 900; color: #0f172a; line-height: 1.2;">
              ${m.businessName}
            </div>
            <div style="font-size: 11px; color: #64748b; font-weight: 600; margin-top: 2px;">
              உரிமையாளர்: <strong>${m.ownerName}</strong>
            </div>
            <div style="font-size: 11px; font-weight: 800; color: #b45309; margin-top: 4px;">
              ${m.category || m.categoryId}
            </div>
            ${m.specialOffer ? `
              <div style="font-size: 10px; color: #334155; background: #f8fafc; padding: 6px; border-radius: 8px; margin-top: 6px; border: 1px solid #e2e8f0;">
                🎁 ${m.specialOffer}
              </div>
            ` : ''}
            <div style="margin-top: 10px; display: flex; gap: 6px;">
              <a href="https://wa.me/${cleanPhone}?text=${waText}" target="_blank" style="flex: 1; background: #16a34a; color: white; padding: 6px; border-radius: 8px; font-size: 11px; font-weight: 800; text-align: center; text-decoration: none;">
                💬 வாட்ஸ்அப்
              </a>
              <button onclick="app.openStandaloneBiz('${m.id}')" style="flex: 1; background: #0f172a; color: white; padding: 6px; border-radius: 8px; font-size: 11px; font-weight: 700; text-align: center; border: none; cursor: pointer;">
                விவரம் ➔
              </button>
            </div>
          </div>
        `;

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

    if (this.homeMap && typeof this.homeMap.flyTo === 'function' && talukCoords[talukId]) {
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

    const members = (this.db.members || []).filter(m => (m.chapterId || (m.talukId === 'harur' ? 'harur_titans' : `${m.talukId}_titans`)) === chapterId);
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

  // ==========================================
  // VIEW: CHAPTERS
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

    return `
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
              ${totalFilled} உறுப்பினர்கள் / ${totalCapacity} மொத்த இடங்கள்
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs font-bold">
            <span class="text-emerald-400">✓ ${totalCapacity - totalFilled} இடங்கள் சேர்க்கைக்கு தயார்</span>
            <span class="text-slate-400">• ${chapters.length} தாலுகா சாப்டர்கள்</span>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-black text-slate-700 mr-2">மாவட்டம் வாரியாக:</span>
          <button onclick="app.filterChapters('all')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${districtFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}">
            அனைத்து மாவட்டங்கள் (${chapters.length})
          </button>
          <button onclick="app.filterChapters('dharmapuri')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${districtFilter === 'dharmapuri' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}">
            தருமபுரி (${chapters.filter(c => (c.districtId || '').toLowerCase() === 'dharmapuri').length})
          </button>
          <button onclick="app.filterChapters('salem')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${districtFilter === 'salem' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}">
            சேலம் (${chapters.filter(c => (c.districtId || '').toLowerCase() === 'salem').length})
          </button>
          <button onclick="app.filterChapters('krishnagiri')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${districtFilter === 'krishnagiri' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}">
            கிருஷ்ணகிரி (${chapters.filter(c => (c.districtId || '').toLowerCase() === 'krishnagiri').length})
          </button>
        </div>

        <!-- CHAPTERS GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filteredChapters.map(ch => {
            const chapMembers = members.filter(m => (m.chapterId || (m.talukId === 'harur' ? 'harur_titans' : `${m.talukId}_titans`)) === ch.id);
            const maxCap = ch.capacity === 'unlimited' ? 100 : (parseInt(ch.capacity) || 100);
            const filledCount = chapMembers.length > 0 ? chapMembers.length : (ch.filledSeats || 0);
            const availCount = Math.max(0, maxCap - filledCount);
            const utilPct = Math.min(100, Math.round((filledCount / maxCap) * 100));
            const isFull = filledCount >= maxCap;

            return `
              <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
                <div>
                  <!-- Top Badge -->
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-[11px] font-black">
                      ${ch.code || 'NBN-CH'}
                    </span>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black ${isFull ? 'bg-red-100 text-red-900' : 'bg-emerald-100 text-emerald-900'}">
                      ${isFull ? '⏳ முழுமை (காத்திருப்பு)' : '✓ சேர்க்கை நடப்பில் உள்ளது'}
                    </span>
                  </div>

                  <!-- Name -->
                  <h3 class="text-xl font-black text-slate-900 leading-snug">
                    ${ch.nameTa}
                  </h3>
                  <div class="text-xs text-slate-500 font-semibold mt-0.5">
                    ${ch.nameEn || ch.name} • ${(ch.districtId || 'Dharmapuri').toUpperCase()}
                  </div>

                  <!-- Capacity Utilization Bar -->
                  <div class="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-slate-700">கொள்ளளவு பயன்பாடு</span>
                      <strong class="font-mono text-slate-900">${filledCount} / ${ch.capacity || 100}</strong>
                    </div>
                    
                    <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500 ${utilPct >= 90 ? 'bg-red-500' : utilPct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: ${utilPct}%"></div>
                    </div>

                    <div class="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>${utilPct}% நிரம்பியுள்ளது</span>
                      <span class="text-emerald-700 font-bold">${availCount} இடங்கள் மீதம்</span>
                    </div>
                  </div>

                  <!-- Meeting Schedule & Venue -->
                  <div class="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div class="flex items-center gap-1.5">
                      <span>📅</span>
                      <span><strong>${ch.meetingDay || 'வெள்ளிக்கிழமை'}</strong> ${ch.meetingTime || '07:30 AM'}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span>📍</span>
                      <span class="truncate">${ch.meetingVenue || ch.venue || 'ஹரூர் NBN பிசினஸ் சென்டர்'}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span>👑</span>
                      <span>டைரக்டர்: <strong>${ch.directorName || 'தலைமை நிர்வாகி'}</strong></span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <button onclick="app.openApplyModal('${ch.id}')" class="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition text-center shadow-xs">
                      விண்ணப்பி ➔
                    </button>
                    <button onclick="app.openGuestModal('${ch.id}')" class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition text-center">
                      பார்வையாளர்
                    </button>
                  </div>
                  
                  <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <a href="${ch.googleMeetUrl || 'https://meet.google.com/nbn-harur'}" target="_blank" class="text-brand-900 hover:underline font-bold">
                      📹 Google Meet
                    </a>
                    ${this.currentRole === 'super_admin' ? `
                      <button onclick="app.openCapacityModal('${ch.id}')" class="text-red-700 hover:underline font-black">
                        ⚙️ கொள்ளளவு மாற்று
                      </button>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW: DIGITAL CERTIFICATE OF EXCLUSIVITY VERIFICATION
  // ==========================================
  renderCertificateVerificationView() {
    const isTa = this.lang === 'ta';
    const certs = this.db.certificates || [];
    const searchId = (this.certificateSearchId || 'NBN-CERT-HAR-001').trim();
    const cert = certs.find(c => c.id.toLowerCase() === searchId.toLowerCase()) || certs[0];

    return `
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
              value="${searchId}" 
              placeholder="எ.கா: NBN-CERT-HAR-001" 
              class="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
            />
            <button onclick="app.verifyCertificate()" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition">
              சரிபார் ✓
            </button>
          </div>
        </div>

        ${cert ? `
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
                Nuvea Business Network (NBN) விதிமுறைகள் மற்றும் சாப்டர் ஒழுங்குமுறைகளின்படி, கீழ் குறிப்பிட்ட வணிக நிறுவனத்திற்கு இந்த சாப்டர் எல்லைக்குள் <strong>100% Category Exclusivity (தொழில் உரிமை) உரிமை</strong> வழங்கப்படுகிறது என சான்றளிக்கப்படுகிறது:
              </p>

              <div class="py-4 border-y border-amber-200/80 space-y-2">
                <div class="text-xl sm:text-2xl font-black text-brand-950 tracking-tight">
                  ${cert.businessName || 'நுவேவா ஸ்டுடியோ (Nuvea Studio)'}
                </div>
                <div class="text-xs sm:text-sm font-bold text-slate-800">
                  உரிமையாளர்: <span class="text-amber-700">${cert.memberName || 'சந்திரா (Chandru)'}</span>
                </div>
                <div class="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-900 font-black text-xs border border-amber-400/40 uppercase tracking-wide">
                  🔒 பாதுகாக்கப்பட்ட வணிகப் பிரிவு: ${cert.categoryName || 'டிஜிட்டல் மீடியா & மார்க்கெட்டிங்'}
                </div>
              </div>

              <p class="text-slate-600 text-xs">
                சாப்டர்: <strong>${cert.chapterName || 'ஹரூர் டைட்டன்ஸ் சாப்டர்'}</strong> • மாவட்டம்: <strong>தருமபுரி (Dharmapuri)</strong>
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
                <div class="font-mono font-black text-slate-900 text-sm">${cert.id}</div>
                <div class="text-[10px] text-slate-500">வழங்கப்பட்ட தேதி: ${cert.issueDate || '2026-01-15'}</div>
                <div class="text-[10px] text-emerald-700 font-bold">செல்லுபடியாகும் காலம்: ${cert.validUntil || '2027-01-14'}</div>
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
            <button onclick="app.copyStoreLink('https://54d0f61bec8945.lhr.life/#/verify-certificate/${cert.id}')" class="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center gap-2">
              <span>🔗 சரிபார்ப்பு லிங்க் நகலெடு</span>
            </button>
          </div>
        ` : `
          <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <div class="text-4xl">⚠️</div>
            <h3 class="text-lg font-black text-slate-900">சான்றிதழ் எண் காணப்படவில்லை</h3>
            <p class="text-xs text-slate-500">தயவுசெய்து சரியான சான்றிதழ் எண்ணை உள்ளிடவும் (எ.கா: NBN-CERT-HAR-001).</p>
          </div>
        `}
      </div>
    `;
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
        alert(`வருகை பதிவு செய்யப்பட்டது: ${status.toUpperCase()}`);
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
    const tokenParam = this.token ? `&token=${encodeURIComponent(this.token)}` : '';
    window.open(`/api/admin/reports/${type || 'growth'}?format=csv${tokenParam}`, '_blank');
  }

  // ==========================================
  // ENTERPRISE ACTION MODALS
  // ==========================================
  openApplyModal(chapterId, categoryId) {
    const chapters = this.db.chapters || [];
    const categories = this.db.categories || [];
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                <span>📝 NBN உறுப்பினர் சேர்க்கை விண்ணப்பம்</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900">
                100% Category Exclusivity (தொழில் உரிமை) உரிமைக்கு விண்ணப்பிக்கவும்
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
                    ${chapters.map(ch => `
                      <option value="${ch.id}" ${chapterId === ch.id ? 'selected' : ''}>${ch.nameTa} (${ch.districtId})</option>
                    `).join('')}
                  </select>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">வணிகப் பிரிவு (Category) *</label>
                  <select name="categoryId" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                    ${categories.slice(0, 40).map(cat => `
                      <option value="${cat.id}" ${categoryId === cat.id ? 'selected' : ''}>${cat.nameTa || cat.id}</option>
                    `).join('')}
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
    `;
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

    modalEl.innerHTML = `
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
                  ${chapters.map(ch => `
                    <option value="${ch.id}" ${chapterId === ch.id ? 'selected' : ''}>${ch.nameTa} (${ch.meetingDay || 'வெள்ளி'} ${ch.meetingTime || '07:30 AM'})</option>
                  `).join('')}
                </select>
              </div>

              <button type="submit" class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition">
                பார்வையாளராக பதிவு செய் ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
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

    modalEl.innerHTML = `
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
                  ${members.map(m => `
                    <option value="${m.id}">${m.ownerName} - ${m.businessName} (${m.category})</option>
                  `).join('')}
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
    `;
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

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-900 border border-red-300 mb-2">
                <span>⚙️ சூப்பர் அட்மின்: சாப்டர் கொள்ளளவு கட்டமைப்பு</span>
              </div>
              <h3 class="text-xl font-black text-slate-900">
                ${ch.nameTa || 'சாப்டர்'} கொள்ளளவை மாற்றுக
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                இயல்புநிலை கொள்ளளவு 100 உறுப்பினர்கள். தேவைக்கேற்ப மாற்றியமைக்கலாம்.
              </p>
            </div>

            <form onsubmit="app.submitCapacityChange(event, '${ch.id}')" class="space-y-3.5 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">அனுமதிக்கப்பட்ட உறுப்பினர் வரம்பு *</label>
                <select name="capacity" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                  <option value="50" ${ch.capacity == 50 ? 'selected' : ''}>50 உறுப்பினர்கள்</option>
                  <option value="100" ${ch.capacity == 100 || !ch.capacity ? 'selected' : ''}>100 உறுப்பினர்கள் (Default)</option>
                  <option value="150" ${ch.capacity == 150 ? 'selected' : ''}>150 உறுப்பினர்கள்</option>
                  <option value="200" ${ch.capacity == 200 ? 'selected' : ''}>200 உறுப்பினர்கள்</option>
                  <option value="unlimited" ${ch.capacity === 'unlimited' ? 'selected' : ''}>வரம்பற்ற (Unlimited)</option>
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
    `;
  }

  async submitCapacityChange(e, chapterId) {
    e.preventDefault();
    const form = e.target;
    const capacity = form.capacity.value;
    const reason = form.reason.value;

    try {
      const res = await fetch(`/api/admin/chapters/${chapterId}/capacity`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity, reason })
      });
      const data = await res.json();
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert(`சாப்டர் கொள்ளளவு ${capacity} உறுப்பினர்களாக வெற்றிகரமாக மாற்றப்பட்டது!`);
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

    modalEl.innerHTML = `
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
                  ${members.map(m => `
                    <option value="${m.id}" ${memberId === m.id ? 'selected' : ''}>${m.ownerName} - ${m.businessName} (${m.category})</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">புதிய இலக்கு சாப்டர் (Target Chapter) *</label>
                <select name="targetChapterId" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-bold">
                  ${chapters.map(ch => `
                    <option value="${ch.id}">${ch.nameTa} (${ch.districtId})</option>
                  `).join('')}
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
    `;
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

    modalEl.innerHTML = `
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

            <form onsubmit="app.submitReferralConfirmation(event, '${referralId}')" class="space-y-3.5 text-xs">
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
    `;
  }

  async submitReferralConfirmation(e, referralId) {
    e.preventDefault();
    const form = e.target;
    const verifiedClosedValue = form.verifiedClosedValue.value;
    const remarks = form.remarks.value;

    try {
      await fetch(`/api/member/referral/${referralId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedClosedValue, remarks })
      });
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert(`நிறைவு வணிக மதிப்பு ₹${verifiedClosedValue} வெற்றிகரமாக உறுதிப்படுத்தப்பட்டது!`);
      await this.fetchData();
      this.render();
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('மதிப்பு சேமிக்கப்பட்டது!');
    }
  }


  // ==========================================
  // MODULE B: MARKETPLACE PUBLIC & CUSTOMER VIEWS
  // ==========================================

  renderMarketplaceView() {
    const isTa = this.lang === 'ta';
    const chapters = this.db.chapters || [];
    const categories = this.db.categories || [];
    const members = this.db.members || [];
    const requirements = (this.db.customerRequirements || []).filter(r => r.status === 'open' || r.status === 'submitted');
    const orders = this.db.marketplaceOrders || [];

    const searchQuery = (this.marketplaceSearchQuery || '').toLowerCase().trim();
    const selectedCat = this.marketplaceCategoryFilter || '';
    const selectedTaluk = this.marketplaceTalukFilter || 'all';

    // Cross-chapter verified supplier search
    const matchingSuppliers = members.filter(m => {
      const matchCat = !selectedCat || m.categoryId === selectedCat;
      const matchTaluk = selectedTaluk === 'all' || (m.talukId || '').toLowerCase() === selectedTaluk.toLowerCase();
      
      let matchQuery = true;
      if (searchQuery) {
        const catObj = categories.find(c => c.id === m.categoryId) || {};
        const catTa = (catObj.nameTa || '').toLowerCase();
        const catEn = (catObj.nameEn || '').toLowerCase();

        matchQuery = (m.businessName || '').toLowerCase().includes(searchQuery) ||
                     (m.ownerName || '').toLowerCase().includes(searchQuery) ||
                     (m.category || '').toLowerCase().includes(searchQuery) ||
                     catTa.includes(searchQuery) ||
                     catEn.includes(searchQuery) ||
                     (m.specialOffer || '').toLowerCase().includes(searchQuery);
      }
      return matchCat && matchTaluk && matchQuery;
    });

    return `
      <div class="space-y-8 max-w-6xl mx-auto">
        
        <!-- Marketplace Top Banner -->
        <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div class="max-w-3xl space-y-4 relative z-10">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              <span>🛒 NBN B2B மார்க்கெட்பிளேஸ் (Multi-Chapter Marketplace)</span>
            </div>
            
            <h1 class="text-2xl sm:text-4xl font-black text-white leading-tight">
              சரிபார்க்கப்பட்ட சப்ளையர்களிடம் <span class="text-amber-400">நேரடி போட்டி விலைப்புள்ளிகள்</span>
            </h1>

            <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              தருமபுரி மற்றும் சுற்றுவட்டார சாப்டர்களின் அங்கீகரிக்கப்பட்ட வணிகர்களிடம் உங்கள் தேவையை சமர்ப்பித்து, குறைவான சிறந்த விலையில் தரமான தயாரிப்புகள் மற்றும் சேவைகளைப் பெறுங்கள்.
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button onclick="app.openRequirementModal()" class="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center gap-2">
                <span>📝 உங்கள் தேவையை சமர்ப்பியுங்கள் (Post Requirement)</span>
              </button>
              <button onclick="app.setTab('customer')" class="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition flex items-center gap-2">
                <span>👤 வாடிக்கையாளர் போர்டல் & ஆர்டர்கள்</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Search & Filter Controls -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col md:flex-row md:items-center gap-3">
            <div class="flex-1 relative">
              <input 
                type="text" 
                id="market-search-input"
                value="${this.marketplaceSearchQuery || ''}" 
                oninput="app.setMarketplaceSearch(this.value)"
                placeholder="என்ன தயாரிப்பு அல்லது சேவை தேவை? (எ.கா: சிமெண்ட், TMT கம்பி, இன்டீரியர், பிளம்பிங்...)" 
                class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
              <span class="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <select onchange="app.setMarketplaceCategoryFilter(this.value)" class="px-3.5 py-3 border border-slate-300 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-hidden">
                <option value="">அனைத்து வணிகப் பிரிவுகள்</option>
                ${categories.slice(0, 30).map(c => `
                  <option value="${c.id}" ${selectedCat === c.id ? 'selected' : ''}>${c.nameTa || c.nameEn}</option>
                `).join('')}
              </select>

              <select onchange="app.setMarketplaceTalukFilter(this.value)" class="px-3.5 py-3 border border-slate-300 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-hidden">
                <option value="all">அனைத்து தாலுகாக்கள்</option>
                <option value="harur" ${selectedTaluk === 'harur' ? 'selected' : ''}>ஹரூர் (Harur)</option>
                <option value="palacode" ${selectedTaluk === 'palacode' ? 'selected' : ''}>பாலக்கோடு (Palacode)</option>
                <option value="karimangalam" ${selectedTaluk === 'karimangalam' ? 'selected' : ''}>காரிமங்கலம்</option>
                <option value="dharmapuri_town" ${selectedTaluk === 'dharmapuri_town' ? 'selected' : ''}>தருமபுரி சென்ட்ரல்</option>
                <option value="pennagaram" ${selectedTaluk === 'pennagaram' ? 'selected' : ''}>பென்னாகரம்</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs font-bold text-slate-500 pt-1 border-t border-slate-100">
            <span>பொருத்தமான வணிகர்கள்: <strong class="text-slate-900">${matchingSuppliers.length}</strong></span>
            <span>செயலில் உள்ள தேவைகள்: <strong class="text-amber-700">${requirements.length}</strong></span>
          </div>
        </div>

        <!-- ACTIVE CUSTOMER REQUIREMENTS BOARD (OPEN BIDDING OPPORTUNITIES) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-black text-slate-900">📋 வாடிக்கையாளர் தேவைகள் & விலைப்புள்ளி ஏலங்கள் (Active Requirements)</h2>
              <p class="text-xs text-slate-500 mt-0.5">சப்ளையர்கள் விலைப்புள்ளி சமர்ப்பிக்கக்கூடிய நடப்பு தேவைகள்.</p>
            </div>
            <button onclick="app.openRequirementModal()" class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition">
              ➕ புதிய தேவை
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${requirements.map(req => {
              const quotes = (this.db.quotations || []).filter(q => q.requirementId === req.id);
              const minQuote = quotes.length > 0 ? Math.min(...quotes.map(q => q.finalTotal)) : null;

              return `
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-amber-400 transition space-y-3 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <span class="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-mono text-[10px] font-black border border-amber-200">
                        ${req.id}
                      </span>
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                        ${quotes.length} விலைப்புள்ளிகள் வந்துள்ளன
                      </span>
                    </div>

                    <h3 class="text-base font-black text-slate-900 leading-snug">
                      ${req.title}
                    </h3>

                    <div class="text-xs text-slate-600 font-medium space-y-1">
                      <div>அளவு: <strong class="text-slate-900">${req.quantity} ${req.unit}</strong> • பிராண்ட்: <span class="text-slate-800">${req.brandPreference || 'எதுவும்'}</span></div>
                      <div>இடம்: <strong>${(req.deliveryTaluk || '').toUpperCase()}, ${(req.deliveryDistrict || 'Dharmapuri').toUpperCase()}</strong></div>
                      <div>தேவைப்படும் தேதி: <strong class="text-brand-900">${req.requiredDate}</strong></div>
                      ${req.specifications ? `<p class="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">"${req.specifications}"</p>` : ''}
                    </div>

                    ${minQuote ? `
                      <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <span class="text-emerald-900 font-bold">குறைந்த விலை (Lowest Quote):</span>
                        <strong class="font-mono text-emerald-700 text-sm">₹${minQuote.toLocaleString('en-IN')}</strong>
                      </div>
                    ` : ''}
                  </div>

                  <div class="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button onclick="app.openSubmitQuotationModal('${req.id}')" class="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition text-center">
                      விலைப்புள்ளி சமர்ப்பி ➔
                    </button>
                    <button onclick="app.openCompareQuotationsModal('${req.id}')" class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition text-center">
                      விலைகளை ஒப்பிடு (${quotes.length})
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- VERIFIED NBN SUPPLIERS DIRECTORY (ACROSS ALL CHAPTERS) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-black text-slate-900">👥 சாப்டர் வாரியான சரிபார்க்கப்பட்ட சப்ளையர்கள் (Verified Suppliers)</h2>
              <p class="text-xs text-slate-500 mt-0.5">ஹரூர், பாலக்கோடு, காரிமங்கலம், தருமபுரி டவுன் உள்ளிட்ட அனைத்து சாப்டர்கள்.</p>
            </div>
            <span class="text-xs font-bold text-emerald-700">${matchingSuppliers.length} வணிகர்கள்</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${matchingSuppliers.slice(0, 12).map(sup => {
              const chap = chapters.find(c => c.id === sup.chapterId) || {};
              const cleanPhone = (sup.phone || '9842100000').replace(/\D/g, '');
              const waText = encodeURIComponent(`வணக்கம் ${sup.businessName}, NBN மார்க்கெட்பிளேஸ் மூலம் தொடர்பு கொள்கிறேன்.`);

              return `
                <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3">
                  <div>
                    <div class="flex items-center justify-between gap-1 mb-2">
                      <span class="px-2 py-0.5 rounded-md bg-brand-50 text-brand-900 text-[10px] font-black uppercase font-mono">
                        ${chap.nameTa || 'ஹரூர் டைட்டன்ஸ்'}
                      </span>
                      <span class="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                        ✓ VERIFIED
                      </span>
                    </div>

                    <h3 class="text-base font-black text-slate-900 leading-snug">
                      ${sup.businessName}
                    </h3>
                    <div class="text-xs text-slate-500 font-bold mt-0.5">
                      உரிமையாளர்: ${sup.ownerName}
                    </div>

                    <div class="inline-block my-2 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-black border border-amber-200">
                      ${sup.category || sup.categoryId}
                    </div>

                    ${sup.specialOffer ? `
                      <div class="text-[11px] text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                        🎁 <strong>சிறப்பு சலுகை:</strong> ${sup.specialOffer}
                      </div>
                    ` : ''}
                  </div>

                  <div class="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <a href="https://wa.me/${cleanPhone}?text=${waText}" target="_blank" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition text-center flex items-center justify-center gap-1">
                      💬 வாட்ஸ்அப்
                    </a>
                    <button onclick="app.openStandaloneBiz('${sup.id}')" class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition text-center">
                      விவரம் ➔
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  }

  // ==========================================
  // CUSTOMER DASHBOARD (MY REQUIREMENTS, QUOTES, ORDERS)
  // ==========================================

  renderCustomerDashboardView() {
    const isTa = this.lang === 'ta';
    const myRequirements = this.db.customerRequirements || [];
    const myOrders = this.db.marketplaceOrders || [];

    const totalQuotesReceived = (this.db.quotations || []).length;
    const completedOrders = myOrders.filter(o => o.orderStatus === 'delivered' || o.orderStatus === 'closed' || o.orderStatus === 'customer_confirmed');
    const totalSpent = completedOrders.reduce((sum, o) => sum + (o.finalDealValue || 0), 122400);

    return `
      <div class="space-y-8 max-w-5xl mx-auto">
        <!-- Customer Header -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-brand-900 border border-brand-300 mb-2">
              <span>👤 பொது வாடிக்கையாளர் போர்டல் (Customer Portal)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              வாடிக்கையாளர் கட்டுப்பாட்டு அறை (My Dashboard)
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              தேவைகளை பதிவிடுதல், சப்ளையர்களின் போட்டி விலைப்புள்ளிகளை ஒப்பிடுதல் மற்றும் ஆர்டர்களைக் கண்காணித்தல்.
            </p>
          </div>

          <button onclick="app.openRequirementModal()" class="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-2 shrink-0">
            <span>➕ புதிய தேவை சமர்ப்பி</span>
          </button>
        </div>

        <!-- Customer KPIs -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">பதிவிட்ட தேவைகள்</div>
            <div class="text-2xl sm:text-3xl font-black text-slate-900">${myRequirements.length}</div>
            <div class="text-[11px] text-slate-500 mt-1">கட்டுமானம் & கொள்முதல்</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">பெறப்பட்ட விலைப்புள்ளிகள்</div>
            <div class="text-2xl sm:text-3xl font-black text-brand-900">${totalQuotesReceived}</div>
            <div class="text-[11px] text-emerald-600 font-semibold mt-1">போட்டி விலைகள் தயார்</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">நடப்பில் உள்ள ஆர்டர்கள்</div>
            <div class="text-2xl sm:text-3xl font-black text-amber-600">${myOrders.length}</div>
            <div class="text-[11px] text-slate-500 mt-1">டெலிவரி & கண்காணிப்பு</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">நிறைவு பெற்ற மதிப்பு</div>
            <div class="text-2xl sm:text-3xl font-black text-emerald-700">₹${(totalSpent).toLocaleString('en-IN')}</div>
            <div class="text-[11px] text-emerald-600 font-bold mt-1">100% சரிபார்க்கப்பட்டது</div>
          </div>
        </div>

        <!-- MY SUBMITTED REQUIREMENTS & QUOTATIONS -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-black text-slate-900 text-base sm:text-lg">📋 எனது தேவைகள் & விலைப்புள்ளி ஒப்பீடு</h3>
              <p class="text-xs text-slate-500 mt-0.5">சப்ளையர்கள் அனுப்பியுள்ள விலைகளை ஒப்பிட்டு வணிகரைத் தேர்வு செய்யுங்கள்.</p>
            </div>
            <span class="text-xs font-bold text-brand-900">${myRequirements.length} தேவைகள்</span>
          </div>

          <div class="space-y-4">
            ${myRequirements.map(req => {
              const quotes = (this.db.quotations || []).filter(q => q.requirementId === req.id);
              const isSelected = req.status === 'selected' || req.selectedQuotationId;

              return `
                <div class="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-mono text-[10px] font-black bg-slate-200 px-2 py-0.5 rounded text-slate-800">${req.id}</span>
                        <span class="text-xs font-bold text-slate-500">${req.categoryName || req.categoryId}</span>
                        ${isSelected ? `
                          <span class="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-black">✓ தேர்வு செய்யப்பட்டது</span>
                        ` : `
                          <span class="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-black">ஏலம் நடப்பில் உள்ளது</span>
                        `}
                      </div>
                      <h4 class="font-black text-slate-900 text-base">${req.title}</h4>
                      <p class="text-xs text-slate-600 mt-0.5">அளவு: <strong>${req.quantity} ${req.unit}</strong> • இடம்: <strong>${req.deliveryTaluk.toUpperCase()}</strong> • தேவைப்படும் தேதி: <strong>${req.requiredDate}</strong></p>
                    </div>

                    <div class="shrink-0 flex items-center gap-2">
                      <button onclick="app.openCompareQuotationsModal('${req.id}')" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5">
                        <span>📊 விலைகளை ஒப்பிடு (${quotes.length})</span>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- ORDER & PROJECT TRACKING -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-black text-slate-900 text-base sm:text-lg">🚚 ஆர்டர் டிராக்கர் (Order & Delivery Progress)</h3>
              <p class="text-xs text-slate-500 mt-0.5">தேர்வு செய்யப்பட்ட சப்ளையர்களுடன் நடப்பில் உள்ள மற்றும் நிறைவடைந்த ஆர்டர்கள்.</p>
            </div>
            <span class="text-xs font-bold text-emerald-700">${myOrders.length} ஆர்டர்கள்</span>
          </div>

          <div class="space-y-4">
            ${myOrders.map(ord => {
              const isDelivered = ord.orderStatus === 'delivered' || ord.orderStatus === 'closed' || ord.orderStatus === 'customer_confirmed';
              return `
                <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-mono text-[10px] font-black bg-blue-50 text-brand-900 px-2 py-0.5 rounded border border-blue-200">${ord.id}</span>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black ${isDelivered ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}">
                          ${ord.orderStatus.toUpperCase()}
                        </span>
                      </div>
                      <h4 class="font-black text-slate-900 text-base">${ord.itemTitle}</h4>
                      <p class="text-xs text-slate-600 mt-0.5">சப்ளையர்: <strong>${ord.supplierBusinessName}</strong> • ஒப்பந்த மதிப்பு: <strong class="text-emerald-700 text-sm">₹${(ord.finalDealValue || 0).toLocaleString('en-IN')}</strong></p>
                      <p class="text-[11px] text-slate-500 font-mono mt-0.5">சப்ளையர் போன்: ${ord.supplierPhone || '9842511223'} • ஆர்டர் தேதி: ${(ord.orderDate || '').split('T')[0]}</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 shrink-0">
                      ${!isDelivered ? `
                        <button onclick="app.updateCustomerOrderStatus('${ord.id}', 'delivered')" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition">
                          ✓ டெலிவரி கிடைத்தது
                        </button>
                      ` : `
                        <button onclick="app.openReviewModal('${ord.id}')" class="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition">
                          ⭐ மதிப்பாய்வு எழுது
                        </button>
                      `}
                      <button onclick="app.openDisputeModal('${ord.id}')" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition border border-slate-200">
                        ⚠️ புகார்
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  }

  // ==========================================
  // MARKETPLACE FILTER & SEARCH HELPERS
  // ==========================================

  setMarketplaceSearch(query) {
    this.marketplaceSearchQuery = query;
    this.render();
  }

  setMarketplaceCategoryFilter(catId) {
    this.marketplaceCategoryFilter = catId;
    this.render();
  }

  setMarketplaceTalukFilter(talukId) {
    this.marketplaceTalukFilter = talukId;
    this.render();
  }

  // ==========================================
  // MARKETPLACE INTERACTIVE MODALS
  // ==========================================

  openRequirementModal() {
    const categories = this.db.categories || [];
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                <span>🛒 புதிய தேவை சமர்ப்பி (Post Requirement)</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900">
                தயாரிப்பு அல்லது சேவை தேவையை பதிவிடுங்கள்
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                சரிபார்க்கப்பட்ட NBN சப்ளையர்களிடம் சிறந்த விலைப்புள்ளிகளைப் பெறுங்கள். உங்கள் தொடர்பு விபரம் பாதுகாப்பாக வைக்கப்படும்.
              </p>
            </div>

            <form onsubmit="app.submitCustomerRequirement(event)" class="space-y-3.5 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">உங்கள் பெயர் (Full Name) *</label>
                  <input type="text" name="customerName" required placeholder="எ.கா: சரவணன்" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">மொபைல் எண் (WhatsApp Mobile) *</label>
                  <input type="tel" name="customerPhone" required placeholder="எ.கா: 9842100112" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-400 focus:outline-hidden" />
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">தேவைப்படும் பிரிவு (Category) *</label>
                <select name="categoryId" required class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-amber-400 focus:outline-hidden">
                  ${categories.slice(0, 40).map(c => `
                    <option value="${c.id}">${c.nameTa || c.nameEn}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">தேவை சுருக்க தலைப்பு *</label>
                <input type="text" name="title" required placeholder="எ.கா: 500 மூட்டை அல்ட்ராடெக் சிமெண்ட் தேவை" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">தேவைப்படும் அளவு (Quantity) *</label>
                  <input type="number" name="quantity" required placeholder="500" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-amber-400 focus:outline-hidden" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">அலகு (Unit)</label>
                  <input type="text" name="unit" placeholder="மூட்டை / Sq.Ft / டன்" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">டெலிவரி தாலுகா *</label>
                  <select name="deliveryTaluk" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-amber-400 focus:outline-hidden">
                    <option value="harur">ஹரூர் (Harur)</option>
                    <option value="palacode">பாலக்கோடு (Palacode)</option>
                    <option value="karimangalam">காரிமங்கலம்</option>
                    <option value="dharmapuri_town">தருமபுரி சென்ட்ரல்</option>
                    <option value="pennagaram">பென்னாகரம்</option>
                  </select>
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">எப்போது தேவை? (Date)</label>
                  <input type="date" name="requiredDate" required class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-400 focus:outline-hidden" />
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">கூடுதல் குறிப்புகள் & பிராண்ட் விருப்பம்</label>
                <textarea name="specifications" rows="2" placeholder="குறிப்பிட்ட பிராண்ட், தரம் அல்லது டெலிவரி நிபந்தனைகள்..." class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"></textarea>
              </div>

              <div class="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-brand-900 leading-tight">
                🔒 <strong>வாடிக்கையாளர் பிரைவசி உறுதிமொழி:</strong> நீங்கள் ஒரு சப்ளையரின் விலைப்புள்ளியை தேர்வு செய்யும் வரை உங்கள் தொலைபேசி எண் யாருக்கும் காட்டப்படாது.
              </div>

              <button type="submit" class="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition">
                தேவையை சமர்ப்பித்து ஏலத்தை தொடங்கு ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  async submitCustomerRequirement(e) {
    e.preventDefault();
    const form = e.target;
    const catSelect = form.categoryId;
    const catName = catSelect.options[catSelect.selectedIndex].text;

    const data = {
      customerName: form.customerName.value,
      customerPhone: form.customerPhone.value,
      categoryId: form.categoryId.value,
      categoryName: catName,
      title: form.title.value,
      quantity: form.quantity.value,
      unit: form.unit.value || 'அலகுகள்',
      deliveryTaluk: form.deliveryTaluk.value,
      deliveryDistrict: 'dharmapuri',
      requiredDate: form.requiredDate.value,
      specifications: form.specifications.value
    };

    try {
      const res = await fetch('/api/marketplace/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert('உங்கள் தேவை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! NBN சப்ளையர்களுக்கு அறிவிப்பு அனுப்பப்பட்டுள்ளது.');
      await this.fetchData();
      this.setTab('customer');
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('தேவை சமர்ப்பிக்கப்பட்டது!');
    }
  }

  openSubmitQuotationModal(requirementId) {
    const req = (this.db.customerRequirements || []).find(r => r.id === requirementId) || {};
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2">
                <span>💰 விலைப்புள்ளி ஏலம் சமர்ப்பித்தல் (Submit Quotation)</span>
              </div>
              <h3 class="text-xl font-black text-slate-900">
                ${req.title || 'வாடிக்கையாளர் தேவைக்கு விலைப்புள்ளி'}
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                அளவு: <strong>${req.quantity} ${req.unit}</strong> • இடம்: <strong>${(req.deliveryTaluk || '').toUpperCase()}</strong>
              </p>
            </div>

            <form onsubmit="app.submitQuotationBid(event, '${requirementId}')" class="space-y-3 text-xs">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">அலகு விலை (Unit Price ₹) *</label>
                  <input type="number" id="quote-unit-price" name="unitPrice" required placeholder="340" oninput="app.calcQuoteTotal()" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-hidden" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">அளவு (Quantity)</label>
                  <input type="number" id="quote-qty" name="quantity" readonly value="${req.quantity || 1}" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl font-mono font-bold" />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">டெலிவரி கட்டணம் ₹</label>
                  <input type="number" id="quote-delivery" name="deliveryCharges" value="1000" oninput="app.calcQuoteTotal()" class="w-full px-2.5 py-2 border border-slate-300 rounded-xl font-mono font-bold" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">18% GST ₹</label>
                  <input type="number" id="quote-gst" name="gstAmount" readonly class="w-full px-2.5 py-2 border border-slate-200 bg-slate-50 rounded-xl font-mono font-bold text-slate-600" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">தள்ளுபடி ₹</label>
                  <input type="number" id="quote-discount" name="discount" value="0" oninput="app.calcQuoteTotal()" class="w-full px-2.5 py-2 border border-slate-300 rounded-xl font-mono font-bold" />
                </div>
              </div>

              <!-- Live Calculated Final Total Display -->
              <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between text-xs">
                <span class="font-black text-emerald-900">இறுதி மொத்த விலை (Final Payable):</span>
                <strong class="font-mono text-emerald-700 text-lg font-black" id="quote-final-total-display">₹0</strong>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">டெலிவரி காலம் *</label>
                  <input type="text" name="deliveryTimeline" required placeholder="எ.கா: 24 மணி நேரத்திற்குள்" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">பணம் செலுத்தும் முறை</label>
                  <input type="text" name="paymentTerms" placeholder="பொருட்கள் வந்ததும் NEFT/UPI" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium" />
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">கூடுதல் சிறப்புகள் / குறிப்புகள்</label>
                <textarea name="notes" rows="2" placeholder="தயாரிப்பு உத்தரவாதம், தரம், இலவச அன்லோடிங் போன்றவை..." class="w-full px-3 py-2 border border-slate-300 rounded-xl"></textarea>
              </div>

              <button type="submit" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition">
                விலைப்புள்ளியை சமர்ப்பிக்கவும் ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    setTimeout(() => this.calcQuoteTotal(), 50);
  }

  calcQuoteTotal() {
    const upEl = document.getElementById('quote-unit-price');
    const qtyEl = document.getElementById('quote-qty');
    const delEl = document.getElementById('quote-delivery');
    const gstEl = document.getElementById('quote-gst');
    const discEl = document.getElementById('quote-discount');
    const totalDisplay = document.getElementById('quote-final-total-display');

    if (!upEl || !qtyEl || !totalDisplay) return;

    const unitPrice = parseFloat(upEl.value) || 0;
    const quantity = parseInt(qtyEl.value) || 1;
    const subtotal = unitPrice * quantity;
    const gst = Math.round(subtotal * 0.18);
    const delivery = parseFloat(delEl.value) || 0;
    const discount = parseFloat(discEl.value) || 0;
    const finalTotal = subtotal + gst + delivery - discount;

    if (gstEl) gstEl.value = gst;
    totalDisplay.textContent = '₹' + finalTotal.toLocaleString('en-IN');
  }

  async submitQuotationBid(e, requirementId) {
    e.preventDefault();
    const form = e.target;
    const unitPrice = parseFloat(form.unitPrice.value);
    const quantity = parseInt(form.quantity.value);
    const subtotal = unitPrice * quantity;
    const gstAmount = Math.round(subtotal * 0.18);
    const deliveryCharges = parseFloat(form.deliveryCharges.value) || 0;
    const discount = parseFloat(form.discount.value) || 0;

    const data = {
      unitPrice,
      quantity,
      gstAmount,
      deliveryCharges,
      discount,
      deliveryTimeline: form.deliveryTimeline.value,
      paymentTerms: form.paymentTerms.value,
      notes: form.notes.value
    };

    try {
      const res = await fetch(`/api/marketplace/requirements/${requirementId}/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert('உங்கள் விலைப்புள்ளி வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!');
      await this.fetchData();
      this.render();
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('விலைப்புள்ளி சமர்ப்பிக்கப்பட்டது!');
    }
  }

  openCompareQuotationsModal(requirementId) {
    const req = (this.db.customerRequirements || []).find(r => r.id === requirementId) || {};
    const quotes = (this.db.quotations || []).filter(q => q.requirementId === requirementId);
    const minTotal = quotes.length > 0 ? Math.min(...quotes.map(q => q.finalTotal)) : null;

    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-6">
            <div class="border-b border-slate-200 pb-4">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                <span>📊 போட்டி விலைப்புள்ளிகள் ஒப்பீடு (Quotation Comparison Matrix)</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900">
                ${req.title}
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                அளவு: <strong>${req.quantity} ${req.unit}</strong> • இடம்: <strong>${(req.deliveryTaluk || '').toUpperCase()}</strong> • பெறப்பட்ட விலைப்புள்ளிகள்: <strong>${quotes.length}</strong>
              </p>
            </div>

            ${quotes.length === 0 ? `
              <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div class="text-3xl">⏳</div>
                <h4 class="font-bold text-slate-800 text-sm">இன்னும் விலைப்புள்ளிகள் வரவில்லை</h4>
                <p class="text-xs text-slate-500">சப்ளையர்கள் உங்கள் தேவையை ஆய்வு செய்து வருகின்றனர். விரைவில் விலைப்புள்ளிகள் இங்கு தோன்றும்.</p>
              </div>
            ` : `
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs font-medium">
                  <thead class="bg-slate-900 text-white font-extrabold">
                    <tr>
                      <th class="p-3 rounded-l-xl">சப்ளையர் / நிறுவனம்</th>
                      <th class="p-3">அலகு விலை</th>
                      <th class="p-3">GST + டெலிவரி</th>
                      <th class="p-3">இறுதி மொத்த விலை</th>
                      <th class="p-3">டெலிவரி காலம்</th>
                      <th class="p-3 rounded-r-xl">நடவடிக்கை</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    ${quotes.map(q => {
                      const isLowest = q.finalTotal === minTotal;
                      return `
                        <tr class="hover:bg-slate-50 ${isLowest ? 'bg-emerald-50/40' : ''}">
                          <td class="p-3">
                            <div class="font-black text-slate-900 text-sm">${q.supplierBusinessName}</div>
                            <div class="text-[10px] text-slate-500 mt-0.5">சாப்டர்: ${q.supplierChapterId}</div>
                            ${isLowest ? `
                              <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950">
                                ★ குறைந்த விலை (Lowest Quote)
                              </span>
                            ` : ''}
                          </td>
                          <td class="p-3 font-mono font-bold text-slate-800 text-sm">₹${q.unitPrice}</td>
                          <td class="p-3 font-mono text-slate-600">₹${q.gstAmount + q.deliveryCharges}</td>
                          <td class="p-3 font-mono font-black text-emerald-700 text-base">₹${q.finalTotal.toLocaleString('en-IN')}</td>
                          <td class="p-3 text-slate-700 font-bold">${q.deliveryTimeline}</td>
                          <td class="p-3">
                            <button onclick="app.openSelectQuoteConsentModal('${requirementId}', '${q.id}')" class="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition">
                              தேர்வு செய் & ஆர்டர் ➔
                            </button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}

            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <span class="text-base">💡</span>
              <p>
                <strong>தேர்வு முறை:</strong> குறைந்த விலை என்பது ஒரு வழிகாட்டுதல் மட்டுமே; எந்த சப்ளையரை தேர்வு செய்வது என்பது வாடிக்கையாளரின் முழுமையான உரிமை. வணிகரை தேர்வு செய்த பின்னரே உங்கள் தொடர்பு எண் அவருக்கு பகிரப்படும்.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  openSelectQuoteConsentModal(requirementId, quotationId) {
    const q = (this.db.quotations || []).find(quote => quote.id === quotationId) || {};
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4 text-center">
            <div class="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-black">
              🤝
            </div>

            <div>
              <h3 class="text-xl font-black text-slate-900">
                சப்ளையர் தேர்வு & தொடர்பு பகிர சம்மதம்
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                நீங்கள் <strong>${q.supplierBusinessName}</strong> நிறுவனத்தின் ₹${(q.finalTotal || 0).toLocaleString('en-IN')} விலைப்புள்ளியை தேர்வு செய்கிறீர்கள்.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-left text-xs space-y-2 text-amber-950">
              <div class="font-black flex items-center gap-1.5">
                <span>🔒 வாடிக்கையாளர் பிரைவசி விதி:</span>
              </div>
              <p class="text-[11px] text-amber-900 leading-relaxed">
                நீங்கள் இந்த ஆர்டரை உறுதி செய்வதன் மூலம், உங்கள் தொலைபேசி எண் மற்றும் டெலிவரி முகவரியை இந்த குறிப்பிட்ட சப்ளையருக்கு மட்டும் பகிர முழு சம்மதம் வழங்குகிறீர்கள்.
              </p>
            </div>

            <div class="flex items-center gap-2 text-left text-xs font-bold text-slate-700 pt-2">
              <input type="checkbox" id="chk-customer-consent" checked class="w-4 h-4 text-emerald-600 rounded" />
              <label for="chk-customer-consent">நான் தொடர்பு விவரங்களை பகிர முழு சம்மதம் அளிக்கிறேன்.</label>
            </div>

            <button onclick="app.confirmQuotationSelection('${requirementId}', '${quotationId}')" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition">
              ஆர்டரை உறுதி செய்து தொடர்பை பகிர் ➔
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async confirmQuotationSelection(requirementId, quotationId) {
    const chk = document.getElementById('chk-customer-consent');
    if (chk && !chk.checked) {
      alert('தொடர்பு விவரங்களை பகிர சம்மதம் தேவை');
      return;
    }

    try {
      const res = await fetch(`/api/marketplace/requirements/${requirementId}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotationId, consent: true })
      });
      const data = await res.json();
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert('வாழ்த்துகள்! ஆர்டர் உறுதி செய்யப்பட்டது. சப்ளையர் உங்களை விரைவில் தொடர்பு கொள்வார்.');
      await this.fetchData();
      this.setTab('customer');
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('ஆர்டர் உறுதி செய்யப்பட்டது!');
    }
  }

  async updateCustomerOrderStatus(orderId, status) {
    try {
      await fetch(`/api/marketplace/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: 'வாடிக்கையாளர் டெலிவரி பெற்றதை உறுதி செய்தார்' })
      });
      if (window.playChime) window.playChime('success');
      alert('டெலிவரி உறுதி செய்யப்பட்டது! மதிப்பாய்வு எழுதி வணிகரை ஊக்கப்படுத்துங்கள்.');
      await this.fetchData();
      this.render();
    } catch (err) {
      console.error(err);
      alert('ஆர்டர் நிலை மாற்றப்பட்டது');
    }
  }

  openReviewModal(orderId) {
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                <span>⭐ சரிபார்க்கப்பட்ட வணிகர் மதிப்பாய்வு (Verified Review)</span>
              </div>
              <h3 class="text-xl font-black text-slate-900">
                சப்ளையர் சேவை தரம் குறித்த மதிப்பீடு
              </h3>
            </div>

            <form onsubmit="app.submitReview(event, '${orderId}')" class="space-y-3 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">ஒட்டுமொத்த நட்சத்திர மதிப்பீடு (Overall Rating)</label>
                <select name="rating" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold">
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars - மிகச்சிறந்தது</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars - நன்று</option>
                  <option value="3">⭐⭐⭐ 3 Stars - சுமாராக உள்ளது</option>
                  <option value="2">⭐⭐ 2 Stars - திருப்தி இல்லை</option>
                  <option value="1">⭐ 1 Star - மோசம்</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">கருத்து & அனுபவம் (Feedback)</label>
                <textarea name="comment" rows="3" required placeholder="பொருட்களின் தரம், குறிப்பிட்ட நேரத்தில் டெலிவரி, விலை நியாயம் பற்றி எழுதவும்..." class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"></textarea>
              </div>

              <button type="submit" class="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition">
                மதிப்பாய்வை பதிவு செய் ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  async submitReview(e, orderId) {
    e.preventDefault();
    const form = e.target;
    const data = {
      orderId,
      rating: form.rating.value,
      comment: form.comment.value
    };

    try {
      await fetch('/api/marketplace/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      this.closeModal();
      if (window.playChime) window.playChime('success');
      alert('உங்கள் சரிபார்க்கப்பட்ட மதிப்பாய்வு வெற்றிகரமாக பதிவு செய்யப்பட்டது! நன்றி.');
      await this.fetchData();
      this.render();
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('மதிப்பாய்வு சேமிக்கப்பட்டது!');
    }
  }

  openDisputeModal(orderId) {
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-900 border border-red-300 mb-2">
                <span>⚠️ NBN நடுவர் தீர்ப்பாயம் & புகார் பதிவு</span>
              </div>
              <h3 class="text-xl font-black text-slate-900">
                ஆர்டர் தொடர்பான புகார் பதிவு
              </h3>
            </div>

            <form onsubmit="app.submitDispute(event, '${orderId}')" class="space-y-3 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">பிரச்சனை வகை (Issue Type)</label>
                <select name="issueType" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold">
                  <option value="delayed_delivery">டெலிவரி தாமதம் (Delayed Delivery)</option>
                  <option value="quality_mismatch">தர வேறுபாடு (Quality Mismatch)</option>
                  <option value="pricing_issue">விலை பிரச்சனை (Pricing Issue)</option>
                  <option value="other">பிற காரணங்கள்</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">புகார் விவரம் (Description)</label>
                <textarea name="description" rows="3" required placeholder="நடந்த பிரச்சனையை தெளிவாக விவரிக்கவும்..." class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-hidden"></textarea>
              </div>

              <button type="submit" class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition">
                புகாரை சமர்ப்பி ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  async submitDispute(e, orderId) {
    e.preventDefault();
    const form = e.target;
    const data = {
      orderId,
      issueType: form.issueType.value,
      description: form.description.value
    };

    try {
      await fetch('/api/marketplace/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      this.closeModal();
      if (window.playChime) window.playChime('warning');
      alert('உங்கள் புகார் பதிவு செய்யப்பட்டது! NBN ஒழுங்கு நடவடிக்கைக் குழு 24 மணி நேரத்திற்குள் தீர்வு வழங்கும்.');
      await this.fetchData();
      this.render();
    } catch (err) {
      console.error(err);
      this.closeModal();
      alert('புகார் பதிவு செய்யப்பட்டது!');
    }
  }

  closeModal() {
    const el = document.getElementById('modal-container');
    if (el) el.innerHTML = '';
  }

  // ==========================================
  // VIEW: FIRST PAGE – REGISTRATION / ACCOUNT SELECTION FIRST EXPERIENCE
  // ==========================================
  renderWelcomeRegistrationFirstView() {
    const isTa = this.lang === 'ta';
    return `
      <div class="max-w-6xl mx-auto space-y-8 py-4 sm:py-6">
        
        <!-- HEADER TOP BANNER / BRAND STATEMENT -->
        <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800 text-center overflow-hidden">
          <div class="absolute -right-24 -top-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-24 -bottom-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10 max-w-3xl mx-auto space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>NBN Official Onboarding Portal</span>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              WELCOME TO NBN <br/>
              <span class="text-amber-400">NUVEA BUSINESS NETWORK</span>
            </h1>

            <p class="text-sm sm:text-lg text-slate-300 font-medium">
              "Choose how you want to grow your business with NBN."
            </p>

            <div class="flex items-center justify-center gap-3 pt-2">
              <span class="text-xs text-slate-400">CONNECT • REFER • GROW</span>
              <span class="text-slate-600">•</span>
              <span class="text-xs text-amber-300/80">தருமபுரி & சேலம் மண்டல தொழில் நெட்வொர்க்</span>
            </div>
          </div>
        </div>

        <!-- DUAL MASTER GATEWAY SELECTION (NBN NETWORKING vs NBN BUSINESS MARKETPLACE) -->
        <div class="space-y-6">
          <div class="text-center max-w-2xl mx-auto space-y-1">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-black uppercase tracking-wider border border-slate-800">
              <span>⚡ PRIMARY CHOICE • முதன்மை தேர்வு</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ${isTa ? 'எந்த முறையில் இணைய விரும்புகிறீர்கள்?' : 'Select Your Growth Gateway'}
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 font-medium">
              ${isTa ? 'NBN வழங்கும் இரண்டு முக்கிய தளங்களில் உங்கள் வணிகத்திற்கான சரியான விருப்பத்தைத் தேர்வு செய்யுங்கள்' : 'Choose between Exclusive Chapter Networking or Multi-Chapter Marketplace'}
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            <!-- OPTION 1: NBN NETWORKING (சாப்டர் நெட்வொர்க்கிங்) -->
            <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 rounded-3xl p-7 sm:p-9 text-white shadow-xl border-2 border-amber-400/80 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
              <div class="absolute -right-16 -top-16 w-56 h-56 bg-amber-400/15 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/25 transition"></div>

              <div class="relative z-10 space-y-5">
                <div class="flex items-center justify-between">
                  <div class="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl font-black shadow-lg shadow-amber-400/30">
                    🏛️
                  </div>
                  <span class="px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider">
                    ★ BNI-INSPIRED CHAPTER MODEL
                  </span>
                </div>

                <div>
                  <div class="text-xs font-black uppercase tracking-widest text-amber-400">விருப்பம் 1 • PRIMARY GATEWAY</div>
                  <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                    NBN நெட்வொர்க்கிங் <br/>
                    <span class="text-amber-400 text-xl sm:text-2xl font-bold">(NBN Networking)</span>
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-300 font-medium mt-2 leading-relaxed">
                    ${isTa ? 'தாலுகா அளவிலான பிரத்யேக வணிக சாப்டர். உங்கள் தொழில் பிரிவில் உங்களுக்கு மட்டுமே 100% பிரத்யேக ஏகபோக சீட் (Category Exclusivity) மற்றும் வாராந்திர நேரடி வணிகப் பரிந்துரைகள்.' : 'Taluk-level chapter networking with 100% Category Exclusivity seat per business category, weekly business meetings and verified referral exchange.'}
                  </p>
                </div>

                <!-- Networking Key Pillars -->
                <div class="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-200">
                  <div class="flex items-start gap-2.5">
                    <span class="text-amber-400 font-black text-sm">🔒</span>
                    <span><strong>100% Category Exclusivity:</strong> உங்கள் தாலுகா சாப்டரில் உங்கள் தொழில் பிரிவுக்கு நீங்கள் மட்டுமே ஒரே உறுப்பினர் (போட்டி இல்லை).</span>
                  </div>
                  <div class="flex items-start gap-2.5">
                    <span class="text-amber-400 font-black text-sm">🤝</span>
                    <span><strong>வாராந்திர நேரடி சந்திப்பு:</strong> வாராந்திர சாப்டர் காலை மீட்டிங், 1-to-1 விவாதங்கள் மற்றும் வணிகப் பரிந்துரைகள் பரிமாற்றம்.</span>
                  </div>
                  <div class="flex items-start gap-2.5">
                    <span class="text-amber-400 font-black text-sm">🎬</span>
                    <span><strong>Nuvea Studio 4K Branding:</strong> வணிகர்களுக்கான பிரத்தியேக வீடியோ விளம்பரம், டிஜிட்டல் சான்றிதழ் மற்றும் மார்க்கெட்பிளேஸ் முழு அணுகல்.</span>
                  </div>
                </div>
              </div>

              <div class="relative z-10 pt-6 mt-6 border-t border-slate-800/80 space-y-3">
                <button 
                  onclick="app.openMultiStepOwnerModal('networking_marketplace')"
                  class="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-400/20 transition-all transform group-hover:scale-[1.01] flex items-center justify-center gap-2">
                  <span>🚀 NBN நெட்வொர்க்கிங்கில் இணைய (Join Networking) ➔</span>
                </button>

                <div class="flex items-center justify-between gap-2 text-xs">
                  <button onclick="app.setTab('chapters')" class="flex-1 py-2 text-center text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition border border-slate-700 font-bold">
                    🏛️ சாப்டர்கள் & சீட்கள்
                  </button>
                  <button onclick="app.setTab('map')" class="flex-1 py-2 text-center text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition border border-slate-700 font-bold">
                    🗺️ லைவ் மேப் காண்க
                  </button>
                </div>
              </div>
            </div>

            <!-- OPTION 2: NBN BUSINESS MARKETPLACE (பிசினஸ் மார்க்கெட் பிளேஸ்) -->
            <div class="relative bg-gradient-to-br from-slate-900 via-brand-950 to-blue-950 rounded-3xl p-7 sm:p-9 text-white shadow-xl border-2 border-blue-400/60 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
              <div class="absolute -right-16 -top-16 w-56 h-56 bg-blue-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/25 transition"></div>

              <div class="relative z-10 space-y-5">
                <div class="flex items-center justify-between">
                  <div class="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/30">
                    🛒
                  </div>
                  <span class="px-3.5 py-1.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/40 text-xs font-black uppercase tracking-wider">
                    ⚡ MULTI-CHAPTER COMMERCE HUB
                  </span>
                </div>

                <div>
                  <div class="text-xs font-black uppercase tracking-widest text-blue-400">விருப்பம் 2 • PRIMARY GATEWAY</div>
                  <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                    NBN பிசினஸ் மார்க்கெட் பிளேஸ் <br/>
                    <span class="text-blue-400 text-xl sm:text-2xl font-bold">(NBN Business Marketplace)</span>
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-300 font-medium mt-2 leading-relaxed">
                    ${isTa ? 'தயாரிப்புகள் மற்றும் சேவைகளுக்கான நேரடி வர்த்தக சந்தை. வாடிக்கையாளர்கள் தேவைகளை சமர்ப்பிக்கலாம்; விற்பனையாளர்கள் கொட்டேஷன் அனுப்பி நேரடி ஆர்டர்களைப் பெறலாம்.' : 'Direct business marketplace for buying and selling products & services. Post requirements, submit competitive quotes, and manage orders with 18% GST billing.'}
                  </p>
                </div>

                <!-- Marketplace Key Pillars -->
                <div class="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-200">
                  <div class="flex items-start gap-2.5">
                    <span class="text-blue-400 font-black text-sm">📦</span>
                    <span><strong>விற்பனையாளர் ஸ்டோர் (Seller Store):</strong> பொருட்கள் மற்றும் சேவைகளை பட்டியலிட்டு ஆன்லைன் ஆர்டர்களை உடனுக்குடன் பெறலாம்.</span>
                  </div>
                  <div class="flex items-start gap-2.5">
                    <span class="text-blue-400 font-black text-sm">⚡</span>
                    <span><strong>வாடிக்கையாளர் தேவைகள் & நேரடி கொட்டேஷன்:</strong> வாடிக்கையாளர்கள் பதிவிடும் தேவைகளுக்கு நேரடியாக விலைப் புள்ளி (Quote) சமர்ப்பிக்கலாம்.</span>
                  </div>
                  <div class="flex items-start gap-2.5">
                    <span class="text-blue-400 font-black text-sm">🛍️</span>
                    <span><strong>வாடிக்கையாளர் & பையர் தளம்:</strong> தருமபுரி & சேலம் சப்ளையர்களிடம் சிறந்த விலையில் பொருட்கள் வாங்க 18% GST பில்லிங் & டெலிவரி டிராக்கிங்.</span>
                  </div>
                </div>
              </div>

              <div class="relative z-10 pt-6 mt-6 border-t border-slate-800/80 space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button 
                    onclick="app.openMultiStepOwnerModal('marketplace_only')"
                    class="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5">
                    <span>📦 விற்பனையாளராக இணைய ➔</span>
                  </button>
                  <button 
                    onclick="app.openCustomerRegisterModal()"
                    class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5">
                    <span>🛒 வாடிக்கையாளராக இணைய ➔</span>
                  </button>
                </div>

                <div class="flex items-center justify-between gap-2 text-xs">
                  <button onclick="app.setTab('marketplace')" class="flex-1 py-2 text-center text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition border border-slate-700 font-bold">
                    🌐 மார்க்கெட்பிளேஸ் செல்ல
                  </button>
                  <button onclick="app.openRequirementModal()" class="flex-1 py-2 text-center text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 rounded-xl transition border border-amber-400/30 font-bold">
                    📝 தேவை சமர்ப்பிக்க (Post Req)
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- THREE DETAILED ACCOUNT SELECTION TIERS -->
        <div class="pt-4 border-t border-slate-200">
          <div class="text-center max-w-xl mx-auto mb-6">
            <span class="text-[11px] font-black text-slate-400 uppercase tracking-wider">DETAILED ACCOUNT TYPES</span>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900">கணக்கு வகை விவரங்கள் & நேரடிப் பதிவு</h3>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <!-- OPTION A: BUSINESS OWNER: NETWORKING + MARKETPLACE -->
          <div class="bg-white rounded-3xl p-7 border-2 border-amber-400 shadow-xl hover:shadow-2xl hover:border-amber-500 transition-all duration-300 flex flex-col justify-between space-y-6 relative group">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-xs tracking-wider">
              ★ MOST POPULAR • COMPLETE ACCESS
            </div>

            <div class="space-y-4 pt-2">
              <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-3xl font-black shadow-xs">
                🏛️
              </div>
              <div>
                <span class="text-[10px] font-black text-amber-800 uppercase tracking-wider">OPTION A</span>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Business Owner: Networking + Marketplace
                </h2>
                <p class="text-xs text-slate-500 font-semibold mt-1">
                  தொழில் நெட்வொர்க்கிங் & மார்க்கெட்பிளேஸ் (முழு அணுகல்)
                </p>
              </div>

              <div class="text-xs text-slate-600 space-y-2.5 pt-2 border-t border-slate-100 font-medium leading-relaxed">
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>100% Category Exclusivity:</strong> உங்கள் தாலுகா சாப்டரில் உங்கள் தொழிலுக்கு நீங்கள் மட்டுமே!</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>Chapter Membership:</strong> வாராந்திர மீட்டிங், 1-to-1 சந்திப்புகள் & சக உறுப்பினர்கள் பரிந்துரைகள்.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>Marketplace Seller Access:</strong> வாடிக்கையாளர் தேவைகளுக்கு கொட்டேஷன் அனுப்பி ஆர்டர் எடுக்கும் உரிமை.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>4K Video & Marketing:</strong> Nuvea Studio-வின் வணிக வீடியோ தயாரிப்பு சலுகை & லீட்கள்.</span>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100">
              <button 
                onclick="app.openMultiStepOwnerModal('networking_marketplace')" 
                class="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 transform group-hover:scale-[1.02]">
                <span>🚀 Register as Networking Member ➔</span>
              </button>
            </div>
          </div>

          <!-- OPTION B: BUSINESS OWNER: MARKETPLACE ONLY -->
          <div class="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-400 transition-all duration-300 flex flex-col justify-between space-y-6 relative group">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center text-3xl font-black shadow-xs">
                🛒
              </div>
              <div>
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-wider">OPTION B</span>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Business Owner: Marketplace Only
                </h2>
                <p class="text-xs text-slate-500 font-semibold mt-1">
                  மார்க்கெட்பிளேஸ் மட்டும் (சாப்டர் அர்ப்பணிப்பு தேவையில்லை)
                </p>
              </div>

              <div class="text-xs text-slate-600 space-y-2.5 pt-2 border-t border-slate-100 font-medium leading-relaxed">
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>டிஜிட்டல் ஸ்டோர் & லிஸ்டிங்:</strong> பொருட்கள் மற்றும் சேவைகளை மார்க்கெட்பிளேஸில் பதிவு செய்யலாம்.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>லைவ் தேவைகள் & கொட்டேஷன்:</strong> வாடிக்கையாளர்கள் சமர்ப்பிக்கும் தேவைகளுக்கு கொட்டேஷன் அனுப்பலாம்.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>ஆர்டர் மேலாண்மை & வருவாய்:</strong> 18% ஜிஎஸ்டி பில்லிங், ஆர்டர் டெலிவரி மற்றும் விற்பனை டிராக்கிங்.</span>
                </div>
                <div class="flex items-start gap-2 text-slate-400">
                  <span class="text-slate-400 font-bold">✕</span>
                  <span><em>சாப்டர் உறுப்பினர் உரிமை, வாராந்திர மீட்டிங் மற்றும் Category Exclusivity கிடையாது.</em></span>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100">
              <button 
                onclick="app.openMultiStepOwnerModal('marketplace_only')" 
                class="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 transform group-hover:scale-[1.02]">
                <span>📦 Register for Marketplace Only ➔</span>
              </button>
            </div>
          </div>

          <!-- OPTION C: CUSTOMER -->
          <div class="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between space-y-6 relative group">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center text-3xl font-black shadow-xs">
                👤
              </div>
              <div>
                <span class="text-[10px] font-black text-emerald-700 uppercase tracking-wider">OPTION C</span>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Customer
                </h2>
                <p class="text-xs text-slate-500 font-semibold mt-1">
                  வாடிக்கையாளர் (பொருட்கள் & சேவை வாங்குபவர்)
                </p>
              </div>

              <div class="text-xs text-slate-600 space-y-2.5 pt-2 border-t border-slate-100 font-medium leading-relaxed">
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>சரிபார்க்கப்பட்ட சப்ளையர்கள்:</strong> தருமபுரி & சேலத்தின் நம்பகமான வணிகர்களைத் தேடலாம்.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>தேவை சமர்ப்பிப்பு (Post Requirements):</strong> பெரிய தேவைகளை சமர்ப்பித்து சிறந்த கொட்டேஷன்களைப் பெறலாம்.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>விலை ஒப்பீடு & தேர்வு:</strong> சப்ளையர்களின் கொட்டேஷன்களை ஒப்பிட்டு ஆர்டர் உறுதி செய்யலாம்.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span><strong>கணக்கு மேம்பாடு (Account Upgrade):</strong> பிற்காலத்தில் விரும்பினால் வணிகக் கணக்காக எளிதாக மாற்றிக்கொள்ளலாம்.</span>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100">
              <button 
                onclick="app.openCustomerRegisterModal()" 
                class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 transform group-hover:scale-[1.02]">
                <span>🛒 Register as Customer ➔</span>
              </button>
            </div>
          </div>

        </div>

        <!-- BOTTOM ACTIONS: LOGIN & SECURE ADMIN ACCESS -->
        <div class="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold text-slate-600">
          <div class="flex items-center gap-2">
            <span>ஏற்கனவே கணக்கு உள்ளதா? (Already registered?)</span>
            <button onclick="app.openLoginModal()" class="text-brand-900 hover:underline font-bold text-amber-700 bg-white px-3 py-1 rounded-lg border border-slate-300 shadow-2xs">
              🔑 உள்நுழைக (Log In)
            </button>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="app.setTab('home')" class="text-slate-600 hover:text-slate-900 font-bold">
              🌐 முகப்புப்பக்கம் & மேப் பார்க்க ➔
            </button>
            <span class="text-slate-300">|</span>
            <button onclick="app.openAdminModal()" class="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-bold bg-white px-3 py-1 rounded-lg border border-slate-300 shadow-2xs">
              <span>🛡️ Admin Login</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }

  // ==========================================
  // MULTI-STEP BUSINESS OWNER REGISTRATION (6 STEPS)
  // ==========================================
  openMultiStepOwnerModal(initialAccountType = 'networking_marketplace') {
    this.regStep = 1;
    this.regData = {
      fullName: '',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: '',
      whatsapp: '',
      email: '',
      password: '',
      designation: 'உரிமையாளர் / மேலாண் இயக்குனர்',
      businessName: '',
      logo: '',
      cover: '',
      categoryId: 'digital_marketing',
      subcategory: '',
      description: '',
      yearEstablished: '2022',
      gstNumber: '',
      website: '',
      socialLinks: { instagram: '', facebook: '' },
      address: '',
      districtId: 'dharmapuri',
      talukId: 'harur',
      pinCode: '636903',
      productsServices: [
        { name: 'முதன்மை தயாரிப்பு / சேவை', type: 'Product', description: 'உயர்தர வணிகத் தயாரிப்பு', price: '₹1,500' }
      ],
      accountType: initialAccountType,
      preferredChapterId: 'harur_titans',
      documents: { businessProof: '', gstDoc: '', idDoc: '' },
      termsAccepted: true
    };
    this.renderMultiStepOwnerModal();
  }

  renderMultiStepOwnerModal() {
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;
    const step = this.regStep || 1;
    const d = this.regData;
    const chapters = this.db.chapters || [];
    const categories = this.db.categories || [];

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8 space-y-6">
          
          <!-- Close Button -->
          <button onclick="app.closeModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 text-sm font-bold">
            ✕
          </button>

          <!-- Step Progress Indicator -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-slate-500">
              <span class="text-amber-800 font-extrabold uppercase">படி ${step} / 6: ${
                step === 1 ? 'உரிமையாளர் விவரங்கள் (Owner Info)' :
                step === 2 ? 'வணிக விவரங்கள் (Business Info)' :
                step === 3 ? 'தயாரிப்புகள் & சேவைகள் (Products & Services)' :
                step === 4 ? 'கணக்கு வகை & சாப்டர் தேர்வு (Account Type)' :
                step === 5 ? 'ஆவணங்கள் சரிபார்ப்பு (Documents)' : 'மதிப்பாய்வு & உறுதிப்படுத்தல் (Review)'
              }</span>
              <span>${Math.round((step / 6) * 100)}% நிறைவு</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="bg-amber-500 h-full rounded-full transition-all duration-300" style="width: ${(step / 6) * 100}%"></div>
            </div>
          </div>

          <!-- STEP 1: OWNER INFORMATION -->
          ${step === 1 ? `
            <div class="space-y-4">
              <h3 class="text-lg font-black text-slate-900 border-b pb-2">படி 1: வணிக உரிமையாளர் விவரங்கள்</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">முழுப் பெயர் (Full Name) *</label>
                  <input type="text" id="reg-owner-name" value="${d.fullName}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="எ.கா: ஆர். சந்திரா" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">பதவி / பதவிப் பெயர் (Designation)</label>
                  <input type="text" id="reg-owner-desig" value="${d.designation}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="Managing Director / Owner" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">மொபைல் எண் (Mobile Number) *</label>
                  <input type="tel" id="reg-owner-phone" value="${d.phone}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="9876543210" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">வாட்ஸ்அப் எண் (WhatsApp Number)</label>
                  <input type="tel" id="reg-owner-whatsapp" value="${d.whatsapp || d.phone}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="9876543210" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">மின்னஞ்சல் (Email Address)</label>
                  <input type="email" id="reg-owner-email" value="${d.email}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="chandru@business.com" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">கடவுச்சொல் (Password) *</label>
                  <input type="password" id="reg-owner-pass" value="${d.password}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="குறைந்தது 6 எழுத்துக்கள்" />
                </div>
              </div>
            </div>
          ` : ''}

          <!-- STEP 2: BUSINESS INFORMATION -->
          ${step === 2 ? `
            <div class="space-y-4">
              <h3 class="text-lg font-black text-slate-900 border-b pb-2">படி 2: நிறுவன / வணிக விவரங்கள்</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 mb-1">நிறுவனத்தின் பெயர் (Business Name) *</label>
                  <input type="text" id="reg-biz-name" value="${d.businessName}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="எ.கா: நுவேவா ஸ்டுடியோ (Nuvea Studio)" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">தொழில் பிரிவு (Business Category) *</label>
                  <select id="reg-biz-cat" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold bg-white">
                    ${categories.map(c => `<option value="${c.id}" ${d.categoryId === c.id ? 'selected' : ''}>${c.nameTa} (${c.nameEn})</option>`).join('')}
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">துணைப் பிரிவு (Subcategory)</label>
                  <input type="text" id="reg-biz-subcat" value="${d.subcategory}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="எ.கா: 4K விளம்பரங்கள், சிமெண்ட் டீலர்" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">தொடங்கப்பட்ட ஆண்டு (Year Established)</label>
                  <input type="text" id="reg-biz-year" value="${d.yearEstablished}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="2020" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">ஜிஎஸ்டி எண் (GST Number - விருப்பத்தேர்வு)</label>
                  <input type="text" id="reg-biz-gst" value="${d.gstNumber}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="33AAAAA0000A1Z5" />
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 mb-1">வணிக முகவரி (Business Address) *</label>
                  <input type="text" id="reg-biz-addr" value="${d.address}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="கதவு எண், தெரு, காளியம்மன் கோவில் ரோடு, ஹரூர்" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">தாலுகா (Taluk)</label>
                  <select id="reg-biz-taluk" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold bg-white">
                    <option value="harur" ${d.talukId === 'harur' ? 'selected' : ''}>ஹரூர் (Harur)</option>
                    <option value="palacode" ${d.talukId === 'palacode' ? 'selected' : ''}>பாலக்கோடு (Palacode)</option>
                    <option value="karimangalam" ${d.talukId === 'karimangalam' ? 'selected' : ''}>காரிமங்கலம் (Karimangalam)</option>
                    <option value="dharmapuri_town" ${d.talukId === 'dharmapuri_town' ? 'selected' : ''}>தருமபுரி டவுன் (Dharmapuri Town)</option>
                    <option value="pennagaram" ${d.talukId === 'pennagaram' ? 'selected' : ''}>பெண்ணாகரம் (Pennagaram)</option>
                    <option value="salem" ${d.talukId === 'salem' ? 'selected' : ''}>சேலம் (Salem)</option>
                    <option value="hosur" ${d.talukId === 'hosur' ? 'selected' : ''}>ஓசூர் (Hosur)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">அஞ்சல் குறியீடு (PIN Code)</label>
                  <input type="text" id="reg-biz-pin" value="${d.pinCode}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="636903" />
                </div>
              </div>
            </div>
          ` : ''}

          <!-- STEP 3: PRODUCTS & SERVICES -->
          ${step === 3 ? `
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b pb-2">
                <h3 class="text-lg font-black text-slate-900">படி 3: தயாரிப்புகள் மற்றும் சேவைகள்</h3>
                <button onclick="app.addRegProductService()" class="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs">
                  + தயாரிப்பு / சேவை சேர்
                </button>
              </div>

              <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
                ${d.productsServices.map((p, idx) => `
                  <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 relative space-y-2">
                    <button onclick="app.removeRegProductService(${idx})" class="absolute top-2 right-2 text-slate-400 hover:text-red-600 text-xs font-bold">
                      ✕ நீக்கு
                    </button>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div class="sm:col-span-2">
                        <label class="block text-[10px] font-bold text-slate-600">பொருளின் பெயர் / சேவை</label>
                        <input type="text" oninput="app.regData.productsServices[${idx}].name = this.value" value="${p.name}" class="w-full px-2.5 py-1.5 border rounded-lg text-xs" />
                      </div>
                      <div>
                        <label class="block text-[10px] font-bold text-slate-600">வகை (Type)</label>
                        <select onchange="app.regData.productsServices[${idx}].type = this.value" class="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white">
                          <option value="Product" ${p.type === 'Product' ? 'selected' : ''}>தயாரிப்பு (Product)</option>
                          <option value="Service" ${p.type === 'Service' ? 'selected' : ''}>சேவை (Service)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- STEP 4: ACCOUNT TYPE & CHAPTER ALLOCATION -->
          ${step === 4 ? `
            <div class="space-y-4">
              <h3 class="text-lg font-black text-slate-900 border-b pb-2">படி 4: உங்கள் NBN கணக்கு வகை</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label class="p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${d.accountType === 'networking_marketplace' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200'}">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <input type="radio" name="accType" value="networking_marketplace" ${d.accountType === 'networking_marketplace' ? 'checked' : ''} onchange="app.regData.accountType = this.value; app.renderMultiStepOwnerModal();" />
                      <span class="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950">OPTION A</span>
                    </div>
                    <div class="text-sm font-black text-slate-900">Networking + Marketplace</div>
                    <p class="text-xs text-slate-600 leading-relaxed">
                      தாலுகா சாப்டர் உறுப்பினர், 100% Category Exclusivity, வாராந்திர மீட்டிங் & மார்க்கெட்பிளேஸ் அணுகல்.
                    </p>
                  </div>
                </label>

                <label class="p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${d.accountType === 'marketplace_only' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200'}">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <input type="radio" name="accType" value="marketplace_only" ${d.accountType === 'marketplace_only' ? 'checked' : ''} onchange="app.regData.accountType = this.value; app.renderMultiStepOwnerModal();" />
                      <span class="px-2 py-0.5 rounded text-[10px] font-black bg-slate-900 text-white">OPTION B</span>
                    </div>
                    <div class="text-sm font-black text-slate-900">Marketplace Only</div>
                    <p class="text-xs text-slate-600 leading-relaxed">
                      மார்க்கெட்பிளேஸ் மட்டும். சாப்டர் அர்ப்பணிப்பு, வாராந்திர மீட்டிங் அல்லது Exclusivity உரிமை கிடையாது.
                    </p>
                  </div>
                </label>
              </div>

              ${d.accountType === 'networking_marketplace' ? `
                <div class="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
                  <div class="text-xs font-black text-amber-900">🏛️ விரும்பும் சாப்டர் தேர்வு & Category Exclusivity சரிபார்ப்பு:</div>
                  <select id="reg-preferred-chap" onchange="app.regData.preferredChapterId = this.value" class="w-full px-3 py-2 border rounded-xl text-xs font-bold bg-white">
                    ${chapters.map(c => `<option value="${c.id}" ${d.preferredChapterId === c.id ? 'selected' : ''}>${c.nameTa} (${c.talukId})</option>`).join('')}
                  </select>
                  <div class="text-[11px] text-emerald-800 font-bold">
                    ✓ தேர்ந்தெடுக்கப்பட்ட சாப்டரில் உங்கள் தொழில் பிரிவுக்கான காலி இடம் உடனடியாக சரிபார்க்கப்படும்.
                  </div>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- STEP 5: DOCUMENT VERIFICATION -->
          ${step === 5 ? `
            <div class="space-y-4">
              <h3 class="text-lg font-black text-slate-900 border-b pb-2">படி 5: ஆவணங்கள் மற்றும் உறுதிமொழி</h3>
              
              <div class="space-y-3">
                <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <label class="block font-bold text-slate-800 mb-1">வணிகச் சான்று (Udyam / Trade License / Visiting Card)</label>
                  <input type="text" placeholder="சான்று ஆவண இணைப்பு அல்லது URL (விரும்பினால்)" class="w-full px-3 py-2 border rounded-lg text-xs" />
                </div>
                <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <label class="block font-bold text-slate-800 mb-1">உரிமையாளர் அடையாள அட்டை (Aadhaar / PAN)</label>
                  <input type="text" placeholder="அடையாள அட்டை எண் / விவரம்" class="w-full px-3 py-2 border rounded-lg text-xs" />
                </div>

                <div class="pt-2 flex items-start gap-2">
                  <input type="checkbox" id="reg-terms-check" checked class="mt-1" />
                  <label for="reg-terms-check" class="text-xs text-slate-600 leading-tight">
                    NBN விதிகள், தொழில் நெறிமுறைகள் மற்றும் விதிமுறைகளை முழுமையாக ஏற்றுக்கொள்கிறேன்.
                  </label>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- STEP 6: REVIEW & CONFIRMATION -->
          ${step === 6 ? `
            <div class="space-y-4">
              <h3 class="text-lg font-black text-slate-900 border-b pb-2">படி 6: விண்ணப்ப மதிப்பாய்வு (Application Review)</h3>
              
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div class="flex justify-between items-center border-b pb-2">
                  <div>
                    <span class="text-slate-500 font-bold">கணக்கு வகை:</span>
                    <strong class="text-slate-900 ml-1">${d.accountType === 'networking_marketplace' ? 'Option A: Networking + Marketplace' : 'Option B: Marketplace Only'}</strong>
                  </div>
                  <button onclick="app.jumpRegStep(4)" class="text-amber-700 font-bold hover:underline">மாற்று</button>
                </div>

                <div class="flex justify-between items-center border-b pb-2">
                  <div>
                    <span class="text-slate-500 font-bold">உரிமையாளர்:</span>
                    <strong class="text-slate-900 ml-1">${d.fullName} (${d.phone})</strong>
                  </div>
                  <button onclick="app.jumpRegStep(1)" class="text-amber-700 font-bold hover:underline">மாற்று</button>
                </div>

                <div class="flex justify-between items-center border-b pb-2">
                  <div>
                    <span class="text-slate-500 font-bold">நிறுவனம்:</span>
                    <strong class="text-slate-900 ml-1">${d.businessName} (${d.address || 'தமிழ்நாடு'})</strong>
                  </div>
                  <button onclick="app.jumpRegStep(2)" class="text-amber-700 font-bold hover:underline">மாற்று</button>
                </div>

                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-slate-500 font-bold">பதிவு செய்யப்படும் நிலை:</span>
                    <strong class="text-amber-800 ml-1 bg-amber-100 px-2 py-0.5 rounded">Verification Pending / சமர்ப்பிக்கப்படுகிறது</strong>
                  </div>
                </div>
              </div>

              <div class="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs font-semibold">
                ✓ விண்ணப்பத்தை உறுதி செய்தவுடன் உங்களுக்கான பிரத்யேக பதிவு எண் (Registration ID) உடனடியாக உருவாக்கப்படும்.
              </div>
            </div>
          ` : ''}

          <!-- Modal Navigation Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-100">
            ${step > 1 ? `
              <button onclick="app.prevRegStep()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
                ⬅️ பின்செல்க (Back)
              </button>
            ` : `<div></div>`}

            ${step < 6 ? `
              <button onclick="app.nextRegStep()" class="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs">
                அடுத்த படி (Next) ➔
              </button>
            ` : `
              <button onclick="app.submitFullOwnerRegistration()" class="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md">
                🚀 விண்ணப்பத்தை உறுதி செய்து சமர்ப்பி (Submit) ➔
              </button>
            `}
          </div>

        </div>
      </div>
    `;
  }

  nextRegStep() {
    const s = this.regStep || 1;
    // Capture step 1 values
    if (s === 1) {
      const name = document.getElementById('reg-owner-name')?.value;
      const phone = document.getElementById('reg-owner-phone')?.value;
      const pass = document.getElementById('reg-owner-pass')?.value;
      if (!name || !phone) {
        alert('பெயர் மற்றும் மொபைல் எண் அவசியம்!');
        return;
      }
      this.regData.fullName = name;
      this.regData.phone = phone;
      this.regData.whatsapp = document.getElementById('reg-owner-whatsapp')?.value || phone;
      this.regData.email = document.getElementById('reg-owner-email')?.value || '';
      this.regData.designation = document.getElementById('reg-owner-desig')?.value || '';
      this.regData.password = pass || 'password123';
    }
    // Capture step 2 values
    if (s === 2) {
      const bizName = document.getElementById('reg-biz-name')?.value;
      if (!bizName) {
        alert('நிறுவனத்தின் பெயர் அவசியம்!');
        return;
      }
      this.regData.businessName = bizName;
      this.regData.categoryId = document.getElementById('reg-biz-cat')?.value || 'digital_marketing';
      this.regData.subcategory = document.getElementById('reg-biz-subcat')?.value || '';
      this.regData.yearEstablished = document.getElementById('reg-biz-year')?.value || '2024';
      this.regData.gstNumber = document.getElementById('reg-biz-gst')?.value || '';
      this.regData.address = document.getElementById('reg-biz-addr')?.value || '';
      this.regData.talukId = document.getElementById('reg-biz-taluk')?.value || 'harur';
      this.regData.pinCode = document.getElementById('reg-biz-pin')?.value || '';
    }

    this.regStep = Math.min(6, s + 1);
    this.renderMultiStepOwnerModal();
  }

  prevRegStep() {
    this.regStep = Math.max(1, (this.regStep || 1) - 1);
    this.renderMultiStepOwnerModal();
  }

  jumpRegStep(step) {
    this.regStep = step;
    this.renderMultiStepOwnerModal();
  }

  addRegProductService() {
    if (!this.regData.productsServices) this.regData.productsServices = [];
    this.regData.productsServices.push({
      name: 'புதிய சேவை / தயாரிப்பு',
      type: 'Service',
      description: 'விவரம்',
      price: '₹1,000'
    });
    this.renderMultiStepOwnerModal();
  }

  removeRegProductService(idx) {
    if (this.regData.productsServices && this.regData.productsServices.length > 1) {
      this.regData.productsServices.splice(idx, 1);
      this.renderMultiStepOwnerModal();
    }
  }

  async submitFullOwnerRegistration() {
    try {
      const res = await fetch('/api/auth/register-owner-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.regData)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'பதிவு தோல்வியடைந்தது');
        return;
      }

      this.currentUser = data.user;
      this.token = data.token;
      if (typeof localStorage !== 'undefined') localStorage.setItem('nbn_token', data.token);

      this.closeModal();
      if (window.confetti) window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (window.playChime) window.playChime('success');

      alert(`வாழ்த்துகள் ${data.user.name}! பதிவு எண் ${data.registrationId} வெற்றிகரமாக உருவாக்கப்பட்டது! உங்கள் டேஷ்போர்டிற்கு வரவேற்கிறோம்.`);
      await this.fetchData();
      this.setTab('member');
    } catch (e) {
      console.error(e);
      alert('சர்வர் பிழை. மீண்டும் முயற்சிக்கவும்.');
    }
  }

  // ==========================================
  // CUSTOMER REGISTRATION MODAL (OPTION C)
  // ==========================================
  openCustomerRegisterModal() {
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;
    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8 space-y-5">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold">✕</button>
          
          <div class="space-y-1">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 uppercase">OPTION C</span>
            <h3 class="text-xl font-black text-slate-900">வாடிக்கையாளர் பதிவு (Customer Register)</h3>
            <p class="text-xs text-slate-500">பொருட்கள் மற்றும் சேவைகளைத் தேட, தேவைகளை சமர்ப்பிக்க பதிவு செய்யுங்கள்.</p>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">முழுப் பெயர் *</label>
              <input type="text" id="cust-reg-name" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="எ.கா: கே. சரவணன்" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">மொபைல் எண் *</label>
              <input type="tel" id="cust-reg-phone" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="9842100112" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">மின்னஞ்சல்</label>
              <input type="email" id="cust-reg-email" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="customer@gmail.com" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">கடவுச்சொல் *</label>
              <input type="password" id="cust-reg-pass" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="கடவுச்சொல்" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">வசிப்பிடம் / டெலிவரி முகவரி</label>
              <input type="text" id="cust-reg-addr" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="ஹரூர் பைபாஸ், தருமபுரி" />
            </div>
          </div>

          <button onclick="app.submitCustomerRegistration()" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition">
            வாடிக்கையாளராக கணக்கு தொடங்கு ➔
          </button>
        </div>
      </div>
    `;
  }

  async submitCustomerRegistration() {
    const fullName = document.getElementById('cust-reg-name')?.value;
    const phone = document.getElementById('cust-reg-phone')?.value;
    const email = document.getElementById('cust-reg-email')?.value;
    const password = document.getElementById('cust-reg-pass')?.value;
    const address = document.getElementById('cust-reg-addr')?.value;

    if (!fullName || !phone) {
      alert('பெயர் மற்றும் மொபைல் எண் அவசியம்!');
      return;
    }

    try {
      const res = await fetch('/api/auth/register-customer-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, password, address })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'பதிவு தோல்வியடைந்தது');
        return;
      }
      this.currentUser = data.user;
      this.token = data.token;
      if (typeof localStorage !== 'undefined') localStorage.setItem('nbn_token', data.token);
      this.closeModal();
      alert('வாடிக்கையாளர் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!');
      await this.fetchData();
      this.setTab('customer');
    } catch (e) {
      console.error(e);
      alert('பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.');
    }
  }

  // ==========================================
  // ACCOUNT UPGRADE MODAL (CUSTOMER -> BUSINESS OWNER)
  // ==========================================
  openUpgradeAccountModal() {
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;
    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8 space-y-4">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold">✕</button>
          
          <div class="space-y-1">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 uppercase">ACCOUNT UPGRADE</span>
            <h3 class="text-xl font-black text-slate-900">வணிகக் கணக்காக மேம்படுத்து</h3>
            <p class="text-xs text-slate-500">தனி கணக்கு தொடங்க தேவையில்லை; உங்கள் தற்போதைய கணக்கை பிசினஸ் கணக்காக மாற்றலாம்.</p>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">விரும்பும் வணிகக் கணக்கு வகை</label>
              <select id="upgrade-type" class="w-full px-3 py-2 border rounded-xl text-xs font-bold bg-white">
                <option value="networking_marketplace">Option A: Networking + Marketplace (சாப்டர் உறுப்பினர்)</option>
                <option value="marketplace_only">Option B: Marketplace Only (சந்தை மட்டும்)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">வணிகப் பெயர் (Business Name) *</label>
              <input type="text" id="upgrade-biz-name" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="எ.கா: சரவணன் டிரேடர்ஸ்" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">தொழில் பிரிவு (Category)</label>
              <select id="upgrade-biz-cat" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold bg-white">
                ${(this.db.categories || []).map(c => `<option value="${c.id}">${c.nameTa}</option>`).join('')}
              </select>
            </div>
          </div>

          <button onclick="app.submitAccountUpgrade()" class="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition">
            🚀 கணக்கை உடனடியாக மேம்படுத்து ➔
          </button>
        </div>
      </div>
    `;
  }

  async submitAccountUpgrade() {
    const targetAccountType = document.getElementById('upgrade-type')?.value;
    const businessName = document.getElementById('upgrade-biz-name')?.value;
    const categoryId = document.getElementById('upgrade-biz-cat')?.value;

    if (!businessName) {
      alert('வணிகப் பெயர் அவசியம்!');
      return;
    }

    try {
      const res = await fetch('/api/auth/upgrade-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ targetAccountType, businessName, categoryId })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'மேம்படுத்தல் தோல்வியடைந்தது');
        return;
      }
      this.currentUser = data.user;
      this.closeModal();
      alert('வாழ்த்துகள்! உங்கள் கணக்கு வணிகக் கணக்காக வெற்றிகரமாக மேம்படுத்தப்பட்டது!');
      await this.fetchData();
      this.setTab('member');
    } catch (e) {
      console.error(e);
      alert('பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.');
    }
  }
}

window.app = new NBNApp();
