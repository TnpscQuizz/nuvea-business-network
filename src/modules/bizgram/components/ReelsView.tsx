import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, MessageCircle, Send, Volume2, VolumeX, 
  Play, CheckCircle2, MapPin, Search, ChevronUp, ChevronDown, 
  Sparkles, Share2, Tag 
} from 'lucide-react';
import type { BizPost } from '../../../types';
import { translations, type Language } from '../data/translations';

interface ReelsViewProps {
  reels: BizPost[];
  lang?: Language;
  onLike: (reelId: string) => void;
  onSendEnquiry: (reel: BizPost) => void;
  onShareWhatsApp: (reel: BizPost) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  lang = 'en',
  onLike,
  onSendEnquiry,
  onShareWhatsApp,
}) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<'for_you' | 'business' | 'trending'>('for_you');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const filteredReels = reels.length > 0 ? reels : [
    {
      id: 'demo_reel_1',
      memberId: 'usr_shinegah',
      businessName: 'Shinegah',
      ownerName: 'Chandru S',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      taluk: 'Chennai',
      category: 'Enterprise Network',
      type: 'video' as const,
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-code-on-a-laptop-keyboard-41253-large.mp4',
      caption: 'Business is Better Together... ✨ Verified trade & B2B networking at scale.',
      actionText: '✈️ Enquire',
      phone: '917548820641',
      likes: 24800,
      enquiriesCount: 482,
      commentsCount: 1100,
      createdAt: 'Just now',
      isReel: true,
      status: 'approved' as const,
    }
  ];

  const currentReel = filteredReels[activeIndex] || filteredReels[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, filteredReels.length]);

  // Video playback
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (vid) {
        if (idx === activeIndex) {
          vid.currentTime = 0;
          vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
          vid.pause();
        }
      }
    });
  }, [activeIndex]);

  const handleNext = () => {
    if (activeIndex < filteredReels.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleDoubleTap = () => {
    if (!currentReel.isLiked) {
      onLike(currentReel.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto h-[86vh] rounded-[36px] overflow-hidden apple-glass apple-specular-edge shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col justify-between select-none">
      
      {/* 1. TOP TABS: For You | Business | Trending | 🔍 */}
      <div className="absolute top-0 inset-x-0 p-4 pt-5 z-30 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        <div className="flex items-center gap-5 text-xs sm:text-sm font-extrabold tracking-tight">
          <button
            onClick={() => setActiveTab('for_you')}
            className={`transition cursor-pointer ${
              activeTab === 'for_you' ? 'text-white border-b-2 border-white pb-0.5' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.forYou}
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`transition cursor-pointer ${
              activeTab === 'business' ? 'text-white border-b-2 border-white pb-0.5' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.businessTab}
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`transition cursor-pointer ${
              activeTab === 'trending' ? 'text-white border-b-2 border-white pb-0.5' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.trendingTab}
          </button>
        </div>

        <button className="p-2 text-white/80 hover:text-white transition cursor-pointer rounded-full hover:bg-white/10">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* 2. REELS VIDEO VIEWPORT */}
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-pointer bg-black"
        onDoubleClick={handleDoubleTap}
        onClick={() => {
          const vid = videoRefs.current[activeIndex];
          if (vid) {
            if (vid.paused) {
              vid.play();
              setIsPlaying(true);
            } else {
              vid.pause();
              setIsPlaying(false);
            }
          }
        }}
      >
        <video
          ref={(el) => (videoRefs.current[activeIndex] = el)}
          src={currentReel.mediaUrl}
          poster={currentReel.thumbnailUrl}
          playsInline
          loop
          autoPlay
          muted={isMuted}
          className="w-full h-full object-cover"
        />

        {/* Center Watermark Glass Pill */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-1 opacity-70 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs font-black text-white tracking-wider">
              Shinegah™
            </div>
            <div className="text-[9px] text-slate-300 font-medium">
              Grow Together ✨
            </div>
          </div>
        </div>

        {/* Play / Pause Overlay Icon */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-2xl">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Double Tap Heart Anim */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl" />
          </div>
        )}
      </div>

      {/* 3. RIGHT ACTION COLUMN (❤️ 24.8K, 💬 482, ↗️ 1.1K) */}
      <div className="absolute right-3.5 bottom-28 z-30 flex flex-col items-center gap-4">
        
        {/* Like */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(currentReel.id);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-3 rounded-full bg-white/[0.08] backdrop-blur-2xl text-white group-hover:bg-white/[0.18] transition border border-white/20 shadow-lg">
            <Heart className={`w-5 h-5 ${currentReel.isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            24.8K
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSendEnquiry(currentReel);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-3 rounded-full bg-white/[0.08] backdrop-blur-2xl text-white group-hover:bg-white/[0.18] transition border border-white/20 shadow-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            482
          </span>
        </button>

        {/* Share */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShareWhatsApp(currentReel);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-3 rounded-full bg-white/[0.08] backdrop-blur-2xl text-white group-hover:bg-white/[0.18] transition border border-white/20 shadow-lg">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            1.1K
          </span>
        </button>

        {/* Mute / Unmute */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="p-3 rounded-full bg-white/[0.08] backdrop-blur-2xl text-white hover:bg-white/[0.18] transition border border-white/20 cursor-pointer shadow-lg"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>

      </div>

      {/* 4. BOTTOM INFO OVERLAY: Avatar, @shinegah.in, Follow button, Caption, Enquire */}
      <div className="absolute bottom-0 inset-x-0 p-4 pt-12 z-30 bg-gradient-to-t from-black via-black/85 to-transparent space-y-3">
        
        {/* Profile + Follow Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-white/40 to-white/10">
              <img
                src={currentReel.avatar}
                alt={currentReel.businessName}
                className="w-full h-full rounded-full object-cover border border-black"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-white tracking-tight">
                @{currentReel.businessName === 'Shinegah' ? 'shinegah.in' : currentReel.businessName.toLowerCase().replace(/\s+/g, '_')}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white/20" />
            </div>
          </div>

          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer shadow-md ${
              isFollowing
                ? 'bg-white/15 text-white border border-white/25 hover:bg-white/20'
                : 'bg-white text-black hover:bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
            }`}
          >
            {isFollowing ? t.following : t.follow}
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal">
          {currentReel.caption}
        </p>

        {/* Pricing tag chip if present */}
        {currentReel.priceTag && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-300 font-bold">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentReel.priceTag}</span>
          </div>
        )}

        {/* Primary Action Button: Enquire Now (Apple Crisp White Button - No Blue) */}
        <button
          onClick={() => onSendEnquiry(currentReel)}
          className="w-full py-3 apple-btn-primary rounded-full flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 rotate-45 -mt-0.5" />
          <span>{t.enquire}</span>
        </button>

      </div>

      {/* Up / Down Navigation Controls */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 opacity-0 hover:opacity-100 transition">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/90 disabled:opacity-30 transition border border-white/10"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          disabled={activeIndex === filteredReels.length - 1}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/90 disabled:opacity-30 transition border border-white/10"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
