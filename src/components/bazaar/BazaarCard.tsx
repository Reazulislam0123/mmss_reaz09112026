import React from "react";
import GlassCard from "../ui/GlassCard";
import Badge from "../ui/Badge";
import { formatTaka, toBengaliNumeral, getDayOfWeekBengali, formatMonthBengali } from "../../utils/formatters";
import { Trash2 } from "lucide-react";

interface BazaarCardProps {
  id?: string;
  date: string;
  itemDetails: string;
  category?: string;
  cost: number;
  paidByName: string;
  onDelete?: () => void;
  canDelete?: boolean;
}

export const BazaarCard: React.FC<BazaarCardProps> = ({
  date,
  itemDetails,
  category = "Grocery/মুদি",
  cost,
  paidByName,
  onDelete,
  canDelete = false,
}) => {
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

  return (
    <GlassCard className="p-3.5">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={getCategoryVariant(category)}>{category.split("/")[1] || category}</Badge>
          <span className="text-[11px] text-slate-400 font-bengali">
            {dayBn} {monthBnShort} ({dayOfWeekBn})
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-base font-bold text-amber-400 font-english">
            {formatTaka(cost, true)}
          </span>
        </div>
      </div>

      <p className="text-sm font-medium text-slate-200 font-bengali line-clamp-2 mb-2">
        {itemDetails}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
        <span className="font-bengali">
          পরিশোধকারী: <span className="text-slate-300 font-medium">{paidByName}</span>
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

