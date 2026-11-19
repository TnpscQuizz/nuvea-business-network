import React, { useState, useEffect } from 'react';
import { 
  Home, Search, Film, MessageCircle, PlusSquare, BarChart3, 
  User, Shield, Settings, LogOut, Clock, CheckCircle2, 
  Sparkles, ExternalLink, Menu, X, ArrowRight, Phone, Tag, 
  MapPin, Bell 
} from 'lucide-react';
import type { AppState, BizPost, BizStory, BizEnquiryMessage } from '../../types';
import { 
  INITIAL_BIZ_POSTS, 
  INITIAL_BIZ_STORIES, 
  INITIAL_ENQUIRIES 
} from './data/bizGramData';
import { StoriesBar } from './components/StoriesBar';
import { PostCard } from './components/PostCard';
import { ReelsView } from './components/ReelsView';
import { CreateModal } from './components/CreateModal';
import { EnquiryChat } from './components/EnquiryChat';
import { BusinessProfileView } from './components/BusinessProfileView';
import { ExploreView } from './components/ExploreView';
import { InsightsView } from './components/InsightsView';
import { SuperAdminConsole } from './components/SuperAdminConsole';
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
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    'feed' | 'explore' | 'reels' | 'messages' | 'insights' | 'profile' | 'admin'
  >('feed');

  // Posts, Stories and Enquiries state
  const [posts, setPosts] = useState<BizPost[]>(() => {
    try {
      const saved = localStorage.getItem('nbn_biz_posts');
      return saved ? JSON.parse(saved) : INITIAL_BIZ_POSTS;
    } catch {
      return INITIAL_BIZ_POSTS;
    }
  });

  const [stories, setStories] = useState<BizStory[]>(INITIAL_BIZ_STORIES);
  const [threads, setThreads] = useState(INITIAL_ENQUIRIES);
  const [selectedEnquiryPost, setSelectedEnquiryPost] = useState<BizPost | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Active Business Member Profile Info
  const activeMember = state.members[0] || {
    id: 'mem_001',
    businessName: 'நுவேவா ஸ்டுடியோ (Nuvea Studio)',
    ownerName: 'சந்திரா (Chandru)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    taluk: 'தருமபுரி & சேலம்',
    category: 'டிஜிட்டல் மார்க்கெட்டிங் & வெப்',
    phone: '917548820641',
    locationTag: 'தருமபுரி மெயின் ரோடு & சேலம் ஜங்ஷன்',
    validityDaysLeft: 364,
  };

  // Save posts to localStorage whenever updated
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
    
    // Add enquiry message to the first thread or new thread
    const newMsg: BizEnquiryMessage = {
      id: `msg_${Date.now()}`,
      threadId: 'th_001',
      senderId: 'buyer',
      senderName: 'சந்திரா (நான்)',
      text: customMsg || `வணக்கம்! "${post.businessName}" அவர்களின் "${post.caption.slice(0, 40)}..." ரீல்ஸைப் பார்த்து விசாரிக்கிறேன். இதன் விலை மற்றும் சலுகை விவரம் கூறவும்.`,
      attachedPostId: post.id,
      attachedPostTitle: post.caption.slice(0, 45),
      attachedPostThumb: post.thumbnailUrl || post.mediaUrl,
      attachedPrice: post.priceTag,
      timestamp: 'இப்போது',
    };

    setThreads((prev) =>
      prev.map((th, i) => {
        if (i === 0) {
          return {
            ...th,
            lastMessage: newMsg.text,
            lastTime: 'இப்போது',
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
      senderId: 'buyer',
      senderName: 'சந்திரா',
      text,
      isQuotation: !!quotationData,
      quotationData,
      timestamp: 'இப்போது',
    };

    setThreads((prev) =>
      prev.map((th) => {
        if (th.threadId === threadId) {
          return {
            ...th,
            lastMessage: quotationData ? 'அதிகாரப்பூர்வ விலைப்பட்டியல் அனுப்பப்பட்டது' : text,
            lastTime: 'இப்போது',
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
      `வணக்கம்! NBN BizGram-ல் "${post.businessName}" அவர்களின் வணிக பதிவு:\n\n"${post.caption}"\nவிலை: ${post.priceTag || 'தொடர்பு கொள்ளவும்'}\n\nதொடர்புக்கு: https://adcfe2ac20fec0.app.lhr.life/`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Filter only approved posts for Public Feed and Reels
  const publicPosts = posts.filter((p) => p.status === 'approved' || !p.status);
  const publicReels = publicPosts.filter((p) => p.type === 'video');

  return (
    <div className="bg-[#fafafa] text-slate-900 min-h-screen flex flex-col md:flex-row selection:bg-amber-300 selection:text-slate-900 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. LEFT DESKTOP SIDEBAR (EXACT INSTAGRAM WEB FORMAT)                      */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-68 h-screen sticky top-0 bg-white border-r border-slate-200/80 p-4 lg:p-6 shrink-0 z-40 select-none">
        
        {/* Brand Header */}
        <div className="space-y-6">
          
          <div 
            onClick={() => setActiveTab('feed')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md group-hover:scale-105 transition">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-slate-950 tracking-tight leading-none">
                  NBN <span className="text-amber-500">BizGram</span>
                </span>
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Business Instagram
              </p>
            </div>
          </div>

          {/* Navigation Links (Instagram Style) */}
          <nav className="space-y-1.5">
            
            {/* 1. Home / Feed */}
            <button
              onClick={() => setActiveTab('feed')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'feed'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950'
              }`}
            >
              <Home className={`w-5 h-5 ${activeTab === 'feed' ? 'text-amber-400' : 'text-slate-600'}`} />
              <span>முகப்பு (Home)</span>
            </button>

            {/* 2. Explore / Search */}
            <button
              onClick={() => setActiveTab('explore')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'explore'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950'
              }`}
            >
              <Search className={`w-5 h-5 ${activeTab === 'explore' ? 'text-amber-400' : 'text-slate-600'}`} />
              <span>தேடுக (Explore)</span>
            </button>

            {/* 3. Reels */}
            <button
              onClick={() => setActiveTab('reels')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'reels'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950'
              }`}
            >
              <Film className={`w-5 h-5 ${activeTab === 'reels' ? 'text-amber-400' : 'text-slate-600'}`} />
              <div className="flex items-center gap-2">
                <span>ரீல்ஸ் (Reels)</span>
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  HOT
                </span>
              </div>
            </button>

            {/* 4. Messages / Enquiries */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'messages'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <MessageCircle className={`w-5 h-5 ${activeTab === 'messages' ? 'text-amber-400' : 'text-slate-600'}`} />
                <span>விசாரணைகள் (Enquiries)</span>
              </div>
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                3
              </span>
            </button>

            {/* 5. Create / Upload */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-800 hover:bg-amber-50 hover:text-amber-900 border border-transparent hover:border-amber-300 transition cursor-pointer text-sm font-black group"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-105 transition">
                +
              </div>
              <span>பதிவேற்றுக (Create)</span>
            </button>

            {/* 6. Insights */}
            <button
              onClick={() => setActiveTab('insights')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'insights'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950'
              }`}
            >
              <BarChart3 className={`w-5 h-5 ${activeTab === 'insights' ? 'text-amber-400' : 'text-slate-600'}`} />
              <span>புள்ளிவிவரம் (Insights)</span>
            </button>

            {/* 7. Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'profile'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950'
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-amber-400' : 'text-slate-600'}`} />
              <span>என் புரொபைல் (Profile)</span>
            </button>

            {/* 8. Super Admin Console */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition cursor-pointer text-sm font-bold ${
                activeTab === 'admin'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950'
              }`}
            >
              <Shield className={`w-5 h-5 ${activeTab === 'admin' ? 'text-amber-400' : 'text-slate-600'}`} />
              <span>அட்மின் கன்சோல் (Admin)</span>
            </button>

          </nav>

        </div>

        {/* Bottom Profile Summary Card & Validity Timer */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100/80 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shrink-0">
              <img
                src={activeMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border border-white"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-slate-900 truncate flex items-center gap-1">
                <span>{activeMember.businessName}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {activeMember.ownerName}
              </div>
            </div>
          </div>

          {/* 1-Year Validity Live Card */}
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-slate-900 text-[11px] font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span>⏳</span>
              <span>1 வருடம் வேலிடிட்டி:</span>
            </div>
            <span className="bg-slate-950 text-amber-400 font-mono text-[10px] px-1.5 py-0.5 rounded font-black">
              364 நாட்கள்
            </span>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>💳 ₹1 மெம்பர்ஷிப் புதுப்பிப்பு</span>
          </button>

        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOP NAVBAR                                                      */}
      {/* ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 h-15 flex items-center justify-between shadow-2xs">
        
        <div 
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm">
            N
          </div>
          <span className="font-black text-lg text-slate-950 tracking-tight">
            NBN <span className="text-amber-500">BizGram</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-1.5 text-slate-800 hover:text-amber-600 transition cursor-pointer"
            title="Create Post"
          >
            <PlusSquare className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className="relative p-1.5 text-slate-800 hover:text-amber-600 transition cursor-pointer"
            title="Messages"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          </button>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT VIEWPORT CONTAINER                                        */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 max-w-full overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 md:pb-6">
        
        {/* VIEW 1: HOME FEED */}
        {activeTab === 'feed' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Center Feed Column (8 cols on lg) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* TOP STORIES BAR */}
              <StoriesBar
                stories={stories}
                currentUserAvatar={activeMember.avatar}
                onOpenCreateStory={() => setIsCreateModalOpen(true)}
                onSendStoryReply={(story, text) => {
                  handleSendMessageInChat('th_001', `[ஸ்டோரி பதில்]: ${text}`);
                  setActiveTab('messages');
                }}
              />

              {/* POSTS FEED LIST (APPROVED PUBLIC POSTS) */}
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
              
              {/* My Profile Quick Preview */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={activeMember.businessName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                    />
                    <div>
                      <div className="font-black text-sm text-slate-900 flex items-center gap-1">
                        <span>{activeMember.businessName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div className="text-xs text-slate-500">
                        {activeMember.ownerName} • {activeMember.taluk}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-xs font-black text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    மாற்று
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>⏳ வேலிடிட்டி டைமர்:</span>
                  <span className="font-mono text-amber-900 font-black">
                    364D : 23H : 59M
                  </span>
                </div>
              </div>

              {/* Suggested Businesses in your Taluk */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs text-slate-700 uppercase tracking-wider">
                    தாலுகா பரிந்துரைக்கப்பட்ட வணிகங்கள்
                  </h4>
                  <button 
                    onClick={() => setActiveTab('explore')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    அனைத்தும்
                  </button>
                </div>

                <div className="space-y-3">
                  {posts.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.avatar}
                          alt={p.businessName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 truncate">
                            {p.businessName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {p.category} • {p.taluk}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendEnquiry(p)}
                        className="px-3 py-1 bg-slate-100 hover:bg-amber-400 hover:text-slate-950 text-slate-700 text-xs font-bold rounded-full transition cursor-pointer shrink-0"
                      >
                        விசாரி
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Categories Quick Links */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                <h4 className="font-black text-xs text-slate-700 uppercase tracking-wider">
                  பிரபலமான வணிகப் பிரிவுகள்
                </h4>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {['பட்டு & ஜவுளி', 'வேளாண் இயந்திரங்கள்', 'தங்க நகைகள்', 'கன்ஸ்ட்ரக்ஷன்', 'சாஃப்ட்வேர் & 3D', 'ஆட்டோமொபைல்'].map((cat) => (
                    <span 
                      key={cat}
                      onClick={() => setActiveTab('explore')}
                      className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-amber-100 border border-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer transition"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clean Footer Info */}
              <div className="text-[11px] text-slate-400 space-y-1 px-2">
                <div>NBN BizGram • Tamil Nadu's Premier B2B Network</div>
                <div>Powered by Nuvea Studio • 100% Verified Commercial Commerce</div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: EXPLORE / SEARCH */}
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

        {/* VIEW 4: ENQUIRIES & CHAT */}
        {activeTab === 'messages' && (
          <EnquiryChat
            threads={threads}
            onSendMessage={handleSendMessageInChat}
          />
        )}

        {/* VIEW 5: BUSINESS PROFILE */}
        {activeTab === 'profile' && (
          <BusinessProfileView
            member={activeMember}
            posts={posts}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenRenewModal={() => setIsRegisterModalOpen(true)}
            onSelectPost={(post) => {
              if (post.type === 'video') {
                setActiveTab('reels');
              } else {
                handleSendEnquiry(post);
              }
            }}
          />
        )}

        {/* VIEW 6: BUSINESS INSIGHTS */}
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
      {/* 4. MOBILE BOTTOM NAVIGATION BAR                                           */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around z-40 select-none shadow-lg">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-0.5 p-1 ${
            activeTab === 'feed' ? 'text-amber-500 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">முகப்பு</span>
        </button>

        {/* Explore */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-0.5 p-1 ${
            activeTab === 'explore' ? 'text-amber-500 font-bold' : 'text-slate-500'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">தேடல்</span>
        </button>

        {/* Create (+) */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md -mt-4 cursor-pointer"
        >
          +
        </button>

        {/* Reels */}
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex flex-col items-center gap-0.5 p-1 ${
            activeTab === 'reels' ? 'text-amber-500 font-bold' : 'text-slate-500'
          }`}
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px]">ரீல்ஸ்</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 p-1 ${
            activeTab === 'profile' ? 'text-amber-500 font-bold' : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">புரொபைல்</span>
        </button>

      </nav>

      {/* ========================================================================= */}
      {/* 5. MODALS                                                                 */}
      {/* ========================================================================= */}
      
      {/* Create New Post / Reel Modal */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePost={handleCreatePost}
        currentUser={{
          businessName: activeMember.businessName,
          ownerName: activeMember.ownerName,
          avatar: activeMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          taluk: activeMember.taluk || 'சேலம் (Salem)',
          category: activeMember.category || 'ஜவுளி & பட்டு',
          phone: activeMember.phone || '917548820641',
        }}
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
