import React, { useState } from 'react';
import { 
  Search, MapPin, Tag, Film, Heart, MessageCircle, 
  Volume2, VolumeX, CheckCircle2, ChevronDown, ChevronRight, 
  Factory, Store, Wrench, Laptop, MoreHorizontal, Sparkles, Send, 
  Compass, Radio, Navigation, ShieldCheck 
} from 'lucide-react';
import type { BizPost } from '../../../types';

interface ExploreViewProps {
  posts: BizPost[];
  onSelectPost: (post: BizPost) => void;
  onSendEnquiry: (post: BizPost, customMsg?: string) => void;
}

interface MapPinData {
  id: string;
  name: string;
  category: string;
  distance: string;
  image: string;
  top: string;
  left: string;
  color: string;
  postIndex: number;
  rating: string;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  onSelectPost,
  onSendEnquiry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Chennai');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRadius, setSelectedRadius] = useState<'5km' | '15km' | '50km' | 'all'>('15km');
  const [hoveredMuteId, setHoveredMuteId] = useState<string | null>(null);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [activePinId, setActivePinId] = useState<string>('pin_venkat');

  const locations = [
    'Chennai', 
    'Salem', 
    'Dharmapuri', 
    'Coimbatore', 
    'Erode', 
    'Tirupur', 
    'Madurai', 
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

  // Interactive Radar Map Pins
  const mapPins: MapPinData[] = [
    {
      id: 'pin_venkat',
      name: 'Sri Venkateswara Traders',
      category: 'Building Materials • TMT Steel',
      distance: '1.2 km away',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80',
      top: '42%',
      left: '32%',
      color: 'bg-blue-500',
      postIndex: 2,
      rating: '4.9 ★ (Direct Dealer)',
    },
    {
      id: 'pin_murugan',
      name: 'முருகன் பட்டு கைத்தறி நெசவகம்',
      category: 'Pure Silk Sarees • Direct Mill',
      distance: '2.4 km away',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80',
      top: '26%',
      left: '58%',
      color: 'bg-purple-500',
      postIndex: 1,
      rating: '5.0 ★ (Weaver)',
    },
    {
      id: 'pin_kongu',
      name: 'கொங்கு அக்ரோ டெக்னாலஜிஸ்',
      category: 'Agro Machinery & Harvesters',
      distance: '3.8 km away',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80',
      top: '65%',
      left: '68%',
      color: 'bg-emerald-500',
      postIndex: 3,
      rating: '4.8 ★ (OEM)',
    },
    {
      id: 'pin_cnc',
      name: 'மேட்டூர் துல்லிய CNC & லேத்',
      category: 'Machining & Auto Spares',
      distance: '5.1 km away',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=200&q=80',
      top: '32%',
      left: '82%',
      color: 'bg-amber-500',
      postIndex: 4,
      rating: '4.9 ★ (Factory)',
    },
  ];

  const activePin = mapPins.find((p) => p.id === activePinId) || mapPins[0];

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
      
      {/* ========================================================================= */}
      {/* 1. DISCOVER BUSINESSES HEADER & SEARCH (EXACT MOCKUP BOTTOM LEFT)         */}
      {/* ========================================================================= */}
      <div className="apple-glass apple-specular-edge p-5 sm:p-6 rounded-[32px] space-y-4">
        
        {/* Top Header: Title + Location Dropdown */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Discover Businesses
              </h2>
              <p className="text-[11px] text-slate-400">உறுதிப்படுத்தப்பட்ட நேரடி வணிகர்கள் & உற்பத்தியாளர்கள்</p>
            </div>
          </div>

          {/* Location Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="px-4 py-2 rounded-full bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-400/40 text-indigo-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{selectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            {showLocationMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-1.5 shadow-2xl z-30 space-y-1">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedLocation === loc ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
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
            className="w-full pl-11 pr-4 py-3.5 bg-[#070b18]/80 border border-white/15 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 shadow-inner transition"
          />
        </div>

        {/* Category Icons Row (Manufacturing, Retail, Services, Digital, More) */}
        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 border ${
                selectedCategory === c.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {c.icon}
              <span>{c.name}</span>
            </button>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE RADAR GPS MAP CARD (EXACT MOCKUP WITH SONAR RADAR)         */}
      {/* ========================================================================= */}
      <div className="relative h-64 sm:h-72 rounded-[32px] overflow-hidden apple-glass apple-specular-edge bg-[#060a16] shadow-2xl">
        
        {/* Dark Modern Map Grid */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:28px_28px]" />
        
        {/* Vector Arteries & Roads */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 140 Q 200 90, 500 180 T 1200 120" stroke="#60a5fa" strokeWidth="4" fill="none" />
          <path d="M120 -50 Q 280 160, 420 320" stroke="#818cf8" strokeWidth="3" fill="none" />
          <path d="M380 0 Q 620 220, 920 270" stroke="#38bdf8" strokeWidth="3" fill="none" />
        </svg>

        {/* Central Sonar Radar Ring Scanner */}
        <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-32 h-32 rounded-full border border-blue-400/30 animate-radar-sonar" />
          <div className="w-56 h-56 rounded-full border border-indigo-400/20 animate-radar-sonar [animation-delay:0.9s]" />
          <div className="w-80 h-80 rounded-full border border-cyan-400/15 animate-radar-sonar [animation-delay:1.8s]" />
        </div>

        {/* Distance Radius Filter Buttons on Top-Right */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
          {(['5km', '15km', '50km', 'all'] as const).map((rad) => (
            <button
              key={rad}
              onClick={() => setSelectedRadius(rad)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                selectedRadius === rad
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {rad === 'all' ? 'All TN' : rad}
            </button>
          ))}
        </div>

        {/* Top-Left Live Radar Tag */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Radar: {selectedLocation} ({mapPins.length} Businesses Live)</span>
        </div>

        {/* Interactive Glowing Pins */}
        {mapPins.map((pin) => {
          const isActive = pin.id === activePinId;
          return (
            <div
              key={pin.id}
              onClick={() => setActivePinId(pin.id)}
              style={{ top: pin.top, left: pin.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition transform hover:scale-125 z-20 ${
                isActive ? 'scale-125 z-30' : ''
              }`}
            >
              <div className={`relative w-8 h-8 rounded-full p-1 flex items-center justify-center transition shadow-lg ${
                isActive ? 'bg-white/30' : 'bg-black/40'
              }`}>
                <div className={`w-5 h-5 rounded-full ${pin.color} border-2 border-white shadow-[0_0_15px_currentColor] flex items-center justify-center text-white text-[8px] font-black`}>
                  •
                </div>
                {isActive && (
                  <div className="absolute -inset-1 rounded-full border border-blue-400 animate-ping pointer-events-none" />
                )}
              </div>
            </div>
          );
        })}

        {/* Floating Spotlight Business Card at Bottom (Exact Mockup: Sri Venkateswara Traders) */}
        <div className="absolute bottom-3.5 inset-x-3.5 sm:inset-x-5 z-20">
          <div 
            onClick={() => onSelectPost(posts[activePin.postIndex] || posts[0])}
            className="p-3 sm:p-3.5 apple-glass apple-specular-edge rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-blue-400/80 transition group shadow-2xl"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={activePin.image}
                alt={activePin.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20 group-hover:scale-105 transition"
              />
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1.5">
                  <span>{activePin.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                </div>
                <div className="text-[11px] text-slate-300 truncate flex items-center gap-1.5 mt-0.5">
                  <span>{activePin.category}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{activePin.distance}</span>
                </div>
                <div className="text-[10px] text-amber-300 font-semibold">{activePin.rating}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSendEnquiry(posts[activePin.postIndex] || posts[0]);
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition flex items-center gap-1"
              >
                <span>Enquire</span>
                <Send className="w-3 h-3 rotate-45 -mt-0.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. THREE-COLUMN DYNAMIC AUTOPLAY VIDEO GRID (3x8 = 24 B2B VIDEOS)         */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                3x8 Video Explore Grid
              </h3>
              <p className="text-[11px] text-slate-400">{filteredPosts.length} B2B தயாரிப்பு வீடியோக்கள்</p>
            </div>
          </div>
          <span className="text-xs text-blue-400 font-medium bg-blue-950/60 border border-blue-500/30 px-3 py-1 rounded-full">
            Auto-play Muted
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="apple-glass rounded-3xl p-12 text-center text-slate-400 font-bold">
            தேடலுக்குரிய அங்கீகரிக்கப்பட்ட வணிக வீடியோக்கள் எதுவும் இல்லை.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {filteredPosts.map((post) => {
              const isUnmuted = hoveredMuteId === post.id;
              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="group relative aspect-[4/5] bg-slate-950 rounded-[28px] overflow-hidden cursor-pointer apple-glass apple-specular-edge transition transform hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
                >
                  {/* Native Muted Auto-Playing Video */}
                  <video
                    src={post.mediaUrl}
                    poster={post.thumbnailUrl}
                    playsInline
                    loop
                    autoPlay
                    muted={!isUnmuted}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Top Category Badge */}
                  <div className="absolute top-3.5 left-3.5 z-20 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                    <Film className="w-3 h-3 text-blue-400" />
                    <span>Reel</span>
                  </div>

                  {/* Mute / Unmute Button on Video */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredMuteId(isUnmuted ? null : post.id);
                    }}
                    className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition shadow-md cursor-pointer border border-white/20"
                    title={isUnmuted ? "Mute" : "Unmute"}
                  >
                    {isUnmuted ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-white" />}
                  </button>

                  {/* Bottom Vignette & Information with Glass Reflection */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent text-white space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[80%]">
                        {post.businessName}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1 text-blue-400 font-semibold truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {post.taluk}
                      </span>
                      <span className="font-bold text-white bg-white/10 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px]">
                        {post.category}
                      </span>
                    </div>

                    {/* Dual Action Bottom Bar */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendEnquiry(post);
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold text-[11px] rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] transition flex items-center justify-center gap-1.5 cursor-pointer transform hover:scale-[1.02]"
                      >
                        <Send className="w-3 h-3 rotate-45 -mt-0.5" />
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
