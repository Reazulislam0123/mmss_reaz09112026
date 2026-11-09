"use client";

import React, { useState } from "react";
import BottomDrawer from "./BottomDrawer";
import { formatMonthBengali, toBengaliNumeral, getCurrentMonth } from "../../utils/formatters";
import { Calendar, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface MonthPickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string; // e.g. "2026-11"
  onSelectMonth: (month: string) => void;
}

const MONTHS_DATA = [
  { num: "01", bn: "জানুয়ারি", en: "Jan" },
  { num: "02", bn: "ফেব্রুয়ারি", en: "Feb" },
  { num: "03", bn: "মার্চ", en: "Mar" },
  { num: "04", bn: "এপ্রিল", en: "Apr" },
  { num: "05", bn: "মে", en: "May" },
  { num: "06", bn: "জুন", en: "Jun" },
  { num: "07", bn: "জুলাই", en: "Jul" },
  { num: "08", bn: "আগস্ট", en: "Aug" },
  { num: "09", bn: "সেপ্টেম্বর", en: "Sep" },
  { num: "10", bn: "অক্টোবর", en: "Oct" },
  { num: "11", bn: "নভেম্বর", en: "Nov" },
  { num: "12", bn: "ডিসেম্বর", en: "Dec" },
];

export const MonthPickerDrawer: React.FC<MonthPickerDrawerProps> = ({
  isOpen,
  onClose,
  selectedMonth,
  onSelectMonth,
}) => {
  const currentMonthStr = getCurrentMonth();
  const [selectedYear, setSelectedYear] = useState(() => {
    return parseInt(selectedMonth.split("-")[0], 10) || new Date().getFullYear();
  });

  const activeYearStr = selectedMonth.split("-")[0];
  const activeMonthNum = selectedMonth.split("-")[1];

  const handlePick = (monthNum: string) => {
    const newMonthStr = `${selectedYear}-${monthNum}`;
    onSelectMonth(newMonthStr);
    onClose();
  };

  const handleCurrentMonth = () => {
    onSelectMonth(currentMonthStr);
    onClose();
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="মাস নির্বাচন করুন (Select Month)">
      <div className="space-y-4 pt-1">
        {/* Year Selector */}
        <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-2xl p-1.5">
          <button
            onClick={() => setSelectedYear((y) => y - 1)}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
            title="পূর্ববর্তী বছর"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="font-bold text-base text-slate-100 font-bengali">
              {toBengaliNumeral(selectedYear)} সাল
            </span>
            <span className="text-[11px] text-slate-500 font-mono block">({selectedYear})</span>
          </div>

          <button
            onClick={() => setSelectedYear((y) => y + 1)}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
            title="পরবর্তী বছর"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 12 Months Grid */}
        <div className="grid grid-cols-3 gap-2">
          {MONTHS_DATA.map((item) => {
            const isSelected =
              String(selectedYear) === activeYearStr && item.num === activeMonthNum;
            const isCurrent =
              `${selectedYear}-${item.num}` === currentMonthStr;

            return (
              <button
                key={item.num}
                onClick={() => handlePick(item.num)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border text-center transition-all active:scale-95 relative ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-500/60 text-amber-400 shadow-lg shadow-amber-500/10 font-bold"
                    : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300 hover:text-slate-100"
                }`}
              >
                {isCurrent && !isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
                )}
                {isSelected && (
                  <Check className="w-3.5 h-3.5 absolute top-2 right-2 text-amber-400" />
                )}
                <span className="text-sm font-bengali leading-tight">{item.bn}</span>
                <span className="text-[10px] text-slate-500 font-english mt-0.5 uppercase tracking-wide">
                  {item.en}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick jump to Current Month button */}
        <div className="pt-2">
          <button
            onClick={handleCurrentMonth}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-400 transition-all active:scale-98"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>বর্তমান মাস ({formatMonthBengali(currentMonthStr)}) এ ফিরে যান</span>
          </button>
        </div>
      </div>
    </BottomDrawer>
  );
};

export default MonthPickerDrawer;
