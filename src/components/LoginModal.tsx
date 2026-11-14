import React, { useState } from 'react';
import { 
  X, Lock, User, Building2, Shield, ArrowRight, AlertCircle, 
  CheckCircle2, Sparkles, KeyRound, Phone
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ta' | 'en';
  onLoginSuccess: (userData: any, targetPortal: 'business' | 'user' | 'admin', businessId?: string) => void;
  onOpenRegister?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLoginSuccess,
  onOpenRegister
}) => {
  const isTa = lang === 'ta';
  const [role, setRole] = useState<'business' | 'user' | 'admin'>('business');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('பயனர் பெயர் அல்லது மொபைல் எண் உள்ளிடவும் (Username/Phone required)');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('கடவுச்சொல் உள்ளிடவும் (Password required)');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password: password.trim() })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'உள்நுழைவு தோல்வியடைந்தது. விவரங்களை சரிபார்க்கவும்.');
      }

      setLoading(false);
      onLoginSuccess(data.user, role, data.businessId);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'உள்நுழைவு தோல்வி');
    }
  };

  // Quick 1-Click Demo Login Shortcuts for Convenience
  const handleQuickDemoLogin = (targetRole: 'business' | 'user' | 'admin', demoUser: string, demoPass: string, defaultBizId?: string) => {
    setIdentifier(demoUser);
    setPassword(demoPass);
    setRole(targetRole);
    setLoading(true);
    setErrorMsg('');

    fetch('/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: targetRole === 'admin' ? 'super_admin' : (targetRole === 'business' ? 'member' : 'customer') })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        onLoginSuccess(data.user, targetRole, defaultBizId || 'biz_001');
        onClose();
      })
      .catch(() => {
        setLoading(false);
        onLoginSuccess({ name: demoUser, role: targetRole }, targetRole, defaultBizId || 'biz_001');
        onClose();
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
              N
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white leading-tight">
                NBN போர்டல் உள்நுழைவு (Login)
              </h3>
              <p className="text-xs text-slate-400">
                உங்கள் பயனர் பெயர் & கடவுச்சொல் மூலம் நுழையவும்
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs (Business Owner / Customer / Admin) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('business')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              role === 'business'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>வணிகர் (Owner)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              role === 'user'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>வாடிக்கையாளர்</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              role === 'admin'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>அட்மின்</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 px-5 py-2.5 flex items-center gap-2 text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Username / Phone Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>பயனர் பெயர் / மொபைல் எண் (Username or Mobile Phone) *</span>
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="எ.கா. chandru அல்லது 917548820641"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>கடவுச்சொல் (Password) *</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-400/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>டேஷ்போர்டில் நுழைக (Enter Dashboard)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Login One-Click Buttons */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 text-center">
              ⚡ விரைவு சோதனை உள்நுழைவு (1-Click Demo Logins):
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('business', 'chandru', 'password123', 'biz_001')}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition text-left cursor-pointer"
              >
                🏢 சந்திரா (Nuvea)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user', 'ramesh', 'password123')}
                className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition text-left cursor-pointer"
              >
                🛒 ரமேஷ் (Customer)
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="text-center pt-2 text-xs text-slate-600">
            <span>புதிய வணிகரா? </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRegister?.();
              }}
              className="font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
            >
              இப்போதே ₹1 செலுத்தி பதிவு செய்க ➔
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
