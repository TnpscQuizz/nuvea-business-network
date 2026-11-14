import React, { useState } from 'react';
import { 
  ShoppingCart, Shield, Building2, User, Sparkles, Globe, 
  Home, Layers, Tag, BarChart3, ArrowRight, X, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface HeaderProps {
  activePortal: 'gateway' | 'business' | 'user' | 'admin';
  setActivePortal: (portal: 'gateway' | 'business' | 'user' | 'admin') => void;
  cartCount: number;
  openCart: () => void;
  lang: 'ta' | 'en';
  toggleLang: () => void;
  openRegister?: (opt?: 'networking_marketplace' | 'marketplace_only' | 'customer') => void;
  openLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePortal,
  setActivePortal,
  cartCount,
  openCart,
  lang,
  toggleLang,
  openRegister,
  openLogin,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Smooth scroll handler for Gateway sections
  const handleScrollTo = (id: string) => {
    if (activePortal !== 'gateway') {
      setActivePortal('gateway');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // =========================================================================
  // GATEWAY NAVBAR (EXACT MATCH TO DESIGNER MOCKUP: media_1794638452805_8a52b747.jpg)
  // =========================================================================
  if (activePortal === 'gateway') {
    return (
      <>
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
            
            {/* Left Brand: Yellow 'N' Squircle + NBN + Nuvea Business Network */}
            <div 
              onClick={() => handleScrollTo('home')} 
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm group-hover:scale-105 transition">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl text-slate-950 tracking-tight leading-none">
                  NBN
                </span>
                <span className="text-[11px] text-slate-600 font-semibold tracking-tight mt-0.5">
                  Nuvea Business Network
                </span>
              </div>
            </div>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-2">
              
              {/* Home Pill (Active Amber Pill) */}
              <button
                onClick={() => handleScrollTo('home')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-300 hover:bg-amber-400 text-slate-950 font-bold rounded-full text-xs shadow-xs transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-slate-950" />
                <span>Home</span>
              </button>

              {/* How it Works */}
              <button
                onClick={() => handleScrollTo('home')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-slate-700 hover:text-slate-950 font-semibold text-xs rounded-full hover:bg-slate-100/70 transition cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                <span>How it Works</span>
              </button>

              {/* Plans */}
              <button
                onClick={() => handleScrollTo('plans')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-slate-700 hover:text-slate-950 font-semibold text-xs rounded-full hover:bg-slate-100/70 transition cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-slate-600" />
                <span>Plans</span>
              </button>

              {/* Success */}
              <button
                onClick={() => handleScrollTo('success')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-slate-700 hover:text-slate-950 font-semibold text-xs rounded-full hover:bg-slate-100/70 transition cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
                <span>Success</span>
              </button>

            </nav>

            {/* Right Action Buttons: Login + Get Started → */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              
              {/* Login Button (Outline Pill) */}
              <button
                onClick={() => openLogin ? openLogin() : setIsLoginModalOpen(true)}
                className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                Login
              </button>

              {/* Get Started Button (Dark Navy Pill with Arrow) */}
              <button
                onClick={() => openRegister?.('networking_marketplace')}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#0a1128] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition transform hover:scale-[1.02] cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>
        </header>

        {/* QUICK PORTAL ACCESS / LOGIN MODAL */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
              
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl">
                  N
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    NBN Portal Login
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    உள்நுழைய விரும்பும் போர்ட்டலைத் தேர்வு செய்யவும்
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                
                {/* 1. Business Owner Portal */}
                <button
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setActivePortal('business');
                  }}
                  className="w-full p-3.5 rounded-2xl border-2 border-purple-200 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 flex items-center justify-between text-left transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 group-hover:text-purple-700">
                        வணிகர் போர்டல் (Business Member)
                      </div>
                      <div className="text-xs text-slate-500">
                        நுவேவா ஸ்டுடியோ • சந்திரா (Chandru)
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
                </button>

                {/* 2. Customer Marketplace */}
                <button
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setActivePortal('user');
                  }}
                  className="w-full p-3.5 rounded-2xl border-2 border-indigo-200 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 flex items-center justify-between text-left transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 group-hover:text-indigo-700">
                        வாடிக்கையாளர் சந்தை (Customer Hub)
                      </div>
                      <div className="text-xs text-slate-500">
                        ரமேஷ் குமார் (Ramesh Kumar - Buyer)
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                </button>

                {/* 3. Super Admin Console */}
                <button
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setActivePortal('admin');
                  }}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-800 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 group-hover:text-slate-950">
                        அட்மின் கண்ட்ரோல் சென்டர் (Admin)
                      </div>
                      <div className="text-xs text-slate-500">
                        Central Administration & Analytics
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition" />
                </button>

              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>புதிய கணக்கு இல்லையா?</span>
                <button
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    openRegister?.('networking_marketplace');
                  }}
                  className="font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                >
                  பதிவு செய்க (Pay ₹1) ➔
                </button>
              </div>

            </div>
          </div>
        )}
      </>
    );
  }

  // =========================================================================
  // APP NAVBAR FOR BUSINESS, USER & OTHER VIEWS (MATCHES PREVIOUS APPROVED STYLE)
  // =========================================================================
  return (
    <header className="sticky top-0 z-50 bg-slate-950 text-white border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActivePortal('gateway')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md group-hover:scale-105 transition">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white tracking-tight">
                Nuvea <span className="text-amber-400">Business Network</span>
              </span>
              <span className="bg-slate-900 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded border border-slate-800 uppercase">
                React 19
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold hidden sm:block">
              CONNECT • REFER • GROW • தருமபுரி & சேலம்
            </p>
          </div>
        </div>

        {/* Modular Portal Switcher Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActivePortal('gateway')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activePortal === 'gateway'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'முகப்பு (Gateway)' : 'Gateway'}</span>
          </button>

          <button
            onClick={() => setActivePortal('business')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activePortal === 'business'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-purple-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'வணிகர் (Business)' : 'Business Portal'}</span>
          </button>

          <button
            onClick={() => setActivePortal('user')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activePortal === 'user'
                ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-indigo-300 hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'வாடிக்கையாளர் (User)' : 'Customer Hub'}</span>
          </button>

          <button
            onClick={() => setActivePortal('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activePortal === 'admin'
                ? 'bg-rose-600 text-white font-black shadow-md shadow-rose-600/30'
                : 'text-slate-300 hover:text-rose-300 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'அட்மின் (Admin)' : 'Admin Console'}</span>
          </button>
        </nav>

        {/* Right Actions: Register, Cart & Language Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {openRegister && (
            <button
              onClick={() => openRegister('networking_marketplace')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-400/20 transition cursor-pointer"
            >
              <span>✏️</span>
              <span className="hidden sm:inline">{lang === 'ta' ? 'பதிவு செய்க' : 'Register'}</span>
            </button>
          )}

          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">{lang === 'ta' ? 'கார்ட்' : 'Cart'}</span>
            {cartCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-bold transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{lang === 'ta' ? 'தமிழ் ⌄' : 'EN ⌄'}</span>
          </button>
        </div>

      </div>

      {/* Mobile Portal Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2 px-2 text-xs font-bold bg-slate-900">
        <button
          onClick={() => setActivePortal('gateway')}
          className={`px-2.5 py-1 rounded-lg ${activePortal === 'gateway' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400'}`}
        >
          ✨ முகப்பு
        </button>
        <button
          onClick={() => setActivePortal('business')}
          className={`px-2.5 py-1 rounded-lg ${activePortal === 'business' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400'}`}
        >
          🏢 வணிகர்
        </button>
        <button
          onClick={() => setActivePortal('user')}
          className={`px-2.5 py-1 rounded-lg ${activePortal === 'user' ? 'bg-indigo-500 text-white font-black' : 'text-slate-400'}`}
        >
          👤 வாடிக்கையாளர்
        </button>
        <button
          onClick={() => setActivePortal('admin')}
          className={`px-2.5 py-1 rounded-lg ${activePortal === 'admin' ? 'bg-rose-600 text-white font-black' : 'text-slate-400'}`}
        >
          🛡️ அட்மின்
        </button>
      </div>
    </header>
  );
};
