"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import GlassCard from "../../components/ui/GlassCard";
import BrandLogo from "../../components/ui/BrandLogo";
import { UserPlus, Home, KeyRound } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [tab, setTab] = useState<"join" | "create">("join");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [houseName, setHouseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(email, password, name, tab === "join" ? joinCode : undefined);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "নিবন্ধন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center px-4 py-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <BrandLogo size="md" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 font-bengali">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-xs text-slate-400 font-bengali">
            Smart MMS ডিজিটাল মেস ম্যানেজারে যুক্ত হোন
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setTab("join")}
            className={`py-2 text-xs font-bold rounded-xl font-bengali transition-colors flex items-center justify-center gap-1.5 ${
              tab === "join"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>কোড দিয়ে মেসে যুক্ত হোন</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("create")}
            className={`py-2 text-xs font-bold rounded-xl font-bengali transition-colors flex items-center justify-center gap-1.5 ${
              tab === "create"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>নতুন মেস তৈরি করুন</span>
          </button>
        </div>

        <GlassCard className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bengali">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-bengali block mb-1">
                আপনার পূর্ণ নাম
              </label>
              <input
                type="text"
                placeholder="যেমন: তানভীর আহমেদ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-bengali placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bengali block mb-1">
                ইমেইল ঠিকানা
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-english placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bengali block mb-1">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                placeholder="কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-english placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {tab === "join" ? (
              <div>
                <label className="text-xs text-slate-400 font-bengali block mb-1">
                  মেস জয়েন কোড অথবা ইউনিক হাউস আইডি
                </label>
                <input
                  type="text"
                  placeholder="যেমন: MMS-7K2X বা HOUSE_01"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono tracking-wider uppercase text-amber-400 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs text-slate-400 font-bengali block mb-1">
                  মেসের নাম
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ধানমন্ডি ব্যাচেলর পয়েন্ট"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-bengali placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold font-bengali shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? "নিবন্ধন হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}</span>
            </button>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-slate-400 font-bengali">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="text-amber-400 font-semibold hover:underline">
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}

