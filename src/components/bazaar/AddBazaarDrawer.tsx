"use client";

import React, { useState } from "react";
import BottomDrawer from "../ui/BottomDrawer";
import { IMemberProfile, IBazaarRecord } from "../../lib/calculations";
import { getCurrentDate } from "../../utils/formatters";

interface AddBazaarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  members: IMemberProfile[];
  onAdd: (entry: Omit<IBazaarRecord, "_id">) => Promise<void>;
}

export const AddBazaarDrawer: React.FC<AddBazaarDrawerProps> = ({
  isOpen,
  onClose,
  members,
  onAdd,
}) => {
  const [date, setDate] = useState(getCurrentDate());
  const [itemDetails, setItemDetails] = useState("");
  const [category, setCategory] = useState("Grocery/মুদি");
  const [cost, setCost] = useState("");
  const [paidByUid, setPaidByUid] = useState(members[0]?.firebaseUid || "MESS_FUND");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Grocery/মুদি",
    "Meat-Fish/মাছ-মাংস",
    "Vegetables/সবজি",
    "Spices/তেল-মসলা",
    "Snacks/অন্যান্য",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemDetails || !cost) return;

    setLoading(true);
    try {
      await onAdd({
        date,
        itemDetails,
        category,
        cost: Number(cost),
        paidByUid,
      });
      setItemDetails("");
      setCost("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="নতুন বাজার খরচ যোগ করুন">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="text-xs text-slate-400 font-bengali block mb-1">তারিখ</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-bengali block mb-1">বাজারের বিবরণ</label>
          <input
            type="text"
            placeholder="যেমন: মিনিকেট চাল ২৫ কেজি, মুরগি ২ কেজি..."
            value={itemDetails}
            onChange={(e) => setItemDetails(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-bengali placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 font-bengali block mb-1">ক্যাটাগরি</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-bengali focus:outline-none focus:border-amber-500/50"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.split("/")[1]} ({c.split("/")[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bengali block mb-1">মোট খরচ (৳)</label>
            <input
              type="number"
              placeholder="0.00"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              min="1"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-bengali block mb-1">টাকা কে দিয়েছেন?</label>
          <select
            value={paidByUid}
            onChange={(e) => setPaidByUid(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-bengali focus:outline-none focus:border-amber-500/50"
          >
            <option value="MESS_FUND">মেস ফান্ড (জমা তহবিল থেকে)</option>
            {members.map((m) => (
              <option key={m.firebaseUid} value={m.firebaseUid}>
                {m.fullName} (ব্যক্তিগত পকেট থেকে)
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold font-bengali shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "যোগ হচ্ছে..." : "বাজার খরচ সেভ করুন"}
        </button>
      </form>
    </BottomDrawer>
  );
};

export default AddBazaarDrawer;

