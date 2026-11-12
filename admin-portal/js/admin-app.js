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

  // 1. OVERVIEW (Matches exact designer screenshot)
  renderOverview() {
    const chaptersCount = (this.db && this.db.chapters ? this.db.chapters.length : 25);
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return `
      <div class="space-y-6 max-w-7xl mx-auto">
        
        <!-- PAGE TITLE & TOP ACTION ROW -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">NBN Control Centre</h1>
            <p class="text-xs text-slate-500 font-medium">Central Administration Dashboard</p>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <!-- LIVE SYSTEM STATUS PILL -->
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live System</span>
            </div>

            <!-- LAST UPDATED CLOCK -->
            <div class="flex items-center gap-2 text-xs text-slate-400 font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span>Last Updated: ${dateStr}</span>
              <button onclick="adminApp.render()" class="text-slate-400 hover:text-slate-700 cursor-pointer" title="Refresh">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              </button>
            </div>

            <!-- EXPORT REPORT BUTTON -->
            <button onclick="adminApp.exportData()" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>Export Report</span>
            </button>
          </div>
        </div>

        <!-- 10 METRICS GRID (2 Rows of 5 Cards) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          
          <!-- 1. Total Members -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[11px] font-bold text-slate-500">Total Members</div>
              <div class="text-2xl font-black text-slate-900">1,250</div>
              <div class="text-[10px] font-bold text-blue-600">↑ 12%</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
              👥
            </div>
          </div>

          <!-- 2. Active Networking -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[11px] font-bold text-slate-500">Active Networking</div>
              <div class="text-2xl font-black text-slate-900">856</div>
              <div class="text-[10px] font-bold text-emerald-600">↑ 14%</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              🔗
            </div>
          </div>

          <!-- 3. Marketplace Sellers -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[11px] font-bold text-slate-500">Marketplace Sellers</div>
              <div class="text-2xl font-black text-slate-900">342</div>
              <div class="text-[10px] font-bold text-purple-600">↑ 10%</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
              🏬
            </div>
          </div>

          <!-- 4. Customers -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[11px] font-bold text-slate-500">Customers</div>
              <div class="text-2xl font-black text-slate-900">1,480</div>
              <div class="text-[10px] font-bold text-amber-600">↑ 16%</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
              👤
            </div>
          </div>

          <!-- 5. Pending Approvals -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[11px] font-bold text-slate-500">Pending Approvals</div>
              <div class="text-2xl font-black text-slate-900">36</div>
              <div class="text-[10px] font-bold text-teal-600">↓ 8%</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl shrink-0">
              ✓
            </div>
          </div>

          <!-- 6. Active Chapters -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[11px] font-bold text-slate-500">Active Chapters</div>
              <div class="text-2xl font-black text-slate-900">${chaptersCount}</div>
              <div class="text-[10px] font-bold text-emerald-600">↑ 5%</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              🧭
            </div>
          </div>

          <!-- 7. Business Listings -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[11px] font-bold text-slate-500">Business Listings</div>
              <div class="text-2xl font-black text-slate-900">2,840</div>
              <div class="text-[10px] font-bold text-blue-600">↑ 18%</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
              🏢
            </div>
          </div>

          <!-- 8. Open Requirements -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[11px] font-bold text-slate-500">Open Requirements</div>
              <div class="text-2xl font-black text-slate-900">148</div>
              <div class="text-[10px] font-bold text-amber-600">↑ 20%</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
              📋
            </div>
          </div>

          <!-- 9. Active Quotations -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[11px] font-bold text-slate-500">Active Quotations</div>
              <div class="text-2xl font-black text-slate-900">326</div>
              <div class="text-[10px] font-bold text-indigo-600">↑ 15%</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0">
              📄
            </div>
          </div>

          <!-- 10. Completed Orders -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[11px] font-bold text-slate-500">Completed Orders</div>
              <div class="text-2xl font-black text-slate-900">412</div>
              <div class="text-[10px] font-bold text-emerald-600">↑ 22%</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              🛍️
            </div>
          </div>

        </div>

        <!-- MIDDLE ROW: 3 ANALYTICS & CHARTS CARDS -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          <!-- 1. MEMBER GROWTH TREND -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide">📈 Member Growth Trend</h3>
              <span class="text-xs font-bold text-slate-600 bg-slate-100 rounded-lg px-2 py-1">6 Months</span>
            </div>

            <!-- SVG LINE CHART -->
            <div class="relative pt-4 pb-2">
              <div class="absolute top-3 left-[56%] -translate-x-1/2 bg-slate-900 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold shadow-lg z-10 pointer-events-none">
                <div>Apr</div>
                <div class="text-amber-400 font-black">1,120 Members</div>
              </div>

              <svg viewBox="0 0 360 170" class="w-full h-44 overflow-visible">
                <defs>
                  <linearGradient id="svgBlueArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="30" y1="20" x2="350" y2="20" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
                <line x1="30" y1="60" x2="350" y2="60" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
                <line x1="30" y1="100" x2="350" y2="100" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
                <line x1="30" y1="140" x2="350" y2="140" stroke="#f1f5f9" stroke-width="1" />

                <text x="5" y="24" fill="#94a3b8" font-size="9" font-weight="700">1.5K</text>
                <text x="12" y="64" fill="#94a3b8" font-size="9" font-weight="700">1K</text>
                <text x="7" y="104" fill="#94a3b8" font-size="9" font-weight="700">500</text>
                <text x="18" y="144" fill="#94a3b8" font-size="9" font-weight="700">0</text>

                <path d="M 40 120 Q 95 100 150 90 T 210 70 T 270 60 T 340 45 L 340 140 L 40 140 Z" fill="url(#svgBlueArea)" />
                <path d="M 40 120 Q 95 100 150 90 T 210 70 T 270 60 T 340 45" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" />

                <circle cx="40" cy="120" r="3.5" fill="#2563eb" />
                <circle cx="100" cy="100" r="3.5" fill="#2563eb" />
                <circle cx="160" cy="90" r="3.5" fill="#2563eb" />
                <circle cx="220" cy="70" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
                <circle cx="280" cy="60" r="3.5" fill="#2563eb" />
                <circle cx="340" cy="45" r="3.5" fill="#2563eb" />

                <text x="35" y="160" fill="#64748b" font-size="9" font-weight="700">Jan</text>
                <text x="95" y="160" fill="#64748b" font-size="9" font-weight="700">Feb</text>
                <text x="155" y="160" fill="#64748b" font-size="9" font-weight="700">Mar</text>
                <text x="215" y="160" fill="#64748b" font-size="9" font-weight="700">Apr</text>
                <text x="275" y="160" fill="#64748b" font-size="9" font-weight="700">May</text>
                <text x="335" y="160" fill="#64748b" font-size="9" font-weight="700">Jun</text>
              </svg>
            </div>
          </div>

          <!-- 2. REVENUE OVERVIEW (INR Strictly) -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide">📊 Revenue Overview</h3>
              <span class="text-xs font-bold text-slate-600 bg-slate-100 rounded-lg px-2 py-1">6 Months</span>
            </div>

            <!-- SVG BAR CHART -->
            <div class="pt-4 pb-2">
              <svg viewBox="0 0 360 170" class="w-full h-44 overflow-visible">
                <line x1="35" y1="20" x2="350" y2="20" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
                <line x1="35" y1="60" x2="350" y2="60" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
                <line x1="35" y1="100" x2="350" y2="100" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
                <line x1="35" y1="140" x2="350" y2="140" stroke="#f1f5f9" stroke-width="1" />

                <text x="5" y="24" fill="#94a3b8" font-size="9" font-weight="700">₹15L</text>
                <text x="5" y="64" fill="#94a3b8" font-size="9" font-weight="700">₹10L</text>
                <text x="9" y="104" fill="#94a3b8" font-size="9" font-weight="700">₹5L</text>
                <text x="18" y="144" fill="#94a3b8" font-size="9" font-weight="700">₹0</text>

                <rect x="52" y="85" width="26" height="55" rx="5" fill="#10b981" />
                <rect x="105" y="55" width="26" height="85" rx="5" fill="#10b981" />
                <rect x="158" y="70" width="26" height="70" rx="5" fill="#10b981" />
                <rect x="211" y="65" width="26" height="75" rx="5" fill="#10b981" />
                <rect x="264" y="38" width="26" height="102" rx="5" fill="#10b981" />
                <rect x="317" y="30" width="26" height="110" rx="5" fill="#10b981" />

                <text x="56" y="160" fill="#64748b" font-size="9" font-weight="700">Jan</text>
                <text x="109" y="160" fill="#64748b" font-size="9" font-weight="700">Feb</text>
                <text x="162" y="160" fill="#64748b" font-size="9" font-weight="700">Mar</text>
                <text x="215" y="160" fill="#64748b" font-size="9" font-weight="700">Apr</text>
                <text x="268" y="160" fill="#64748b" font-size="9" font-weight="700">May</text>
                <text x="321" y="160" fill="#64748b" font-size="9" font-weight="700">Jun</text>
              </svg>
            </div>
          </div>

          <!-- 3. CHAPTER PERFORMANCE -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs flex flex-col justify-between space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide">🍩 Chapter Performance</h3>
            </div>

            <div class="flex items-center justify-around py-2">
              <div class="relative w-32 h-32 flex items-center justify-center">
                <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" stroke-width="12" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" stroke-width="12" stroke-dasharray="143 238" stroke-dashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" stroke-width="12" stroke-dasharray="60 238" stroke-dashoffset="-143" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" stroke-width="12" stroke-dasharray="35 238" stroke-dashoffset="-203" />
                </svg>
                <div class="absolute text-center">
                  <div class="text-xl font-black text-slate-900 leading-none">25</div>
                  <div class="text-[10px] text-slate-400 font-bold mt-0.5">Chapters</div>
                </div>
              </div>

              <div class="space-y-2 text-xs font-bold text-slate-700">
                <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Top Performing</span></div>
                <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span>Active</span></div>
                <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Needs Attention</span></div>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 flex justify-end">
              <button onclick="adminApp.setTab('chapters')" class="text-xs font-bold text-slate-900 hover:text-indigo-600 flex items-center gap-1 cursor-pointer">
                <span>View Details ➔</span>
              </button>
            </div>
          </div>

        </div>

        <!-- LOWER ROW: 3 CARDS -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          <!-- 1. DISTRICT-WISE PERFORMANCE -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
            <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide">🗺️ District-Wise Business Performance</h3>
            <div class="flex items-center gap-4">
              <div class="w-36 h-40 shrink-0 relative flex items-center justify-center bg-slate-50 rounded-2xl p-2 border border-slate-100">
                <svg viewBox="0 0 100 120" class="w-full h-full">
                  <path d="M 55 10 L 75 18 L 85 30 L 70 38 L 55 25 Z" fill="#10b981" />
                  <path d="M 20 45 L 42 40 L 45 65 L 25 70 L 15 55 Z" fill="#f59e0b" />
                  <path d="M 45 28 L 68 35 L 60 55 L 42 45 Z" fill="#3b82f6" />
                  <path d="M 42 55 L 65 52 L 60 78 L 40 75 Z" fill="#8b5cf6" />
                  <path d="M 28 72 L 58 75 L 55 105 L 35 115 L 25 90 Z" fill="#6366f1" />
                </svg>
              </div>

              <div class="flex-1 space-y-2 text-xs font-bold text-slate-700">
                <div class="flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Chennai</span></div><span class="font-black">28.5%</span></div>
                <div class="flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Coimbatore</span></div><span class="font-black">22.3%</span></div>
                <div class="flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span><span>Madurai</span></div><span class="font-black">18.7%</span></div>
                <div class="flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span>Salem</span></div><span class="font-black">16.1%</span></div>
                <div class="flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-slate-300"></span><span>Others</span></div><span class="font-black">14.4%</span></div>
              </div>
            </div>
          </div>

          <!-- 2. RECENT ACTIVITY -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide">⚡ Recent Platform Activity</h3>
              <button onclick="adminApp.setTab('users')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800">View All ➔</button>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2.5">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" class="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div><div class="font-bold text-slate-900">New business registered</div><div class="text-[11px] text-slate-500">Ramesh Traders – Chennai</div></div>
                </div>
                <span class="text-[10px] text-slate-400">2 min ago</span>
              </div>

              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2.5">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" class="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div><div class="font-bold text-slate-900">New order placed</div><div class="text-[11px] text-emerald-600 font-bold">₹48,500 – City Supplies</div></div>
                </div>
                <span class="text-[10px] text-slate-400">5 min ago</span>
              </div>

              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2.5">
                  <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&q=80" class="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div><div class="font-bold text-slate-900">New referral</div><div class="text-[11px] text-slate-500">Suresh → Kumar</div></div>
                </div>
                <span class="text-[10px] text-slate-400">8 min ago</span>
              </div>

              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2.5">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" class="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div><div class="font-bold text-slate-900">Chapter meeting scheduled</div><div class="text-[11px] text-slate-500">Dharmapuri Chapter</div></div>
                </div>
                <span class="text-[10px] text-slate-400">12 min ago</span>
              </div>
            </div>
          </div>

          <!-- 3. PENDING ADMIN TASKS -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide">📋 Pending Admin Tasks</h3>
                <span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">12</span>
              </div>
              <button onclick="adminApp.setTab('users')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800">View All ➔</button>
            </div>

            <div class="space-y-2.5 text-xs font-medium text-slate-700">
              <div onclick="adminApp.setTab('users')" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <span class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">👤</span>
                <span class="flex-grow">Approve 18 new business registrations</span>
              </div>
              <div onclick="adminApp.setTab('marketplace')" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <span class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">📋</span>
                <span class="flex-grow">Review 7 customer requirements</span>
              </div>
              <div onclick="adminApp.setTab('marketplace')" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <span class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">🏪</span>
                <span class="flex-grow">Verify 5 marketplace sellers</span>
              </div>
              <div onclick="adminApp.setTab('marketplace')" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <span class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">⚖️</span>
                <span class="flex-grow">Resolve 3 disputes</span>
              </div>
              <div onclick="adminApp.setTab('chapters')" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <span class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 font-bold">🗳️</span>
                <span class="flex-grow">Confirm 2 chapter elections</span>
              </div>
            </div>
          </div>

        </div>

        <!-- BOTTOM ROW: SYSTEM ALERTS, QUICK ACTIONS, TOP CHAPTERS -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          <!-- 1. SYSTEM ALERTS -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide">⚠️ System Alerts</h3>
              <button class="text-xs font-bold text-indigo-600 hover:text-indigo-800">View All ➔</button>
            </div>
            <div class="space-y-3 text-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span><span class="text-slate-700 font-medium">Database backup completed successfully</span></div>
                <span class="text-[10px] text-slate-400">2 hours ago</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span><span class="text-slate-700 font-medium">High activity in Chennai chapter</span></div>
                <span class="text-[10px] text-slate-400">3 hours ago</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span><span class="text-slate-700 font-medium">Payment gateway response delay</span></div>
                <span class="text-[10px] text-slate-400">4 hours ago</span>
              </div>
            </div>
          </div>

          <!-- 2. QUICK ACTIONS -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
            <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide">⚡ Quick Actions</h3>
            <div class="grid grid-cols-4 gap-2.5">
              <button onclick="adminApp.setTab('users')" class="p-3 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center">
                <span class="text-lg">👤</span><span class="text-[10px] font-black leading-tight">Add Member</span>
              </button>
              <button onclick="adminApp.openAddChapterModal()" class="p-3 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center">
                <span class="text-lg">🧭</span><span class="text-[10px] font-black leading-tight">Create Chapter</span>
              </button>
              <button onclick="adminApp.setTab('users')" class="p-3 rounded-xl bg-purple-50/80 hover:bg-purple-100/80 text-purple-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center">
                <span class="text-lg">✓</span><span class="text-[10px] font-black leading-tight">Approve Business</span>
              </button>
              <button onclick="adminApp.exportData()" class="p-3 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 text-amber-700 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center">
                <span class="text-lg">📊</span><span class="text-[10px] font-black leading-tight">View Reports</span>
              </button>
            </div>
          </div>

          <!-- 3. TOP CHAPTERS BY BUSINESS VALUE -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide">🏆 Top Chapters by Business Value</h3>
              <button onclick="adminApp.setTab('chapters')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800">View All ➔</button>
            </div>
            <div class="space-y-3 text-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5"><span class="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] flex items-center justify-center">1</span><span class="font-bold text-slate-800">Chennai Chapter</span></div>
                <span class="font-black text-slate-900">₹12.5L</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5"><span class="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-black text-[10px] flex items-center justify-center">2</span><span class="font-bold text-slate-800">Coimbatore Chapter</span></div>
                <span class="font-black text-slate-900">₹10.8L</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5"><span class="w-5 h-5 rounded-full bg-amber-50 text-amber-700 font-black text-[10px] flex items-center justify-center">3</span><span class="font-bold text-slate-800">Madurai Chapter</span></div>
                <span class="font-black text-slate-900">₹8.7L</span>
              </div>
            </div>
          </div>

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
