import React from 'react';

interface ShinegahLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const ShinegahLogo: React.FC<ShinegahLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-4xl', sub: 'text-sm' },
  };

  const { icon, text, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Stylized S Ribbon Logo */}
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-2xl p-1 shadow-[0_0_20px_rgba(124,58,237,0.45)]"
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(99,102,241,0.6)]"
        >
          <defs>
            <linearGradient id="shinegahGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="30%" stopColor="#6366f1" />
              <stop offset="70%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="shinegahGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Upper ribbon curve of S */}
          <path
            d="M 78 22 C 65 10, 32 10, 22 24 C 12 38, 22 52, 48 56 C 76 60, 88 72, 78 86 C 68 98, 30 96, 18 84"
            stroke="url(#shinegahGrad1)"
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
            filter="url(#neonGlow)"
          />

          {/* Lower ribbon highlight */}
          <path
            d="M 72 26 C 60 16, 38 16, 28 26 C 20 35, 28 46, 50 50 C 74 54, 82 66, 74 78 C 66 90, 38 90, 26 80"
            stroke="url(#shinegahGrad2)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />

          {/* Glossy highlight sparkle */}
          <circle cx="28" cy="24" r="4" fill="#ffffff" opacity="0.9" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className={`font-black ${text} text-white tracking-tight leading-none`}>
              Shinegah<span className="text-[10px] text-indigo-400 font-medium align-top ml-0.5">™</span>
            </span>
          </div>
          <span className={`text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5`}>
            Connect • Collaborate • Grow
          </span>
        </div>
      )}
    </div>
  );
};
