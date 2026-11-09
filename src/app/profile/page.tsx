"use client";

import React, { useState, useEffect } from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import GlassCard from "../../components/ui/GlassCard";
import Badge from "../../components/ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import {
  User,
  Phone,
  DoorClosed,
  Mail,
  ShieldCheck,
  Building2,
  KeyRound,
  Crown,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { mongoUser, updateUserProfile, logout } = useAuth();
  const { currentHouse, refreshData } = useMess();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    if (mongoUser) {
      setFullName(mongoUser.fullName || "");
      setPhone(mongoUser.phone || "");
      setRoomNo(mongoUser.roomNo || "");
    }
  }, [mongoUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ text: "অনুগ্রহ করে আপনার নাম লিখুন", error: true });
      return;
    }

    setLoading(true);
    setMessage(null);

    const res = await updateUserProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      roomNo: roomNo.trim(),
    });

    if (res.success) {
      setMessage({ text: res.message });
      await refreshData();
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } else {
      setMessage({ text: res.message, error: true });
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isManager = mongoUser?.role === "manager" || mongoUser?.role === "super_admin";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <MobileAppHeader />

      <main className="max-w-md md:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6 pb-28 md:pb-12 font-bengali">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100">আমার প্রোফাইল ও অ্যাকাউন্ট</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              ব্যক্তিগত তথ্য, যোগাযোগ নম্বর ও মেস সংশ্লিষ্ট তথ্য পরিবর্তন করুন
            </p>
          </div>
          <Badge variant={isManager ? "amber" : "slate"}>
            {isManager ? "👑 মেস ম্যানেজার" : "👤 সাধারণ মেম্বার"}
          </Badge>
        </div>

        {/* Profile Card Header */}
        <GlassCard className="p-4 sm:p-6 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border-amber-500/20">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            {/* Large Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xl shadow-amber-500/20 shrink-0 border-2 border-amber-400/40">
              {fullName ? fullName.charAt(0).toUpperCase() : mongoUser?.fullName?.charAt(0) || "U"}
            </div>

            {/* User Meta */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 truncate">
                  {fullName || mongoUser?.fullName || "ব্যবহারকারী"}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold self-center sm:self-auto ${
                    isManager
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  {isManager ? (
                    <>
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>মেস ম্যানেজার</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>মেস সদস্য</span>
                    </>
                  )}
                </span>
              </div>

              <div className="text-xs text-slate-400 font-english mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{mongoUser?.email}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-english bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>

              {/* Mess Info Chips */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-xl">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-200 font-bold">{currentHouse.name}</span>
                </span>

                <span className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-xl">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-400">কোড:</span>
                  <span className="font-mono text-amber-300 font-bold">{currentHouse.joinCode}</span>
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Edit Form */}
        <GlassCard className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>প্রোফাইল তথ্য সম্পাদনা করুন</span>
            </h3>
            <span className="text-[11px] text-slate-400">সব তথ্য পরিবর্তনযোগ্য</span>
          </div>

          {/* Feedback toast */}
          {message && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in ${
                message.error
                  ? "bg-rose-500/15 border border-rose-500/30 text-rose-300"
                  : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
              }`}
            >
              {message.error ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>আপনার পূর্ণ নাম (Full Name) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="যেমন: ANM Reazul Islam"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-semibold focus:outline-none focus:border-amber-500/60 transition-colors shadow-inner"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>মোবাইল নম্বর (Phone Number)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="যেমন: 01712345678"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500/60 transition-colors shadow-inner"
                />
              </div>

              {/* Room No */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <DoorClosed className="w-3.5 h-3.5 text-amber-400" />
                  <span>রুম / সিট নম্বর (Room / Seat No)</span>
                </label>
                <input
                  type="text"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  placeholder="যেমন: 302 বা 2A"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-medium focus:outline-none focus:border-amber-500/60 transition-colors shadow-inner"
                />
              </div>

              {/* Email Address (Read-only) */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>ইমেইল আইডি (Email ID)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> সুরক্ষিত
                  </span>
                </label>
                <input
                  type="email"
                  disabled
                  value={mongoUser?.email || ""}
                  className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 font-english cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "সংরক্ষণ হচ্ছে..." : "✓ প্রোফাইল সেভ করুন"}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>অ্যাকাউন্ট থেকে লগআউট</span>
              </button>
            </div>
          </form>
        </GlassCard>
      </main>

      <MobileBottomNav />
    </div>
  );
}

