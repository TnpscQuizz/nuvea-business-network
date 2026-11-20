import React, { useState } from 'react';
import { 
  Search, MapPin, Tag, Film, Heart, MessageCircle, 
  Volume2, VolumeX, CheckCircle2, ChevronRight, 
  Sparkles, Send, ShieldCheck, Filter, Store 
} from 'lucide-react';
import type { BizPost } from '../../../types';
import { translations, type Language } from '../data/translations';

interface SearchViewProps {
  posts: BizPost[];
  lang?: Language;
  onSelectPost: (post: BizPost) => void;
  onSendEnquiry: (post: BizPost) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  posts,
  lang = 'en',
  onSelectPost,
  onSendEnquiry,
}) => {
  const t = translations[lang] || translations.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);

  const categories = [
    'All',
    'Manufacturing',
    'Technology',
    'Textiles & Handloom Silk',
    'Steel & Construction',
    'CNC Machining & Automotive',
    'Agricultural Machinery',
    'Retail',
    'Services',
  ];

  const districts = [
    'All',
    'Chennai',
    'Salem',
    'Coimbatore',
    'Dharmapuri',
    'Erode',
    'Tirupur',
    'Madurai',
    'Harur',
    'Mettur',
  ];

  const trendingTags = [
    '#B2B', 
    '#Wholesale', 
    '#TamilNaduTextiles', 
    '#SalemSteel', 
    '#KonguMachinery', 
    '#ChennaiTech'
  ];

  // Filter posts based on query, category, district
  const filteredPosts = posts.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      p.businessName.toLowerCase().includes(q) ||
      p.caption.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.taluk.toLowerCase().includes(q) ||
      (p.wholesalePrice && p.wholesalePrice.toLowerCase().includes(q));

    const matchCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchDistrict =
      selectedDistrict === 'All' ||
      p.taluk.toLowerCase().includes(selectedDistrict.toLowerCase());

    return matchQuery && matchCategory && matchDistrict;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 select-none font-sans">
      
      {/* 1. MANDATORY SEARCH BAR & LOCATION SELECTOR (APPLE WHITE GLOW GLASS) */}
      <div className="apple-glass apple-specular-edge rounded-[36px] p-4 sm:p-5 space-y-4 border-2 border-white shadow-xl">
        
        <div className="flex items-center gap-2">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              autoFocus
              placeholder={t.searchPlaceholder || 'Search businesses, products, locations, tags...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white/80 border border-white/95 focus:bg-white focus:border-slate-400 focus:outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* District Filter Pill */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-3.5 rounded-full bg-white/80 border border-white text-xs font-bold text-slate-800 shadow-sm focus:outline-none cursor-pointer"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Districts' : d}
              </option>
            ))}
          </select>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition cursor-pointer whitespace-nowrap shadow-sm ${
                selectedCategory === cat
                  ? 'bg-slate-950 text-white font-extrabold shadow-md'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trending Hashtag Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-slate-500 pt-1 border-t border-white/70">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Trending:</span>
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag.replace('#', ''))}
              className="hover:text-slate-950 hover:underline cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

      </div>

      {/* 2. RESULTS SUMMARY */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-600 font-bold">
        <span>
          Showing {filteredPosts.length} B2B Trade Listings
        </span>
        {searchQuery && (
          <span className="font-mono text-[11px] text-slate-500">
            Keyword: "{searchQuery}"
          </span>
        )}
      </div>

      {/* 3. 3xN INSTAGRAM EXPLORE VIDEO & POST GRID */}
      {filteredPosts.length === 0 ? (
        <div className="apple-glass apple-specular-edge rounded-3xl p-12 text-center text-slate-400 space-y-2 border-2 border-white">
          <Search className="w-10 h-10 mx-auto text-slate-300" />
          <div className="font-bold text-sm text-slate-600">No matching business listings found</div>
          <p className="text-xs text-slate-400">Try adjusting your keyword or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {filteredPosts.map((post) => {
            const isVideo = post.type === 'video';
            const isHovered = hoveredVideoId === post.id;

            return (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                onMouseEnter={() => isVideo && setHoveredVideoId(post.id)}
                onMouseLeave={() => isVideo && setHoveredVideoId(null)}
                className="relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden apple-glass apple-specular-edge group cursor-pointer shadow-md border-2 border-white"
              >
                {/* Media Element (Video with muted autoplay on hover, or Image) */}
                {isVideo ? (
                  <video
                    src={post.mediaUrl}
                    poster={post.thumbnailUrl}
                    muted
                    loop
                    playsInline
                    autoPlay={isHovered}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <img
                    src={post.thumbnailUrl || post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                )}

                {/* Video Badge in Top Right */}
                {isVideo && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white backdrop-blur-md shadow-sm">
                    <Film className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Location Pill in Top Left */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/85 text-slate-900 backdrop-blur-md text-[10px] font-bold border border-white shadow-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-700" />
                  <span>{post.taluk}</span>
                </div>

                {/* Bottom Overlay with Business Name & Enquire CTA */}
                <div className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs truncate">
                      {post.businessName}
                    </span>
                    <CheckCircle2 className="w-3 h-3 text-white fill-white/20 shrink-0" />
                  </div>

                  <p className="text-[10px] text-slate-200 line-clamp-1 mt-0.5 font-normal">
                    {post.caption}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-white/20">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">
                      {post.priceTag || 'B2B Trade'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendEnquiry(post);
                      }}
                      className="px-2.5 py-1 rounded-full bg-white text-slate-950 font-black text-[10px] hover:bg-slate-200 transition shadow-sm"
                    >
                      Enquire
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
