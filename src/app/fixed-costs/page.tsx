"use client";

import React, { useState, useEffect } from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import GlassCard from "../../components/ui/GlassCard";
import { useMess } from "../../context/MessContext";
import { formatTaka, toBengaliNumeral } from "../../utils/formatters";
import { Zap, Flame, Wifi, Users, Trash2, Home, Check, Calculator } from "lucide-react";

export default function FixedCostsPage() {
  const { currentHouse, selectedMonth, fixedCosts, members, updateFixedCosts } = useMess();

  const [rent, setRent] = useState(fixedCosts.rent || 0);
  const [electricity, setElectricity] = useState(fixedCosts.electricity || 0);
  const [gasWater, setGasWater] = useState(fixedCosts.gasWater || 0);
  const [cookBill, setCookBill] = useState(fixedCosts.cookBill || 0);
  const [wifi, setWifi] = useState(fixedCosts.wifi || 0);
  const [other, setOther] = useState(fixedCosts.other || 0);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync if context updates
  useEffect(() => {
    setRent(fixedCosts.rent || 0);
    setElectricity(fixedCosts.electricity || 0);
    setGasWater(fixedCosts.gasWater || 0);
    setCookBill(fixedCosts.cookBill || 0);
    setWifi(fixedCosts.wifi || 0);
    setOther(fixedCosts.other || 0);
  }, [fixedCosts]);

  const totalFixed =
    Number(rent || 0) +
    Number(electricity || 0) +
    Number(gasWater || 0) +
    Number(cookBill || 0) +
    Number(wifi || 0) +
    Number(other || 0);

  const activeMemberCount = members.length || 1;
  const perHeadCost = Math.round((totalFixed / activeMemberCount) * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateFixedCosts({
        rent: Number(rent),
        electricity: Number(electricity),
        gasWater: Number(gasWater),
        cookBill: Number(cookBill),
        wifi: Number(wifi),
        other: Number(other),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 font-bengali">
      <MobileAppHeader />

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100">
              ফিক্সড ও ইউটিলিটি বিল
            </h1>
            <span className="text-xs text-slate-400">
              হিসাবের মাস: <span className="font-english">{selectedMonth}</span>
            </span>
          </div>

          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
        </div>

        {/* Live Calculation Preview Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <GlassCard className="p-3.5 border-amber-500/30 bg-amber-500/5">
            <span className="text-xs text-slate-400 block mb-1">মোট ফিক্সড বিল</span>
            <div className="text-lg font-black text-amber-400 font-english">
              {formatTaka(totalFixed, true)}
            </div>
            <span className="text-[10px] text-slate-500">চলতি মাসের মোট</span>
          </GlassCard>

          <GlassCard className="p-3.5 border-emerald-500/30 bg-emerald-500/5">
            <span className="text-xs text-slate-400 block mb-1">মাথাপিছু শেয়ার</span>
            <div className="text-lg font-black text-emerald-400 font-english">
              {formatTaka(perHeadCost, true)}
            </div>
            <span className="text-[10px] text-slate-500 font-english">
              ÷ {toBengaliNumeral(activeMemberCount)} জন সদস্য
            </span>
          </GlassCard>
        </div>

        {/* Success toast banner */}
        {savedSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ইউটিলিটি বিল সফলভাবে আপডেট ও সেভ করা হয়েছে!</span>
          </div>
        )}

        {/* Fixed Costs Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <GlassCard className="p-4 space-y-3.5">
            {/* Electricity */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>বিদ্যুৎ বিল (DESCO / DPDC / NESCO)</span>
                </label>
              </div>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={electricity || ""}
                onChange={(e) => setElectricity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Gas & Water */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>গ্যাস ও পানির বিল (তিতাস / সিলিন্ডার / ওয়াসা)</span>
                </label>
              </div>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={gasWater || ""}
                onChange={(e) => setGasWater(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Cook Bill */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>কাজের খালা বেতন / বাবুর্চি বিল</span>
                </label>
              </div>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={cookBill || ""}
                onChange={(e) => setCookBill(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Wifi */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ইন্টারনেট / ওয়াইফাই বিল</span>
                </label>
              </div>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={wifi || ""}
                onChange={(e) => setWifi(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Waste & Other */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>ময়লা বিল ও অন্যান্য সাধারণ খরচ</span>
                </label>
              </div>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={other || ""}
                onChange={(e) => setOther(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Common House Rent (if split evenly) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-amber-300" />
                  <span>সার্বিক মেস বাড়ি ভাড়া (সমান ভাগে হলে)</span>
                </label>
                <span className="text-[10px] text-slate-500">ঐচ্ছিক</span>
              </div>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={rent || ""}
                onChange={(e) => setRent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </GlassCard>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? "সংরক্ষণ হচ্ছে..." : "ফিক্সড বিল সংরক্ষণ করুন"}
          </button>
        </form>
      </main>

      <MobileBottomNav />
    </div>
  );
}

