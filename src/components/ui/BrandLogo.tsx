"use client";

import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showText = false,
  className = "",
}) => {
  const sizeMap = {
    sm: { box: "w-8 h-8", svg: 20, textTitle: "text-sm", textSub: "text-[10px]" },
    md: { box: "w-11 h-11", svg: 26, textTitle: "text-base", textSub: "text-[11px]" },
    lg: { box: "w-16 h-16", svg: 38, textTitle: "text-xl", textSub: "text-xs" },
    xl: { box: "w-20 h-20", svg: 48, textTitle: "text-2xl", textSub: "text-sm" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Premium Vector Badge Container */}
      <div
        className={`relative ${currentSize.box} rounded-2xl flex items-center justify-center shrink-0 shadow-xl transition-transform duration-200 hover:scale-105 select-none`}
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #090d16 100%)",
          boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(245, 158, 11, 0.35)",
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 30% 20%, rgba(251, 191, 36, 0.4), transparent 70%)",
          }}
        />

        {/* Vector SVG Brand Emblem */}
        <svg
          width={currentSize.svg}
          height={currentSize.svg}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <defs>
            {/* Golden Gradient */}
            <linearGradient id="mmsGold" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Emerald Accent Gradient */}
            <linearGradient id="mmsEmerald" x1="12" y1="20" x2="36" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Metallic Drop Shadow Filter */}
            <filter id="mmsShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Architectural Mess House Roof Apex */}
          <path
            d="M24 7L39 19H33V35C33 36.6569 31.6569 38 30 38H18C16.3431 38 15 36.6569 15 35V19H9L24 7Z"
            fill="url(#mmsGold)"
            fillOpacity="0.12"
            stroke="url(#mmsGold)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Stylized Modern "M" + Dining Fork & Knife Geometry */}
          {/* Left Pillar / Fork Prong */}
          <path
            d="M19 21V33"
            stroke="url(#mmsGold)"
            strokeWidth="2.8"
            strokeLinecap="round"
            filter="url(#mmsShadow)"
          />

          {/* Right Pillar / Knife Silhouette */}
          <path
            d="M29 21V33"
            stroke="url(#mmsGold)"
            strokeWidth="2.8"
            strokeLinecap="round"
            filter="url(#mmsShadow)"
          />

          {/* Center Dynamic V-Dip with Golden Meal Cloche Accent */}
          <path
            d="M19 22L24 28L29 22"
            stroke="url(#mmsGold)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#mmsShadow)"
          />

          {/* Golden Meal Indicator / Coin Pip (Financial Symbol) */}
          <circle cx="24" cy="18" r="2.2" fill="url(#mmsGold)" />

          {/* Base Foundation Bar */}
          <rect x="16" y="34.5" width="16" height="2" rx="1" fill="url(#mmsEmerald)" />
        </svg>
      </div>

      {/* Optional Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`${currentSize.textTitle} font-black tracking-tight text-slate-100 font-english`}>
              Smart <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">MMS</span>
            </span>
          </div>
          <span className={`${currentSize.textSub} font-bold text-slate-400 font-bengali tracking-wide`}>
            ডিজিটাল মেস ম্যানেজার
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;

