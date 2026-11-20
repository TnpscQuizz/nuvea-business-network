import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, MessageCircle, Send, Volume2, VolumeX, 
  Play, CheckCircle2, MapPin, Search, ChevronUp, ChevronDown, 
  Sparkles, Share2 
} from 'lucide-react';
import type { BizPost } from '../../../types';

interface ReelsViewProps {
  reels: BizPost[];
  onLike: (reelId: string) => void;
  onSendEnquiry: (reel: BizPost) => void;
  onShareWhatsApp: (reel: BizPost) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  onLike,
  onSendEnquiry,
  onShareWhatsApp,
}) => {
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
      ownerName: 'Chandru',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      taluk: 'Chennai',
      category: 'Business Network',
      type: 'video' as const,
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-code-on-a-laptop-keyboard-41253-large.mp4',
      caption: 'Business is Better Together... ❤️ Connect, Collaborate & Grow on Shinegah!',
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
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto h-[86vh] rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col justify-between select-none">
      
      {/* 1. TOP TABS: For You | Business | Trending | 🔍 (EXACT MOCKUP) */}
      <div className="absolute top-0 inset-x-0 p-4 z-30 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-5 text-sm font-bold">
          <button
            onClick={() => setActiveTab('for_you')}
            className={`transition cursor-pointer ${
              activeTab === 'for_you' ? 'text-white border-b-2 border-white pb-0.5' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`transition cursor-pointer ${
              activeTab === 'business' ? 'text-white border-b-2 border-white pb-0.5' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Business
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`transition cursor-pointer ${
              activeTab === 'trending' ? 'text-white border-b-2 border-white pb-0.5' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trending
          </button>
        </div>

        <button className="p-2 text-white/80 hover:text-white transition cursor-pointer">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* 2. REELS VIDEO VIEWPORT */}
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
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

        {/* Center Shinegah Watermark (Exact Mockup) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-1.5 opacity-80 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="text-sm font-black text-white tracking-wider">
              Shinegah
            </div>
            <div className="text-[10px] text-slate-300 font-semibold tracking-wider">
              Grow Together ✨
            </div>
          </div>
        </div>

        {/* Play / Pause Overlay Icon */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white">
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
      <div className="absolute right-3.5 bottom-24 z-30 flex flex-col items-center gap-5">
        
        {/* Like */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(currentReel.id);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white group-hover:bg-rose-600/30 transition border border-white/10">
            <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
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
          <div className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white group-hover:bg-blue-600/30 transition border border-white/10">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
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
          <div className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white group-hover:bg-indigo-600/30 transition border border-white/10">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
            1.1K
          </span>
        </button>

        {/* Mute / Unmute */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white transition border border-white/10 cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-blue-400" />}
        </button>

      </div>

      {/* 4. BOTTOM INFO OVERLAY: Avatar, @shinegah.in, Follow button, Caption, Enquire */}
      <div className="absolute bottom-0 inset-x-0 p-4 pt-10 z-30 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3">
        
        {/* Profile + Follow Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-purple-600">
              <img
                src={currentReel.avatar}
                alt={currentReel.businessName}
                className="w-full h-full rounded-full object-cover border border-black"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-white">
                @{currentReel.businessName === 'Shinegah' ? 'shinegah.in' : currentReel.businessName.toLowerCase().replace(/\s+/g, '_')}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>

          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              isFollowing
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
          {currentReel.caption}
        </p>

        {/* Dual Button: Enquiry */}
        <button
          onClick={() => onSendEnquiry(currentReel)}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold text-xs rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 rotate-45" />
          <span>Enquire Now (விலை & விபரம் கேட்க)</span>
        </button>

      </div>

      {/* Up / Down Navigation Controls */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 opacity-0 hover:opacity-100 transition">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 disabled:opacity-30 transition"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          disabled={activeIndex === filteredReels.length - 1}
          className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 disabled:opacity-30 transition"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
