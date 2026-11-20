import React, { useState } from 'react';
import { 
  X, Shield, Lock, Eye, EyeOff, UserX, MapPin, 
  Camera, Mic, Bell, Users, Volume2, Wifi, 
  Sparkles, CheckCircle2, AlertTriangle, Key, Smartphone, Globe 
} from 'lucide-react';
import type { BizUser } from '../../../types';
import { translations, type Language } from '../data/translations';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: BizUser;
  onUpdateUser: (updatedUser: BizUser) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'blocked' | 'permissions' | 'language'>('privacy');
  
  // Local state initialized from currentUser
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivateAccount);
  const [blockedUsers, setBlockedUsers] = useState<string[]>(currentUser.blockedUsers || []);
  const [newBlockInput, setNewBlockInput] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [showSavedAlert, setShowSavedAlert] = useState(false);
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('nbn_biz_lang') as Language) || 'en';
  });

  const [permissions, setPermissions] = useState({
    camera: currentUser.devicePermissions?.camera ?? true,
    microphone: currentUser.devicePermissions?.microphone ?? true,
    location: currentUser.devicePermissions?.location ?? true,
    notifications: currentUser.devicePermissions?.notifications ?? true,
  });

  if (!isOpen) return null;

  const handleTogglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddBlock = () => {
    const clean = newBlockInput.trim().replace(/^@/, '');
    if (!clean) return;
    if (blockedUsers.includes(clean)) {
      alert('This user is already in your blocked list.');
      return;
    }
    setBlockedUsers([...blockedUsers, clean]);
    setNewBlockInput('');
  };

  const handleUnblock = (username: string) => {
    setBlockedUsers(blockedUsers.filter((u) => u !== username));
  };

  const handleSaveAllSettings = () => {
    localStorage.setItem('nbn_biz_lang', lang);
    const updated: BizUser = {
      ...currentUser,
      isPrivateAccount: isPrivate,
      blockedUsers,
      devicePermissions: {
        ...currentUser.devicePermissions,
        ...permissions,
      },
    };

    onUpdateUser(updated);
    setShowSavedAlert(true);
    setTimeout(() => {
      setShowSavedAlert(false);
      onClose();
      window.location.reload();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl select-none font-sans">
      <div className="apple-glass apple-specular-edge rounded-[36px] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white leading-none">
                Security & Settings
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                @{currentUser.username} • Corporate Network Controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-white/10 px-4 bg-white/[0.01] overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-white text-white font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Privacy & 2FA
          </button>
          <button
            onClick={() => setActiveTab('language')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'language'
                ? 'border-white text-white font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Language / மொழி
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'blocked'
                ? 'border-white text-white font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Blocked ({blockedUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'permissions'
                ? 'border-white text-white font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Permissions
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: PRIVACY & 2FA */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-white">
                    {isPrivate ? 'Private Corporate Account' : 'Public Corporate Account'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isPrivate ? 'Catalog visible only to approved business connections' : 'Catalog discoverable by all verified network buyers'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`w-12 h-6 rounded-full transition cursor-pointer relative p-0.5 border ${
                    isPrivate ? 'bg-white border-white' : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      isPrivate ? 'bg-black translate-x-6' : 'bg-white translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-white">Two-Factor Authentication (2FA)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Protect your account with OTP sign-in verification</div>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                  className={`w-12 h-6 rounded-full transition cursor-pointer relative p-0.5 border ${
                    twoFactorAuth ? 'bg-white border-white' : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      twoFactorAuth ? 'bg-black translate-x-6' : 'bg-white translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LANGUAGE (ENGLISH ⇄ TAMIL AS REQUESTED) */}
          {activeTab === 'language' && (
            <div className="space-y-3">
              <div className="font-extrabold text-xs sm:text-sm text-white">App Interface Language</div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`py-3.5 px-4 rounded-2xl font-black text-xs transition cursor-pointer border flex items-center justify-center gap-2 ${
                    lang === 'en'
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  <span>English (Default)</span>
                  {lang === 'en' && <CheckCircle2 className="w-4 h-4 text-black" />}
                </button>

                <button
                  type="button"
                  onClick={() => setLang('ta')}
                  className={`py-3.5 px-4 rounded-2xl font-black text-xs transition cursor-pointer border flex items-center justify-center gap-2 ${
                    lang === 'ta'
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  <span>தமிழ் (Tamil)</span>
                  {lang === 'ta' && <CheckCircle2 className="w-4 h-4 text-black" />}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BLOCKED ACCOUNTS */}
          {activeTab === 'blocked' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter username to block..."
                  value={newBlockInput}
                  onChange={(e) => setNewBlockInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white"
                />
                <button
                  type="button"
                  onClick={handleAddBlock}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition cursor-pointer"
                >
                  Block
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {blockedUsers.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-6">No blocked accounts</div>
                ) : (
                  blockedUsers.map((u) => (
                    <div key={u} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                      <span className="text-slate-200 font-mono">@{u}</span>
                      <button
                        type="button"
                        onClick={() => handleUnblock(u)}
                        className="text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        Unblock
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-3">
              {(Object.keys(permissions) as (keyof typeof permissions)[]).map((key) => (
                <div key={key} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div className="font-bold text-xs text-white capitalize">{key} Access</div>
                  <button
                    type="button"
                    onClick={() => handleTogglePermission(key)}
                    className={`w-10 h-5 rounded-full transition cursor-pointer relative p-0.5 border ${
                      permissions[key] ? 'bg-white border-white' : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        permissions[key] ? 'bg-black translate-x-5' : 'bg-white translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          {showSavedAlert ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings saved!</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">All changes apply instantly</span>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAllSettings}
              className="px-5 py-2 apple-btn-primary rounded-xl text-xs font-black transition cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
