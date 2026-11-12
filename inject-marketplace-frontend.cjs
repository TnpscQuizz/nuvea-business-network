const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'public', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

console.log('--- INJECTING MARKETPLACE MODULE INTO public/js/app.js ---');

// 1. In handleRoute(), support #/marketplace and #/customer
if (!code.includes("hash === '#/marketplace'")) {
  code = code.replace(
    "else if (hash === '#/chapters') {",
    `else if (hash === '#/marketplace') {
      this.setTab('marketplace');
      this.render();
      return;
    } else if (hash === '#/customer') {
      this.setTab('customer');
      this.render();
      return;
    } else if (hash === '#/chapters') {`
  );
}

// 2. In setTab(), support active class for tab-marketplace and tab-customer
if (!code.includes("'marketplace', 'customer'")) {
  code = code.replace(
    "['home', 'chapters', 'categories', 'meeting', 'consumer', 'map', 'elevation', 'certificate', 'opportunities']",
    "['home', 'chapters', 'marketplace', 'customer', 'categories', 'meeting', 'consumer', 'map', 'elevation', 'certificate', 'opportunities']"
  );
}

// 3. In render(), add cases for 'marketplace' and 'customer'
if (!code.includes("case 'marketplace':")) {
  code = code.replace(
    "case 'chapters':\n        container.innerHTML = this.renderChaptersView();\n        break;",
    `case 'chapters':
        container.innerHTML = this.renderChaptersView();
        break;
      case 'marketplace':
        container.innerHTML = this.renderMarketplaceView();
        break;
      case 'customer':
        container.innerHTML = this.renderCustomerDashboardView();
        break;`
  );
}

