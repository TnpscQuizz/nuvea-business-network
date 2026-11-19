import React, { useState } from 'react';
import { 
  Search, MapPin, Tag, Film, Heart, MessageCircle, 
  Volume2, VolumeX, CheckCircle2, Package, Sparkles 
} from 'lucide-react';
import type { BizPost } from '../../../types';

interface ExploreViewProps {
  posts: BizPost[];
  onSelectPost: (post: BizPost) => void;
  onSendEnquiry: (post: BizPost, customMsg?: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  onSelectPost,
  onSendEnquiry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredMuteId, setHoveredMuteId] = useState<string | null>(null);

  const taluks = [
    'All', 
    'சேலம் (Salem)', 
    'தருமபுரி (Dharmapuri)', 
    'ஹரூர் (Harur)', 
    'ஓமலூர் (Omalur)', 
    'ஆத்தூர் (Attur)', 
    'மேட்டூர் (Mettur)'
  ];

  const categories = [
    'All', 
    'ஜவுளி & பட்டு', 
    'வேளாண் இயந்திரங்கள்', 
    'தங்க நகைகள்', 
    'கட்டுமானப் பொருட்கள்', 
    'டிஜிட்டல் மார்க்கெட்டிங்',
    'ஆட்டோமொபைல் & ஸ்பேர்ஸ்',
    'இயந்திர உதிரிபாகங்கள்'
  ];

  // Only show approved posts in Explore Search
  const approvedPosts = posts.filter((p) => p.status !== 'pending' && p.status !== 'rejected');

  const filteredPosts = approvedPosts.filter((post) => {
    const matchesSearch =
      post.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.taluk.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTaluk =
      selectedTaluk === 'All' || post.taluk.includes(selectedTaluk.replace(/ \(.*\)/, ''));

    const matchesCategory =
      selectedCategory === 'All' || post.category.includes(selectedCategory);

    return matchesSearch && matchesTaluk && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 select-none font-sans">
      
      {/* 1. TOP SMART SEARCH BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-amber-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="பொருட்கள், சேவைகள், தாலுகா அல்லது வணிகரைத் தேடவும் (எ.கா: பட்டு சேலை, அக்ரோ, சேலம், தருமபுரி)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition"
          />
        </div>

        {/* 2. TALUK & CATEGORY FILTER CHIPS */}
        <div className="space-y-2 pt-1">
          
          {/* Taluk Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <span className="text-[11px] font-black text-slate-500 shrink-0 flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>தாலுகா:</span>
            </span>
            {taluks.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTaluk(t)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedTaluk === t
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t === 'All' ? 'அனைத்து தாலுகா' : t}
              </button>
            ))}
          </div>

          {/* Category Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <span className="text-[11px] font-black text-slate-500 shrink-0 flex items-center gap-1 mr-1">
              <Tag className="w-3.5 h-3.5 text-purple-600" />
              <span>துறை:</span>
            </span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-[#0a1128] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {c === 'All' ? 'அனைத்து பிரிவுகள்' : c}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* 3. THREE-COLUMN DYNAMIC AUTOPLAY VIDEO GRID (INSTAGRAM STYLE) */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-bold">
          தேடலுக்குரிய அங்கீகரிக்கப்பட்ட வணிக வீடியோக்கள் எதுவும் இல்லை.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {filteredPosts.map((post) => {
            const isUnmuted = hoveredMuteId === post.id;
            return (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group relative aspect-[4/5] bg-slate-950 rounded-3xl overflow-hidden cursor-pointer shadow-md border border-slate-200/80 transition transform hover:-translate-y-1"
              >
                {/* VIDEO OR IMAGE CONTAINER */}
                {post.type === 'video' ? (
                  <div className="relative w-full h-full">
                    {/* Native Muted Auto-Playing Video */}
                    <video
                      src={post.mediaUrl}
                      poster={post.thumbnailUrl}
                      playsInline
                      loop
                      autoPlay
                      muted={!isUnmuted}
                      className="w-full h-full object-cover"
                    />

                    {/* Reels Badge */}
                    <div className="absolute top-3 left-3 z-20 bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Film className="w-3 h-3 text-amber-400" />
                      <span>ரீல்ஸ்</span>
                    </div>

                    {/* Mute / Unmute Button on Video */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredMuteId(isUnmuted ? null : post.id);
                      }}
                      className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition shadow-md cursor-pointer"
                    >
                      {isUnmuted ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-white" />}
                    </button>
                  </div>
                ) : (
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                )}

                {/* BOTTOM GRADIENT VIGNETTE & INFO PILL */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent text-white space-y-1">
                  
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-black text-xs text-white truncate max-w-[80%]">
                      {post.businessName}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20 shrink-0" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {post.taluk}
                    </span>
                    <span className="font-bold text-white bg-white/20 backdrop-blur-xs px-2 py-0.2 rounded-full text-[10px]">
                      {post.category}
                    </span>
                  </div>

                  {/* Wholesale vs Retail Tag */}
                  {post.wholesalePrice && (
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-amber-300 font-bold">
                        மொத்த விலை: {post.wholesalePrice}
                      </span>
                    </div>
                  )}

                </div>

                {/* HOVER B2B ACTION OVERLAY (INSTAGRAM B2B STYLE) */}
                <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 text-white text-center z-20">
                  
                  {/* Top Creator Info */}
                  <div className="flex items-center gap-2 text-left">
                    <img 
                      src={post.avatar} 
                      alt={post.businessName}
                      className="w-8 h-8 rounded-full object-cover border border-amber-400"
                    />
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {post.ownerName}
                      </div>
                      <div className="text-[10px] text-amber-400 font-semibold">
                        {post.taluk}
                      </div>
                    </div>
                  </div>

                  {/* Center Caption & Stats */}
                  <div className="space-y-2 py-2">
                    <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed text-left">
                      {post.caption}
                    </p>

                    <div className="flex items-center justify-center gap-5 text-xs font-black pt-1">
                      <div className="flex items-center gap-1 text-rose-400">
                        <Heart className="w-4 h-4 fill-rose-400" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <MessageCircle className="w-4 h-4 fill-amber-400" />
                        <span>{post.enquiriesCount} Enquiries</span>
                      </div>
                    </div>
                  </div>

                  {/* Dual Action Buttons: Send Enquiry + Request Sample */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendEnquiry(post);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.actionText || 'Send Enquiry'}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendEnquiry(post, `வணக்கம்! "${post.businessName}" அவர்களின் தயாரிப்பு மாதிரி (Sample Piece) பெற விரும்புகிறேன். கொரியர் விவரம் கூறவும்.`);
                      }}
                      className="w-full py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5 text-amber-300" />
                      <span>மாதிரி கோரிக்கை (Request Sample)</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
