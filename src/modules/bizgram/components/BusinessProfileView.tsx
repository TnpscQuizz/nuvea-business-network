import React, { useState } from 'react';
import { 
  Grid, Film, Bookmark, CheckCircle2, MapPin, Phone, 
  Tag, Plus, Edit, Sparkles, ExternalLink, ShieldCheck, 
  Heart, MessageCircle, Clock, Award 
} from 'lucide-react';
import type { BizPost } from '../../../types';

interface BusinessProfileViewProps {
  member?: {
    id: string;
    businessName: string;
    ownerName: string;
    avatar?: string;
    taluk: string;
    category: string;
    phone: string;
    locationTag?: string;
    validityDaysLeft?: number;
  };
  posts: BizPost[];
  onOpenCreateModal: () => void;
  onOpenRenewModal: () => void;
  onSelectPost: (post: BizPost) => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  member = {
    id: 'my_biz',
    businessName: 'நுவேவா ஸ்டுடியோ (Nuvea Studio)',
    ownerName: 'சந்திரா (Chandru)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    taluk: 'தருமபுரி & சேலம்',
    category: 'டிஜிட்டல் மார்க்கெட்டிங் & வெப் (IT & Media)',
    phone: '917548820641',
    locationTag: 'தருமபுரி மெயின் ரோடு & சேலம் जங்ஷன்',
    validityDaysLeft: 364,
  },
  posts,
  onOpenCreateModal,
  onOpenRenewModal,
  onSelectPost,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'catalog'>('posts');

  const myPosts = posts.filter(
    (p) => p.businessName.includes('நுவேவா') || p.memberId === 'mem_001' || p.memberId === 'my_biz'
  );
  const displayPosts = myPosts.length > 0 ? myPosts : posts.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-12 select-none">
      
