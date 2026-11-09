"use client";

import React, { useRef } from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import MemberSettlementCard from "../../components/ledger/MemberSettlementCard";
import GlassCard from "../../components/ui/GlassCard";
import { useMess } from "../../context/MessContext";
import { formatTaka, formatMonthBengali } from "../../utils/formatters";
import { getWhatsAppShareUrl } from "../../utils/whatsapp";
import {
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  Printer,
  Download,
  Share2,
  Calendar,
  ChefHat,
  Receipt,
} from "lucide-react";

export default function LedgerPage() {
  const { currentHouse, selectedMonth, summary, memberStatements, members } = useMess();

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

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      "সদস্যের নাম",
      "রুম নম্বর",
      "মোট মিল",
      "মিল খরচ (টাকা)",
      "ইউটিলিটি ও খালা বিল (টাকা)",
      "সিট ভাড়া (টাকা)",
      "ব্যক্তিগত সমন্বয় (টাকা)",
      "মোট খরচ (টাকা)",
      "মোট জমা ও ক্রেডিট (টাকা)",
      "চূড়ান্ত ব্যালেন্স (টাকা)",
      "স্ট্যাটাস",
    ];

    const rows = memberStatements.map((stmt) => [
      `"${stmt.fullName}"`,
      `"${stmt.roomNo || "-"}"`,
      stmt.totalMeals,
      stmt.mealCost,
      stmt.sharedUtilityCost,
      stmt.customRent || 0,
      stmt.individualAdjustment || 0,
      stmt.totalExpense,
      (stmt.totalDeposits || 0) + (stmt.directBazaarPaid || 0),
      Math.abs(stmt.netBalance),
      stmt.status === "বকেয়া" ? "বকেয়া (Due)" : "পাবে (Refund)",
    ]);

    // Include UTF-8 BOM so MS Excel renders Bengali characters cleanly
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mess_ledger_${selectedMonth}_${currentHouse.joinCode || "mms"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 print:bg-white print:text-black print:pb-0">
      {/* Hide interactive navigation during print */}
      <div className="print:hidden">
        <MobileAppHeader />
      </div>

      {/* PRINT-ONLY FORMAL NOTICE BOARD VOUCHER HEADER */}
      <div className="hidden print:block p-6 text-black font-bengali">
        <div className="text-center border-b-2 border-black pb-3 mb-4">
          <h1 className="text-2xl font-black tracking-tight">{currentHouse.name}</h1>
          {currentHouse.address && <p className="text-xs text-gray-600 mt-0.5">{currentHouse.address}</p>}
          <div className="flex justify-center items-center gap-4 text-xs font-bold mt-1 text-gray-800">
            <span>মেস কোড: {currentHouse.joinCode}</span>
            <span>•</span>
            <span>হিসাবের মাস: {formatMonthBengali(selectedMonth)}</span>
            <span>•</span>
            <span>তারিখ: {new Date().toLocaleDateString("bn-BD")}</span>
          </div>
        </div>

        {/* Print KPI Summary Strip */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs border border-gray-400 p-2 bg-gray-50">
          <div>
            <span className="block text-gray-600">মোট বাজার খরচ:</span>
            <strong className="text-sm">৳ {summary.totalBazaarExpense}</strong>
          </div>
          <div>
            <span className="block text-gray-600">মোট মিল সংখ্যা:</span>
            <strong className="text-sm">{summary.totalHouseMeals} টি</strong>
          </div>
          <div>
            <span className="block text-gray-600">চলতি মিল রেট:</span>
            <strong className="text-sm">৳ {summary.activeMealRate}</strong>
          </div>
          <div>
            <span className="block text-gray-600">মাথাপিছু ইউটিলিটি:</span>
            <strong className="text-sm">৳ {summary.utilityPerHead}</strong>
          </div>
        </div>

        {/* Print Table */}
        <table className="w-full border-collapse border border-black text-xs text-left mb-8">
          <thead>
            <tr className="bg-gray-200 text-black border-b border-black">
              <th className="border border-black p-1.5">ক্র.</th>
              <th className="border border-black p-1.5">সদস্যের নাম</th>
              <th className="border border-black p-1.5">রুম</th>
              <th className="border border-black p-1.5 text-center">মিল</th>
              <th className="border border-black p-1.5 text-right">মিল খরচ</th>
              <th className="border border-black p-1.5 text-right">ইউটিলিটি</th>
              <th className="border border-black p-1.5 text-right">সিট ভাড়া</th>
              <th className="border border-black p-1.5 text-right">মোট খরচ</th>
              <th className="border border-black p-1.5 text-right">মোট জমা/ক্রেডিট</th>
              <th className="border border-black p-1.5 text-right">ব্যালেন্স</th>
              <th className="border border-black p-1.5 text-center">মন্তব্য</th>
            </tr>
          </thead>
          <tbody>
            {memberStatements.map((stmt, idx) => (
              <tr key={stmt.firebaseUid} className="border-b border-gray-400">
                <td className="border border-black p-1.5">{idx + 1}</td>
                <td className="border border-black p-1.5 font-bold">{stmt.fullName}</td>
                <td className="border border-black p-1.5">{stmt.roomNo || "-"}</td>
                <td className="border border-black p-1.5 text-center">{stmt.totalMeals}</td>
                <td className="border border-black p-1.5 text-right">৳ {stmt.mealCost}</td>
                <td className="border border-black p-1.5 text-right">৳ {stmt.sharedUtilityCost}</td>
                <td className="border border-black p-1.5 text-right">৳ {stmt.customRent || 0}</td>
                <td className="border border-black p-1.5 text-right font-semibold">৳ {stmt.totalExpense}</td>
                <td className="border border-black p-1.5 text-right font-semibold">
                  ৳ {(stmt.totalDeposits || 0) + (stmt.directBazaarPaid || 0)}
                </td>
                <td className="border border-black p-1.5 text-right font-black">
                  ৳ {Math.abs(stmt.netBalance)}
                </td>
                <td className="border border-black p-1.5 text-center font-bold">
                  {stmt.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Print Signatures */}
        <div className="flex justify-between items-end pt-12 text-xs font-bold">
          <div className="text-center">
            <div className="w-40 border-t border-black mb-1"></div>
            <span>মেস ম্যানেজারের স্বাক্ষর</span>
          </div>
          <div className="text-center">
            <div className="w-40 border-t border-black mb-1"></div>
            <span>অডিটর / সদস্য প্রতিনিধি স্বাক্ষর</span>
          </div>
        </div>
      </div>

      {/* SCREEN VIEW (Mobile & Desktop) */}
      <main className="max-w-md md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6 pb-28 md:pb-12 print:hidden font-bengali">
        {/* Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-400" />
              <span>মাসিক ফাইনাল লেজার ও অডিট শিট</span>
            </h1>
            <span className="text-xs text-slate-400">
              হিসাবের মাস:{" "}
              <strong className="text-amber-400 font-semibold">
                {formatMonthBengali(selectedMonth)}
              </strong>
            </span>
          </div>

          {/* Print & CSV Export Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all shadow-sm"
              title="মেসের নোটিশ বোর্ডের জন্য প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>প্রিন্ট শিট</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all shadow-sm"
              title="এক্সেল বা সিএসভি ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Excel ডাউনলোড</span>
            </button>
          </div>
        </div>

        {/* Master Mess Balance Overview */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <GlassCard className="p-3.5 sm:p-4 border-rose-500/30 bg-rose-950/20">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold mb-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>মেসের মোট পাওনা</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-400 font-english">
              {formatTaka(summary.totalMessDue, true)}
            </div>
            <span className="text-[11px] text-slate-400">
              সদস্যদের কাছ থেকে বকেয়া আদায়যোগ্য
            </span>
          </GlassCard>

          <GlassCard className="p-3.5 sm:p-4 border-emerald-500/30 bg-emerald-950/20">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
              <ArrowDownLeft className="w-4 h-4" />
              <span>মেসের মোট দেনা</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-english">
              {formatTaka(summary.totalMessPayable, true)}
            </div>
            <span className="text-[11px] text-slate-400">
              সদস্যদের ফেরতযোগ্য উদ্বৃত্ত টাকা
            </span>
          </GlassCard>
        </div>

        {/* 4-KPI Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-slate-400 block text-[11px]">মোট মিল:</span>
            <span className="text-slate-100 font-bold font-english text-sm">
              {summary.totalHouseMeals} টি
            </span>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-slate-400 block text-[11px]">মোট বাজার:</span>
            <span className="text-slate-100 font-bold font-english text-sm">
              {formatTaka(summary.totalBazaarExpense, true)}
            </span>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-slate-400 block text-[11px]">চলতি মিল রেট:</span>
            <span className="text-amber-400 font-bold font-english text-sm">
              {formatTaka(summary.activeMealRate, true)}
            </span>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-slate-400 block text-[11px]">মাথাপিছু ইউটিলিটি:</span>
            <span className="text-slate-100 font-bold font-english text-sm">
              {formatTaka(summary.utilityPerHead, true)}
            </span>
          </div>
        </div>

        {/* Member-by-Member Settlement Cards (Responsive Grid on Desktop) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300">
              সদস্যভিত্তিক চূড়ান্ত হিসাব তালিকা ({memberStatements.length} জন)
            </h2>
            <span className="text-[11px] text-slate-400">
              WhatsApp এ রশিদ পাঠানো যাবে
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {memberStatements.map((stmt) => (
              <MemberSettlementCard
                key={stmt.firebaseUid}
                statement={stmt}
                onWhatsAppShare={() => handleShare(stmt)}
              />
            ))}
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
