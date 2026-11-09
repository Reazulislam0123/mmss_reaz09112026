"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import BottomDrawer from "../ui/BottomDrawer";
import BrandLogo from "../ui/BrandLogo";
import MonthPickerDrawer from "../ui/MonthPickerDrawer";
import MealManagerRosterDrawer from "../meals/MealManagerRosterDrawer";
import EditProfileDrawer from "../profile/EditProfileDrawer";
import { formatMonthBengali } from "../../utils/formatters";
import {
  Building2,
  Calendar,
  ChevronDown,
  LogOut,
  Plus,
  KeyRound,
  Check,
  UserCog,
  ChefHat,
  RotateCw,
  Home,
  CheckCircle2,
  AlertCircle,
  Hash,
  Pencil,
  UserCheck,
} from "lucide-react";

export const MobileAppHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { mongoUser, logout, joinHouseByCode } = useAuth();
  const {
    currentHouse,
    availableHouses,
    setCurrentHouse,
    updateHouseName,
    changeHouseManager,
    createNewHouse,
    dutyManagerUid,
    members,
    selectedMonth,
    setSelectedMonth,
    refreshData,
  } = useMess();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showHouseDrawer, setShowHouseDrawer] = useState(false);
  const [showJoinDrawer, setShowJoinDrawer] = useState(false);
  const [showRosterDrawer, setShowRosterDrawer] = useState(false);
  const [showMonthDrawer, setShowMonthDrawer] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Editable Mess Name states
  const [isEditingHouseName, setIsEditingHouseName] = useState(false);
  const [editedHouseName, setEditedHouseName] = useState(currentHouse.name);
  const [editedHouseAddress, setEditedHouseAddress] = useState(currentHouse.address || "");
  const [editSaving, setEditSaving] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState("");

  // Form states
  const [joinInputCode, setJoinInputCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMessage, setJoinMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseAddress, setNewHouseAddress] = useState("");
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

  const handleSaveHouseName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedHouseName.trim()) return;
    setEditSaving(true);
    setEditSuccessMessage("");
    const ok = await updateHouseName(editedHouseName.trim(), editedHouseAddress.trim());
    if (ok) {
      setEditSuccessMessage("মেসের নাম সফলভাবে পরিবর্তন করা হয়েছে!");
      setTimeout(() => {
        setEditSuccessMessage("");
        setIsEditingHouseName(false);
      }, 1500);
    }
    setEditSaving(false);
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinInputCode.trim()) return;

    setJoinLoading(true);
    setJoinMessage(null);

    const res = await joinHouseByCode(joinInputCode.trim());
    if (res.success) {
      setJoinMessage({ text: res.message });
      setJoinInputCode("");
      await refreshData();
      setTimeout(() => {
        setJoinMessage(null);
        setShowJoinDrawer(false);
      }, 2000);
    } else {
      setJoinMessage({ text: res.message, error: true });
    }
    setJoinLoading(false);
  };

  const handleCreateHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouseName) return;
    await createNewHouse(newHouseName, newHouseAddress);
    setNewHouseName("");
    setNewHouseAddress("");
    setShowNewHouseForm(false);
    setShowHouseDrawer(false);
  };

  const currentManager =
    members.find((m) => m.firebaseUid === currentHouse.managerFirebaseUid) ||
    members.find((m) => m.role === "manager") ||
    members[0] || {
      fullName: mongoUser?.fullName || "ম্যানেজার",
      roomNo: mongoUser?.roomNo || "N/A",
    };

  const activeDutyManager = members.find((m) => m.firebaseUid === dutyManagerUid) || members[0] || {
    fullName: mongoUser?.fullName || "সদস্য",
  };

  const desktopNavItems = [
    { label: "ড্যাশবোর্ড", href: "/dashboard" },
    { label: "মিল ক্যালেন্ডার", href: "/meals" },
    { label: "বাজার খরচ", href: "/bazaar" },
    { label: "টাকা জমা", href: "/deposits" },
    { label: "ফাইনাল লেজার", href: "/ledger" },
    { label: "ইউটিলিটি বিল", href: "/fixed-costs" },
    { label: "ব্যক্তিগত সমন্বয়", href: "/individual-bills" },
    { label: "মেস সদস্য", href: "/members" },
    { label: "প্রোফাইল", href: "/profile" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-md md:max-w-6xl lg:max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* House info chip -> Clicking opens Mess & Manager Selection */}
          <button
            onClick={() => setShowHouseDrawer(true)}
            className="flex items-center gap-2 min-w-0 text-left bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-2xl px-2.5 py-1.5 active:scale-95 transition-all shrink-0"
            title="মেস ও ম্যানেজার পরিবর্তন করুন"
          >
            <BrandLogo size="sm" />
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1">
                <h1 className="text-xs font-bold text-slate-100 truncate font-bengali leading-tight max-w-[120px] sm:max-w-[160px]">
                  {currentHouse.name}
                </h1>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
              <span className="text-[10px] text-amber-400 font-mono tracking-wider block">
                {currentHouse.joinCode || currentHouse.houseId}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (Visible on Laptop & Desktop screens) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 overflow-x-auto no-scrollbar">
            {desktopNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bengali font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right tools: Month selector & Clean User Profile menu */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Sleek Month Trigger Pill (replaces clunky browser select) */}
            <button
              onClick={() => setShowMonthDrawer(true)}
              className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-200 active:scale-95 transition-all shadow-sm group"
              title="মাস নির্বাচন করুন"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bengali text-xs text-slate-100 font-semibold whitespace-nowrap">
                {formatMonthBengali(selectedMonth, true)}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {/* User profile persona avatar -> Clean Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1.5 active:scale-95 transition-transform"
                title="প্রোফাইল মেনু"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {mongoUser?.fullName ? mongoUser.fullName.charAt(0) : "ম"}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Clean Profile Dropdown (No Demo Personas) */}
              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 font-bengali">
                  {/* Current User Card */}
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-100 truncate">
                        {mongoUser?.fullName || "ব্যবহারকারী"}
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
                    {(mongoUser?.phone || mongoUser?.roomNo) && (
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-english mt-1">
                        {mongoUser?.roomNo && <span>রুম: {mongoUser.roomNo}</span>}
                        {mongoUser?.roomNo && mongoUser?.phone && <span>•</span>}
                        {mongoUser?.phone && <span>{mongoUser.phone}</span>}
                      </div>
                    )}
                    <div className="mt-1.5 pt-1.5 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-400">
                      <span>বর্তমান মেস:</span>
                      <span className="font-semibold text-amber-300 truncate max-w-[120px]">
                        {currentHouse.name}
                      </span>
                    </div>
                  </div>

                  {/* Clean Action Links */}
                  <div className="space-y-1">
                    {/* Edit Profile Button */}
                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        setShowProfileDrawer(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 bg-amber-500/5 flex items-center justify-between transition-colors font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <span>প্রোফাইল সম্পাদনা (Edit)</span>
                      </div>
                      <Pencil className="w-3 h-3 text-amber-400/80" />
                    </button>

                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        setShowJoinDrawer(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 border border-slate-800 flex items-center gap-2 transition-colors font-medium"
                    >
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span>মেস কোড/আইডি দিয়ে যোগ দিন</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        setShowHouseDrawer(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>মেস ও ম্যানেজার সেটিংস</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/15 flex items-center gap-2 transition-colors font-semibold border-t border-slate-800 pt-2 mt-1"
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
        <div className="max-w-md md:max-w-6xl lg:max-w-7xl mx-auto pt-2 border-t border-slate-800/60 mt-2 flex items-center justify-between text-[11px] font-bengali">
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
                  {activeDutyManager.fullName}
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

      {/* Join Any Mess by Code or Unique House ID Drawer */}
      <BottomDrawer
        isOpen={showJoinDrawer}
        onClose={() => setShowJoinDrawer(false)}
        title="মেসে যুক্ত হোন (Join Mess)"
      >
        <div className="space-y-4 font-bengali">
          <p className="text-xs text-slate-400 leading-relaxed">
            যেকোনো মেসে যুক্ত হতে মেস ম্যানেজারের দেওয়া <strong>৬ অক্ষরের জয়েন কোড</strong> (যেমন: <code className="text-amber-400 font-mono">MMS-7K2X</code>) অথবা <strong>ইউনিক হাউস আইডি</strong> লিখুন।
          </p>

          {joinMessage && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                joinMessage.error
                  ? "bg-rose-500/15 border border-rose-500/30 text-rose-300"
                  : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
              }`}
            >
              {joinMessage.error ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              )}
              <span>{joinMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleJoinSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                মেস জয়েন কোড অথবা ইউনিক হাউস আইডি
              </label>
              <input
                type="text"
                placeholder="যেমন: MMS-7K2X বা HOUSE_01"
                value={joinInputCode}
                onChange={(e) => setJoinInputCode(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-mono tracking-wider focus:outline-none focus:border-amber-500/50 uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={joinLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {joinLoading ? "যুক্ত হওয়া হচ্ছে..." : "মেসে জয়েন করুন"}
            </button>
          </form>
        </div>
      </BottomDrawer>

      {/* Mess Selection & Manager Assignment Drawer */}
      <BottomDrawer
        isOpen={showHouseDrawer}
        onClose={() => {
          setShowHouseDrawer(false);
          setIsEditingHouseName(false);
        }}
        title="মেস ও ম্যানেজার ব্যবস্থাপনা"
      >
        <div className="space-y-5 font-bengali">
          {/* Active House Name with 1-Click Inline Edit Form */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  বর্তমান মেসের তথ্য:
                </span>
              </div>
              {!isEditingHouseName && (
                <button
                  type="button"
                  onClick={() => {
                    setEditedHouseName(currentHouse.name);
                    setEditedHouseAddress(currentHouse.address || "");
                    setIsEditingHouseName(true);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl active:scale-95 transition-all"
                >
                  <Pencil className="w-3 h-3" />
                  <span>নাম পরিবর্তন</span>
                </button>
              )}
            </div>

            {isEditingHouseName ? (
              <form onSubmit={handleSaveHouseName} className="space-y-2.5 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    মেসের নতুন নাম লিখুন
                  </label>
                  <input
                    type="text"
                    value={editedHouseName}
                    onChange={(e) => setEditedHouseName(e.target.value)}
                    required
                    placeholder="যেমন: ধানমন্ডি স্টার পয়েন্ট"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    ঠিকানা (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={editedHouseAddress}
                    onChange={(e) => setEditedHouseAddress(e.target.value)}
                    placeholder="যেমন: রোড ৪, ধানমন্ডি, ঢাকা"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {editSuccessMessage && (
                  <div className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    ✓ {editSuccessMessage}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={editSaving}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold active:scale-95 transition-all disabled:opacity-50 shadow-md shadow-amber-500/20"
                  >
                    {editSaving ? "সংরক্ষণ হচ্ছে..." : "✓ নাম সেভ করুন"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingHouseName(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 active:scale-95 transition-all"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="font-bold text-sm text-slate-100">
                  {currentHouse.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  কোড: <span className="font-mono text-amber-400 font-bold">{currentHouse.joinCode}</span>{" "}
                  {currentHouse.address && (
                    <span className="text-slate-500">| {currentHouse.address}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Button to Join Another Mess */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-200 block">অন্য মেসে জয়েন করতে চান?</span>
              <span className="text-[10px] text-slate-400">কোড বা আইডি দিয়ে যুক্ত হোন</span>
            </div>
            <button
              onClick={() => {
                setShowHouseDrawer(false);
                setShowJoinDrawer(true);
              }}
              className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs px-3 py-1.5 rounded-xl font-bold active:scale-95 transition-all"
            >
              কোড দিয়ে জয়েন
            </button>
          </div>

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
                        কোড: <span className="font-mono text-amber-400">{h.joinCode}</span>{" "}
                        {h.houseId && <span className="font-mono text-slate-500">({h.houseId})</span>}
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
            </p>

            <div className="space-y-1.5">
              {members.map((m) => {
                const isHouseManager =
                  m.firebaseUid === currentHouse.managerFirebaseUid ||
                  (m.role === "manager" && !members.some((x) => x.firebaseUid === currentHouse.managerFirebaseUid));
                return (
                  <button
                    key={m.firebaseUid}
                    onClick={() => {
                      if (!isHouseManager) {
                        changeHouseManager(m.firebaseUid);
                      }
                    }}
                    disabled={isHouseManager}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                      isHouseManager
                        ? "bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold cursor-default"
                        : "bg-slate-900 border border-slate-800/80 text-slate-300 hover:bg-slate-800 active:scale-98"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{m.fullName}</span>
                      <span className="text-slate-500 font-english">
                        {m.roomNo ? `(রুম ${m.roomNo})` : ""}
                      </span>
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        isHouseManager
                          ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                          : "bg-slate-800 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300"
                      }`}
                    >
                      {isHouseManager ? "👑 বর্তমান ম্যানেজার" : "ম্যানেজার করুন"}
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
                  placeholder="যেমন: মিরপুর স্টার পয়েন্ট"
                  value={newHouseName}
                  onChange={(e) => setNewHouseName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  ঠিকানা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: রোড ৩, মিরপুর ১০"
                  value={newHouseAddress}
                  onChange={(e) => setNewHouseAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  মেস তৈরি করুন
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

      {/* Month Picker Sheet */}
      <MonthPickerDrawer
        isOpen={showMonthDrawer}
        onClose={() => setShowMonthDrawer(false)}
        selectedMonth={selectedMonth}
        onSelectMonth={(m) => setSelectedMonth(m)}
      />

      {/* Edit User Profile Drawer */}
      <EditProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
      />
    </>
  );
};

export default MobileAppHeader;
