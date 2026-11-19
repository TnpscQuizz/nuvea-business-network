import React, { useState } from 'react';
import { Search, MapPin, Tag, Film, Heart, MessageCircle } from 'lucide-react';
import type { BizPost } from '../../../types';

interface ExploreViewProps {
  posts: BizPost[];
  onSelectPost: (post: BizPost) => void;
  onSendEnquiry: (post: BizPost) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  onSelectPost,
  onSendEnquiry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const taluks = ['All', 'சேலம் (Salem)', 'தருமபுரி (Dharmapuri)', 'ஹரூர் (Harur)', 'ஓமலூர் (Omalur)', 'ஆத்தூர் (Attur)'];
  const categories = ['All', 'ஜவுளி & பட்டு', 'வேளாண் இயந்திரங்கள்', 'தங்க நகைகள்', 'கட்டுமானப் பொருட்கள்', 'டிஜிட்டல் மார்க்கெட்டிங்'];

  const filteredPosts = posts.filter((post) => {
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
    <div className="max-w-5xl mx-auto space-y-5 pb-12 select-none">
      
      {/* 1. SEARCH BAR */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="தயாரிப்பு, சேவை, தாலுகா அல்லது வணிகரைத் தேடவும் (Search products, reels, businesses)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* 2. TALUK & CATEGORY FILTER PILLS */}
      <div className="space-y-2.5">
        
        {/* Taluk Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-600" />
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

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-purple-600" />
            <span>பிரிவு:</span>
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
              {c === 'All' ? 'அனைத்து துறைகள்' : c}
            </button>
          ))}
        </div>

      </div>

      {/* 3. EXPLORE MOSAIC GRID */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-bold">
          தேடலுக்குரிய பதிவுகள் எதுவும் கிடைக்கவில்லை.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-slate-200/50"
            >
              {post.type === 'video' ? (
                <video
                  src={post.mediaUrl}
                  poster={post.thumbnailUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  muted
                />
              ) : (
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              )}

              {/* Video icon on top right */}
              {post.type === 'video' && (
                <div className="absolute top-2.5 right-2.5 text-white drop-shadow-md">
                  <Film className="w-4 h-4" />
                </div>
              )}

              {/* Hover Dark Overlay with Stats (Instagram Style) */}
              <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-white text-center">
                <div className="font-bold text-xs truncate max-w-full">
                  {post.businessName}
                </div>
                <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                  {post.category} • {post.taluk}
                </div>

                <div className="flex items-center gap-4 text-xs font-black mt-3">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>{post.enquiriesCount}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendEnquiry(post);
                  }}
                  className="mt-3 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full text-[11px] font-black shadow-md cursor-pointer"
                >
                  📩 Send Enquiry
                </button>
              </div>

              {/* Bottom Price Tag Pill */}
              {post.priceTag && (
                <div className="absolute bottom-2 left-2 z-10 bg-slate-950/80 backdrop-blur-xs text-amber-400 border border-amber-400/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {post.priceTag}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
