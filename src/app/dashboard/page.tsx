"use client";

import React, { useState, useEffect } from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import BalanceAlertBanner from "../../components/dashboard/BalanceAlertBanner";
import StatCard from "../../components/dashboard/StatCard";
import QuickActionFab from "../../components/dashboard/QuickActionFab";
import DailyMealRow from "../../components/meals/DailyMealRow";
import AddBazaarDrawer from "../../components/bazaar/AddBazaarDrawer";
import BottomDrawer from "../../components/ui/BottomDrawer";
import StepperControl from "../../components/ui/StepperControl";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import { formatTaka, toBengaliNumeral, getCurrentDate } from "../../utils/formatters";
import {
  Utensils,
  ShoppingCart,
  Coins,
  Calculator,
  ArrowRight,
  ChefHat,
  Wallet,
  Zap,
  FileEdit,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { mongoUser } = useAuth();
  const {
    currentHouse,
    members,
    meals,
    bazaars,
    deposits,
    summary,
    memberStatements,
    dutyManagerUid,
    addMealEntry,
    addBazaarEntry,
    addDepositEntry,
  } = useMess();

  const [showMealDrawer, setShowMealDrawer] = useState(false);
  const [showBazaarDrawer, setShowBazaarDrawer] = useState(false);
  const [showDepositDrawer, setShowDepositDrawer] = useState(false);

  const isSuperAdmin =
    mongoUser?.role === "super_admin" ||
    mongoUser?.email?.toLowerCase() === "reazul.islam6164@gmail.com";

  const isHouseManager =
    isSuperAdmin ||
    mongoUser?.role === "manager" ||
    currentHouse?.managerFirebaseUid === mongoUser?.firebaseUid;

  const isDutyManager = mongoUser?.firebaseUid === dutyManagerUid;
  const canManageMeals = isHouseManager || isDutyManager;

  // Quick single meal state for today
  const todayStr = getCurrentDate();
  const activeUserUid = mongoUser?.firebaseUid || members[0]?.firebaseUid || "UID_01";
  const userTodayMeal = meals.find(
    (m) => m.date === todayStr && m.firebaseUid === activeUserUid
  ) || { breakfast: 1, lunch: 1, dinner: 1, totalMeals: 3 };

  // Current user's statement
  const userStatement = memberStatements.find(
    (s) => s.firebaseUid === activeUserUid
  ) || {
    fullName: mongoUser?.fullName || members[0]?.fullName || "সদস্য",
    netBalance: 0,
    totalMeals: 0,
  };

  // Controlled Quick Meal Drawer States
  const [drawerMemberUid, setDrawerMemberUid] = useState<string>(activeUserUid);
  const [drawerDate, setDrawerDate] = useState<string>(todayStr);
  const [drawerB, setDrawerB] = useState<number>(1);
  const [drawerL, setDrawerL] = useState<number>(1);
  const [drawerD, setDrawerD] = useState<number>(1);
  const [savingMeal, setSavingMeal] = useState<boolean>(false);
  const [mealSuccessToast, setMealSuccessToast] = useState<string>("");

  // Sync drawer member UID when active user or members load
  useEffect(() => {
    if (activeUserUid && (!drawerMemberUid || drawerMemberUid === "UID_01")) {
      setDrawerMemberUid(activeUserUid);
    }
  }, [activeUserUid, drawerMemberUid]);

  // Sync drawer values whenever drawer opens or target member/date changes
  useEffect(() => {
    if (showMealDrawer) {
      const targetUid = drawerMemberUid || activeUserUid;
      const found = meals.find((m) => m.date === drawerDate && m.firebaseUid === targetUid);
      if (found) {
        setDrawerB(found.breakfast);
        setDrawerL(found.lunch);
        setDrawerD(found.dinner);
      } else {
        setDrawerB(1);
        setDrawerL(1);
        setDrawerD(1);
      }
    }
  }, [showMealDrawer, drawerMemberUid, drawerDate, meals, activeUserUid]);

  const handleSaveMealDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUid = drawerMemberUid || activeUserUid;
    if (!targetUid) return;

    setSavingMeal(true);
    try {
      await addMealEntry(drawerDate, targetUid, drawerB, drawerL, drawerD);
      const targetM = members.find((m) => m.firebaseUid === targetUid);
      const mName = targetM?.fullName || (targetUid === mongoUser?.firebaseUid ? "আপনার" : "সদস্যের");
      setMealSuccessToast(`✓ ${mName} মিল সফলভাবে সংরক্ষিত হয়েছে!`);
      setTimeout(() => {
        setMealSuccessToast("");
        setShowMealDrawer(false);
      }, 1000);
    } finally {
      setSavingMeal(false);
    }
  };

  // Deposit state
  const [depAmount, setDepAmount] = useState("");
  const [depMethod, setDepMethod] = useState("bKash");
  const [depTrx, setDepTrx] = useState("");

  const handleQuickDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depAmount) return;
    await addDepositEntry({
      date: todayStr,
      amount: Number(depAmount),
      firebaseUid: activeUserUid,
      paymentMethod: depMethod as any,
      trxId: depTrx,
      status: "approved",
    });
    setDepAmount("");
    setDepTrx("");
    setShowDepositDrawer(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* Top Mobile App Bar */}
      <MobileAppHeader />

      <main className="max-w-md md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5 sm:space-y-6 pb-28 md:pb-12">
        {/* Top Hero: Personal Balance & Rotating Duty Manager (2 columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
          <div className="md:col-span-7">
            <BalanceAlertBanner
              netBalance={userStatement.netBalance}
              memberName={userStatement.fullName}
            />
          </div>

          <div className="md:col-span-5 flex items-center">
            {/* Rotating 5-6 Days Duty Meal Manager Card */}
            {(() => {
              const dutyMgr = members.find((m) => m.firebaseUid === dutyManagerUid) || members[1] || members[0];
              return (
                <div className="w-full h-full p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between font-bengali shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-md">
                          চলতি মিল ম্যানেজার (৫–৬ দিন)
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-100 block mt-0.5 truncate">
                        {dutyMgr.fullName} {dutyMgr.roomNo ? `(রুম ${dutyMgr.roomNo})` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">দায়িত্ব: মিল ও বাজার</span>
                    <span className="text-[11px] font-bold text-emerald-400">অন ডিউটি 🔥</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 4-Card KPI Matrix (2 cols on mobile, 4 cols on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            label="চলতি মিল রেট"
            value={formatTaka(summary.activeMealRate, true)}
            icon={Calculator}
            accentColor="amber"
            subtext="প্রতি মিল খরচ"
          />
          <StatCard
            label="মেসের মোট মিল"
            value={`${toBengaliNumeral(summary.totalHouseMeals)} টি`}
            icon={Utensils}
            accentColor="indigo"
            subtext="চলতি মাসে"
          />
          <StatCard
            label="মোট বাজার খরচ"
            value={formatTaka(summary.totalBazaarExpense, true)}
            icon={ShoppingCart}
            accentColor="emerald"
            subtext="চলতি মাসে"
          />
          <StatCard
            label="আদায়কৃত মোট জমা"
            value={formatTaka(summary.totalDepositsCollected, true)}
            icon={Coins}
            accentColor="rose"
            subtext="মেস তহবিল"
          />
        </div>

        {/* Desktop 2-Column Split (Left: Today's meal & features, Right: Recent Bazaars & Master fund) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column (7 cols): Today's Meal Counter & 6 Modules */}
          <div className="md:col-span-7 space-y-5">
            {/* Today's Meal Quick Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-200 font-bengali">
                  আজকের মিল কাউন্টার
                </h2>
                <Link
                  href="/meals"
                  className="text-xs text-amber-400 font-bengali flex items-center gap-1 hover:underline"
                >
                  <span>পূর্ণ ক্যালেন্ডার</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <DailyMealRow
                date={todayStr}
                breakfast={userTodayMeal.breakfast}
                lunch={userTodayMeal.lunch}
                dinner={userTodayMeal.dinner}
                totalMeals={userTodayMeal.totalMeals}
                onUpdate={(b, l, d) => {
                  addMealEntry(todayStr, activeUserUid, b, l, d);
                }}
              />
            </div>

            {/* Quick Hub Navigation Shortcuts (6 Modules in 6-col on desktop) */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-slate-200 font-bengali">
                মেস ফিচার ও দ্রুত নেভিগেশন
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <Link
                  href="/meals"
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center active:scale-95 hover:border-amber-500/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200 font-bengali">মিল শিট</span>
                </Link>

                <Link
                  href="/bazaar"
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center active:scale-95 hover:border-emerald-500/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200 font-bengali">বাজার খরচ</span>
                </Link>

                <Link
                  href="/deposits"
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center active:scale-95 hover:border-indigo-500/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-1">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200 font-bengali">টাকা জমা</span>
                </Link>

                <Link
                  href="/fixed-costs"
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center active:scale-95 hover:border-amber-500/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center mb-1">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200 font-bengali">ইউটিলিটি বিল</span>
                </Link>

                <Link
                  href="/individual-bills"
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center active:scale-95 hover:border-rose-500/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-1">
                    <FileEdit className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200 font-bengali">ব্যক্তিগত সমন্বয়</span>
                </Link>

                <Link
                  href="/members"
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center active:scale-95 hover:border-cyan-500/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200 font-bengali">মেস সদস্য</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Recent Bazaars & Desktop Master Ledger Preview */}
          <div className="md:col-span-5 space-y-5">
            {/* Recent 3/4 Bazaars */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-200 font-bengali">
                  সাম্প্রতিক বাজার খরচ
                </h2>
                <Link
                  href="/bazaar"
                  className="text-xs text-amber-400 font-bengali flex items-center gap-1 hover:underline"
                >
                  <span>সকল বাজার ({bazaars.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {bazaars.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs font-bengali">
                    কোনো সাম্প্রতিক বাজার এন্ট্রি নেই
                  </div>
                ) : (
                  bazaars.slice(0, 4).map((b) => {
                    const payer = members.find((m) => m.firebaseUid === b.paidByUid);
                    return (
                      <div
                        key={b._id}
                        className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-xs font-semibold text-slate-200 font-bengali block truncate">
                            {b.itemDetails}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bengali">
                            {b.date} • {payer?.fullName || "মেস ফান্ড"}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-amber-400 font-english shrink-0">
                          {formatTaka(b.cost, true)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Desktop-only Master Mess Fund Preview */}
            <div className="hidden md:block p-4 rounded-3xl bg-slate-900/70 border border-slate-800/90 shadow-sm font-bengali">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">
                  চলতি মাসের ফাইনাল হিসাব সারাংশ
                </span>
                <Link
                  href="/ledger"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>পূর্ণ লেজার</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-rose-500/[0.07] border border-rose-500/20">
                  <span className="text-[10px] text-rose-400 block mb-0.5">মোট সদস্য বকেয়া</span>
                  <span className="text-base font-bold text-rose-400 font-english">
                    {formatTaka(summary.totalMessDue, true)}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/[0.07] border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-400 block mb-0.5">মোট সদস্য পাওনা</span>
                  <span className="text-base font-bold text-emerald-400 font-english">
                    {formatTaka(summary.totalMessPayable, true)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for 1-Tap Entry */}
      <QuickActionFab
        onAddMeal={() => setShowMealDrawer(true)}
        onAddBazaar={() => setShowBazaarDrawer(true)}
        onAddDeposit={() => setShowDepositDrawer(true)}
      />

      {/* Quick Add Meal Drawer */}
      <BottomDrawer
        isOpen={showMealDrawer}
        onClose={() => setShowMealDrawer(false)}
        title="মিল এন্ট্রি ও আপডেট (Meal Update)"
      >
        <form onSubmit={handleSaveMealDrawer} className="space-y-4 font-bengali">
          {/* Member selector for Managers / Super Admins */}
          {canManageMeals ? (
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1 flex items-center justify-between">
                <span>সদস্য নির্বাচন করুন (ম্যানেজার এক্সেস):</span>
                <span className="text-[10px] text-amber-400">ব্যক্তিগত মিল এন্ট্রি</span>
              </label>
              <select
                value={drawerMemberUid}
                onChange={(e) => setDrawerMemberUid(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500"
              >
                {members.map((m) => (
                  <option key={m.firebaseUid} value={m.firebaseUid}>
                    {m.fullName} {m.roomNo ? `(রুম ${m.roomNo})` : ""} {m.firebaseUid === activeUserUid ? "— আপনি" : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">সদস্যের নাম:</span>
                <span className="text-xs font-bold text-slate-200">
                  {mongoUser?.fullName || members[0]?.fullName || "ব্যবহারকারী"}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                ব্যক্তিগত মিল
              </span>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">তারিখ</label>
            <input
              type="date"
              value={drawerDate}
              onChange={(e) => setDrawerDate(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-english focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quick Preset Buttons (1-1-1 / Off) */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-xs text-slate-400 font-semibold">দ্রুত নির্বাচন:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => { setDrawerB(1); setDrawerL(1); setDrawerD(1); }}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 active:scale-95 transition-all"
              >
                ১-১-১ (ফুল মিল)
              </button>
              <button
                type="button"
                onClick={() => { setDrawerB(0); setDrawerL(0); setDrawerD(0); }}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 active:scale-95 transition-all"
              >
                ০-০-০ (মিল বন্ধ)
              </button>
            </div>
          </div>

          {/* Steppers for Breakfast, Lunch, Dinner */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3">
            <StepperControl
              label="সকাল"
              value={drawerB}
              step={0.5}
              onChange={(v) => setDrawerB(v)}
            />
            <StepperControl
              label="দুপুর"
              value={drawerL}
              step={1}
              onChange={(v) => setDrawerL(v)}
            />
            <StepperControl
              label="রাত"
              value={drawerD}
              step={1}
              onChange={(v) => setDrawerD(v)}
            />
          </div>

          {/* Total Meals Counter */}
          <div className="flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <span className="text-xs text-slate-300 font-semibold">দৈনিক মোট মিল:</span>
            <span className="text-sm font-bold text-amber-300 font-english">
              {toBengaliNumeral(drawerB + drawerL + drawerD)} টি
            </span>
          </div>

          {/* Success Toast */}
          {mealSuccessToast && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-in fade-in">
              {mealSuccessToast}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={savingMeal}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-bengali shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {savingMeal ? "সংরক্ষণ হচ্ছে..." : "✓ মিল সেভ করুন (Save Meal)"}
          </button>
        </form>
      </BottomDrawer>

      {/* Quick Add Bazaar Drawer */}
      <AddBazaarDrawer
        isOpen={showBazaarDrawer}
        onClose={() => setShowBazaarDrawer(false)}
        members={members}
        onAdd={addBazaarEntry}
      />

      {/* Quick Add Deposit Drawer */}
      <BottomDrawer
        isOpen={showDepositDrawer}
        onClose={() => setShowDepositDrawer(false)}
        title="মেসে টাকা জমা দিন"
      >
        <form onSubmit={handleQuickDeposit} className="space-y-3.5">
          <div>
            <label className="text-xs text-slate-400 font-bengali block mb-1">
              জমার পরিমাণ (৳)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={depAmount}
              onChange={(e) => setDepAmount(e.target.value)}
              required
              min="10"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bengali block mb-1">
              পরিশোধের মাধ্যম
            </label>
            <select
              value={depMethod}
              onChange={(e) => setDepMethod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
            >
              <option value="bKash">bKash (বিকাশ)</option>
              <option value="Nagad">Nagad (নগদ)</option>
              <option value="Rocket">Rocket (রকেট)</option>
              <option value="Cash">Cash (ক্যাশ টাকা)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bengali block mb-1">
              ট্রানজেকশন আইডি (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="e.g. BKH98273611"
              value={depTrx}
              onChange={(e) => setDepTrx(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold font-bengali shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
          >
            টাকা জমা নিশ্চিত করুন
          </button>
        </form>
      </BottomDrawer>

      {/* Sticky Bottom Thumb Navigation */}
      <MobileBottomNav />
    </div>
  );
}

