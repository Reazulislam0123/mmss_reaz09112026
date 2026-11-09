"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";
import { toBengaliNumeral } from "../../utils/formatters";

interface StepperControlProps {
  label: string;
  value: number;
  step?: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  disabled?: boolean;
  compact?: boolean;
}

export const StepperControl: React.FC<StepperControlProps> = ({
  label,
  value,
  step = 1,
  min = 0,
  max = 10,
  onChange,
  disabled = false,
  compact = true,
}) => {
  const handleDec = () => {
    if (value - step >= min) {
      onChange(Math.round((value - step) * 10) / 10);
    }
  };

  const handleInc = () => {
    if (value + step <= max) {
      onChange(Math.round((value + step) * 10) / 10);
    }
  };

  return (
    <div className="flex flex-col items-center min-w-0">
      <span className="text-[11px] text-slate-400 font-medium mb-1 font-bengali truncate">
        {label}
      </span>
      <div className="flex items-center justify-between w-full max-w-[95px] bg-slate-950/70 border border-slate-800/80 rounded-xl p-0.5 shadow-sm">
        <button
          type="button"
          onClick={handleDec}
          disabled={disabled || value <= min}
          aria-label={`${label} কমান`}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/90 text-slate-200 hover:bg-slate-700 active:scale-90 disabled:opacity-20 disabled:pointer-events-none transition-all shrink-0"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="text-xs sm:text-sm font-bold text-amber-300 font-english min-w-[22px] text-center">
          {toBengaliNumeral(value)}
        </span>

        <button
          type="button"
          onClick={handleInc}
          disabled={disabled || value >= max}
          aria-label={`${label} বাড়ান`}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-800/90 text-slate-200 hover:bg-slate-700 active:scale-90 disabled:opacity-20 disabled:pointer-events-none transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default StepperControl;
