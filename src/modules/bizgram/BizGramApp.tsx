import React, { useState, useEffect } from 'react';
import { 
  Home, Compass, Film, MessageCircle, Plus, BarChart3, 
  User, Shield, Settings, LogOut, Clock, CheckCircle2, 
  Sparkles, ExternalLink, Menu, X, ArrowRight, Phone, Tag, 
  MapPin, Bell, Search, TrendingUp, ShieldCheck, Camera, Gift, Briefcase 
} from 'lucide-react';
import type { AppState, BizPost, BizStory, BizEnquiryMessage, BizUser } from '../../types';
import { 
  INITIAL_BIZ_POSTS, 
  INITIAL_BIZ_STORIES, 
  INITIAL_ENQUIRIES,
  DEFAULT_CURRENT_USER 
} from './data/bizGramData';
import { ShinegahLogo } from './components/ShinegahLogo';
import { StoriesBar } from './components/StoriesBar';
import { PostCard } from './components/PostCard';
import { ReelsView } from './components/ReelsView';
import { CreateModal } from './components/CreateModal';
import { EnquiryChat } from './components/EnquiryChat';
import { BusinessProfileView } from './components/BusinessProfileView';
import { ExploreView } from './components/ExploreView';
import { InsightsView } from './components/InsightsView';
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
  lang,
  onExit,
}) => {
  // Navigation Tab State (home, discover, reels, messages, insights, profile, admin)
  const [activeTab, setActiveTab] = useState<
    'feed' | 'explore' | 'reels' | 'messages' | 'insights' | 'profile' | 'admin'
  >('feed');

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
        if (parsed.length >= 24 && parsed[0]?.businessName === 'Shinegah') return parsed;
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
    alert('போஸ்ட் வெற்றிகரமாக அங்கீகரிக்கப்பட்டது (Approved)! இப்போது பப்ளிக் ரீல்ஸ் மற்றும் எக்ஸ்ப்ளோரில் தோன்றும்.');
  };

  const handleRejectPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'rejected' } : p))
    );
    alert('போஸ்ட் நிராகரிக்கப்பட்டது (Rejected).');
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('இந்த பதிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா?')) {
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
      text: customMsg || `Hello! Enquiring regarding "${post.businessName}" - "${post.caption.slice(0, 40)}...". Please share the wholesale pricing and details.`,
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
            lastMessage: quotationData ? 'Quotation Sent' : text,
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
      `வணக்கம்! Shinegah B2B Network-ல் "${post.businessName}" அவர்களின் வணிக பதிவு:\n\n"${post.caption}"\nவிலை: ${post.priceTag || 'தொடர்பு கொள்ளவும்'}\n\nhttps://shinegah.in`
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
    <div className="bg-[#070913] text-slate-100 min-h-screen flex flex-col md:flex-row selection:bg-blue-600 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Ambient Glowing Aurora Background Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. LEFT DESKTOP SIDEBAR (FUTURISTIC DARK GLASS NEON)                      */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col justify-between w-68 lg:w-72 h-screen sticky top-0 bg-[#0a0f20]/90 backdrop-blur-2xl border-r border-white/10 p-5 lg:p-6 shrink-0 z-40 select-none shadow-[4px_0_30px_rgba(0,0,0,0.5)]">
        
        {/* Brand Header */}
        <div className="space-y-6">
          
          <div 
            onClick={() => setActiveTab('feed')} 
            className="cursor-pointer group space-y-3"
          >
            <ShinegahLogo size="md" />

            {/* Pill: Built for Businesses. Designed for Growth (Exact Mockup) */}
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 shadow-inner">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
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
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            {/* 2. Discover (Explore & 3x8 Grid) */}
            <button
              onClick={() => setActiveTab('explore')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'explore'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Compass className="w-5 h-5" />
              <div className="flex items-center gap-2">
                <span>Discover</span>
                <span className="bg-blue-500/30 text-blue-300 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-blue-400/30">
                  24 Reels
                </span>
              </div>
            </button>

            {/* 3. Reels */}
            <button
              onClick={() => setActiveTab('reels')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'reels'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Film className="w-5 h-5" />
              <div className="flex items-center gap-2">
                <span>Reels</span>
                <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
                  HOT
                </span>
              </div>
            </button>

            {/* 4. Messages / Inbox */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <MessageCircle className="w-5 h-5" />
                <span>Inbox</span>
              </div>
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                5
              </span>
            </button>

            {/* 5. Business Growth (Insights) */}
            <button
              onClick={() => setActiveTab('insights')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'insights'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Growth</span>
            </button>

            {/* 6. Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>

            {/* 7. Settings */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition cursor-pointer text-sm font-bold"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>

            {/* 8. Super Admin Console */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Admin Console</span>
            </button>

          </nav>

        </div>

        {/* Bottom Profile Summary Card & Validity Timer */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition cursor-pointer border border-white/10"
          >
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shrink-0">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border border-slate-900"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-white truncate flex items-center gap-1">
                <span>@{currentUser.username}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
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
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-white text-[11px] font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>⏳</span>
              <span>Validity:</span>
            </div>
            <span className="bg-blue-600/40 text-blue-300 font-mono text-[10px] px-2 py-0.5 rounded-lg font-black border border-blue-400/40">
              {currentUser.validityDaysLeft || 364} Days
            </span>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </button>

        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOP NAVBAR (MATCHING CENTER PHONE SCREEN IN MOCKUP)            */}
      {/* ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-[#070913]/90 backdrop-blur-2xl border-b border-white/10 px-4 h-16 flex items-center justify-between shadow-lg">
        
        {/* Shinegah Logo */}
        <div 
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ShinegahLogo size="sm" showText={false} />
          <span className="font-black text-lg text-white tracking-tight">
            Shinegah<span className="text-indigo-400 text-xs">™</span>
          </span>
        </div>

        {/* Right Search, Bell (badge 3) & Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('explore')}
            className="p-1.5 text-slate-300 hover:text-white transition"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className="relative p-1.5 text-slate-300 hover:text-white transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-black">
              3
            </span>
          </button>

          <div 
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 to-purple-600 cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover border border-slate-900"
            />
          </div>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT VIEWPORT CONTAINER                                        */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 max-w-full overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8">
        
        {/* VIEW 1: HOME FEED (MATCHING CENTER PHONE SCREEN) */}
        {activeTab === 'feed' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Center Feed Column (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* TOP SEARCH BAR IN FEED (FROM MOCKUP) */}
              <div 
                onClick={() => setActiveTab('explore')}
                className="bg-[#0e1428]/90 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:border-white/20 transition shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-xs sm:text-sm text-slate-400 font-medium">
                  Search businesses, products...
                </span>
              </div>

              {/* STORIES CAROUSEL (+ Create Story, Business Updates, Offers, Events, Networking) */}
              <StoriesBar
                stories={stories}
                currentUserAvatar={currentUser.avatar}
                onOpenCreateStory={() => setIsCreateModalOpen(true)}
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
                    onLike={handleLike}
                    onSendEnquiry={handleSendEnquiry}
                    onShareWhatsApp={handleShareWhatsApp}
                  />
                ))}
              </div>

            </div>

            {/* Right Desktop Sidebar (5 cols on lg) */}
            <div className="hidden lg:block lg:col-span-5 space-y-5 sticky top-6">
              
              {/* Business Growth Widget Preview (Top Right from Mockup) */}
              <InsightsView
                posts={posts}
                onOpenCreateReel={() => setIsCreateModalOpen(true)}
              />

              {/* Discover Businesses Nearby Card (Bottom Left from Mockup) */}
              <div className="p-5 rounded-3xl bg-[#0e1428]/90 border border-white/10 space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                    Discover Verified Businesses
                  </h4>
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    View All ›
                  </button>
                </div>

                <div className="space-y-3">
                  {publicPosts.slice(2, 6).map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => handleSendEnquiry(p)}
                      className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.avatar}
                          alt={p.businessName}
                          className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white truncate flex items-center gap-1">
                            <span>{p.businessName}</span>
                            <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {p.category} • {p.taluk}
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[10px] rounded-full shrink-0 shadow-sm">
                        Enquire
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clean Footer Info */}
              <div className="text-[11px] text-slate-500 space-y-1 px-2">
                <div>Shinegah™ • Connect • Collaborate • Grow</div>
                <div>The Next-Gen Business Social Network • Tamil Nadu</div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: EXPLORE / DISCOVER (MAP + 3x8 VIDEO GRID) */}
        {activeTab === 'explore' && (
          <ExploreView
            posts={posts}
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

        {/* VIEW 3: FULLSCREEN 9:16 REELS */}
        {activeTab === 'reels' && (
          <ReelsView
            reels={publicReels}
            onLike={handleLike}
            onSendEnquiry={handleSendEnquiry}
            onShareWhatsApp={handleShareWhatsApp}
          />
        )}

        {/* VIEW 4: ENQUIRIES & CHAT (MESSAGES 5) */}
        {activeTab === 'messages' && (
          <EnquiryChat
            threads={threads}
            onSendMessage={handleSendMessageInChat}
          />
        )}

        {/* VIEW 5: BUSINESS PROFILE */}
        {activeTab === 'profile' && (
          <BusinessProfileView
            currentUser={currentUser}
            posts={posts}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
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
          />
        )}

        {/* VIEW 6: BUSINESS GROWTH (INSIGHTS) */}
        {activeTab === 'insights' && (
          <InsightsView
            posts={posts}
            onOpenCreateReel={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* VIEW 7: SUPER ADMIN CONSOLE */}
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
      {/* 4. FLOATING CURVED FROSTED GLASS DOCK (EXACT MATCH FROM MOCKUP)          */}
      {/* ========================================================================= */}
      
      {/* FLOATING ACTION POPUP MENU (EXACT MOCKUP BOTTOM CENTER) */}
      {isActionMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end justify-center pb-24 px-4 select-none animate-in fade-in duration-200"
          onClick={() => setIsActionMenuOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs apple-glass apple-specular-edge rounded-[28px] p-2.5 space-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          >
            {/* 1. Create Post */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('post');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center gap-3 transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-black text-xs sm:text-sm text-white">Create Post</div>
                <div className="text-[10px] text-slate-400">புகைப்படம் / தயாரிப்பு பதிவு</div>
              </div>
            </button>

            {/* 2. Create Reel */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('reel');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center gap-3 transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-black text-xs sm:text-sm text-white">Create Reel</div>
                <div className="text-[10px] text-slate-400">நேரடி வீடியோ அப்லோட் (9:16)</div>
              </div>
            </button>

            {/* 3. Share Business Update */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('update');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center gap-3 transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-black text-xs sm:text-sm text-white">Share Business Update</div>
                <div className="text-[10px] text-slate-400">நிறுவன முக்கிய அறிவிப்புகள்</div>
              </div>
            </button>

            {/* 4. Post Offer */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setModalAction('offer');
                setIsCreateModalOpen(true);
              }}
              className="w-full p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center gap-3 transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center group-hover:scale-110 transition shadow-[0_0_15px_rgba(236,72,153,0.3)] shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-black text-xs sm:text-sm text-white">Post Offer</div>
                <div className="text-[10px] text-slate-400">மொத்த விலை சலுகை தள்ளுபடி</div>
              </div>
            </button>

          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-4 inset-x-4 z-40 select-none">
        <div className="apple-glass apple-specular-edge rounded-full px-5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex items-center justify-between">
          
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'feed' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px]">Home</span>
          </button>

          {/* 2. Discover */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'explore' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[9px]">Discover</span>
          </button>

          {/* 3. Center Glowing Plus Circle Button (Exact Mockup) */}
          <button
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            className="w-13 h-13 -my-5 rounded-full p-[2.5px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_25px_rgba(79,70,229,0.7)] flex items-center justify-center cursor-pointer transition transform hover:scale-105 active:scale-95 z-50"
            title="Create Post or Reel"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-inner">
              <Plus className={`w-6 h-6 stroke-[3] transition-transform duration-300 ${isActionMenuOpen ? 'rotate-45' : ''}`} />
            </div>
          </button>

          {/* 4. Inbox (Badge 5) */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`relative flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'messages' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[9px]">Inbox</span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-sm">
              5
            </span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'profile' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[9px]">Profile</span>
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
        currentUser={{
          businessName: currentUser.businessName,
          ownerName: currentUser.ownerName,
          avatar: currentUser.avatar,
          taluk: currentUser.taluk,
          category: currentUser.category,
          phone: currentUser.phone,
        }}
      />

      {/* Settings Modal */}
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

      {/* Razorpay ₹1 Membership Registration / Renewal Modal */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        lang={lang}
        initialOption="networking_marketplace"
        chapters={state?.chapters || []}
        onSuccessLogin={(regData) => {
          setIsRegisterModalOpen(false);
          alert('உங்கள் வணிகர் மெம்பர்ஷிப் ₹1 செலுத்தப்பட்டு 1 ஆண்டுக்கு வெற்றிகரமாக புதுப்பிக்கப்பட்டது!');
        }}
      />

    </div>
  );
};
