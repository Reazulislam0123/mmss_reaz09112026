"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import GlassCard from "../../components/ui/GlassCard";
import BrandLogo from "../../components/ui/BrandLogo";
import { LogIn, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "লগইন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      setError("গুগল দিয়ে লগইন সম্পন্ন করা যায়নি");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center px-4 py-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 font-bengali">
            Smart MMS <span className="text-amber-400 font-normal text-base">(মেস ম্যানেজার)</span>
          </h1>
          <p className="text-xs text-slate-400 font-bengali">
            ব্যাচেলর মেস ও হোস্টেলের ডিজিটাল মিল ও খরচের হিসাব
          </p>
        </div>

        {/* Login form card */}
        <GlassCard className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-bengali">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-bengali block mb-1">
                ইমেইল ঠিকানা
              </label>
              <input
                type="email"
                placeholder="your@email.com"
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
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-english placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold font-bengali shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? "লগইন হচ্ছে..." : "লগইন করুন"}</span>
            </button>
          </form>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 font-bengali">
              অথবা
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all font-bengali"
          >
            <span>Google অ্যাকাউন্ট দিয়ে প্রবেশ করুন</span>
          </button>
        </GlassCard>

        <p className="text-center text-xs text-slate-400 font-bengali">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/register" className="text-amber-400 font-semibold hover:underline">
            নতুন মেস খুলুন বা জয়েন কোড দিয়ে নিবন্ধন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}

