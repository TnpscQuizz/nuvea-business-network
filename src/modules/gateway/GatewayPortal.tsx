import React, { useState } from 'react';
import { 
  Briefcase, Store, Users, ArrowRight, PlayCircle, Handshake, 
  BarChart3, ShieldCheck, Zap, CheckCircle2, X, Sparkles,
  Layers, Tag, Check, Award, ArrowUpRight, HelpCircle
} from 'lucide-react';
import heroHandshakeImg from '../../assets/hero-handshake.jpg';

interface GatewayPortalProps {
  onSelectPortal: (portal: 'business' | 'user' | 'admin') => void;
  lang: 'ta' | 'en';
  openRegister?: (opt?: 'networking_marketplace' | 'marketplace_only' | 'customer') => void;
}

export const GatewayPortal: React.FC<GatewayPortalProps> = ({ 
  onSelectPortal, 
  lang, 
  openRegister 
}) => {
  const isTa = lang === 'ta';

  // Interactive Modal States
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col justify-between selection:bg-amber-300 selection:text-slate-900">
      
      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-10 w-full space-y-12 sm:space-y-16">
        
        {/* ========================================================= */}
        {/* HERO SECTION (EXACT MATCH TO DESIGNER MOCKUP)            */}
        {/* ========================================================= */}
        <section id="home" className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Column: Headlines, CTAs, Feature Badges */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            
            {/* Top Subtitle */}
            <div className="inline-block">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                BUSINESS NETWORKING PLATFORM
              </span>
            </div>

            {/* Huge Headline with Brush Underline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-[#0a1128] tracking-tight leading-[1.08]">
              Connect. Refer.<br />
              <span className="relative inline-block mt-1">
                Grow Together.
                {/* Yellow Curved Brush Underline */}
                <svg 
                  className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-amber-400 pointer-events-none" 
                  viewBox="0 0 280 14" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M3 10.5C68 2.5 195 2.5 277 8.5" 
                    stroke="#F59E0B" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                  />
                </svg>
              </span>
            </h1>

            {/* Sub-paragraph */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
              A simple platform to connect business owners, get referrals and grow your business.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => openRegister?.('networking_marketplace')}
                className="px-6 sm:px-7 py-3 sm:py-3.5 bg-[#0a1128] hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-full shadow-lg shadow-slate-900/10 flex items-center gap-2 transition transform hover:scale-[1.02] cursor-pointer"
              >
                <span>Join NBN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowHowItWorks(true)}
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm sm:text-base rounded-full shadow-2xs flex items-center gap-2 transition cursor-pointer"
              >
                <PlayCircle className="w-5 h-5 text-slate-800 shrink-0" />
                <span>See How it Works</span>
              </button>
            </div>

            {/* Feature Pills (Connect, Refer, Grow) */}
            <div className="flex items-center gap-3 sm:gap-4 pt-2 flex-wrap">
              
              {/* Connect Badge */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50/90 rounded-full border border-slate-200/70 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">Connect</span>
              </div>

              {/* Refer Badge */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50/90 rounded-full border border-slate-200/70 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <Handshake className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">Refer</span>
              </div>

              {/* Grow Badge */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50/90 rounded-full border border-slate-200/70 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">Grow</span>
              </div>

            </div>

          </div>

          {/* Right Column: Hero Illustration / Photo with sweeping yellow accent */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] overflow-hidden rounded-bl-[70px] sm:rounded-bl-[90px] shadow-sm">
              <img 
                src={heroHandshakeImg} 
                alt="Two business owners shaking hands warmly - Nuvea Business Network"
                className="w-full h-auto object-cover select-none"
              />
            </div>
          </div>

        </section>


        {/* ========================================================= */}
        {/* CHOOSE YOUR ROLE SECTION (3 CARDS)                        */}
        {/* ========================================================= */}
        <section id="plans" className="pt-4 sm:pt-6 space-y-8">
          
          {/* Section Divider Title: — Choose Your Role — */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-3 sm:gap-5">
              <div className="w-12 sm:w-20 h-[1.5px] bg-slate-300 rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-black text-[#0a1128] tracking-tight">
                Choose Your Role
              </h2>
              <div className="w-12 sm:w-20 h-[1.5px] bg-slate-300 rounded-full" />
            </div>
          </div>

          {/* 3 Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            
            {/* ---------------- CARD 1: BUSINESS OWNER ---------------- */}
            <div className="relative bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300 hover:border-amber-400 shadow-lg shadow-amber-100/50 flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1 group">
              <div>
                {/* Yellow Briefcase Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-[#fffbeb] border border-amber-200/80 text-amber-600 mx-auto flex items-center justify-center mb-4 shadow-inner group-hover:scale-105 transition">
                  <Briefcase className="w-7 h-7 text-amber-600" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-[#0a1128] tracking-tight mb-1.5">
                  Business Owner
                </h3>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6">
                  Network • Get Referrals • Grow
                </p>
              </div>

              {/* Action Button: Join as Business Owner → */}
              <div>
                <button
                  onClick={() => openRegister?.('networking_marketplace')}
                  className="w-full py-3 px-5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black text-sm rounded-full shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Join as Business Owner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="mt-2 text-[11px] text-amber-900 font-black bg-amber-100/90 py-1.5 px-3 rounded-xl border border-amber-300 flex items-center justify-center gap-1.5">
                  <span>⏳</span>
                  <span>1 வருடம் முழு வேலிடிட்டி (1-Year Validity) • கட்டணம் ₹1 மட்டுமே</span>
                </div>
              </div>
            </div>

            {/* ---------------- CARD 2: MARKETPLACE SELLER ---------------- */}
            <div className="relative bg-white rounded-3xl p-6 sm:p-7 border border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-md flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1 group">
              <div>
                {/* Blue Store Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] border border-blue-200/80 text-blue-600 mx-auto flex items-center justify-center mb-4 shadow-inner group-hover:scale-105 transition">
                  <Store className="w-7 h-7 text-blue-600" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-[#0a1128] tracking-tight mb-1.5">
                  Marketplace Seller
                </h3>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6">
                  List Your Products & Services
                </p>
              </div>

              {/* Action Button: Join as Seller → */}
              <div>
                <button
                  onClick={() => openRegister?.('marketplace_only')}
                  className="w-full py-3 px-5 bg-[#eff6ff] hover:bg-blue-100/80 border border-blue-200 text-slate-900 font-bold text-sm rounded-full flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Join as Seller</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="mt-2 text-[11px] text-blue-700/80 font-semibold">
                  Multi-Chapter B2B Sales Hub • Free Onboarding
                </div>
              </div>
            </div>

            {/* ---------------- CARD 3: CUSTOMER / BUYER ---------------- */}
            <div className="relative bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-md flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1 group">
              <div>
                {/* Green Users Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-[#ecfdf5] border border-emerald-200/80 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-inner group-hover:scale-105 transition">
                  <Users className="w-7 h-7 text-emerald-600" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-[#0a1128] tracking-tight mb-1.5">
                  Customer / Buyer
                </h3>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6">
                  Find Trusted Businesses
                </p>
              </div>

              {/* Action Button: Join as Buyer → */}
              <div>
                <button
                  onClick={() => onSelectPortal('user')}
                  className="w-full py-3 px-5 bg-[#ecfdf5] hover:bg-emerald-100/80 border border-emerald-200 text-slate-900 font-bold text-sm rounded-full flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Join as Buyer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="mt-2 text-[11px] text-emerald-700/80 font-semibold">
                  100% Free Access • Compare Verified Quotes
                </div>
              </div>
            </div>

          </div>

        </section>


        {/* ========================================================= */}
        {/* BOTTOM TRUST STRIP                                        */}
        {/* ========================================================= */}
        <section id="success" className="pt-2">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-4 bg-[#f6f5ff] border border-purple-100/90 rounded-2xl sm:rounded-full shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            
            {/* Item 1: Trusted Network */}
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                Trusted Network
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="w-[1.5px] h-6 bg-slate-300/80 hidden sm:block" />

            {/* Item 2: Business Opportunities */}
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-purple-600 shrink-0" />
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                Business Opportunities
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="w-[1.5px] h-6 bg-slate-300/80 hidden sm:block" />

            {/* Item 3: Local Business Community */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Users className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                Local Business Community
              </span>
            </div>

          </div>
        </section>

      </div>


      {/* ========================================================= */}
      {/* BOTTOM DECORATIVE PURPLE GRADIENT WAVE                    */}
      {/* ========================================================= */}
      <div className="w-full overflow-hidden leading-none mt-8">
        <svg 
          className="w-full h-16 sm:h-24 pointer-events-none" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,40 C200,90 420,10 600,60 C800,110 1020,30 1200,70 L1200,120 L0,120 Z" 
            fill="url(#bottom-purple-wave)"
          />
          <defs>
            <linearGradient id="bottom-purple-wave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.55" />
            </linearGradient>
          </defs>
        </svg>
      </div>


      {/* ========================================================= */}
      {/* INTERACTIVE MODAL 1: "HOW IT WORKS" WALKTHROUGH           */}
      {/* ========================================================= */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">How NBN Works</h3>
                <p className="text-xs text-slate-500">3 simple steps to grow your business</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Connect with Category Exclusivity</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Join your local taluk chapter (e.g. Harur, Dharmapuri, Salem). Only 1 business owner is admitted per category — no direct competition inside your chapter!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black flex items-center justify-center shrink-0 text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Exchange Verified Referrals</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Participate in weekly business meetings and structured 1-to-1 discussions to pass and receive high-ticket verified business leads.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Expand on Business Marketplace</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sell products & services across all regional chapters. Respond to buyer RFQs with quotes and close 18% GST verified transactions.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowHowItWorks(false);
                  openRegister?.('networking_marketplace');
                }}
                className="px-6 py-2.5 rounded-full bg-[#0a1128] text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
