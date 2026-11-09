"use client";

import React from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import GlassCard from "../../components/ui/GlassCard";
import Badge from "../../components/ui/Badge";
import { useMess } from "../../context/MessContext";
import { formatTaka } from "../../utils/formatters";
import { Users, KeyRound, Copy, Shield, ShieldCheck } from "lucide-react";

export default function MembersPage() {
  const { currentHouse, members, changeHouseManager } = useMess();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentHouse.joinCode);
    alert(`মেস জয়েন কোড (${currentHouse.joinCode}) কপি করা হয়েছে!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <MobileAppHeader />

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100 font-bengali">
              মেস সদস্য ও ম্যানেজার তালিকা
            </h1>
            <span className="text-xs text-slate-400 font-bengali">
              মোট সক্রিয় সদস্য: {members.length} জন
            </span>
          </div>

          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Join Code Card */}
        <GlassCard className="p-4 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bengali block">মেস জয়েন কোড</span>
                <span className="font-mono text-base font-bold text-amber-400 tracking-wider">
                  {currentHouse.joinCode}
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bengali active:scale-95 transition-transform"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>কপি করুন</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 font-bengali mt-2">
            নতুন সদস্যরা এই কোডটি দিয়ে সরাসরি আপনার মেসে যুক্ত হতে পারবে।
          </p>
        </GlassCard>

        {/* Members Roster with Manager Selection */}
        <div className="space-y-2.5">
          {members.map((m) => {
            const isManager = m.role === "manager";
            return (
              <GlassCard key={m.firebaseUid} className="p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 font-bengali text-sm">
                        {m.fullName}
                      </span>
                      <Badge variant={isManager ? "amber" : "slate"}>
                        {isManager ? "👑 ম্যানেজার" : "সদস্য"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-english mt-0.5">
                      <span>রুম {m.roomNo}</span>
                      {m.phone && <span>• {m.phone}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.customRent && m.customRent > 0 ? (
                      <div className="text-right mr-1">
                        <span className="text-[10px] text-slate-500 font-bengali block">সিট ভাড়া</span>
                        <span className="text-xs font-bold text-slate-300 font-english">
                          {formatTaka(m.customRent, true)}
                        </span>
                      </div>
                    ) : null}

                    {/* Manager selection button */}
                    <button
                      onClick={() => changeHouseManager(m.firebaseUid)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bengali flex items-center gap-1 active:scale-95 transition-all ${
                        isManager
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                      title={isManager ? "বর্তমান ম্যানেজার" : "ইনাকে ম্যানেজার নির্বাচন করুন"}
                    >
                      {isManager ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>বর্তমান ম্যানেজার</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          <span>ম্যানেজার করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
