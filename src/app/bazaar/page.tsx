"use client";

import React, { useState } from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import BazaarCard from "../../components/bazaar/BazaarCard";
import AddBazaarDrawer from "../../components/bazaar/AddBazaarDrawer";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import { formatTaka } from "../../utils/formatters";
import { Plus, Filter } from "lucide-react";

export default function BazaarPage() {
  const { mongoUser } = useAuth();
  const { members, bazaars, addBazaarEntry, deleteBazaarEntry } = useMess();
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { key: "all", label: "সবগুলো" },
    { key: "Meat", label: "মাছ-মাংস" },
    { key: "Grocery", label: "মুদি" },
    { key: "Vegetables", label: "সবজি" },
    { key: "Spices", label: "তেল-মসলা" },
  ];

  const filteredBazaars = bazaars.filter((b) => {
    if (selectedCategory === "all") return true;
    return b.category?.includes(selectedCategory);
  });

  const totalFilteredCost = filteredBazaars.reduce((acc, b) => acc + (b.cost || 0), 0);

  const canManage = mongoUser?.role === "manager" || mongoUser?.role === "super_admin";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <MobileAppHeader />

      <main className="max-w-md md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6 pb-28 md:pb-12">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100 font-bengali">
              বাজার খরচের হিসাব
            </h1>
            <span className="text-xs text-slate-400 font-bengali">
              মোট:{" "}
              <span className="font-bold text-amber-400 font-english text-sm">
                {formatTaka(totalFilteredCost, true)}
              </span>
            </span>
          </div>

          <button
            onClick={() => setShowAddDrawer(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold px-3.5 py-2 rounded-2xl text-xs font-bengali shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>বাজার যোগ</span>
          </button>
        </div>

        {/* Category Chips Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium font-bengali whitespace-nowrap transition-colors ${
                selectedCategory === c.key
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Bazaar Feed (Responsive Grid on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
          {filteredBazaars.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-bengali">
              কোনো বাজার খরচ পাওয়া যায়নি
            </div>
          ) : (
            filteredBazaars.map((b) => {
              const payer = members.find((m) => m.firebaseUid === b.paidByUid);
              return (
                <BazaarCard
                  key={b._id}
                  id={b._id}
                  date={b.date}
                  itemDetails={b.itemDetails}
                  category={b.category}
                  cost={b.cost}
                  paidByName={payer?.fullName || "মেস ফান্ড"}
                  canDelete={canManage || b.paidByUid === mongoUser?.firebaseUid}
                  onDelete={() => b._id && deleteBazaarEntry(b._id)}
                />
              );
            })
          )}
        </div>
      </main>

      {/* Add Bazaar Drawer */}
      <AddBazaarDrawer
        isOpen={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        members={members}
        onAdd={addBazaarEntry}
      />

      <MobileBottomNav />
    </div>
  );
}

