import React, { useState } from 'react';
import { 
  TrendingUp, Eye, Users, Rocket, BarChart3, 
  Sparkles, ChevronDown, ChevronRight, ArrowUpRight 
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
  const [timeframe, setTimeframe] = useState<'This Month' | 'This Week' | 'All Time'>('This Month');
  const [showTimeMenu, setShowTimeMenu] = useState(false);

  return (
    <div className="max-w-md sm:max-w-xl mx-auto space-y-5 pb-24 select-none font-sans">
      
      {/* BUSINESS GROWTH CARD (EXACT MOCKUP) */}
      <div className="bg-[#0e1428]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-5">
        
        {/* Top Header: Business Growth + This Month dropdown */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Business Growth
            </h2>
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTimeMenu(!showTimeMenu)}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{timeframe}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showTimeMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-white/15 rounded-2xl p-1.5 shadow-2xl z-30 space-y-1">
                {(['This Month', 'This Week', 'All Time'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTimeframe(t);
                      setShowTimeMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      timeframe === t ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Big Metric Display: 12.4K  ↑ 32% Profile Views (Exact Mockup) */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              12.4K
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <span>↑</span>
              <span>32%</span>
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Profile Views
          </div>
        </div>

        {/* Glowing Neon Cyan/Blue Spline Line Chart (Exact Mockup) */}
        <div className="relative h-32 sm:h-36 w-full pt-2">
          <svg
            viewBox="0 0 400 120"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Spline Area Gradient */}
              <linearGradient id="growthAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0e1428" stopOpacity="0" />
              </linearGradient>

              {/* Neon Glow Line Filter */}
              <filter id="neonChartGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Translucent Area Fill */}
            <path
              d="M 0 80 Q 50 100, 100 70 T 200 65 T 300 35 T 400 20 L 400 120 L 0 120 Z"
              fill="url(#growthAreaGrad)"
            />

            {/* Glowing Spline Line */}
            <path
              d="M 0 80 Q 50 100, 100 70 T 200 65 T 300 35 T 400 20"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#neonChartGlow)"
            />

            {/* Active Data Points */}
            <circle cx="100" cy="70" r="3.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="200" cy="65" r="3.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
            <circle cx="300" cy="35" r="3.5" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />
            <circle cx="400" cy="20" r="5" fill="#38bdf8" className="animate-ping" opacity="0.6" />
            <circle cx="400" cy="20" r="4.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2.5" />
          </svg>
        </div>

        {/* 4 Quick Stat Cards: Reach (8.7K), Connections (1.2K), Enquiries (642), Growth (+32%) */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-center">
          
          {/* Card 1: Reach */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <div className="font-black text-sm text-white">8.7K</div>
            <div className="text-[10px] text-slate-400">Reach</div>
          </div>

          {/* Card 2: Connections */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="font-black text-sm text-white">1.2K</div>
            <div className="text-[10px] text-slate-400">Connections</div>
          </div>

          {/* Card 3: Enquiries */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Rocket className="w-3.5 h-3.5" />
            </div>
            <div className="font-black text-sm text-white">642</div>
            <div className="text-[10px] text-slate-400">Enquiries</div>
          </div>

          {/* Card 4: Growth */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="font-black text-sm text-emerald-400">+32%</div>
            <div className="text-[10px] text-slate-400">Growth</div>
          </div>

        </div>

        {/* AI Insights Card (Exact Mockup) */}
        <div 
          onClick={onOpenCreateReel}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 flex items-center justify-between gap-3 cursor-pointer hover:border-purple-400 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-purple-300" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white flex items-center gap-1">
                <span>AI Insights</span>
              </div>
              <div className="text-slate-300 text-[11px] leading-tight">
                Your post reach is 32% higher than last month!
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
        </div>

      </div>

    </div>
  );
};
