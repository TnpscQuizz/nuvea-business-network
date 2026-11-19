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
      'ஜவுளி & பட்டு',
      'வேளாண் இயந்திரங்கள்',
      'தங்கம் & வெள்ளி',
      'இரும்பு & கட்டுமானம்',
      'CNC & ஆட்டோமொபைல்',
      'IT & மென்பொருள் சேவை'
    ]
  );

  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  if (!isOpen) return null;

  const industryOptions = [
    'ஜவுளி & பட்டு',
    'வேளாண் இயந்திரங்கள்',
    'தங்கம் & வெள்ளி',
    'இரும்பு & கட்டுமானம்',
    'CNC & ஆட்டோமொபைல்',
    'IT & மென்பொருள் சேவை',
    'உணவு & பால்பண்ணை',
    'லாஜிஸ்டிக்ஸ் & பேக்கிங்',
    'பர்னிச்சர் & இன்டீரியர்',
    'இயற்கை உரம் & அக்ரோ'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-950 leading-none">
                செக்யூரிட்டி & புரொபைல் செட்டிங்ஸ்
              </h3>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                @{currentUser.username} • பாதுகாப்பான B2B வணிக நெட்வொர்க்
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-3 sm:px-6 bg-white overflow-x-auto scrollbar-none text-xs font-black">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔒 தனியுரிமை & பாதுகாப்பு
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'permissions'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📱 டிவைஸ் பர்மிஷன்ஸ்
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'blocked'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🚫 பிளாக் செய்தவை ({blockedUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'media'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🎬 மீடியா தரம்
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ⭐ கன்டென்ட் விருப்பங்கள்
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: PRIVACY & SECURITY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              
              {/* Public vs Private Account Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 pr-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-700" />
                      <span className="font-black text-sm text-slate-900">
                        பிரைவேட் அக்கவுண்ட் (Private Business Account)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      ஆன் செய்தால்: உங்கள் மொத்த விலை (Wholesale Rates) மற்றும் புதிய ரீல்களை நீங்கள் அனுமதிக்கும் சரிபார்க்கப்பட்ட வணிகர்கள் மட்டுமே பார்க்க முடியும்.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`relative w-12 h-6 rounded-full transition cursor-pointer shrink-0 ${
                      isPrivate ? 'bg-amber-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                        isPrivate ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <div className="text-[11px] font-bold text-amber-700 bg-amber-50 p-2 rounded-xl">
                  {isPrivate 
                    ? '🔒 கணக்கு பிரைவேட் பயன்முறையில் உள்ளது (அங்கீகரிக்கப்பட்ட வணிகர்களுக்கு மட்டும்).'
                    : '🌐 கணக்கு பப்ளிக் பயன்முறையில் உள்ளது (அனைத்து B2B வர்த்தகர்களும் பார்க்க முடியும்).'}
                </div>
              </div>

              {/* Live Location GPS Sharing Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 pr-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span className="font-black text-sm text-slate-900">
                        லைவ் ஜி.பி.எஸ் லொகேஷன் (Live GPS Location)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      ஆன் செய்தால்: உங்கள் தொழிற்சாலை / கடையின் நேரடி மேப் லொகேஷன் வாடிக்கையாளர் விசாரிக்கும்போது தானாகவே பகிரப்படும்.
                    </p>
                  </div>
                  <button
                    onClick={() => setLiveLocation(!liveLocation)}
                    className={`relative w-12 h-6 rounded-full transition cursor-pointer shrink-0 ${
                      liveLocation ? 'bg-amber-500' : 'bg-slate-300'
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
                  <div className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 p-2.5 rounded-xl flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>லைவ் ஜி.பி.எஸ் இயங்குகிறது: 11.6643° N, 78.1460° E</span>
                    </span>
                    <span className="text-[10px] text-slate-400">துல்லியம்: 5 மீட்டர்</span>
                  </div>
                )}
              </div>

              {/* Two-Factor Authentication Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-purple-600" />
                    <span className="font-black text-sm text-slate-900">
                      இரு காரணி பாதுகாப்பு (2FA SMS OTP)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    புதிய மொபைல் அல்லது கம்ப்யூட்டரில் லாகின் செய்யும்போது பதிவு செய்யப்பட்ட எண்ணிற்கு OTP உறுதிப்படுத்தல் கேட்கும்.
                  </p>
                </div>
                <button
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                  className={`relative w-12 h-6 rounded-full transition cursor-pointer shrink-0 ${
                    twoFactorAuth ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                      twoFactorAuth ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Password & Security Info */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="font-black flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>NBN வங்கி தர பாதுகாப்பு குறியாக்கம் (256-bit SSL)</span>
                </div>
                <p className="text-[11px] text-blue-700">
                  உங்கள் வணிக எண், கொட்டேஷன் மற்றும் பரிவர்த்தனை தகவல்கள் முழுமையாக குறியாக்கம் செய்யப்பட்டுள்ளன.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: DEVICE PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                இன்ஸ்டாகிராம் மற்றும் மொபைல் ஆப் போல உங்கள் டிவைஸ் அனுமதிகளை இங்கிருந்து நேரடியாக கட்டுப்படுத்தலாம்:
              </p>

              {/* 1. Camera */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      கேமரா அனுமதி (Camera)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      தயாரிப்பு வீடியோக்கள், ரீல்ஸ் & புகைப்படங்கள் எடுக்க
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePermission('camera')}
                  className={`w-11 h-6 rounded-full relative transition cursor-pointer ${
                    permissions.camera ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                      permissions.camera ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 2. Microphone */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      மைக்ரோஃபோன் (Microphone)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      வாய்ஸ் நோட்ஸ், ரீல்ஸ் ஆடியோ மற்றும் தயாரிப்பு விளக்கம் பேச
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePermission('microphone')}
                  className={`w-11 h-6 rounded-full relative transition cursor-pointer ${
                    permissions.microphone ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                      permissions.microphone ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 3. Location */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      லொகேஷன் சர்வீஸ் (Location Services)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      அருகிலுள்ள தாலுகா வணிகர்களைக் கண்டறிய மற்றும் கடை மேப் காட்ட
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePermission('location')}
                  className={`w-11 h-6 rounded-full relative transition cursor-pointer ${
                    permissions.location ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                      permissions.location ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 4. Contacts */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      தொடர்புகள் (Contacts)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      உங்கள் போன் காண்டாக்ட்களில் உள்ள வணிகர்களை இணைக்க
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePermission('contacts')}
                  className={`w-11 h-6 rounded-full relative transition cursor-pointer ${
                    permissions.contacts ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                      permissions.contacts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 5. Push Notifications */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      புஷ் நோட்டிபிகேஷன் (Push Notifications)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      புதிய வணிக விசாரணைகள் & ஆர்டர்கள் வரும்போது உடனடி எச்சரிக்கை
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePermission('notifications')}
                  className={`w-11 h-6 rounded-full relative transition cursor-pointer ${
                    permissions.notifications ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                      permissions.notifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 6. TalkBox & Audio Alerts */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      டாக் பாக்ஸ் & வாய்ஸ் அலர்ட்ஸ் (TalkBox Audio)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      அவசர B2B கொட்டேஷன் வருகையில் வாய்ஸ் ஒலி எச்சரிக்கை
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePermission('talkBox')}
                  className={`w-11 h-6 rounded-full relative transition cursor-pointer ${
                    permissions.talkBox ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition transform ${
                      permissions.talkBox ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: BLOCKED ACCOUNTS */}
          {activeTab === 'blocked' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-black text-sm text-slate-900">
                  பிளாக் செய்யப்பட்ட கணக்குகள்
                </h4>
                <p className="text-xs text-slate-500">
                  பிளாக் செய்யப்பட்ட கணக்குகளால் உங்கள் ரீல்கள், தயாரிப்புகள் மற்றும் விலைகளைப் பார்க்கவோ, செய்தி அனுப்பவோ முடியாது.
                </p>
              </div>

              {/* Input to Block a user */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="யூசர் ஐடி சேர்க்கவும் (எ.கா: spam_trader)..."
                  value={newBlockInput}
                  onChange={(e) => setNewBlockInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleAddBlock}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
                >
                  <UserX className="w-4 h-4" />
                  <span>பிளாக் செய்</span>
                </button>
              </div>

              {/* Blocked Accounts List */}
              <div className="space-y-2 pt-2">
                {blockedUsers.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-bold">
                    தற்போது பிளாக் செய்யப்பட்ட பயனர்கள் யாரும் இல்லை.
                  </div>
                ) : (
                  blockedUsers.map((handle) => (
                    <div
                      key={handle}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                          @
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-900">
                          @{handle}
                        </span>
                      </div>
                      <button
                        onClick={() => handleUnblock(handle)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                      >
                        தடை நீக்கு (Unblock)
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA QUALITY */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-black text-sm text-slate-900">
                  மீடியா பதிவேற்ற தரம் & டேட்டா சேவர்
                </h4>
                <p className="text-xs text-slate-500">
                  ரீல்ஸ் மற்றும் தொழில் புகைப்படங்களை பதிவேற்றும் போது தரத்தை தேர்வு செய்யவும்.
                </p>
              </div>

              <div className="space-y-3">
                {/* Full HD Mode */}
                <div
                  onClick={() => setMediaQuality('high')}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                    mediaQuality === 'high'
                      ? 'border-amber-500 bg-amber-50/50'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="font-black text-sm text-slate-900">
                        உயர் தரம் - Full HD 1080p (பரிந்துரைக்கப்படுகிறது)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      பட்டு சேலை நெசவு மற்றும் மெஷின் விவரங்கள் வாடிக்கையாளர்களுக்கு மிகத் தெளிவாக தெரியும்.
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    mediaQuality === 'high' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-400'
                  }`}>
                    {mediaQuality === 'high' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                {/* Data Saver Mode */}
                <div
                  onClick={() => setMediaQuality('data_saver')}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                    mediaQuality === 'data_saver'
                      ? 'border-amber-500 bg-amber-50/50'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-blue-600" />
                      <span className="font-black text-sm text-slate-900">
                        டேட்டா சேவர் - Data Saver (குறைவான இணைய பயன்பாடு)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      2G/3G நெட்வொர்க்கிலும் வீடியோக்கள் விரைவாக லோட் ஆகும், இணைய செலவு 60% வரை மிச்சமாகும்.
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    mediaQuality === 'data_saver' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-400'
                  }`}>
                    {mediaQuality === 'data_saver' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTENT PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-black text-sm text-slate-900">
                  உங்கள் தொழில் துறை விருப்பங்கள்
                </h4>
                <p className="text-xs text-slate-500">
                  நீங்கள் தேர்ந்தெடுக்கும் துறைகள் உங்கள் முகப்பு ஃபீட் மற்றும் ரீல்ஸில் முதலில் முன்னிலைப்படுத்தப்படும்.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {industryOptions.map((ind) => {
                  const isChecked = selectedPreferences.includes(ind);
                  return (
                    <div
                      key={ind}
                      onClick={() => handleTogglePreference(ind)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-amber-400 bg-amber-50 text-slate-950 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs">{ind}</span>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isChecked ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {showSavedAlert && (
              <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              ரத்து செய்
            </button>
            <button
              onClick={handleSaveAllSettings}
              className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              அமைப்புகளை சேமி (Save Settings)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
