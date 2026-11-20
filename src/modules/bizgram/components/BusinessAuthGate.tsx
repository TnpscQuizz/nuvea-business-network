import React, { useState } from 'react';
import { 
  Building2, User, Phone, MapPin, Tag, Lock, ArrowRight, 
  CheckCircle2, Sparkles, ShieldCheck, FileCheck, Layers, 
  ChevronRight, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import type { BizUser } from '../../../types';
import { ShinegahLogo } from './ShinegahLogo';
import { translations, type Language } from '../data/translations';

interface BusinessAuthGateProps {
  lang?: Language;
  onAuthenticated: (user: BizUser) => void;
}

export const BusinessAuthGate: React.FC<BusinessAuthGateProps> = ({
  lang = 'en',
  onAuthenticated,
}) => {
  const t = translations[lang] || translations.en;
  const [tab, setTab] = useState<'register' | 'login'>('register');
  
  // Registration Form State
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Manufacturing');
  const [district, setDistrict] = useState('Chennai');
  const [gstin, setGstin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('shinegah.in');
  const [loginPassword, setLoginPassword] = useState('user123');

  const categories = [
    'Manufacturing',
    'Technology & Software',
    'Textiles & Handloom Silk',
    'CNC Machining & Automotive',
    'Building Materials & Steel',
    'Agricultural Machinery',
    'Jewellery & Precious Metals',
    'Food Processing & FMCG',
    'Retail & Distribution',
    'Logistics & Packaging',
    'Digital Media & Marketing',
    'Healthcare & Pharmaceuticals'
  ];

  const districts = [
    'Chennai', 
    'Salem', 
    'Coimbatore', 
    'Dharmapuri', 
    'Erode', 
    'Tirupur', 
    'Madurai', 
    'Trichy', 
    'Namakkal', 
    'Hosur', 
    'Harur'
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!businessName.trim() || !ownerName.trim() || !username.trim() || !phone.trim() || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');
    const cleanPhone = phone.trim().replace(/\D/g, '');

    const newUser: BizUser = {
      id: `usr_${Date.now()}`,
      username: cleanUsername,
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      email: `${cleanUsername}@business.in`,
      phone: cleanPhone || '917548820641',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      taluk: district,
      category,
      bio: `${businessName.trim()} | Verified B2B Trade & Manufacturing. Connecting across Tamil Nadu.`,
      locationTag: `${district}, Tamil Nadu`,
      gstin: gstin.trim().toUpperCase() || '33AABCS1429B1Z2',
      followersCount: 1,
      followingCount: 12,
      postsCount: 0,
      validityDaysLeft: 365,
      isPrivateAccount: false,
      requiresFollowApproval: true,
      approvedConnections: ['shinegah.in', 'salem_royal_silks'],
      followRequests: [],
      outlets: [
        {
          id: `out_${Date.now()}`,
          name: `${businessName.trim()} - Main Outlet`,
          address: `Industrial Estate, ${district} - 600001`,
          phone: cleanPhone || '+91 94432 10987',
          timing: '09:00 AM - 08:00 PM (Mon-Sat)',
          isPrimary: true,
          district,
        }
      ],
      blockedUsers: [],
      liveLocationEnabled: true,
      mediaUploadQuality: 'high',
      devicePermissions: {
        camera: true,
        microphone: true,
        location: true,
        contacts: true,
        notifications: true,
        talkBox: true,
      },
      contentPreferences: [category, 'Manufacturing', 'Technology'],
    };

    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated(newUser);
    }, 600);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your business username or phone number.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Demo accounts or custom
      const idClean = loginIdentifier.trim().toLowerCase();
      if (idClean.includes('salem')) {
        onAuthenticated({
          id: 'usr_salem_silks',
          username: 'salem_royal_silks',
          businessName: 'Salem Royal Silk Weaving Mills',
          ownerName: 'Ramesh Kumar',
          email: 'ramesh@salemsilks.com',
          phone: '919443210001',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          coverUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
          taluk: 'Salem',
          category: 'Textiles & Handloom Silk',
          bio: 'Direct Manufacturer of Pure Zari Kanchipuram & Salem Silk Sarees. Wholesale export.',
          locationTag: 'Salem, Tamil Nadu',
          gstin: '33AABCS8899Z1Z4',
          followersCount: 8420,
          followingCount: 198,
          postsCount: 18,
          validityDaysLeft: 310,
          isPrivateAccount: false,
          requiresFollowApproval: true,
          approvedConnections: ['shinegah.in', 'sri_venkateswara_traders'],
          followRequests: [],
          outlets: [
            {
              id: 'out_salem_1',
              name: 'Salem Flagship Weaving Unit',
              address: '14, Main Road, Shevapet, Salem - 636002',
              phone: '+91 94432 10001',
              timing: '09:00 AM - 09:00 PM',
              isPrimary: true,
              district: 'Salem',
            }
          ],
          blockedUsers: [],
          liveLocationEnabled: true,
          mediaUploadQuality: 'high',
          devicePermissions: {
            camera: true,
            microphone: true,
            location: true,
            contacts: true,
            notifications: true,
            talkBox: true,
          },
          contentPreferences: ['Textiles & Silk', 'Manufacturing'],
        });
      } else {
        // Default Shinegah
        onAuthenticated({
          id: 'usr_shinegah',
          username: 'shinegah.in',
          businessName: 'Shinegah™ Enterprise Network',
          ownerName: 'Chandru S',
          email: 'connect@shinegah.in',
          phone: '917548820641',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          taluk: 'Chennai',
          category: 'Technology • Enterprise Network • Innovation',
          bio: 'Empowering Businesses to Grow Together ✨ | The Next-Gen Business Social Network | Verified B2B Trade Infrastructure',
          locationTag: 'Chennai, Tamil Nadu',
          website: 'https://shinegah.in',
          gstin: '33AABCS1429B1Z2',
          followersCount: 12500,
          followingCount: 245,
          postsCount: 24,
          validityDaysLeft: 364,
          isPrivateAccount: false,
          requiresFollowApproval: true,
          approvedConnections: ['salem_royal_silks', 'sri_venkateswara_traders', 'kongu_agro'],
          followRequests: [
            {
              id: 'req_coimbatore_cnc',
              username: 'coimbatore_precision_cnc',
              businessName: 'Coimbatore Precision CNC Tools',
              avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&q=80',
              category: 'CNC Machining & Tooling',
              requestedAt: '12m ago',
            },
            {
              id: 'req_erode_handloom',
              username: 'erode_weaver_coop',
              businessName: 'Erode Handloom Weavers Federation',
              avatar: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80',
              category: 'Textiles & Handloom Silk',
              requestedAt: '1h ago',
            }
          ],
          outlets: [
            {
              id: 'out_1',
              name: 'Corporate HQ & Innovation Lab',
              address: 'Plot 42, OMR IT Expressway, Taramani, Chennai - 600113',
              phone: '+91 75488 20641',
              timing: '09:00 AM - 07:00 PM (Mon-Sat)',
              isPrimary: true,
              district: 'Chennai',
            },
            {
              id: 'out_2',
              name: 'Western Hub & Enterprise Center',
              address: '14, Fort Main Road, Salem Bazaar, Salem - 636001',
              phone: '+91 94432 10987',
              timing: '09:30 AM - 08:30 PM (Mon-Sat)',
              isPrimary: false,
              district: 'Salem',
            }
          ],
          blockedUsers: ['spam_trader_01'],
          liveLocationEnabled: true,
          mediaUploadQuality: 'high',
          devicePermissions: {
            camera: true,
            microphone: true,
            location: true,
            contacts: true,
            notifications: true,
            talkBox: true,
          },
          contentPreferences: ['Technology', 'Manufacturing', 'Retail'],
        });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans">
      
      {/* Radiant Ambient Light Orbs for Pure White Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[650px] h-[650px] bg-white rounded-full blur-[140px] opacity-95 pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[700px] h-[700px] bg-white rounded-full blur-[150px] opacity-95 pointer-events-none" />
      <div className="fixed top-[40%] left-[30%] w-[500px] h-[500px] bg-slate-100 rounded-full blur-[120px] opacity-80 pointer-events-none" />

      {/* Main Glass Card Container */}
      <div className="relative z-10 w-full max-w-xl apple-glass apple-specular-edge rounded-[40px] overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.08),0_0_50px_rgba(255,255,255,1)] border-2 border-white p-6 sm:p-10 space-y-7">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="scale-110 drop-shadow-sm">
            <ShinegahLogo size="md" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shinegah™ Business Gateway
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mt-1">
              The Next-Gen Business Social Network. All enterprise owners must register or sign in to enter the portal.
            </p>
          </div>
        </div>

        {/* Tab Segment Switcher (Apple White Glow Glass Pill) */}
        <div className="p-1 rounded-full bg-white/70 border border-white shadow-inner flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'register'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Business Registration</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'login'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Member Sign In</span>
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. REGISTRATION FORM                                                      */}
        {/* ========================================================================= */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Business Trade Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                <span>Business Trade Name *</span>
                <span className="text-[10px] text-slate-500 font-normal">Official Brand</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Venkateswara Steels & Alloys"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
                />
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Owner Name + Username Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Owner / Director Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Chandru S"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Business Handle (@handle) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="venkateswara_steels"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 shadow-sm"
                  />
                  <span className="text-xs font-black text-slate-400 absolute left-4 top-1/2 -translate-y-1/2">@</span>
                </div>
              </div>
            </div>

            {/* Mobile / WhatsApp + GSTIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Phone / WhatsApp *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="917548820641"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 shadow-sm"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                  <span>GSTIN (Verified B2B)</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Recommended</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="33AABCS1429B1Z2"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 shadow-sm"
                  />
                  <FileCheck className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Category + District Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm text-slate-900 shadow-sm cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  District / Location *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm text-slate-900 shadow-sm cursor-pointer"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-700 absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Register Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full bg-slate-950 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(15,23,42,0.15)] hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Register Business & Enter Shinegah</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* 2. SIGN IN FORM                                                           */}
        {/* ========================================================================= */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800">
                Business Username, Phone or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. shinegah.in or 917548820641"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800">
                  Password
                </label>
                <span className="text-[11px] text-slate-500 font-semibold hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-700 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full bg-slate-950 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(15,23,42,0.15)] hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Business Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick 1-Click Demo Accounts */}
            <div className="pt-4 border-t border-white/80 space-y-2.5">
              <span className="text-[11px] text-slate-500 font-bold block text-center uppercase tracking-wider">
                Quick 1-Click Demo Logins
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('shinegah.in');
                    setLoginPassword('user123');
                    handleLogin({ preventDefault: () => {} } as any);
                  }}
                  className="p-3 rounded-2xl bg-white/85 hover:bg-white border border-white flex items-center gap-2.5 text-left transition cursor-pointer shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    S
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold text-slate-900 truncate">Shinegah™ Enterprise</div>
                    <div className="text-[10px] text-slate-500 truncate">@shinegah.in • Chennai</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('salem_royal_silks');
                    setLoginPassword('user123');
                    handleLogin({ preventDefault: () => {} } as any);
                  }}
                  className="p-3 rounded-2xl bg-white/85 hover:bg-white border border-white flex items-center gap-2.5 text-left transition cursor-pointer shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    R
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold text-slate-900 truncate">Salem Royal Silks</div>
                    <div className="text-[10px] text-slate-500 truncate">@salem_royal_silks • Salem</div>
                  </div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Bottom Trust Footer */}
        <div className="pt-4 border-t border-white/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit Encrypted B2B Network</span>
          </div>
          <span>NBN Shinegah v3.5</span>
        </div>

      </div>

    </div>
  );
};
