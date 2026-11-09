"use client";

import React, { useState } from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import DailyMealRow from "../../components/meals/DailyMealRow";
import BulkMealSheet from "../../components/meals/BulkMealSheet";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import { toBengaliNumeral } from "../../utils/formatters";
import { Users } from "lucide-react";

export default function MealsPage() {
  const { mongoUser } = useAuth();
  const { members, meals, selectedMonth, addMealEntry, saveBulkMeals } = useMess();
  const [showBulkSheet, setShowBulkSheet] = useState(false);

  // Generate all days for selected month (1 to 28/30/31)
  const [yearStr, monthStr] = selectedMonth.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    return `${selectedMonth}-${day}`;
  });

  const isManager = mongoUser?.role === "manager" || mongoUser?.role === "super_admin";

  // Calculate current user's total meals this month
  const userTotalMeals = meals
    .filter((m) => m.firebaseUid === mongoUser?.firebaseUid && m.date.startsWith(selectedMonth))
    .reduce((acc, m) => acc + (m.totalMeals || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <MobileAppHeader />

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100 font-bengali">
              মিল ক্যালেন্ডার
            </h1>
            <span className="text-xs text-slate-400 font-bengali">
              আপনার চলতি মাসের মোট মিল:{" "}
              <span className="font-bold text-amber-400 font-english text-sm">
                {toBengaliNumeral(userTotalMeals)}
              </span>{" "}
              টি
            </span>
          </div>

          {isManager && (
            <button
              onClick={() => setShowBulkSheet(true)}
              className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold font-bengali active:scale-95 transition-transform"
            >
              <Users className="w-3.5 h-3.5" />
              <span>একসাথে মিল</span>
            </button>
          )}
        </div>

        {/* Date-by-date list */}
        <div className="space-y-2.5">
          {daysArray.map((dateStr) => {
            const entry = meals.find(
              (m) => m.date === dateStr && m.firebaseUid === mongoUser?.firebaseUid
            ) || { breakfast: 0, lunch: 0, dinner: 0, totalMeals: 0 };

            return (
              <DailyMealRow
                key={dateStr}
                date={dateStr}
                breakfast={entry.breakfast}
                lunch={entry.lunch}
                dinner={entry.dinner}
                totalMeals={entry.totalMeals}
                onUpdate={(b, l, d) => {
                  if (mongoUser) {
                    addMealEntry(dateStr, mongoUser.firebaseUid, b, l, d);
                  }
                }}
              />
            );
          })}
        </div>
      </main>

      {/* Manager Bulk Entry Sheet */}
      <BulkMealSheet
        isOpen={showBulkSheet}
        onClose={() => setShowBulkSheet(false)}
        members={members}
        onSave={saveBulkMeals}
      />

      <MobileBottomNav />
    </div>
  );
}

