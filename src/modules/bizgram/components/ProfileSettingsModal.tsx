import React, { useState } from 'react';
import { 
  X, Shield, Lock, Eye, EyeOff, UserX, MapPin, 
  Camera, Mic, Bell, Users, Volume2, Wifi, 
  Sparkles, CheckCircle2, AlertTriangle, Key, Smartphone 
} from 'lucide-react';
import type { BizUser } from '../../../types';

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
  const [activeTab, setActiveTab] = useState<'privacy' | 'blocked' | 'permissions' | 'media' | 'preferences'>('privacy');
  
  // Local state initialized from currentUser
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivateAccount);
  const [liveLocation, setLiveLocation] = useState(currentUser.liveLocationEnabled);
  const [mediaQuality, setMediaQuality] = useState<'high' | 'data_saver'>(currentUser.mediaUploadQuality);
  const [blockedUsers, setBlockedUsers] = useState<string[]>(currentUser.blockedUsers || []);
  const [newBlockInput, setNewBlockInput] = useState('');
  
  const [permissions, setPermissions] = useState({
    camera: currentUser.devicePermissions?.camera ?? true,
    microphone: currentUser.devicePermissions?.microphone ?? true,
    location: currentUser.devicePermissions?.location ?? true,
    contacts: currentUser.devicePermissions?.contacts ?? true,
    notifications: currentUser.devicePermissions?.notifications ?? true,
    talkBox: currentUser.devicePermissions?.talkBox ?? true,
  });

  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    currentUser.contentPreferences || [
      'Technology',
      'Manufacturing',
      'Retail',
      'Services',
      'Digital',
      'ஜவுளி & பட்டு',
      'வேளாண் இயந்திரங்கள்'
    ]
  );

  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  if (!isOpen) return null;

  const industryOptions = [
    'Technology',
    'Manufacturing',
    'Retail',
    'Services',
    'Digital',
    'ஜவுளி & பட்டு',
    'வேளாண் இயந்திரங்கள்',
    'தங்கம் & வெள்ளி',
    'இரும்பு & கட்டுமானம்',
    'CNC & ஆட்டோமொபைல்',
    'லாஜிஸ்டிக்ஸ் & பேக்கிங்'
  ];

  const handleTogglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTogglePreference = (cat: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleAddBlock = () => {
    const clean = newBlockInput.trim().replace(/^@/, '');
    if (!clean) return;
    if (blockedUsers.includes(clean)) {
      alert('இந்த பயனர் ஏற்கனவே பிளாக் செய்யப்பட்டுள்ளார்!');
      return;
    }
    setBlockedUsers([...blockedUsers, clean]);
    setNewBlockInput('');
  };

  const handleUnblock = (username: string) => {
    setBlockedUsers(blockedUsers.filter((u) => u !== username));
  };

  const handleSaveAllSettings = () => {
    const updated: BizUser = {
      ...currentUser,
      isPrivateAccount: isPrivate,
      liveLocationEnabled: liveLocation,
      mediaUploadQuality: mediaQuality,
      blockedUsers,
      devicePermissions: permissions,
      contentPreferences: selectedPreferences,
    };

    onUpdateUser(updated);
    setShowSavedAlert(true);
    setTimeout(() => {
      setShowSavedAlert(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl select-none font-sans">
      <div className="bg-[#0e1428] rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0a0f20]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white leading-none">
                செக்யூரிட்டி & புரொபைல் செட்டிங்ஸ்
              </h3>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                @{currentUser.username} • Shinegah™ B2B Network Security
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
        <div className="flex items-center border-b border-white/10 px-3 sm:px-6 bg-[#080d1c] overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🔒 தனியுரிமை & பாதுகாப்பு
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'permissions'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📱 டிவைஸ் பர்மிஷன்ஸ்
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'blocked'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🚫 பிளாக் செய்தவை ({blockedUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'media'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🎬 மீடியா தரம்
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            ⭐ தொழில் விருப்பங்கள்
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#080d1c]">
          
          {/* TAB 1: PRIVACY & SECURITY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              
              {/* Public vs Private Account Toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 pr-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-sm text-white">
                        பிரைவேட் அக்கவுண்ட் (Private Business Account)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      ஆன் செய்தால்: உங்கள் மொத்த விலை மற்றும் பிரத்தியேக ரீல்களை நீங்கள் அனுமதிக்கும் சரிபார்க்கப்பட்ட வணிகர்கள் மட்டுமே பார்க்க முடியும்.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`relative w-12 h-6 rounded-full transition cursor-pointer shrink-0 ${
                      isPrivate ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                        isPrivate ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Live Location GPS Sharing Toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 pr-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-sm text-white">
                        லைவ் ஜி.பி.எஸ் லொகேஷன் (Live GPS Location)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      ஆன் செய்தால்: உங்கள் நேரடி மேப் லொகேஷன் வாடிக்கையாளர் விசாரிக்கும்போது தானாகவே பகிரப்படும்.
                    </p>
                  </div>
                  <button
                    onClick={() => setLiveLocation(!liveLocation)}
                    className={`relative w-12 h-6 rounded-full transition cursor-pointer shrink-0 ${
                      liveLocation ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                        liveLocation ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                {liveLocation && (
                  <div className="text-[11px] font-bold text-slate-300 bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>GPS Online: 13.0827° N, 80.2707° E</span>
                    </span>
                    <span className="text-[10px] text-slate-500">துல்லியம்: 5 மீட்டர்</span>
                  </div>
                )}
              </div>

              {/* Two-Factor Authentication Toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-sm text-white">
                      இரு காரணி பாதுகாப்பு (2FA SMS OTP)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    புதிய டிவைஸில் லாகின் செய்யும்போது பதிவு செய்யப்பட்ட எண்ணிற்கு OTP பாதுகாப்பு உறுதிப்படுத்தல் கேட்கும்.
                  </p>
                </div>
                <button
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                  className={`relative w-12 h-6 rounded-full transition cursor-pointer shrink-0 ${
                    twoFactorAuth ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                      twoFactorAuth ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: DEVICE PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-3">
              {[
                { key: 'camera', label: 'கேமரா அனுமதி (Camera)', desc: 'ரீல்ஸ் & தயாரிப்பு வீடியோ எடுக்க', icon: <Camera className="w-4 h-4 text-amber-400" /> },
                { key: 'microphone', label: 'மைக்ரோஃபோன் (Microphone)', desc: 'வாய்ஸ் நோட்ஸ் & ஆடியோ விளக்கம் பேச', icon: <Mic className="w-4 h-4 text-purple-400" /> },
                { key: 'location', label: 'லொகேஷன் சர்வீஸ் (Location)', desc: 'கடை இருப்பிடம் & மேப் காட்ட', icon: <MapPin className="w-4 h-4 text-blue-400" /> },
                { key: 'contacts', label: 'தொடர்புகள் (Contacts)', desc: 'நெட்வொர்க் வணிகர்களை இணைக்க', icon: <Users className="w-4 h-4 text-rose-400" /> },
                { key: 'notifications', label: 'புஷ் நோட்டிபிகேஷன் (Notifications)', desc: 'புதிய விசாரணைகளுக்கு உடனடி அலர்ட்', icon: <Bell className="w-4 h-4 text-cyan-400" /> },
                { key: 'talkBox', label: 'டாக் பாக்ஸ் வாய்ஸ் (TalkBox Audio)', desc: 'அவசர B2B கொட்டேஷன் வருகையில் ஒலி எழுப்ப', icon: <Volume2 className="w-4 h-4 text-emerald-400" /> },
              ].map((item) => (
                <div key={item.key} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTogglePermission(item.key as keyof typeof permissions)}
                    className={`w-11 h-6 rounded-full relative transition cursor-pointer ${
                      permissions[item.key as keyof typeof permissions] ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                        permissions[item.key as keyof typeof permissions] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: BLOCKED ACCOUNTS */}
          {activeTab === 'blocked' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="யூசர் ஐடி சேர்க்கவும் (எ.கா: spam_trader)..."
                  value={newBlockInput}
                  onChange={(e) => setNewBlockInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={handleAddBlock}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
                >
                  <UserX className="w-4 h-4" />
                  <span>Block</span>
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {blockedUsers.length === 0 ? (
                  <div className="p-8 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl text-xs text-slate-500 font-bold">
                    தற்போது பிளாக் செய்யப்பட்ட பயனர்கள் யாரும் இல்லை.
                  </div>
                ) : (
                  blockedUsers.map((handle) => (
                    <div
                      key={handle}
                      className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between"
                    >
                      <span className="font-mono text-xs font-bold text-white">@{handle}</span>
                      <button
                        onClick={() => handleUnblock(handle)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs rounded-lg transition"
                      >
                        Unblock
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA QUALITY */}
          {activeTab === 'media' && (
            <div className="space-y-3">
              <div
                onClick={() => setMediaQuality('high')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  mediaQuality === 'high' ? 'border-blue-500 bg-blue-600/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-white">Full HD 1080p (உயர் தரம்)</div>
                  <div className="text-xs text-slate-400">தயாரிப்பு மற்றும் வீடியோக்கள் மிகத் தெளிவாக தெரியும்.</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  mediaQuality === 'high' ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                }`}>
                  {mediaQuality === 'high' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              <div
                onClick={() => setMediaQuality('data_saver')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  mediaQuality === 'data_saver' ? 'border-blue-500 bg-blue-600/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-white">Data Saver (டேட்டா சேவர்)</div>
                  <div className="text-xs text-slate-400">குறைவான இணைய பயன்பாடுடன் விரைவாக இயங்கும்.</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  mediaQuality === 'data_saver' ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                }`}>
                  {mediaQuality === 'data_saver' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="grid grid-cols-2 gap-2.5">
              {industryOptions.map((ind) => {
                const isChecked = selectedPreferences.includes(ind);
                return (
                  <div
                    key={ind}
                    onClick={() => handleTogglePreference(ind)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'border-blue-500 bg-blue-600/20 text-white font-bold'
                        : 'border-white/10 bg-white/5 text-slate-400'
                    }`}
                  >
                    <span className="text-xs">{ind}</span>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      isChecked ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-600'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0a0f20] flex items-center justify-between">
          <div>
            {showSavedAlert && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>அமைப்புகள் சேமிக்கப்பட்டன!</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAllSettings}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Save Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
