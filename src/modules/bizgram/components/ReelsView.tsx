import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, Volume2, VolumeX, 
  Play, CheckCircle2, MapPin, Tag, ChevronUp, ChevronDown, 
  Music, Phone 
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Keyboard navigation (Arrow Up / Down)
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
  }, [activeIndex, reels.length]);

  // Handle active video playback
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
    if (activeIndex < reels.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const currentReel = reels[activeIndex];

  const handleVideoTap = () => {
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
  };

  const handleDoubleTap = () => {
    if (currentReel && !currentReel.isLiked) {
      onLike(currentReel.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    videoRefs.current.forEach((vid) => {
      if (vid) vid.muted = !isMuted;
    });
  };

  if (!currentReel) {
    return (
      <div className="h-[75vh] flex items-center justify-center text-slate-500 font-bold">
        ரீல்ஸ்கள் எதுவும் இல்லை.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[460px] mx-auto h-[84vh] sm:h-[86vh] flex items-center justify-center select-none">
      
      {/* DESKTOP UP / DOWN SWITCHING ARROWS */}
      <div className="hidden md:flex flex-col gap-3 absolute -right-16 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className={`p-3 rounded-full bg-white border border-slate-200 shadow-md text-slate-800 transition ${
            activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'
          }`}
          title="Previous Reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          disabled={activeIndex === reels.length - 1}
          className={`p-3 rounded-full bg-white border border-slate-200 shadow-md text-slate-800 transition ${
            activeIndex === reels.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'
          }`}
          title="Next Reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* REELS CONTAINER (9:16 VERTICAL ASPECT RATIO) */}
      <div 
        onDoubleClick={handleDoubleTap}
        className="relative w-full h-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center cursor-pointer group"
      >
        
        {/* VIDEO PLAYER */}
        <div className="relative w-full h-full flex items-center justify-center" onClick={handleVideoTap}>
          <video
            ref={(el) => { videoRefs.current[activeIndex] = el; }}
            src={currentReel.mediaUrl}
            poster={currentReel.thumbnailUrl}
            playsInline
            loop
            autoPlay
            muted={isMuted}
            className="w-full h-full object-cover"
          />

          {/* Pause Indicator */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center">
                <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
          )}

          {/* Double Tap Heart Explosion */}
          {showHeartAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-in zoom-in-50 fade-in duration-200">
              <Heart className="w-28 h-28 text-rose-500 fill-rose-500 drop-shadow-2xl scale-125 transition-transform" />
            </div>
          )}

          {/* Gradient Dark Overlays */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
        </div>

        {/* TOP BAR: CATEGORY & MUTE */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-black shadow-md">
            <span>🎬</span>
            <span>{currentReel.category}</span>
          </div>

          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-slate-900/70 backdrop-blur-md text-white hover:bg-slate-900 transition z-30 cursor-pointer shadow-md"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* RIGHT FLOATING ACTION BAR (INSTAGRAM REELS STYLE) */}
        <div className="absolute right-3.5 bottom-24 flex flex-col items-center gap-4 z-30 text-white">
          
          {/* Creator Avatar with Follow/Connect Badge */}
          <div className="relative mb-2">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md">
              <img 
                src={currentReel.avatar} 
                alt={currentReel.businessName}
                className="w-full h-full rounded-full object-cover border border-white"
              />
            </div>
          </div>

          {/* Like Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onLike(currentReel.id)}
              className="p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-slate-900 transition cursor-pointer group"
            >
              <Heart className={`w-7 h-7 transition transform group-hover:scale-125 ${
                currentReel.isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'
              }`} />
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentReel.likes}
            </span>
          </div>

          {/* Enquiry Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onSendEnquiry(currentReel)}
              className="p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-slate-900 text-amber-400 transition cursor-pointer group"
              title="விசாரிக்க (Send Enquiry)"
            >
              <MessageCircle className="w-7 h-7 transition transform group-hover:scale-125" />
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentReel.enquiriesCount}
            </span>
          </div>

          {/* WhatsApp Share Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onShareWhatsApp(currentReel)}
              className="p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-slate-900 text-emerald-400 transition cursor-pointer"
              title="WhatsApp Share"
            >
              <Send className="w-6 h-6 -rotate-12" />
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow">பகிர்</span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-slate-900 transition cursor-pointer"
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
          </button>

          {/* Rotating Audio Icon */}
          <div className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-amber-400 animate-spin duration-3000">
            <Music className="w-4 h-4" />
          </div>

        </div>

        {/* BOTTOM METADATA & PRIMARY ACTION BUTTON */}
        <div className="absolute inset-x-4 bottom-4 z-30 space-y-2.5 text-white pr-16">
          
          {/* Creator Headline */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-sm text-white drop-shadow-md">
              {currentReel.businessName}
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/20" />
            <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 text-amber-400" />
              {currentReel.taluk}
            </span>
          </div>

          {/* Caption */}
          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed drop-shadow">
            {currentReel.caption}
          </p>

          {/* Price Tag & Floating Enquiry Button */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {currentReel.priceTag && (
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>{currentReel.priceTag}</span>
              </span>
            )}

            <button
              onClick={() => onSendEnquiry(currentReel)}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs rounded-full shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{currentReel.actionText || 'Send Enquiry'} ➔</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
