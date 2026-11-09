"use client";

import React, { useState } from "react";
import GlassCard from "../ui/GlassCard";
import { IMemberStatement } from "../../lib/calculations";
import { formatTaka, toBengaliNumeral } from "../../utils/formatters";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";

interface MemberSettlementCardProps {
  statement: IMemberStatement;
  onWhatsAppShare: () => void;
}

export const MemberSettlementCard: React.FC<MemberSettlementCardProps> = ({
  statement,
  onWhatsAppShare,
}) => {
  const [expanded, setExpanded] = useState(false);
  const isRefund = statement.netBalance >= 0;

  return (
    <GlassCard className="p-4">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-100 font-bengali text-sm sm:text-base">
              {statement.fullName}
            </span>
            <span className="text-[11px] text-slate-500 font-english">
              (রুম {statement.roomNo})
            </span>
          </div>
          <span className="text-xs text-slate-400 font-bengali">
            মোট মিল:{" "}
            <span className="font-bold text-amber-400 font-english">
              {toBengaliNumeral(statement.totalMeals)}
            </span>{" "}
            টি
          </span>
        </div>

        <div className="text-right">
          <span
            className={`text-base sm:text-lg font-black font-english ${
              isRefund ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatTaka(Math.abs(statement.netBalance), true)}
          </span>
          <span
            className={`block text-[10px] font-bold font-bengali ${
              isRefund ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isRefund ? "পাবে (Refund)" : "বকেয়া (Due)"}
          </span>
        </div>
      </div>

      {/* Expandable Breakdown */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300 font-bengali animate-in fade-in duration-200">
          <div className="flex justify-between py-0.5">
            <span className="text-slate-400">মিল বাবদ খরচ:</span>
            <span className="font-english font-medium text-slate-200">
              {formatTaka(statement.mealCost, true)}
            </span>
          </div>

          <div className="flex justify-between py-0.5">
            <span className="text-slate-400">ফিক্সড ও ইউটিলিটি বিল:</span>
            <span className="font-english font-medium text-slate-200">
              {formatTaka(statement.sharedUtilityCost, true)}
            </span>
          </div>

          {statement.customRent > 0 && (
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">রুম / সিট ভাড়া:</span>
              <span className="font-english font-medium text-slate-200">
                {formatTaka(statement.customRent, true)}
              </span>
            </div>
          )}

          {statement.individualAdjustment !== 0 && (
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">পূর্বের বকেয়া / সমন্বয়:</span>
              <span className="font-english font-medium text-slate-200">
                {formatTaka(statement.individualAdjustment, true)}
              </span>
            </div>
          )}

          <div className="flex justify-between py-1 border-t border-slate-800 text-slate-200 font-semibold">
            <span>সর্বমোট খরচ:</span>
            <span className="font-english font-bold">
              {formatTaka(statement.totalExpense, true)}
            </span>
          </div>

          <div className="flex justify-between py-0.5 text-emerald-400">
            <span>মোট জমা টাকা:</span>
            <span className="font-english font-medium">
              {formatTaka(statement.totalDeposits, true)}
            </span>
          </div>

          {statement.directBazaarPaid > 0 && (
            <div className="flex justify-between py-0.5 text-emerald-400">
              <span>পকেট থেকে বাজার পরিশোধ:</span>
              <span className="font-english font-medium">
                {formatTaka(statement.directBazaarPaid, true)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer Controls */}
      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 font-bengali py-1"
        >
          <span>{expanded ? "বিবরণ লুকান" : "বিস্তারিত হিসাব দেখুন"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onWhatsAppShare}
          className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-xl active:scale-95 transition-transform font-bengali"
        >
          <Share2 className="w-3 h-3" />
          <span>WhatsApp শেয়ার</span>
        </button>
      </div>
    </GlassCard>
  );
};

export default MemberSettlementCard;

