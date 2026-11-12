const fs = require('fs');

const appJsPath = 'C:/Users/chand/.gemini/antigravity/scratch/nuvea-business-network/public/js/app.js';
let content = fs.readFileSync(appJsPath, 'utf8');

// Find renderHomeView return `
const target = `    return \`
      <div class="space-y-8 max-w-6xl mx-auto">`;

const replacement = `    return \`
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
        </div>`;

if (!content.includes(target)) {
  console.error('Target renderHomeView string not found!');
  process.exit(1);
}

content = content.replace(target, replacement);

// Add selectPortalMode method if not exists
if (!content.includes('selectPortalMode(')) {
  const methodTarget = '  onHomeSearchInput(query) {';
  const newMethod = `  selectPortalMode(mode) {
    if (mode === 'marketplace') {
      this.setTab('marketplace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.setTab('home');
      const scanner = document.getElementById('master-search-section') || document.getElementById('chapter-vacancy-scanner');
      if (scanner) {
        scanner.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  onHomeSearchInput(query) {`;
  content = content.replace(methodTarget, newMethod);
}

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('Successfully added Frontpage Dual Gateway for NBN Networking & NBN Business Marketplace!');
