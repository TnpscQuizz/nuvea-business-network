import React from 'react';
import { ShoppingCart, Shield, Building2, User, Sparkles, Globe } from 'lucide-react';

interface HeaderProps {
  activePortal: 'gateway' | 'business' | 'user' | 'admin';
  setActivePortal: (portal: 'gateway' | 'business' | 'user' | 'admin') => void;
  cartCount: number;
  openCart: () => void;
  lang: 'ta' | 'en';
  toggleLang: () => void;
  openRegister?: (opt?: 'networking_marketplace' | 'marketplace_only') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePortal,
  setActivePortal,
  cartCount,
  openCart,
  lang,
  toggleLang,
  openRegister,
}) => {
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
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
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
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              activePortal === 'business'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'வணிகர் (Business)' : 'Business Portal'}</span>
          </button>

          <button
            onClick={() => setActivePortal('user')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              activePortal === 'user'
                ? 'bg-emerald-500 text-white font-black shadow-xs'
                : 'text-slate-300 hover:text-emerald-300 hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'வாடிக்கையாளர் (User)' : 'Customer Hub'}</span>
          </button>

          <button
            onClick={() => setActivePortal('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              activePortal === 'admin'
                ? 'bg-rose-600 text-white font-black shadow-xs'
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
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-400/20 transition cursor-pointer"
            >
              <span>🚀</span>
              <span className="hidden sm:inline">{lang === 'ta' ? 'பதிவு செய்க' : 'Register'}</span>
            </button>
          )}

          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-xs font-bold transition shadow-xs"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">கார்ட்</span>
            {cartCount > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-bold transition"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ta' ? 'தமிழ்' : 'EN'}</span>
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
          className={`px-2.5 py-1 rounded-lg ${activePortal === 'user' ? 'bg-emerald-500 text-white font-black' : 'text-slate-400'}`}
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
