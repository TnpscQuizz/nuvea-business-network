import React from 'react';

interface ShinegahLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  dark?: boolean;
}

export const ShinegahLogo: React.FC<ShinegahLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  dark = false,
}) => {
  const sizeMap = {
    sm: { icon: 30, text: 'text-base', sub: 'text-[8.5px]', star: 9 },
    md: { icon: 40, text: 'text-xl', sub: 'text-[9.5px]', star: 11 },
    lg: { icon: 50, text: 'text-2xl', sub: 'text-xs', star: 13 },
    xl: { icon: 66, text: 'text-4xl', sub: 'text-sm', star: 17 },
  };

  const { icon, text, sub, star } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Squircle Brand Mark with Minute Sunset-Indigo Ambient Glow */}
      <div 
        className="relative shrink-0 rounded-[24%] p-[1.5px] bg-gradient-to-tr from-blue-600/60 via-purple-600/50 to-amber-500/60 shadow-[0_4px_16px_rgba(37,99,235,0.25),0_8px_24px_rgba(249,115,22,0.2)] hover:scale-105 transition-transform duration-300"
        style={{ width: icon, height: icon }}
      >
        <div className="w-full h-full rounded-[22%] overflow-hidden bg-slate-950 flex items-center justify-center relative shadow-inner">
          <img
            src="/shinegah-app-icon.jpg"
            alt="Shinegah App Icon"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className={`font-black ${text} ${dark ? 'text-white' : 'text-slate-950'} tracking-tight leading-none flex items-center`}>
              Sh<span className="relative inline-block">
                <span>ı</span>
                <span 
                  className="absolute -top-1 left-1/2 -translate-x-1/2 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)] font-black select-none pointer-events-none"
                  style={{ fontSize: star }}
                >
                  ✦
                </span>
              </span>negah
              <span className="text-[10px] text-amber-600 font-bold align-top ml-1">™</span>
            </span>
          </div>
          <span className={`text-[10px] font-bold tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'} uppercase mt-1 flex items-center gap-1.5`}>
            <span>Connect</span>
            <span className="text-blue-500 text-[8px]">•</span>
            <span>Collaborate</span>
            <span className="text-amber-500 text-[8px]">•</span>
            <span>Grow</span>
          </span>
        </div>
      )}
    </div>
  );
};
