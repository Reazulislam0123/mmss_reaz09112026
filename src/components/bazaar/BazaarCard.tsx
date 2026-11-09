import React, { useState } from "react";
import GlassCard from "../ui/GlassCard";
import Badge from "../ui/Badge";
import { formatTaka, toBengaliNumeral, getDayOfWeekBengali, formatMonthBengali } from "../../utils/formatters";
import { Trash2, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";

interface BazaarCardProps {
  id?: string;
  date: string;
  itemDetails: string;
  category?: string;
  cost: number;
  paidByName: string;
  items?: { name: string; cost: number }[];
  onDelete?: () => void;
  canDelete?: boolean;
}

export const BazaarCard: React.FC<BazaarCardProps> = ({
  date,
  itemDetails,
  category = "Grocery/মুদি",
  cost,
  paidByName,
  items,
  onDelete,
  canDelete = false,
}) => {
  const [showItemized, setShowItemized] = useState(true);

  const getCategoryVariant = (cat: string) => {
    if (cat.includes("Meat") || cat.includes("মাংস")) return "rose";
    if (cat.includes("Vegetable") || cat.includes("সবজি")) return "emerald";
    if (cat.includes("Spices") || cat.includes("মসলা")) return "amber";
    return "indigo";
  };

  const parts = date.split("-");
  const dayBn = toBengaliNumeral(parts[2] || "০১");
  const monthBnShort = formatMonthBengali(date.slice(0, 7), true);
  const dayOfWeekBn = getDayOfWeekBengali(date);

  const hasIndividualItems = items && items.length > 0;

  return (
    <GlassCard className="p-3.5 space-y-2.5">
      {/* Header: Category Badge, Date, Total Cost */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={getCategoryVariant(category)}>{category.split("/")[1] || category}</Badge>
          <span className="text-[11px] text-slate-400 font-bengali">
            {dayBn} {monthBnShort} ({dayOfWeekBn})
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-base font-bold text-emerald-400 font-english">
            {formatTaka(cost, true)}
          </span>
        </div>
      </div>

      {/* Itemized Menu List with Individual Cost */}
      {hasIndividualItems ? (
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 space-y-1.5 font-bengali">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold border-b border-slate-850 pb-1">
            <span className="flex items-center gap-1 text-slate-300">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>আইটেম তালিকা ({items.length}টি)</span>
            </span>
            <button
              onClick={() => setShowItemized(!showItemized)}
              className="text-[10px] text-amber-400 flex items-center gap-0.5 hover:underline"
            >
              <span>{showItemized ? "লুকান" : "দেখুন"}</span>
              {showItemized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showItemized && (
            <div className="space-y-1 pt-0.5">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-slate-200">
                  <span className="truncate pr-2 font-medium">• {it.name}</span>
                  <span className="font-bold text-amber-300 font-english shrink-0">
                    ৳ {it.cost}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm font-medium text-slate-200 font-bengali line-clamp-2">
          {itemDetails}
        </p>
      )}

      {/* Footer: Payer & Delete */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
        <span className="font-bengali">
          টাকা দিয়েছেন: <span className="text-slate-300 font-semibold">{paidByName}</span>
        </span>
        {canDelete && onDelete && (
          <button
            onClick={onDelete}
            className="text-slate-500 hover:text-rose-400 p-1 active:scale-90 transition-transform"
            title="মুছুন"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </GlassCard>
  );
};

export default BazaarCard;
