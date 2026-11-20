import React, { useState } from 'react';
import { 
  X, Shield, Lock, Eye, EyeOff, UserX, MapPin, 
  Camera, Mic, Bell, Users, Volume2, Wifi, 
  Sparkles, CheckCircle2, AlertTriangle, Key, Smartphone, Globe, 
  FileText, Download, LogOut, CheckCheck, Store 
} from 'lucide-react';
import type { BizUser } from '../../../types';
import { translations, type Language } from '../data/translations';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: BizUser;
  onUpdateUser: (updatedUser: BizUser) => void;
  onLogout?: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'security' | 'verification' | 'notifications' | 'language'>('privacy');
  
  // Local state initialized from currentUser
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivateAccount);
  const [requireFollowApproval, setRequireFollowApproval] = useState(currentUser.requiresFollowApproval ?? true);
  const [chatOnlyApproved, setChatOnlyApproved] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState<string[]>(currentUser.blockedUsers || []);
  const [newBlockInput, setNewBlockInput] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [leadSound, setLeadSound] = useState(true);
  const [whatsappForwarding, setWhatsappForwarding] = useState(true);
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
      requiresFollowApproval: requireFollowApproval,
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
    }, 600);
  };

  const activeSessions = [
    { device: 'iPhone 15 Pro • Safari', location: 'Chennai, TN', ip: '157.48.21.90', isCurrent: true },
    { device: 'MacBook Pro 16" • Chrome', location: 'Salem, TN', ip: '49.207.182.11', isCurrent: false },
    { device: 'iPad Air 5th Gen • App', location: 'Coimbatore, TN', ip: '117.216.54.32', isCurrent: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/35 backdrop-blur-2xl select-none font-sans">
      <div className="apple-glass apple-specular-edge rounded-[38px] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border-2 border-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/80 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 leading-none">
                Corporate Settings & Privacy
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Enterprise security, follower approvals & chat permissions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-950 hover:bg-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 border-b border-white/80 bg-white/30 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer shrink-0 ${
              activeTab === 'privacy' ? 'bg-slate-950 text-white font-extrabold shadow-sm' : 'hover:bg-white/80'
            }`}
          >
            Privacy & Gate
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer shrink-0 ${
              activeTab === 'security' ? 'bg-slate-950 text-white font-extrabold shadow-sm' : 'hover:bg-white/80'
            }`}
          >
            Security & Sessions
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer shrink-0 ${
              activeTab === 'verification' ? 'bg-slate-950 text-white font-extrabold shadow-sm' : 'hover:bg-white/80'
            }`}
          >
            GSTIN & Legal
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer shrink-0 ${
              activeTab === 'notifications' ? 'bg-slate-950 text-white font-extrabold shadow-sm' : 'hover:bg-white/80'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('language')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer shrink-0 ${
              activeTab === 'language' ? 'bg-slate-950 text-white font-extrabold shadow-sm' : 'hover:bg-white/80'
            }`}
          >
            Language / மொழி
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* TAB 1: PRIVACY & FOLLOWER GATE */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      Require Follower Approval (Instagram Style)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      When enabled, businesses must send a request and wait for your approval before following.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequireFollowApproval(!requireFollowApproval)}
                    className={`w-12 h-6 rounded-full transition cursor-pointer p-0.5 ${
                      requireFollowApproval ? 'bg-slate-950' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      requireFollowApproval ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60">
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      Chat Gate: Approved Followers Only
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Mandate acceptance of follow request before unlocking direct messaging and GST quotation requests.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChatOnlyApproved(!chatOnlyApproved)}
                    className={`w-12 h-6 rounded-full transition cursor-pointer p-0.5 ${
                      chatOnlyApproved ? 'bg-slate-950' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      chatOnlyApproved ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60">
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      Private Wholesale Pricing
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Hide wholesale pricing from unverified accounts.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`w-12 h-6 rounded-full transition cursor-pointer p-0.5 ${
                      isPrivate ? 'bg-slate-950' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isPrivate ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Blocked Accounts Section */}
              <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3 shadow-sm">
                <span className="font-extrabold text-xs text-slate-900 block">
                  Blocked Competitors / Accounts
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter @handle to block..."
                    value={newBlockInput}
                    onChange={(e) => setNewBlockInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                  />
                  <button
                    onClick={handleAddBlock}
                    className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-black transition cursor-pointer"
                  >
                    Block
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {blockedUsers.length === 0 ? (
                    <span className="text-[11px] text-slate-400">No blocked accounts.</span>
                  ) : (
                    blockedUsers.map((user) => (
                      <span
                        key={user}
                        className="px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-mono flex items-center gap-1.5"
                      >
                        <span>@{user}</span>
                        <button
                          onClick={() => handleUnblock(user)}
                          className="text-slate-500 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & SESSIONS */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      Two-Factor Authentication (2FA)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Require OTP verification on mobile phone during login.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                    className={`w-12 h-6 rounded-full transition cursor-pointer p-0.5 ${
                      twoFactorAuth ? 'bg-slate-950' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      twoFactorAuth ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3 shadow-sm">
                <span className="font-extrabold text-xs text-slate-900 block">
                  Active Login Devices & Sessions
                </span>
                <div className="space-y-2">
                  {activeSessions.map((session, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{session.device}</span>
                          {session.isCurrent && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-black">
                              Current Device
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {session.location} • {session.ip}
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <button
                          onClick={() => alert('Terminated remote session successfully.')}
                          className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GSTIN & LEGAL */}
          {activeTab === 'verification' && (
            <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3.5 shadow-sm text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  Verified B2B Enterprise Credentials
                </h4>
              </div>
              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-bold">Trade Name:</span>
                  <span className="font-mono">{currentUser.businessName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-bold">GSTIN Number:</span>
                  <span className="font-mono text-emerald-700 font-bold">{currentUser.gstin || '33AABCS1429B1Z2'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-bold">Tax Category:</span>
                  <span>SAC Code 998314 (B2B Services & Networking)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-bold">KYC Status:</span>
                  <span className="text-emerald-700 font-black">Level 3 Enterprise Verified ✅</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3.5 shadow-sm text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900">Lead Sound Alert</div>
                  <div className="text-[11px] text-slate-500">Play chime when new B2B quotation enquiry arrives.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setLeadSound(!leadSound)}
                  className={`w-12 h-6 rounded-full transition cursor-pointer p-0.5 ${
                    leadSound ? 'bg-slate-950' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    leadSound ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <div className="font-extrabold text-slate-900">WhatsApp Lead Mirroring</div>
                  <div className="text-[11px] text-slate-500">Instantly forward inquiries to registered WhatsApp number.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsappForwarding(!whatsappForwarding)}
                  className={`w-12 h-6 rounded-full transition cursor-pointer p-0.5 ${
                    whatsappForwarding ? 'bg-slate-950' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    whatsappForwarding ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: LANGUAGE */}
          {activeTab === 'language' && (
            <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                    UI Language
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Choose English or தமிழ்.
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200">
                  <button
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer ${
                      lang === 'en' ? 'bg-slate-950 text-white' : 'text-slate-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLang('ta')}
                    className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer ${
                      lang === 'ta' ? 'bg-slate-950 text-white' : 'text-slate-600'
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Actions: Logout */}
          {onLogout && (
            <div className="pt-2 border-t border-white/80">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center gap-2 border border-rose-200 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Shinegah Business Portal</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/80 bg-white/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:text-slate-950 hover:bg-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAllSettings}
            className="px-6 py-2.5 rounded-full bg-slate-950 text-white text-xs font-extrabold hover:bg-black transition cursor-pointer shadow-md"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};
