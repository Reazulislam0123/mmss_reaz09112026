"use client";

import React, { useState, useEffect } from "react";
import BottomDrawer from "../ui/BottomDrawer";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import {
  User,
  Phone,
  DoorClosed,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Crown,
  UserCheck,
} from "lucide-react";

interface EditProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileDrawer: React.FC<EditProfileDrawerProps> = ({ isOpen, onClose }) => {
  const { mongoUser, updateUserProfile } = useAuth();
  const { currentHouse, refreshData } = useMess();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Sync inputs with mongoUser whenever drawer opens or user changes
  useEffect(() => {
    if (mongoUser) {
      setFullName(mongoUser.fullName || "");
      setPhone(mongoUser.phone || "");
      setRoomNo(mongoUser.roomNo || "");
      setMessage(null);
    }
  }, [mongoUser, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      // Refresh context members so all pages update their display immediately
      await refreshData();
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1400);
    } else {
      setMessage({ text: res.message, error: true });
    }

    setLoading(false);
  };

  const isManager = mongoUser?.role === "manager" || mongoUser?.role === "super_admin";

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={() => {
        setMessage(null);
        onClose();
      }}
      title="প্রোফাইল সম্পাদনা (Edit Profile)"
    >
      <div className="space-y-4 font-bengali">
        {/* User Identity Card Preview */}
        <div className="p-3.5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3 shadow-inner">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            {fullName ? fullName.charAt(0).toUpperCase() : mongoUser?.fullName?.charAt(0) || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100 truncate">
                {fullName || mongoUser?.fullName || "ব্যবহারকারী"}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                  isManager
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {isManager ? (
                  <>
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>মেস ম্যানেজার</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3 h-3 text-slate-400" />
                    <span>সাধারণ সদস্য</span>
                  </>
                )}
              </span>
            </div>

            <div className="text-xs text-slate-400 truncate font-english mt-0.5">
              {mongoUser?.email}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-400/80" />
                <span className="text-slate-300">{currentHouse.name}</span>
              </span>
              <span>•</span>
              <span className="font-mono text-amber-400">{currentHouse.joinCode}</span>
            </div>
          </div>
        </div>

        {/* Feedback message toast */}
        {message && (
          <div
            className={`p-3 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in ${
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

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name Input */}
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-amber-500/60 transition-colors shadow-inner"
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>মোবাইল নম্বর (Phone)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="যেমন: 01712345678"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500/60 transition-colors shadow-inner"
            />
          </div>

          {/* Room / Seat No Input */}
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-amber-500/60 transition-colors shadow-inner"
            />
          </div>

          {/* Email (Read-Only) */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>ইমেইল আইডি (Email Address)</span>
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-english">
                <ShieldCheck className="w-3 h-3" /> ভেরিফাইড
              </span>
            </label>
            <input
              type="email"
              disabled
              value={mongoUser?.email || ""}
              className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-english cursor-not-allowed select-none"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "সংরক্ষণ হচ্ছে..." : "✓ পরিবর্তন সংরক্ষণ করুন"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-3 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-semibold text-xs active:scale-95 transition-all"
            >
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </BottomDrawer>
  );
};

export default EditProfileDrawer;

