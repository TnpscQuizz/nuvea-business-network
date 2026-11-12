/**
 * NBN CUSTOMER & MARKETPLACE USER PORTAL APPLICATION
 * Dedicated Shopping, Requirements Posting & Quotation Bidding Hub
 */
class NBNCustomerApp {
  constructor() {
    this.currentTab = 'browse';
    this.lang = 'ta';
    this.db = null;
    this.cart = this.loadCart();
    this.selectedTaluk = 'all';
    this.searchTerm = '';
    this.init();
  }

  async init() {
    await this.fetchData();
    this.updateCartBadge();
    this.render();
  }

  async fetchData() {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        this.db = await res.json();
      }
    } catch (e) {
      console.error('Error fetching customer portal data:', e);
    }
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('nbn_customer_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem('nbn_customer_cart', JSON.stringify(this.cart));
    this.updateCartBadge();
  }

  updateCartBadge() {
    const badge = document.getElementById('cartCountBadge');
    if (badge) {
      const count = this.cart.reduce((sum, item) => sum + (item.qty || 1), 0);
      badge.textContent = count;
    }
  }

  setTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.user-tab').forEach(el => el.classList.remove('active-tab'));
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

  addToCart(item) {
    const existing = this.cart.find(x => x.id === item.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      this.cart.push({ ...item, qty: 1 });
    }
    this.saveCart();
    alert(`"${item.name}" கார்ட்டில் சேர்க்கப்பட்டது!`);
  }

  render() {
    const container = document.getElementById('user-content');
    if (!container || !this.db) return;

    switch (this.currentTab) {
      case 'browse':
        container.innerHTML = this.renderBrowse();
        break;
      case 'post':
        container.innerHTML = this.renderPostRequirement();
        break;
      case 'bids':
        container.innerHTML = this.renderBids();
        break;
      case 'cart':
        container.innerHTML = this.renderCart();
        break;
      case 'orders':
        container.innerHTML = this.renderOrders();
        break;
      case 'upgrade':
        container.innerHTML = this.renderUpgrade();
        break;
      default:
        container.innerHTML = this.renderBrowse();
    }
  }

  // 1. BROWSE MARKETPLACE
  renderBrowse() {
    const members = (this.db?.members || []).filter(m => {
      const matchTaluk = this.selectedTaluk === 'all' ? true : m.talukId === this.selectedTaluk;
      const matchSearch = !this.searchTerm ||
        (m.businessName || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (m.ownerName || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (m.specialOffer || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchTaluk && matchSearch;
    });

    const taluks = [
      { id: 'all', name: 'அனைத்து தாலுகாக்கள்' },
      { id: 'harur', name: 'ஹரூர் (Harur)' },
      { id: 'palacode', name: 'பாலக்கோடு (Palacode)' },
      { id: 'karimangalam', name: 'காரிமங்கலம்' },
      { id: 'dharmapuri_town', name: 'தருமபுரி டவுன்' },
      { id: 'pennagaram', name: 'பென்னாகரம்' }
    ];

    return `
      <div class="space-y-6">
        
        <!-- HERO BANNER -->
        <div class="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-black uppercase mb-2 border border-emerald-400/30">
                <span>🛒 சரிபார்க்கப்பட்ட மாவட்ட வர்த்தகர்கள்</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-black text-white">
                தருமபுரி & சேலத்தின் நம்பகமான வணிகர்கள் மற்றும் பொருட்கள்
              </h1>
              <p class="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                சிறந்த விலை சலுகைகள், 18% GST வரி பில்லிங் மற்றும் தாலுகா வாரியான நேரடி சேவைகள்
              </p>
            </div>

            <button onclick="userApp.openPostRequirementModal()" class="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition shrink-0 flex items-center gap-2">
              <span>📝 மொத்த தேவை சமர்ப்பிக்க (Post Req)</span>
            </button>
          </div>
        </div>

        <!-- SEARCH & TALUK FILTER -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-slate-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="தயாரிப்புகள், கடைகள், சலுகைகள் தேடவும் (எ.கா: தங்கம், பட்டு, சிசிடிவி, 4K வீடியோ)..." 
              value="${this.searchTerm}" 
              oninput="userApp.searchTerm = this.value; userApp.render();" 
              class="w-full text-xs sm:text-sm font-medium focus:outline-none py-1 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t text-xs font-bold">
            <span class="text-slate-400 text-[11px] shrink-0">தாலுகா தேர்வு:</span>
            ${taluks.map(t => `
              <button onclick="userApp.selectedTaluk = '${t.id}'; userApp.render();" class="px-3 py-1.5 rounded-xl border transition shrink-0 ${this.selectedTaluk === t.id ? 'bg-emerald-600 text-white border-emerald-600 font-black' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}">
                ${t.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- LISTING GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${members.map(m => `
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-emerald-500 transition-all duration-200 group">
              <div>
                <div class="relative h-40 bg-slate-100 overflow-hidden">
                  <img src="${m.cover || m.logo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80'}" alt="${m.businessName}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                  <div class="absolute top-3 left-3 bg-slate-950/80 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                    ${m.categoryName || m.categoryId}
                  </div>
                  <div class="absolute bottom-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                    ✓ VERIFIED B2B
                  </div>
                </div>

                <div class="p-5 space-y-2.5">
                  <h3 class="font-black text-slate-900 text-base leading-tight">${m.businessName}</h3>
                  <div class="text-xs text-slate-500 font-medium">
                    👤 ${m.ownerName} • 📍 ${(m.talukId || 'harur').toUpperCase()}
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    ${m.specialOffer ? `🎁 <strong class="text-amber-800">${m.specialOffer}</strong>` : (m.tagline || 'சிறந்த தரம் மற்றும் நேரடி விலை சலுகை.')}
                  </p>
                </div>
              </div>

              <div class="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                <a href="/#/biz/${m.id}" class="text-xs font-bold text-slate-600 hover:text-slate-900 py-2">
                  கடை பார்க்க ➔
                </a>
                <button 
                  onclick="userApp.addToCart({ id: '${m.id}_deal', name: '${m.businessName} - சிறப்பு சலுகை முன்பதிவு', price: 999, sellerId: '${m.id}', sellerName: '${m.businessName}' })" 
                  class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1.5">
                  <span>🛒 முன்பதிவு செய்</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  // 2. POST REQUIREMENT
  renderPostRequirement() {
    return `
      <div class="space-y-6 max-w-2xl mx-auto">
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-900 text-xs font-black uppercase mb-2 border border-amber-400/30">
              <span>⚡ நேரடி கொட்டேஷன் தளம்</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900">உங்கள் வணிகத் தேவையை சமர்ப்பியுங்கள்</h2>
            <p class="text-xs text-slate-500 font-medium mt-1">
              சரிபார்க்கப்பட்ட மாவட்ட சப்ளையர்களிடம் இருந்து குறைந்த விலையில் போட்டி கொட்டேஷன்களைப் பெறலாம்.
            </p>
          </div>

          <form onsubmit="userApp.submitRequirement(event)" class="space-y-4 text-xs font-semibold">
            <div>
              <label class="block text-slate-700 mb-1">தேவையின் தலைப்பு (Requirement Title)</label>
              <input type="text" id="reqTitle" required placeholder="எ.கா: 100 திருமண பட்டுப் புடவைகள் & வேஷ்டிகள் மொத்த ஆர்டர்" class="w-full p-3 rounded-xl border border-slate-300 font-medium text-slate-900">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-700 mb-1">தொழில் பிரிவு</label>
                <select id="reqCategory" class="w-full p-3 rounded-xl border border-slate-300 font-medium text-slate-900">
                  <option value="textiles">ஜவுளி & ஆடைகள் (Textiles)</option>
                  <option value="jewellery">தங்கம் & வெள்ளி நகைகள்</option>
                  <option value="cctv">CCTV & பாதுகாப்பு சாதனங்கள்</option>
                  <option value="photography">4K வீடியோ & போட்டோகிராபி</option>
                  <option value="construction">கட்டுமானப் பொருட்கள் & சிமெண்ட்</option>
                  <option value="electronics">எலக்ட்ரானிக்ஸ் & உபகரணங்கள்</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-700 mb-1">எதிர்பார்க்கும் பட்ஜெட் (₹)</label>
                <input type="number" id="reqBudget" required placeholder="எ.கா: 150000" class="w-full p-3 rounded-xl border border-slate-300 font-medium text-slate-900">
              </div>
            </div>

            <div>
              <label class="block text-slate-700 mb-1">முழு விபரம் & அளவுகள் (Details)</label>
              <textarea id="reqDesc" rows="3" required placeholder="எவ்வளவு அளவு தேவை? என்னென்ன தர நிர்ணயங்கள் தேவை? விவரிக்கவும்..." class="w-full p-3 rounded-xl border border-slate-300 font-medium text-slate-900"></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-700 mb-1">டெலிவரி தாலுகா</label>
                <select id="reqTaluk" class="w-full p-3 rounded-xl border border-slate-300 font-medium text-slate-900">
                  <option value="harur">ஹரூர் (Harur)</option>
                  <option value="palacode">பாலக்கோடு</option>
                  <option value="dharmapuri_town">தருமபுரி டவுன்</option>
                  <option value="karimangalam">காரிமங்கலம்</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-700 mb-1">அவசர நிலை</label>
                <select id="reqUrgency" class="w-full p-3 rounded-xl border border-slate-300 font-medium text-slate-900">
                  <option value="normal">இயல்பானது (3-5 நாட்கள்)</option>
                  <option value="urgent">அவசரம் (24-48 மணி நேரம்)</option>
                </select>
              </div>
            </div>

            <div class="pt-4 border-t">
              <button type="submit" class="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-md transition">
                🚀 தேவையை பதிவேற்று (Post Requirement) ➔
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  submitRequirement(e) {
    e.preventDefault();
    const title = document.getElementById('reqTitle').value;
    const category = document.getElementById('reqCategory').value;
    const budget = Number(document.getElementById('reqBudget').value);
    const description = document.getElementById('reqDesc').value;
    const talukId = document.getElementById('reqTaluk').value;

    const newReq = {
      id: `req_${Date.now()}`,
      title,
      category,
      budget,
      description,
      talukId,
      status: 'open',
      quotes: [],
      createdAt: new Date().toISOString()
    };

    if (!this.db.marketplaceRequirements) this.db.marketplaceRequirements = [];
    this.db.marketplaceRequirements.unshift(newReq);
    alert('உங்கள் தேவை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! சப்ளையர்களின் கொட்டேஷன்கள் வந்தவுடன் தெரிவிக்கப்படும்.');
    this.setTab('bids');
  }

  // 3. BIDS & QUOTATIONS
  renderBids() {
    const requirements = this.db?.marketplaceRequirements || [];

    return `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-slate-900">📋 உங்கள் தேவைகளுக்கான கொட்டேஷன்கள் (Received Bids)</h2>
            <p class="text-xs text-slate-500 font-medium">சப்ளையர்கள் அனுப்பிய விலைகளை ஒப்பிட்டு சிறந்த சப்ளையரைத் தேர்வு செய்யலாம்.</p>
          </div>
          <button onclick="userApp.setTab('post')" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-xs transition">
            + புதிய தேவை பதிவிட
          </button>
        </div>

        <div class="space-y-4">
          ${requirements.map(r => `
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <h3 class="font-black text-slate-900 text-base">${r.title}</h3>
                  <div class="text-xs text-slate-500 mt-0.5">பட்ஜெட்: <strong>₹${(r.budget || 0).toLocaleString('en-IN')}</strong> • தாலுகா: ${(r.talukId || 'Regional').toUpperCase()}</div>
                </div>
                <span class="text-[10px] font-black bg-blue-100 text-blue-900 px-3 py-1 rounded-full uppercase self-start sm:self-auto">
                  ${(r.quotes || []).length} சப்ளையர்கள் கொட்டேஷன் அனுப்பியுள்ளனர்
                </span>
              </div>

              <!-- QUOTE COMPARISON CARDS -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                ${(r.quotes && r.quotes.length > 0) ? r.quotes.map(q => `
                  <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                    <div class="flex items-center justify-between">
                      <span class="font-black text-slate-900 text-xs">${q.supplierName || 'Verified Supplier'}</span>
                      <span class="font-black text-emerald-600 text-sm">₹${(q.totalPrice || q.basePrice || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="text-[11px] text-slate-500 font-semibold">
                      அடிப்படை விலை: ₹${(q.basePrice || 0).toLocaleString('en-IN')} + 18% GST வரி
                    </div>
                    <button onclick="alert('சப்ளையரின் நேரடி தொடர்பு விபரங்கள் அன்லாக் செய்யப்பட்டன!')" class="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition">
                      ✓ சப்ளையரை தேர்வு செய்க (Accept Quote)
                    </button>
                  </div>
                `).join('') : `
                  <div class="col-span-2 py-4 text-center text-xs text-slate-400 font-semibold">
                    சப்ளையர்கள் உங்கள் தேவையை ஆய்வு செய்து வருகின்றனர். விரைவில் கொட்டேஷன்கள் பெறப்படும்.
                  </div>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 4. CART & CHECKOUT
  renderCart() {
    if (this.cart.length === 0) {
      return `
        <div class="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200 shadow-xs space-y-4">
          <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-3xl mx-auto">
            🛒
          </div>
          <h2 class="text-xl font-black text-slate-900">உங்கள் கார்ட் காலியாக உள்ளது</h2>
          <p class="text-xs text-slate-500">சந்தையில் உள்ள சிறந்த தயாரிப்புகளை கார்ட்டில் சேர்த்து ஆர்டர் செய்யுங்கள்.</p>
          <button onclick="userApp.setTab('browse')" class="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs">
            சந்தையை பார்வையிட ➔
          </button>
        </div>
      `;
    }

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    return `
      <div class="space-y-6 max-w-3xl mx-auto">
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b pb-4">
            <h2 class="text-xl font-black text-slate-900">🛒 உங்கள் ஷாப்பிங் கார்ட் (${this.cart.length} பொருட்கள்)</h2>
            <button onclick="userApp.cart = []; userApp.saveCart(); userApp.render();" class="text-xs font-bold text-rose-600 hover:underline">
              கார்ட்டை அழிக்க
            </button>
          </div>

          <div class="divide-y divide-slate-100">
            ${this.cart.map((item, idx) => `
              <div class="py-4 flex items-center justify-between gap-4">
                <div>
                  <h4 class="font-black text-slate-900 text-xs sm:text-sm">${item.name}</h4>
                  <div class="text-[11px] text-slate-500">சப்ளையர்: <strong>${item.sellerName || 'Verified Supplier'}</strong></div>
                </div>
                <div class="flex items-center gap-4">
                  <span class="font-black text-slate-900 text-xs sm:text-sm">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
                  <button onclick="userApp.cart.splice(${idx}, 1); userApp.saveCart(); userApp.render();" class="text-xs text-slate-400 hover:text-rose-600 font-bold">✕</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- SUMMARY & 18% GST -->
          <div class="bg-slate-50 rounded-2xl p-5 space-y-2 text-xs font-semibold text-slate-700">
            <div class="flex justify-between">
              <span>பொருட்கள் தொகை (Subtotal):</span>
              <span>₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between">
              <span>GST வரி (18% - 9% CGST + 9% SGST):</span>
              <span class="text-emerald-700">₹${tax.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between border-t pt-2 text-sm font-black text-slate-900">
              <span>மொத்த செலுத்த வேண்டிய தொகை:</span>
              <span class="text-emerald-600">₹${total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button onclick="alert('ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது! சப்ளையர் விரைவில் தொடர்பு கொள்வார்.'); userApp.cart = []; userApp.saveCart(); userApp.setTab('orders');" class="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-md transition">
            💳 ஆர்டரை உறுதி செய் (Confirm Order) ➔
          </button>
        </div>
      </div>
    `;
  }

  // 5. ORDERS
  renderOrders() {
    return `
      <div class="space-y-6 max-w-3xl mx-auto">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h2 class="text-xl font-black text-slate-900">📦 உங்கள் ஆர்டர்கள் மற்றும் ரசீதுகள்</h2>
          <p class="text-xs text-slate-500 font-medium mt-1">18% GST வரி பில்லிங் மற்றும் ஆர்டர் டெலிவரி டிராக்கிங்.</p>

          <div class="mt-6 space-y-4">
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div class="flex items-center justify-between border-b pb-2">
                <div>
                  <span class="font-black text-xs text-slate-900">ஆர்டர் #ORD-84920</span>
                  <div class="text-[11px] text-slate-400">தேதி: 12 நவம்பர் 2026</div>
                </div>
                <span class="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">DELIVERED</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span>ஸ்ரீ முருகன் ஜூவல்லரி • திருமண தங்க காசு முன்பதிவு</span>
                <span class="font-black text-slate-900">₹25,000</span>
              </div>
              <div class="pt-2 border-t flex justify-end gap-2 text-xs">
                <button onclick="alert('GST இன்வாய்ஸ் பிடிஎஃப் பதிவிறக்கம் செய்யப்படுகிறது...')" class="px-3 py-1 bg-white border border-slate-300 font-bold rounded-lg text-slate-700">
                  📄 GST Invoice PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 6. UPGRADE ACCOUNT
  renderUpgrade() {
    return `
      <div class="space-y-6 max-w-2xl mx-auto">
        <div class="bg-white rounded-3xl p-8 border-2 border-amber-400 shadow-xl text-center space-y-5">
          <div class="w-16 h-16 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto">
            🚀
          </div>
          <h2 class="text-2xl font-black text-slate-900">உங்கள் வணிகத்தை NBN-ல் இணைக்க வேண்டுமா?</h2>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            நீங்கள் ஒரு வணிக உரிமையாளராக இருந்தால், உங்கள் தயாரிப்புகளை மார்க்கெட்பிளேஸில் விற்கலாம் அல்லது சாப்டர் நெட்வொர்க்கில் இணைந்து உங்கள் தாலுகாவில் 100% பிரத்யேக ஏகபோக சீட்டைப் பெறலாம்!
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a href="/business" class="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition">
              🏢 Business Portal காண்க ➔
            </a>
            <a href="/#welcome" class="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition">
              📝 வணிகர் பதிவு படிவம் ➔
            </a>
          </div>
        </div>
      </div>
    `;
  }

  openPostRequirementModal() {
    this.setTab('post');
  }
}

// Global initialization
window.userApp = new NBNCustomerApp();
