import React, { useState, useRef } from 'react';
import { 
  Heart, ThumbsDown, MessageCircle, Send, Bookmark, MoreHorizontal, 
  Volume2, VolumeX, CheckCircle2, MapPin, Share2, Sparkles, Tag, Zap 
} from 'lucide-react';
import type { BizPost } from '../../../types';
import { translations, type Language } from '../data/translations';

interface PostCardProps {
  post: BizPost;
  lang?: Language;
  onLike: (postId: string) => void;
  onSendEnquiry: (post: BizPost) => void;
  onShareWhatsApp: (post: BizPost) => void;
  onBuyNow?: (post: BizPost) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  lang = 'en',
  onLike,
  onSendEnquiry,
  onShareWhatsApp,
  onBuyNow,
}) => {
  const t = translations[lang] || translations.en;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isDisliked, setIsDisliked] = useState(post.isDisliked || false);
  const [dislikesCount, setDislikesCount] = useState(post.dislikes || 0);
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
    <article className="apple-glass apple-specular-edge rounded-[36px] overflow-hidden transition select-none hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
      
      {/* 1. POST HEADER */}
      <div className="p-4 flex items-center justify-between">
        
        {/* Creator Info */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-white to-slate-200 border border-white shadow-sm shrink-0">
            <img 
              src={post.avatar} 
              alt={post.businessName}
              className="w-full h-full rounded-full object-cover border border-white"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-slate-900 tracking-tight leading-tight">
                {post.businessName}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-900 fill-slate-200" />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
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

        {/* Trade Intent & Sponsored Badges (Pillar 4 & Pillar 9) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {post.isSponsored && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200 shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>SPONSORED B2B AD</span>
            </span>
          )}
          {post.tradeIntent === 'need' && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black border border-blue-200 shadow-sm flex items-center gap-1">
              <span>🔵 I NEED</span>
            </span>
          )}
          {post.tradeIntent === 'offer' && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-200 shadow-sm flex items-center gap-1">
              <span>🟢 I OFFER</span>
            </span>
          )}
          {post.tradeIntent === 'collaborate' && (
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black border border-purple-200 shadow-sm flex items-center gap-1">
              <span>🟣 I COLLABORATE</span>
            </span>
          )}
          <button 
            onClick={() => onShareWhatsApp(post)}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-white/60 transition cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* 2. POST CAPTION */}
      <div className="px-4 pb-3">
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
          {post.caption}
        </p>
      </div>

      {/* 3. POST MEDIA CONTAINER */}
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
      <div className="p-3.5 sm:p-4 flex items-center justify-between border-t border-white/80 bg-white/40">
        
        {/* Left: Like, Comment, Share */}
        <div className="flex items-center gap-4 text-slate-700 text-xs font-semibold">
          
          {/* Like */}
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1.5 hover:text-slate-950 transition cursor-pointer"
          >
            <Heart 
              className={`w-4 h-4 transition ${
                post.isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-500 hover:text-rose-500'
              }`} 
            />
            <span className="text-slate-800">{post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}K` : post.likes}</span>
          </button>

          {/* Dislike (User requested Dislike) */}
          <button
            onClick={() => {
              setIsDisliked(!isDisliked);
              setDislikesCount(prev => isDisliked ? prev - 1 : prev + 1);
            }}
            className="flex items-center gap-1.5 hover:text-slate-950 transition cursor-pointer"
            title="Dislike"
          >
            <ThumbsDown 
              className={`w-4 h-4 transition ${
                isDisliked ? 'text-amber-500 fill-amber-500' : 'text-slate-500 hover:text-slate-900'
              }`} 
            />
            <span className="text-slate-800">{dislikesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-slate-950 transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-slate-500 hover:text-slate-900" />
            <span className="text-slate-800">{post.commentsCount || 142}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => onShareWhatsApp(post)}
            className="flex items-center gap-1.5 hover:text-slate-950 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-500 hover:text-slate-900" />
            <span className="text-slate-800">87</span>
          </button>

        </div>

        {/* Right: Crisp Apple Obsidian ENQUIRE & BUY NOW Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSendEnquiry(post)}
            className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:border-slate-900 bg-white/70 hover:bg-white text-slate-900 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5 rotate-45 -mt-0.5 text-slate-800" />
            <span>{t.enquire}</span>
          </button>
          <button
            onClick={() => onBuyNow ? onBuyNow(post) : onSendEnquiry(post)}
            className="px-4 py-1.5 apple-btn-primary rounded-full text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            title="Instant B2B Checkout"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>

      {/* 5. COMMENTS DRAWER */}
      {showComments && (
        <div className="p-4 border-t border-white/80 bg-white/60 space-y-3">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {commentsList.map((c, i) => (
              <div key={i} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="font-bold text-slate-950">Member:</span>
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
              className="flex-1 px-3.5 py-2 bg-white/80 border border-white rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-900 shadow-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-950 text-white font-extrabold rounded-xl text-xs transition cursor-pointer hover:bg-black shadow-sm"
            >
              Post
            </button>
          </form>
        </div>
      )}

    </article>
  );
};
