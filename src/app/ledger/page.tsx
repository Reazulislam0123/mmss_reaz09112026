"use client";

import React from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import MemberSettlementCard from "../../components/ledger/MemberSettlementCard";
import GlassCard from "../../components/ui/GlassCard";
import { useMess } from "../../context/MessContext";
import { formatTaka, formatMonthBengali } from "../../utils/formatters";
import { getWhatsAppShareUrl } from "../../utils/whatsapp";
import { FileSpreadsheet, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function LedgerPage() {
  const { currentHouse, selectedMonth, summary, memberStatements } = useMess();

  const handleShare = (statement: any) => {
    const url = getWhatsAppShareUrl(
      undefined,
      statement,
      currentHouse.name,
      selectedMonth,
      summary.activeMealRate
    );
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <MobileAppHeader />

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100 font-bengali">
              মাসিক ফাইনাল লেজার
            </h1>
            <span className="text-xs text-slate-400 font-bengali">
              মাস: <span className="font-bengali font-semibold text-amber-400">{formatMonthBengali(selectedMonth)}</span>
            </span>
          </div>

          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        </div>

        {/* Master Mess Balance Overview */}
        <div className="grid grid-cols-2 gap-2.5">
          <GlassCard className="p-3.5 border-rose-500/30 bg-rose-950/20">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bengali mb-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>মেসের মোট পাওনা</span>
            </div>
            <div className="text-lg font-black text-rose-400 font-english">
              {formatTaka(summary.totalMessDue, true)}
            </div>
            <span className="text-[10px] text-slate-500 font-bengali">
              সদস্যদের বকেয়া
            </span>
          </GlassCard>

          <GlassCard className="p-3.5 border-emerald-500/30 bg-emerald-950/20">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bengali mb-1">
              <ArrowDownLeft className="w-4 h-4" />
              <span>মেসের মোট দেনা</span>
            </div>
            <div className="text-lg font-black text-emerald-400 font-english">
              {formatTaka(summary.totalMessPayable, true)}
            </div>
            <span className="text-[10px] text-slate-500 font-bengali">
              সদস্যদের ফেরতযোগ্য
            </span>
          </GlassCard>
        </div>

        {/* Member-by-Member Settlement Cards */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-300 font-bengali">
            সদস্যভিত্তিক চূড়ান্ত হিসাব তালিকা
          </h2>

          {memberStatements.map((stmt) => (
            <MemberSettlementCard
              key={stmt.firebaseUid}
              statement={stmt}
              onWhatsAppShare={() => handleShare(stmt)}
            />
          ))}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

