import React from 'react';
import { 
  BarChart3, TrendingUp, Users, MessageCircle, Phone, 
  Eye, ArrowUpRight, Award, ShieldCheck, Sparkles 
} from 'lucide-react';
import type { BizPost } from '../../../types';

interface InsightsViewProps {
  posts: BizPost[];
  onOpenCreateReel: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  posts,
  onOpenCreateReel,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-12 select-none">
      
      {/* 1. TOP HEADER SUMMARY */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">
              B2B ANALYTICS
            </span>
            <span className="text-xs text-purple-200">கடந்த 30 நாட்கள்</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            வணிகப் புள்ளிவிவரங்கள் & லீட்ஸ் (Insights)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md">
            உங்கள் ரீல்ஸ் மற்றும் போஸ்ட்டுகள் மூலம் வந்த பார்வைகள், நேரடி விசாரணைகள் மற்றும் தொலைபேசி அழைப்புகளின் விவரம்.
          </p>
        </div>

        <button
          onClick={onOpenCreateReel}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>➕ புதிய ரீல்ஸ் போடு</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. STATS 4 CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
        
        {/* Card 1: Reel Views */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              18,450
            </div>
            <div className="text-xs text-slate-500 font-medium">
              மொத்த ரீல்ஸ் பார்வைகள் (Reel Views)
            </div>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24% இந்த வாரம்</span>
          </div>
        </div>

        {/* Card 2: Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              148
            </div>
            <div className="text-xs text-slate-500 font-medium">
              நேரடி விசாரணைகள் (Direct Enquiries)
            </div>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18 புதிய லீட்ஸ்</span>
          </div>
        </div>

        {/* Card 3: Calls / WhatsApp Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              89
            </div>
            <div className="text-xs text-slate-500 font-medium">
              போன் & வாட்ஸ்அப் கிளிக்குகள்
            </div>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>உடனடி தொடர்புகள்</span>
          </div>
        </div>

        {/* Card 4: Business Conversion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹4.8L
            </div>
            <div className="text-xs text-slate-500 font-medium">
              மதிப்பிடப்பட்ட பிசினஸ் மதிப்பு
            </div>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>18% GST இன்வாய்ஸ்</span>
          </div>
        </div>

      </div>

      {/* 3. TOP PERFORMING REELS LIST */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
          <span>🔥 அதிக வாடிக்கையாளர்களை ஈர்த்த சிறந்த ரீல்ஸ்கள் (Top Reels)</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {posts.slice(0, 3).map((post, idx) => (
            <div key={post.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-black text-slate-400 text-sm">#{idx + 1}</span>
                <img
                  src={post.thumbnailUrl || post.mediaUrl}
                  alt={post.caption}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {post.businessName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {post.caption}
                  </div>
                  <div className="text-[10px] text-amber-700 font-bold mt-1">
                    {post.priceTag}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-black text-xs sm:text-sm text-slate-900">
                  {post.likes * 14} Views
                </div>
                <div className="text-[11px] text-emerald-600 font-bold">
                  {post.enquiriesCount} Enquiries
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
