"use client";

import React, { useState } from "react";
import { Plus, Utensils, ShoppingCart, Wallet, X } from "lucide-react";

interface QuickActionFabProps {
  onAddMeal: () => void;
  onAddBazaar: () => void;
  onAddDeposit: () => void;
}

export const QuickActionFab: React.FC<QuickActionFabProps> = ({
  onAddMeal,
  onAddBazaar,
  onAddDeposit,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end">
      {/* Quick Action Options */}
      {isOpen && (
        <div className="flex flex-col gap-2.5 mb-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => {
              setIsOpen(false);
              onAddMeal();
            }}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-200 px-3.5 py-2.5 rounded-2xl shadow-xl active:scale-95 transition-transform"
          >
            <span className="text-xs font-bengali font-medium">আজকের মিল</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onAddBazaar();
            }}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-200 px-3.5 py-2.5 rounded-2xl shadow-xl active:scale-95 transition-transform"
          >
            <span className="text-xs font-bengali font-medium">বাজার খরচ</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onAddDeposit();
            }}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-200 px-3.5 py-2.5 rounded-2xl shadow-xl active:scale-95 transition-transform"
          >
            <span className="text-xs font-bengali font-medium">টাকা জমা</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="দ্রুত অ্যাকশন"
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95 transition-all duration-200"
      >
        {isOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Plus className="w-6 h-6 stroke-[2.5]" />}
      </button>
    </div>
  );
};

export default QuickActionFab;

