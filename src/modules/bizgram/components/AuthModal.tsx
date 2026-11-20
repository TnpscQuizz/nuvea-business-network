import React, { useState } from 'react';
import { 
  X, User, Lock, Phone, Building, MapPin, 
  Tag, CheckCircle2, AlertCircle, ArrowRight, Sparkles 
} from 'lucide-react';
import type { BizUser } from '../../../types';
import { ShinegahLogo } from './ShinegahLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: BizUser;
  onLogin: (user: BizUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In inputs
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up inputs
  const [signupHandle, setSignupHandle] = useState('');
  const [signupBizName, setSignupBizName] = useState('');
  const [signupOwnerName, setSignupOwnerName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupTaluk, setSignupTaluk] = useState('Chennai');
  const [signupCategory, setSignupCategory] = useState('Technology');
  const [signupPassword, setSignupPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const categories = [
    'Technology',
    'Manufacturing',
    'Retail',
    'Services',
    'Digital',
    'ஜவுளி & பட்டு',
    'வேளாண் இயந்திரங்கள்',
    'தங்கம் & வெள்ளி',
    'இரும்பு & கட்டுமானம்',
    'லாஜிஸ்டிக்ஸ் & பேக்கிங்'
  ];

  const taluks = [
    'Chennai',
    'Salem',
    'Dharmapuri',
    'Coimbatore',
    'Harur',
    'Mettur'
  ];

  // Preset demo accounts for quick testing
  const demoAccounts: BizUser[] = [
    {
      id: 'usr_shinegah',
      username: 'shinegah.in',
      businessName: 'Shinegah™ Business Network',
      ownerName: 'சந்திரசேகர் (Chandru)',
      email: 'connect@shinegah.in',
      phone: '917548820641',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      taluk: 'Chennai',
      category: 'Technology • Business Network',
      bio: 'Empowering Businesses to Grow Together ✨',
      locationTag: 'Chennai, Tamil Nadu',
      followersCount: 12500,
      followingCount: 245,
      postsCount: 24,
      validityDaysLeft: 364,
      isPrivateAccount: false,
      blockedUsers: ['spam_bot_01'],
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
      contentPreferences: ['Technology', 'Manufacturing', 'Digital'],
    },
    {
      id: 'usr_salem_silks',
      username: 'salem_royal_silks',
      businessName: 'சேலம் ராயல் சில்க்ஸ்',
      ownerName: 'ரமேஷ் குமார் (Ramesh)',
      email: 'ramesh@salemsilks.com',
      phone: '919842100001',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      taluk: 'Salem',
      category: 'ஜவுளி & பட்டு',
      bio: '🧵 நேரடி தறி காஞ்சி பட்டு சேலை உற்பத்தியாளர்',
      locationTag: 'சேலம் மெயின் பஜார்',
      followersCount: 890,
      followingCount: 145,
      postsCount: 12,
      validityDaysLeft: 360,
      isPrivateAccount: false,
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
      contentPreferences: ['ஜவுளி & பட்டு', 'Retail'],
    },
    {
      id: 'usr_harur_agro',
      username: 'harur_agro_tech',
      businessName: 'ஹரூர் அக்ரோ டெக் மெஷினரி',
      ownerName: 'முருகேசன் (Murugesan)',
      email: 'murugan@haruragro.com',
      phone: '919842100002',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      taluk: 'Harur',
      category: 'வேளாண் இயந்திரங்கள்',
      bio: '🌾 நவீன விவசாய தானியங்கி அறுவடை இயந்திரங்கள்',
      locationTag: 'ஹரூர் பைபாஸ் ரோடு',
      followersCount: 650,
      followingCount: 95,
      postsCount: 8,
      validityDaysLeft: 355,
      isPrivateAccount: false,
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
      contentPreferences: ['வேளாண் இயந்திரங்கள்', 'Manufacturing'],
    },
  ];

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanId = signInIdentifier.trim().toLowerCase().replace(/^@/, '');
    
    // Check demo accounts
    const matched = demoAccounts.find(
      (a) => a.username.toLowerCase() === cleanId || a.phone.includes(cleanId)
    );

    if (matched) {
      onLogin(matched);
      onClose();
      return;
    }

    // Default auto-login with custom handle
    if (cleanId.length >= 3) {
      const newUser: BizUser = {
        id: `usr_${Date.now()}`,
        username: cleanId,
        businessName: `${cleanId.toUpperCase()} Enterprises`,
        ownerName: cleanId,
        email: `${cleanId}@shinegah.in`,
        phone: '917548820641',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        taluk: 'Chennai',
        category: 'Technology',
        followersCount: 1,
        followingCount: 5,
        postsCount: 0,
        validityDaysLeft: 365,
        isPrivateAccount: false,
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
        contentPreferences: ['Technology', 'Manufacturing'],
      };
      onLogin(newUser);
      onClose();
      return;
    }

    setErrorMsg('தயவுசெய்து சரியான யூசர்நேம் (@username) உள்ளிடவும்.');
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanHandle = signupHandle.trim().toLowerCase().replace(/^@/, '');
    
    if (!/^[a-z0-9_]{3,24}$/.test(cleanHandle)) {
      setErrorMsg('யூசர் ஐடி 3 முதல் 24 எழுத்துக்கள், எண்கள் மற்றும் அண்டர்ஸ்கோர் மட்டுமே கொண்டிருக்க வேண்டும்.');
      return;
    }

    if (!signupBizName.trim() || !signupOwnerName.trim()) {
      setErrorMsg('வணிகப் பெயர் மற்றும் உரிமையாளர் பெயரை உள்ளிடவும்.');
      return;
    }

    if (signupPhone.trim().length < 10) {
      setErrorMsg('10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.');
      return;
    }

    const newUser: BizUser = {
      id: `usr_${Date.now()}`,
      username: cleanHandle,
      businessName: signupBizName.trim(),
      ownerName: signupOwnerName.trim(),
      email: `${cleanHandle}@shinegah.in`,
      phone: signupPhone.trim(),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      taluk: signupTaluk,
      category: signupCategory,
      bio: `🏢 ${signupBizName} | Shinegah Verified B2B Member`,
      locationTag: signupTaluk,
      followersCount: 0,
      followingCount: 1,
      postsCount: 0,
      validityDaysLeft: 365,
      isPrivateAccount: false,
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
      contentPreferences: [signupCategory],
    };

    onLogin(newUser);
    alert(`வாழ்த்துக்கள் @${cleanHandle}! உங்கள் வணிகக் கணக்கு Shinegah-வில் உருவாக்கப்பட்டது.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/35 backdrop-blur-2xl select-none font-sans">
      <div className="apple-glass apple-specular-edge rounded-[36px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/80 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-2.5">
            <ShinegahLogo size="sm" showText={false} />
            <div>
              <h3 className="font-black text-base text-slate-900 leading-none">
                Shinegah™ Enterprise Access
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Connect • Collaborate • Grow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-950 hover:bg-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-white/80 text-xs font-bold bg-white/30">
          <button
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              mode === 'signin'
                ? 'border-b-2 border-slate-950 text-slate-950 font-black bg-white/70'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              mode === 'signup'
                ? 'border-b-2 border-slate-950 text-slate-950 font-black bg-white/70'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up (New ID)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-white/20">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Username (@username) / Phone:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="shinegah.in"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Password:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 apple-btn-primary rounded-xl text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              {/* Quick Switch Demo Accounts */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Quick Switch Accounts:
                </div>
                <div className="space-y-1.5">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        onLogin(acc);
                        onClose();
                      }}
                      className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={acc.avatar}
                          alt={acc.username}
                          className="w-7 h-7 rounded-full object-cover border border-white/20"
                        />
                        <div className="min-w-0">
                          <div className="font-mono text-xs font-bold text-white truncate">
                            @{acc.username}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {acc.businessName}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-black bg-white px-2.5 py-0.5 rounded-full shrink-0 shadow-sm">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Unique Handle (@handle):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="my_company"
                    value={signupHandle}
                    onChange={(e) => setSignupHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Business Name:
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Sri Venkateswara Traders"
                    value={signupBizName}
                    onChange={(e) => setSignupBizName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Owner Name:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="ரமேஷ் குமார்"
                    value={signupOwnerName}
                    onChange={(e) => setSignupOwnerName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  WhatsApp Phone:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9842100001"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">City / Taluk:</label>
                  <select
                    value={signupTaluk}
                    onChange={(e) => setSignupTaluk(e.target.value)}
                    className="w-full p-2 bg-[#0a0f20] border border-white/10 rounded-xl text-xs text-white"
                  >
                    {taluks.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Category:</label>
                  <select
                    value={signupCategory}
                    onChange={(e) => setSignupCategory(e.target.value)}
                    className="w-full p-2 bg-[#0a0f20] border border-white/10 rounded-xl text-xs text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Password:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Create Shinegah Account</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
