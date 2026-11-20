import React, { useState, useRef } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  Volume2, VolumeX, CheckCircle2, MapPin, Share2, Sparkles, Tag 
} from 'lucide-react';
import type { BizPost } from '../../../types';
import { translations, type Language } from '../data/translations';

interface PostCardProps {
  post: BizPost;
  lang?: Language;
  onLike: (postId: string) => void;
  onSendEnquiry: (post: BizPost) => void;
  onShareWhatsApp: (post: BizPost) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  lang = 'en',
  onLike,
  onSendEnquiry,
  onShareWhatsApp,
}) => {
  const t = translations[lang] || translations.en;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [quickComment, setQuickComment] = useState('');
  const [commentsList, setCommentsList] = useState<string[]>([
    'Excellent quality standards! Interested in wholesale consignment.',
    'Could you share your latest product catalog?'
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
    <article className="apple-glass apple-specular-edge rounded-[36px] overflow-hidden transition select-none hover:shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
      
      {/* 1. POST HEADER */}
      <div className="p-4 flex items-center justify-between">
        
        {/* Creator Info */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-white/40 via-white/20 to-white/5 shrink-0">
            <img 
              src={post.avatar} 
              alt={post.businessName}
              className="w-full h-full rounded-full object-cover border border-black"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white tracking-tight leading-tight">
                {post.businessName}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white/20" />
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
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
          className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
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

      {/* 3. POST MEDIA CONTAINER */}
      <div 
        className="relative aspect-[4/3] sm:aspect-[16/10] bg-black overflow-hidden cursor-pointer"
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

        {/* 1/4 Carousel Indicator Tag */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
          1/4
        </div>

        {/* Video Mute / Unmute Button */}
        {post.type === 'video' && (
          <button
            onClick={toggleMute}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition shadow-lg cursor-pointer border border-white/20"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
        )}

        {/* Double Tap Heart Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
            <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-2xl" />
          </div>
        )}
      </div>

      {/* 4. POST ACTION BAR (❤️ 1.2K  💬 142  ↗️ 87  [✈️ Enquire]) */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between border-t border-white/5 bg-white/[0.02]">
        
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
            <MessageCircle className="w-4 h-4 text-slate-400 hover:text-white" />
            <span>{post.commentsCount || 142}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => onShareWhatsApp(post)}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-400 hover:text-white" />
            <span>87</span>
          </button>

        </div>

        {/* Right: Crisp Apple White ENQUIRE Button (Strictly No Blue) */}
        <button
          onClick={() => onSendEnquiry(post)}
          className="px-5 py-2 apple-btn-primary rounded-full text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Send className="w-3.5 h-3.5 rotate-45 -mt-0.5 text-black" />
          <span>{t.enquire}</span>
        </button>

      </div>

      {/* 5. COMMENTS DRAWER */}
      {showComments && (
        <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {commentsList.map((c, i) => (
              <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="font-bold text-white">Member:</span>
                <span>{c}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment or price inquiry..."
              value={quickComment}
              onChange={(e) => setQuickComment(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black font-extrabold rounded-xl text-xs transition cursor-pointer hover:bg-slate-200"
            >
              Post
            </button>
          </form>
        </div>
      )}

    </article>
  );
};
