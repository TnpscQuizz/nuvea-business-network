import React, { useState, useRef } from 'react';
import { 
  Grid, Film, Bookmark, CheckCircle2, MapPin, Phone, 
  Tag, Plus, Edit, Sparkles, ExternalLink, ShieldCheck, 
  Heart, MessageCircle, Clock, Award, Settings, Lock, 
  Share2, ShoppingBag, Briefcase, Image as ImageIcon, Globe, 
  Star, ChevronRight, UserX, Shield, Eye, Bell, Key, LogOut, 
  Camera, Store, Users, UserCheck, X, ThumbsDown 
} from 'lucide-react';
import type { BizPost, BizUser, BizOutlet, BizFollowRequest } from '../../../types';
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
  onLogout?: () => void;
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
  onLogout,
}) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'outlets' | 'requests' | 'reviews' | 'referrals' | 'settings'>('posts');
  const [isFollowing, setIsFollowing] = useState(true);

  // Hidden file inputs for direct device photo upload
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Direct Profile Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBizName, setEditBizName] = useState(currentUser.businessName);
  const [editOwnerName, setEditOwnerName] = useState(currentUser.ownerName);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editGstin, setEditGstin] = useState(currentUser.gstin || '');
  const [editWebsite, setEditWebsite] = useState(currentUser.website || 'https://shinegah.in');
  const [editLocation, setEditLocation] = useState(currentUser.taluk || 'Chennai');
  const [editCategory, setEditCategory] = useState(currentUser.category || 'Technology');

  // Add Outlet Modal state
  const [isAddOutletOpen, setIsAddOutletOpen] = useState(false);
  const [outletName, setOutletName] = useState('');
  const [outletAddress, setOutletAddress] = useState('');
  const [outletPhone, setOutletPhone] = useState('');
  const [outletTiming, setOutletTiming] = useState('09:00 AM - 08:30 PM (Mon-Sat)');
  const [outletDistrict, setOutletDistrict] = useState(currentUser.taluk || 'Chennai');

  // Settings state inside profile
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivateAccount || false);
  const [requireFollowApproval, setRequireFollowApproval] = useState(currentUser.requiresFollowApproval ?? true);
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

  // Handle Cover Banner Upload (Direct Computer/Phone Image)
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateUser) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        onUpdateUser({
          ...currentUser,
          coverUrl: resultUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Avatar Upload (Direct Computer/Phone Image)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateUser) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        onUpdateUser({
          ...currentUser,
          avatar: resultUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Edit Profile details
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        businessName: editBizName,
        ownerName: editOwnerName,
        bio: editBio,
        phone: editPhone,
        gstin: editGstin,
        website: editWebsite,
        taluk: editLocation,
        category: editCategory,
        locationTag: `${editLocation}, Tamil Nadu`,
      });
    }
    setIsEditModalOpen(false);
  };

  // Handle Add Outlet
  const handleAddOutlet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outletName.trim() || !outletAddress.trim()) return;

    const newOutlet: BizOutlet = {
      id: `out_${Date.now()}`,
      name: outletName.trim(),
      address: outletAddress.trim(),
      phone: outletPhone.trim() || currentUser.phone,
      timing: outletTiming.trim(),
      isPrimary: (currentUser.outlets || []).length === 0,
      district: outletDistrict,
    };

    const updatedOutlets = [...(currentUser.outlets || []), newOutlet];
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        outlets: updatedOutlets,
      });
    }

    setOutletName('');
    setOutletAddress('');
    setOutletPhone('');
    setIsAddOutletOpen(false);
  };

  // Handle Accept Follow Request
  const handleAcceptRequest = (req: BizFollowRequest) => {
    const remainingRequests = (currentUser.followRequests || []).filter((r) => r.id !== req.id);
    const updatedApproved = [...(currentUser.approvedConnections || []), req.username];

    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        followRequests: remainingRequests,
        approvedConnections: updatedApproved,
        followersCount: (currentUser.followersCount || 0) + 1,
      });
    }
  };

  // Handle Decline Follow Request
  const handleDeclineRequest = (reqId: string) => {
    const remainingRequests = (currentUser.followRequests || []).filter((r) => r.id !== reqId);
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        followRequests: remainingRequests,
      });
    }
  };

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
        requiresFollowApproval: requireFollowApproval,
        blockedUsers,
      });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const pendingRequestsCount = currentUser.followRequests?.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 select-none font-sans">
      
      {/* Hidden file inputs for direct device banner and avatar uploads */}
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        onChange={handleBannerChange}
        className="hidden"
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* 1. CORPORATE EXECUTIVE PROFILE HEADER CARD (APPLE WHITE GLOW GLASS)       */}
      {/* ========================================================================= */}
      <div className="apple-glass apple-specular-edge rounded-[38px] overflow-hidden shadow-xl border-2 border-white">
        
        {/* Cover Photo: Customizable & Editable Background Banner */}
        <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-slate-900 group">
          <img
            src={currentUser.coverUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'}
            alt="Corporate Cover"
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
          
          {/* Change Banner Button (User requested editable banner!) */}
          <button
            onClick={() => bannerInputRef.current?.click()}
            className="absolute bottom-4 right-4 z-20 px-3.5 py-2 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-md text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer border border-white/30"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t.editCover}</span>
          </button>

          {/* Top Right Executive Quick Action Icons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2.5 rounded-full bg-white/85 hover:bg-white backdrop-blur-xl text-slate-900 transition cursor-pointer border border-white shadow-md"
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
            
            {/* Avatar with White Verified Badge + Click to Upload Photo */}
            <div 
              onClick={() => avatarInputRef.current?.click()}
              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-white to-slate-200 shadow-xl shrink-0 cursor-pointer group"
              title="Click to change profile picture"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white shadow-sm relative">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={currentUser.businessName}
                  className="w-full h-full object-cover group-hover:opacity-85 transition"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center border-2 border-white shadow-md">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Actions: Edit Profile + Follow Requests + Create + Settings */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2.5 bg-white/85 hover:bg-white text-slate-900 font-extrabold text-xs rounded-full border border-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{t.editProfile}</span>
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  pendingRequestsCount > 0
                    ? 'bg-rose-500 text-white shadow-rose-200 animate-pulse'
                    : 'bg-white/85 text-slate-900 border border-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Requests ({pendingRequestsCount})</span>
              </button>

              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2.5 apple-btn-primary text-xs rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.create}</span>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full border border-rose-200 transition cursor-pointer shadow-sm"
                  title="Log Out of Business Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Corporate Name, Verified Badges & Bio */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentUser.businessName || 'Shinegah™ Enterprise Network'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/80 border border-white text-slate-900 text-[10px] font-bold shadow-sm">
                Verified B2B • GSTIN: {currentUser.gstin || '33AABCS1429B1Z2'}
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
              <span>{currentUser.category || 'Technology'}</span>
              <span>•</span>
              <span>Enterprise Network</span>
              <span>•</span>
              <span>B2B Supply Infrastructure</span>
            </div>
          </div>

          {/* Counters: Followers | Following | Outlets */}
          <div className="flex items-center gap-8 sm:gap-12 py-3 border-y border-white/80 text-slate-700">
            <div>
              <div className="font-black text-slate-900 text-sm sm:text-base">
                {currentUser.followersCount ? `${(currentUser.followersCount / 1000).toFixed(1)}K` : '12.5K'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">{t.followers}</div>
            </div>
            <div>
              <div className="font-black text-slate-900 text-sm sm:text-base">
                {currentUser.followingCount || 245}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">{t.followingCount}</div>
            </div>
            <div>
              <div className="font-black text-slate-900 text-sm sm:text-base">
                {(currentUser.outlets || []).length} Branches
              </div>
              <div className="text-[11px] text-slate-500 font-medium">{t.outletsTab}</div>
            </div>
            <div>
              <div className="font-black text-slate-900 text-sm sm:text-base">
                3.8M
              </div>
              <div className="text-[11px] text-slate-500 font-medium">{t.reach}</div>
            </div>
          </div>

          {/* Location & Website Bar */}
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-700" />
              <span>{currentUser.locationTag || 'Chennai, Tamil Nadu'}</span>
            </div>
            <a
              href={currentUser.website || 'https://shinegah.in'}
              target="_blank"
              rel="noreferrer"
              className="text-slate-900 font-bold hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentUser.website || 'www.shinegah.in'}</span>
            </a>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PENDING FOLLOW REQUESTS BANNER (IF ANY)                                */}
      {/* ========================================================================= */}
      {pendingRequestsCount > 0 && (
        <div className="apple-glass apple-specular-edge rounded-3xl p-4 sm:p-5 flex items-center justify-between border-2 border-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-black text-xs sm:text-sm text-slate-900">
                {pendingRequestsCount} Business Connection Requests Pending
              </div>
              <p className="text-[11px] text-slate-500">
                Approve requests to allow mutual direct messaging and wholesale catalog access.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('requests')}
            className="px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-extrabold hover:bg-black transition cursor-pointer shadow-md shrink-0"
          >
            Review ({pendingRequestsCount})
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PROFILE NAVIGATION TABS (POSTS, REELS, OUTLETS, REQUESTS, ABOUT, SETTINGS) */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 p-1.5 rounded-full apple-glass border border-white max-w-2xl mx-auto shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
            activeTab === 'posts' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{t.postsTab} ({displayPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
            activeTab === 'reels' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>{t.reelsTab} ({myReels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('outlets')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
            activeTab === 'outlets' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>{t.outletsTab} ({(currentUser.outlets || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
            activeTab === 'requests' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.requestsTab} {pendingRequestsCount > 0 && `(${pendingRequestsCount})`}</span>
        </button>

        {/* PILLAR 7: REVIEWS & TRUST */}
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
            activeTab === 'reviews' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>Reviews ({(currentUser.reviews || []).length})</span>
        </button>

        {/* PILLAR 5: NETWORKING & REFERRALS */}
        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
            activeTab === 'referrals' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Referrals ({(currentUser.referralsReceived || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
            activeTab === 'settings' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{t.settings}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT 1: POSTS GRID                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-square rounded-3xl overflow-hidden apple-glass apple-specular-edge group cursor-pointer shadow-sm border border-white"
            >
              <img
                src={post.thumbnailUrl || post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white font-black text-xs">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>{post.enquiriesCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 2: REELS GRID                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {myReels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => onSelectPost(reel)}
              className="relative aspect-[9/16] rounded-3xl overflow-hidden apple-glass apple-specular-edge group cursor-pointer shadow-sm border border-white"
            >
              <video
                src={reel.mediaUrl}
                poster={reel.thumbnailUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-md">
                <Film className="w-3.5 h-3.5" />
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold drop-shadow-md line-clamp-1">
                {reel.caption}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 3: OUTLETS & STOREFRONTS (USER REQUESTED OUTLETS SECTION!)    */}
      {/* ========================================================================= */}
      {activeTab === 'outlets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Business Outlets & Regional Storefronts
              </h2>
              <p className="text-xs text-slate-500">
                Official branch locations, showrooms, and warehouse hubs across Tamil Nadu.
              </p>
            </div>
            <button
              onClick={() => setIsAddOutletOpen(true)}
              className="px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-extrabold flex items-center gap-1.5 hover:bg-black transition cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addOutlet}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(currentUser.outlets || []).map((outlet) => (
              <div
                key={outlet.id}
                className="apple-glass apple-specular-edge rounded-3xl p-5 space-y-3 border-2 border-white shadow-md relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-bold shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {outlet.name}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        {outlet.isPrimary ? 'Primary Headquarters' : 'Branch Store'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
                    <span>{outlet.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span className="font-mono">{outlet.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span>{outlet.timing}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/80 flex items-center justify-between">
                  <a
                    href={`tel:${outlet.phone}`}
                    className="text-xs font-extrabold text-slate-900 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Store</span>
                  </a>
                  <button
                    onClick={() => alert(`Opening location: ${outlet.address}`)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View on Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 4: FOLLOW REQUESTS APPROVAL MANAGER                           */}
      {/* ========================================================================= */}
      {activeTab === 'requests' && (
        <div className="apple-glass apple-specular-edge rounded-3xl p-5 sm:p-6 space-y-4 border-2 border-white shadow-lg">
          <div className="flex items-center justify-between border-b border-white/80 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Follow & Connection Requests ({pendingRequestsCount})
              </h2>
              <p className="text-xs text-slate-500">
                Only accepted connections are permitted to initiate direct chat and send RFQs.
              </p>
            </div>
          </div>

          {pendingRequestsCount === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <UserCheck className="w-10 h-10 mx-auto text-slate-300" />
              <div className="font-bold text-sm text-slate-600">No Pending Requests</div>
              <p className="text-xs text-slate-400">All incoming connection requests have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(currentUser.followRequests || []).map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-white/70 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={req.avatar}
                      alt={req.businessName}
                      className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
                    />
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{req.businessName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-900 fill-slate-200" />
                      </div>
                      <div className="text-xs font-mono text-slate-500">
                        @{req.username} • {req.category}
                      </div>
                      <div className="text-[10px] text-slate-400">Requested {req.requestedAt}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-extrabold hover:bg-black transition cursor-pointer shadow-md flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{t.accept}</span>
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="px-4 py-2 rounded-full bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold border border-slate-200 transition cursor-pointer"
                    >
                      {t.decline}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: PILLAR 7 - REVIEWS & TRUST                                   */}
      {/* ========================================================================= */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {/* Trust Score Banner */}
          <div className="apple-glass apple-specular-edge rounded-3xl p-5 border-2 border-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                ★
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900">4.9 / 5.0</span>
                  <span className="text-xs font-bold text-slate-500">
                    ({(currentUser.reviews || []).length} Verified Client Reviews)
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2 pt-0.5">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Level 3 GST Verified</span>
                  </span>
                  <span>•</span>
                  <span>99% Trust Score</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('To maintain authentic B2B integrity, reviews are submitted by verified trading partners after quotation completion.')}
              className="px-5 py-2.5 rounded-full bg-slate-950 text-white text-xs font-extrabold shadow-md hover:bg-black transition cursor-pointer"
            >
              + Write B2B Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-3">
            {(currentUser.reviews || []).map((rev) => (
              <div
                key={rev.id}
                className="apple-glass apple-specular-edge rounded-3xl p-5 border-2 border-white space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.reviewerAvatar}
                      alt={rev.reviewerBizName}
                      className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
                    />
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{rev.reviewerBizName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-900 fill-slate-200" />
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {rev.category} • {rev.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-amber-500 text-xs font-black gap-0.5">
                      {'★'.repeat(Math.floor(rev.rating))}
                      <span className="ml-1 text-slate-900">{rev.rating}</span>
                    </div>
                    {rev.dealAmount && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                        Verified Order: {rev.dealAmount}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: PILLAR 5 - NETWORKING & REFERRAL SLIPS                       */}
      {/* ========================================================================= */}
      {activeTab === 'referrals' && (
        <div className="space-y-4">
          <div className="apple-glass apple-specular-edge rounded-3xl p-5 border-2 border-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-bold shadow-md">
                <Briefcase className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  B2B Referral Exchange & Elevation Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Pass client requirements, track pipeline closure, and earn networking elevation scores.
                </p>
              </div>
            </div>

            <button
              onClick={() => alert('Referral slip passed to Western Tamil Nadu chapter network.')}
              className="px-5 py-2.5 rounded-full bg-slate-950 text-white text-xs font-extrabold shadow-md hover:bg-black transition cursor-pointer"
            >
              + Pass Business Referral
            </button>
          </div>

          <div className="space-y-3">
            {(currentUser.referralsReceived || []).map((ref) => (
              <div
                key={ref.id}
                className="apple-glass apple-specular-edge rounded-3xl p-5 border-2 border-white space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-white/80 pb-2.5">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                      Referred By
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {ref.fromBizName}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    ref.status === 'deal_won' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ref.status === 'deal_won' ? '🎉 Deal Won' : '📄 Quoted'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Client Name:</span>
                    <span className="font-bold text-slate-900">{ref.clientName}</span> ({ref.clientPhone})
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Estimated Value:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">{ref.estimatedValue}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-white/60 p-3 rounded-2xl border border-white">
                  <strong>Requirement:</strong> {ref.requirement}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 5: IN-PROFILE HEAVY SETTINGS PANEL                            */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="apple-glass apple-specular-edge rounded-3xl p-5 sm:p-7 space-y-6 border-2 border-white shadow-xl">
          <div className="flex items-center justify-between border-b border-white/80 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {t.settingsTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t.settingsSubtitle}
              </p>
            </div>
            {saveSuccess && (
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/90 px-3 py-1 rounded-full animate-bounce">
                {t.settingsSaved}
              </span>
            )}
          </div>

          {/* Follow Approval & Privacy Gate (Matches user's exact instruction!) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Follow Request & Chat Approval Gates</span>
            </h3>

            <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                    Require Follow Approval
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Only approved businesses can follow your updates and see wholesale pricing.
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

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                    Gated Chat: Approved Connections Only
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Only businesses you have approved can send direct messages and GST quotations.
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
          </div>

          {/* Language Switcher */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{t.languageSection}</span>
            </h3>
            <div className="p-4 rounded-2xl bg-white/70 border border-white flex items-center justify-between">
              <div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                  Application Language
                </div>
                <div className="text-[11px] text-slate-500">
                  Switch between English and தமிழ் across all views.
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200">
                <button
                  onClick={() => onToggleLang?.('en')}
                  className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer ${
                    lang === 'en' ? 'bg-slate-950 text-white' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => onToggleLang?.('ta')}
                  className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer ${
                    lang === 'ta' ? 'bg-slate-950 text-white' : 'text-slate-600'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>

          {/* Blocked Accounts */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <UserX className="w-3.5 h-3.5" />
              <span>{t.blockedSection}</span>
            </h3>
            <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t.blockPlaceholder}
                  value={newBlockInput}
                  onChange={(e) => setNewBlockInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                />
                <button
                  onClick={handleBlockUser}
                  className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-black transition cursor-pointer"
                >
                  {t.blockBtn}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {blockedUsers.map((user) => (
                  <span
                    key={user}
                    className="px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-mono flex items-center gap-1.5"
                  >
                    <span>@{user}</span>
                    <button
                      onClick={() => handleUnblockUser(user)}
                      className="text-slate-500 hover:text-rose-600 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfileSettings}
            className="w-full py-3.5 rounded-full bg-slate-950 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-black transition cursor-pointer"
          >
            {t.saveSettingsBtn}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DIRECT PROFILE EDIT MODAL                                              */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xl">
          <div className="apple-glass apple-specular-edge rounded-[36px] w-full max-w-lg p-6 space-y-5 border-2 border-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/80 pb-3">
              <h3 className="font-black text-lg text-slate-900">
                Edit Corporate Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800">Business Name</label>
                <input
                  type="text"
                  value={editBizName}
                  onChange={(e) => setEditBizName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800">Owner / Director Name</label>
                <input
                  type="text"
                  value={editOwnerName}
                  onChange={(e) => setEditOwnerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800">Bio & Company Overview</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800">GSTIN</label>
                  <input
                    type="text"
                    value={editGstin}
                    onChange={(e) => setEditGstin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800">District / City</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800">Website</label>
                  <input
                    type="text"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-slate-600 text-xs font-bold hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-slate-950 text-white text-xs font-extrabold hover:bg-black transition cursor-pointer shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ADD OUTLET MODAL                                                       */}
      {/* ========================================================================= */}
      {isAddOutletOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xl">
          <div className="apple-glass apple-specular-edge rounded-[36px] w-full max-w-md p-6 space-y-4 border-2 border-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/80 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5" />
                <span>Add New Business Outlet</span>
              </h3>
              <button
                onClick={() => setIsAddOutletOpen(false)}
                className="p-1 rounded-full text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOutlet} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800">Branch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salem City Showroom"
                  value={outletName}
                  onChange={(e) => setOutletName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800">Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Full door no, street name, pincode"
                  value={outletAddress}
                  onChange={(e) => setOutletAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800">Branch Phone</label>
                  <input
                    type="text"
                    placeholder="+91 94432 10001"
                    value={outletPhone}
                    onChange={(e) => setOutletPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800">District</label>
                  <input
                    type="text"
                    value={outletDistrict}
                    onChange={(e) => setOutletDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800">Working Hours</label>
                <input
                  type="text"
                  value={outletTiming}
                  onChange={(e) => setOutletTiming(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOutletOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-600 text-xs font-bold hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-extrabold hover:bg-black transition cursor-pointer shadow-md"
                >
                  Add Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
