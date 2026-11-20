import React, { useState, useRef } from 'react';
import { 
  Grid, Film, Bookmark, CheckCircle2, MapPin, Phone, 
  Tag, Plus, Edit, Sparkles, ExternalLink, ShieldCheck, 
  Heart, MessageCircle, Clock, Award, Settings, Lock, 
  Share2, ShoppingBag, Briefcase, Image as ImageIcon, Globe, 
  Star, ChevronRight, UserX, Shield, Eye, Bell, Key, LogOut, 
  Camera, Store, Users, UserCheck, X, ThumbsDown,
  Package, Truck, FileText, TrendingUp, BarChart3, Zap, Printer, Download, Check
} from 'lucide-react';
import type { BizPost, BizUser, BizOutlet, BizFollowRequest, BizProduct, BizOrder } from '../../../types';
import { translations, type Language } from '../data/translations';
import { GstInvoiceModal } from './GstInvoiceModal';
import { AddProductModal } from './AddProductModal';

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
  onBuyProduct?: (product: BizProduct) => void;
  onSendEnquiry?: (post: any) => void;
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
  onBuyProduct,
  onSendEnquiry,
}) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<'posts' | 'store' | 'orders' | 'reels' | 'outlets' | 'requests' | 'reviews' | 'referrals' | 'settings'>('posts');
  const [isFollowing, setIsFollowing] = useState(true);

  // Hidden file inputs for direct device photo upload
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Mini Store & Add Product state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Orders & Tracking state
  const [orderSubTab, setOrderSubTab] = useState<'purchases' | 'sales'>('purchases');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<BizOrder | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [dispatchPromptOrder, setDispatchPromptOrder] = useState<BizOrder | null>(null);
  const [dispatchCourier, setDispatchCourier] = useState('DTDC Express Cargo Freight');
  const [dispatchTrackingNo, setDispatchTrackingNo] = useState('');

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
            
            {/* Avatar with Minute Shinegah Signature Aura + Click to Upload Photo */}
            <div 
              onClick={() => avatarInputRef.current?.click()}
              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-blue-600/50 via-purple-600/40 to-amber-500/60 shadow-[0_4px_25px_rgba(37,99,235,0.22),0_8px_30px_rgba(249,115,22,0.2)] shrink-0 cursor-pointer group"
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

          {/* Quick Action Pills Grid (Products | Services | Portfolio | Contact) */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 py-1">
            <button
              onClick={() => setActiveTab('store')}
              className="p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white text-slate-900 transition flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer group"
            >
              <ShoppingBag className="w-4 h-4 text-slate-800 group-hover:scale-110 transition" />
              <span className="text-[10px] font-extrabold">Products</span>
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className="p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white text-slate-900 transition flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer group"
            >
              <Briefcase className="w-4 h-4 text-slate-800 group-hover:scale-110 transition" />
              <span className="text-[10px] font-extrabold">Services</span>
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className="p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white text-slate-900 transition flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer group"
            >
              <ImageIcon className="w-4 h-4 text-slate-800 group-hover:scale-110 transition" />
              <span className="text-[10px] font-extrabold">Portfolio</span>
            </button>
            <a
              href={`tel:${currentUser.phone}`}
              className="p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-white text-slate-900 transition flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer group"
            >
              <Phone className="w-4 h-4 text-slate-800 group-hover:scale-110 transition" />
              <span className="text-[10px] font-extrabold">Contact</span>
            </a>
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
      <div className="flex items-center justify-center gap-1 sm:gap-2 p-1.5 rounded-full apple-glass border border-white max-w-3xl mx-auto shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
            activeTab === 'posts' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{t.postsTab} ({displayPosts.length})</span>
        </button>

        {/* Phase 1: Mini Store */}
        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
            activeTab === 'store' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Store ({(currentUser.products || []).length})</span>
        </button>

        {/* Phase 2: Orders & Business User Dashboard */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
            activeTab === 'orders' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Orders & Sales ({((currentUser.ordersPlaced || []).length + (currentUser.ordersReceived || []).length)})</span>
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
      {/* TAB CONTENT: PHASE 1 - MINI STORE / WHOLESALE PRODUCT CATALOG             */}
      {/* ========================================================================= */}
      {activeTab === 'store' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Verified Wholesale Product Store</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {(currentUser.products || []).length} Consignments Available
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Factory-direct trade catalog with live 18% GST calculation, MOQ compliance, and Instant Buy Now checkout.
              </p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-extrabold flex items-center gap-1.5 hover:bg-black transition cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Wholesale Product</span>
            </button>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(currentUser.products || []).map((prod) => (
              <div
                key={prod.id}
                className="apple-glass apple-specular-edge rounded-3xl p-4 sm:p-5 border-2 border-white shadow-md space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                      {prod.category}
                    </div>
                    {prod.inStock ? (
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-black border border-white/30 flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                        <span>Ready Stock</span>
                      </div>
                    ) : (
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-rose-500/90 text-white text-[10px] font-black border border-white/30">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {prod.description}
                    </p>
                  </div>

                  {/* Pricing and MOQ Capsule */}
                  <div className="p-3 rounded-2xl bg-white/70 border border-white flex items-center justify-between text-xs font-bold text-slate-800 shadow-sm">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Wholesale Price</div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        ₹{prod.price.toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-500 font-medium ml-1">/ {prod.unit}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Minimum Order</div>
                      <div className="text-xs font-mono font-black text-slate-900">
                        MOQ: {prod.moq} {prod.unit}
                      </div>
                    </div>
                  </div>

                  {/* Sample Available Pill */}
                  {prod.sampleAvailable && prod.samplePrice && (
                    <div className="flex items-center justify-between text-[11px] text-amber-800 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200">
                      <span className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>1-Piece Sample Evaluation:</span>
                      </span>
                      <span className="font-mono font-black">₹{prod.samplePrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions: Enquire & Buy Now */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/80">
                  <button
                    onClick={() => {
                      if (onSendEnquiry) {
                        onSendEnquiry({
                          id: prod.id,
                          businessName: prod.sellerName,
                          caption: `Inquiring about ${prod.name} (Wholesale Price ₹${prod.price}/${prod.unit})`,
                          priceTag: `₹${prod.price}/${prod.unit}`,
                          mediaUrl: prod.image,
                        });
                      } else {
                        alert(`Enquiry submitted for ${prod.name}`);
                      }
                    }}
                    className="py-2 px-3 rounded-full border border-slate-300 hover:border-slate-900 bg-white/70 hover:bg-white text-slate-900 text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <span>{t.enquire}</span>
                  </button>
                  <button
                    onClick={() => onBuyProduct ? onBuyProduct(prod) : alert(`Buying ${prod.name}`)}
                    className="py-2 px-3 rounded-full apple-btn-primary text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: PHASE 2 - ORDERS, LIVE TRACKING & BUSINESS USER DASHBOARD    */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-5">
          
          {/* Header & Sub-Tab Switcher (User Order History vs Business Dashboard) */}
          <div className="apple-glass apple-specular-edge rounded-3xl p-4 sm:p-5 border-2 border-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Package className="w-5 h-5 text-slate-900" />
                  <span>Orders, Tracking & Business Sales</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Unified B2B order management, automated courier tracking timelines, and verified GST tax invoices.
                </p>
              </div>

              {/* Segmented Sub-Tab Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 border border-slate-200 self-start sm:self-auto text-xs font-black">
                <button
                  type="button"
                  onClick={() => setOrderSubTab('purchases')}
                  className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                    orderSubTab === 'purchases'
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  My Purchases ({(currentUser.ordersPlaced || []).length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderSubTab('sales')}
                  className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                    orderSubTab === 'sales'
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Business Dashboard ({(currentUser.ordersReceived || []).length})
                </button>
              </div>
            </div>
          </div>

          {/* SUB-VIEW 1: MY PURCHASES (USER ORDER HISTORY & LIVE 4-STAGE TRACKING) */}
          {orderSubTab === 'purchases' && (
            <div className="space-y-4">
              {(currentUser.ordersPlaced || []).length === 0 ? (
                <div className="apple-glass rounded-3xl p-8 text-center space-y-3 border border-white">
                  <Package className="w-12 h-12 text-slate-400 mx-auto" />
                  <div className="font-bold text-sm text-slate-800">No Orders Placed Yet</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Explore products in the Feed, Reels, or verified Storefronts and tap "Buy Now" for instant wholesale checkout.
                  </p>
                </div>
              ) : (
                (currentUser.ordersPlaced || []).map((order) => {
                  const stages = [
                    { key: 'placed', label: 'Order Placed', desc: 'Consignment verified' },
                    { key: 'processing', label: 'Factory Processing & QC', desc: 'Testing & packaging' },
                    { key: 'dispatched', label: 'Dispatched / In Transit', desc: order.courierPartner || 'Logistics Partner' },
                    { key: 'delivered', label: 'Delivered', desc: order.estimatedDelivery || 'Delivered' },
                  ];

                  const getStageIndex = (s: string) => {
                    if (s === 'placed') return 0;
                    if (s === 'confirmed' || s === 'processing') return 1;
                    if (s === 'dispatched') return 2;
                    if (s === 'delivered') return 3;
                    return 0;
                  };

                  const currentStageIdx = getStageIndex(order.status);

                  return (
                    <div
                      key={order.id}
                      className="apple-glass apple-specular-edge rounded-3xl p-5 border-2 border-white shadow-lg space-y-4"
                    >
                      {/* Order Card Header */}
                      <div className="flex items-start justify-between flex-wrap gap-2 border-b border-white/80 pb-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-slate-900">
                              {order.orderNumber}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-xs text-slate-500 font-medium">{order.createdAt}</span>
                          </div>
                          <div className="text-xs text-slate-700">
                            Seller: <strong className="text-slate-900">{order.sellerName}</strong>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : order.status === 'dispatched'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300 animate-pulse'
                              : order.status === 'processing'
                              ? 'bg-purple-100 text-purple-900 border border-purple-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            <span className="w-2 h-2 rounded-full bg-current" />
                            <span>{order.status.toUpperCase()}</span>
                          </span>
                        </div>
                      </div>

                      {/* Product Snippet & Price Summary */}
                      <div className="flex items-center gap-3.5 bg-white/70 p-3 rounded-2xl border border-white">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 shadow-sm"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                            {order.productName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
                            <span>Qty: <strong className="text-slate-800">{order.qty}</strong></span>
                            <span>•</span>
                            <span>Rate: <strong className="text-slate-800 font-mono">₹{order.unitPrice.toLocaleString('en-IN')}</strong></span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm sm:text-base font-black text-slate-900 font-mono">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">incl. 18% GST</div>
                        </div>
                      </div>

                      {/* 4-STAGE AUTOMATIC TRACKING TIMELINE */}
                      <div className="p-4 rounded-2xl bg-white/80 border border-white space-y-3 shadow-sm">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-slate-800" />
                            <span>Automatic Logistics Timeline</span>
                          </span>
                          {order.trackingNumber && (
                            <span className="font-mono text-[11px] text-slate-600 font-bold">
                              Track ID: <span className="text-slate-900">{order.trackingNumber}</span>
                            </span>
                          )}
                        </div>

                        {/* Visual 4-Step Track Bar */}
                        <div className="grid grid-cols-4 gap-2 relative">
                          {stages.map((stg, sIdx) => {
                            const isDone = sIdx <= currentStageIdx;
                            const isCurrent = sIdx === currentStageIdx;

                            return (
                              <div key={stg.key} className="flex flex-col items-center text-center space-y-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm ${
                                  isDone
                                    ? 'bg-slate-950 text-white'
                                    : 'bg-slate-200 text-slate-400'
                                } ${isCurrent && order.status !== 'delivered' ? 'ring-4 ring-slate-950/20' : ''}`}>
                                  {isDone ? '✓' : sIdx + 1}
                                </div>
                                <div className={`text-[10px] font-extrabold leading-tight ${
                                  isDone ? 'text-slate-900' : 'text-slate-400'
                                }`}>
                                  {stg.label}
                                </div>
                                <div className="text-[9px] text-slate-500 hidden sm:block">
                                  {stg.desc}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {order.courierPartner && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                            <span>Carrier: <strong>{order.courierPartner}</strong></span>
                            <span>ETA: <strong className="text-slate-900">{order.estimatedDelivery || 'In Transit'}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Card Actions: Invoice & Help */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoiceOrder(order);
                            setIsInvoiceModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Download GST Invoice</span>
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* SUB-VIEW 2: BUSINESS USER DASHBOARD (SALES & INCOMING WHOLESALE ORDERS) */}
          {orderSubTab === 'sales' && (
            <div className="space-y-4">
              
              {/* Executive Sales Revenue Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/80 border border-white space-y-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Wholesale Sales
                  </div>
                  <div className="text-lg font-black text-slate-900 font-mono">
                    ₹{((currentUser.ordersReceived || []).reduce((acc, o) => acc + o.totalAmount, 0) || 505040).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/80 border border-white space-y-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Client Orders
                  </div>
                  <div className="text-lg font-black text-slate-900 font-mono">
                    {(currentUser.ordersReceived || []).length || 2} Orders
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/80 border border-white space-y-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Pending Dispatch
                  </div>
                  <div className="text-lg font-black text-amber-600 font-mono">
                    {(currentUser.ordersReceived || []).filter(o => o.status !== 'delivered').length || 2} Active
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/80 border border-white space-y-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    On-Time SLA
                  </div>
                  <div className="text-lg font-black text-emerald-600 font-mono">
                    98.4%
                  </div>
                </div>
              </div>

              {/* Incoming Wholesale Orders List */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Incoming Wholesale Client Consignments
                </h3>

                {(currentUser.ordersReceived || []).map((order) => (
                  <div
                    key={order.id}
                    className="apple-glass apple-specular-edge rounded-3xl p-5 border-2 border-white shadow-md space-y-3.5"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-900">
                            {order.orderNumber}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{order.createdAt}</span>
                        </div>
                        <div className="font-extrabold text-sm text-slate-900 pt-0.5">
                          Buyer: {order.buyerName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          GSTIN: {order.buyerGstin || 'Unregistered'} • Phone: {order.buyerPhone}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          Destination: {order.buyerAddress}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-base font-black text-slate-900">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          Payment: {order.paymentStatus.toUpperCase()} ({order.paymentMethod})
                        </span>
                      </div>
                    </div>

                    {/* Ordered Item Capsule */}
                    <div className="p-3 rounded-2xl bg-white/70 border border-white flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 shadow-sm"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{order.productName}</div>
                          <div className="text-[11px] text-slate-500">Qty: {order.qty} • Rate: ₹{order.unitPrice.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700">Status: </span>
                        <strong className="text-slate-950 font-black uppercase text-xs">{order.status}</strong>
                      </div>
                    </div>

                    {/* Seller Order Status Management Action Buttons */}
                    <div className="pt-2 border-t border-white/80 flex items-center justify-between flex-wrap gap-2">
                      <div className="text-[11px] text-slate-500">
                        {order.trackingNumber && (
                          <span>Carrier: <strong>{order.courierPartner}</strong> ({order.trackingNumber})</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {order.status === 'placed' && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (currentUser.ordersReceived || []).map(o => 
                                o.id === order.id ? { ...o, status: 'confirmed' as const } : o
                              );
                              if (onUpdateUser) onUpdateUser({ ...currentUser, ordersReceived: updated });
                            }}
                            className="px-3 py-1.5 rounded-full bg-slate-950 text-white font-extrabold text-[11px] shadow-sm hover:bg-black cursor-pointer"
                          >
                            Accept & Confirm Order
                          </button>
                        )}

                        {(order.status === 'confirmed' || order.status === 'placed') && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (currentUser.ordersReceived || []).map(o => 
                                o.id === order.id ? { ...o, status: 'processing' as const } : o
                              );
                              if (onUpdateUser) onUpdateUser({ ...currentUser, ordersReceived: updated });
                            }}
                            className="px-3 py-1.5 rounded-full bg-purple-600 text-white font-extrabold text-[11px] shadow-sm hover:bg-purple-700 cursor-pointer"
                          >
                            Move to Factory Processing
                          </button>
                        )}

                        {order.status === 'processing' && (
                          <button
                            type="button"
                            onClick={() => {
                              setDispatchPromptOrder(order);
                              setDispatchTrackingNo(`SHN-TRK-${Math.floor(10000 + Math.random() * 90000)}`);
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white font-extrabold text-[11px] shadow-sm hover:bg-blue-700 cursor-pointer"
                          >
                            Dispatch Consignment
                          </button>
                        )}

                        {order.status === 'dispatched' && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (currentUser.ordersReceived || []).map(o => 
                                o.id === order.id ? { ...o, status: 'delivered' as const } : o
                              );
                              if (onUpdateUser) onUpdateUser({ ...currentUser, ordersReceived: updated });
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] shadow-sm hover:bg-emerald-700 cursor-pointer"
                          >
                            Mark Delivered
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoiceOrder(order);
                            setIsInvoiceModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-slate-800 font-bold text-[11px] hover:bg-slate-50 cursor-pointer shadow-sm"
                        >
                          Invoice
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

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

      {/* 6. ADD PRODUCT MODAL (PHASE 1) */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        currentUser={currentUser}
        onAddProduct={(newProd) => {
          const updatedProds = [newProd, ...(currentUser.products || [])];
          if (onUpdateUser) {
            onUpdateUser({
              ...currentUser,
              products: updatedProds,
            });
          }
        }}
      />

      {/* 7. GST INVOICE MODAL (PHASE 2) */}
      <GstInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        order={selectedInvoiceOrder}
        currentUser={currentUser}
      />

      {/* 8. DISPATCH CONSIGNMENT MODAL */}
      {dispatchPromptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-2xl">
          <div className="apple-glass apple-specular-edge rounded-[32px] w-full max-w-md p-6 space-y-4 border-2 border-white shadow-2xl bg-white/95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-slate-900" />
                <span>Dispatch Consignment to Buyer</span>
              </h3>
              <button
                onClick={() => setDispatchPromptOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{dispatchPromptOrder.productName}</div>
                <div className="text-slate-500">Buyer: {dispatchPromptOrder.buyerName}</div>
                <div className="text-slate-500">Destination: {dispatchPromptOrder.buyerAddress}</div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Logistics / Courier Partner *</label>
                <select
                  value={dispatchCourier}
                  onChange={(e) => setDispatchCourier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="DTDC Express Cargo Freight">DTDC Express Cargo Freight</option>
                  <option value="Blue Dart Express Logistics">Blue Dart Express Logistics</option>
                  <option value="Professional Couriers Cargo">Professional Couriers Cargo</option>
                  <option value="VRL Logistics Road Cargo">VRL Logistics Road Cargo</option>
                  <option value="Delhivery Heavy Freight">Delhivery Heavy Freight</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Tracking / Consignment Note # *</label>
                <input
                  type="text"
                  required
                  value={dispatchTrackingNo}
                  onChange={(e) => setDispatchTrackingNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDispatchPromptOrder(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedReceived = (currentUser.ordersReceived || []).map(o => {
                    if (o.id === dispatchPromptOrder.id) {
                      return {
                        ...o,
                        status: 'dispatched' as const,
                        courierPartner: dispatchCourier,
                        trackingNumber: dispatchTrackingNo || `SHN-TRK-${Math.floor(10000 + Math.random() * 90000)}`,
                        estimatedDelivery: '2-3 Business Days',
                      };
                    }
                    return o;
                  });

                  if (onUpdateUser) {
                    onUpdateUser({
                      ...currentUser,
                      ordersReceived: updatedReceived,
                    });
                  }
                  setDispatchPromptOrder(null);
                }}
                className="px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-black shadow-md hover:bg-black transition cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
