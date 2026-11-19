import React, { useState } from 'react';
import { 
  Grid, Film, Bookmark, CheckCircle2, MapPin, Phone, 
  Tag, Plus, Edit, Sparkles, ExternalLink, ShieldCheck, 
  Heart, MessageCircle, Clock, Award, Settings, Lock, 
  Share2, UserCheck, Shield, ChevronRight 
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
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved' | 'liked' | 'catalog'>('posts');
  const [savedPostsIds, setSavedPostsIds] = useState<string[]>(['post_1', 'post_3']);

  // Filter posts belonging to current user, or sample posts
  const myPosts = posts.filter(
    (p) =>
      p.memberId === currentUser.id ||
      p.businessName.toLowerCase().includes(currentUser.businessName.toLowerCase().slice(0, 6)) ||
      p.ownerName.toLowerCase().includes(currentUser.ownerName.toLowerCase().slice(0, 4))
  );

  const displayPosts = myPosts.length > 0 ? myPosts : posts.slice(0, 6);
  const myReels = displayPosts.filter((p) => p.type === 'video');
  const mySaved = posts.filter((p) => savedPostsIds.includes(p.id));
  const myLiked = posts.filter((p) => p.isLiked || p.likes > 150);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16 select-none font-sans">
      
      {/* 1. PROFILE HEADER SECTION (EXACT INSTAGRAM FORMAT) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          
          {/* Left: Avatar with Insta-gradient ring + Story Status trigger */}
          <div className="relative shrink-0 group cursor-pointer" onClick={onOpenCreateModal}>
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-[3.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={currentUser.businessName}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            
            {/* Verified badge */}
            <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white shadow-sm" title="Verified NBN Business">
              <CheckCircle2 className="w-4 h-4" />
            </div>

            {/* Quick Story Plus Overlay */}
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm border-2 border-white shadow-sm" title="ஸ்டோரி / ஸ்டேட்டஸ் சேர்">
              +
            </div>
          </div>

          {/* Right: Business Details & Actions */}
          <div className="flex-1 space-y-4 text-center sm:text-left min-w-0">
            
            {/* Top Bar: Handle + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="font-mono text-base sm:text-lg font-black text-slate-900">
                    @{currentUser.username}
                  </span>
                  
                  {currentUser.isPrivateAccount ? (
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>பிரைவேட்</span>
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                      B2B VERIFIED
                    </span>
                  )}
                </div>
                
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5 truncate">
                  {currentUser.businessName}
                </h1>
                
                <div className="text-xs text-slate-500 font-medium">
                  உரிமையாளர்: <span className="font-bold text-slate-700">{currentUser.ownerName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap shrink-0">
                
                {/* Create Reel */}
                <button
                  onClick={onOpenCreateModal}
                  className="px-3.5 py-2 bg-[#0a1128] hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>ரீல்ஸ் போடு</span>
                </button>

                {/* Settings Button */}
                <button
                  onClick={onOpenSettings}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition shadow-xs cursor-pointer"
                  title="செக்யூரிட்டி & புரொபைல் செட்டிங்ஸ்"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Switch Account */}
                <button
                  onClick={onOpenAuthModal}
                  className="px-3 py-2 bg-slate-100 hover:bg-amber-100 text-slate-800 font-bold text-xs rounded-full transition cursor-pointer"
                  title="கணக்கை மாற்று / புதிய லாகின்"
                >
                  மாற்று
                </button>

                {/* Renew ₹1 Button */}
                <button
                  onClick={onOpenRenewModal}
                  className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-full shadow-sm transition flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>₹1 வேலிடிட்டி</span>
                </button>
              </div>
            </div>

            {/* 1-Year Live Validity Alert Badge */}
            <div className="p-3 bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="text-base">⏳</span>
                <span>மெம்பர்ஷிப் வேலிடிட்டி (1-Year Active):</span>
                <span className="bg-slate-950 text-amber-400 font-black px-2 py-0.5 rounded-lg text-xs font-mono">
                  {currentUser.validityDaysLeft || 364} நாட்கள் மீதம்
                </span>
              </div>
              <span className="text-[11px] text-purple-700 font-semibold">
                Razorpay ₹1 செலுத்தி உறுதி செய்யப்பட்டது
              </span>
            </div>

            {/* Stats Counter Row (Instagram Standard: Posts, Followers, Following) */}
            <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-10 pt-1 text-slate-800 border-y border-slate-100 py-3">
              <div>
                <span className="font-black text-base text-slate-950">{displayPosts.length}</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">பதிவுகள் (Posts)</span>
              </div>
              <div>
                <span className="font-black text-base text-slate-950">{currentUser.followersCount || 1420}</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">ஃபாலோவர்ஸ்</span>
              </div>
              <div>
                <span className="font-black text-base text-slate-950">{currentUser.followingCount || 380}</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">ஃபாலோயிங்</span>
              </div>
              <div>
                <span className="font-black text-base text-amber-600">VIP</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">சாப்டர் தகுதி</span>
              </div>
            </div>

            {/* Business Bio & Location */}
            <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="bg-amber-100 text-amber-900 font-black px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>தொழில் பிரிவு: {currentUser.category}</span>
                </span>
                {currentUser.liveLocationEnabled && (
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>லைவ் ஜி.பி.எஸ் ஆன்</span>
                  </span>
                )}
              </div>
              
              <p>
                {currentUser.bio || '🏢 அதிகாரப்பூர்வ NBN தொழில் நெட்வொர்க் ஹப் | B2B வீடியோ ரீல்கள் & மொத்த வணிக தளவாடங்கள் | 100% சரிபார்க்கப்பட்ட B2B வணிகர்கள்'}
              </p>
              
              <div className="flex items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-500 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>{currentUser.locationTag || currentUser.taluk}</span>
                </span>
                <span>•</span>
                <a href={`tel:${currentUser.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{currentUser.phone}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* 2. STORY HIGHLIGHTS BUBBLES (+ ADD STATUS BUTTON) */}
        <div className="pt-4 flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none border-t border-slate-100">
          
          {/* Add New Status / Story */}
          <div 
            onClick={onOpenCreateModal}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-500 group-hover:border-amber-600 group-hover:bg-amber-50 transition flex items-center justify-center bg-slate-50">
              <Plus className="w-6 h-6 text-amber-600 group-hover:scale-110 transition" />
            </div>
            <span className="text-[11px] font-bold text-amber-700">+ ஸ்டேட்டஸ்</span>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full p-[2px] border-2 border-slate-200 group-hover:border-amber-400 transition flex items-center justify-center bg-slate-50">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">ஃபேக்டரி</span>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full p-[2px] border-2 border-slate-200 group-hover:border-amber-400 transition flex items-center justify-center bg-slate-50">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">ஆஃபர்கள்</span>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full p-[2px] border-2 border-slate-200 group-hover:border-amber-400 transition flex items-center justify-center bg-slate-50">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">ரிவ்யூஸ்</span>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full p-[2px] border-2 border-slate-200 group-hover:border-amber-400 transition flex items-center justify-center bg-slate-50">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">GST சான்று</span>
          </div>

        </div>

      </div>

      {/* 3. PROFILE TABS (POSTS | REELS | SAVED | LIKED | CATALOG) */}
      <div className="flex items-center justify-center gap-4 sm:gap-10 border-t border-slate-200 pt-3 text-xs font-black tracking-wider uppercase overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-1.5 py-2.5 border-t-2 -mt-3.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'posts'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>பதிவுகள் ({displayPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-1.5 py-2.5 border-t-2 -mt-3.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'reels'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>ரீல்ஸ் ({myReels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-1.5 py-2.5 border-t-2 -mt-3.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'saved'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>சேமித்தவை ({mySaved.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-1.5 py-2.5 border-t-2 -mt-3.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'liked'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>லைக்ஸ் ({myLiked.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-1.5 py-2.5 border-t-2 -mt-3.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'catalog'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>வணிக பட்டியல்</span>
        </button>

      </div>

      {/* 4. TAB CONTENT DISPLAY */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-xs border border-slate-200"
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
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              )}

              {/* Status Badge: Approved vs Pending */}
              <div className="absolute top-2 left-2 z-10">
                {post.status === 'pending' ? (
                  <span className="bg-amber-500/90 backdrop-blur-xs text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <span>⏳</span>
                    <span>அட்மின் தணிக்கையில்</span>
                  </span>
                ) : (
                  <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <span>✅</span>
                    <span>லைவ்</span>
                  </span>
                )}
              </div>

              {/* Hover overlay stats */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white font-bold text-xs">
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

      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {myReels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => onSelectPost(reel)}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 group cursor-pointer shadow-md border border-slate-200"
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
              <div className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/60 text-white">
                <Film className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent text-white space-y-1">
                <div className="font-bold text-xs truncate">{reel.caption}</div>
                <div className="text-[10px] text-amber-400 font-mono">{reel.priceTag}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {mySaved.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-xs border border-slate-200"
            >
              <img
                src={post.thumbnailUrl || post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-slate-950 to-transparent text-white text-xs font-bold truncate">
                {post.businessName}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'liked' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {myLiked.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-xs border border-slate-200"
            >
              <img
                src={post.thumbnailUrl || post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-500 text-white">
                <Heart className="w-3.5 h-3.5 fill-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="space-y-3">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={post.thumbnailUrl || post.mediaUrl}
                  alt={post.caption}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                    {post.caption}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    பிரிவு: {post.category} • {post.taluk}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <div className="text-right">
                  <div className="text-xs font-black text-amber-600 font-mono">
                    {post.wholesalePrice || post.priceTag}
                  </div>
                  <div className="text-[10px] text-slate-400">GST இன்வாய்ஸ் கிடைக்கும்</div>
                </div>
                <button
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                >
                  ஆர்டர் செய்
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
