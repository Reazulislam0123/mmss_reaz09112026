"use client";

import React, { useState, useRef, useEffect } from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import DailyMealRow from "../../components/meals/DailyMealRow";
import BulkMealSheet from "../../components/meals/BulkMealSheet";
import MonthPickerDrawer from "../../components/ui/MonthPickerDrawer";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import {
  toBengaliNumeral,
  formatMonthBengali,
  getCurrentMonth,
  getCurrentDate,
} from "../../utils/formatters";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  TrendingUp,
  ArrowDown,
} from "lucide-react";

export default function MealsPage() {
  const { mongoUser } = useAuth();
  const { members, meals, selectedMonth, setSelectedMonth, addMealEntry, saveBulkMeals } =
    useMess();
  const [showBulkSheet, setShowBulkSheet] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const todayRef = useRef<HTMLDivElement | null>(null);

  // Generate all days for selected month (1 to 28/30/31)
  const [yearStr, monthStr] = selectedMonth.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    return `${selectedMonth}-${day}`;
  });

  const isManager = mongoUser?.role === "manager" || mongoUser?.role === "super_admin";
  const currentDate = getCurrentDate();
  const isCurrentMonth = selectedMonth === getCurrentMonth();

  // User's monthly meal stats
  const userMonthMeals = meals.filter(
    (m) => m.firebaseUid === mongoUser?.firebaseUid && m.date.startsWith(selectedMonth)
  );

  const userTotalMeals = userMonthMeals.reduce((acc, m) => acc + (m.totalMeals || 0), 0);
  const activeDaysCount = userMonthMeals.filter((m) => (m.totalMeals || 0) > 0).length;
  const avgMealsPerDay =
    activeDaysCount > 0 ? (userTotalMeals / activeDaysCount).toFixed(1) : "০.০";

  // Month navigation helpers
  const handlePrevMonth = () => {
    let y = year;
    let m = month - 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    setSelectedMonth(`${y}-${String(m).padStart(2, "0")}`);
  };

  const handleNextMonth = () => {
    let y = year;
    let m = month + 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setSelectedMonth(`${y}-${String(m).padStart(2, "0")}`);
  };

  const scrollToToday = () => {
    todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <MobileAppHeader />

      <main className="max-w-md mx-auto px-3.5 pt-3 space-y-3.5">
        {/* Month Stepper & Stats Card */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/80 rounded-3xl p-3.5 shadow-xl backdrop-blur-xl">
          {/* Header Row: Month title & switcher */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/70 pb-3">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-800/80 rounded-xl text-slate-400 hover:text-slate-200 transition-colors active:scale-95"
              title="পূর্ববর্তী মাস"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowMonthPicker(true)}
              className="flex items-center gap-1.5 hover:bg-slate-800/60 px-3 py-1 rounded-2xl transition-colors active:scale-95 group"
            >
              <Calendar className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-bengali font-bold text-base text-slate-100 tracking-wide">
                {formatMonthBengali(selectedMonth)}
              </span>
            </button>

            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-800/80 rounded-xl text-slate-400 hover:text-slate-200 transition-colors active:scale-95"
              title="পরবর্তী মাস"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-2.5">
              <span className="text-[10px] text-slate-400 font-bengali block">মোট মিল</span>
              <span className="text-lg font-bold text-amber-400 font-english leading-tight block">
                {toBengaliNumeral(userTotalMeals)}
              </span>
              <span className="text-[9px] text-slate-500 font-bengali">চলতি মাসে</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-2.5">
              <span className="text-[10px] text-slate-400 font-bengali block">মিল চালুর দিন</span>
              <span className="text-lg font-bold text-emerald-400 font-english leading-tight block">
                {toBengaliNumeral(activeDaysCount)}
              </span>
              <span className="text-[9px] text-slate-500 font-bengali">দিন সক্রিয়</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-2.5">
              <span className="text-[10px] text-slate-400 font-bengali block">দৈনিক গড়</span>
              <span className="text-lg font-bold text-sky-400 font-english leading-tight block">
                {toBengaliNumeral(avgMealsPerDay)}
              </span>
              <span className="text-[9px] text-slate-500 font-bengali">মিল / দিন</span>
            </div>
          </div>

          {/* Action Row: Jump to Today & Manager Bulk Entry */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800/60">
            {isCurrentMonth ? (
              <button
                onClick={scrollToToday}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bengali bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl active:scale-95 transition-all"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>আজকের দিনে যান</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 font-bengali">
                মোট {toBengaliNumeral(daysInMonth)} দিনের মিল তালিকা
              </span>
            )}

            {isManager && (
              <button
                onClick={() => setShowBulkSheet(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-bold font-bengali shadow-md shadow-amber-500/20 active:scale-95 transition-transform ml-auto"
              >
                <Users className="w-3.5 h-3.5" />
                <span>সবার মিল এন্ট্রি</span>
              </button>
            )}
          </div>
        </div>

        {/* Date-by-date list */}
        <div className="space-y-2.5">
          {daysArray.map((dateStr) => {
            const entry = meals.find(
              (m) => m.date === dateStr && m.firebaseUid === mongoUser?.firebaseUid
            ) || { breakfast: 0, lunch: 0, dinner: 0, totalMeals: 0 };

            const isToday = dateStr === currentDate;

            return (
              <div key={dateStr} ref={isToday ? todayRef : null}>
                <DailyMealRow
                  date={dateStr}
                  breakfast={entry.breakfast}
                  lunch={entry.lunch}
                  dinner={entry.dinner}
                  totalMeals={entry.totalMeals}
                  onUpdate={(b, l, d) => {
                    if (mongoUser) {
                      addMealEntry(dateStr, mongoUser.firebaseUid, b, l, d);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* Month Picker Sheet */}
      <MonthPickerDrawer
        isOpen={showMonthPicker}
        onClose={() => setShowMonthPicker(false)}
        selectedMonth={selectedMonth}
        onSelectMonth={(m) => setSelectedMonth(m)}
      />

      {/* Manager Bulk Entry Sheet */}
      <BulkMealSheet
        isOpen={showBulkSheet}
        onClose={() => setShowBulkSheet(false)}
        members={members}
        onSave={saveBulkMeals}
      />

      <MobileBottomNav />
    </div>
  );
}
