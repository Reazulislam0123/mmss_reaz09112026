import React from "react";
import GlassCard from "../ui/GlassCard";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  subtext?: string;
  accentColor?: "amber" | "emerald" | "indigo" | "rose";
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  accentColor = "amber",
}) => {
  const colorMap = {
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  };

  return (
    <GlassCard className="p-3.5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs text-slate-400 font-bengali truncate">{label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${colorMap[accentColor]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="text-lg sm:text-xl font-bold text-slate-100 font-english truncate tracking-tight">
        {value}
      </div>
      {subtext && (
        <span className="text-[10px] text-slate-500 font-bengali mt-0.5 block truncate">
          {subtext}
        </span>
      )}
    </GlassCard>
  );
};

export default StatCard;

