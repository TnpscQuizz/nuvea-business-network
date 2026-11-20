import React, { useState } from 'react';
import { 
  Plus, X, ChevronLeft, ChevronRight, Send, 
  Building2, Tag, Calendar, Users, Sparkles 
} from 'lucide-react';
import type { BizStory } from '../../../types';

interface StoriesBarProps {
  stories: BizStory[];
  currentUserAvatar?: string;
  onOpenCreateStory?: () => void;
  onSendStoryReply?: (story: BizStory, replyText: string) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUserAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  onOpenCreateStory,
  onSendStoryReply,
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  const handleNext = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeStory) return;
    if (onSendStoryReply) {
      onSendStoryReply(activeStory, replyText);
    }
    setReplyText('');
    setActiveStoryIndex(null);
  };

  // Story icons map matching the mockup
  const getStoryIcon = (name: string) => {
    if (name.includes('Updates')) return <Building2 className="w-5 h-5 text-blue-400" />;
    if (name.includes('Offers')) return <Tag className="w-5 h-5 text-amber-400" />;
    if (name.includes('Events')) return <Calendar className="w-5 h-5 text-purple-400" />;
    return <Users className="w-5 h-5 text-cyan-400" />;
  };

  const getStoryRingClass = (name: string) => {
    if (name.includes('Updates')) return 'from-blue-500 via-indigo-500 to-cyan-400';
    if (name.includes('Offers')) return 'from-amber-400 via-orange-500 to-yellow-300';
    if (name.includes('Events')) return 'from-purple-500 via-pink-500 to-indigo-500';
    return 'from-teal-400 via-cyan-500 to-blue-500';
  };

  return (
    <>
      {/* HORIZONTAL STORIES ROW (EXACT MOCKUP) */}
      <div className="bg-[#0c1224]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-3.5 sm:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.45)] overflow-x-auto scrollbar-none flex items-center gap-4 sm:gap-5 select-none">
        
        {/* 1. + CREATE STORY BUBBLE */}
        <div 
          onClick={onOpenCreateStory}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 group-hover:scale-105 transition shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border border-black/40">
              <img 
                src={currentUserAvatar} 
                alt="Create Story"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Center Plus Badge */}
            <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md border border-white/40 group-hover:scale-110 transition">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-300 max-w-[70px] truncate text-center">
            Create Story
          </span>
        </div>

        {/* 2. STORY CHANNELS FROM MOCKUP */}
        {stories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => setActiveStoryIndex(idx)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className={`relative w-15 h-15 sm:w-16 sm:h-16 rounded-full p-[2.5px] bg-gradient-to-tr ${getStoryRingClass(story.businessName)} group-hover:scale-105 transition shadow-[0_0_15px_rgba(59,130,246,0.3)]`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-950/90 border border-black/60 flex items-center justify-center">
                {story.avatar ? (
                  <img 
                    src={story.avatar} 
                    alt={story.businessName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                ) : (
                  getStoryIcon(story.businessName)
                )}
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-300 max-w-[75px] truncate text-center">
              {story.businessName}
            </span>
          </div>
        ))}

      </div>

      {/* FULLSCREEN STORY VIEWER MODAL */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 sm:p-4">
          <div className="relative w-full max-w-sm h-full sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-white/10">
            
            {/* Top Progress bar */}
            <div className="absolute top-0 inset-x-0 p-3 z-30 space-y-2 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex gap-1 h-1 w-full">
                {stories.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-full flex-1 rounded-full ${
                      i === activeStoryIndex ? 'bg-white' : i < (activeStoryIndex || 0) ? 'bg-white/60' : 'bg-white/20'
                    }`} 
                  />
                ))}
              </div>

              {/* Story Header */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeStory.avatar}
                    alt={activeStory.businessName}
                    className="w-9 h-9 rounded-full object-cover border border-white/40"
                  />
                  <div>
                    <div className="text-xs font-bold leading-tight flex items-center gap-1">
                      <span>{activeStory.businessName}</span>
                      {activeStory.offerBadge && (
                        <span className="text-[9px] font-black bg-blue-500 px-1.5 py-0.2 rounded-full">
                          {activeStory.offerBadge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">{activeStory.expiresAt}</div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStoryIndex(null)}
                  className="p-1 rounded-full bg-black/40 text-white hover:bg-white/20 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Media Image / Background */}
            <div 
              className="flex-1 w-full h-full relative cursor-pointer"
              onClick={handleNext}
            >
              <img
                src={activeStory.mediaUrl}
                alt={activeStory.caption}
                className="w-full h-full object-cover"
              />

              {/* Tap Left / Right Controls */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption & Reply Bar */}
            <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3 z-30">
              <p className="text-xs text-white leading-relaxed font-medium">
                {activeStory.caption}
              </p>

              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="விசாரணை செய்தி அனுப்பவும்..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 backdrop-blur-md"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
