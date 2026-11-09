import React from "react";
import GlassCard from "../ui/GlassCard";
import { formatTaka } from "../../utils/formatters";
import { Receipt, CheckCircle } from "lucide-react";

interface DepositCardProps {
  id?: string;
  date: string;
  memberName: string;
  amount: number;
  paymentMethod: string;
  trxId?: string;
  notes?: string;
  onViewVoucher?: () => void;
}

export const DepositCard: React.FC<DepositCardProps> = ({
  date,
  memberName,
  amount,
  paymentMethod,
  trxId,
  notes,
  onViewVoucher,
}) => {
  const getMethodBadge = (method: string) => {
    switch (method.toLowerCase()) {
      case "bkash":
        return "bg-pink-500/15 text-pink-400 border-pink-500/30";
      case "nagad":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      case "rocket":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <GlassCard className="p-3.5">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <span className="text-sm font-semibold text-slate-100 font-bengali block">
            {memberName}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getMethodBadge(
                paymentMethod
              )}`}
            >
              {paymentMethod}
            </span>
            <span className="text-[11px] text-slate-500 font-english">{date}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-bold text-emerald-400 font-english">
            {formatTaka(amount, true)}
          </span>
          <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-500 mt-0.5 font-bengali">
            <CheckCircle className="w-3 h-3" />
            <span>অনুমোদিত</span>
          </div>
        </div>
      </div>

      {(trxId || notes) && (
        <div className="bg-slate-950/60 rounded-xl p-2 my-2 text-xs text-slate-400">
          {trxId && (
            <div className="font-mono text-[11px] text-slate-300">TrxID: {trxId}</div>
          )}
          {notes && <div className="font-bengali text-slate-400 mt-0.5">{notes}</div>}
        </div>
      )}

      {onViewVoucher && (
        <div className="border-t border-slate-800/80 pt-2 flex justify-end">
          <button
            onClick={onViewVoucher}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 active:scale-95 transition-transform font-bengali"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>মানি রসিদ দেখুন</span>
          </button>
        </div>
      )}
    </GlassCard>
  );
};

export default DepositCard;

