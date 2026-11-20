import React, { useState } from 'react';
import { 
  Grid, Film, Bookmark, CheckCircle2, MapPin, Phone, 
  Tag, Plus, Edit, Sparkles, ExternalLink, ShieldCheck, 
  Heart, MessageCircle, Clock, Award, Settings, Lock, 
  Share2, ShoppingBag, Briefcase, Image as ImageIcon, Globe, 
  Star, ChevronRight 
} from 'lucide-react';
import type { BizPost, BizUser } from '../../../types';

interface BusinessProfileViewProps {
  currentUser: BizUser;
  posts: BizPost[];
  onOpenCreateModal: () => void;
  onOpenRenewModal: () => void;
  onOpenSettings: () => void;
  onOpenAuthModal: () => void;
  onSelectPost: (post: BizPost) => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  currentUser,
  posts,
  onOpenCreateModal,
  onOpenRenewModal,
  onOpenSettings,
  onOpenAuthModal,
  onSelectPost,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'products' | 'services' | 'about' | 'reels'>('posts');
  const [isFollowing, setIsFollowing] = useState(true);

  // Filter posts
  const myPosts = posts.filter(
    (p) =>
      p.memberId === currentUser.id ||
      p.businessName.toLowerCase().includes('shinegah') ||
      p.businessName.toLowerCase().includes(currentUser.businessName.toLowerCase().slice(0, 5))
  );

  const displayPosts = myPosts.length > 0 ? myPosts : posts.slice(0, 6);
  const myReels = displayPosts.filter((p) => p.type === 'video');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 select-none font-sans">
      
      {/* 1. PROFILE HEADER CARD (EXACT MOCKUP) */}
      <div className="apple-glass apple-specular-edge rounded-[32px] overflow-hidden shadow-2xl">
        
        {/* Cover Photo: Architectural Glass Corporate Building */}
        <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
            alt="Corporate Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1428] via-transparent to-black/40" />
          
