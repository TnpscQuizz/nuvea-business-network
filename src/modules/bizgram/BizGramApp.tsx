import React, { useState, useEffect } from 'react';
import { 
  Home, Film, MessageCircle, Plus, BarChart3, 
  User, Shield, Settings, LogOut, Clock, CheckCircle2, 
  Sparkles, ExternalLink, Menu, X, ArrowRight, Phone, Tag, 
  MapPin, Bell, Search, TrendingUp, ShieldCheck, Camera, Gift, Briefcase,
  Eye, Users, Send, ChevronRight, ChevronDown
} from 'lucide-react';
import type { AppState, BizPost, BizStory, BizEnquiryMessage, BizUser, BizProduct, BizOrder } from '../../types';
import { 
  INITIAL_BIZ_POSTS, 
  INITIAL_BIZ_STORIES, 
  INITIAL_ENQUIRIES,
  DEFAULT_CURRENT_USER,
  INITIAL_REGISTERED_USERS
} from './data/bizGramData';
import { translations, type Language } from './data/translations';
import { ShinegahLogo } from './components/ShinegahLogo';
import { StoriesBar } from './components/StoriesBar';
import { PostCard } from './components/PostCard';
import { ReelsView } from './components/ReelsView';
import { CreateModal } from './components/CreateModal';
import { EnquiryChat } from './components/EnquiryChat';
import { BusinessProfileView } from './components/BusinessProfileView';
import { SuperAdminConsole } from './components/SuperAdminConsole';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { AuthModal } from './components/AuthModal';
import { RegistrationModal } from '../../components/RegistrationModal';
import { SearchView } from './components/SearchView';
import { BusinessAuthGate } from './components/BusinessAuthGate';
import { InstantCheckoutModal, type CheckoutItem } from './components/InstantCheckoutModal';

interface BizGramAppProps {
  state: AppState;
  updateState: (newState: AppState) => void;
  lang: 'ta' | 'en';
  onExit?: () => void;
}

