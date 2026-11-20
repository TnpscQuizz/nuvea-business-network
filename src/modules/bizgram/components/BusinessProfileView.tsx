import React, { useState } from 'react';
import { 
  Grid, Film, Bookmark, CheckCircle2, MapPin, Phone, 
  Tag, Plus, Edit, Sparkles, ExternalLink, ShieldCheck, 
  Heart, MessageCircle, Clock, Award, Settings, Lock, 
  Share2, ShoppingBag, Briefcase, Image as ImageIcon, Globe, 
  Star, ChevronRight, UserX, Shield, Eye, Bell, Key, LogOut 
} from 'lucide-react';
import type { BizPost, BizUser } from '../../../types';
import { translations, type Language } from '../data/translations';

interface BusinessProfileViewProps {
  currentUser: BizUser;
  posts: BizPost[];
  lang?: Language;
  onToggleLang?: (newLang: Language) => void;
  onOpenCreateModal: () => void;
  onOpenRenewModal: () => void;
  onOpenSettings: () => void;
  onOpenAuthModal: () => void;
  onSelectPost: (post: BizPost) => void;
  onUpdateUser?: (updated: BizUser) => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  currentUser,
  posts,
  lang = 'en',
  onToggleLang,
  onOpenCreateModal,
  onOpenRenewModal,
  onOpenSettings,
  onOpenAuthModal,
  onSelectPost,
  onUpdateUser,
}) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'products' | 'about' | 'settings'>('posts');
  const [isFollowing, setIsFollowing] = useState(true);

  // In-profile settings state
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivateAccount || false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState<string[]>(currentUser.blockedUsers || ['spam_trader_01']);
  const [newBlockInput, setNewBlockInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter posts
  const myPosts = posts.filter(
    (p) =>
      p.memberId === currentUser.id ||
      p.businessName.toLowerCase().includes('shinegah') ||
      p.businessName.toLowerCase().includes(currentUser.businessName.toLowerCase().slice(0, 5))
  );

  const displayPosts = myPosts.length > 0 ? myPosts : posts.slice(0, 6);
  const myReels = displayPosts.filter((p) => p.type === 'video');

  const handleBlockUser = () => {
    if (!newBlockInput.trim()) return;
    const clean = newBlockInput.trim().replace(/^@/, '');
    if (!blockedUsers.includes(clean)) {
      const updated = [...blockedUsers, clean];
      setBlockedUsers(updated);
      setNewBlockInput('');
      if (onUpdateUser) {
        onUpdateUser({ ...currentUser, blockedUsers: updated });
      }
    }
  };

  const handleUnblockUser = (u: string) => {
    const updated = blockedUsers.filter((user) => user !== u);
    setBlockedUsers(updated);
    if (onUpdateUser) {
      onUpdateUser({ ...currentUser, blockedUsers: updated });
    }
  };

  const handleSaveProfileSettings = () => {
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        isPrivateAccount: isPrivate,
        blockedUsers,
      });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 select-none font-sans">
      
      {/* ========================================================================= */}
      {/* 1. CORPORATE EXECUTIVE PROFILE HEADER CARD (APPLE WHITE GLOW GLASS)       */}
      {/* ========================================================================= */}
      <div className="apple-glass apple-specular-edge rounded-[36px] overflow-hidden shadow-xl">
        
        {/* Cover Photo: Architectural Glass Corporate Skyscraper */}
        <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
            alt="Corporate Cover"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
          
          {/* Top Right Executive Quick Action Icons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-xl text-slate-900 transition cursor-pointer border border-white shadow-md"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenRenewModal}
              className="px-4 py-2 rounded-full bg-slate-950 text-white font-extrabold text-xs transition cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified B2B</span>
            </button>
          </div>
        </div>

        {/* Profile Content Container */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 -mt-16 sm:-mt-20 relative space-y-5">
          
          {/* Avatar + Main Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            
            {/* Avatar with White Verified Badge */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-white to-slate-200 shadow-xl shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white shadow-sm">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={currentUser.businessName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center border-2 border-white shadow-md">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Actions: Follow / Following + Settings + Switch */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  isFollowing
                    ? 'bg-white/80 hover:bg-white text-slate-900 border border-white'
                    : 'bg-slate-950 text-white hover:bg-black'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isFollowing ? 'fill-slate-900 text-slate-900' : 'fill-white text-white'}`} />
                <span>{isFollowing ? t.following : t.follow}</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2.5 bg-white/80 hover:bg-white text-slate-900 font-bold text-xs rounded-full border border-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{t.settings}</span>
              </button>

              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2.5 apple-btn-primary text-xs rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.create}</span>
              </button>

              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-2.5 bg-white/70 hover:bg-white text-slate-700 font-bold text-xs rounded-full border border-white transition cursor-pointer shadow-sm"
                title="Switch Account"
              >
                {t.switchAccount}
              </button>
            </div>

          </div>

          {/* Corporate Name, Verified Badges & Bio */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentUser.businessName || 'Shinegah™ Enterprise Network'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/80 border border-white text-slate-900 text-[10px] font-bold shadow-sm">
                Tier 1 Verified
              </span>
            </div>

            <div className="font-mono text-xs text-slate-500">
              @{currentUser.username || 'shinegah.in'} • {currentUser.ownerName || 'Chandru S'}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl font-normal">
              {currentUser.bio || 'Empowering Businesses to Grow Together ✨ | The Next-Gen Business Social Network | Verified B2B Trade Infrastructure'}
            </p>

            {/* Specialty Category Tags */}
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium flex-wrap pt-0.5">
              <span>Technology</span>
              <span>•</span>
              <span>Enterprise Network</span>
              <span>•</span>
              <span>B2B Supply Infrastructure</span>
            </div>
          </div>

          {/* Counters: 12.5K Followers | 245 Following | 3.8M Reach */}
          <div className="flex items-center gap-8 sm:gap-12 py-3 border-y border-white/80 text-slate-700">
            <div>
              <span className="font-black text-base sm:text-lg text-slate-900">
                {currentUser.followersCount ? `${(currentUser.followersCount / 1000).toFixed(1)}K` : '12.5K'}
              </span>
              <span className="text-xs text-slate-500 ml-1.5 font-medium">{t.followers}</span>
            </div>
            <div>
              <span className="font-black text-base sm:text-lg text-slate-900">
                {currentUser.followingCount || 245}
              </span>
              <span className="text-xs text-slate-500 ml-1.5 font-medium">{t.followingCount}</span>
            </div>
            <div>
              <span className="font-black text-base sm:text-lg text-slate-900">3.8M</span>
              <span className="text-xs text-slate-500 ml-1.5 font-medium">{t.reach}</span>
            </div>
          </div>

          {/* 4 Frosted Action Buttons: Products, Services, Portfolio, Contact */}
          <div className="grid grid-cols-4 gap-3 pt-1">
            <button
              onClick={() => setActiveTab('products')}
              className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white transition flex flex-col items-center gap-1.5 cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{t.products}</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white transition flex flex-col items-center gap-1.5 cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{t.services}</span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white transition flex flex-col items-center gap-1.5 cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{t.portfolio}</span>
            </button>

            <a
              href={`tel:${currentUser.phone}`}
              className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white transition flex flex-col items-center gap-1.5 cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{t.contact}</span>
            </a>
          </div>

          {/* Location & Website Card */}
          <div className="p-3.5 rounded-2xl bg-white/70 border border-white flex items-center justify-between text-xs text-slate-700 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser.locationTag || 'Chennai, Tamil Nadu'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900 font-bold hover:underline cursor-pointer">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>www.shinegah.in</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. PROFILE NAVIGATION TABS (POSTS, REELS, PRODUCTS, ABOUT, SETTINGS)      */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between border-b border-white/80 px-2 sm:px-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('posts')}
          className={`py-3 px-3 transition cursor-pointer border-b-2 ${
            activeTab === 'posts' ? 'border-slate-950 text-slate-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.postsTab}
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`py-3 px-3 transition cursor-pointer border-b-2 ${
            activeTab === 'reels' ? 'border-slate-950 text-slate-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.reelsTab}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-3 transition cursor-pointer border-b-2 ${
            activeTab === 'products' ? 'border-slate-950 text-slate-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.products}
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`py-3 px-3 transition cursor-pointer border-b-2 ${
            activeTab === 'about' ? 'border-slate-950 text-slate-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.aboutTab}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'border-slate-950 text-slate-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{t.settings}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT                                                            */}
      {/* ========================================================================= */}
      
      {/* POSTS TAB */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-square rounded-[24px] overflow-hidden bg-slate-950 group cursor-pointer apple-glass apple-specular-edge hover:scale-[1.02] transition duration-300"
            >
              {post.type === 'video' ? (
                <video
                  src={post.mediaUrl}
                  poster={post.thumbnailUrl}
                  playsInline
                  loop
                  muted
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              )}

              {/* Type Badge */}
              <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                {post.type === 'video' ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
              </div>

              {/* Bottom Hover Caption */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition space-y-1">
                <div className="text-xs font-bold truncate">{post.businessName}</div>
                <div className="text-[10px] text-slate-300 line-clamp-1">{post.caption}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REELS TAB */}
      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {myReels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => onSelectPost(reel)}
              className="relative aspect-[9/16] rounded-[24px] overflow-hidden bg-slate-950 group cursor-pointer apple-glass apple-specular-edge hover:scale-[1.02] transition duration-300"
            >
              <video
                src={reel.mediaUrl}
                poster={reel.thumbnailUrl}
                playsInline
                loop
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                <Film className="w-3 h-3" />
                <span>Reel</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black to-transparent text-white">
                <div className="text-xs font-bold truncate">{reel.businessName}</div>
                <div className="text-[10px] text-slate-300 line-clamp-1">{reel.caption}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.slice(1, 5).map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectPost(p)}
                className="p-4 rounded-3xl apple-glass apple-specular-edge flex items-center gap-4 cursor-pointer hover:border-white transition shadow-sm"
              >
                <img
                  src={p.thumbnailUrl || p.mediaUrl}
                  alt={p.businessName}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-white shadow-sm"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="font-bold text-sm text-slate-900 truncate">{p.businessName}</div>
                  <div className="text-xs text-slate-600 line-clamp-1">{p.caption}</div>
                  <div className="text-xs font-mono font-bold text-emerald-600">{p.priceTag || 'Wholesale B2B'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABOUT TAB */}
      {activeTab === 'about' && (
        <div className="apple-glass apple-specular-edge rounded-[32px] p-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
          <h3 className="font-black text-slate-900 text-base">About Shinegah™ Enterprise Network</h3>
          <p>
            Shinegah is Tamil Nadu’s premier B2B social trade infrastructure. Designed exclusively for verified manufacturers, master handloom weavers, machinery OEMs, and wholesale dealers.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/70 border border-white shadow-sm">
              <span className="text-slate-500 text-xs block">Corporate CIN:</span>
              <span className="font-mono font-bold text-slate-900">U72900TN2026PTC109842</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 border border-white shadow-sm">
              <span className="text-slate-500 text-xs block">GSTIN:</span>
              <span className="font-mono font-bold text-slate-900">33AAAAA0000A1Z5</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. IN-PROFILE COMPREHENSIVE SETTINGS TAB (AS REQUESTED BY USER)           */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="apple-glass apple-specular-edge rounded-[36px] p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-white/80 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">{t.settingsTitle}</h2>
              <p className="text-xs text-slate-500">{t.settingsSubtitle}</p>
            </div>
            {saveSuccess && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 text-xs font-bold border border-emerald-500/30">
                {t.settingsSaved}
              </span>
            )}
          </div>

          {/* 1. LANGUAGE SWITCHER (ENGLISH ⇄ TAMIL AS REQUESTED) */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-black text-sm text-slate-900">{t.languageSection}</div>
                <div className="text-xs text-slate-500">Select app interface language / மொழியை தேர்ந்தெடுக்கவும்</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => onToggleLang && onToggleLang('en')}
                className={`py-3 px-4 rounded-2xl font-black text-xs transition cursor-pointer border flex items-center justify-center gap-2 ${
                  lang === 'en'
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                    : 'bg-white text-slate-700 border-white hover:bg-slate-100'
                }`}
              >
                <span>English (Default)</span>
                {lang === 'en' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>

              <button
                type="button"
                onClick={() => onToggleLang && onToggleLang('ta')}
                className={`py-3 px-4 rounded-2xl font-black text-xs transition cursor-pointer border flex items-center justify-center gap-2 ${
                  lang === 'ta'
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                    : 'bg-white text-slate-700 border-white hover:bg-slate-100'
                }`}
              >
                <span>தமிழ் (Tamil)</span>
                {lang === 'ta' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>

          {/* 2. PRIVACY TOGGLE: PUBLIC / PRIVATE */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <div className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-600" />
                <span>{isPrivate ? t.privateAccount : t.publicAccount}</span>
              </div>
              <div className="text-xs text-slate-500">
                {isPrivate ? t.privateAccountDesc : t.publicAccountDesc}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-12 h-6 rounded-full transition cursor-pointer relative p-0.5 border ${
                isPrivate ? 'bg-slate-950 border-slate-950' : 'bg-slate-300 border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform bg-white ${
                  isPrivate ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. TWO-FACTOR SECURITY */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <div className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-600" />
                <span>{t.twoFactor}</span>
              </div>
              <div className="text-xs text-slate-500">Secure sign-in with SMS OTP verification</div>
            </div>

            <button
              type="button"
              onClick={() => setTwoFactor(!twoFactor)}
              className={`w-12 h-6 rounded-full transition cursor-pointer relative p-0.5 border ${
                twoFactor ? 'bg-slate-950 border-slate-950' : 'bg-slate-300 border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform bg-white ${
                  twoFactor ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. BLOCKED ACCOUNTS MANAGEMENT */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3 shadow-sm">
            <div className="font-black text-sm text-slate-900 flex items-center gap-2">
              <UserX className="w-4 h-4 text-slate-600" />
              <span>{t.blockedSection}</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t.blockPlaceholder}
                value={newBlockInput}
                onChange={(e) => setNewBlockInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-inner"
              />
              <button
                type="button"
                onClick={handleBlockUser}
                className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold transition cursor-pointer hover:bg-black shadow-sm"
              >
                {t.blockBtn}
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {blockedUsers.length === 0 ? (
                <div className="text-xs text-slate-500">{t.noBlocked}</div>
              ) : (
                blockedUsers.map((u) => (
                  <div key={u} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs shadow-sm">
                    <span className="text-slate-800 font-mono">@{u}</span>
                    <button
                      type="button"
                      onClick={() => handleUnblockUser(u)}
                      className="text-xs text-rose-600 hover:text-rose-800 transition cursor-pointer font-bold"
                    >
                      {t.unblockBtn}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 5. MEMBERSHIP VALIDITY & ACTIONS */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <div className="font-black text-xs text-slate-900">{t.validityLabel}</div>
              <div className="text-xs text-slate-500">{currentUser.validityDaysLeft || 364} {t.daysLeft}</div>
            </div>
            <button
              type="button"
              onClick={onOpenRenewModal}
              className="px-3.5 py-1.5 bg-slate-950 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-sm hover:bg-black"
            >
              Renew
            </button>
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleSaveProfileSettings}
              className="flex-1 py-3 apple-btn-primary rounded-2xl text-xs font-black cursor-pointer shadow-md"
            >
              {t.saveSettingsBtn}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
