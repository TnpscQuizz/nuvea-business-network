import React, { useState } from 'react';
import { 
  X, User, Lock, Phone, Building, MapPin, 
  Tag, CheckCircle2, AlertCircle, ArrowRight, Sparkles 
} from 'lucide-react';
import type { BizUser } from '../../../types';

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
  const [signupTaluk, setSignupTaluk] = useState('சேலம் (Salem)');
  const [signupCategory, setSignupCategory] = useState('ஜவுளி & பட்டு');
  const [signupPassword, setSignupPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const categories = [
    'ஜவுளி & பட்டு',
    'வேளாண் இயந்திரங்கள்',
    'தங்கம் & வெள்ளி',
    'இரும்பு & கட்டுமானம்',
    'CNC & ஆட்டோமொபைல்',
    'IT & மென்பொருள் சேவை',
    'உணவு & பால்பண்ணை',
    'லாஜிஸ்டிக்ஸ் & பேக்கிங்',
    'பர்னிச்சர் & இன்டீரியர்'
  ];

  const taluks = [
    'சேலம் (Salem)',
    'தருமபுரி (Dharmapuri)',
    'ஹரூர் (Harur)',
    'ஓமலூர் (Omalur)',
    'ஆத்தூர் (Attur)',
    'மேட்டூர் (Mettur)'
  ];

  // Preset demo accounts for quick testing
  const demoAccounts: BizUser[] = [
    {
      id: 'usr_chandru',
      username: 'chandru_nuvea',
      businessName: 'நுவேவா பிசினஸ் நெட்வொர்க் (Nuvea Hub)',
      ownerName: 'சந்திரசேகர் (Chandru)',
      email: 'chandru@nuvea.in',
      phone: '919842109999',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      taluk: 'சேலம் (Salem)',
      category: 'IT & மென்பொருள் சேவை (Software)',
      bio: '🏢 அதிகாரப்பூர்வ NBN தொழில் நெட்வொர்க் ஹப்',
      locationTag: 'சேலம், தமிழ்நாடு',
      followersCount: 1420,
      followingCount: 380,
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
      contentPreferences: ['ஜவுளி & பட்டு', 'வேளாண் இயந்திரங்கள்', 'IT & மென்பொருள் சேவை'],
    },
    {
      id: 'usr_salem_silks',
      username: 'salem_royal_silks',
      businessName: 'சேலம் ராயல் சில்க்ஸ்',
      ownerName: 'ரமேஷ் குமார் (Ramesh)',
      email: 'ramesh@salemsilks.com',
      phone: '919842100001',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      taluk: 'சேலம் (Salem)',
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
      contentPreferences: ['ஜவுளி & பட்டு', 'லாஜிஸ்டிக்ஸ் & பேக்கிங்'],
    },
    {
      id: 'usr_harur_agro',
      username: 'harur_agro_tech',
      businessName: 'ஹரூர் அக்ரோ டெக் மெஷினரி',
      ownerName: 'முருகேசன் (Murugesan)',
      email: 'murugan@haruragro.com',
      phone: '919842100002',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      taluk: 'ஹரூர் (Harur)',
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
      contentPreferences: ['வேளாண் இயந்திரங்கள்', 'இயற்கை உரம் & அக்ரோ'],
    },
  ];

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanId = signInIdentifier.trim().toLowerCase().replace(/^@/, '');
    
    // Check demo accounts first
    const matched = demoAccounts.find(
      (a) => a.username.toLowerCase() === cleanId || a.phone.includes(cleanId)
    );

    if (matched) {
      onLogin(matched);
      onClose();
      return;
    }

    // Check localStorage registered users
    try {
      const savedUsers: BizUser[] = JSON.parse(localStorage.getItem('nbn_all_biz_users') || '[]');
      const localMatched = savedUsers.find(
        (a) => a.username.toLowerCase() === cleanId || a.phone.includes(cleanId)
      );
      if (localMatched) {
        onLogin(localMatched);
        onClose();
        return;
      }
    } catch {
      // ignore
    }

    // If identifier provided, allow instant sign in with generated profile
    if (cleanId.length >= 3) {
      const newUser: BizUser = {
        id: `usr_${Date.now()}`,
        username: cleanId,
        businessName: `${cleanId.toUpperCase()} Enterprises`,
        ownerName: cleanId,
        email: `${cleanId}@nbn.in`,
        phone: '919842000000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        taluk: 'சேலம் (Salem)',
        category: 'வணிக உறுப்பினர்',
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
        contentPreferences: ['ஜவுளி & பட்டு', 'வேளாண் இயந்திரங்கள்'],
      };
      onLogin(newUser);
      onClose();
      return;
    }

    setErrorMsg('தயவுசெய்து சரியான யூசர்நேம் (@username) அல்லது மொபைல் எண்ணை உள்ளிடவும்.');
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanHandle = signupHandle.trim().toLowerCase().replace(/^@/, '');
    
    // Enforce alphanumeric + underscore (Instagram handle format)
    if (!/^[a-z0-9_]{3,24}$/.test(cleanHandle)) {
      setErrorMsg('யூசர் ஐடி 3 முதல் 24 எழுத்துக்கள், எண்கள் மற்றும் அண்டர்ஸ்கோர் (_) மட்டுமே கொண்டிருக்க வேண்டும்.');
      return;
    }

    if (!signupBizName.trim() || !signupOwnerName.trim()) {
      setErrorMsg('வணிகப் பெயர் மற்றும் உரிமையாளர் பெயரை உள்ளிடவும்.');
      return;
    }

    if (signupPhone.trim().length < 10) {
      setErrorMsg('10 இலக்க மொபைல் எண்ணை உள்ளிடவும் (ஒரு எண்ணிற்கு ஒரு வணிகக் கணக்கு மட்டுமே அனுமதிக்கப்படும்).');
      return;
    }

    const newUser: BizUser = {
      id: `usr_${Date.now()}`,
      username: cleanHandle,
      businessName: signupBizName.trim(),
      ownerName: signupOwnerName.trim(),
      email: `${cleanHandle}@nbn.in`,
      phone: signupPhone.trim(),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      taluk: signupTaluk,
      category: signupCategory,
      bio: `🏢 ${signupBizName} | சரிபார்க்கப்பட்ட B2B உறுப்பினர்`,
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

    // Save to localStorage
    try {
      const existing: BizUser[] = JSON.parse(localStorage.getItem('nbn_all_biz_users') || '[]');
      localStorage.setItem('nbn_all_biz_users', JSON.stringify([...existing, newUser]));
    } catch {
      // ignore
    }

    onLogin(newUser);
    alert(`வாழ்த்துக்கள் @${cleanHandle}! உங்கள் வணிகக் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
              N
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950 leading-none">
                வணிகர் லாகின் & பதிவு
              </h3>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                NBN BizGram • 100% Verified B2B Only
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-black">
          <button
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              mode === 'signin'
                ? 'border-b-2 border-amber-500 text-slate-950 bg-amber-50/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            உள்நுழை (Sign In)
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              mode === 'signup'
                ? 'border-b-2 border-amber-500 text-slate-950 bg-amber-50/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            புதிய ஐடி பதிவு (Sign Up)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">
                  யூசர்நேம் (@username) அல்லது போன் நம்பர்:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="chandru_nuvea"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">
                  பாஸ்வேர்ட் (Password):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>உள்நுழைக (Sign In)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Switch Demo Accounts */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  டெமோ கணக்குகளில் உடனடியாக உள்நுழைய:
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
                      className="w-full p-2 rounded-xl bg-slate-50 hover:bg-amber-100/60 border border-slate-200 transition text-left flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={acc.avatar}
                          alt={acc.username}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <div className="font-mono text-xs font-bold text-slate-900 truncate">
                            @{acc.username}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {acc.businessName}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                        உள்நுழை
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              
              {/* Unique Handle */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">
                  தனித்துவமான இன்ஸ்டா-ஐடி (Unique Username @handle):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="salem_jewels (எழுத்துக்கள், எண், _ மட்டும்)"
                    value={signupHandle}
                    onChange={(e) => setSignupHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  ஒரு வணிகத்திற்கு ஒரு தனித்துவமான ஐடி மட்டுமே உருவாக்க முடியும்.
                </p>
              </div>

              {/* Business Name */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">
                  வணிக / கடையின் பெயர் (Business Name):
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="சேலம் ராயல் சில்க்ஸ்"
                    value={signupBizName}
                    onChange={(e) => setSignupBizName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Owner Name */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">
                  உரிமையாளர் பெயர் (Owner Name):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="ரமேஷ் குமார்"
                    value={signupOwnerName}
                    onChange={(e) => setSignupOwnerName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">
                  மொபைல் எண் (WhatsApp Phone):
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9842100001"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Taluk and Category Row */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-700">
                    தாலுகா:
                  </label>
                  <select
                    value={signupTaluk}
                    onChange={(e) => setSignupTaluk(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    {taluks.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-700">
                    வணிகப் பிரிவு:
                  </label>
                  <select
                    value={signupCategory}
                    onChange={(e) => setSignupCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">
                  ரகசிய கடவுச்சொல் (Password):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Admin Approval Notice */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                <div className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>சூப்பர் அட்மின் தணிக்கை & ஒப்புதல்:</span>
                </div>
                <p className="text-[10px] text-amber-800 leading-normal">
                  நீங்கள் பதிவு செய்த பிறகு உங்கள் கணக்கு மற்றும் புதிய ரீல்ஸ்கள் சூப்பர் அட்மின் ஒப்புதலுக்குப் பிறகே பப்ளிக் எக்ஸ்ப்ளோரில் தெரியும்.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>வணிகர் கணக்கை உருவாக்கு (Sign Up)</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
