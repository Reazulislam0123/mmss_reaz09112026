import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl p-4 shadow-xl transition-all duration-200 ${
        onClick ? "cursor-pointer active:scale-[0.99] hover:border-slate-700/80" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;

