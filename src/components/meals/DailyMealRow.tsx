"use client";

import React from "react";
import {
  toBengaliNumeral,
  getDayOfWeekBengali,
  formatMonthBengali,
} from "../../utils/formatters";
import { Minus, Plus, Sun, Sunrise, Moon, Check, X } from "lucide-react";

interface DailyMealRowProps {
  date: string; // YYYY-MM-DD
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

  const parts = date.split("-");
  const dayStr = parts[2] || "01";
  const dayBn = toBengaliNumeral(dayStr);
  const dayOfWeekBn = getDayOfWeekBengali(date);
  const monthBnShort = formatMonthBengali(date.slice(0, 7), true);

  // Stepper handlers
  const handleBreakfastChange = (delta: number) => {
    const next = Math.max(0, Math.min(3, Math.round((breakfast + delta) * 10) / 10));
    onUpdate(next, lunch, dinner);
  };

  const handleLunchChange = (delta: number) => {
    const next = Math.max(0, Math.min(5, lunch + delta));
    onUpdate(breakfast, next, dinner);
  };

  const handleDinnerChange = (delta: number) => {
    const next = Math.max(0, Math.min(5, dinner + delta));
    onUpdate(breakfast, lunch, next);
  };

  // Quick presets
  const handleQuickPresetAll = () => {
    onUpdate(1, 1, 1);
  };

  const handleQuickPresetOff = () => {
    onUpdate(0, 0, 0);
  };

  const isAllStandard = breakfast === 1 && lunch === 1 && dinner === 1;
  const isAllOff = breakfast === 0 && lunch === 0 && dinner === 0;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isToday
          ? "bg-slate-900/95 border-amber-500/50 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/20"
          : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80"
      }`}
    >
      {/* Top Header Strip: Date, Bengali Day name, Today Badge, Quick Presets & Total */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-950/40 border-b border-slate-800/60 gap-2">
        {/* Date block */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
              isToday
                ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            {dayBn}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bengali font-bold text-xs text-slate-200">
                {dayOfWeekBn}
              </span>
              <span className="text-[10px] text-slate-400 font-bengali">
                ({dayBn} {monthBnShort})
              </span>
              {isToday && (
                <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-bengali border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  আজ
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Quick Preset Chips & Total Meals Pill */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick presets (1-1-1 or Off) */}
          {!disabled && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleQuickPresetAll}
                title="এক ট্যাপে পূর্ণ মিল (১-১-১)"
                className={`text-[10px] px-2 py-1 rounded-lg border font-bengali transition-all active:scale-90 ${
                  isAllStandard
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                ১-১-১
              </button>
              <button
                type="button"
                onClick={handleQuickPresetOff}
                title="এক ট্যাপে মিল বন্ধ (০-০-০)"
                className={`text-[10px] px-1.5 py-1 rounded-lg border font-bengali transition-all active:scale-90 ${
                  isAllOff
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                বন্ধ
              </button>
            </div>
          )}

          {/* Daily Total Pill */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${
              totalMeals > 0
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-slate-800/40 border-slate-800 text-slate-500"
            }`}
          >
            <span className="font-english font-bold">
              {toBengaliNumeral(totalMeals)}
            </span>
            <span className="text-[10px] font-bengali">মিল</span>
          </div>
        </div>
      </div>

      {/* 3 Meal Slots Grid (Breakfast, Lunch, Dinner) */}
      <div className="p-2.5 grid grid-cols-3 gap-2">
        {/* Morning / Breakfast */}
        <div
          className={`flex flex-col items-center justify-between p-2 rounded-xl border transition-all ${
            breakfast > 0
              ? "bg-sky-500/[0.07] border-sky-500/30 text-sky-200"
              : "bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60"
          }`}
        >
          <div className="flex items-center gap-1 text-[11px] font-bengali font-semibold mb-1.5">
            <Sunrise className={`w-3.5 h-3.5 ${breakfast > 0 ? "text-sky-400" : "text-slate-500"}`} />
            <span>সকাল</span>
          </div>

          <div className="flex items-center justify-between w-full max-w-[90px] bg-slate-950/70 border border-slate-800/80 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => handleBreakfastChange(-0.5)}
              disabled={disabled || breakfast <= 0}
              aria-label="সকালের মিল কমান"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800/90 text-slate-200 hover:bg-slate-700 active:scale-90 disabled:opacity-20 disabled:pointer-events-none transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-bold font-english text-amber-300 min-w-[20px] text-center">
              {toBengaliNumeral(breakfast)}
            </span>

            <button
              type="button"
              onClick={() => handleBreakfastChange(0.5)}
              disabled={disabled || breakfast >= 3}
              aria-label="সকালের মিল বাড়ান"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800/90 text-slate-200 hover:bg-slate-700 active:scale-90 disabled:opacity-20 disabled:pointer-events-none transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lunch */}
        <div
          className={`flex flex-col items-center justify-between p-2 rounded-xl border transition-all ${
            lunch > 0
              ? "bg-amber-500/[0.08] border-amber-500/35 text-amber-200"
              : "bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60"
          }`}
        >
          <div className="flex items-center gap-1 text-[11px] font-bengali font-semibold mb-1.5">
            <Sun className={`w-3.5 h-3.5 ${lunch > 0 ? "text-amber-400" : "text-slate-500"}`} />
            <span>দুপুর</span>
          </div>

          <div className="flex items-center justify-between w-full max-w-[90px] bg-slate-950/70 border border-slate-800/80 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => handleLunchChange(-1)}
              disabled={disabled || lunch <= 0}
              aria-label="দুপুরের মিল কমান"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800/90 text-slate-200 hover:bg-slate-700 active:scale-90 disabled:opacity-20 disabled:pointer-events-none transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-bold font-english text-amber-300 min-w-[20px] text-center">
              {toBengaliNumeral(lunch)}
            </span>

            <button
              type="button"
              onClick={() => handleLunchChange(1)}
              disabled={disabled || lunch >= 5}
              aria-label="দুপুরের মিল বাড়ান"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800/90 text-slate-200 hover:bg-slate-700 active:scale-90 disabled:opacity-20 disabled:pointer-events-none transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dinner */}
        <div
          className={`flex flex-col items-center justify-between p-2 rounded-xl border transition-all ${
            dinner > 0
              ? "bg-indigo-500/[0.08] border-indigo-500/35 text-indigo-200"
              : "bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60"
          }`}
        >
          <div className="flex items-center gap-1 text-[11px] font-bengali font-semibold mb-1.5">
            <Moon className={`w-3.5 h-3.5 ${dinner > 0 ? "text-indigo-400" : "text-slate-500"}`} />
            <span>রাত</span>
          </div>

          <div className="flex items-center justify-between w-full max-w-[90px] bg-slate-950/70 border border-slate-800/80 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => handleDinnerChange(-1)}
              disabled={disabled || dinner <= 0}
              aria-label="রাতের মিল কমান"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800/90 text-slate-200 hover:bg-slate-700 active:scale-90 disabled:opacity-20 disabled:pointer-events-none transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-bold font-english text-amber-300 min-w-[20px] text-center">
              {toBengaliNumeral(dinner)}
            </span>

            <button
              type="button"
              onClick={() => handleDinnerChange(1)}
              disabled={disabled || dinner >= 5}
              aria-label="রাতের মিল বাড়ান"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800/90 text-slate-200 hover:bg-slate-700 active:scale-90 disabled:opacity-20 disabled:pointer-events-none transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMealRow;
