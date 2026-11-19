import React, { useState, useRef } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  Volume2, VolumeX, Play, Pause, CheckCircle2, MapPin, 
  Phone, Tag, Share2 
} from 'lucide-react';
import type { BizPost } from '../../../types';

interface PostCardProps {
  post: BizPost;
  onLike: (postId: string) => void;
  onSendEnquiry: (post: BizPost) => void;
  onShareWhatsApp: (post: BizPost) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onSendEnquiry,
  onShareWhatsApp,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [quickComment, setQuickComment] = useState('');
  const [commentsList, setCommentsList] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Double tap to like
  const handleMediaClick = () => {
    if (post.type === 'video' && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      onLike(post.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickComment.trim()) return;
    setCommentsList([...commentsList, quickComment]);
    setQuickComment('');
    alert(`"${post.businessName}" க்கு உங்கள் விசாரணை கருத்து பதிவிடப்பட்டது!`);
  };

  return (
    <article className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden transition hover:shadow-md">
      
      {/* 1. POST HEADER */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between">
        
        {/* Creator Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
            <img 
              src={post.avatar} 
              alt={post.businessName}
              className="w-full h-full rounded-full object-cover border border-white"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-black text-sm text-slate-900 tracking-tight">
                {post.businessName}
              </span>
              <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20 shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-0.5 text-slate-600 font-medium">
                <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                {post.taluk}
              </span>
              <span>•</span>
              <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.2 rounded-full border border-purple-200/60">
                {post.category}
              </span>
            </div>
          </div>
        </div>

        {/* More Actions / Call Button */}
        <div className="flex items-center gap-2">
          {post.phone && (
            <a 
              href={`tel:${post.phone}`}
              className="hidden sm:flex items-center gap-1 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-300 transition"
              title="நேரடி அழைப்பு"
            >
              <Phone className="w-3 h-3" />
              <span>Call</span>
            </a>
          )}
          <button 
            onClick={() => onShareWhatsApp(post)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* 2. MEDIA SECTION (VIDEO OR IMAGE) */}
      <div 
        onDoubleClick={handleDoubleTap}
        className="relative w-full bg-slate-950 aspect-square sm:aspect-[4/3] max-h-[540px] flex items-center justify-center overflow-hidden select-none cursor-pointer group"
      >
        {post.type === 'video' ? (
          <div className="relative w-full h-full flex items-center justify-center" onClick={handleMediaClick}>
            <video
              ref={videoRef}
              src={post.mediaUrl}
              poster={post.thumbnailUrl}
              playsInline
              loop
              autoPlay
              muted={isMuted}
              className="w-full h-full object-cover"
            />

            {/* Play/Pause Overlay indicator when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center">
                  <Play className="w-7 h-7 ml-1" />
                </div>
              </div>
            )}

            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition z-20 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <img 
            src={post.mediaUrl} 
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        )}

        {/* Double-tap Floating Heart Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 fade-in duration-200">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl scale-125 transition-transform" />
          </div>
        )}

        {/* Floating Price Tag on Top-Right */}
        {post.priceTag && (
          <div className="absolute top-3 right-3 z-20 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>{post.priceTag}</span>
          </div>
        )}

      </div>

      {/* 3. POST ACTION BAR */}
      <div className="p-3.5 sm:p-4 space-y-3">
        
        {/* Main Buttons Row */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Like, Enquiry, Share */}
          <div className="flex items-center gap-4">
            
            {/* Like Button */}
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1.5 text-slate-800 hover:text-rose-600 transition cursor-pointer group"
            >
              <Heart className={`w-6 h-6 transition transform group-hover:scale-110 ${
                post.isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-800'
              }`} />
              <span className="text-xs font-bold">{post.likes}</span>
            </button>

            {/* Direct Enquiry Chat Button */}
            <button
              onClick={() => onSendEnquiry(post)}
              className="flex items-center gap-1.5 text-slate-800 hover:text-amber-600 transition cursor-pointer group"
            >
              <MessageCircle className="w-6 h-6 text-slate-800 transition transform group-hover:scale-110" />
              <span className="text-xs font-bold">{post.enquiriesCount}</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={() => onShareWhatsApp(post)}
              className="text-slate-800 hover:text-emerald-600 transition cursor-pointer"
              title="Share on WhatsApp"
            >
              <Send className="w-5 h-5 -rotate-12" />
            </button>

          </div>

          {/* Right: Primary Enquiry CTA & Bookmark */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSendEnquiry(post)}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-full shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{post.actionText || 'Send Enquiry'}</span>
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-1.5 text-slate-700 hover:text-slate-950 transition cursor-pointer"
              title="Save to Wishlist"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'text-amber-500 fill-amber-500' : ''}`} />
            </button>
          </div>

        </div>

        {/* Caption & Details */}
        <div className="space-y-1.5 pt-1">
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
            <span className="font-black text-slate-950 mr-1.5">
              {post.businessName}
            </span>
            {post.caption}
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>{post.createdAt}</span>
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified B2B Supplier
            </span>
          </div>
        </div>

        {/* Existing Comments / Inquiries Preview */}
        {commentsList.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-slate-100">
            {commentsList.map((comm, idx) => (
              <div key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                <span className="font-bold text-slate-900">நீங்கள்:</span>
                <span>{comm}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Comment / Enquiry Box */}
        <form onSubmit={handlePostComment} className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="விலை அல்லது குறைந்தபட்ச ஆர்டர் அளவு விசாரிக்க..."
            value={quickComment}
            onChange={(e) => setQuickComment(e.target.value)}
            className="flex-1 text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {quickComment.trim() && (
            <button
              type="submit"
              className="text-xs font-black text-amber-600 hover:text-amber-700 transition cursor-pointer"
            >
              கேட்க
            </button>
          )}
        </form>

      </div>

    </article>
  );
};
