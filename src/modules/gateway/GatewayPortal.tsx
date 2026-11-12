import React from 'react';
import { Sparkles, Building, ShoppingBag, Lock, Handshake, Video, Store, Zap, CheckCircle2 } from 'lucide-react';

interface GatewayPortalProps {
  onSelectPortal: (portal: 'business' | 'user' | 'admin') => void;
  lang: 'ta' | 'en';
  openRegister?: (opt?: 'networking_marketplace' | 'marketplace_only' | 'customer') => void;
}

export const GatewayPortal: React.FC<GatewayPortalProps> = ({ onSelectPortal, lang, openRegister }) => {
  const isTa = lang === 'ta';

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      
      {/* HERO BANNER */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800 text-center overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>NBN Official Onboarding Portal • React Edition</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            WELCOME TO NBN <br />
            <span className="text-amber-400">NUVEA BUSINESS NETWORK</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 font-medium">
            "Choose how you want to grow your business with NBN."
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 text-xs text-slate-400 font-bold">
            <span>CONNECT • REFER • GROW</span>
            <span>•</span>
            <span className="text-amber-300/90">தருமபுரி & சேலம் மண்டல தொழில் நெட்வொர்க்</span>
          </div>
        </div>
      </div>

      {/* DUAL MASTER GATEWAY SELECTION (NBN NETWORKING vs NBN BUSINESS MARKETPLACE) */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-black uppercase tracking-wider border border-slate-800">
            <span>⚡ PRIMARY CHOICE • முதன்மை தேர்வு</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isTa ? 'எந்த முறையில் இணைய விரும்புகிறீர்கள்?' : 'Select Your Growth Gateway'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {isTa
              ? 'NBN வழங்கும் இரண்டு முக்கிய தளங்களில் உங்கள் வணிகத்திற்கான சரியான விருப்பத்தைத் தேர்வு செய்யுங்கள்'
              : 'Choose between Exclusive Chapter Networking or Multi-Chapter Marketplace'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* OPTION 1: NBN NETWORKING (சாப்டர் நெட்வொர்க்கிங்) */}
          <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 rounded-3xl p-7 sm:p-9 text-white shadow-xl border-2 border-amber-400/80 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl font-black shadow-lg shadow-amber-400/30">
                  🏛️
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider">
                  ★ BNI-INSPIRED CHAPTER MODEL
                </span>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-widest text-amber-400">
                  விருப்பம் 1 • PRIMARY GATEWAY
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                  NBN நெட்வொர்க்கிங் <br />
                  <span className="text-amber-400 text-xl sm:text-2xl font-bold">(NBN Networking)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-2 leading-relaxed">
                  {isTa
                    ? 'தாலுகா அளவிலான பிரத்யேக வணிக சாப்டர். உங்கள் தொழில் பிரிவில் உங்களுக்கு மட்டுமே 100% பிரத்யேக ஏகபோக சீட் (Category Exclusivity) மற்றும் வாராந்திர நேரடி வணிகப் பரிந்துரைகள்.'
                    : 'Taluk-level chapter networking with 100% Category Exclusivity seat per business category, weekly business meetings and verified referral exchange.'}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>100% Category Exclusivity:</strong> உங்கள் தாலுகா சாப்டரில் உங்கள் தொழில் பிரிவுக்கு நீங்கள் மட்டுமே ஒரே உறுப்பினர் (போட்டி இல்லை).
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Handshake className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>வாராந்திர நேரடி சந்திப்பு:</strong> வாராந்திர காலை மீட்டிங், 1-to-1 விவாதங்கள் மற்றும் வணிகப் பரிந்துரைகள் பரிமாற்றம்.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Video className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Nuvea Studio 4K Branding:</strong> வணிகர்களுக்கான பிரத்தியேக வீடியோ விளம்பரம் & மார்க்கெட்பிளேஸ் முழு அணுகல்.
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 space-y-2.5">
              {openRegister && (
                <button
                  onClick={() => openRegister('networking_marketplace')}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-400/20 transition-all transform group-hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🚀 புதிய உறுப்பினர் பதிவு (Register with Razorpay ₹1,500 INR) ➔</span>
                </button>
              )}
              <button
                onClick={() => onSelectPortal('business')}
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700/80 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>NBN நெட்வொர்க்கிங் போர்டல் திறக்க (Open Business Portal)</span>
              </button>
            </div>
          </div>

          {/* OPTION 2: NBN BUSINESS MARKETPLACE (பிசினஸ் மார்க்கெட் பிளேஸ்) */}
          <div className="relative bg-gradient-to-br from-slate-900 via-brand-950 to-blue-950 rounded-3xl p-7 sm:p-9 text-white shadow-xl border-2 border-blue-400/60 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/30">
                  🛒
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/40 text-xs font-black uppercase tracking-wider">
                  ⚡ MULTI-CHAPTER COMMERCE HUB
                </span>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-widest text-blue-400">
                  விருப்பம் 2 • PRIMARY GATEWAY
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                  NBN பிசினஸ் மார்க்கெட் பிளேஸ் <br />
                  <span className="text-blue-400 text-xl sm:text-2xl font-bold">(NBN Business Marketplace)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-2 leading-relaxed">
                  {isTa
                    ? 'தயாரிப்புகள் மற்றும் சேவைகளுக்கான நேரடி வர்த்தக சந்தை. வாடிக்கையாளர்கள் தேவைகளை சமர்ப்பிக்கலாம்; விற்பனையாளர்கள் கொட்டேஷன் அனுப்பி நேரடி ஆர்டர்களைப் பெறலாம்.'
                    : 'Direct business marketplace for buying and selling products & services. Post requirements, submit competitive quotes, and manage orders with 18% GST billing.'}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <Store className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>விற்பனையாளர் ஸ்டோர் (Seller Store):</strong> பொருட்கள் மற்றும் சேவைகளை பட்டியலிட்டு ஆன்லைன் ஆர்டர்களை பெறலாம்.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>வாடிக்கையாளர் தேவைகள் & நேரடி கொட்டேஷன்:</strong> வாடிக்கையாளர்கள் பதிவிடும் தேவைகளுக்கு நேரடியாக விலைப் புள்ளி அனுப்பலாம்.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>வாடிக்கையாளர் & பையர் தளம்:</strong> தருமபுரி & சேலம் சப்ளையர்களிடம் சிறந்த விலையில் வாங்க 18% GST பில்லிங்.
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 space-y-2.5">
              {openRegister && (
                <button
                  onClick={() => openRegister('marketplace_only')}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all transform group-hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📦 விற்பனையாளர் பதிவு (Free Seller Onboarding) ➔</span>
                </button>
              )}
              <button
                onClick={() => onSelectPortal('user')}
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700/80 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>மார்க்கெட்பிளேஸ் போர்டல் திறக்க (Open Marketplace)</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3 TIERS BREAKDOWN CARDS */}
      <div className="pt-4 border-t border-slate-200">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">DETAILED ACCOUNT SECTIONS</span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">3 முதன்மை கணக்கு வகைகள்</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* OPTION A */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl">
                🏛️
              </div>
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">OPTION A</span>
              <h4 className="text-lg font-black text-slate-900">Business Owner: Networking + Marketplace</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                தாலுகா சாப்டர் ஏகபோக சீட், வாராந்திர மீட்டிங் மற்றும் மார்க்கெட்பிளேஸ் முழு அணுகல்.
              </p>
            </div>
            <div className="space-y-2">
              {openRegister && (
                <button
                  onClick={() => openRegister('networking_marketplace')}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition cursor-pointer"
                >
                  🚀 பதிவு செய்க (₹1,500 INR மட்டும் தான்) ➔
                </button>
              )}
              <button
                onClick={() => onSelectPortal('business')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                வணிகர் போர்டல் செல்ல
              </button>
            </div>
          </div>

          {/* OPTION B */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center text-2xl">
                🛒
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">OPTION B</span>
              <h4 className="text-lg font-black text-slate-900">Business Owner: Marketplace Only</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                சாப்டர் மீட்டிங் கட்டாயம் இன்றி, தயாரிப்புகள் மற்றும் சேவைகளை மார்க்கெட்பிளேஸில் மட்டும் விற்கலாம்.
              </p>
            </div>
            <div className="space-y-2">
              {openRegister && (
                <button
                  onClick={() => openRegister('marketplace_only')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow transition cursor-pointer"
                >
                  📦 விற்பனையாளர் பதிவு (இலவசம்) ➔
                </button>
              )}
              <button
                onClick={() => onSelectPortal('business')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                செல்லர் மையம் செல்ல
              </button>
            </div>
          </div>

          {/* OPTION C */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl">
                👤
              </div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">OPTION C</span>
              <h4 className="text-lg font-black text-slate-900">Customer & Buyer</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                சரிபார்க்கப்பட்ட நிறுவனங்களிடம் பொருட்கள் வாங்கவும், மொத்த தேவைகளுக்கு கொட்டேஷன் பெறவும்.
              </p>
            </div>
            <button
              onClick={() => onSelectPortal('user')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition cursor-pointer"
            >
              வாடிக்கையாளர் போர்டல் செல்ல ➔
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
