"use client";

import React, { useState, useEffect } from "react";
import BottomDrawer from "../ui/BottomDrawer";
import { IMemberProfile, IBazaarRecord } from "../../lib/calculations";
import { getCurrentDate, formatTaka } from "../../utils/formatters";
import { Plus, Trash2, ShoppingBag, Receipt, DollarSign, Calendar, Tag, User } from "lucide-react";

interface AddBazaarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  members: IMemberProfile[];
  onAdd: (entry: Omit<IBazaarRecord, "_id">) => Promise<void>;
}

interface IBazaarItemRow {
  id: string;
  name: string;
  cost: string;
}

export const AddBazaarDrawer: React.FC<AddBazaarDrawerProps> = ({
  isOpen,
  onClose,
  members,
  onAdd,
}) => {
  const [date, setDate] = useState(getCurrentDate());
  const [category, setCategory] = useState("Grocery/মুদি");
  const [paidByUid, setPaidByUid] = useState(members[0]?.firebaseUid || "MESS_FUND");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((!paidByUid || paidByUid === "MESS_FUND") && members.length > 0 && !paidByUid) {
      setPaidByUid(members[0].firebaseUid);
    }
  }, [members, paidByUid]);

  // Dynamic Itemized List with Individual Cost
  const [items, setItems] = useState<IBazaarItemRow[]>([
    { id: "1", name: "", cost: "" },
  ]);

  // Optional manual cost override (if user wants to add transport or round up)
  const [manualCost, setManualCost] = useState<string>("");

  const categories = [
    "Grocery/মুদি",
    "Meat-Fish/মাছ-মাংস",
    "Vegetables/সবজি",
    "Spices/তেল-মসলা",
    "Snacks/অন্যান্য",
  ];

  // Auto-calculate sum from individual items
  const autoSum = items.reduce((sum, it) => sum + (Number(it.cost) || 0), 0);
  const effectiveCost = manualCost ? Number(manualCost) : autoSum;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), name: "", cost: "" },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      setItems([{ id: "1", name: "", cost: "" }]);
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleItemChange = (id: string, field: "name" | "cost", val: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: val } : it))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter valid items
    const validItems = items
      .map((it) => ({
        name: it.name.trim(),
        cost: Number(it.cost) || 0,
      }))
      .filter((it) => it.name.length > 0);

    if (validItems.length === 0 && !notes.trim()) {
      alert("অনুগ্রহ করে অন্তত একটি আইটেমের নাম ও খরচ লিখুন!");
      return;
    }

    if (effectiveCost <= 0) {
      alert("বাজারের মোট খরচ অবশ্যই ০ এর বেশি হতে হবে!");
      return;
    }

    // Compose formatted itemDetails text for backward compatibility and overview
    const itemSummary =
      validItems.length > 0
        ? validItems.map((it) => `${it.name} (৳${it.cost})`).join(", ")
        : notes.trim();

    const fullDetails = notes.trim() && validItems.length > 0
      ? `${itemSummary} [নোট: ${notes.trim()}]`
      : itemSummary;

    setLoading(true);
    try {
      await onAdd({
        date,
        itemDetails: fullDetails,
        category,
        cost: effectiveCost,
        paidByUid,
        items: validItems,
      });

      // Reset form
      setItems([{ id: "1", name: "", cost: "" }]);
      setManualCost("");
      setNotes("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="নতুন বাজার খরচ যোগ করুন">
      <form onSubmit={handleSubmit} className="space-y-4 font-bengali">
        {/* Date & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>তারিখ</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>ক্যাটাগরি</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.split("/")[1]} ({c.split("/")[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Individual Itemized Menu List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>আইটেমভিত্তিক বাজারের তালিকা ও দাম (Individual Menu & Cost)</span>
            </label>
            <span className="text-[10px] text-slate-400 font-english">
              {items.length} টি আইটেম
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="flex items-center gap-2 bg-slate-950/80 border border-slate-800/90 p-2 rounded-xl focus-within:border-emerald-500/50 transition-colors"
              >
                <span className="text-xs text-slate-500 font-english font-bold w-4 text-center shrink-0">
                  {idx + 1}.
                </span>

                {/* Item Name */}
                <input
                  type="text"
                  placeholder="আইটেমের নাম (যেমন: মুরগি ২ কেজি / চাল)"
                  value={it.name}
                  onChange={(e) => handleItemChange(it.id, "name", e.target.value)}
                  className="flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none font-medium min-w-0"
                />

                {/* Item Cost */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-750 px-2 py-1 rounded-lg shrink-0 w-24">
                  <span className="text-amber-400 text-xs font-bold">৳</span>
                  <input
                    type="number"
                    placeholder="খরচ"
                    value={it.cost}
                    onChange={(e) => handleItemChange(it.id, "cost", e.target.value)}
                    min="0"
                    className="w-full bg-transparent text-xs text-amber-300 font-bold font-english focus:outline-none placeholder:text-slate-600 text-right"
                  />
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(it.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 shrink-0 active:scale-90 transition-transform"
                  title="আইটেম মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add More Item Row Button */}
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-750 text-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ আরও আইটেম যোগ করুন (Add More Item)</span>
          </button>
        </div>

        {/* Total Cost Display with Auto-Sum */}
        <div className="p-3 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-300 block font-bold">মোট বাজার খরচ:</span>
            <span className="text-[10px] text-slate-400">
              {manualCost ? "ম্যানুয়াল মোট" : "স্বয়ংক্রিয় আইটেম যোগফল"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-black text-emerald-400 font-english">
              {formatTaka(effectiveCost, true)}
            </span>
            <input
              type="number"
              placeholder={String(autoSum)}
              value={manualCost}
              onChange={(e) => setManualCost(e.target.value)}
              title="যদি বাড়তি পরিবহন বা অন্যান্য খরচ যোগ করতে চান"
              className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-300 font-bold font-english text-right focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Paid By Selection */}
        <div>
          <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>টাকা কে দিয়েছেন?</span>
          </label>
          <select
            value={paidByUid}
            onChange={(e) => setPaidByUid(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
          >
            <option value="MESS_FUND">মেস ফান্ড (জমা তহবিল থেকে)</option>
            {members.map((m) => (
              <option key={m.firebaseUid} value={m.firebaseUid}>
                {m.fullName} {m.roomNo ? `(রুম ${m.roomNo})` : ""} — ব্যক্তিগত পকেট থেকে
              </option>
            ))}
          </select>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">
            অতিরিক্ত বিবরণ বা নোট (ঐচ্ছিক)
          </label>
          <input
            type="text"
            placeholder="যেমন: কারওয়ান বাজার থেকে কেনা হয়েছে..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || effectiveCost <= 0}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Receipt className="w-4 h-4" />
          <span>{loading ? "সংরক্ষণ হচ্ছে..." : "বাজার খরচ সেভ করুন"}</span>
        </button>
      </form>
    </BottomDrawer>
  );
};

export default AddBazaarDrawer;