          {/* Top Right Action Icons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition cursor-pointer border border-white/20"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenRenewModal}
              className="px-3 py-1.5 rounded-full bg-amber-400/90 text-slate-950 font-black text-xs transition cursor-pointer shadow-md flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>₹1 Active</span>
            </button>
          </div>
        </div>

        {/* Profile Content Container */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 -mt-16 sm:-mt-20 relative space-y-5">
          
          {/* Avatar + Main Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            
            {/* Avatar with Verified checkmark */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_25px_rgba(59,130,246,0.5)] shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 border-2 border-[#0e1428]">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={currentUser.businessName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-[#0e1428] shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Actions: Following / Edit Profile / Switch */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isFollowing
                    ? 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>

              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create</span>
              </button>

              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-full border border-white/10 transition cursor-pointer"
              >
                Switch
              </button>
            </div>

          </div>

          {/* Name & Bio Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentUser.businessName || 'Shinegah'}
              </h1>
              <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-500/20" />
            </div>

            <div className="font-mono text-xs text-slate-400">
              @{currentUser.username || 'shinegah.in'}
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl font-normal">
              {currentUser.bio || 'Empowering Businesses to Grow Together ✨'}
            </p>

            {/* Specialty Category Tags (Exact Mockup) */}
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold flex-wrap pt-0.5">
              <span>Technology</span>
              <span>•</span>
              <span>Business Network</span>
              <span>•</span>
              <span>Innovation</span>
            </div>
          </div>

          {/* 12.5K Followers | 245 Following | 3.8M Reach (Exact Mockup) */}
          <div className="flex items-center gap-8 sm:gap-12 py-3 border-y border-white/10 text-slate-200">
            <div>
              <span className="font-black text-base sm:text-lg text-white">
                {currentUser.followersCount ? `${(currentUser.followersCount / 1000).toFixed(1)}K` : '12.5K'}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">Followers</span>
            </div>
            <div>
              <span className="font-black text-base sm:text-lg text-white">
                {currentUser.followingCount || 245}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">Following</span>
            </div>
            <div>
              <span className="font-black text-base sm:text-lg text-white">3.8M</span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">Reach</span>
            </div>
          </div>

          {/* 4 CIRCULAR FROSTED ACTION BUTTONS: Products, Services, Portfolio, Contact */}
          <div className="grid grid-cols-4 gap-3 pt-1">
            <button
              onClick={() => setActiveTab('products')}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition shadow-inner">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">Products</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition shadow-inner">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">Services</span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition shadow-inner">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">Portfolio</span>
            </button>

            <a
              href={`tel:${currentUser.phone}`}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition shadow-inner">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">Contact</span>
            </a>
          </div>

          {/* Location & Website Info Card (Exact Mockup) */}
          <div className="p-3.5 rounded-2xl bg-[#080d1c] border border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentUser.locationTag || 'Chennai, Tamil Nadu'}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400 hover:underline">
                <Globe className="w-3.5 h-3.5" />
                <span>www.shinegah.in</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

        </div>

      </div>

      {/* 2. PROFILE TABS (Posts, Products, Services, About, Reels) */}
      <div className="flex items-center justify-between border-b border-white/10 px-2 sm:px-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('posts')}
          className={`py-3 px-3 transition cursor-pointer border-b-2 ${
            activeTab === 'posts' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-3 transition cursor-pointer border-b-2 ${
            activeTab === 'products' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`py-3 px-3 transition cursor-pointer border-b-2 ${
            activeTab === 'services' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`py-3 px-3 transition cursor-pointer border-b-2 ${
            activeTab === 'about' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`py-3 px-3 transition cursor-pointer border-b-2 ${
            activeTab === 'reels' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Reels
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-md border border-white/10 hover:border-white/20 transition"
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
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 text-white font-bold text-xs">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{post.enquiriesCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="p-3.5 rounded-2xl bg-[#0e1428] border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:border-blue-400 transition"
            >
              <img
                src={post.thumbnailUrl || post.mediaUrl}
                alt={post.caption}
                className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-white truncate">{post.caption}</h4>
                <div className="text-[10px] text-slate-400">{post.category}</div>
                <div className="text-xs font-black text-blue-400 font-mono mt-0.5">
                  {post.wholesalePrice || post.priceTag}
                </div>
              </div>
              <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shrink-0">
                Enquire
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-[#0e1428] border border-white/10 space-y-1">
            <h4 className="font-bold text-sm text-white">B2B Networking & Leads Management</h4>
            <p className="text-xs text-slate-300">தமிழ்நாடு முழுவதுமான சரிபார்க்கப்பட்ட வணிகர்களை நேரடியாக இணைக்கும் தலைமை தளம்.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0e1428] border border-white/10 space-y-1">
            <h4 className="font-bold text-sm text-white">High-Impact 3D Web & Brand Identity</h4>
            <p className="text-xs text-slate-300">பிரீமியம் 3D இணையதள வடிவமைப்பு, ஆட்டோமேஷன் மற்றும் B2B டிஜிட்டல் வளர்ச்சி.</p>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="p-5 rounded-3xl bg-[#0e1428] border border-white/10 space-y-3 text-xs text-slate-300 leading-relaxed">
          <h3 className="text-sm font-black text-white">About Shinegah™</h3>
          <p>
            Shinegah is the next-gen business social network empowering verified B2B merchants, manufacturers, exporters, and entrepreneurs across Tamil Nadu to connect, collaborate, and scale their businesses together.
          </p>
          <div className="pt-2 border-t border-white/10 space-y-1 text-slate-400">
            <div>📍 Corporate Office: Chennai, Tamil Nadu</div>
            <div>📞 Direct Business Line: +91 75488 20641</div>
            <div>✉️ Official Email: connect@shinegah.in</div>
          </div>
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {myReels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => onSelectPost(reel)}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 group cursor-pointer shadow-md border border-white/10 hover:border-white/20 transition"
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
              <div className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white">
                <Film className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent text-white">
                <div className="font-bold text-xs truncate">{reel.caption}</div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