// 4. Implement renderMarketplaceView, renderCustomerDashboardView, and all Marketplace modals
const marketplaceViewsAndModals = `
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

    return \`
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
                value="\${this.marketplaceSearchQuery || ''}" 
                oninput="app.setMarketplaceSearch(this.value)"
                placeholder="என்ன தயாரிப்பு அல்லது சேவை தேவை? (எ.கா: சிமெண்ட், TMT கம்பி, இன்டீரியர், பிளம்பிங்...)" 
                class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
              <span class="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <select onchange="app.setMarketplaceCategoryFilter(this.value)" class="px-3.5 py-3 border border-slate-300 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-hidden">
                <option value="">அனைத்து வணிகப் பிரிவுகள்</option>
                \${categories.slice(0, 30).map(c => \`
                  <option value="\${c.id}" \${selectedCat === c.id ? 'selected' : ''}>\${c.nameTa || c.nameEn}</option>
                \`).join('')}
              </select>

              <select onchange="app.setMarketplaceTalukFilter(this.value)" class="px-3.5 py-3 border border-slate-300 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-hidden">
                <option value="all">அனைத்து தாலுகாக்கள்</option>
                <option value="harur" \${selectedTaluk === 'harur' ? 'selected' : ''}>ஹரூர் (Harur)</option>
                <option value="palacode" \${selectedTaluk === 'palacode' ? 'selected' : ''}>பாலக்கோடு (Palacode)</option>
                <option value="karimangalam" \${selectedTaluk === 'karimangalam' ? 'selected' : ''}>காரிமங்கலம்</option>
                <option value="dharmapuri_town" \${selectedTaluk === 'dharmapuri_town' ? 'selected' : ''}>தருமபுரி சென்ட்ரல்</option>
                <option value="pennagaram" \${selectedTaluk === 'pennagaram' ? 'selected' : ''}>பென்னாகரம்</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs font-bold text-slate-500 pt-1 border-t border-slate-100">
            <span>பொருத்தமான வணிகர்கள்: <strong class="text-slate-900">\${matchingSuppliers.length}</strong></span>
            <span>செயலில் உள்ள தேவைகள்: <strong class="text-amber-700">\${requirements.length}</strong></span>
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
            \${requirements.map(req => {
              const quotes = (this.db.quotations || []).filter(q => q.requirementId === req.id);
              const minQuote = quotes.length > 0 ? Math.min(...quotes.map(q => q.finalTotal)) : null;

              return \`
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-amber-400 transition space-y-3 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <span class="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-mono text-[10px] font-black border border-amber-200">
                        \${req.id}
                      </span>
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                        \${quotes.length} விலைப்புள்ளிகள் வந்துள்ளன
                      </span>
                    </div>

                    <h3 class="text-base font-black text-slate-900 leading-snug">
                      \${req.title}
                    </h3>

                    <div class="text-xs text-slate-600 font-medium space-y-1">
                      <div>அளவு: <strong class="text-slate-900">\${req.quantity} \${req.unit}</strong> • பிராண்ட்: <span class="text-slate-800">\${req.brandPreference || 'எதுவும்'}</span></div>
                      <div>இடம்: <strong>\${(req.deliveryTaluk || '').toUpperCase()}, \${(req.deliveryDistrict || 'Dharmapuri').toUpperCase()}</strong></div>
                      <div>தேவைப்படும் தேதி: <strong class="text-brand-900">\${req.requiredDate}</strong></div>
                      \${req.specifications ? \`<p class="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">"\${req.specifications}"</p>\` : ''}
                    </div>

                    \${minQuote ? \`
                      <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <span class="text-emerald-900 font-bold">குறைந்த விலை (Lowest Quote):</span>
                        <strong class="font-mono text-emerald-700 text-sm">₹\${minQuote.toLocaleString('en-IN')}</strong>
                      </div>
                    \` : ''}
                  </div>

                  <div class="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button onclick="app.openSubmitQuotationModal('\${req.id}')" class="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition text-center">
                      விலைப்புள்ளி சமர்ப்பி ➔
                    </button>
                    <button onclick="app.openCompareQuotationsModal('\${req.id}')" class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition text-center">
                      விலைகளை ஒப்பிடு (\${quotes.length})
                    </button>
                  </div>
                </div>
              \`;
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
            <span class="text-xs font-bold text-emerald-700">\${matchingSuppliers.length} வணிகர்கள்</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            \${matchingSuppliers.slice(0, 12).map(sup => {
              const chap = chapters.find(c => c.id === sup.chapterId) || {};
              const cleanPhone = (sup.phone || '9842100000').replace(/\\D/g, '');
              const waText = encodeURIComponent(\`வணக்கம் \${sup.businessName}, NBN மார்க்கெட்பிளேஸ் மூலம் தொடர்பு கொள்கிறேன்.\`);

              return \`
                <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3">
                  <div>
                    <div class="flex items-center justify-between gap-1 mb-2">
                      <span class="px-2 py-0.5 rounded-md bg-brand-50 text-brand-900 text-[10px] font-black uppercase font-mono">
                        \${chap.nameTa || 'ஹரூர் டைட்டன்ஸ்'}
                      </span>
                      <span class="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                        ✓ VERIFIED
                      </span>
                    </div>

                    <h3 class="text-base font-black text-slate-900 leading-snug">
                      \${sup.businessName}
                    </h3>
                    <div class="text-xs text-slate-500 font-bold mt-0.5">
                      உரிமையாளர்: \${sup.ownerName}
                    </div>

                    <div class="inline-block my-2 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-black border border-amber-200">
                      \${sup.category || sup.categoryId}
                    </div>

                    \${sup.specialOffer ? \`
                      <div class="text-[11px] text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                        🎁 <strong>சிறப்பு சலுகை:</strong> \${sup.specialOffer}
                      </div>
                    \` : ''}
                  </div>

                  <div class="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <a href="https://wa.me/\${cleanPhone}?text=\${waText}" target="_blank" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition text-center flex items-center justify-center gap-1">
                      💬 வாட்ஸ்அப்
                    </a>
                    <button onclick="app.openStandaloneBiz('\${sup.id}')" class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition text-center">
                      விவரம் ➔
                    </button>
                  </div>
                </div>
              \`;
            }).join('')}
          </div>
        </div>

      </div>
    \`;
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

    return \`
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
            <div class="text-2xl sm:text-3xl font-black text-slate-900">\${myRequirements.length}</div>
            <div class="text-[11px] text-slate-500 mt-1">கட்டுமானம் & கொள்முதல்</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">பெறப்பட்ட விலைப்புள்ளிகள்</div>
            <div class="text-2xl sm:text-3xl font-black text-brand-900">\${totalQuotesReceived}</div>
            <div class="text-[11px] text-emerald-600 font-semibold mt-1">போட்டி விலைகள் தயார்</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">நடப்பில் உள்ள ஆர்டர்கள்</div>
            <div class="text-2xl sm:text-3xl font-black text-amber-600">\${myOrders.length}</div>
            <div class="text-[11px] text-slate-500 mt-1">டெலிவரி & கண்காணிப்பு</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">நிறைவு பெற்ற மதிப்பு</div>
            <div class="text-2xl sm:text-3xl font-black text-emerald-700">₹\${(totalSpent).toLocaleString('en-IN')}</div>
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
            <span class="text-xs font-bold text-brand-900">\${myRequirements.length} தேவைகள்</span>
          </div>

          <div class="space-y-4">
            \${myRequirements.map(req => {
              const quotes = (this.db.quotations || []).filter(q => q.requirementId === req.id);
              const isSelected = req.status === 'selected' || req.selectedQuotationId;

              return \`
                <div class="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-mono text-[10px] font-black bg-slate-200 px-2 py-0.5 rounded text-slate-800">\${req.id}</span>
                        <span class="text-xs font-bold text-slate-500">\${req.categoryName || req.categoryId}</span>
                        \${isSelected ? \`
                          <span class="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-black">✓ தேர்வு செய்யப்பட்டது</span>
                        \` : \`
                          <span class="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-black">ஏலம் நடப்பில் உள்ளது</span>
                        \`}
                      </div>
                      <h4 class="font-black text-slate-900 text-base">\${req.title}</h4>
                      <p class="text-xs text-slate-600 mt-0.5">அளவு: <strong>\${req.quantity} \${req.unit}</strong> • இடம்: <strong>\${req.deliveryTaluk.toUpperCase()}</strong> • தேவைப்படும் தேதி: <strong>\${req.requiredDate}</strong></p>
                    </div>

                    <div class="shrink-0 flex items-center gap-2">
                      <button onclick="app.openCompareQuotationsModal('\${req.id}')" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5">
                        <span>📊 விலைகளை ஒப்பிடு (\${quotes.length})</span>
                      </button>
                    </div>
                  </div>
                </div>
              \`;
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
            <span class="text-xs font-bold text-emerald-700">\${myOrders.length} ஆர்டர்கள்</span>
          </div>

          <div class="space-y-4">
            \${myOrders.map(ord => {
              const isDelivered = ord.orderStatus === 'delivered' || ord.orderStatus === 'closed' || ord.orderStatus === 'customer_confirmed';
              return \`
                <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-mono text-[10px] font-black bg-blue-50 text-brand-900 px-2 py-0.5 rounded border border-blue-200">\${ord.id}</span>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black \${isDelivered ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}">
                          \${ord.orderStatus.toUpperCase()}
                        </span>
                      </div>
                      <h4 class="font-black text-slate-900 text-base">\${ord.itemTitle}</h4>
                      <p class="text-xs text-slate-600 mt-0.5">சப்ளையர்: <strong>\${ord.supplierBusinessName}</strong> • ஒப்பந்த மதிப்பு: <strong class="text-emerald-700 text-sm">₹\${(ord.finalDealValue || 0).toLocaleString('en-IN')}</strong></p>
                      <p class="text-[11px] text-slate-500 font-mono mt-0.5">சப்ளையர் போன்: \${ord.supplierPhone || '9842511223'} • ஆர்டர் தேதி: \${(ord.orderDate || '').split('T')[0]}</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 shrink-0">
                      \${!isDelivered ? \`
                        <button onclick="app.updateCustomerOrderStatus('\${ord.id}', 'delivered')" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition">
                          ✓ டெலிவரி கிடைத்தது
                        </button>
                      \` : \`
                        <button onclick="app.openReviewModal('\${ord.id}')" class="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition">
                          ⭐ மதிப்பாய்வு எழுது
                        </button>
                      \`}
                      <button onclick="app.openDisputeModal('\${ord.id}')" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition border border-slate-200">
                        ⚠️ புகார்
                      </button>
                    </div>
                  </div>
                </div>
              \`;
            }).join('')}
          </div>
        </div>

      </div>
    \`;
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

    modalEl.innerHTML = \`
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
                  \${categories.slice(0, 40).map(c => \`
                    <option value="\${c.id}">\${c.nameTa || c.nameEn}</option>
                  \`).join('')}
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
    \`;
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

    modalEl.innerHTML = \`
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2">
                <span>💰 விலைப்புள்ளி ஏலம் சமர்ப்பித்தல் (Submit Quotation)</span>
              </div>
              <h3 class="text-xl font-black text-slate-900">
                \${req.title || 'வாடிக்கையாளர் தேவைக்கு விலைப்புள்ளி'}
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                அளவு: <strong>\${req.quantity} \${req.unit}</strong> • இடம்: <strong>\${(req.deliveryTaluk || '').toUpperCase()}</strong>
              </p>
            </div>

            <form onsubmit="app.submitQuotationBid(event, '\${requirementId}')" class="space-y-3 text-xs">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">அலகு விலை (Unit Price ₹) *</label>
                  <input type="number" id="quote-unit-price" name="unitPrice" required placeholder="340" oninput="app.calcQuoteTotal()" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-hidden" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">அளவு (Quantity)</label>
                  <input type="number" id="quote-qty" name="quantity" readonly value="\${req.quantity || 1}" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl font-mono font-bold" />
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
    \`;
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
      const res = await fetch(\`/api/marketplace/requirements/\${requirementId}/quotations\`, {
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

    modalEl.innerHTML = \`
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
          <button onclick="app.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-black text-xl">✕</button>
          
          <div class="space-y-6">
            <div class="border-b border-slate-200 pb-4">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                <span>📊 போட்டி விலைப்புள்ளிகள் ஒப்பீடு (Quotation Comparison Matrix)</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900">
                \${req.title}
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                அளவு: <strong>\${req.quantity} \${req.unit}</strong> • இடம்: <strong>\${(req.deliveryTaluk || '').toUpperCase()}</strong> • பெறப்பட்ட விலைப்புள்ளிகள்: <strong>\${quotes.length}</strong>
              </p>
            </div>

            \${quotes.length === 0 ? \`
              <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div class="text-3xl">⏳</div>
                <h4 class="font-bold text-slate-800 text-sm">இன்னும் விலைப்புள்ளிகள் வரவில்லை</h4>
                <p class="text-xs text-slate-500">சப்ளையர்கள் உங்கள் தேவையை ஆய்வு செய்து வருகின்றனர். விரைவில் விலைப்புள்ளிகள் இங்கு தோன்றும்.</p>
              </div>
            \` : \`
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
                    \${quotes.map(q => {
                      const isLowest = q.finalTotal === minTotal;
                      return \`
                        <tr class="hover:bg-slate-50 \${isLowest ? 'bg-emerald-50/40' : ''}">
                          <td class="p-3">
                            <div class="font-black text-slate-900 text-sm">\${q.supplierBusinessName}</div>
                            <div class="text-[10px] text-slate-500 mt-0.5">சாப்டர்: \${q.supplierChapterId}</div>
                            \${isLowest ? \`
                              <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950">
                                ★ குறைந்த விலை (Lowest Quote)
                              </span>
                            \` : ''}
                          </td>
                          <td class="p-3 font-mono font-bold text-slate-800 text-sm">₹\${q.unitPrice}</td>
                          <td class="p-3 font-mono text-slate-600">₹\${q.gstAmount + q.deliveryCharges}</td>
                          <td class="p-3 font-mono font-black text-emerald-700 text-base">₹\${q.finalTotal.toLocaleString('en-IN')}</td>
                          <td class="p-3 text-slate-700 font-bold">\${q.deliveryTimeline}</td>
                          <td class="p-3">
                            <button onclick="app.openSelectQuoteConsentModal('\${requirementId}', '\${q.id}')" class="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition">
                              தேர்வு செய் & ஆர்டர் ➔
                            </button>
                          </td>
                        </tr>
                      \`;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            \`}

            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <span class="text-base">💡</span>
              <p>
                <strong>தேர்வு முறை:</strong> குறைந்த விலை என்பது ஒரு வழிகாட்டுதல் மட்டுமே; எந்த சப்ளையரை தேர்வு செய்வது என்பது வாடிக்கையாளரின் முழுமையான உரிமை. வணிகரை தேர்வு செய்த பின்னரே உங்கள் தொடர்பு எண் அவருக்கு பகிரப்படும்.
              </p>
            </div>
          </div>
        </div>
      </div>
    \`;
  }

  openSelectQuoteConsentModal(requirementId, quotationId) {
    const q = (this.db.quotations || []).find(quote => quote.id === quotationId) || {};
    const modalEl = document.getElementById('modal-container');
    if (!modalEl) return;

    modalEl.innerHTML = \`
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
                நீங்கள் <strong>\${q.supplierBusinessName}</strong> நிறுவனத்தின் ₹\${(q.finalTotal || 0).toLocaleString('en-IN')} விலைப்புள்ளியை தேர்வு செய்கிறீர்கள்.
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

            <button onclick="app.confirmQuotationSelection('\${requirementId}', '\${quotationId}')" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition">
              ஆர்டரை உறுதி செய்து தொடர்பை பகிர் ➔
            </button>
          </div>
        </div>
      </div>
    \`;
  }

  async confirmQuotationSelection(requirementId, quotationId) {
    const chk = document.getElementById('chk-customer-consent');
    if (chk && !chk.checked) {
      alert('தொடர்பு விவரங்களை பகிர சம்மதம் தேவை');
      return;
    }

    try {
      const res = await fetch(\`/api/marketplace/requirements/\${requirementId}/select\`, {
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
      await fetch(\`/api/marketplace/orders/\${orderId}/status\`, {
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

    modalEl.innerHTML = \`
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

            <form onsubmit="app.submitReview(event, '\${orderId}')" class="space-y-3 text-xs">
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
    \`;
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

    modalEl.innerHTML = \`
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

            <form onsubmit="app.submitDispute(event, '\${orderId}')" class="space-y-3 text-xs">
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
    \`;
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
`;

// Insert methods before closeModal()
const closeModalIdx = code.indexOf('  closeModal() {');
if (closeModalIdx !== -1) {
  code = code.substring(0, closeModalIdx) + marketplaceViewsAndModals + '\n' + code.substring(closeModalIdx);
  fs.writeFileSync(appJsPath, code, 'utf8');
  console.log('✓ Successfully injected marketplace views, modals, and controllers into app.js');
} else {
  console.error('Could not find closeModal() in app.js');
}