export const BizGramApp: React.FC<BizGramAppProps> = ({
  state,
  updateState,
  lang: initialLang,
  onExit,
}) => {
  // Authentication Gate State (Mandatory registration / login before entering home screen)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nbn_biz_authenticated') === 'true';
  });

  // Dedicated Super Admin Portal View State (#admin URL hash or button trigger)
  const [isSuperAdminView, setIsSuperAdminView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin';
    }
    return false;
  });

  // Registered Users Directory with verification status (Persisted in localStorage)
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

  // Persist registeredUsers changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nbn_registered_users', JSON.stringify(registeredUsers));
    } catch {}
  }, [registeredUsers]);

  // Profile initial active tab (allows direct deep link into 'store' tab)
  const [profileInitialTab, setProfileInitialTab] = useState<'posts' | 'store' | 'orders' | 'reels' | 'outlets' | 'requests' | 'reviews' | 'referrals' | 'settings'>('posts');

  // Listen to hashchange for direct #admin or #store-<username> / #@<username> navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setIsSuperAdminView(true);
        return;
      }
      if (hash.startsWith('#store-') || hash.startsWith('#@')) {
        const targetUsername = hash.replace(/^#(store-|@)/, '').toLowerCase();
        const found = registeredUsers.find(
          (u) => u.username.toLowerCase() === targetUsername || u.id.toLowerCase() === targetUsername
        );
        if (found) {
          setCurrentUser(found);
          setProfileInitialTab('store');
          setActiveTab('profile');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [registeredUsers]);

  // Language State: English by default, togglable in Settings
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('nbn_biz_lang');
    if (saved === 'ta' || saved === 'en') return saved;
    return 'en';
  });

  const t = translations[currentLang] || translations.en;

  const handleToggleLang = (newLang: Language) => {
    setCurrentLang(newLang);
    localStorage.setItem('nbn_biz_lang', newLang);
  };

  const handleLogout = () => {
    localStorage.removeItem('nbn_biz_authenticated');
    setIsAuthenticated(false);
  };

  // Navigation Tab State (Feed, Mandatory Search, Reels, Messages, Profile, Admin)
  const [activeTab, setActiveTab] = useState<'feed' | 'search' | 'reels' | 'messages' | 'profile' | 'admin'>('feed');

  // Trade Intent Filter for Home Feed (Pillar 4: I NEED / I OFFER / I COLLABORATE)
  const [feedIntentFilter, setFeedIntentFilter] = useState<'all' | 'need' | 'offer' | 'collaborate'>('all');

  // Logged-in BizUser state (Shinegah Profile)
  const [currentUser, setCurrentUser] = useState<BizUser>(() => {
    try {
      const saved = localStorage.getItem('nbn_biz_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username === 'shinegah.in') {
          return {
            ...DEFAULT_CURRENT_USER,
            ...parsed,
            products: parsed.products && parsed.products.length > 0 ? parsed.products : DEFAULT_CURRENT_USER.products,
            ordersPlaced: parsed.ordersPlaced && parsed.ordersPlaced.length > 0 ? parsed.ordersPlaced : DEFAULT_CURRENT_USER.ordersPlaced,
            ordersReceived: parsed.ordersReceived && parsed.ordersReceived.length > 0 ? parsed.ordersReceived : DEFAULT_CURRENT_USER.ordersReceived,
          };
        }
      }
      return DEFAULT_CURRENT_USER;
    } catch {
      return DEFAULT_CURRENT_USER;
    }
  });

  // Posts state
  const [posts, setPosts] = useState<BizPost[]>(() => {
    try {
      const saved = localStorage.getItem('nbn_biz_posts');
      if (saved) {
        const parsed: BizPost[] = JSON.parse(saved);
        if (parsed.length >= 8 && parsed[0]?.businessName === 'Shinegah') return parsed;
      }
      return INITIAL_BIZ_POSTS;
    } catch {
      return INITIAL_BIZ_POSTS;
    }
  });

  const [stories, setStories] = useState<BizStory[]>(INITIAL_BIZ_STORIES);
  const [threads, setThreads] = useState(INITIAL_ENQUIRIES);
  const [selectedEnquiryPost, setSelectedEnquiryPost] = useState<BizPost | null>(null);

  // E-Commerce Instant Checkout & Orders state (Phase 1 & 2)
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [orderPlacedToast, setOrderPlacedToast] = useState<{ orderNumber: string; productName: string } | null>(null);

  // Modals & Action Menu state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'post' | 'reel' | 'update' | 'offer'>('post');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Handle Buy Now from Post or Reel
  const handleBuyNowFromPost = (post: BizPost) => {
    let price = 18500;
    if (post.priceTag) {
      const digits = post.priceTag.replace(/[^0-9]/g, '');
      if (digits) price = parseInt(digits, 10);
    }
    setCheckoutItem({
      id: post.id,
      name: `${post.businessName} - ${post.caption.slice(0, 45)}...`,
      sellerId: post.memberId,
      sellerName: post.businessName,
      price,
      moq: 5,
      unit: 'Consignment Lots',
      image: post.thumbnailUrl || post.mediaUrl,
      gstRate: 18,
      sampleAvailable: true,
      samplePrice: Math.round(price * 0.15),
    });
    setIsCheckoutModalOpen(true);
  };

  // Handle Buy Now from Wholesale Product
  const handleBuyNowFromProduct = (prod: BizProduct) => {
    setCheckoutItem({
      id: prod.id,
      name: prod.name,
      sellerId: prod.sellerId,
      sellerName: prod.sellerName,
      price: prod.price,
      moq: prod.moq,
      unit: prod.unit,
      image: prod.image,
      gstRate: prod.gstRate,
      sampleAvailable: prod.sampleAvailable,
      samplePrice: prod.samplePrice,
    });
    setIsCheckoutModalOpen(true);
  };

  // Handle Order Placed successfully
  const handleOrderPlaced = (newOrder: BizOrder) => {
    const updatedPlaced = [newOrder, ...(currentUser.ordersPlaced || [])];
    let updatedReceived = currentUser.ordersReceived || [];
    if (newOrder.sellerId === currentUser.id) {
      updatedReceived = [newOrder, ...updatedReceived];
    }

    const updatedUser: BizUser = {
      ...currentUser,
      ordersPlaced: updatedPlaced,
      ordersReceived: updatedReceived,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('nbn_biz_current_user', JSON.stringify(updatedUser));

    setOrderPlacedToast({
      orderNumber: newOrder.orderNumber,
      productName: newOrder.productName,
    });

    setTimeout(() => setOrderPlacedToast(null), 5000);
  };

  // Save currentUser to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nbn_biz_current_user', JSON.stringify(currentUser));
    } catch (e) {
      // ignore
    }
  }, [currentUser]);

  // Save posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nbn_biz_posts', JSON.stringify(posts));
    } catch (e) {
      // ignore
    }
  }, [posts]);

  // Handle Likes
  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  // Handle Creating New Post / Reel
  const handleCreatePost = (newPost: BizPost) => {
    setPosts([newPost, ...posts]);
  };

  // Super Admin Post Moderation Handlers
  const handleApprovePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'approved' } : p))
    );
    alert('Post approved for verified network feed.');
  };

  const handleRejectPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'rejected' } : p))
    );
    alert('Post rejected.');
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  // Super Admin User Registration Approval Handlers
  const handleApproveUser = (userId: string) => {
    setRegisteredUsers((prev) => {
      const updated = prev.map((u) =>
        u.id === userId ? { ...u, verificationStatus: 'approved' as const } : u
      );
      try {
        localStorage.setItem('nbn_registered_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRejectUser = (userId: string, reason?: string) => {
    setRegisteredUsers((prev) => {
      const updated = prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              verificationStatus: 'rejected' as const,
              rejectionReason: reason || 'Compliance / Incomplete business credentials',
            }
          : u
      );
      try {
        localStorage.setItem('nbn_registered_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Handle Enquiry click from Post or Reel -> Opens Messages tab with attached card
  const handleSendEnquiry = (post: BizPost, customMsg?: string) => {
    setSelectedEnquiryPost(post);
    
    const newMsg: BizEnquiryMessage = {
      id: `msg_${Date.now()}`,
      threadId: 'th_ramesh',
      senderId: currentUser.id,
      senderName: `${currentUser.ownerName} (@${currentUser.username})`,
      text: customMsg || `Hello! Inquiring regarding "${post.businessName}" - "${post.caption.slice(0, 45)}...". Please share the wholesale pricing and details.`,
      attachedPostId: post.id,
      attachedPostTitle: post.caption.slice(0, 45),
      attachedPostThumb: post.thumbnailUrl || post.mediaUrl,
      attachedPrice: post.priceTag,
      timestamp: 'Just now',
    };

    setThreads((prev) =>
      prev.map((th, i) => {
        if (i === 0) {
          return {
            ...th,
            lastMessage: newMsg.text,
            lastTime: 'Just now',
            messages: [...th.messages, newMsg],
          };
        }
        return th;
      })
    );

    setActiveTab('messages');
  };

  // Handle Sending Messages in Chat
  const handleSendMessageInChat = (threadId: string, text: string, quotationData?: any) => {
    const newMsg: BizEnquiryMessage = {
      id: `msg_${Date.now()}`,
      threadId,
      senderId: currentUser.id,
      senderName: currentUser.ownerName,
      text,
      isQuotation: !!quotationData,
      quotationData,
      timestamp: 'Just now',
    };

    setThreads((prev) =>
      prev.map((th) => {
        if (th.threadId === threadId) {
          return {
            ...th,
            lastMessage: quotationData ? 'Official Quotation Sent' : text,
            lastTime: 'Just now',
            messages: [...th.messages, newMsg],
          };
        }
        return th;
      })
    );
  };

  // Handle WhatsApp Share
  const handleShareWhatsApp = (post: BizPost) => {
    const text = encodeURIComponent(
      `Hello! Check out "${post.businessName}" on Shinegah Enterprise Network:\n\n"${post.caption}"\nPrice: ${post.priceTag || 'Contact for details'}\n\nhttps://shinegah.in`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Filter approved posts, exclude blocked users
  const nonBlockedPosts = posts.filter(
    (p) => !currentUser.blockedUsers?.some((b) => p.businessName.toLowerCase().includes(b.toLowerCase()))
  );

  const publicPosts = nonBlockedPosts
    .filter((p) => p.status === 'approved' || !p.status);

  const displayedFeedPosts = publicPosts.filter(
    (p) => feedIntentFilter === 'all' || p.tradeIntent === feedIntentFilter
  );

  const publicReels = publicPosts.filter((p) => p.type === 'video');

  // Dedicated Standalone Super Admin Portal (#admin or directly triggered)
  if (isSuperAdminView) {
    return (
      <SuperAdminConsole
        posts={posts}
        state={state}
        registeredUsers={registeredUsers}
        onApproveUser={handleApproveUser}
        onRejectUser={handleRejectUser}
        onApprovePost={handleApprovePost}
        onRejectPost={handleRejectPost}
        onDeletePost={handleDeletePost}
        onExitAdmin={() => {
          setIsSuperAdminView(false);
          if (typeof window !== 'undefined' && window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
          setActiveTab('feed');
        }}
      />
    );
  }

  // Mandatory Business Authentication Gate (User must register/login before entering home screen)
  // Exception: If a buyer or visitor arrives via direct public digital store link (#store- or #@), allow them to view the digital store!
  if (!isAuthenticated) {
    const isDirectStoreVisit = typeof window !== 'undefined' && (window.location.hash.startsWith('#store-') || window.location.hash.startsWith('#@'));
    if (!isDirectStoreVisit) {
      return (
        <BusinessAuthGate
          lang={currentLang}
          onOpenSuperAdmin={() => {
            setIsSuperAdminView(true);
            if (typeof window !== 'undefined') {
              window.location.hash = 'admin';
            }
          }}
          onAuthenticated={(user) => {
            setCurrentUser(user);
            setIsAuthenticated(true);
            localStorage.setItem('nbn_biz_authenticated', 'true');
          }}
        />
      );
    }
  }

  return (
    <div className="white-glow-canvas text-slate-900 min-h-screen flex flex-col md:flex-row selection:bg-black selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Radiant White Glow Transparent Ambient Light Orbs with Minute Shinegah Signature Aura */}
      {/* 1. Top-Left Delicate Royal Cobalt Blue Glow (Minutely Visible behind Glass) */}
      <div className="fixed -top-28 -left-20 w-[550px] h-[550px] bg-gradient-to-br from-blue-600/10 via-indigo-600/08 to-transparent rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* 2. Top-Center Radiant White Apple Luminous Core */}
      <div className="fixed -top-20 left-1/4 w-[600px] h-[600px] bg-white rounded-full blur-[140px] pointer-events-none -z-10 opacity-95" />

      {/* 3. Center-Right Delicate Violet / Magenta Aura */}
      <div className="fixed top-1/3 -right-20 w-[520px] h-[520px] bg-gradient-to-bl from-purple-600/08 via-pink-600/06 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* 4. Bottom-Right Warm Sunset Amber & Orange Radiant Aura */}
      <div className="fixed bottom-0 right-10 w-[520px] h-[520px] bg-gradient-to-tr from-amber-500/10 via-orange-500/08 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* 5. Bottom-Left Soft White/Slate Feathering */}
      <div className="fixed -bottom-20 left-10 w-[550px] h-[550px] bg-slate-200/50 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. LEFT DESKTOP SIDEBAR (APPLE WHITE GLOW TRANSPARENT GLASS)              */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col justify-between w-68 lg:w-72 h-screen sticky top-0 apple-glass border-r border-white/80 p-5 lg:p-6 shrink-0 z-40 select-none shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
        
        {/* Brand Header */}
        <div className="space-y-6">
          
          <div 
            onClick={() => setActiveTab('feed')} 
            className="cursor-pointer group space-y-3"
          >
            <ShinegahLogo size="md" />

            {/* Pill: Built for Businesses. Designed for Growth */}
            <div className="p-2.5 rounded-2xl bg-white/70 border border-white flex items-center gap-2.5 shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-slate-950 text-white flex items-center justify-center shrink-0 shadow-sm">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="text-[10px] leading-tight text-slate-700">
                <span className="font-bold text-slate-950 block">Built for Businesses.</span>
                <span className="text-slate-500">Designed for Growth.</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            
            {/* 1. Home / Feed */}
            <button
              onClick={() => setActiveTab('feed')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'feed'
                  ? 'bg-slate-950 text-white shadow-md font-extrabold'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-950'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>{t.home}</span>
            </button>

            {/* 2. Mandatory Search */}
            <button
              onClick={() => setActiveTab('search')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'search'
                  ? 'bg-slate-950 text-white shadow-md font-extrabold'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-950'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>{t.search}</span>
            </button>

            {/* 3. Reels (Full Screen Instagram Reels) */}
            <button
              onClick={() => setActiveTab('reels')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'reels'
                  ? 'bg-slate-950 text-white shadow-md font-extrabold'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Film className="w-5 h-5" />
                <span>{t.reels}</span>
              </div>
              <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                HOT
              </span>
            </button>

            {/* 3. Messages / Inbox */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'messages'
                  ? 'bg-slate-950 text-white shadow-md font-extrabold'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <MessageCircle className="w-5 h-5" />
                <span>{t.inbox}</span>
              </div>
              <span className="bg-slate-950 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white">
                5
              </span>
            </button>

            {/* 4. Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'profile'
                  ? 'bg-slate-950 text-white shadow-md font-extrabold'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-950'
              }`}
            >
              <User className="w-5 h-5" />
              <span>{t.profile}</span>
            </button>

            {/* 5. Settings */}
            <button
              onClick={() => {
                setActiveTab('profile');
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-600 hover:bg-white/80 hover:text-slate-950 transition cursor-pointer text-sm font-bold"
            >
              <Settings className="w-5 h-5" />
              <span>{t.settings}</span>
            </button>

            {/* 6. Admin Console */}
            <button
              onClick={() => {
                setIsSuperAdminView(true);
                if (typeof window !== 'undefined') {
                  window.location.hash = 'admin';
                }
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                isSuperAdminView || activeTab === 'admin'
                  ? 'bg-slate-950 text-white shadow-md font-extrabold'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-950'
              }`}
            >
              <Shield className="w-5 h-5 text-amber-400" />
              <span>{t.admin}</span>
            </button>

          </nav>

        </div>

        {/* Bottom Profile Summary Card & Validity Timer */}
        <div className="pt-4 border-t border-white/80 space-y-3">
          
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2 rounded-2xl bg-white/70 hover:bg-white/95 transition cursor-pointer border border-white shadow-sm"
          >
            <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-white to-slate-200 shrink-0 shadow-sm">
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border border-white"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-slate-900 truncate flex items-center gap-1">
                <span>@{currentUser.username}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-900 fill-slate-200" />
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {currentUser.businessName}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAuthModalOpen(true);
              }}
              className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-slate-900 cursor-pointer"
              title="Switch Account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* 1-Year Validity Live Card */}
          <div className="p-2.5 rounded-xl bg-white/70 border border-white text-slate-900 text-[11px] font-bold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>⏳</span>
              <span>{t.validityLabel}</span>
            </div>
            <span className="bg-slate-950 text-white font-mono text-[10px] px-2 py-0.5 rounded-lg font-black shadow-sm">
              {currentUser.validityDaysLeft || 364} {t.daysLeft}
            </span>
          </div>

          {/* Create Post Button (Apple Obsidian Primary Button) */}
          <button
            onClick={() => {
              setModalAction('post');
              setIsCreateModalOpen(true);
            }}
            className="w-full py-3 apple-btn-primary rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.create}</span>
          </button>

        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOP NAVBAR (APPLE WHITE GLOW TRANSPARENT GLASS)                 */}
      {/* ========================================================================= */}
      <header className={`md:hidden sticky top-0 z-40 apple-glass border-b border-white/80 px-4 h-16 flex items-center justify-between shadow-sm ${activeTab === 'reels' ? 'hidden' : 'flex'}`}>
        
        {/* Shinegah Logo */}
        <div 
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ShinegahLogo size="sm" showText={false} />
          <span className="font-black text-lg text-slate-900 tracking-tight">
            Shinegah<span className="text-slate-500 text-xs">™</span>
          </span>
        </div>

        {/* Right Search, Bell (badge 3) & Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('search')}
            className="p-1.5 text-slate-600 hover:text-slate-950 transition cursor-pointer"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className="relative p-1.5 text-slate-600 hover:text-slate-950 transition cursor-pointer"
            title="Messages"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
              3
            </span>
          </button>

          <div 
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-white to-slate-200 cursor-pointer shadow-sm"
          >
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover border border-white"
            />
          </div>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT VIEWPORT CONTAINER                                        */}
      {/* ========================================================================= */}
      <main className={`flex-1 min-w-0 max-w-full overflow-y-auto ${activeTab === 'reels' ? 'p-0 md:px-6 md:py-6' : 'px-3 sm:px-6 lg:px-8 py-4 sm:py-6'} pb-24 md:pb-8`}>
        
        {/* VIEW 1: HOME FEED */}
        {activeTab === 'feed' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Center Feed Column (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* TOP SEARCH BAR IN FEED */}
              <div 
                onClick={() => setActiveTab('search')}
                className="apple-glass apple-specular-edge rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-white transition shadow-sm"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span className="text-xs sm:text-sm text-slate-600 font-medium">
                  {t.searchPlaceholder}
                </span>
              </div>

              {/* STORIES CAROUSEL */}
              <StoriesBar
                stories={stories}
                currentUserAvatar={currentUser.avatar}
                lang={currentLang}
                onOpenCreateStory={() => {
                  setModalAction('post');
                  setIsCreateModalOpen(true);
                }}
                onSendStoryReply={(story, text) => {
                  handleSendMessageInChat('th_ramesh', `[Story Reply]: ${text}`);
                  setActiveTab('messages');
                }}
              />

              {/* PILLAR 4: I NEED / I OFFER / I COLLABORATE TRADE MATCH FILTER BAR */}
              <div className="flex items-center gap-1.5 p-1 rounded-full apple-glass border border-white shadow-sm overflow-x-auto text-xs font-black">
                {[
                  { id: 'all', label: 'All B2B Posts' },
                  { id: 'need', label: '🔵 I NEED (Requirements)' },
                  { id: 'offer', label: '🟢 I OFFER (Wholesale Deals)' },
                  { id: 'collaborate', label: '🟣 I COLLABORATE (Joint Ventures)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFeedIntentFilter(item.id as any)}
                    className={`px-3.5 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
                      feedIntentFilter === item.id
                        ? 'bg-slate-950 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/70'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* FEED POSTS LIST */}
              <div className="space-y-6">
                {displayedFeedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    lang={currentLang}
                    onLike={handleLike}
                    onSendEnquiry={handleSendEnquiry}
                    onShareWhatsApp={handleShareWhatsApp}
                    onBuyNow={handleBuyNowFromPost}
                  />
                ))}
              </div>

            </div>

            {/* Right Desktop Sidebar (5 cols on lg) */}
            <div className="hidden lg:block lg:col-span-5 space-y-5 sticky top-6">
              
              {/* Business Growth Executive Analytics Widget (Exact Reference Card) */}
              <div className="apple-glass apple-specular-edge rounded-[32px] p-6 space-y-5 shadow-xl">
                {/* Header: Title + Period Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white border border-white text-slate-900 shadow-sm">
                      <BarChart3 className="w-4 h-4 text-slate-900" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">Business Growth</h4>
                      <p className="text-[10px] text-slate-500">Executive Performance</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-white text-slate-800 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
                    <span>This Month</span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </div>
                </div>

                {/* Big Stat & Trend */}
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">12.4K</span>
                    <span className="text-xs font-black text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +32%
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Profile Views</div>
                </div>

                {/* Growth Chart Wave Line */}
                <div className="relative h-20 w-full overflow-hidden">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#09090b" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#09090b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d="M0,55 Q40,48 80,40 T160,25 T220,18 T300,8 L300,70 L0,70 Z"
                      fill="url(#growthGrad)"
                    />
                    {/* Glowing Stroke line */}
                    <path
                      d="M0,55 Q40,48 80,40 T160,25 T220,18 T300,8"
                      fill="none"
                      stroke="#09090b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Glowing dots */}
                    <circle cx="80" cy="40" r="3.5" fill="#09090b" />
                    <circle cx="160" cy="25" r="3.5" fill="#09090b" />
                    <circle cx="220" cy="18" r="3.5" fill="#09090b" />
                    <circle cx="300" cy="8" r="4" fill="#09090b" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>

                {/* 2x2 Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-white/70 border border-white hover:bg-white transition space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <Eye className="w-3 h-3 text-slate-700" />
                      <span>Reach</span>
                    </div>
                    <div className="text-base font-black text-slate-900">8.7K</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/70 border border-white hover:bg-white transition space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <Users className="w-3 h-3 text-slate-700" />
                      <span>Connections</span>
                    </div>
                    <div className="text-base font-black text-slate-900">1.2K</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/70 border border-white hover:bg-white transition space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <Send className="w-3 h-3 text-slate-700" />
                      <span>Enquiries</span>
                    </div>
                    <div className="text-base font-black text-slate-900">642</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/70 border border-white hover:bg-white transition space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span>Growth</span>
                    </div>
                    <div className="text-base font-black text-emerald-600">+32%</div>
                  </div>
                </div>

                {/* AI Insights Banner */}
                <div className="p-3.5 rounded-2xl bg-white/80 border border-white flex items-center justify-between gap-3 cursor-pointer hover:bg-white transition shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <span>AI Insights</span>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        Your post reach is 32% higher than last month!
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>

              {/* Executive Network Overview Card */}
              <div className="apple-glass apple-specular-edge rounded-[32px] p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                    Verified B2B Suppliers
                  </h4>
                  <button
                    onClick={() => setActiveTab('reels')}
                    className="text-xs font-bold text-slate-700 hover:text-slate-950 cursor-pointer hover:underline"
                  >
                    View Reels ›
                  </button>
                </div>

                <div className="space-y-3">
                  {publicPosts.slice(2, 6).map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => handleSendEnquiry(p)}
                      className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white transition flex items-center justify-between gap-3 cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.avatar}
                          alt={p.businessName}
                          className="w-10 h-10 rounded-full object-cover border border-white shrink-0 shadow-sm"
                        />
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs text-slate-900 truncate flex items-center gap-1">
                            <span>{p.businessName}</span>
                            <CheckCircle2 className="w-3 h-3 text-slate-900 fill-slate-200 shrink-0" />
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {p.category} • {p.taluk}
                          </div>
                        </div>
                      </div>
                      <button className="px-3.5 py-1.5 bg-slate-950 text-white font-extrabold text-[10px] rounded-full shrink-0 shadow-sm hover:bg-black transition">
                        {t.enquire}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clean Footer Info */}
              <div className="text-[11px] text-slate-500 space-y-1 px-3">
                <div>Shinegah™ • Connect • Collaborate • Grow</div>
                <div>The Next-Gen Business Social Network</div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW: MANDATORY SEARCH & EXPLORE (USER REQUESTED MANDATORY SEARCH!) */}
        {activeTab === 'search' && (
          <SearchView
            posts={publicPosts}
            lang={currentLang}
            onSelectPost={(post) => {
              if (post.type === 'video') {
                setActiveTab('reels');
              } else {
                handleSendEnquiry(post);
              }
            }}
            onSendEnquiry={handleSendEnquiry}
          />
        )}

        {/* VIEW 2: FULLSCREEN 9:16 REELS (REPLACES DISCOVER AS REQUESTED!) */}
        {activeTab === 'reels' && (
          <ReelsView
            reels={publicReels}
            lang={currentLang}
            onLike={handleLike}
            onSendEnquiry={handleSendEnquiry}
            onShareWhatsApp={handleShareWhatsApp}
            onBuyNow={handleBuyNowFromPost}
          />
        )}

        {/* VIEW 3: ENQUIRIES & CHAT (100% TRANSPARENT GLASS INBOX WITH FOLLOW GATE) */}
        {activeTab === 'messages' && (
          <EnquiryChat
            threads={threads}
            lang={currentLang}
            approvedConnections={currentUser.approvedConnections}
            onSendMessage={handleSendMessageInChat}
          />
        )}

        {/* VIEW 4: CORPORATE BUSINESS PROFILE & IN-PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <BusinessProfileView
            currentUser={currentUser}
            posts={posts}
            lang={currentLang}
            initialTab={profileInitialTab}
            onToggleLang={handleToggleLang}
            onOpenCreateModal={() => {
              setModalAction('post');
              setIsCreateModalOpen(true);
            }}
            onOpenRenewModal={() => setIsRegisterModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSelectPost={(post) => {
              if (post.type === 'video') {
                setActiveTab('reels');
              } else {
                handleSendEnquiry(post);
              }
            }}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onLogout={handleLogout}
            onBuyProduct={handleBuyNowFromProduct}
            onSendEnquiry={handleSendEnquiry}
          />
        )}

        {/* VIEW 5: SUPER ADMIN CONSOLE */}
        {activeTab === 'admin' && (
          <SuperAdminConsole
            posts={posts}
            state={state}
            registeredUsers={registeredUsers}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
            onApprovePost={handleApprovePost}
            onRejectPost={handleRejectPost}
            onDeletePost={handleDeletePost}
            onExitAdmin={() => {
              setActiveTab('feed');
              setIsSuperAdminView(false);
              if (typeof window !== 'undefined' && window.location.hash === '#admin') {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }}
          />
        )}

      </main>

      {/* ========================================================================= */}
      {/* 4. FLOATING CURVED FROSTED GLASS DOCK (APPLE LIQUID GLASS - NO BLUE)      */}
      {/* ========================================================================= */}
      
      {/* FLOATING ACTION POPUP MENU (ABOVE DOCK CENTER) */}
      {isActionMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-2xl flex items-end justify-center pb-24 px-4 select-none animate-in fade-in duration-200"
          onClick={() => setIsActionMenuOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs apple-glass apple-specular-edge rounded-[32px] p-3 space-y-2.5 shadow-2xl"
          >
            {/* 1. Create Post */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('post');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-3 rounded-2xl bg-white/75 hover:bg-white border border-white flex items-center gap-3.5 transition cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs sm:text-sm text-slate-900">{t.menuCreatePost}</div>
                <div className="text-[10px] text-slate-500">{t.menuCreatePostSub}</div>
              </div>
            </button>

            {/* 2. Create Reel */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('reel');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-3 rounded-2xl bg-white/75 hover:bg-white border border-white flex items-center gap-3.5 transition cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs sm:text-sm text-slate-900">{t.menuCreateReel}</div>
                <div className="text-[10px] text-slate-500">{t.menuCreateReelSub}</div>
              </div>
            </button>

            {/* 3. Share Business Update */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('update');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-3 rounded-2xl bg-white/75 hover:bg-white border border-white flex items-center gap-3.5 transition cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs sm:text-sm text-slate-900">{t.menuBusinessUpdate}</div>
                <div className="text-[10px] text-slate-500">{t.menuBusinessUpdateSub}</div>
              </div>
            </button>

            {/* 4. Post Offer */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('offer');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-3 rounded-2xl bg-white/75 hover:bg-white border border-white flex items-center gap-3.5 transition cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center group-hover:scale-110 transition shadow-sm shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs sm:text-sm text-slate-900">{t.menuPostOffer}</div>
                <div className="text-[10px] text-slate-500">{t.menuPostOfferSub}</div>
              </div>
            </button>

          </div>
        </div>
      )}

      {/* MOBILE BOTTOM DOCK (HOME | SEARCH | PLUS | REELS | PROFILE) */}
      <nav className={`md:hidden fixed bottom-4 inset-x-4 z-40 select-none ${activeTab === 'reels' ? 'opacity-90' : ''}`}>
        <div className="apple-glass apple-specular-edge rounded-full px-5 py-2.5 shadow-[0_15px_40px_rgba(15,23,42,0.1),0_0_35px_rgba(255,255,255,0.9)] flex items-center justify-between">
          
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'feed' ? 'text-slate-950 font-black' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px]">{t.home}</span>
          </button>

          {/* 2. Mandatory Search */}
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'search' ? 'text-slate-950 font-black' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[9px]">{t.search}</span>
          </button>

          {/* 3. Center Glowing Apple Liquid Glass Sphere (Minute Shinegah Prismatic Aura) */}
          <button
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            className="w-14 h-14 -my-5 rounded-full p-[2px] bg-gradient-to-tr from-blue-600/40 via-purple-600/35 to-amber-500/45 border border-white shadow-[0_0_35px_rgba(255,255,255,1),0_10px_25px_rgba(15,23,42,0.15),0_0_20px_rgba(37,99,235,0.2),0_0_15px_rgba(249,115,22,0.18)] flex items-center justify-center cursor-pointer transition transform hover:scale-105 active:scale-95 z-50"
            title="Create Post or Reel"
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-black text-2xl shadow-md">
              <Plus className={`w-6 h-6 stroke-[3] text-white transition-transform duration-300 ${isActionMenuOpen ? 'rotate-45' : ''}`} />
            </div>
          </button>

          {/* 4. Reels */}
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'reels' ? 'text-slate-950 font-black' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <Film className="w-5 h-5" />
            <span className="text-[9px]">{t.reels}</span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'profile' ? 'text-slate-950 font-black' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[9px]">{t.profile}</span>
          </button>

        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 5. MODALS                                                                 */}
      {/* ========================================================================= */}
      
      {/* Create Modal */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePost={handleCreatePost}
        initialAction={modalAction}
        lang={currentLang}
        currentUser={{
          businessName: currentUser.businessName,
          ownerName: currentUser.ownerName,
          avatar: currentUser.avatar,
          taluk: currentUser.taluk,
          category: currentUser.category,
          phone: currentUser.phone,
        }}
      />

      {/* Settings Modal (Also accessible via Profile tab) */}
      <ProfileSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser(updated)}
        onLogout={handleLogout}
      />

      {/* Auth / Switch Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(loggedInUser) => setCurrentUser(loggedInUser)}
      />

      {/* Membership Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        lang={currentLang}
        initialOption="networking_marketplace"
        chapters={state?.chapters || []}
        onSuccessLogin={(regData) => {
          setIsRegisterModalOpen(false);
          alert('Membership updated successfully.');
        }}
      />

      {/* Instant B2B Checkout Modal (Phase 1 & Phase 2) */}
      <InstantCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        item={checkoutItem}
        buyerUser={currentUser}
        onOrderSuccess={handleOrderPlaced}
        lang={currentLang}
      />

      {/* Live Order Confirmation Toast Notification */}
      {orderPlacedToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 apple-glass apple-specular-edge rounded-2xl p-4 border border-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 max-w-sm bg-white/95">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span>Order Placed Successfully!</span>
              <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {orderPlacedToast.orderNumber}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 truncate mt-0.5">
              {orderPlacedToast.productName}
            </p>
          </div>
          <button
            onClick={() => setOrderPlacedToast(null)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
