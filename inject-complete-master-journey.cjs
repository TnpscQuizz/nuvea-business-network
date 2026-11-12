const fs = require('fs');

const appJsPath = 'C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/public/js/app.js';
let content = fs.readFileSync(appJsPath, 'utf8');

// Load helper functions and methods to inject
const masterMethods = `
  // ==========================================
  // VIEW: FIRST PAGE – REGISTRATION / ACCOUNT SELECTION FIRST EXPERIENCE
  // ==========================================
  renderWelcomeRegistrationFirstView() {
    const isTa = this.lang === 'ta';
    return \`
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

        <!-- THREE PRIMARY ACCOUNT SELECTION OPTIONS -->
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
    \`;
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

    modalEl.innerHTML = \`
      <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8 space-y-6">
          
          <!-- Close Button -->
          <button onclick="app.closeModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 text-sm font-bold">
            ✕
          </button>

          <!-- Step Progress Indicator -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-slate-500">
              <span class="text-amber-800 font-extrabold uppercase">படி \${step} / 6: \${
                step === 1 ? 'உரிமையாளர் விவரங்கள் (Owner Info)' :
                step === 2 ? 'வணிக விவரங்கள் (Business Info)' :
                step === 3 ? 'தயாரிப்புகள் & சேவைகள் (Products & Services)' :
                step === 4 ? 'கணக்கு வகை & சாப்டர் தேர்வு (Account Type)' :
                step === 5 ? 'ஆவணங்கள் சரிபார்ப்பு (Documents)' : 'மதிப்பாய்வு & உறுதிப்படுத்தல் (Review)'
              }</span>
              <span>\${Math.round((step / 6) * 100)}% நிறைவு</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="bg-amber-500 h-full rounded-full transition-all duration-300" style="width: \${(step / 6) * 100}%"></div>
            </div>
          </div>

          <!-- STEP 1: OWNER INFORMATION -->
          \${step === 1 ? \`
            <div class="space-y-4">
              <h3 class="text-lg font-black text-slate-900 border-b pb-2">படி 1: வணிக உரிமையாளர் விவரங்கள்</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">முழுப் பெயர் (Full Name) *</label>
                  <input type="text" id="reg-owner-name" value="\${d.fullName}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="எ.கா: ஆர். சந்திரா" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">பதவி / பதவிப் பெயர் (Designation)</label>
                  <input type="text" id="reg-owner-desig" value="\${d.designation}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="Managing Director / Owner" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">மொபைல் எண் (Mobile Number) *</label>
                  <input type="tel" id="reg-owner-phone" value="\${d.phone}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="9876543210" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">வாட்ஸ்அப் எண் (WhatsApp Number)</label>
                  <input type="tel" id="reg-owner-whatsapp" value="\${d.whatsapp || d.phone}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="9876543210" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">மின்னஞ்சல் (Email Address)</label>
                  <input type="email" id="reg-owner-email" value="\${d.email}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="chandru@business.com" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">கடவுச்சொல் (Password) *</label>
                  <input type="password" id="reg-owner-pass" value="\${d.password}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="குறைந்தது 6 எழுத்துக்கள்" />
                </div>
              </div>
            </div>
          \` : ''}

          <!-- STEP 2: BUSINESS INFORMATION -->
          \${step === 2 ? \`
            <div class="space-y-4">
              <h3 class="text-lg font-black text-slate-900 border-b pb-2">படி 2: நிறுவன / வணிக விவரங்கள்</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 mb-1">நிறுவனத்தின் பெயர் (Business Name) *</label>
                  <input type="text" id="reg-biz-name" value="\${d.businessName}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="எ.கா: நுவேவா ஸ்டுடியோ (Nuvea Studio)" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">தொழில் பிரிவு (Business Category) *</label>
                  <select id="reg-biz-cat" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold bg-white">
                    \${categories.map(c => \`<option value="\${c.id}" \${d.categoryId === c.id ? 'selected' : ''}>\${c.nameTa} (\${c.nameEn})</option>\`).join('')}
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">துணைப் பிரிவு (Subcategory)</label>
                  <input type="text" id="reg-biz-subcat" value="\${d.subcategory}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="எ.கா: 4K விளம்பரங்கள், சிமெண்ட் டீலர்" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">தொடங்கப்பட்ட ஆண்டு (Year Established)</label>
                  <input type="text" id="reg-biz-year" value="\${d.yearEstablished}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="2020" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">ஜிஎஸ்டி எண் (GST Number - விருப்பத்தேர்வு)</label>
                  <input type="text" id="reg-biz-gst" value="\${d.gstNumber}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="33AAAAA0000A1Z5" />
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 mb-1">வணிக முகவரி (Business Address) *</label>
                  <input type="text" id="reg-biz-addr" value="\${d.address}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="கதவு எண், தெரு, காளியம்மன் கோவில் ரோடு, ஹரூர்" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">தாலுகா (Taluk)</label>
                  <select id="reg-biz-taluk" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold bg-white">
                    <option value="harur" \${d.talukId === 'harur' ? 'selected' : ''}>ஹரூர் (Harur)</option>
                    <option value="palacode" \${d.talukId === 'palacode' ? 'selected' : ''}>பாலக்கோடு (Palacode)</option>
                    <option value="karimangalam" \${d.talukId === 'karimangalam' ? 'selected' : ''}>காரிமங்கலம் (Karimangalam)</option>
                    <option value="dharmapuri_town" \${d.talukId === 'dharmapuri_town' ? 'selected' : ''}>தருமபுரி டவுன் (Dharmapuri Town)</option>
                    <option value="pennagaram" \${d.talukId === 'pennagaram' ? 'selected' : ''}>பெண்ணாகரம் (Pennagaram)</option>
                    <option value="salem" \${d.talukId === 'salem' ? 'selected' : ''}>சேலம் (Salem)</option>
                    <option value="hosur" \${d.talukId === 'hosur' ? 'selected' : ''}>ஓசூர் (Hosur)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">அஞ்சல் குறியீடு (PIN Code)</label>
                  <input type="text" id="reg-biz-pin" value="\${d.pinCode}" class="w-full px-3 py-2 border rounded-xl text-xs font-semibold" placeholder="636903" />
                </div>
              </div>
            </div>
          \` : ''}

          <!-- STEP 3: PRODUCTS & SERVICES -->
          \${step === 3 ? \`
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b pb-2">
                <h3 class="text-lg font-black text-slate-900">படி 3: தயாரிப்புகள் மற்றும் சேவைகள்</h3>
                <button onclick="app.addRegProductService()" class="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs">
                  + தயாரிப்பு / சேவை சேர்
                </button>
              </div>

              <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
                \${d.productsServices.map((p, idx) => \`
                  <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 relative space-y-2">
                    <button onclick="app.removeRegProductService(\${idx})" class="absolute top-2 right-2 text-slate-400 hover:text-red-600 text-xs font-bold">
                      ✕ நீக்கு
                    </button>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div class="sm:col-span-2">
                        <label class="block text-[10px] font-bold text-slate-600">பொருளின் பெயர் / சேவை</label>
                        <input type="text" oninput="app.regData.productsServices[\${idx}].name = this.value" value="\${p.name}" class="w-full px-2.5 py-1.5 border rounded-lg text-xs" />
                      </div>
                      <div>
                        <label class="block text-[10px] font-bold text-slate-600">வகை (Type)</label>
                        <select onchange="app.regData.productsServices[\${idx}].type = this.value" class="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white">
                          <option value="Product" \${p.type === 'Product' ? 'selected' : ''}>தயாரிப்பு (Product)</option>
                          <option value="Service" \${p.type === 'Service' ? 'selected' : ''}>சேவை (Service)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>
          \` : ''}

          <!-- STEP 4: ACCOUNT TYPE & CHAPTER ALLOCATION -->
          \${step === 4 ? \`
            <div class="space-y-4">
              <h3 class="text-lg font-black text-slate-900 border-b pb-2">படி 4: உங்கள் NBN கணக்கு வகை</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label class="p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between \${d.accountType === 'networking_marketplace' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200'}">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <input type="radio" name="accType" value="networking_marketplace" \${d.accountType === 'networking_marketplace' ? 'checked' : ''} onchange="app.regData.accountType = this.value; app.renderMultiStepOwnerModal();" />
                      <span class="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950">OPTION A</span>
                    </div>
                    <div class="text-sm font-black text-slate-900">Networking + Marketplace</div>
                    <p class="text-xs text-slate-600 leading-relaxed">
                      தாலுகா சாப்டர் உறுப்பினர், 100% Category Exclusivity, வாராந்திர மீட்டிங் & மார்க்கெட்பிளேஸ் அணுகல்.
                    </p>
                  </div>
                </label>

                <label class="p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between \${d.accountType === 'marketplace_only' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200'}">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <input type="radio" name="accType" value="marketplace_only" \${d.accountType === 'marketplace_only' ? 'checked' : ''} onchange="app.regData.accountType = this.value; app.renderMultiStepOwnerModal();" />
                      <span class="px-2 py-0.5 rounded text-[10px] font-black bg-slate-900 text-white">OPTION B</span>
                    </div>
                    <div class="text-sm font-black text-slate-900">Marketplace Only</div>
                    <p class="text-xs text-slate-600 leading-relaxed">
                      மார்க்கெட்பிளேஸ் மட்டும். சாப்டர் அர்ப்பணிப்பு, வாராந்திர மீட்டிங் அல்லது Exclusivity உரிமை கிடையாது.
                    </p>
                  </div>
                </label>
              </div>

              \${d.accountType === 'networking_marketplace' ? \`
                <div class="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
                  <div class="text-xs font-black text-amber-900">🏛️ விரும்பும் சாப்டர் தேர்வு & Category Exclusivity சரிபார்ப்பு:</div>
                  <select id="reg-preferred-chap" onchange="app.regData.preferredChapterId = this.value" class="w-full px-3 py-2 border rounded-xl text-xs font-bold bg-white">
                    \${chapters.map(c => \`<option value="\${c.id}" \${d.preferredChapterId === c.id ? 'selected' : ''}>\${c.nameTa} (\${c.talukId})</option>\`).join('')}
                  </select>
                  <div class="text-[11px] text-emerald-800 font-bold">
                    ✓ தேர்ந்தெடுக்கப்பட்ட சாப்டரில் உங்கள் தொழில் பிரிவுக்கான காலி இடம் உடனடியாக சரிபார்க்கப்படும்.
                  </div>
                </div>
              \` : ''}
            </div>
          \` : ''}

          <!-- STEP 5: DOCUMENT VERIFICATION -->
          \${step === 5 ? \`
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
          \` : ''}

          <!-- STEP 6: REVIEW & CONFIRMATION -->
          \${step === 6 ? \`
            <div class="space-y-4">
              <h3 class="text-lg font-black text-slate-900 border-b pb-2">படி 6: விண்ணப்ப மதிப்பாய்வு (Application Review)</h3>
              
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div class="flex justify-between items-center border-b pb-2">
                  <div>
                    <span class="text-slate-500 font-bold">கணக்கு வகை:</span>
                    <strong class="text-slate-900 ml-1">\${d.accountType === 'networking_marketplace' ? 'Option A: Networking + Marketplace' : 'Option B: Marketplace Only'}</strong>
                  </div>
                  <button onclick="app.jumpRegStep(4)" class="text-amber-700 font-bold hover:underline">மாற்று</button>
                </div>

                <div class="flex justify-between items-center border-b pb-2">
                  <div>
                    <span class="text-slate-500 font-bold">உரிமையாளர்:</span>
                    <strong class="text-slate-900 ml-1">\${d.fullName} (\${d.phone})</strong>
                  </div>
                  <button onclick="app.jumpRegStep(1)" class="text-amber-700 font-bold hover:underline">மாற்று</button>
                </div>

                <div class="flex justify-between items-center border-b pb-2">
                  <div>
                    <span class="text-slate-500 font-bold">நிறுவனம்:</span>
                    <strong class="text-slate-900 ml-1">\${d.businessName} (\${d.address || 'தமிழ்நாடு'})</strong>
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
          \` : ''}

          <!-- Modal Navigation Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-100">
            \${step > 1 ? \`
              <button onclick="app.prevRegStep()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
                ⬅️ பின்செல்க (Back)
              </button>
            \` : \`<div></div>\`}

            \${step < 6 ? \`
              <button onclick="app.nextRegStep()" class="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs">
                அடுத்த படி (Next) ➔
              </button>
            \` : \`
              <button onclick="app.submitFullOwnerRegistration()" class="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md">
                🚀 விண்ணப்பத்தை உறுதி செய்து சமர்ப்பி (Submit) ➔
              </button>
            \`}
          </div>

        </div>
      </div>
    \`;
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

      alert(\`வாழ்த்துகள் \${data.user.name}! பதிவு எண் \${data.registrationId} வெற்றிகரமாக உருவாக்கப்பட்டது! உங்கள் டேஷ்போர்டிற்கு வரவேற்கிறோம்.\`);
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
    modalEl.innerHTML = \`
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
    \`;
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
    modalEl.innerHTML = \`
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
                \${(this.db.categories || []).map(c => \`<option value="\${c.id}">\${c.nameTa}</option>\`).join('')}
              </select>
            </div>
          </div>

          <button onclick="app.submitAccountUpgrade()" class="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition">
            🚀 கணக்கை உடனடியாக மேம்படுத்து ➔
          </button>
        </div>
      </div>
    \`;
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
          'Authorization': \`Bearer \${this.token}\`
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
`;

// Insert the masterMethods right before the closing brace of class NBNApp
const classClosePattern = '  }\n}\n\nwindow.app = new NBNApp();';
const classClosePatternAlt = '  }\n}\nwindow.app = new NBNApp();';

if (content.includes(classClosePattern)) {
  content = content.replace(classClosePattern, masterMethods + '\n  }\n}\n\nwindow.app = new NBNApp();');
} else if (content.includes(classClosePatternAlt)) {
  content = content.replace(classClosePatternAlt, masterMethods + '\n  }\n}\nwindow.app = new NBNApp();');
} else {
  console.error('Could not find class closing pattern in app.js!');
  process.exit(1);
}

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('Successfully injected Master User Journey methods into app.js!');
