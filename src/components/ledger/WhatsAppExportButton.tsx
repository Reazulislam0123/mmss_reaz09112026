"use client";

import React from "react";
import { MessageSquareShare } from "lucide-react";
import { IMemberStatement } from "../../lib/calculations";
import { getWhatsAppShareUrl } from "../../utils/whatsapp";

interface WhatsAppExportButtonProps {
  statement: IMemberStatement;
  houseName: string;
  month: string;
  mealRate: number;
  phone?: string;
}

export const WhatsAppExportButton: React.FC<WhatsAppExportButtonProps> = ({
  statement,
  houseName,
  month,
  mealRate,
  phone,
}) => {
  const handleShare = () => {
    const url = getWhatsAppShareUrl(phone, statement, houseName, month, mealRate);
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl shadow-md shadow-emerald-950/40 text-xs font-bengali active:scale-95 transition-all"
    >
      <MessageSquareShare className="w-3.5 h-3.5" />
      <span>হোয়াটসঅ্যাপে পাঠান</span>
    </button>
  );
};

export default WhatsAppExportButton;

