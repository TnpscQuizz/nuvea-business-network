import React, { useState, useRef } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  Volume2, VolumeX, CheckCircle2, MapPin, Share2, Sparkles 
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
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [quickComment, setQuickComment] = useState('');
  const [commentsList, setCommentsList] = useState<string[]>([
    'அருமையான தொழில் முயற்சி! வாழ்த்துக்கள்.',
    'மொத்த விலை விவரம் அனுப்ப முடியுமா?'
  ]);

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
  };

  return (
    <article className="bg-[#0e1428]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden transition hover:border-white/20 select-none">
      
      {/* 1. POST HEADER (MATCHING MOCKUP) */}
      <div className="p-4 flex items-center justify-between">
        
        {/* Creator Info */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shrink-0">
            <img 
              src={post.avatar} 
              alt={post.businessName}
              className="w-full h-full rounded-full object-cover border border-slate-900"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight leading-tight">
                {post.businessName}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-500/30" />
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>{post.createdAt}</span>
              {post.taluk && !post.createdAt.includes(post.taluk) && (
                <>
                  <span>•</span>
                  <span>{post.taluk}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3-dots Menu */}
        <button 
          onClick={() => onShareWhatsApp(post)}
          className="p-1.5 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

      </div>

      {/* 2. POST CAPTION */}
      <div className="px-4 pb-3">
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
          {post.caption}
        </p>
      </div>

      {/* 3. POST MEDIA CONTAINER WITH CAROUSEL BADGE 1/4 */}
      <div 
        className="relative aspect-[4/3] sm:aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
        onClick={handleMediaClick}
        onDoubleClick={handleDoubleTap}
      >
        {post.type === 'video' ? (
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
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        )}

        {/* 1/4 Carousel Indicator Tag (Exact Mockup) */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
          1/4
        </div>

        {/* Video Mute / Unmute Button */}
        {post.type === 'video' && (
          <button
            onClick={toggleMute}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition shadow-lg cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>
        )}

        {/* Double Tap Heart Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
            <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-2xl" />
          </div>
        )}
      </div>

      {/* 4. POST ACTION BAR (MATCHING MOCKUP: ❤️ 1.2K  💬 142  ↗️ 87  [✈️ Enquire]) */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between border-t border-white/5 bg-[#0b1021]/60">
        
        {/* Left: Like, Comment, Share */}
        <div className="flex items-center gap-4 text-slate-300 text-xs font-semibold">
          
          {/* Like */}
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <Heart 
              className={`w-4 h-4 transition ${
                post.isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-400 hover:text-rose-400'
              }`} 
            />
            <span>{post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}K` : post.likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-slate-400 hover:text-blue-400" />
            <span>{post.commentsCount || 142}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => onShareWhatsApp(post)}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
            <span>87</span>
          </button>

        </div>

        {/* Right: Vibrant Glowing ENQUIRE Button (Exact Mockup) */}
        <button
          onClick={() => onSendEnquiry(post)}
          className="px-5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold text-xs rounded-full shadow-[0_0_18px_rgba(37,99,235,0.5)] flex items-center gap-1.5 cursor-pointer transition transform hover:scale-105 active:scale-95"
        >
          <Send className="w-3.5 h-3.5 rotate-45 -mt-0.5" />
          <span>Enquire</span>
        </button>

      </div>

      {/* 5. COMMENTS DRAWER */}
      {showComments && (
        <div className="p-4 border-t border-white/5 bg-[#080d1c] space-y-3">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {commentsList.map((c, i) => (
              <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="font-bold text-blue-400">வணிகர்:</span>
                <span>{c}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostComment} className="flex gap-2">
            <input
              type="text"
              placeholder="கருத்து அல்லது விலை கேட்க..."
              value={quickComment}
              onChange={(e) => setQuickComment(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              பதிவிடு
            </button>
          </form>
        </div>
      )}

    </article>
  );
};
