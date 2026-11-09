"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MobileAppHeader from "../../components/layout/MobileAppHeader";
import MobileBottomNav from "../../components/layout/MobileBottomNav";
import GlassCard from "../../components/ui/GlassCard";
import Badge from "../../components/ui/Badge";
import BottomDrawer from "../../components/ui/BottomDrawer";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import {
  Crown,
  Building2,
  Users,
  ShieldAlert,
  Trash2,
  Pencil,
  LogIn,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  DoorClosed,
  Phone,
  Mail,
  UserCheck,
  RefreshCw,
} from "lucide-react";

interface IAdminHouse {
  houseId: string;
  name: string;
  address: string;
  joinCode: string;
  managerFirebaseUid: string;
  managerName: string;
  memberCount: number;
  status: string;
  createdAt: string;
}

interface IAdminUser {
  firebaseUid: string;
  email: string;
  fullName: string;
  phone: string;
  roomNo: string;
  role: "super_admin" | "manager" | "member";
  status: string;
  customRent: number;
  houseId: string;
  houseName: string;
  joinCode: string;
  createdAt: string;
}

export default function SuperAdminPage() {
  const router = useRouter();
  const { mongoUser } = useAuth();
  const { setCurrentHouse, refreshData } = useMess();

  const [activeTab, setActiveTab] = useState<"houses" | "users">("houses");
  const [houses, setHouses] = useState<IAdminHouse[]>([]);
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<{ text: string; error?: boolean } | null>(null);

  // House Edit Modal state
  const [editingHouse, setEditingHouse] = useState<IAdminHouse | null>(null);
  const [editHouseName, setEditHouseName] = useState("");
  const [editHouseAddress, setEditHouseAddress] = useState("");
  const [editHouseCode, setEditHouseCode] = useState("");

  // User Edit Modal state
  const [editingUser, setEditingUser] = useState<IAdminUser | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserPhone, setEditUserPhone] = useState("");
  const [editUserRoom, setEditUserRoom] = useState("");
  const [editUserRole, setEditUserRole] = useState<"super_admin" | "manager" | "member">("member");
  const [editUserHouseId, setEditUserHouseId] = useState("");
  const [editUserRent, setEditUserRent] = useState(0);

  // New House Form State
  const [showCreateHouse, setShowCreateHouse] = useState(false);
  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseAddress, setNewHouseAddress] = useState("");

  const isSuperAdmin =
    mongoUser?.role === "super_admin" ||
    mongoUser?.email?.toLowerCase() === "reazul.islam6164@gmail.com";

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [hRes, uRes] = await Promise.all([
        fetch("/api/admin/houses").then((r) => r.json()),
        fetch("/api/admin/users").then((r) => r.json()),
      ]);

      if (hRes.success) setHouses(hRes.houses);
      if (uRes.success) setUsers(uRes.users);
    } catch (e) {
      console.error("Admin data load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // House Action Handlers
  const handleSwitchToHouse = async (house: IAdminHouse) => {
    setCurrentHouse({
      houseId: house.houseId,
      name: house.name,
      address: house.address,
      joinCode: house.joinCode,
      managerFirebaseUid: house.managerFirebaseUid,
      status: "active",
    });
    await refreshData();
    setFeedback({ text: `'${house.name}' মেসে সুপার অ্যাডমিন হিসেবে প্রবেশ করেছেন!` });
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  const handleSaveHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHouse) return;

    try {
      const res = await fetch("/api/admin/houses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          houseId: editingHouse.houseId,
          name: editHouseName,
          address: editHouseAddress,
          joinCode: editHouseCode,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ text: data.message || "মেস সফলভাবে আপডেট হয়েছে!" });
        setEditingHouse(null);
        await fetchAdminData();
        await refreshData();
      } else {
        setFeedback({ text: data.error || "আপডেট ব্যর্থ হয়েছে", error: true });
      }
    } catch (e: any) {
      setFeedback({ text: e.message || "সার্ভার এরর", error: true });
    }
  };

  const handleDeleteHouse = async (house: IAdminHouse) => {
    if (
      !confirm(
        `সতর্কতা: আপনি কি নিশ্চিতভাবে '${house.name}' (${house.joinCode}) মেসটি সম্পূর্ণ মুছে ফেলতে চান? মেসের সকল মিল ও খরচের তথ্য মুছে যাবে!`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/houses?houseId=${house.houseId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ text: data.message });
        await fetchAdminData();
        await refreshData();
      } else {
        setFeedback({ text: data.error || "ডিলিট ব্যর্থ হয়েছে", error: true });
      }
    } catch (e: any) {
      setFeedback({ text: e.message || "সার্ভার এরর", error: true });
    }
  };

  const handleCreateNewHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouseName.trim()) return;

    try {
      const res = await fetch("/api/houses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newHouseName.trim(),
          address: newHouseAddress.trim(),
          managerFirebaseUid: mongoUser?.firebaseUid,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ text: "নতুন মেস সফলভাবে তৈরি হয়েছে!" });
        setNewHouseName("");
        setNewHouseAddress("");
        setShowCreateHouse(false);
        await fetchAdminData();
      } else {
        setFeedback({ text: data.error || "তৈরি ব্যর্থ হয়েছে", error: true });
      }
    } catch (e: any) {
      setFeedback({ text: e.message, error: true });
    }
  };

  // User Action Handlers
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: editingUser.firebaseUid,
          fullName: editUserName,
          phone: editUserPhone,
          roomNo: editUserRoom,
          role: editUserRole,
          houseId: editUserHouseId,
          customRent: editUserRent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ text: data.message || "সদস্য তথ্য সফলভাবে আপডেট হয়েছে!" });
        setEditingUser(null);
        await fetchAdminData();
        await refreshData();
      } else {
        setFeedback({ text: data.error || "আপডেট ব্যর্থ হয়েছে", error: true });
      }
    } catch (e: any) {
      setFeedback({ text: e.message || "সার্ভার এরর", error: true });
    }
  };

  const handleDeleteUser = async (user: IAdminUser) => {
    if (user.email === "reazul.islam6164@gmail.com") {
      alert("প্রধান সুপার অ্যাডমিন অ্যাকাউন্ট ডিলিট করা সম্ভব নয়!");
      return;
    }

    if (
      !confirm(
        `সতর্কতা: আপনি কি নিশ্চিতভাবে সদস্য '${user.fullName}' (${user.email}) কে স্থায়ীভাবে ডিলিট করতে চান?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?firebaseUid=${user.firebaseUid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ text: data.message });
        await fetchAdminData();
        await refreshData();
      } else {
        setFeedback({ text: data.error || "ডিলিট ব্যর্থ হয়েছে", error: true });
      }
    } catch (e: any) {
      setFeedback({ text: e.message || "সার্ভার এরর", error: true });
    }
  };

  // Filtered lists
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.houseName.toLowerCase().includes(q) ||
      u.roomNo.includes(q)
    );
  });

  const filteredHouses = houses.filter((h) => {
    const q = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.joinCode.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      h.managerName.toLowerCase().includes(q)
    );
  });

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 font-bengali">
        <GlassCard className="p-8 max-w-md w-full text-center space-y-4 border-rose-500/30">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-rose-400">অননুমোদিত প্রবেশাধিকার!</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            এই পেজটি শুধুমাত্র অনুমোদিত <strong>সুপার অ্যাডমিনদের</strong> জন্য সংরক্ষিত। সাধারণ সদস্য বা মেস ম্যানেজারদের প্রবেশাধিকার নেই।
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all"
          >
            ড্যাশবোর্ডে ফিরে যান
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <MobileAppHeader />

      <main className="max-w-md md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5 font-bengali">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-100">
                  সুপার অ্যাডমিন মাস্টার কন্ট্রোল
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  সর্বময় ক্ষমতা
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                যেকোনো মেস, সদস্য এডিট, ডিলিট ও সম্পূর্ণ ব্যবস্থাপনা করুন
              </p>
            </div>
          </div>

          {/* Quick Refresh Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? "animate-spin" : ""}`} />
              <span>রিফ্রেশ</span>
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all"
            >
              <span>ড্যাশবোর্ড</span>
            </Link>
          </div>
        </div>

        {/* Feedback alert banner */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2.5 animate-in fade-in ${
              feedback.error
                ? "bg-rose-500/15 border border-rose-500/30 text-rose-300"
                : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.error ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              )}
              <span className="font-semibold">{feedback.text}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs opacity-75 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* 3 Overview KPI Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <GlassCard className="p-3.5 sm:p-4 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border-amber-500/30">
            <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
              <span className="font-bold">মোট মেস সংখ্যা</span>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-100 font-english">
              {houses.length} টি
            </div>
            <span className="text-[11px] text-slate-400">সিস্টেমে রেজিস্টার্ড</span>
          </GlassCard>

          <GlassCard className="p-3.5 sm:p-4 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-950 border-indigo-500/30">
            <div className="flex items-center justify-between text-xs text-indigo-400 mb-1">
              <span className="font-bold">মোট মেম্বার</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-100 font-english">
              {users.length} জন
            </div>
            <span className="text-[11px] text-slate-400">সকল মেস মিলিয়ে</span>
          </GlassCard>

          <GlassCard className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 border-emerald-500/30">
            <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
              <span className="font-bold">সুপার অ্যাডমিন অ্যাকাউন্ট</span>
              <Crown className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-100 font-english truncate">
              {mongoUser?.email}
            </div>
            <span className="text-[11px] text-emerald-300">ফুল এডিটর ও ডিলিট অ্যাক্সেস</span>
          </GlassCard>
        </div>

        {/* Tab Buttons & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("houses")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "houses"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>মেস ব্যবস্থাপনা ({houses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>সদস্য ব্যবস্থাপনা ({users.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === "houses" ? "মেসের নাম, কোড দিয়ে খুঁজুন..." : "সদস্যের নাম, ইমেইল, রুম..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* TAB 1: ALL MESSES MANAGEMENT */}
        {activeTab === "houses" && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-300">
                সকল মেস তালিকা ({filteredHouses.length} টি)
              </h2>
              <button
                onClick={() => setShowCreateHouse(true)}
                className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন মেস যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredHouses.map((h) => (
                <GlassCard key={h.houseId} className="p-4 flex flex-col justify-between space-y-3 border-slate-800 hover:border-slate-700 transition-all">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-100 text-base leading-tight">
                          {h.name}
                        </h3>
                        {h.address && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{h.address}</p>
                        )}
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg shrink-0">
                        {h.joinCode}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>বর্তমান ম্যানেজার:</span>
                        <strong className="text-slate-200">{h.managerName}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>মোট সদস্য:</span>
                        <strong className="text-amber-300 font-english">{h.memberCount} জন</strong>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-english">
                        <span>House ID:</span>
                        <span>{h.houseId}</span>
                      </div>
                    </div>
                  </div>

                  {/* House Action Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-850">
                    <button
                      onClick={() => handleSwitchToHouse(h)}
                      className="flex items-center justify-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold py-2 rounded-xl active:scale-95 transition-all"
                      title="এই মেসে সুইচ করুন"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>প্রবেশ</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingHouse(h);
                        setEditHouseName(h.name);
                        setEditHouseAddress(h.address);
                        setEditHouseCode(h.joinCode);
                      }}
                      className="flex items-center justify-center gap-1 bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-semibold py-2 rounded-xl active:scale-95 transition-all"
                      title="মেসের নাম/ঠিকানা এডিট করুন"
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-400" />
                      <span>এডিট</span>
                    </button>

                    <button
                      onClick={() => handleDeleteHouse(h)}
                      className="flex items-center justify-center gap-1 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-semibold py-2 rounded-xl active:scale-95 transition-all"
                      title="মেস স্থায়ীভাবে ডিলিট করুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ডিলিট</span>
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ALL USERS / MEMBERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-3.5">
            <h2 className="text-sm font-bold text-slate-300">
              সকল সদস্য তালিকা ({filteredUsers.length} জন)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredUsers.map((u) => {
                const isSuper = u.role === "super_admin";
                const isMgr = u.role === "manager";
                return (
                  <GlassCard key={u.firebaseUid} className="p-4 flex flex-col justify-between space-y-3 border-slate-800 hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-100 text-sm truncate">
                              {u.fullName}
                            </h3>
                            <Badge variant={isSuper ? "amber" : isMgr ? "amber" : "slate"}>
                              {isSuper ? "👑 সুপার" : isMgr ? "ম্যানেজার" : "সদস্য"}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 font-english truncate mt-0.5">
                            {u.email}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>মেস:</span>
                          <span className="text-slate-200 font-semibold truncate max-w-[150px]">
                            {u.houseName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>রুম ও ফোন:</span>
                          <span className="text-slate-300 font-english">
                            {u.roomNo ? `রুম ${u.roomNo}` : "-"} {u.phone ? `| ${u.phone}` : ""}
                          </span>
                        </div>
                        {u.customRent > 0 && (
                          <div className="flex items-center justify-between">
                            <span>সিট ভাড়া:</span>
                            <span className="text-amber-300 font-english">৳ {u.customRent}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setEditUserName(u.fullName);
                          setEditUserPhone(u.phone);
                          setEditUserRoom(u.roomNo);
                          setEditUserRole(u.role);
                          setEditUserHouseId(u.houseId);
                          setEditUserRent(u.customRent || 0);
                        }}
                        className="flex items-center justify-center gap-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-semibold py-2 rounded-xl active:scale-95 transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-400" />
                        <span>সদস্য এডিট</span>
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u)}
                        disabled={u.email === "reazul.islam6164@gmail.com"}
                        className="flex items-center justify-center gap-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-semibold py-2 rounded-xl active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ডিলিট</span>
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* EDIT HOUSE DRAWER */}
      <BottomDrawer
        isOpen={Boolean(editingHouse)}
        onClose={() => setEditingHouse(null)}
        title="মেসের তথ্য সম্পাদনা (Edit Mess)"
      >
        {editingHouse && (
          <form onSubmit={handleSaveHouse} className="space-y-3 font-bengali">
            <div>
              <label className="text-xs text-slate-400 block mb-1">মেসের নাম *</label>
              <input
                type="text"
                required
                value={editHouseName}
                onChange={(e) => setEditHouseName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-bold focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">ঠিকানা</label>
              <input
                type="text"
                value={editHouseAddress}
                onChange={(e) => setEditHouseAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">মেস জয়েন কোড (৬ অক্ষর)</label>
              <input
                type="text"
                required
                value={editHouseCode}
                onChange={(e) => setEditHouseCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-amber-400 uppercase tracking-wider focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95"
              >
                ✓ মেস তথ্য সেভ করুন
              </button>
              <button
                type="button"
                onClick={() => setEditingHouse(null)}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                বাতিল
              </button>
            </div>
          </form>
        )}
      </BottomDrawer>

      {/* EDIT USER DRAWER */}
      <BottomDrawer
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title="সদস্য তথ্য সম্পাদনা (Edit User)"
      >
        {editingUser && (
          <form onSubmit={handleSaveUser} className="space-y-3 font-bengali">
            <div>
              <label className="text-xs text-slate-400 block mb-1">সদস্যের নাম *</label>
              <input
                type="text"
                required
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-semibold focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  value={editUserPhone}
                  onChange={(e) => setEditUserPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">রুম নম্বর</label>
                <input
                  type="text"
                  value={editUserRoom}
                  onChange={(e) => setEditUserRoom(e.target.value)}
                  placeholder="যেমন: 302"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">ভূমিকা / রোল</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="member">মেস মেম্বার</option>
                  <option value="manager">মেস ম্যানেজার</option>
                  <option value="super_admin">সুপার অ্যাডমিন</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">মেস নির্ধারণ</label>
                <select
                  value={editUserHouseId}
                  onChange={(e) => setEditUserHouseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                >
                  {houses.map((h) => (
                    <option key={h.houseId} value={h.houseId}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">সিট ভাড়া (টাকা)</label>
              <input
                type="number"
                value={editUserRent}
                onChange={(e) => setEditUserRent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-english focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95"
              >
                ✓ সদস্য তথ্য সেভ করুন
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                বাতিল
              </button>
            </div>
          </form>
        )}
      </BottomDrawer>

      {/* CREATE NEW HOUSE DRAWER */}
      <BottomDrawer
        isOpen={showCreateHouse}
        onClose={() => setShowCreateHouse(false)}
        title="নতুন মেস তৈরি করুন"
      >
        <form onSubmit={handleCreateNewHouse} className="space-y-3 font-bengali">
          <div>
            <label className="text-xs text-slate-400 block mb-1">মেসের নাম *</label>
            <input
              type="text"
              required
              placeholder="যেমন: মিরপুর ডিওএইচএস ব্যাচেলর হোম"
              value={newHouseName}
              onChange={(e) => setNewHouseName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-bold focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">ঠিকানা</label>
            <input
              type="text"
              placeholder="যেমন: রোড ১২, মিরপুর, ঢাকা"
              value={newHouseAddress}
              onChange={(e) => setNewHouseAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95"
            >
              ✓ মেস তৈরি করুন
            </button>
            <button
              type="button"
              onClick={() => setShowCreateHouse(false)}
              className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              বাতিল
            </button>
          </div>
        </form>
      </BottomDrawer>

      <MobileBottomNav />
    </div>
  );
}
