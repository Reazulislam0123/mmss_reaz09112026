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
}

export const StepperControl: React.FC<StepperControlProps> = ({
  label,
  value,
  step = 1,
  min = 0,
  max = 10,
  onChange,
  disabled = false,
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
    <div className="flex flex-col items-center">
      <span className="text-xs text-slate-400 font-medium mb-1.5">{label}</span>
      <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-xl p-1">
        <button
          type="button"
          onClick={handleDec}
          disabled={disabled || value <= min}
          aria-label={`${label} কমান`}
          className="w-10 h-10 min-w-[40px] flex items-center justify-center rounded-lg bg-slate-800/80 text-slate-200 active:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-9 text-center font-bold text-base text-amber-400 font-english">
          {toBengaliNumeral(value)}
        </span>

        <button
          type="button"
          onClick={handleInc}
          disabled={disabled || value >= max}
          aria-label={`${label} বাড়ান`}
          className="w-10 h-10 min-w-[40px] flex items-center justify-center rounded-lg bg-slate-800/80 text-slate-200 active:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StepperControl;

