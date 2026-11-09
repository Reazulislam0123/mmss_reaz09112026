"use client";

import React from "react";
import { formatTaka } from "../../utils/formatters";
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, AlertCircle } from "lucide-react";

interface BalanceAlertBannerProps {
  netBalance: number;
  memberName: string;
}

export const BalanceAlertBanner: React.FC<BalanceAlertBannerProps> = ({
  netBalance,
  memberName,
}) => {
  const isRefund = netBalance >= 0;
  const absAmount = Math.abs(netBalance);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-4 border transition-all ${
        isRefund
          ? "bg-gradient-to-br from-emerald-950/70 via-slate-900/80 to-slate-950 border-emerald-500/40 shadow-emerald-950/40 shadow-lg"
          : "bg-gradient-to-br from-rose-950/70 via-slate-900/80 to-slate-950 border-rose-500/40 shadow-rose-950/40 shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isRefund
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/20 text-rose-400 border-rose-500/30"
            }`}
          >
            {isRefund ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bengali">
              {memberName} এর চলতি ব্যালেন্স
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span
                className={`text-2xl font-black font-english tracking-tight ${
                  isRefund ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {formatTaka(absAmount, true)}
              </span>
              <span
                className={`text-xs font-bold font-bengali px-2 py-0.5 rounded-full ${
                  isRefund
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {isRefund ? "পাবে (Refund)" : "বকেয়া (Due)"}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          {isRefund ? (
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
              <span>অগ্রিম জমা</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
              <span>পরিশোধ করতে হবে</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceAlertBanner;

