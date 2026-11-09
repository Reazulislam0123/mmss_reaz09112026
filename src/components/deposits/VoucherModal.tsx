"use client";

import React from "react";
import BottomDrawer from "../ui/BottomDrawer";
import { formatTaka } from "../../utils/formatters";
import { Printer, CheckCircle2 } from "lucide-react";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  deposit: {
    _id?: string;
    date: string;
    amount: number;
    paymentMethod: string;
    trxId?: string;
    notes?: string;
    memberName: string;
  } | null;
  houseName: string;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  onClose,
  deposit,
  houseName,
}) => {
  if (!deposit) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="টাকা জমার অফিসিয়াল রসিদ">
      <div className="space-y-4">
        {/* Printable Voucher Paper Card */}
        <div className="bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-slate-100 shadow-inner relative overflow-hidden font-bengali">
          {/* Watermark stamp */}
          <div className="absolute right-2 bottom-2 opacity-5 pointer-events-none text-6xl font-black rotate-12">
            PAID
          </div>

          <div className="text-center border-b border-dashed border-slate-800 pb-3 mb-3">
            <h4 className="text-base font-bold text-amber-400">{houseName}</h4>
            <span className="text-[11px] text-slate-400">মানি রিসিপ্ট / মানি ভাউচার</span>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              ভাউচার নং: {deposit._id || `VCH-${Date.now().toString(36).toUpperCase()}`}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">তারিখ:</span>
              <span className="font-english font-medium text-slate-200">{deposit.date}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">সদস্যের নাম:</span>
              <span className="font-bold text-slate-100">{deposit.memberName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">পরিশোধের মাধ্যম:</span>
              <span className="font-medium text-slate-200">{deposit.paymentMethod}</span>
            </div>

            {deposit.trxId && (
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">ট্রানজেকশন আইডি:</span>
                <span className="font-mono text-slate-300">{deposit.trxId}</span>
              </div>
            )}

            <div className="flex justify-between py-2 border-t border-slate-700 mt-2">
              <span className="text-sm font-bold text-slate-200">জমার পরিমাণ:</span>
              <span className="text-base font-black text-emerald-400 font-english">
                {formatTaka(deposit.amount, true)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>যাচাইকৃত ও অনুমোদিত</span>
            </div>
            <div className="text-right text-[10px] text-slate-500">
              সিলমোহর ও স্বাক্ষর
            </div>
          </div>
        </div>

        {/* Print Action */}
        <button
          onClick={handlePrint}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold font-bengali flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Printer className="w-4 h-4" />
          <span>রসিদ প্রিন্ট / PDF সংরক্ষণ করুন</span>
        </button>
      </div>
    </BottomDrawer>
  );
};

export default VoucherModal;

