"use client";

import React, { useState } from "react";
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
import { Utensils, ShoppingCart, Coins, Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { mongoUser } = useAuth();
  const {
    members,
    meals,
    bazaars,
    deposits,
    summary,
    memberStatements,
    addMealEntry,
    addBazaarEntry,
    addDepositEntry,
  } = useMess();

  const [showMealDrawer, setShowMealDrawer] = useState(false);
  const [showBazaarDrawer, setShowBazaarDrawer] = useState(false);
  const [showDepositDrawer, setShowDepositDrawer] = useState(false);

  // Quick single meal state for today
  const todayStr = getCurrentDate();
  const userTodayMeal = meals.find(
    (m) => m.date === todayStr && m.firebaseUid === mongoUser?.firebaseUid
  ) || { breakfast: 1, lunch: 1, dinner: 1, totalMeals: 3 };

  // Current user's statement
  const userStatement = memberStatements.find(
    (s) => s.firebaseUid === mongoUser?.firebaseUid
  ) || {
    fullName: mongoUser?.fullName || "সদস্য",
    netBalance: 0,
    totalMeals: 0,
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
      firebaseUid: mongoUser?.firebaseUid || "UID_01",
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

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Personal Balance Banner */}
        <BalanceAlertBanner
          netBalance={userStatement.netBalance}
          memberName={userStatement.fullName}
        />

        {/* 4-Card KPI Matrix */}
        <div className="grid grid-cols-2 gap-2.5">
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

        {/* Quick Hub Navigation Shortcuts */}
        <div className="grid grid-cols-4 gap-2 pt-1 pb-1">
          <Link
            href="/meals"
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1">
              <Utensils className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 font-bengali">মিল শিট</span>
          </Link>

          <Link
            href="/bazaar"
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 font-bengali">বাজার</span>
          </Link>

          <Link
            href="/fixed-costs"
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-1">
              <Calculator className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 font-bengali">ইউটিলিটি</span>
          </Link>

          <Link
            href="/members"
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-1">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 font-bengali">সদস্য</span>
          </Link>
        </div>

        {/* Today's Meal Quick Counter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 font-bengali">
              আজকের মিল কাউন্টার
            </h2>
            <Link
              href="/meals"
              className="text-xs text-amber-400 font-bengali flex items-center gap-1"
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
              if (mongoUser) {
                addMealEntry(todayStr, mongoUser.firebaseUid, b, l, d);
              }
            }}
          />
        </div>

        {/* Recent 3 Bazaars */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 font-bengali">
              সাম্প্রতিক বাজার খরচ
            </h2>
            <Link
              href="/bazaar"
              className="text-xs text-amber-400 font-bengali flex items-center gap-1"
            >
              <span>সকল বাজার</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {bazaars.slice(0, 3).map((b) => {
              const payer = members.find((m) => m.firebaseUid === b.paidByUid);
              return (
                <div
                  key={b._id}
                  className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between"
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
            })}
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
        title="আজকের মিল আপডেট"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 font-bengali">
            {todayStr} তারিখে আপনার মিল সংখ্যা দ্রুত সমন্বয় করুন:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <StepperControl
              label="সকাল"
              value={userTodayMeal.breakfast}
              step={0.5}
              onChange={(v) => {
                if (mongoUser) {
                  addMealEntry(
                    todayStr,
                    mongoUser.firebaseUid,
                    v,
                    userTodayMeal.lunch,
                    userTodayMeal.dinner
                  );
                }
              }}
            />
            <StepperControl
              label="দুপুর"
              value={userTodayMeal.lunch}
              step={1}
              onChange={(v) => {
                if (mongoUser) {
                  addMealEntry(
                    todayStr,
                    mongoUser.firebaseUid,
                    userTodayMeal.breakfast,
                    v,
                    userTodayMeal.dinner
                  );
                }
              }}
            />
            <StepperControl
              label="রাত"
              value={userTodayMeal.dinner}
              step={1}
              onChange={(v) => {
                if (mongoUser) {
                  addMealEntry(
                    todayStr,
                    mongoUser.firebaseUid,
                    userTodayMeal.breakfast,
                    userTodayMeal.lunch,
                    v
                  );
                }
              }}
            />
          </div>
          <button
            onClick={() => setShowMealDrawer(false)}
            className="w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold font-bengali"
          >
            সম্পন্ন
          </button>
        </div>
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

