"use client";

import React, { useState } from "react";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import GlassCard from "../../components/ui/GlassCard";
import Badge from "../../components/ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import EditProfileDrawer from "../../components/profile/EditProfileDrawer";
import { formatTaka } from "../../utils/formatters";
import { Users, KeyRound, Copy, Shield, ShieldCheck, Home, Pencil, Check, UserCheck, Trash2 } from "lucide-react";

export default function MembersPage() {
  const { mongoUser } = useAuth();
  const { currentHouse, members, changeHouseManager, updateHouseName, refreshData, dutyManagerUid, handoverDutyManager } = useMess();

  const [isEditingName, setIsEditingName] = useState(false);
  const [houseNameInput, setHouseNameInput] = useState(currentHouse.name);
  const [houseAddressInput, setHouseAddressInput] = useState(currentHouse.address || "");
  const [savingName, setSavingName] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const isSuperAdmin =
    mongoUser?.role === "super_admin" ||
    mongoUser?.email?.toLowerCase() === "reazul.islam6164@gmail.com";

  const handleDeleteMember = async (memberUid: string, memberName: string) => {
    if (!confirm(`সতর্কতা: আপনি কি নিশ্চিতভাবে সদস্য '${memberName}' কে মেস থেকে স্থায়ীভাবে ডিলিট করতে চান?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?firebaseUid=${memberUid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessToast(data.message || "সদস্য ডিলিট সম্পন্ন হয়েছে!");
        await refreshData();
        setTimeout(() => setSuccessToast(""), 2000);
      } else {
        alert(data.error || "ডিলিট ব্যর্থ হয়েছে");
      }
    } catch (e: any) {
      alert("সার্ভার এরর: " + e.message);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentHouse.joinCode);
    alert(`মেস জয়েন কোড (${currentHouse.joinCode}) কপি করা হয়েছে!`);
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseNameInput.trim()) return;
    setSavingName(true);
    const ok = await updateHouseName(houseNameInput.trim(), houseAddressInput.trim());
    if (ok) {
      setSuccessToast("মেসের নাম সফলভাবে পরিবর্তন করা হয়েছে!");
      setTimeout(() => {
        setSuccessToast("");
        setIsEditingName(false);
      }, 1500);
    }
    setSavingName(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <MobileAppHeader />

      <main className="max-w-md md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6 pb-28 md:pb-12">
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

        {/* Top Cards: Mess Name & Join Code (2 columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Mess Name & Details Card with 1-Click Inline Edit */}
          <GlassCard className="p-4 border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bengali block">বর্তমান মেসের নাম</span>
                {!isEditingName && (
                  <h2 className="text-base font-bold text-slate-100 font-bengali leading-tight">
                    {currentHouse.name}
                  </h2>
                )}
              </div>
            </div>

            {!isEditingName && (
              <button
                type="button"
                onClick={() => {
                  setHouseNameInput(currentHouse.name);
                  setHouseAddressInput(currentHouse.address || "");
                  setIsEditingName(true);
                }}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold font-bengali bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-xl active:scale-95 transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>নাম পরিবর্তন</span>
              </button>
            )}
          </div>

          {isEditingName ? (
            <form onSubmit={handleSaveName} className="space-y-3 pt-2 font-bengali">
              <div>
                <label className="text-xs text-slate-400 block mb-1">মেসের নতুন নাম</label>
                <input
                  type="text"
                  value={houseNameInput}
                  onChange={(e) => setHouseNameInput(e.target.value)}
                  required
                  placeholder="যেমন: ধানমন্ডি স্টার পয়েন্ট"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">ঠিকানা (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={houseAddressInput}
                  onChange={(e) => setHouseAddressInput(e.target.value)}
                  placeholder="যেমন: রোড ৪, ধানমন্ডি, ঢাকা"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {successToast && (
                <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{successToast}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingName}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold active:scale-95 transition-all disabled:opacity-50 shadow-md shadow-amber-500/20"
                >
                  {savingName ? "সংরক্ষণ হচ্ছে..." : "✓ নাম সেভ করুন"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 active:scale-95 transition-all"
                >
                  বাতিল
                </button>
              </div>
            </form>
          ) : (
            currentHouse.address && (
              <p className="text-xs text-slate-400 font-bengali mt-1">
                ঠিকানা: {currentHouse.address}
              </p>
            )
          )}
        </GlassCard>

        {/* Join Code Card */}
        <GlassCard className="p-4 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bengali block">মেস জয়েন কোড ও হাউস আইডি</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-base font-bold text-amber-400 tracking-wider">
                    {currentHouse.joinCode}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    ID: {currentHouse.houseId}
                  </span>
                </div>
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
            নতুন সদস্যরা এই জয়েন কোড (<span className="font-mono text-amber-300">{currentHouse.joinCode}</span>) বা ইউনিক আইডি (<span className="font-mono text-slate-300">{currentHouse.houseId}</span>) দিয়ে সরাসরি আপনার মেসে যুক্ত হতে পারবে।
          </p>
          </GlassCard>
        </div>

        {/* Members Roster with Manager Selection (Responsive Grid on Desktop) */}
        <div className="space-y-2.5">
          <h2 className="text-sm font-bold text-slate-300 font-bengali">
            সদস্য তালিকা ও ম্যানেজার নির্ধারণ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {members.map((m) => {
            const isMe = m.firebaseUid === mongoUser?.firebaseUid;
            const isManager =
              m.firebaseUid === currentHouse.managerFirebaseUid ||
              (m.role === "manager" && !members.some((x) => x.firebaseUid === currentHouse.managerFirebaseUid));
            const isDutyManager = m.firebaseUid === dutyManagerUid || m.firebaseUid === currentHouse.dutyManagerUid;
            return (
              <GlassCard key={m.firebaseUid} className="p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 font-bengali text-sm">
                        {m.fullName}
                      </span>
                      <Badge variant={isManager ? "amber" : isDutyManager ? "emerald" : "slate"}>
                        {isManager ? "👑 মেস ম্যানেজার" : isDutyManager ? "👨‍🍳 মিল ম্যানেজার" : "সদস্য"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-english mt-0.5">
                      <span>রুম {m.roomNo}</span>
                      {m.phone && <span>• {m.phone}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {isMe && (
                      <button
                        onClick={() => setShowProfileDrawer(true)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bengali flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 active:scale-95 transition-all font-semibold"
                        title="নিজের প্রোফাইল এডিট করুন"
                      >
                        <Pencil className="w-3 h-3 text-amber-400" />
                        <span>প্রোফাইল এডিট</span>
                      </button>
                    )}

                    {/* Meal Manager handover button */}
                    {!isDutyManager && (isSuperAdmin || currentHouse.managerFirebaseUid === mongoUser?.firebaseUid) && (
                      <button
                        onClick={async () => {
                          await handoverDutyManager(m.firebaseUid, 6);
                          setSuccessToast(`${m.fullName}-কে মিল ম্যানেজার করা হয়েছে!`);
                          setTimeout(() => setSuccessToast(""), 2500);
                        }}
                        className="px-2 py-1.5 rounded-xl text-xs font-bengali flex items-center gap-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 active:scale-95 transition-all font-medium"
                        title="ইনাকে চলতি মিল ম্যানেজার নির্ধারণ করুন"
                      >
                        <span>👨‍🍳 মিল ম্যানেজার</span>
                      </button>
                    )}

                    {/* Manager selection button */}
                    <button
                      onClick={() => {
                        if (!isManager) {
                          changeHouseManager(m.firebaseUid);
                        }
                      }}
                      disabled={isManager}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bengali flex items-center gap-1 transition-all ${
                        isManager
                          ? "bg-amber-500 text-slate-950 font-bold cursor-default"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95"
                      }`}
                      title={isManager ? "বর্তমান মেস ম্যানেজার" : "ইনাকে মেস ম্যানেজার নির্বাচন করুন"}
                    >
                      {isManager ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>মেস ম্যানেজার</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          <span>ম্যানেজার</span>
                        </>
                      )}
                    </button>

                    {/* Super Admin Direct Member Delete */}
                    {isSuperAdmin && !isMe && (
                      <button
                        onClick={() => handleDeleteMember(m.firebaseUid, m.fullName)}
                        className="p-1.5 rounded-xl text-xs font-bengali flex items-center justify-center bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 active:scale-95 transition-all"
                        title="সুপার অ্যাডমিন: এই সদস্যকে মেস থেকে ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
          </div>
        </div>
      </main>

      <EditProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
      />

      <MobileBottomNav />
    </div>
  );
}
