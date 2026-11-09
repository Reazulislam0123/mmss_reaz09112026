import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "emerald" | "amber" | "rose" | "indigo" | "slate";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "slate",
  className = "",
}) => {
  const variantStyles = {
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    slate: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

