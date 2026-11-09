"use client";

import React, { useState } from "react";
import BottomDrawer from "../ui/BottomDrawer";
import { useMess } from "../../context/MessContext";
import { formatDateBengali, toBengaliNumeral } from "../../utils/formatters";
import {
  ChefHat,
  Calendar,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface MealManagerRosterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MealManagerRosterDrawer: React.FC<MealManagerRosterDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentHouse,
    members,
    dutyManagerUid,
    dutyStartDate,
    dutyEndDate,
    dutyRoster,
    handoverDutyManager,
    generateDutyRoster,
  } = useMess();

  const [selectedNewManager, setSelectedNewManager] = useState(members[0]?.firebaseUid || "");
  const [dutyDays, setDutyDays] = useState(6);
  const [handingOver, setHandingOver] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const activeManager = members.find((m) => m.firebaseUid === dutyManagerUid) || members[0];

  const handleHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewManager) return;

    setHandingOver(true);
    try {
      await handoverDutyManager(selectedNewManager, dutyDays);
      const chosen = members.find((m) => m.firebaseUid === selectedNewManager);
      setSuccessMsg(`মিল ম্যানেজারের দায়িত্ব ${chosen?.fullName}-এর কাছে হস্তান্তর করা হয়েছে!`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } finally {
      setHandingOver(false);
    }
  };

  const handleWhatsAppAnnouncement = () => {
    const text = `
📢 *মেস বিজ্ঞপ্তি: চলতি মিল ম্যানেজার দায়িত্ব হস্তান্তর*
🏠 *${currentHouse.name}*
────────────────────────
👨‍🍳 *বর্তমান দায়িত্বপ্রাপ্ত মিল ম্যানেজার:* ${activeManager.fullName} (রুম ${activeManager.roomNo})
📅 *ডিউটির মেয়াদ:* ${formatDateBengali(dutyStartDate)} থেকে ${formatDateBengali(dutyEndDate)} (${toBengaliNumeral(dutyDays)} দিন)

📌 *দায়িত্বসমূহ:*
• দৈনিক মিল এন্ট্রি ও সকাল/দুপুর/রাত মিল পরিচালনা
• বাজার খরচ সংরক্ষণ ও হিসাব রাখা

অনুগ্রহ করে সকল মেস সদস্য উনাকে সময়মতো মিল ও বাজার জানাবেন।
_Smart MMS মেস ম্যানেজার_
`.trim();

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="চলতি মিল ম্যানেজার ও ৫-৬ দিনের রোস্টার">
      <div className="space-y-4 font-bengali text-slate-100">
        {/* Active Duty Manager Spotlight Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl shadow-amber-950/30">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    চলতি দায়িত্বে (ON DUTY)
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">
                  {activeManager.fullName}
                </h3>
              </div>
            </div>

            <span className="text-xs text-slate-400 font-english shrink-0">
              রুম: {activeManager.roomNo}
            </span>
          </div>

          <div className="bg-slate-950/70 rounded-2xl p-2.5 mt-2.5 border border-slate-800/80 space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>ডিউটির সময়কাল:</span>
              </span>
              <span className="font-english font-medium">
                {dutyStartDate || "০১-১১-২০২৬"} হতে {dutyEndDate || "০৬-১১-২০২৬"}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>রোটেশন চক্র: প্রতি ৫–৬ দিন পরপর পরিবর্তন</span>
              <span className="text-emerald-400 font-bold">সক্রিয়</span>
            </div>
          </div>

          {/* WhatsApp Duty Notice Button */}
          <button
            onClick={handleWhatsAppAnnouncement}
            className="w-full mt-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>হোয়াটসঅ্যাপ মেসে গ্রুপে নোটিশ পাঠান</span>
          </button>
        </div>

        {/* Success toast message */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Quick Handover Form */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>দায়িত্ব হস্তান্তর / নতুন মিল ম্যানেজার দিন:</span>
            </h4>
          </div>

          <form onSubmit={handleHandover} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                নতুন দায়িত্ব কার কাছে দেবেন?
              </label>
              <select
                value={selectedNewManager}
                onChange={(e) => setSelectedNewManager(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/50"
              >
                {members.map((m) => (
                  <option key={m.firebaseUid} value={m.firebaseUid}>
                    {m.fullName} (রুম {m.roomNo})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  ডিউটির মেয়াদ
                </label>
                <select
                  value={dutyDays}
                  onChange={(e) => setDutyDays(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/50"
                >
                  <option value={5}>৫ দিন (5 Days)</option>
                  <option value={6}>৬ দিন (6 Days)</option>
                  <option value={7}>৭ দিন (1 Week)</option>
                  <option value={10}>১০ দিন (10 Days)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={handingOver}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {handingOver ? "পরিবর্তন হচ্ছে..." : "হস্তান্তর সম্পন্ন করুন"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Monthly Rotation Schedule (ডিউটি রোস্টার) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>চলতি মাসের ৫-৬ দিনের পালাবদল শিডিউল:</span>
            </h4>
            <button
              onClick={() => generateDutyRoster(6)}
              className="text-[10px] text-amber-400 hover:underline"
            >
              পুনরায় রোস্টার সাজান
            </button>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {dutyRoster.map((shift, idx) => {
              const isActive = shift.status === "active";
              const isCompleted = shift.status === "completed";

              return (
                <div
                  key={`${shift.firebaseUid}-${idx}`}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isActive
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-200 font-semibold"
                      : isCompleted
                      ? "bg-slate-900/40 border-slate-800/60 text-slate-500"
                      : "bg-slate-900/80 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-english text-[11px] w-5 text-slate-500">
                      #{toBengaliNumeral(idx + 1)}
                    </span>
                    <div>
                      <span>{shift.name}</span>
                      <div className="text-[10px] text-slate-400 font-english">
                        {shift.startDate.split("-").slice(1).join("/")} হতে{" "}
                        {shift.endDate.split("-").slice(1).join("/")} ({toBengaliNumeral(shift.daysCount)} দিন)
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-black animate-pulse"
                        : isCompleted
                        ? "bg-slate-800 text-slate-500"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isActive ? "চলতি পালা 🔥" : isCompleted ? "সম্পন্ন" : "আসন্ন"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BottomDrawer>
  );
};

export default MealManagerRosterDrawer;

