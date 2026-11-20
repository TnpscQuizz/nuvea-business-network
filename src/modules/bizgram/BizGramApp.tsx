import React, { useState, useEffect } from 'react';
import { 
  Home, Film, MessageCircle, Plus, BarChart3, 
  User, Shield, Settings, LogOut, Clock, CheckCircle2, 
  Sparkles, ExternalLink, Menu, X, ArrowRight, Phone, Tag, 
  MapPin, Bell, Search, TrendingUp, ShieldCheck, Camera, Gift, Briefcase,
  Eye, Users, Send, ChevronRight, ChevronDown
} from 'lucide-react';
import type { AppState, BizPost, BizStory, BizEnquiryMessage, BizUser } from '../../types';
import { 
  INITIAL_BIZ_POSTS, 
  INITIAL_BIZ_STORIES, 
  INITIAL_ENQUIRIES,
  DEFAULT_CURRENT_USER 
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

  // Navigation Tab State (Reels replaces Discover as requested)
  const [activeTab, setActiveTab] = useState<'feed' | 'reels' | 'messages' | 'profile' | 'admin'>('feed');

  // Logged-in BizUser state (Shinegah Profile)
  const [currentUser, setCurrentUser] = useState<BizUser>(() => {
    try {
      const saved = localStorage.getItem('nbn_biz_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username === 'shinegah.in') return parsed;
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

  // Modals & Action Menu state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'post' | 'reel' | 'update' | 'offer'>('post');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  const publicReels = publicPosts.filter((p) => p.type === 'video');

  return (
    <div className="bg-[#050508] text-slate-100 min-h-screen flex flex-col md:flex-row selection:bg-white selection:text-black font-sans relative overflow-x-hidden">
      
      {/* Ambient Platinum & Slate Glass Glow Orbs (Strictly No Blue) */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-white/[0.03] rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-slate-500/[0.04] rounded-full blur-[170px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. LEFT DESKTOP SIDEBAR (APPLE LIQUID OBSIDIAN GLASS)                     */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col justify-between w-68 lg:w-72 h-screen sticky top-0 apple-glass border-r border-white/10 p-5 lg:p-6 shrink-0 z-40 select-none shadow-[4px_0_30px_rgba(0,0,0,0.85)]">
        
        {/* Brand Header */}
        <div className="space-y-6">
          
          <div 
            onClick={() => setActiveTab('feed')} 
            className="cursor-pointer group space-y-3"
          >
            <ShinegahLogo size="md" />

            {/* Pill: Built for Businesses. Designed for Growth */}
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5 shadow-inner">
              <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-[10px] leading-tight text-slate-300">
                <span className="font-bold text-white block">Built for Businesses.</span>
                <span className="text-slate-400">Designed for Growth.</span>
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
                  ? 'bg-white text-black shadow-lg font-extrabold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>{t.home}</span>
            </button>

            {/* 2. Reels (Replaces Discover as Requested!) */}
            <button
              onClick={() => setActiveTab('reels')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'reels'
                  ? 'bg-white text-black shadow-lg font-extrabold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
                  ? 'bg-white text-black shadow-lg font-extrabold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <MessageCircle className="w-5 h-5" />
                <span>{t.inbox}</span>
              </div>
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/20">
                5
              </span>
            </button>

            {/* 4. Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'profile'
                  ? 'bg-white text-black shadow-lg font-extrabold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition cursor-pointer text-sm font-bold"
            >
              <Settings className="w-5 h-5" />
              <span>{t.settings}</span>
            </button>

            {/* 6. Admin Console */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'admin'
                  ? 'bg-white text-black shadow-lg font-extrabold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>{t.admin}</span>
            </button>

          </nav>

        </div>

        {/* Bottom Profile Summary Card & Validity Timer */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] transition cursor-pointer border border-white/10"
          >
            <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-white/40 to-white/10 shrink-0">
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border border-black"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-white truncate flex items-center gap-1">
                <span>@{currentUser.username}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser.businessName}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAuthModalOpen(true);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              title="Switch Account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* 1-Year Validity Live Card */}
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-[11px] font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>⏳</span>
              <span>{t.validityLabel}</span>
            </div>
            <span className="bg-white/10 text-white font-mono text-[10px] px-2 py-0.5 rounded-lg font-black border border-white/15">
              {currentUser.validityDaysLeft || 364} {t.daysLeft}
            </span>
          </div>

          {/* Create Post Button (Apple Primary White Button) */}
          <button
            onClick={() => {
              setModalAction('post');
              setIsCreateModalOpen(true);
            }}
            className="w-full py-3 apple-btn-primary rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.create}</span>
          </button>

        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOP NAVBAR (APPLE LIQUID GLASS)                                 */}
      {/* ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 apple-glass border-b border-white/10 px-4 h-16 flex items-center justify-between shadow-lg">
        
        {/* Shinegah Logo */}
        <div 
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ShinegahLogo size="sm" showText={false} />
          <span className="font-black text-lg text-white tracking-tight">
            Shinegah<span className="text-slate-400 text-xs">™</span>
          </span>
        </div>

        {/* Right Search, Bell (badge 3) & Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('reels')}
            className="p-1.5 text-slate-300 hover:text-white transition"
            title="Reels"
          >
            <Film className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className="relative p-1.5 text-slate-300 hover:text-white transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center border border-black shadow-sm">
              3
            </span>
          </button>

          <div 
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-white/40 to-white/10 cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover border border-black"
            />
          </div>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT VIEWPORT CONTAINER                                        */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 max-w-full overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8">
        
        {/* VIEW 1: HOME FEED */}
        {activeTab === 'feed' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Center Feed Column (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* TOP SEARCH BAR IN FEED */}
              <div 
                onClick={() => setActiveTab('reels')}
                className="apple-glass apple-specular-edge rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-white/30 transition shadow-lg"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-xs sm:text-sm text-slate-400 font-medium">
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

              {/* FEED POSTS LIST */}
              <div className="space-y-6">
                {publicPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    lang={currentLang}
                    onLike={handleLike}
                    onSendEnquiry={handleSendEnquiry}
                    onShareWhatsApp={handleShareWhatsApp}
                  />
                ))}
              </div>

            </div>

            {/* Right Desktop Sidebar (5 cols on lg) */}
            <div className="hidden lg:block lg:col-span-5 space-y-5 sticky top-6">
              
              {/* Business Growth Executive Analytics Widget (Exact Reference Card) */}
              <div className="apple-glass apple-specular-edge rounded-[32px] p-6 space-y-5 shadow-2xl">
                {/* Header: Title + Period Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-white">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white tracking-tight">Business Growth</h4>
                      <p className="text-[10px] text-slate-400">Executive Performance</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer">
                    <span>This Month</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>

                {/* Big Stat & Trend */}
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-white tracking-tight">12.4K</span>
                    <span className="text-xs font-black text-emerald-400 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +32%
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Profile Views</div>
                </div>

                {/* Growth Chart Wave Line */}
                <div className="relative h-20 w-full overflow-hidden">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
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
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Glowing dots */}
                    <circle cx="80" cy="40" r="3.5" fill="#ffffff" />
                    <circle cx="160" cy="25" r="3.5" fill="#ffffff" />
                    <circle cx="220" cy="18" r="3.5" fill="#ffffff" />
                    <circle cx="300" cy="8" r="4" fill="#ffffff" stroke="#000" strokeWidth="2" />
                  </svg>
                </div>

                {/* 2x2 Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <Eye className="w-3 h-3 text-white" />
                      <span>Reach</span>
                    </div>
                    <div className="text-base font-black text-white">8.7K</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <Users className="w-3 h-3 text-white" />
                      <span>Connections</span>
                    </div>
                    <div className="text-base font-black text-white">1.2K</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <Send className="w-3 h-3 text-white" />
                      <span>Enquiries</span>
                    </div>
                    <div className="text-base font-black text-white">642</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>Growth</span>
                    </div>
                    <div className="text-base font-black text-emerald-400">+32%</div>
                  </div>
                </div>

                {/* AI Insights Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-white/[0.08] to-white/[0.02] border border-white/15 flex items-center justify-between gap-3 cursor-pointer hover:border-white/30 transition shadow-lg">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-white flex items-center gap-1">
                        <span>AI Insights</span>
                      </div>
                      <div className="text-[11px] text-slate-300 truncate">
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
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">
                    Verified B2B Suppliers
                  </h4>
                  <button
                    onClick={() => setActiveTab('reels')}
                    className="text-xs font-bold text-white/80 hover:text-white cursor-pointer hover:underline"
                  >
                    View Reels ›
                  </button>
                </div>

                <div className="space-y-3">
                  {publicPosts.slice(2, 6).map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => handleSendEnquiry(p)}
                      className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.avatar}
                          alt={p.businessName}
                          className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs text-white truncate flex items-center gap-1">
                            <span>{p.businessName}</span>
                            <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {p.category} • {p.taluk}
                          </div>
                        </div>
                      </div>
                      <button className="px-3.5 py-1.5 bg-white text-black font-extrabold text-[10px] rounded-full shrink-0 shadow-sm hover:bg-slate-200 transition">
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

        {/* VIEW 2: FULLSCREEN 9:16 REELS (REPLACES DISCOVER AS REQUESTED!) */}
        {activeTab === 'reels' && (
          <ReelsView
            reels={publicReels}
            lang={currentLang}
            onLike={handleLike}
            onSendEnquiry={handleSendEnquiry}
            onShareWhatsApp={handleShareWhatsApp}
          />
        )}

        {/* VIEW 3: ENQUIRIES & CHAT (100% TRANSPARENT GLASS INBOX) */}
        {activeTab === 'messages' && (
          <EnquiryChat
            threads={threads}
            lang={currentLang}
            onSendMessage={handleSendMessageInChat}
          />
        )}

        {/* VIEW 4: CORPORATE BUSINESS PROFILE & IN-PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <BusinessProfileView
            currentUser={currentUser}
            posts={posts}
            lang={currentLang}
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
          />
        )}

        {/* VIEW 5: SUPER ADMIN CONSOLE */}
        {activeTab === 'admin' && (
          <SuperAdminConsole
            posts={posts}
            state={state}
            onApprovePost={handleApprovePost}
            onRejectPost={handleRejectPost}
            onDeletePost={handleDeletePost}
            onExitAdmin={() => setActiveTab('feed')}
          />
        )}

      </main>

      {/* ========================================================================= */}
      {/* 4. FLOATING CURVED FROSTED GLASS DOCK (APPLE LIQUID GLASS - NO BLUE)      */}
      {/* ========================================================================= */}
      
      {/* FLOATING ACTION POPUP MENU (ABOVE DOCK CENTER) */}
      {isActionMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-2xl flex items-end justify-center pb-24 px-4 select-none animate-in fade-in duration-200"
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
              className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 flex items-center gap-3.5 transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition shadow-inner shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs sm:text-sm text-white">{t.menuCreatePost}</div>
                <div className="text-[10px] text-slate-400">{t.menuCreatePostSub}</div>
              </div>
            </button>

            {/* 2. Create Reel */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('reel');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 flex items-center gap-3.5 transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition shadow-inner shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs sm:text-sm text-white">{t.menuCreateReel}</div>
                <div className="text-[10px] text-slate-400">{t.menuCreateReelSub}</div>
              </div>
            </button>

            {/* 3. Share Business Update */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('update');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 flex items-center gap-3.5 transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition shadow-inner shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs sm:text-sm text-white">{t.menuBusinessUpdate}</div>
                <div className="text-[10px] text-slate-400">{t.menuBusinessUpdateSub}</div>
              </div>
            </button>

            {/* 4. Post Offer */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('offer');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 flex items-center gap-3.5 transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition shadow-inner shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs sm:text-sm text-white">{t.menuPostOffer}</div>
                <div className="text-[10px] text-slate-400">{t.menuPostOfferSub}</div>
              </div>
            </button>

          </div>
        </div>
      )}

      {/* MOBILE BOTTOM DOCK (REELS REPLACES DISCOVER) */}
      <nav className="md:hidden fixed bottom-4 inset-x-4 z-40 select-none">
        <div className="apple-glass apple-specular-edge rounded-full px-5 py-2.5 shadow-[0_15px_45px_rgba(0,0,0,0.9)] flex items-center justify-between">
          
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'feed' ? 'text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px]">{t.home}</span>
          </button>

          {/* 2. Reels (Replaces Discover as Requested!) */}
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'reels' ? 'text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-5 h-5" />
            <span className="text-[9px]">{t.reels}</span>
          </button>

          {/* 3. Center Glowing Apple Liquid Glass Sphere (No Blue) */}
          <button
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            className="w-14 h-14 -my-5 rounded-full p-[2.5px] bg-gradient-to-tr from-white/40 via-white/15 to-white/5 border border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.2),0_12px_40px_rgba(0,0,0,0.85)] flex items-center justify-center cursor-pointer transition transform hover:scale-105 active:scale-95 z-50"
            title="Create Post or Reel"
          >
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center text-white font-black text-2xl shadow-inner border border-white/20">
              <Plus className={`w-6 h-6 stroke-[3] text-white transition-transform duration-300 ${isActionMenuOpen ? 'rotate-45' : ''}`} />
            </div>
          </button>

          {/* 4. Inbox (Badge 5) */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`relative flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'messages' ? 'text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[9px]">{t.inbox}</span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white text-black text-[8px] font-black rounded-full flex items-center justify-center shadow-sm">
              5
            </span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'profile' ? 'text-white font-black' : 'text-slate-400 hover:text-white'
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

    </div>
  );
};
