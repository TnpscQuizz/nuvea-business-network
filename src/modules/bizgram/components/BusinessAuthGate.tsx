import React, { useState, useEffect } from 'react';
import { 
  Building2, User, Phone, MapPin, Tag, Lock, ArrowRight, 
  CheckCircle2, Sparkles, ShieldCheck, FileCheck, Layers, 
  ChevronRight, AlertCircle, Eye, EyeOff, Clock, Shield, 
  RefreshCw, Check, X, ExternalLink
} from 'lucide-react';
import type { BizUser } from '../../../types';
import { ShinegahLogo } from './ShinegahLogo';
import { translations, type Language } from '../data/translations';
import { INITIAL_REGISTERED_USERS } from '../data/bizGramData';

interface BusinessAuthGateProps {
  lang?: Language;
  onAuthenticated: (user: BizUser) => void;
  onOpenSuperAdmin?: () => void;
}

export const BusinessAuthGate: React.FC<BusinessAuthGateProps> = ({
  lang = 'en',
  onAuthenticated,
  onOpenSuperAdmin,
}) => {
  const t = translations[lang] || translations.en;
  const [tab, setTab] = useState<'register' | 'login'>('register');

  // Registered Users Registry in LocalStorage
  const [registeredUsers, setRegisteredUsers] = useState<BizUser[]>(() => {
    try {
      const saved = localStorage.getItem('nbn_registered_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_REGISTERED_USERS;
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });

  // Pending Super Admin Approval User state (If set, displays waiting screen!)
  const [pendingUser, setPendingUser] = useState<BizUser | null>(null);
  const [checkStatusFeedback, setCheckStatusFeedback] = useState<{ type: 'pending' | 'approved' | 'rejected'; msg: string } | null>(null);
  
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

  // Save registered users whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('nbn_registered_users', JSON.stringify(registeredUsers));
    } catch {}
  }, [registeredUsers]);

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

  // Handle New Business Registration
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
    const ticketId = `SHN-VER-${Math.floor(10000 + Math.random() * 90000)}`;

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
      bio: `${businessName.trim()} | Verified B2B Trade & Manufacturing. Registered on Shinegah Network.`,
      locationTag: `${district}, Tamil Nadu`,
      gstin: gstin.trim().toUpperCase() || '33AABCS1429B1Z2',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      validityDaysLeft: 365,
      verificationStatus: 'pending', // MUST WAIT FOR SUPER ADMIN APPROVAL!
      verificationTicket: ticketId,
      registeredAt: 'Just now',
      isPrivateAccount: false,
      requiresFollowApproval: true,
      approvedConnections: ['shinegah.in'],
      followRequests: [],
      outlets: [
        {
          id: `out_${Date.now()}`,
          name: `${businessName.trim()} - Main Unit`,
          address: `Industrial Sector, ${district} - 600001`,
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

    // Save to registered users list
    const updated = [newUser, ...registeredUsers];
    setRegisteredUsers(updated);
    try {
      localStorage.setItem('nbn_registered_users', JSON.stringify(updated));
    } catch {}

    setTimeout(() => {
      setIsLoading(false);
      // USER MUST WAIT FOR ADMIN APPROVAL - DISPLAY PENDING VERIFICATION SCREEN!
      setPendingUser(newUser);
    }, 700);
  };

  // Handle Login Attempt
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
      const idClean = loginIdentifier.trim().toLowerCase();

      // Find user in registered registry
      const foundUser = registeredUsers.find(
        (u) =>
          u.username.toLowerCase() === idClean ||
          u.phone.replace(/\D/g, '') === idClean.replace(/\D/g, '') ||
          u.email.toLowerCase() === idClean
      );

      if (foundUser) {
        const status = foundUser.verificationStatus || 'approved';

        if (status === 'pending') {
          // If pending, user must wait for admin approval!
          setPendingUser(foundUser);
          return;
        }

        if (status === 'rejected') {
          setErrorMsg('Your business registration was reviewed and rejected by Super Admin. Please contact admin hotline for assistance.');
          return;
        }

        // Approved -> Enter App!
        onAuthenticated(foundUser);
        return;
      }

      // Default demo fallbacks if username contains 'salem' or 'shinegah'
      if (idClean.includes('salem')) {
        const salemUser = registeredUsers.find((u) => u.username === 'salem_royal_silks') || INITIAL_REGISTERED_USERS[1];
        onAuthenticated(salemUser);
      } else {
        const shinegahUser = registeredUsers.find((u) => u.username === 'shinegah.in') || INITIAL_REGISTERED_USERS[0];
        onAuthenticated(shinegahUser);
      }
    }, 500);
  };

  // Live Refresh Approval Status from localStorage
  const handleCheckApprovalStatus = () => {
    if (!pendingUser) return;

    try {
      const saved = localStorage.getItem('nbn_registered_users');
      if (saved) {
        const currentList: BizUser[] = JSON.parse(saved);
        const freshUser = currentList.find((u) => u.id === pendingUser.id || u.username === pendingUser.username);

        if (freshUser) {
          const freshStatus = freshUser.verificationStatus || 'pending';
          
          if (freshStatus === 'approved') {
            setCheckStatusFeedback({
              type: 'approved',
              msg: '🎉 Congratulations! Your business profile has been approved by Super Admin!',
            });
            setTimeout(() => {
              onAuthenticated(freshUser);
            }, 1200);
            return;
          }

          if (freshStatus === 'rejected') {
            setCheckStatusFeedback({
              type: 'rejected',
              msg: 'Your application was rejected by Super Admin. Reason: Compliance / Incomplete credentials.',
            });
            return;
          }
        }
      }
    } catch {}

    setCheckStatusFeedback({
      type: 'pending',
      msg: 'Status: Still Pending Review by Super Admin. (Tip: You can click "Open Super Admin Portal" below to approve this profile right now!)',
    });
  };

  // =========================================================================
  // VIEW: WAITING FOR SUPER ADMIN APPROVAL (MANDATORY GATE REQUESTED BY USER)
  // =========================================================================
  if (pendingUser) {
    return (
      <div className="min-h-screen white-glow-canvas flex flex-col justify-center items-center p-4 sm:p-6 select-none font-sans relative">
        
        {/* Radiant Ambient Light Orbs with Minute Shinegah Aura */}
        <div className="fixed top-[-10%] left-[-10%] w-[550px] h-[550px] bg-gradient-to-br from-blue-600/10 via-indigo-600/08 to-transparent rounded-full blur-[150px] pointer-events-none" />
        <div className="fixed top-10 left-1/3 w-[600px] h-[600px] bg-white rounded-full blur-[140px] opacity-95 pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-gradient-to-tr from-amber-500/10 via-orange-500/08 to-transparent rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl apple-glass apple-specular-edge rounded-[38px] overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.1),0_0_50px_rgba(255,255,255,1)] border-2 border-white p-6 sm:p-10 space-y-6 bg-white/95 text-center">
          
          {/* Glowing Hourglass & Verification Badge */}
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-400 text-amber-600 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10 relative">
            <Clock className="w-10 h-10 animate-pulse text-amber-600" />
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-slate-950 text-white shadow-md">
              <Shield className="w-4 h-4 text-amber-300" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider inline-block">
              ⏳ AWAITING SUPER ADMIN APPROVAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Business Registration Under Review
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your profile has been submitted to Shinegah™ Super Admin. To prevent brokers and ensure verified wholesale trade, an admin must approve your profile before you can access the platform.
            </p>
          </div>

          {/* Application Details Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Verification Ticket #:</span>
              <span className="font-mono font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {pendingUser.verificationTicket || 'SHN-VER-94821'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">Business Name</span>
                <span className="font-black text-slate-900 text-sm">{pendingUser.businessName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Owner / Director</span>
                <span className="font-extrabold text-slate-900 text-sm">{pendingUser.ownerName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Category</span>
                <span className="font-bold text-slate-800">{pendingUser.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">District / Location</span>
                <span className="font-bold text-slate-800">{pendingUser.taluk}, Tamil Nadu</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">GSTIN / Tax ID</span>
                <span className="font-mono font-bold text-slate-800">{pendingUser.gstin || '33AABCS1429B1Z2'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Mobile</span>
                <span className="font-mono font-bold text-slate-800">{pendingUser.phone}</span>
              </div>
            </div>
          </div>

          {/* 3-Milestone Verification Roadmap */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-left">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Verification Milestones
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1. Registration Dossier Submitted</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                <span>2. GSTIN & Corporate Entity Audit (In Progress)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-medium">
                <Lock className="w-4 h-4" />
                <span>3. Super Admin Approval & Trade Feed Activation</span>
              </div>
            </div>
          </div>

          {/* Feedback Message if checked */}
          {checkStatusFeedback && (
            <div className={`p-3 rounded-2xl text-xs font-bold text-left flex items-start gap-2 ${
              checkStatusFeedback.type === 'approved'
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                : checkStatusFeedback.type === 'rejected'
                ? 'bg-rose-50 border border-rose-300 text-rose-800'
                : 'bg-amber-50 border border-amber-300 text-amber-800'
            }`}>
              {checkStatusFeedback.type === 'approved' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{checkStatusFeedback.msg}</span>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleCheckApprovalStatus}
              className="w-full py-3.5 bg-slate-950 hover:bg-black text-white rounded-full text-xs font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Check Approval Status</span>
            </button>

            {/* Quick Link to Super Admin Console (For instant demo testing!) */}
            {onOpenSuperAdmin && (
              <button
                type="button"
                onClick={onOpenSuperAdmin}
                className="w-full py-3 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Open Super Admin Portal to Approve This Profile</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setPendingUser(null);
                setTab('login');
              }}
              className="text-xs text-slate-500 hover:text-slate-900 font-bold transition cursor-pointer pt-1"
            >
              ← Back to Sign In / Switch Account
            </button>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW: REGISTRATION & LOGIN FORM
  // =========================================================================
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans">
      
      {/* Radiant Ambient Light Orbs with Minute Shinegah Aura */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-600/10 via-purple-600/08 to-transparent rounded-full blur-[150px] opacity-95 pointer-events-none" />
      <div className="fixed top-[-5%] left-1/4 w-[650px] h-[650px] bg-white rounded-full blur-[140px] opacity-95 pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[650px] h-[650px] bg-gradient-to-tr from-amber-500/12 via-orange-500/08 to-transparent rounded-full blur-[160px] opacity-95 pointer-events-none" />
      <div className="fixed top-[40%] left-[30%] w-[500px] h-[500px] bg-slate-100 rounded-full blur-[120px] opacity-80 pointer-events-none" />

      {/* Main Glass Card Container */}
      <div className="relative z-10 w-full max-w-xl apple-glass apple-specular-edge rounded-[40px] overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.08),0_0_50px_rgba(255,255,255,1)] border-2 border-white p-6 sm:p-10 space-y-7 bg-white/90">
        
        {/* Top Super Admin Portal Button */}
        {onOpenSuperAdmin && (
          <div className="flex justify-end -mt-2 -mr-2">
            <button
              onClick={onOpenSuperAdmin}
              className="px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-[11px] font-black flex items-center gap-1.5 shadow-sm hover:bg-black transition cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Super Admin Portal</span>
            </button>
          </div>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <ShinegahLogo size="lg" />
          
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-slate-950 text-white text-[10px] font-mono font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Verified B2B Enterprise Portal</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {tab === 'register' ? 'Register Your Business Profile' : 'Business Account Sign In'}
            </h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {tab === 'register' 
                ? 'Join 2,000+ verified manufacturers, wholesalers & enterprise leaders across Tamil Nadu.' 
                : 'Access your verified B2B network, CRM leads, wholesale store & consignment orders.'}
            </p>
          </div>
        </div>

        {/* Segmented Switcher (Register / Sign In) */}
        <div className="p-1 rounded-2xl bg-white/80 border border-slate-200 grid grid-cols-2 gap-1 text-xs font-black shadow-sm">
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'register'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <span>Register Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'login'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <span>Sign In</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. REGISTRATION FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Company / Business Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kongu Precision Tools"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span>Managing Director / Owner *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Unique Handle (@username) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">@</span>
                  <input
                    type="text"
                    required
                    placeholder="kongu_tools"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Official Mobile Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="919842100000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-600" />
                  <span>Industry Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span>District / Headquarter</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>GSTIN / Business Registration Number</span>
              </label>
              <input
                type="text"
                placeholder="33AABCS1429B1Z2 (Optional)"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Set Password *</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Confirm Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Super Admin Verification Required</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                After submission, your account will enter the Super Admin Review Queue. You will wait until an administrator approves your profile before accessing feed, reels, and marketplace tools.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-950 hover:bg-black text-white rounded-full text-xs font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Registering Profile & Submitting for Verification...</span>
              ) : (
                <>
                  <span>Submit Profile for Super Admin Approval</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. SIGN IN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Business Username, Mobile or Email
              </label>
              <input
                type="text"
                required
                placeholder="e.g. shinegah.in / 917548820641"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            {/* Quick 1-Click Demo Accounts */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Instant Demo Account Logins:
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('shinegah.in');
                    setLoginPassword('user123');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-900 text-xs font-extrabold text-slate-900 shadow-sm cursor-pointer transition"
                >
                  @shinegah.in (Approved HQ)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('salem_royal_silks');
                    setLoginPassword('user123');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-900 text-xs font-extrabold text-slate-900 shadow-sm cursor-pointer transition"
                >
                  @salem_royal_silks (Approved)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('coimbatore_precision_forgings');
                    setLoginPassword('user123');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 hover:border-amber-900 text-xs font-extrabold text-amber-900 shadow-sm cursor-pointer transition"
                >
                  @coimbatore_forgings (Pending Approval)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-950 hover:bg-black text-white rounded-full text-xs font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying Account Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Network</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
