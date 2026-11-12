/**
 * NBN ADMIN PORTAL APPLICATION
 * Central Enterprise Governance Console for Nuvea Business Network
 */
class NBNAdminApp {
  constructor() {
    this.currentTab = 'overview';
    this.lang = 'ta';
    this.db = null;
    this.userFilter = 'all'; // 'all' | 'networking_marketplace' | 'marketplace_only' | 'customer' | 'admin'
    this.searchTerm = '';
    this.init();
  }

  async init() {
    await this.fetchData();
    this.render();
  }

  async fetchData() {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        this.db = await res.json();
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    }
  }

  setTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('active-tab'));
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

  render() {
    const container = document.getElementById('admin-content');
    if (!container || !this.db) return;

    switch (this.currentTab) {
      case 'overview':
        container.innerHTML = this.renderOverview();
        break;
      case 'users':
        container.innerHTML = this.renderUsers();
        break;
      case 'chapters':
        container.innerHTML = this.renderChapters();
        break;
      case 'marketplace':
        container.innerHTML = this.renderMarketplace();
        break;
      case 'discipline':
        container.innerHTML = this.renderDiscipline();
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
    const members = this.db.members || [];
    const chapters = this.db.chapters || [];
    const users = this.db.users || [];
    const requirements = this.db.marketplaceRequirements || [];
    const orders = this.db.marketplaceOrders || [];

    const totalGmv = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalTax = orders.reduce((sum, o) => sum + (o.taxAmount || 0), 0);

    const isTa = this.lang === 'ta';

    return `
      <!-- TOP OVERVIEW HERO -->
      <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase mb-2 border border-amber-400/30">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>மத்திய நிர்வாக கன்சோல் (Master Governance)</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
              NBN மண்டல தலைமை நிர்வாகக் கட்டுப்பாட்டகம்
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              தருமபுரி & சேலம் மண்டலத்தின் 11 சாப்டர்கள், 100 தொழில் பிரிவுகள் மற்றும் சந்தை மேலாண்மை
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="adminApp.exportData()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-2 shadow-xs">
              <span>📥 Export State JSON</span>
            </button>
            <button onclick="adminApp.openAddChapterModal()" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5">
              <span>+ புதிய சாப்டர் துவங்கு</span>
            </button>
          </div>
        </div>
      </div>

      <!-- MASTER METRICS CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-black text-slate-400 uppercase tracking-wider">மொத்த உறுப்பினர்கள்</div>
            <div class="text-3xl font-black text-slate-900 mt-1">${members.length}</div>
            <div class="text-xs text-emerald-600 font-bold mt-1">✓ 100% சரிபார்க்கப்பட்டவர்கள்</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
            🏛️
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-black text-slate-400 uppercase tracking-wider">செயலில் உள்ள சாப்டர்கள்</div>
            <div class="text-3xl font-black text-slate-900 mt-1">${chapters.length}</div>
            <div class="text-xs text-brand-600 font-bold mt-1">தருமபுரி & சேலம் மண்டலம்</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
            🗺️
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-black text-slate-400 uppercase tracking-wider">மார்க்கெட்பிளேஸ் தேவைகள்</div>
            <div class="text-3xl font-black text-slate-900 mt-1">${requirements.length}</div>
            <div class="text-xs text-amber-600 font-bold mt-1">${orders.length} ஆர்டர்கள் முடிவடைந்துள்ளன</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">
            🛒
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-black text-slate-400 uppercase tracking-wider">மொத்த வணிகம் (GMV)</div>
            <div class="text-3xl font-black text-emerald-600 mt-1">₹${totalGmv.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-500 font-bold mt-1">₹${totalTax.toLocaleString('en-IN')} (18% GST வரி)</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            💰
          </div>
        </div>

      </div>

      <!-- CHAPTER OCCUPANCY QUICK GLANCE -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-base font-black text-slate-900">🏛️ சாப்டர்கள் & சீட் காலியிட நிலவரம் (Chapter Occupancy)</h3>
          <button onclick="adminApp.setTab('chapters')" class="text-xs text-brand-600 hover:underline font-bold">அனைத்து சாப்டர்கள் காண்க ➔</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${chapters.slice(0, 6).map(c => {
            const occ = members.filter(m => m.chapterId === c.id).length;
            const pct = Math.min(100, Math.round((occ / 100) * 100));
            return `
              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-slate-900">${c.nameTa || c.name}</span>
                  <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">${c.talukId || 'Regional'}</span>
                </div>
                <div class="flex items-baseline justify-between mt-3 text-xs">
                  <span class="text-slate-500">நிரப்பப்பட்ட சீட்கள்:</span>
                  <span class="font-black text-slate-900">${occ} / 100</span>
                </div>
                <div class="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                  <div class="bg-amber-500 h-full rounded-full" style="width: ${Math.max(5, pct)}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // 2. USER MANAGEMENT
  renderUsers() {
    const isTa = this.lang === 'ta';
    const users = this.db.users || [];
    const members = this.db.members || [];

    // Filter users
    const filteredUsers = users.filter(u => {
      const matchType = this.userFilter === 'all' ? true : (u.accountType === this.userFilter || u.role === this.userFilter);
      const matchSearch = !this.searchTerm || 
        (u.fullName || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (u.phone || '').includes(this.searchTerm) ||
        (u.email || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchType && matchSearch;
    });

    return `
      <div class="space-y-6">
        
        <!-- HEADER & FILTER TOOLBAR -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-black text-slate-900">👥 பயனர் & உறுப்பினர் மேலாண்மை (User Directory)</h2>
            <p class="text-xs text-slate-500 font-medium">அனைத்து 4 கணக்கு வகைகளையும் தேடலாம், அங்கீகரிக்கலாம் மற்றும் நிர்வகிக்கலாம்.</p>
          </div>

          <!-- Quick Filters -->
          <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
            <button onclick="adminApp.setUserFilter('all')" class="px-3 py-1.5 rounded-xl border ${this.userFilter === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}">
              அனைத்தும் (${users.length})
            </button>
            <button onclick="adminApp.setUserFilter('networking_marketplace')" class="px-3 py-1.5 rounded-xl border ${this.userFilter === 'networking_marketplace' ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}">
              🏛️ சாப்டர் நெட்வொர்க் (Option A)
            </button>
            <button onclick="adminApp.setUserFilter('marketplace_only')" class="px-3 py-1.5 rounded-xl border ${this.userFilter === 'marketplace_only' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}">
              🛒 மார்க்கெட்பிளேஸ் மட்டும் (Option B)
            </button>
            <button onclick="adminApp.setUserFilter('customer')" class="px-3 py-1.5 rounded-xl border ${this.userFilter === 'customer' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}">
              👤 வாடிக்கையாளர் (Option C)
            </button>
          </div>
        </div>

        <!-- SEARCH BAR -->
        <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="பெயர், தொலைபேசி அல்லது மின்னஞ்சல் தேடவும்..." 
            value="${this.searchTerm}" 
            oninput="adminApp.searchTerm = this.value; adminApp.render();" 
            class="w-full text-xs sm:text-sm font-medium focus:outline-none py-1 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <!-- USERS TABLE -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th class="px-5 py-3.5">பயனர் பெயர் & எண்</th>
                  <th class="px-5 py-3.5">கணக்கு வகை</th>
                  <th class="px-5 py-3.5">தொடர்பு விவரங்கள்</th>
                  <th class="px-5 py-3.5">பதிவு ID / சாப்டர்</th>
                  <th class="px-5 py-3.5">நிலை (Status)</th>
                  <th class="px-5 py-3.5 text-right">நடவடிக்கைகள்</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filteredUsers.map(u => {
                  const badgeColor = u.accountType === 'networking_marketplace' 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : (u.accountType === 'marketplace_only' ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300');
                  
                  return `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="px-5 py-4">
                        <div class="font-black text-slate-900 text-sm">${u.fullName || 'Unnamed User'}</div>
                        <div class="text-[11px] text-slate-500 font-semibold">${u.id}</div>
                      </td>
                      <td class="px-5 py-4">
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${badgeColor}">
                          ${u.accountType === 'networking_marketplace' ? '🏛️ Networking + Marketplace' : (u.accountType === 'marketplace_only' ? '🛒 Marketplace Only' : (u.role === 'customer' ? '👤 Customer' : '🛡️ Super Admin'))}
                        </span>
                      </td>
                      <td class="px-5 py-4 font-semibold text-slate-700">
                        <div>📞 ${u.phone || '-'}</div>
                        <div class="text-slate-400 text-[11px]">✉️ ${u.email || '-'}</div>
                      </td>
                      <td class="px-5 py-4 text-slate-600 font-medium">
                        <div class="font-bold text-slate-900">${u.registrationNumber || u.chapterId || '-'}</div>
                        <div class="text-[10px] text-slate-400">${u.districtId ? u.districtId.toUpperCase() : 'TAMIL NADU'}</div>
                      </td>
                      <td class="px-5 py-4">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black ${u.status === 'suspended' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
                          <span class="w-1.5 h-1.5 rounded-full ${u.status === 'suspended' ? 'bg-rose-500' : 'bg-emerald-500'}"></span>
                          <span>${(u.status || 'active').toUpperCase()}</span>
                        </span>
                      </td>
                      <td class="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <button onclick="adminApp.viewUserDetails('${u.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition">
                          விவரம்
                        </button>
                        ${u.status === 'suspended' ? `
                          <button onclick="adminApp.reactivateUser('${u.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition">
                            மீளமைக்க
                          </button>
                        ` : `
                          <button onclick="adminApp.suspendUser('${u.id}')" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition border border-rose-200">
                            இடைநிறுத்து
                          </button>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  setUserFilter(filter) {
    this.userFilter = filter;
    this.render();
  }

  // 3. CHAPTERS & MONOPOLY SEATS
  renderChapters() {
    const chapters = this.db.chapters || [];
    const members = this.db.members || [];

    return `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-slate-900">🏛️ சாப்டர்கள் & தொழில் ஏகபோக சீட்கள் (Chapters & Monopoly)</h2>
            <p class="text-xs text-slate-500 font-medium">100 தொழில் பிரிவுகளுக்கான தாலுகா வாரியான சீட்கள் மற்றும் காலியிடங்கள்.</p>
          </div>
          <button onclick="adminApp.openAddChapterModal()" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-xs transition">
            + புதிய சாப்டர் துவங்கு
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${chapters.map(c => {
            const chMembers = members.filter(m => m.chapterId === c.id);
            return `
              <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 hover:border-amber-400 transition">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      ${c.talukId ? c.talukId.toUpperCase() : 'TALUK CHAPTER'}
                    </span>
                    <h3 class="text-lg font-black text-slate-900 mt-1">${c.nameTa || c.name}</h3>
                  </div>
                  <span class="text-xs font-black text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                    ${chMembers.length} / 100
                  </span>
                </div>

                <div class="text-xs text-slate-600 space-y-1.5 font-medium border-t pt-3">
                  <div>📍 அமைவிடம்: <strong>${c.location || 'Dharmapuri District'}</strong></div>
                  <div>⏰ மீட்டிங் நேரம்: <strong>${c.meetingDay || 'புதன்கிழமை காலை 7:00 AM'}</strong></div>
                  <div>👤 சாப்டர் தலைவர்: <strong>${c.directorName || 'கார்த்திக் குமார்'}</strong></div>
                </div>

                <div class="border-t pt-3 flex items-center justify-between text-xs">
                  <span class="text-emerald-600 font-bold">✓ ${100 - chMembers.length} சீட்கள் காலி</span>
                  <button onclick="adminApp.manageChapterMembers('${c.id}')" class="text-brand-600 hover:underline font-bold">
                    உறுப்பினர்கள் பட்டியல் ➔
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // 4. MARKETPLACE OVERVIEW
  renderMarketplace() {
    const requirements = this.db.marketplaceRequirements || [];
    const orders = this.db.marketplaceOrders || [];

    return `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-slate-900">🛒 மார்க்கெட்பிளேஸ் & கொட்டேஷன் கண்காணிப்பு (Marketplace Oversight)</h2>
            <p class="text-xs text-slate-500 font-medium">வாடிக்கையாளர் தேவைகள், சப்ளையர்களின் கொட்டேஷன்கள் மற்றும் ஆர்டர்கள்.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- LIVE REQUIREMENTS -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 class="text-base font-black text-slate-900 border-b pb-3">📝 நேரடி வாடிக்கையாளர் தேவைகள் (${requirements.length})</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
              ${requirements.map(r => `
                <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-black text-slate-900 text-xs">${r.title}</span>
                    <span class="text-[10px] font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">${(r.status || 'open').toUpperCase()}</span>
                  </div>
                  <p class="text-xs text-slate-600">${r.description || ''}</p>
                  <div class="flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t pt-2">
                    <span>பட்ஜெட்: <strong>₹${(r.budget || 0).toLocaleString('en-IN')}</strong></span>
                    <span>கொட்டேஷன்கள்: <strong>${(r.quotes || []).length} பெறப்பட்டது</strong></span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- ORDERS & GST INVOICING -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 class="text-base font-black text-slate-900 border-b pb-3">📦 முடிவடைந்த ஆர்டர்கள் & 18% GST வரிகள் (${orders.length})</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
              ${orders.map(o => `
                <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-black text-slate-900 text-xs">ஆர்டர் #${o.id}</span>
                    <span class="font-black text-emerald-600 text-xs">₹${(o.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div class="text-[11px] text-slate-500 flex justify-between">
                    <span>சப்ளையர்: ${o.sellerName || o.businessId || 'Verified Supplier'}</span>
                    <span>GST (18%): ₹${(o.taxAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div class="flex items-center justify-between text-[10px] pt-1 border-t text-slate-400">
                    <span>தேதி: ${new Date(o.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span class="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">${(o.status || 'confirmed').toUpperCase()}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // 5. DISCIPLINE & MEETINGS
  renderDiscipline() {
    return `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-slate-900">⚖️ உறுப்பினர் ஒழுங்கு & 3-ஸ்ட்ரைக் மேலாண்மை (Discipline & Strikes)</h2>
            <p class="text-xs text-slate-500 font-medium">வாராந்திர கூட்டம் வரவு, பரிந்துரைகள் ஒழுங்கு மற்றும் முறையீடுகள்.</p>
          </div>
          <button onclick="adminApp.openIssueStrikeModal()" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl shadow-xs transition">
            + புதிய ஸ்ட்ரைக் வழங்க
          </button>
        </div>

        <div class="bg-amber-50 rounded-2xl p-5 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <span class="text-2xl">⚠️</span>
          <div>
            <strong>3-ஸ்ட்ரைக் ஒழுங்கு விதி:</strong> தொடர்ச்சியாக 3 வாராந்திர கூட்டங்களுக்கு வராமல் இருந்தாலோ அல்லது போலி பரிந்துரை வழங்கினாலோ உறுப்பினரின் தாலுகா ஏகபோக சீட் காலியாக அறிவிக்கப்பட்டு மற்றொரு விண்ணப்பதாரருக்கு வழங்கப்படும்.
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h3 class="text-base font-black text-slate-900 border-b pb-3">செயலில் உள்ள ஸ்ட்ரைக் பதிவுகள் (Active Warnings)</h3>
          <div class="py-12 text-center text-slate-400 font-bold text-xs">
            தற்போது தீவிர ஒழுங்கு மீறல்கள் ஏதுமில்லை. அனைத்து உறுப்பினர்களும் 100% விதிகளுக்கு உட்பட்டு இயங்குகின்றனர்.
          </div>
        </div>
      </div>
    `;
  }

  // 6. SYSTEM SETTINGS
  renderSettings() {
    return `
      <div class="space-y-6 max-w-3xl">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h2 class="text-xl font-black text-slate-900">⚙️ கணினி அமைப்புகள் & கட்டண விபரங்கள் (System Settings)</h2>
          <p class="text-xs text-slate-500 font-medium mt-1">கட்டண விகிதங்கள், GST வரி சதவீதங்கள் மற்றும் சாப்டர் வரம்புகள்.</p>

          <form onsubmit="adminApp.saveSettings(event)" class="mt-6 space-y-4 text-xs font-semibold">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-700 mb-1">வருடாந்திர நெட்வொர்க்கிங் கட்டணம் (₹)</label>
                <input type="number" id="settingFee" value="15000" class="w-full p-2.5 rounded-xl border border-slate-300 font-black text-slate-900">
              </div>
              <div>
                <label class="block text-slate-700 mb-1">சாப்டர் அதிகபட்ச சீட்கள் எண்ணிக்கை</label>
                <input type="number" id="settingMaxSeats" value="100" class="w-full p-2.5 rounded-xl border border-slate-300 font-black text-slate-900">
              </div>
              <div>
                <label class="block text-slate-700 mb-1">மார்க்கெட்பிளேஸ் GST வரி விகிதம் (%)</label>
                <input type="number" id="settingGst" value="18" class="w-full p-2.5 rounded-xl border border-slate-300 font-black text-slate-900">
              </div>
              <div>
                <label class="block text-slate-700 mb-1">சந்தை தள கமிஷன் (%)</label>
                <input type="number" id="settingComm" value="2.5" step="0.1" class="w-full p-2.5 rounded-xl border border-slate-300 font-black text-slate-900">
              </div>
            </div>

            <div class="pt-4 border-t">
              <button type="submit" class="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition">
                அமைப்புகளைச் சேமி (Save Settings)
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // MODALS & ACTIONS
  openModal(html) {
    const modal = document.getElementById('admin-modal');
    const content = document.getElementById('admin-modal-content');
    if (modal && content) {
      content.innerHTML = html;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }
  }

  viewUserDetails(userId) {
    const u = (this.db.users || []).find(x => x.id === userId);
    if (!u) return;
    this.openModal(`
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="text-lg font-black text-slate-900">பயனர் முழு விவரம்</h3>
          <button onclick="adminApp.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
        </div>
        <div class="text-xs space-y-2 text-slate-700">
          <div><strong>பெயர்:</strong> ${u.fullName}</div>
          <div><strong>மின்னஞ்சல்:</strong> ${u.email}</div>
          <div><strong>தொலைபேசி:</strong> ${u.phone}</div>
          <div><strong>கணக்கு வகை:</strong> ${u.accountType || u.role}</div>
          <div><strong>பதிவு எண்:</strong> ${u.registrationNumber || '-'}</div>
          <div><strong>சாப்டர்:</strong> ${u.chapterId || '-'}</div>
          <div><strong>நிலை:</strong> ${(u.status || 'active').toUpperCase()}</div>
        </div>
        <div class="pt-4 border-t text-right">
          <button onclick="adminApp.closeModal()" class="px-4 py-2 bg-slate-100 font-bold rounded-xl text-xs">மூடுக</button>
        </div>
      </div>
    `);
  }

  suspendUser(userId) {
    if (confirm('இந்த கணக்கை இடைநிறுத்த (Suspend) விரும்புகிறீர்களா?')) {
      const u = (this.db.users || []).find(x => x.id === userId);
      if (u) {
        u.status = 'suspended';
        this.render();
      }
    }
  }

  reactivateUser(userId) {
    const u = (this.db.users || []).find(x => x.id === userId);
    if (u) {
      u.status = 'active';
      this.render();
    }
  }

  openAddChapterModal() {
    this.openModal(`
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="text-lg font-black text-slate-900">புதிய சாப்டர் உருவாக்குதல்</h3>
          <button onclick="adminApp.closeModal()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
        </div>
        <form onsubmit="adminApp.submitNewChapter(event)" class="space-y-3 text-xs font-semibold">
          <div>
            <label class="block mb-1">சாப்டர் பெயர் (தமிழ் / English)</label>
            <input type="text" id="chName" required placeholder="எ.கா: அரூர் வைப்ரன்ட்ஸ் (Harur Vibrants)" class="w-full p-2.5 rounded-xl border border-slate-300">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block mb-1">தாலுகா</label>
              <select id="chTaluk" class="w-full p-2.5 rounded-xl border border-slate-300">
                <option value="harur">ஹரூர் (Harur)</option>
                <option value="palacode">பாலக்கோடு (Palacode)</option>
                <option value="karimangalam">காரிமங்கலம் (Karimangalam)</option>
                <option value="dharmapuri_town">தருமபுரி டவுன்</option>
                <option value="pennagaram">பென்னாகரம்</option>
              </select>
            </div>
            <div>
              <label class="block mb-1">மாவட்டம்</label>
              <select id="chDistrict" class="w-full p-2.5 rounded-xl border border-slate-300">
                <option value="dharmapuri">தருமபுரி (Dharmapuri)</option>
                <option value="salem">சேலம் (Salem)</option>
              </select>
            </div>
          </div>
          <div class="pt-3 border-t flex justify-end gap-2">
            <button type="button" onclick="adminApp.closeModal()" class="px-4 py-2 bg-slate-100 font-bold rounded-xl">ரத்து</button>
            <button type="submit" class="px-4 py-2 bg-amber-400 font-black rounded-xl">உருவாக்கு ➔</button>
          </div>
        </form>
      </div>
    `);
  }

  submitNewChapter(e) {
    e.preventDefault();
    const name = document.getElementById('chName').value;
    const talukId = document.getElementById('chTaluk').value;
    const districtId = document.getElementById('chDistrict').value;

    const newCh = {
      id: `chapter_${Date.now()}`,
      nameTa: name,
      nameEn: name,
      talukId,
      districtId,
      filledSeats: 0,
      availableSeats: 100,
      createdAt: new Date().toISOString()
    };

    if (!this.db.chapters) this.db.chapters = [];
    this.db.chapters.push(newCh);
    this.closeModal();
    this.setTab('chapters');
    alert('புதிய சாப்டர் வெற்றிகரமாக உருவாக்கப்பட்டது!');
  }

  saveSettings(e) {
    e.preventDefault();
    alert('அமைப்புகள் வெற்றிகரமாகச் சேமிக்கப்பட்டன!');
  }

  exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.db, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `nbn_state_export_${Date.now()}.json`);
    dl.click();
  }
}

// Global initialization
window.adminApp = new NBNAdminApp();
