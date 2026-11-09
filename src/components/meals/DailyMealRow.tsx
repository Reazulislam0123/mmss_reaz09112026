"use client";

import React from "react";
import GlassCard from "../ui/GlassCard";
import StepperControl from "../ui/StepperControl";
import { formatDateBengali, toBengaliNumeral } from "../../utils/formatters";

interface DailyMealRowProps {
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  totalMeals: number;
  onUpdate: (b: number, l: number, d: number) => void;
  disabled?: boolean;
}

export const DailyMealRow: React.FC<DailyMealRowProps> = ({
  date,
  breakfast,
  lunch,
  dinner,
  totalMeals,
  onUpdate,
  disabled = false,
}) => {
  const isToday = new Date().toISOString().startsWith(date);

  return (
    <GlassCard className={`p-4 ${isToday ? "border-amber-500/40 bg-amber-500/[0.04]" : ""}`}>
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-english font-semibold text-sm text-slate-200">
            {date}
          </span>
          {isToday && (
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full font-bengali">
              আজকের দিন
            </span>
          )}
        </div>
        <div className="text-xs text-slate-400 font-bengali">
          মোট:{" "}
          <span className="font-bold text-amber-400 font-english text-sm">
            {toBengaliNumeral(totalMeals)}
          </span>{" "}
          টি মিল
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StepperControl
          label="সকাল"
          value={breakfast}
          step={0.5}
          min={0}
          max={3}
          onChange={(val) => onUpdate(val, lunch, dinner)}
          disabled={disabled}
        />
        <StepperControl
          label="দুপুর"
          value={lunch}
          step={1}
          min={0}
          max={5}
          onChange={(val) => onUpdate(breakfast, val, dinner)}
          disabled={disabled}
        />
        <StepperControl
          label="রাত"
          value={dinner}
          step={1}
          min={0}
          max={5}
          onChange={(val) => onUpdate(breakfast, lunch, val)}
          disabled={disabled}
        />
      </div>
    </GlassCard>
  );
};

export default DailyMealRow;

