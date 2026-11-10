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
  User,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowDown,
  Lock,
  Eye,
  Sunrise,
  Sun,
  Moon,
  Utensils,
  CheckCircle2,
  ChefHat,
  ShieldAlert,
} from "lucide-react";

export default function MealsPage() {
  const { mongoUser } = useAuth();
  const {
    members,
    meals,
    selectedMonth,
    setSelectedMonth,
    dutyManagerUid,
    addMealEntry,
    saveBulkMeals,
  } = useMess();

  const [activeTab, setActiveTab] = useState<"calendar" | "all_members">("calendar");
  const [selectedMemberUid, setSelectedMemberUid] = useState<string>(
    mongoUser?.firebaseUid || ""
  );
  const [showBulkSheet, setShowBulkSheet] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const todayRef = useRef<HTMLDivElement | null>(null);

  // Sync selectedMemberUid when mongoUser loads
  useEffect(() => {
    if (mongoUser && !selectedMemberUid) {
      setSelectedMemberUid(mongoUser.firebaseUid);
    }
  }, [mongoUser, selectedMemberUid]);

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
  const isDutyManager = mongoUser?.firebaseUid === dutyManagerUid;
  const currentDate = getCurrentDate();
  const isCurrentMonth = selectedMonth === getCurrentMonth();

  // Find targeted member profile
  const targetMember =
    members.find((m) => m.firebaseUid === selectedMemberUid) ||
    (mongoUser
      ? {
          firebaseUid: mongoUser.firebaseUid,
          fullName: mongoUser.fullName,
          roomNo: mongoUser.roomNo || "N/A",
          role: mongoUser.role,
        }
      : members[0]);

  const isViewingSelf = targetMember?.firebaseUid === mongoUser?.firebaseUid;
  const canEditTarget = isManager || isDutyManager || isViewingSelf;

  // Targeted member's monthly meals calculation
  const targetMonthMeals = meals.filter(
    (m) => m.firebaseUid === targetMember?.firebaseUid && m.date.startsWith(selectedMonth)
  );

  const targetTotalMeals = targetMonthMeals.reduce((acc, m) => acc + (m.totalMeals || 0), 0);
  const targetBreakfast = targetMonthMeals.reduce((acc, m) => acc + (m.breakfast || 0), 0);
  const targetLunch = targetMonthMeals.reduce((acc, m) => acc + (m.lunch || 0), 0);
  const targetDinner = targetMonthMeals.reduce((acc, m) => acc + (m.dinner || 0), 0);
  const activeDaysCount = targetMonthMeals.filter((m) => (m.totalMeals || 0) > 0).length;
  const avgMealsPerDay =
    activeDaysCount > 0 ? (targetTotalMeals / activeDaysCount).toFixed(1) : "০.০";

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

      <main className="max-w-md md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6 pb-28 md:pb-12">
        {/* Top View Selector Tabs: Person Calendar vs All Members Overview */}
        <div className="flex items-center bg-slate-900/80 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold font-bengali transition-all ${
              activeTab === "calendar"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>সদস্যভিত্তিক ক্যালেন্ডার</span>
          </button>

          <button
            onClick={() => setActiveTab("all_members")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold font-bengali transition-all ${
              activeTab === "all_members"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>সবার মোট হিসাব ({toBengaliNumeral(members.length)})</span>
          </button>
        </div>

        {/* Month Stepper & High-level Metrics Card */}
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

          {/* Quick Metrics for Active Member / House */}
          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-2.5">
              <span className="text-[10px] text-slate-400 font-bengali block">মোট মিল</span>
              <span className="text-lg font-bold text-amber-400 font-english leading-tight block">
                {toBengaliNumeral(targetTotalMeals)}
              </span>
              <span className="text-[9px] text-slate-500 font-bengali truncate block">
                {isViewingSelf ? "আপনার" : targetMember?.fullName?.split(" ")[0]}
              </span>
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
            {activeTab === "calendar" && isCurrentMonth ? (
              <button
                onClick={scrollToToday}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bengali bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl active:scale-95 transition-all"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>আজকের দিনে যান</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 font-bengali">
                মোট {toBengaliNumeral(daysInMonth)} দিনের মিল হিসাব
              </span>
            )}

            {(isManager || isDutyManager) && (
              <button
                onClick={() => setShowBulkSheet(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold font-bengali shadow-md shadow-amber-500/20 active:scale-95 transition-transform ml-auto"
              >
                <Users className="w-3.5 h-3.5" />
                <span>সবার মিল এন্ট্রি</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: INDIVIDUAL PERSON CALENDAR */}
        {activeTab === "calendar" && (
          <div className="space-y-3">
            {/* Person-Selector Horizontal Scroll Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-xs text-slate-400 font-bengali font-semibold">
                  সদস্য নির্বাচন করুন (Select Member):
                </span>
                <span className="text-[10px] text-amber-400 font-bengali">
                  {members.length} জন সদস্য
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
                {members.map((m) => {
                  const isSelected = m.firebaseUid === selectedMemberUid;
                  const isMe = m.firebaseUid === mongoUser?.firebaseUid;
                  const memberMonthMeals = meals
                    .filter((rec) => rec.firebaseUid === m.firebaseUid && rec.date.startsWith(selectedMonth))
                    .reduce((sum, rec) => sum + (rec.totalMeals || 0), 0);

                  return (
                    <button
                      key={m.firebaseUid}
                      onClick={() => setSelectedMemberUid(m.firebaseUid)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all active:scale-95 shrink-0 select-none ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10 font-bold ring-1 ring-amber-500/30"
                          : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? "bg-amber-500 text-slate-950"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {m.fullName.charAt(0)}
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-1 leading-tight">
                          <span className="text-xs font-bengali truncate max-w-[100px]">
                            {m.fullName}
                          </span>
                          {isMe && (
                            <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-1 rounded font-bold">
                              আমি
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-english block">
                          {toBengaliNumeral(memberMonthMeals)} মিল
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Currently Viewing Member Status Banner */}
            <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 rounded-2xl px-3 py-2 text-xs">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                  {targetMember?.fullName?.charAt(0) || "ম"}
                </div>
                <div className="truncate">
                  <span className="font-bold text-slate-200 font-bengali">
                    {targetMember?.fullName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-english ml-1.5">
                    (রুম: {targetMember?.roomNo})
                  </span>
                </div>
              </div>

              {canEditTarget ? (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bengali font-semibold shrink-0">
                  ✏️ এডিট করার অনুমতি
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full font-bengali flex items-center gap-1 shrink-0">
                  <Eye className="w-3 h-3 text-slate-400" />
                  <span>শুধু দেখার জন্য</span>
                </span>
              )}
            </div>

            {/* 1 to 31 Daily Meal Cards for Targeted Person (Responsive Grid on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
              {daysArray.map((dateStr) => {
                const entry = meals.find(
                  (m) => m.date === dateStr && m.firebaseUid === targetMember?.firebaseUid
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
                      disabled={!canEditTarget}
                      onUpdate={(b, l, d) => {
                        if (targetMember) {
                          addMealEntry(dateStr, targetMember.firebaseUid, b, l, d);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ALL MEMBERS SUMMARY MATRIX */}
        {activeTab === "all_members" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-xs text-slate-400 font-bengali">
                {formatMonthBengali(selectedMonth)} মাসের সবার মোট মিল হিসাব
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {members.map((m) => {
                const memberMeals = meals.filter(
                  (rec) => rec.firebaseUid === m.firebaseUid && rec.date.startsWith(selectedMonth)
                );

                const bTotal = memberMeals.reduce((acc, rec) => acc + (rec.breakfast || 0), 0);
                const lTotal = memberMeals.reduce((acc, rec) => acc + (rec.lunch || 0), 0);
                const dTotal = memberMeals.reduce((acc, rec) => acc + (rec.dinner || 0), 0);
                const total = memberMeals.reduce((acc, rec) => acc + (rec.totalMeals || 0), 0);
                const activeDays = memberMeals.filter((rec) => (rec.totalMeals || 0) > 0).length;

                const isMe = m.firebaseUid === mongoUser?.firebaseUid;
                const isMemberManager = m.role === "manager";
                const isMemberDuty = m.firebaseUid === dutyManagerUid;

                return (
                  <div
                    key={m.firebaseUid}
                    className={`rounded-2xl border p-3.5 transition-all ${
                      isMe
                        ? "bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80"
                    }`}
                  >
                    {/* Member Header */}
                    <div className="flex items-start justify-between gap-2 mb-2.5 pb-2.5 border-b border-slate-800/70">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                          {m.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bengali font-bold text-sm text-slate-100 truncate">
                              {m.fullName}
                            </span>
                            {isMe && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full font-bengali font-bold">
                                আপনি
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-english mt-0.5">
                            <span>রুম: {m.roomNo}</span>
                            {isMemberDuty && (
                              <span className="text-amber-400 font-bengali font-semibold flex items-center gap-1">
                                <ChefHat className="w-3 h-3" />
                                <span>চলতি মিল ম্যানেজার</span>
                              </span>
                            )}
                            {isMemberManager && !isMemberDuty && (
                              <span className="text-indigo-400 font-bengali">মেস ম্যানেজার</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Total Meals Pill */}
                      <div className="text-right shrink-0">
                        <span className="text-base font-bold text-amber-400 font-english block leading-tight">
                          {toBengaliNumeral(total)} টি
                        </span>
                        <span className="text-[10px] text-slate-500 font-bengali">
                          {toBengaliNumeral(activeDays)} দিন চালু
                        </span>
                      </div>
                    </div>

                    {/* Breakdown 3 Pills (Breakfast, Lunch, Dinner) */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                      <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-1.5">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-sky-400 font-bengali mb-0.5">
                          <Sunrise className="w-3 h-3" />
                          <span>সকাল</span>
                        </div>
                        <span className="font-english font-bold text-slate-200">
                          {toBengaliNumeral(bTotal)}
                        </span>
                      </div>

                      <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-1.5">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-amber-400 font-bengali mb-0.5">
                          <Sun className="w-3 h-3" />
                          <span>দুপুর</span>
                        </div>
                        <span className="font-english font-bold text-slate-200">
                          {toBengaliNumeral(lTotal)}
                        </span>
                      </div>

                      <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-1.5">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-indigo-400 font-bengali mb-0.5">
                          <Moon className="w-3 h-3" />
                          <span>রাত</span>
                        </div>
                        <span className="font-english font-bold text-slate-200">
                          {toBengaliNumeral(dTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Button: Jump to this person's 31-day calendar */}
                    <button
                      onClick={() => {
                        setSelectedMemberUid(m.firebaseUid);
                        setActiveTab("calendar");
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-300 active:scale-98 transition-all font-bengali"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{m.fullName.split(" ")[0]}-এর {toBengaliNumeral(daysInMonth)} দিনের ক্যালেন্ডার দেখুন</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
