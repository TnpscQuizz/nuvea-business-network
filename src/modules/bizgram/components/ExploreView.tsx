import React, { useState } from 'react';
import { 
  Search, MapPin, Tag, Film, Heart, MessageCircle, 
  Volume2, VolumeX, CheckCircle2, ChevronDown, ChevronRight, 
  Factory, Store, Wrench, Laptop, MoreHorizontal, Sparkles, Send 
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
  const [selectedLocation, setSelectedLocation] = useState('Chennai');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredMuteId, setHoveredMuteId] = useState<string | null>(null);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const locations = [
    'Chennai', 
    'Salem', 
    'Dharmapuri', 
    'Coimbatore', 
    'Erode', 
    'Harur', 
    'Mettur'
  ];

  const categories = [
    { id: 'All', name: 'All', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'Manufacturing', name: 'Manufacturing', icon: <Factory className="w-4 h-4 text-blue-400" /> },
    { id: 'Retail', name: 'Retail', icon: <Store className="w-4 h-4 text-emerald-400" /> },
    { id: 'Services', name: 'Services', icon: <Wrench className="w-4 h-4 text-purple-400" /> },
    { id: 'Digital', name: 'Digital', icon: <Laptop className="w-4 h-4 text-cyan-400" /> },
    { id: 'More', name: 'More', icon: <MoreHorizontal className="w-4 h-4 text-slate-400" /> },
  ];

  // Only show approved posts in Explore Search
  const approvedPosts = posts.filter((p) => p.status !== 'pending' && p.status !== 'rejected');

  const filteredPosts = approvedPosts.filter((post) => {
    const matchesSearch =
      post.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.taluk.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === 'All' || 
      post.taluk.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || 
      selectedCategory === 'More' ||
      post.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 select-none font-sans">
      
      {/* 1. DISCOVER BUSINESSES HEADER & SEARCH CARD (EXACT MOCKUP) */}
      <div className="bg-[#0e1428]/90 backdrop-blur-2xl p-5 sm:p-6 rounded-3xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-4">
        
        {/* Top Header: Title + Location Dropdown */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Discover Businesses
          </h2>

          {/* Location Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="px-3.5 py-1.5 rounded-full bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{selectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            {showLocationMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-white/15 rounded-2xl p-1.5 shadow-2xl z-30 space-y-1">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedLocation === loc ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by category or business..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#080d1c] border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Category Icons Row (Manufacturing, Retail, Services, Digital, More) */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 border ${
                selectedCategory === c.id
                  ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {c.icon}
              <span>{c.name}</span>
            </button>
          ))}
        </div>

      </div>

      {/* 2. INTERACTIVE MAP PREVIEW CARD WITH GLOWING PINS (EXACT MOCKUP) */}
      <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] bg-[#070b18]">
        
        {/* Dark Modern Map Vector Simulation */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Simulated Road Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 120 Q 200 80, 500 160 T 1200 100" stroke="#60a5fa" strokeWidth="4" fill="none" />
          <path d="M100 -50 Q 250 150, 400 300" stroke="#818cf8" strokeWidth="3" fill="none" />
          <path d="M400 0 Q 600 200, 900 250" stroke="#38bdf8" strokeWidth="3" fill="none" />
        </svg>

        {/* Glowing Location Pins */}
        <div className="absolute top-1/4 left-1/6 animate-bounce">
          <div className="w-7 h-7 rounded-full bg-purple-600/40 p-1 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_12px_#c084fc]" />
          </div>
        </div>

        <div className="absolute top-1/3 left-1/3">
          <div className="w-8 h-8 rounded-full bg-blue-600/40 p-1 flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_15px_#60a5fa]" />
          </div>
        </div>

        <div className="absolute top-1/2 left-2/3">
          <div className="w-7 h-7 rounded-full bg-cyan-600/40 p-1 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
          </div>
        </div>

        <div className="absolute top-1/5 right-1/4">
          <div className="w-7 h-7 rounded-full bg-indigo-600/40 p-1 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_12px_#818cf8]" />
          </div>
        </div>

        {/* Floating Nearby Business Card (Sri Venkateswara Traders from Mockup) */}
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-20">
          <div 
            onClick={() => onSelectPost(posts[2] || posts[0])}
            className="p-3 bg-[#0c1224]/90 backdrop-blur-xl border border-white/15 rounded-2xl shadow-xl flex items-center justify-between gap-3 cursor-pointer hover:border-blue-400 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80"
                alt="Building Materials"
                className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/20"
              />
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1.5">
                  <span>Sri Venkateswara Traders</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <span>Building Materials</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">1.2 km away</span>
                </div>
              </div>
            </div>

            <button className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shrink-0 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. THREE-COLUMN DYNAMIC AUTOPLAY VIDEO GRID (3x8 = 24 B2B VIDEOS) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Film className="w-5 h-5 text-blue-400" />
            <span>3x8 Video Explore Grid ({filteredPosts.length} Videos)</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Auto-play Muted</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-[#0e1428] border border-white/10 rounded-3xl p-12 text-center text-slate-400 font-bold">
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
                  className="group relative aspect-[4/5] bg-slate-950 rounded-3xl overflow-hidden cursor-pointer shadow-lg border border-white/10 transition transform hover:-translate-y-1 hover:border-white/25"
                >
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
                  <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                    <Film className="w-3 h-3 text-blue-400" />
                    <span>Reel</span>
                  </div>

                  {/* Mute / Unmute Button on Video */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredMuteId(isUnmuted ? null : post.id);
                    }}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition shadow-md cursor-pointer border border-white/20"
                  >
                    {isUnmuted ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-white" />}
                  </button>

                  {/* Bottom Vignette & Information */}
                  <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent text-white space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-white truncate max-w-[80%]">
                        {post.businessName}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-0.5 text-blue-400 font-semibold truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {post.taluk}
                      </span>
                      <span className="font-bold text-white bg-white/10 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px]">
                        {post.category}
                      </span>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendEnquiry(post);
                        }}
                        className="flex-1 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[10px] rounded-full shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Enquire</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