      {/* 1. PROFILE HEADER SECTION (EXACT INSTAGRAM FORMAT) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          
          {/* Left: Avatar with Insta-gradient ring */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-[3.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md">
              <img
                src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={member.businessName}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white shadow-sm" title="Verified NBN Business">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Right: Business Details & Actions */}
          <div className="flex-1 space-y-4 text-center sm:text-left">
            
            {/* Top Bar: Name + Edit + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {member.businessName}
                  </h1>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                    VERIFIED
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  உரிமையாளர்: <span className="font-bold text-slate-700">{member.ownerName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap">
                <button
                  onClick={onOpenCreateModal}
                  className="px-4 py-2 bg-[#0a1128] hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>புதிய ரீல்ஸ் (New Post)</span>
                </button>

                <button
                  onClick={onOpenRenewModal}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-full shadow-sm transition flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>₹1 வேலிடிட்டி</span>
                </button>
              </div>
            </div>

            {/* 1-Year Live Validity Alert Badge */}
            <div className="p-3 bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="text-base">⏳</span>
                <span>மெம்பர்ஷிப் வேலிடிட்டி டைமர் (1-Year Active):</span>
                <span className="bg-slate-950 text-amber-400 font-black px-2 py-0.5 rounded-lg text-xs font-mono">
                  {member.validityDaysLeft || 364} நாட்கள் மீதம்
                </span>
              </div>
              <span className="text-[11px] text-purple-700 font-semibold">
                Razorpay ₹1 செலுத்தி உறுதி செய்யப்பட்டது
              </span>
            </div>

            {/* Stats Counter Row */}
            <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8 pt-1 text-slate-800 border-y border-slate-100 py-3">
              <div>
                <span className="font-black text-base text-slate-950">{displayPosts.length}</span>
                <span className="text-xs text-slate-500 ml-1.5">பதிவுகள்</span>
              </div>
              <div>
                <span className="font-black text-base text-slate-950">148</span>
                <span className="text-xs text-slate-500 ml-1.5">விசாரணைகள்</span>
              </div>
              <div>
                <span className="font-black text-base text-slate-950">420</span>
                <span className="text-xs text-slate-500 ml-1.5">இணைப்புகள்</span>
              </div>
              <div>
                <span className="font-black text-base text-amber-600">VIP</span>
                <span className="text-xs text-slate-500 ml-1.5">சாப்டர் தகுதி</span>
              </div>
            </div>

            {/* Business Bio & Exclusive Seat Badge */}
            <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="bg-amber-100 text-amber-900 font-black px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>பிரத்தியேக மோனோபோலி பிரிவு: {member.category}</span>
                </span>
              </div>
              <p>
                🌐 தொழில்முறை B2B சாஃப்ட்வேர், 3D இணையதளம் மற்றும் கூகுள் லீட்ஸ் மேனேஜ்மென்ட். தருமபுரி மற்றும் சேலம் மாவட்டத்தின் அங்கீகரிக்கப்பட்ட வணிக நெட்வொர்க் உறுப்பினர்.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>{member.locationTag || member.taluk}</span>
                </span>
                <span>•</span>
                <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{member.phone}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* 2. STORY HIGHLIGHTS BUBBLES */}
        <div className="pt-6 sm:pt-8 flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none border-t border-slate-100 mt-6">
          
          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full p-[2px] border-2 border-slate-200 group-hover:border-amber-400 transition flex items-center justify-center bg-slate-50">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">ஃபேக்டரி</span>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full p-[2px] border-2 border-slate-200 group-hover:border-amber-400 transition flex items-center justify-center bg-slate-50">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">ஆஃபர்கள்</span>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full p-[2px] border-2 border-slate-200 group-hover:border-amber-400 transition flex items-center justify-center bg-slate-50">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">ரிவ்யூஸ்</span>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full p-[2px] border-2 border-slate-200 group-hover:border-amber-400 transition flex items-center justify-center bg-slate-50">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">GST சான்று</span>
          </div>

          <div 
            onClick={onOpenCreateModal}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 group-hover:border-amber-500 transition flex items-center justify-center bg-slate-50">
              <Plus className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-500">புதியது</span>
          </div>

        </div>

      </div>

      {/* 3. PROFILE TABS (POSTS | REELS | CATALOG) */}
      <div className="flex items-center justify-center gap-8 sm:gap-16 border-t border-slate-200 pt-3 text-xs font-black tracking-wider uppercase">
        
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-2 transition cursor-pointer border-t-2 -mt-[14px] ${
            activeTab === 'posts' ? 'border-slate-950 text-slate-950 font-black' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>பதிவுகள் ({displayPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 py-2 transition cursor-pointer border-t-2 -mt-[14px] ${
            activeTab === 'reels' ? 'border-slate-950 text-slate-950 font-black' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>வணிக ரீல்ஸ்</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 py-2 transition cursor-pointer border-t-2 -mt-[14px] ${
            activeTab === 'catalog' ? 'border-slate-950 text-slate-950 font-black' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>கேட்லாக்</span>
        </button>

      </div>

      {/* 4. 3-COLUMN INSTAGRAM GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        {displayPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden cursor-pointer shadow-xs"
          >
            {post.type === 'video' ? (
              <video
                src={post.mediaUrl}
                poster={post.thumbnailUrl}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                muted
              />
            ) : (
              <img
                src={post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            )}

            {/* Video icon on top right */}
            {post.type === 'video' && (
              <div className="absolute top-2.5 right-2.5 text-white drop-shadow-md">
                <Film className="w-4 h-4" />
              </div>
            )}

            {/* Hover Dark Overlay with Stats (Instagram Style) */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 text-white text-xs font-black">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-white" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{post.enquiriesCount}</span>
              </div>
            </div>

            {/* Bottom Price Pill */}
            {post.priceTag && (
              <div className="absolute bottom-2 left-2 z-10 bg-slate-900/80 backdrop-blur-xs text-amber-400 border border-amber-400/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                {post.priceTag}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
