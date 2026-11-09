"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import { MOCK_USERS } from "../../lib/mockData";
import BottomDrawer from "../ui/BottomDrawer";
import BrandLogo from "../ui/BrandLogo";
import MealManagerRosterDrawer from "../meals/MealManagerRosterDrawer";
import {
  Building2,
  Calendar,
  UserCheck,
  Shield,
  ChevronDown,
  LogOut,
  LogIn,
  Plus,
  KeyRound,
  Check,
  UserCog,
  Sparkles,
  ChefHat,
  RotateCw,
} from "lucide-react";

export const MobileAppHeader: React.FC = () => {
  const router = useRouter();
  const { mongoUser, switchDemoPersona, isDemoMode, logout } = useAuth();
  const {
    currentHouse,
    availableHouses,
    setCurrentHouse,
    changeHouseManager,
    createNewHouse,
    dutyManagerUid,
    dutyStartDate,
    dutyEndDate,
    members,
    selectedMonth,
    setSelectedMonth,
  } = useMess();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showHouseDrawer, setShowHouseDrawer] = useState(false);
  const [showRosterDrawer, setShowRosterDrawer] = useState(false);
  const [newHouseName, setNewHouseName] = useState("");
  const [showNewHouseForm, setShowNewHouseForm] = useState(false);

  // Available months list for picker (current year)
  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, "0");
    return `${currentYear}-${m}`;
  });

  const handleLogout = async () => {
    setShowPersonaMenu(false);
    await logout();
    router.push("/login");
  };

  const handleCreateHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouseName) return;
    await createNewHouse(newHouseName);
    setNewHouseName("");
    setShowNewHouseForm(false);
    setShowHouseDrawer(false);
  };

  const currentManager = members.find((m) => m.role === "manager") || members[0];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* House info chip -> Clicking opens Mess & Manager Selection */}
          <button
            onClick={() => setShowHouseDrawer(true)}
            className="flex items-center gap-2 min-w-0 text-left bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-2xl px-2 py-1.5 active:scale-95 transition-all"
            title="মেস ও ম্যানেজার পরিবর্তন করুন"
          >
            <BrandLogo size="sm" />
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1">
                <h1 className="text-xs font-bold text-slate-100 truncate font-bengali leading-tight max-w-[120px] sm:max-w-[150px]">
                  {currentHouse.name}
                </h1>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
              <span className="text-[10px] text-amber-400 font-mono tracking-wider block">
                {currentHouse.joinCode}
              </span>
            </div>
          </button>

          {/* Right tools: Month selector & User profile/Logout menu */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Month Picker dropdown */}
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-english font-medium focus:outline-none pr-1 cursor-pointer"
              >
                {months.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-slate-200">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* User profile persona avatar -> Clicking opens Profile & Logout Drawer */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1.5 active:scale-95 transition-transform"
                title="প্রোফাইল ও লগআউট"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {mongoUser?.fullName ? mongoUser.fullName.charAt(0) : "ম"}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Profile & Logout Dropdown Menu */}
              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 font-bengali">
                  {/* Current User Card */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-100 truncate">
                        {mongoUser?.fullName || "অতিথি ব্যবহারকারী"}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          mongoUser?.role === "manager"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {mongoUser?.role === "manager" ? "👑 ম্যানেজার" : "👤 মেম্বার"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate font-english">
                      {mongoUser?.email}
                    </div>
                    {mongoUser?.roomNo && (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        রুম নং: {mongoUser.roomNo}
                      </div>
                    )}
                  </div>

                  {/* Switch Demo Persona Quick List */}
                  <div className="border-t border-slate-800 pt-2 mb-2">
                    <div className="text-[10px] font-semibold text-slate-400 px-1 mb-1.5 flex items-center justify-between">
                      <span>সুইচ প্রোফাইল / ভূমিকা</span>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    </div>
                    <div className="space-y-1">
                      {MOCK_USERS.map((u) => (
                        <button
                          key={u.firebaseUid}
                          onClick={() => {
                            switchDemoPersona(u.firebaseUid);
                            setShowPersonaMenu(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            mongoUser?.firebaseUid === u.firebaseUid
                              ? "bg-amber-500/15 text-amber-300 font-semibold"
                              : "text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          <div className="truncate">
                            <span className="truncate">{u.fullName}</span>
                          </div>
                          {u.role === "manager" ? (
                            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Login / Logout Options */}
                  <div className="border-t border-slate-800 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        router.push("/login");
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <LogIn className="w-4 h-4 text-slate-400" />
                      <span>লগইন পেজে যান</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/15 flex items-center gap-2 transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>লগআউট করুন (Sign Out)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rotating 5-6 Days Meal Manager Status Bar */}
        <div className="max-w-md mx-auto pt-2 border-t border-slate-800/60 mt-2 flex items-center justify-between text-[11px] font-bengali">
          <button
            onClick={() => setShowRosterDrawer(true)}
            className="w-full flex items-center justify-between bg-gradient-to-r from-amber-500/15 to-amber-500/5 hover:from-amber-500/20 border border-amber-500/30 text-amber-200 px-3 py-1.5 rounded-2xl active:scale-[0.99] transition-all shadow-sm"
            title="মিল ম্যানেজার রোটেশন শিডিউল ও দায়িত্ব পরিবর্তন"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <ChefHat className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">
                চলতি মিল ম্যানেজার:{" "}
                <strong className="text-amber-300 font-bold">
                  {members.find((m) => m.firebaseUid === dutyManagerUid)?.fullName || "শাকিল হোসেন"}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold shrink-0 ml-1">
              <span>৫-৬ দিনের রোস্টার</span>
              <RotateCw className="w-2.5 h-2.5" />
            </div>
          </button>
        </div>
      </header>

      {/* Mess Selection & Manager Assignment Drawer */}
      <BottomDrawer
        isOpen={showHouseDrawer}
        onClose={() => setShowHouseDrawer(false)}
        title="মেস ও ম্যানেজার ব্যবস্থাপনা"
      >
        <div className="space-y-5 font-bengali">
          {/* Active House Selection */}
          <div>
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>সক্রিয় মেস নির্বাচন করুন:</span>
              <span className="text-[10px] text-slate-500">
                মোট মেস: {availableHouses.length} টি
              </span>
            </div>
            <div className="space-y-2">
              {availableHouses.map((h) => {
                const isSelected = h.houseId === currentHouse.houseId;
                return (
                  <button
                    key={h.houseId}
                    onClick={() => {
                      setCurrentHouse(h);
                      setShowHouseDrawer(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                        : "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <span>{h.name}</span>
                        {isSelected && (
                          <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                            সক্রিয়
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        জয়েন কোড: <span className="font-mono text-amber-400">{h.joinCode}</span>{" "}
                        {h.address && `• ${h.address}`}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mess Manager Selection / Assignment */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <UserCog className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">
                মেস ম্যানেজার নির্বাচন / দায়িত্ব অর্পণ:
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed">
              বর্তমানে দায়িত্বে আছেন:{" "}
              <span className="font-bold text-amber-400 font-bengali">
                {currentManager.fullName}
              </span>
              । অন্য কাউকে ম্যানেজার বানাতে নিচে থেকে নির্বাচন করুন:
            </p>

            <div className="space-y-1.5">
              {members.map((m) => {
                const isManager = m.role === "manager";
                return (
                  <button
                    key={m.firebaseUid}
                    onClick={() => changeHouseManager(m.firebaseUid)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      isManager
                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold"
                        : "bg-slate-900 border border-slate-800/80 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    <span>
                      {m.fullName} (রুম {m.roomNo})
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isManager
                          ? "bg-amber-500 text-slate-950 font-black"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isManager ? "ম্যানেজার" : "ম্যানেজার করুন"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create New House Form */}
          {showNewHouseForm ? (
            <form onSubmit={handleCreateHouse} className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  নতুন মেসের নাম লিখুন
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ধানমন্ডি স্টার পয়েন্ট"
                  value={newHouseName}
                  onChange={(e) => setNewHouseName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  তৈরি করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewHouseForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  বাতিল
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowNewHouseForm(true)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন মেস তৈরি করুন</span>
            </button>
          )}
        </div>
      </BottomDrawer>
      {/* Rotating Meal Manager Schedule & Handover Drawer */}
      <MealManagerRosterDrawer
        isOpen={showRosterDrawer}
        onClose={() => setShowRosterDrawer(false)}
      />
    </>
  );
};

export default MobileAppHeader;
