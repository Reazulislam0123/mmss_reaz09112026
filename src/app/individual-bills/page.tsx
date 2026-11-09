"use client";

import React, { useState, useEffect } from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import GlassCard from "../../components/ui/GlassCard";
import BottomDrawer from "../../components/ui/BottomDrawer";
import { useMess } from "../../context/MessContext";
import { formatTaka } from "../../utils/formatters";
import { FileEdit, Check, UserCheck, AlertCircle } from "lucide-react";

interface IBillItem {
  firebaseUid: string;
  fullName: string;
  roomNo: string;
  seatFare: number;
  prevDue: number;
  charges: number;
  khala: number;
  others: number;
  grandTotal: number;
}

export default function IndividualBillsPage() {
  const { currentHouse, selectedMonth, members, refreshData } = useMess();

  const [bills, setBills] = useState<IBillItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<IBillItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form states for the modal
  const [seatFare, setSeatFare] = useState<number>(0);
  const [prevDue, setPrevDue] = useState<number>(0);
  const [charges, setCharges] = useState<number>(0);
  const [khala, setKhala] = useState<number>(0);
  const [others, setOthers] = useState<number>(0);

  // Load individual bills
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch(
          `/api/individual-bills?houseId=${currentHouse.houseId}&month=${selectedMonth}`
        );
        const data = await res.json();
        const serverBills: any[] = data.bills || [];

        const merged: IBillItem[] = members.map((m) => {
          const found = serverBills.find((b) => b.firebaseUid === m.firebaseUid);
          const sf = found ? found.seatFare : m.customRent || 0;
          const pd = found ? found.prevDue : 0;
          const ch = found ? found.charges : 0;
          const kh = found ? found.khala : 0;
          const ot = found ? found.others : 0;
          return {
            firebaseUid: m.firebaseUid,
            fullName: m.fullName,
            roomNo: m.roomNo || "N/A",
            seatFare: sf,
            prevDue: pd,
            charges: ch,
            khala: kh,
            others: ot,
            grandTotal: sf + pd + ch + kh + ot,
          };
        });
        setBills(merged);
      } catch (e) {
        // Fallback with custom rents
        setBills(
          members.map((m) => ({
            firebaseUid: m.firebaseUid,
            fullName: m.fullName,
            roomNo: m.roomNo || "N/A",
            seatFare: m.customRent || 0,
            prevDue: 0,
            charges: 0,
            khala: 0,
            others: 0,
            grandTotal: m.customRent || 0,
          }))
        );
      }
    };

    fetchBills();
  }, [currentHouse.houseId, selectedMonth, members]);

  const openEditDrawer = (item: IBillItem) => {
    setSelectedMember(item);
    setSeatFare(item.seatFare);
    setPrevDue(item.prevDue);
    setCharges(item.charges);
    setKhala(item.khala);
    setOthers(item.others);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    setSaving(true);
    const updatedTotal =
      Number(seatFare) +
      Number(prevDue) +
      Number(charges) +
      Number(khala) +
      Number(others);

    try {
      await fetch("/api/individual-bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          houseId: currentHouse.houseId,
          month: selectedMonth,
          firebaseUid: selectedMember.firebaseUid,
          seatFare: Number(seatFare),
          prevDue: Number(prevDue),
          charges: Number(charges),
          khala: Number(khala),
          others: Number(others),
        }),
      });

      setBills((prev) =>
        prev.map((b) =>
          b.firebaseUid === selectedMember.firebaseUid
            ? {
                ...b,
                seatFare: Number(seatFare),
                prevDue: Number(prevDue),
                charges: Number(charges),
                khala: Number(khala),
                others: Number(others),
                grandTotal: updatedTotal,
              }
            : b
        )
      );

      setSuccessMsg(`${selectedMember.fullName}-এর হিসাব আপডেট হয়েছে`);
      setTimeout(() => setSuccessMsg(""), 3000);
      setSelectedMember(null);
      refreshData();
    } finally {
      setSaving(false);
    }
  };

  const grandSum = bills.reduce((acc, b) => acc + b.grandTotal, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 font-bengali">
      <MobileAppHeader />

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100">
              ব্যক্তিগত বিল ও সমন্বয়
            </h1>
            <span className="text-xs text-slate-400">
              মাস: <span className="font-english">{selectedMonth}</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">মোট সমন্বিত বিল</span>
            <span className="text-sm font-bold text-amber-400 font-english">
              {formatTaka(grandSum, true)}
            </span>
          </div>
        </div>

        {/* Notice Card */}
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            এখানে সদস্যদের ব্যক্তিগত সিট ভাড়া, পূর্ববর্তী মাসের বকেয়া, মেহমান মিল চার্জ বা অন্যান্য ব্যক্তিগত বিল সমন্বয় করতে পারেন।
          </span>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-2.5">
          {bills.map((item) => (
            <GlassCard key={item.firebaseUid} className="p-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-100 text-sm">
                      {item.fullName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-english">
                      (রুম {item.roomNo})
                    </span>
                  </div>

                  <div className="space-y-0.5 text-xs text-slate-400 mt-1.5">
                    {item.seatFare > 0 && (
                      <div className="flex items-center gap-1">
                        <span>সিট ভাড়া:</span>
                        <span className="font-english font-medium text-slate-300">
                          {formatTaka(item.seatFare, true)}
                        </span>
                      </div>
                    )}
                    {item.prevDue > 0 && (
                      <div className="flex items-center gap-1 text-rose-400">
                        <span>পূর্বের বকেয়া:</span>
                        <span className="font-english font-medium">
                          {formatTaka(item.prevDue, true)}
                        </span>
                      </div>
                    )}
                    {item.charges > 0 && (
                      <div className="flex items-center gap-1">
                        <span>মেহমান/অন্য চার্জ:</span>
                        <span className="font-english font-medium text-slate-300">
                          {formatTaka(item.charges, true)}
                        </span>
                      </div>
                    )}
                    {item.khala > 0 && (
                      <div className="flex items-center gap-1">
                        <span>খালা বিল:</span>
                        <span className="font-english font-medium text-slate-300">
                          {formatTaka(item.khala, true)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">মোট সমন্বয়</span>
                  <span className="text-base font-black text-amber-400 font-english">
                    {formatTaka(item.grandTotal, true)}
                  </span>

                  <button
                    onClick={() => openEditDrawer(item)}
                    className="mt-2 flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-xl text-xs active:scale-95 transition-all ml-auto"
                  >
                    <FileEdit className="w-3 h-3" />
                    <span>সংশোধন</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </main>

      {/* Edit Bill Drawer */}
      <BottomDrawer
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title={`${selectedMember?.fullName}-এর ব্যক্তিগত বিল সমন্বয়`}
      >
        <form onSubmit={handleSave} className="space-y-3 font-bengali">
          <div>
            <label className="text-xs text-slate-400 block mb-1">
              রুম / সিট ভাড়া (৳)
            </label>
            <input
              type="number"
              min="0"
              value={seatFare || ""}
              onChange={(e) => setSeatFare(Number(e.target.value))}
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              পূর্বের বকেয়া (৳)
            </label>
            <input
              type="number"
              min="0"
              value={prevDue || ""}
              onChange={(e) => setPrevDue(Number(e.target.value))}
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              মেহমান মিল বা ফ্রিজ চার্জ (৳)
            </label>
            <input
              type="number"
              min="0"
              value={charges || ""}
              onChange={(e) => setCharges(Number(e.target.value))}
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              খালা বিল সমন্বয় (ঐচ্ছিক)
            </label>
            <input
              type="number"
              min="0"
              value={khala || ""}
              onChange={(e) => setKhala(Number(e.target.value))}
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              অন্যান্য চার্জ / জরিমানা (৳)
            </label>
            <input
              type="number"
              min="0"
              value={others || ""}
              onChange={(e) => setOthers(Number(e.target.value))}
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">সর্বমোট ব্যক্তিগত সমন্বয়:</span>
            <span className="text-base font-black text-amber-400 font-english">
              {formatTaka(
                Number(seatFare) +
                  Number(prevDue) +
                  Number(charges) +
                  Number(khala) +
                  Number(others),
                true
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? "সংরক্ষণ হচ্ছে..." : "সমন্বয় সেভ করুন"}
          </button>
        </form>
      </BottomDrawer>

      <MobileBottomNav />
    </div>
  );
}
