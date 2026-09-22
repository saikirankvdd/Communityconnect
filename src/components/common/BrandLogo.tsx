import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitleText?: string;
  inverted?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  subtitleText = 'ONE PLATFORM. MANY COMMUNITIES.',
  inverted = false
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const titleSizes = {
    sm: 'text-base leading-tight',
    md: 'text-xl leading-tight',
    lg: 'text-2xl leading-none'
  };

  const subSizes = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[10px] tracking-wider font-semibold',
    lg: 'text-xs tracking-widest font-semibold'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* CommunityConnect Iconic House Logo Mark */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] p-1.5 flex items-center justify-center shadow-sm relative overflow-hidden`}
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* House Outer Contour */}
          <path
            d="M18 4L4 15V30C4 31.1 4.9 32 6 32H30C31.1 32 32 31.1 32 30V15L18 4Z"
            fill="white"
          />
          {/* House Door Opening */}
          <path
            d="M14 32V25C14 23.9 14.9 23 16 23H20C21.1 23 22 23.9 22 25V32H14Z"
            fill="#16A34A"
          />
          {/* Blue Figure (Left Neighbor) */}
          <circle cx="12.5" cy="14" r="2.8" fill="#0EA5E9" />
          <path
            d="M8.5 21C8.5 19.3 10.2 18 12.5 18C14.8 18 16.5 19.3 16.5 21V22H8.5V21Z"
            fill="#0EA5E9"
          />
          {/* Amber Figure (Right Neighbor) */}
          <circle cx="23.5" cy="14" r="2.8" fill="#F59E0B" />
          <path
            d="M19.5 21C19.5 19.3 21.2 18 23.5 18C25.8 18 27.5 19.3 27.5 21V22H19.5V21Z"
            fill="#F59E0B"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className={`font-display font-bold tracking-tight ${titleSizes[size]}`}>
          <span className={inverted ? 'text-white' : 'text-[#0F172A]'}>Community</span>
          <span className="text-[#16A34A]">Connect</span>
        </div>
        {showSubtitle && (
          <span
            className={`uppercase ${subSizes[size]} ${
              inverted ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
