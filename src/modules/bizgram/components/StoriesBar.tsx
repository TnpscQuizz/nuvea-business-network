import React, { useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Send, Sparkles } from 'lucide-react';
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
    } else {
      alert(`"${activeStory.businessName}" க்கு உங்கள் பதில் அனுப்பப்பட்டது: "${replyText}"`);
    }
    setReplyText('');
    setActiveStoryIndex(null);
  };

  return (
    <>
      {/* HORIZONTAL STORIES ROW */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs overflow-x-auto scrollbar-none flex items-center gap-4 sm:gap-5 select-none">
        
        {/* ADD MY STORY BUBBLE */}
        <div 
          onClick={onOpenCreateStory}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          <div className="relative w-16 h-16 sm:w-17 sm:h-17 rounded-full p-[2px] border-2 border-dashed border-amber-400 group-hover:scale-105 transition">
            <img 
              src={currentUserAvatar} 
              alt="My Avatar"
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md border-2 border-white">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-700 max-w-[68px] truncate text-center">
            என் ஸ்டோரி
          </span>
        </div>

        {/* STORIES LIST */}
        {stories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => setActiveStoryIndex(idx)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className={`w-16 h-16 sm:w-17 sm:h-17 rounded-full p-[2.5px] transition transform group-hover:scale-105 ${
              story.hasUnseen 
                ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-xs' 
                : 'border-2 border-slate-300'
            }`}>
              <div className="w-full h-full rounded-full p-[1.5px] bg-white">
                <img 
                  src={story.avatar} 
                  alt={story.businessName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-800 max-w-[72px] truncate text-center">
              {story.businessName}
            </span>
          </div>
        ))}

      </div>

      {/* FULLSCREEN STORY VIEWER MODAL */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          
          {/* Close Button */}
          <button 
            onClick={() => setActiveStoryIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-amber-400 p-2 rounded-full bg-slate-900/60 transition cursor-pointer z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left / Right Nav on Desktop */}
          {activeStoryIndex > 0 && (
            <button
              onClick={handlePrev}
              className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 p-3 rounded-full bg-slate-900/60 transition cursor-pointer z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {activeStoryIndex < stories.length - 1 && (
            <button
              onClick={handleNext}
              className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 p-3 rounded-full bg-slate-900/60 transition cursor-pointer z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* STORY CARD */}
          <div className="relative w-full max-w-[420px] h-[80vh] sm:h-[85vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800">
            
            {/* Top Progress Bars */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
              {stories.map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-amber-400 transition-all duration-300 ${
                      i < activeStoryIndex ? 'w-full' : i === activeStoryIndex ? 'w-full animate-pulse' : 'w-0'
                    }`} 
                  />
                </div>
              ))}
            </div>

            {/* Top Story Header */}
            <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white drop-shadow-md">
              <div className="flex items-center gap-2.5">
                <img 
                  src={activeStory.avatar} 
                  alt={activeStory.businessName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <div className="text-xs font-black flex items-center gap-1.5 text-white">
                    <span>{activeStory.businessName}</span>
                    <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                      {activeStory.offerBadge || 'OFFER'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium">
                    {activeStory.expiresAt}
                  </div>
                </div>
              </div>
            </div>

            {/* Story Image / Background */}
            <div className="relative w-full h-full">
              <img 
                src={activeStory.mediaUrl} 
                alt="Story" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
            </div>

            {/* Bottom Caption & Reply Bar */}
            <div className="absolute bottom-3 left-3 right-3 z-30 space-y-3">
              <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60 text-white">
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  {activeStory.caption}
                </p>
              </div>

              {/* Instant Reply Input */}
              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="விலை விவரம் கேட்க அல்லது மெசேஜ் அனுப்ப..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-900/80 border border-slate-700 text-white text-xs px-4 py-2.5 rounded-full placeholder-slate-400 focus:outline-none focus:border-amber-400 backdrop-blur-xs"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shrink-0 transition cursor-pointer shadow-md"
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
