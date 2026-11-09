"use client";

import React, { useState } from "react";
import BottomDrawer from "../ui/BottomDrawer";
import StepperControl from "../ui/StepperControl";
import { IMemberProfile } from "../../lib/calculations";
import { getCurrentDate } from "../../utils/formatters";

interface BulkMealSheetProps {
  isOpen: boolean;
  onClose: () => void;
  members: IMemberProfile[];
  onSave: (date: string, entries: { uid: string; b: number; l: number; d: number }[]) => Promise<void>;
}

export const BulkMealSheet: React.FC<BulkMealSheetProps> = ({
  isOpen,
  onClose,
  members,
  onSave,
}) => {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [memberEntries, setMemberEntries] = useState<{ [uid: string]: { b: number; l: number; d: number } }>(
    () => {
      const init: any = {};
      members.forEach((m) => {
        init[m.firebaseUid] = { b: 1, l: 1, d: 1 };
      });
      return init;
    }
  );
  const [saving, setSaving] = useState(false);

  const handleUpdate = (uid: string, field: "b" | "l" | "d", val: number) => {
    setMemberEntries((prev) => ({
      ...prev,
      [uid]: {
        ...(prev[uid] || { b: 1, l: 1, d: 1 }),
        [field]: val,
      },
    }));
  };

  const handleBatchSave = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(memberEntries).map(([uid, vals]) => ({
        uid,
        b: vals.b,
        l: vals.l,
        d: vals.d,
      }));
      await onSave(selectedDate, payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="সকল সদস্যের দৈনিক মিল এন্ট্রি">
      <div className="space-y-4">
        {/* Date picker */}
        <div>
          <label className="text-xs text-slate-400 font-bengali block mb-1">তারিখ নির্বাচন করুন</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Member list */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {members.map((m) => {
            const vals = memberEntries[m.firebaseUid] || { b: 1, l: 1, d: 1 };
            return (
              <div key={m.firebaseUid} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-200 font-bengali">
                    {m.fullName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-english">
                    রুম: {m.roomNo}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <StepperControl
                    label="সকাল"
                    value={vals.b}
                    step={0.5}
                    onChange={(v) => handleUpdate(m.firebaseUid, "b", v)}
                  />
                  <StepperControl
                    label="দুপুর"
                    value={vals.l}
                    step={1}
                    onChange={(v) => handleUpdate(m.firebaseUid, "l", v)}
                  />
                  <StepperControl
                    label="রাত"
                    value={vals.d}
                    step={1}
                    onChange={(v) => handleUpdate(m.firebaseUid, "d", v)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <button
          onClick={handleBatchSave}
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold font-bengali shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "একসাথে মিল সেভ করুন"}
        </button>
      </div>
    </BottomDrawer>
  );
};

export default BulkMealSheet;

