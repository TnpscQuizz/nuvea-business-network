import React, { useState } from 'react';
import { 
  Plus, X, ChevronLeft, ChevronRight, Send, 
  Building2, Tag, Calendar, Users, Sparkles 
} from 'lucide-react';
import type { BizStory } from '../../../types';
import { translations, type Language } from '../data/translations';

interface StoriesBarProps {
  stories: BizStory[];
  currentUserAvatar?: string;
  lang?: Language;
  onOpenCreateStory?: () => void;
  onSendStoryReply?: (story: BizStory, replyText: string) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUserAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  lang = 'en',
  onOpenCreateStory,
  onSendStoryReply,
}) => {
  const t = translations[lang] || translations.en;
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

  const getStoryIcon = (name: string) => {
    if (name.includes('Updates')) return <Building2 className="w-5 h-5 text-white" />;
    if (name.includes('Offers')) return <Tag className="w-5 h-5 text-white" />;
    if (name.includes('Events')) return <Calendar className="w-5 h-5 text-white" />;
    return <Users className="w-5 h-5 text-white" />;
  };

  return (
    <>
      {/* HORIZONTAL STORIES ROW (APPLE LIQUID GLASS - NO BLUE) */}
      <div className="apple-glass apple-specular-edge rounded-[36px] p-3.5 sm:p-4 overflow-x-auto scrollbar-none flex items-center gap-4 sm:gap-5 select-none shadow-2xl">
        
        {/* 1. + CREATE STORY BUBBLE */}
        <div 
          onClick={onOpenCreateStory}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-white/40 via-white/15 to-white/5 group-hover:scale-105 transition shadow-lg">
            <div className="w-full h-full rounded-full overflow-hidden bg-black border border-white/20">
              <img 
                src={currentUserAvatar} 
                alt="Create Story"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Center Plus Badge (White Apple Glass) */}
            <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-black text-sm shadow-md border border-white/40 group-hover:scale-110 transition">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-300 max-w-[70px] truncate text-center">
            {t.createStory}
          </span>
        </div>

        {/* 2. STORY CHANNELS */}
        {stories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => setActiveStoryIndex(idx)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-white/50 via-white/20 to-white/5 group-hover:scale-105 transition shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden bg-black border border-white/15 flex items-center justify-center">
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
            <span className="text-[11px] font-bold text-slate-300 max-w-[75px] truncate text-center">
              {story.businessName}
            </span>
          </div>
        ))}

      </div>

      {/* FULLSCREEN STORY VIEWER MODAL */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-0 sm:p-4">
          <div className="relative w-full max-w-sm h-full sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-black flex flex-col justify-between shadow-2xl border border-white/20">
            
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
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-slate-900">
                    <img 
                      src={activeStory.avatar || currentUserAvatar} 
                      alt={activeStory.businessName}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="font-black text-xs">{activeStory.businessName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{activeStory.expiresAt}</div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveStoryIndex(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Media Content */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img 
                src={activeStory.mediaUrl} 
                alt="Story" 
                className="w-full h-full object-cover"
              />

              {/* Navigation touch areas */}
              <div 
                className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-10" 
                onClick={handlePrev}
              />
              <div 
                className="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-10" 
                onClick={handleNext}
              />

              {/* Caption Overlay */}
              <div className="absolute bottom-16 inset-x-4 p-3 bg-black/60 backdrop-blur-md border border-white/15 rounded-2xl text-white text-xs leading-relaxed z-20">
                <p>{activeStory.caption}</p>
              </div>
            </div>

            {/* Bottom Quick Reply Bar */}
            <form onSubmit={handleSendReply} className="absolute bottom-3 inset-x-3 z-30 flex items-center gap-2">
              <input 
                type="text"
                placeholder="Send a direct reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-white"
              />
              <button 
                type="submit"
                className="p-2.5 rounded-full apple-btn-primary"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
