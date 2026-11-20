import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, ThumbsDown, MessageCircle, Send, Volume2, VolumeX, 
  Play, CheckCircle2, MapPin, Search, ChevronUp, ChevronDown, 
  Sparkles, Share2, Tag, Bookmark, Zap 
} from 'lucide-react';
import type { BizPost } from '../../../types';
import { translations, type Language } from '../data/translations';

interface ReelsViewProps {
  reels: BizPost[];
  lang?: Language;
  onLike: (reelId: string) => void;
  onSendEnquiry: (reel: BizPost) => void;
  onShareWhatsApp: (reel: BizPost) => void;
  onBuyNow?: (reel: BizPost) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  lang = 'en',
  onLike,
  onSendEnquiry,
  onShareWhatsApp,
  onBuyNow,
}) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<'for_you' | 'business' | 'trending'>('for_you');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [dislikedMap, setDislikedMap] = useState<Record<string, boolean>>({});
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
      caption: 'Business is Better Together... ✨ Verified trade & B2B networking at scale across Tamil Nadu.',
      actionText: '✈️ Enquire',
      phone: '917548820641',
      likes: 24800,
      dislikes: 14,
      enquiriesCount: 482,
      commentsCount: 1100,
      createdAt: 'Just now',
      isReel: true,
      status: 'approved' as const,
    }
  ];

  const currentReel = filteredReels[activeIndex] || filteredReels[0];
  const isCurrentDisliked = dislikedMap[currentReel.id] || false;

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

  const handleToggleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDislikedMap((prev) => ({
      ...prev,
      [currentReel.id]: !prev[currentReel.id]
    }));
  };

  return (
    <div className="relative w-full h-[100dvh] md:h-[88vh] md:max-w-md mx-auto overflow-hidden md:rounded-[38px] apple-glass apple-specular-edge shadow-[0_20px_50px_rgba(15,23,42,0.12),0_0_45px_rgba(255,255,255,1)] flex flex-col justify-between select-none border-0 md:border-2 md:border-white bg-black">
      
      {/* 1. TOP TABS: For You | Business | Trending | 🔍 */}
      <div className="absolute top-0 inset-x-0 p-4 pt-6 md:pt-5 z-30 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/45 to-transparent">
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

        <div className="flex items-center gap-2">
          {/* Mute / Unmute Button in Top Corner */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition cursor-pointer"
            title="Audio toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
        </div>
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
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center shadow-lg">
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

      {/* 3. INTERACTIVE ACTION COLUMN (❤️ Likes, 👎 Dislike, 💬 Comment, ↗️ Share, 🔖 Save) */}
      <div className="absolute right-3.5 bottom-24 md:bottom-28 z-30 flex flex-col items-center gap-3.5">
        
        {/* Like */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(currentReel.id);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          title="Like"
        >
          <div className={`p-3 rounded-full backdrop-blur-2xl text-white group-hover:scale-110 transition border border-white/25 shadow-lg ${
            currentReel.isLiked ? 'bg-rose-500/80 border-rose-400' : 'bg-white/[0.12] hover:bg-white/[0.22]'
          }`}>
            <Heart className={`w-5 h-5 ${currentReel.isLiked ? 'text-white fill-white' : 'text-white'}`} />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            {currentReel.isLiked ? (currentReel.likes || 24800) + 1 : currentReel.likes || '24.8K'}
          </span>
        </button>

        {/* Dislike (User requested Dislike feature!) */}
        <button
          onClick={handleToggleDislike}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          title="Dislike"
        >
          <div className={`p-3 rounded-full backdrop-blur-2xl text-white group-hover:scale-110 transition border border-white/25 shadow-lg ${
            isCurrentDisliked ? 'bg-slate-700/80 border-slate-400' : 'bg-white/[0.12] hover:bg-white/[0.22]'
          }`}>
            <ThumbsDown className={`w-5 h-5 ${isCurrentDisliked ? 'text-amber-300 fill-amber-300' : 'text-white'}`} />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            {isCurrentDisliked ? (currentReel.dislikes || 14) + 1 : currentReel.dislikes || 14}
          </span>
        </button>

        {/* Comment / Enquiry */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSendEnquiry(currentReel);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          title="Comments"
        >
          <div className="p-3 rounded-full bg-white/[0.12] backdrop-blur-2xl text-white group-hover:bg-white/[0.22] group-hover:scale-110 transition border border-white/25 shadow-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            {currentReel.enquiriesCount || 482}
          </span>
        </button>

        {/* Share */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShareWhatsApp(currentReel);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          title="Share"
        >
          <div className="p-3 rounded-full bg-white/[0.12] backdrop-blur-2xl text-white group-hover:bg-white/[0.22] group-hover:scale-110 transition border border-white/25 shadow-lg">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            1.1K
          </span>
        </button>

        {/* Save / Bookmark */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          title="Save"
        >
          <div className={`p-3 rounded-full backdrop-blur-2xl text-white group-hover:scale-110 transition border border-white/25 shadow-lg ${
            isSaved ? 'bg-amber-500/80' : 'bg-white/[0.12] hover:bg-white/[0.22]'
          }`}>
            <Bookmark className={`w-5 h-5 ${isSaved ? 'text-white fill-white' : 'text-white'}`} />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            {isSaved ? 'Saved' : 'Save'}
          </span>
        </button>

      </div>

      {/* 4. BOTTOM INFO OVERLAY: Avatar, @shinegah.in, Follow button, Caption, Enquire */}
      <div className="absolute bottom-0 inset-x-0 p-4 pt-12 pb-6 md:pb-4 z-30 bg-gradient-to-t from-black via-black/85 to-transparent space-y-3">
        
        {/* Profile + Follow Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 via-purple-500 to-amber-500 shadow-[0_0_12px_rgba(249,115,22,0.35)]">
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

        {/* Action Buttons: Enquire & Instant Buy Now */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onSendEnquiry(currentReel)}
            className="py-2.5 px-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl border border-white/30 flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 rotate-45 -mt-0.5" />
            <span>{t.enquire}</span>
          </button>
          <button
            onClick={() => onBuyNow ? onBuyNow(currentReel) : onSendEnquiry(currentReel)}
            className="py-2.5 px-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center gap-1.5 text-xs transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>

      {/* Up / Down Navigation Controls */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 opacity-0 md:hover:opacity-100 transition hidden md:flex">
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
