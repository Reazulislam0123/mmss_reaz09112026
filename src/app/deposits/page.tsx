"use client";

import React, { useState } from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import DepositCard from "../../components/deposits/DepositCard";
import VoucherModal from "../../components/deposits/VoucherModal";
import BottomDrawer from "../../components/ui/BottomDrawer";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import { formatTaka, getCurrentDate } from "../../utils/formatters";
import { Plus } from "lucide-react";

export default function DepositsPage() {
  const { mongoUser } = useAuth();
  const { currentHouse, members, deposits, addDepositEntry } = useMess();
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  // Form states
  const [date, setDate] = useState(getCurrentDate());
  const [firebaseUid, setFirebaseUid] = useState(mongoUser?.firebaseUid || members[0]?.firebaseUid);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [trxId, setTrxId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const totalDeposits = deposits.reduce((acc, d) => acc + (d.amount || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    try {
      await addDepositEntry({
        date,
        firebaseUid: firebaseUid || mongoUser?.firebaseUid || "UID_01",
        amount: Number(amount),
        paymentMethod: paymentMethod as any,
        trxId,
        notes,
        status: "approved",
      });
      setAmount("");
      setTrxId("");
      setNotes("");
      setShowAddDrawer(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <MobileAppHeader />

      <main className="max-w-md md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6 pb-28 md:pb-12">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100 font-bengali">
              টাকা জমার খতিয়ান
            </h1>
            <span className="text-xs text-slate-400 font-bengali">
              মোট সংগৃহীত:{" "}
              <span className="font-bold text-emerald-400 font-english text-sm">
                {formatTaka(totalDeposits, true)}
              </span>
            </span>
          </div>

          <button
            onClick={() => setShowAddDrawer(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold px-3.5 py-2 rounded-2xl text-xs font-bengali shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>টাকা জমা</span>
          </button>
        </div>

        {/* Deposits List (Responsive Grid on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
          {deposits.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-bengali">
              কোনো জমার রেকর্ড পাওয়া যায়নি
            </div>
          ) : (
            deposits.map((d) => {
              const member = members.find((m) => m.firebaseUid === d.firebaseUid);
              const memberName = member?.fullName || "মেস সদস্য";

              return (
                <DepositCard
                  key={d._id}
                  id={d._id}
                  date={d.date}
                  memberName={memberName}
                  amount={d.amount}
                  paymentMethod={d.paymentMethod}
                  trxId={d.trxId}
                  notes={d.notes}
                  onViewVoucher={() =>
                    setSelectedVoucher({
                      ...d,
                      memberName,
                    })
                  }
                />
              );
            })
          )}
        </div>
      </main>

      {/* Add Deposit Drawer */}
      <BottomDrawer
        isOpen={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        title="নতুন জমা রেকর্ড করুন"
      >
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
            <label className="text-xs text-slate-400 font-bengali block mb-1">সদস্য নির্বাচন করুন</label>
            <select
              value={firebaseUid}
              onChange={(e) => setFirebaseUid(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-bengali focus:outline-none focus:border-amber-500/50"
            >
              {members.map((m) => (
                <option key={m.firebaseUid} value={m.firebaseUid}>
                  {m.fullName} (রুম {m.roomNo})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-bengali block mb-1">জমার পরিমাণ (৳)</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="10"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bengali block mb-1">মাধ্যম</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Bank">Bank</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bengali block mb-1">TrxID (ঐচ্ছিক)</label>
            <input
              type="text"
              placeholder="e.g. BKH98273611"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold font-bengali shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "সংরক্ষণ হচ্ছে..." : "জমা সম্পন্ন করুন"}
          </button>
        </form>
      </BottomDrawer>

      {/* Printable Money Voucher Modal */}
      <VoucherModal
        isOpen={Boolean(selectedVoucher)}
        onClose={() => setSelectedVoucher(null)}
        deposit={selectedVoucher}
        houseName={currentHouse.name}
      />

      <MobileBottomNav />
    </div>
  );
}

