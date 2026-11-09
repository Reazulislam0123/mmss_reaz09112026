"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  calculateHouseSummary,
  IHouseSummary,
  IMemberStatement,
  IMemberProfile,
  IMealRecord,
  IBazaarRecord,
  IDepositRecord,
  IFixedCostsData,
} from "../lib/calculations";
import {
  MOCK_HOUSE,
  MOCK_USERS,
  MOCK_BAZAARS,
  MOCK_DEPOSITS,
  MOCK_FIXED_COSTS,
} from "../lib/mockData";
import { getCurrentMonth, getCurrentDate } from "../utils/formatters";

export interface IDutyShift {
  firebaseUid: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  daysCount: number;
  status: "completed" | "active" | "upcoming";
}

export interface IHouseData {
  houseId: string;
  name: string;
  address?: string;
  joinCode: string;
  managerFirebaseUid: string;
  dutyManagerUid?: string;
  dutyStartDate?: string;
  dutyEndDate?: string;
  dutyRoster?: IDutyShift[];
  status: string;
}

interface MessContextType {
  currentHouse: IHouseData;
  availableHouses: IHouseData[];
  setCurrentHouse: (house: IHouseData) => void;
  changeHouseManager: (managerUid: string) => Promise<void>;
  createNewHouse: (name: string, address?: string) => Promise<void>;
  dutyManagerUid: string;
  dutyStartDate: string;
  dutyEndDate: string;
  dutyRoster: IDutyShift[];
  handoverDutyManager: (newManagerUid: string, days?: number) => Promise<void>;
  generateDutyRoster: (daysPerPeriod?: number) => Promise<void>;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  members: IMemberProfile[];
  meals: IMealRecord[];
  bazaars: IBazaarRecord[];
  deposits: IDepositRecord[];
  fixedCosts: IFixedCostsData;
  summary: IHouseSummary;
  memberStatements: IMemberStatement[];
  addMealEntry: (date: string, uid: string, b: number, l: number, d: number) => Promise<void>;
  saveBulkMeals: (date: string, entries: { uid: string; b: number; l: number; d: number }[]) => Promise<void>;
  addBazaarEntry: (entry: Omit<IBazaarRecord, "_id">) => Promise<void>;
  deleteBazaarEntry: (id: string) => Promise<void>;
  addDepositEntry: (entry: Omit<IDepositRecord, "_id">) => Promise<void>;
  updateFixedCosts: (costs: IFixedCostsData) => Promise<void>;
  refreshData: () => Promise<void>;
  loading: boolean;
}

const MessContext = createContext<MessContextType>({} as MessContextType);

export const MessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHouse, setCurrentHouse] = useState<IHouseData>({
    ...MOCK_HOUSE,
    managerFirebaseUid: "UID_ADMIN_01",
    dutyManagerUid: "UID_MEMBER_02", // Shakil is currently on 5-6 day meal manager duty
    dutyStartDate: "2026-11-06",
    dutyEndDate: "2026-11-11",
  });

  const [availableHouses, setAvailableHouses] = useState<IHouseData[]>([
    {
      ...MOCK_HOUSE,
      managerFirebaseUid: "UID_ADMIN_01",
      dutyManagerUid: "UID_MEMBER_02",
      dutyStartDate: "2026-11-06",
      dutyEndDate: "2026-11-11",
    },
    {
      houseId: "HOUSE_MIRPUR_02",
      name: "মিরপুর স্টুডেন্ট মেস",
      address: "সেকশন ১০, মিরপুর, ঢাকা",
      joinCode: "MMS-8M3P",
      managerFirebaseUid: "UID_MEMBER_03",
      dutyManagerUid: "UID_MEMBER_03",
      status: "active",
    },
  ]);

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [members, setMembers] = useState<IMemberProfile[]>(MOCK_USERS as IMemberProfile[]);
  const [meals, setMeals] = useState<IMealRecord[]>([]);
  const [bazaars, setBazaars] = useState<IBazaarRecord[]>(MOCK_BAZAARS as IBazaarRecord[]);
  const [deposits, setDeposits] = useState<IDepositRecord[]>(MOCK_DEPOSITS as IDepositRecord[]);
  const [fixedCosts, setFixedCosts] = useState<IFixedCostsData>(MOCK_FIXED_COSTS);
  const [loading, setLoading] = useState<boolean>(false);

  // Rotating Meal Manager State
  const [dutyManagerUid, setDutyManagerUid] = useState<string>("UID_MEMBER_02");
  const [dutyStartDate, setDutyStartDate] = useState<string>("2026-11-06");
  const [dutyEndDate, setDutyEndDate] = useState<string>("2026-11-11");
  const [dutyRoster, setDutyRoster] = useState<IDutyShift[]>([]);

  // Auto-generate 5-6 days roster for members
  const generateDutyRoster = useCallback(
    async (daysPerPeriod = 6) => {
      if (!members || members.length === 0) return;

      const [yStr, mStr] = selectedMonth.split("-");
      const y = parseInt(yStr, 10);
      const m = parseInt(mStr, 10);
      const totalDays = new Date(y, m, 0).getDate();

      const roster: IDutyShift[] = [];
      let currentDay = 1;
      let memberIdx = 0;
      const today = getCurrentDate();

      while (currentDay <= totalDays) {
        const member = members[memberIdx % members.length];
        const startDay = currentDay;
        const endDay = Math.min(currentDay + daysPerPeriod - 1, totalDays);
        const startStr = `${selectedMonth}-${String(startDay).padStart(2, "0")}`;
        const endStr = `${selectedMonth}-${String(endDay).padStart(2, "0")}`;

        let status: "completed" | "active" | "upcoming" = "upcoming";
        if (today > endStr) {
          status = "completed";
        } else if (today >= startStr && today <= endStr) {
          status = "active";
          setDutyManagerUid(member.firebaseUid);
          setDutyStartDate(startStr);
          setDutyEndDate(endStr);
        }

        roster.push({
          firebaseUid: member.firebaseUid,
          name: member.fullName,
          startDate: startStr,
          endDate: endStr,
          daysCount: endDay - startDay + 1,
          status,
        });

        currentDay = endDay + 1;
        memberIdx++;
      }

      setDutyRoster(roster);

      try {
        await fetch("/api/houses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            houseId: currentHouse.houseId,
            dutyRoster: roster,
          }),
        });
      } catch (e) {}
    },
    [members, selectedMonth, currentHouse.houseId]
  );

  // Initialize roster once members are ready
  useEffect(() => {
    if (dutyRoster.length === 0 && members.length > 0) {
      generateDutyRoster(6);
    }
  }, [members, dutyRoster.length, generateDutyRoster]);

  // Handover Duty to a new manager
  const handoverDutyManager = async (newManagerUid: string, days = 6) => {
    const today = getCurrentDate();
    const todayObj = new Date();
    todayObj.setDate(todayObj.getDate() + days - 1);
    const endStr = todayObj.toISOString().split("T")[0];

    setDutyManagerUid(newManagerUid);
    setDutyStartDate(today);
    setDutyEndDate(endStr);

    // Update roster active statuses
    setDutyRoster((prev) =>
      prev.map((shift) => {
        if (shift.firebaseUid === newManagerUid) {
          return { ...shift, status: "active", startDate: today, endDate: endStr };
        }
        if (shift.status === "active") {
          return { ...shift, status: "completed" };
        }
        return shift;
      })
    );

    // Give this member entry permissions
    try {
      await fetch("/api/houses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          houseId: currentHouse.houseId,
          dutyManagerUid: newManagerUid,
          dutyStartDate: today,
          dutyEndDate: endStr,
        }),
      });

      await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: newManagerUid,
          houseId: currentHouse.houseId,
          permissions: {
            canEntryMeal: true,
            canEntryBazaar: true,
            canManagePeoples: false,
          },
        }),
      });
    } catch (e) {}
  };

  // Initialize pre-seeded meals for the month if empty
  useEffect(() => {
    if (meals.length === 0) {
      const generatedMeals: IMealRecord[] = [];
      const currentDay = new Date().getDate();
      for (let day = 1; day <= Math.min(currentDay, 10); day++) {
        const dateStr = `${selectedMonth}-${String(day).padStart(2, "0")}`;
        members.forEach((m) => {
          generatedMeals.push({
            date: dateStr,
            firebaseUid: m.firebaseUid,
            breakfast: 1,
            lunch: 1,
            dinner: 1,
            totalMeals: 3,
          });
        });
      }
      setMeals(generatedMeals);
    }
  }, [selectedMonth, members]);

  // Load live data from API if connected
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [mealsRes, bazaarsRes, depositsRes, fixedRes, membersRes, housesRes] = await Promise.allSettled([
        fetch(`/api/meals?houseId=${currentHouse.houseId}&month=${selectedMonth}`).then((r) => r.json()),
        fetch(`/api/bazaars?houseId=${currentHouse.houseId}&month=${selectedMonth}`).then((r) => r.json()),
        fetch(`/api/deposits?houseId=${currentHouse.houseId}&month=${selectedMonth}`).then((r) => r.json()),
        fetch(`/api/fixed-costs?houseId=${currentHouse.houseId}&month=${selectedMonth}`).then((r) => r.json()),
        fetch(`/api/members?houseId=${currentHouse.houseId}`).then((r) => r.json()),
        fetch(`/api/houses`).then((r) => r.json()),
      ]);

      if (mealsRes.status === "fulfilled" && mealsRes.value?.meals?.length) {
        setMeals(mealsRes.value.meals);
      }
      if (bazaarsRes.status === "fulfilled" && bazaarsRes.value?.bazaars?.length) {
        setBazaars(bazaarsRes.value.bazaars);
      }
      if (depositsRes.status === "fulfilled" && depositsRes.value?.deposits?.length) {
        setDeposits(depositsRes.value.deposits);
      }
      if (fixedRes.status === "fulfilled" && fixedRes.value?.fixedCost) {
        setFixedCosts(fixedRes.value.fixedCost);
      }
      if (membersRes.status === "fulfilled" && membersRes.value?.members?.length) {
        setMembers(membersRes.value.members);
      }
      if (housesRes.status === "fulfilled" && housesRes.value?.houses?.length) {
        setAvailableHouses(housesRes.value.houses);
        const currentServerHouse = housesRes.value.houses.find(
          (h: any) => h.houseId === currentHouse.houseId
        );
        if (currentServerHouse?.dutyManagerUid) {
          setDutyManagerUid(currentServerHouse.dutyManagerUid);
          setDutyStartDate(currentServerHouse.dutyStartDate || "");
          setDutyEndDate(currentServerHouse.dutyEndDate || "");
        }
      }
    } catch (e) {
      console.warn("API refresh fallback to mock:", e);
    } finally {
      setLoading(false);
    }
  }, [currentHouse.houseId, selectedMonth]);

  // Re-assign Mess Overall House Admin
  const changeHouseManager = async (managerUid: string) => {
    setCurrentHouse((prev) => ({ ...prev, managerFirebaseUid: managerUid }));
    setMembers((prev) =>
      prev.map((m) => ({
        ...m,
        role: m.firebaseUid === managerUid ? "manager" : "member",
      }))
    );

    try {
      await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: managerUid,
          houseId: currentHouse.houseId,
          role: "manager",
        }),
      });
    } catch (e) {}
  };

  // Create new house
  const createNewHouse = async (name: string, address?: string) => {
    const newH: IHouseData = {
      houseId: `HOUSE_${Date.now().toString(36).toUpperCase()}`,
      name,
      address: address || "",
      joinCode: `MMS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      managerFirebaseUid: members[0]?.firebaseUid || "UID_ADMIN_01",
      dutyManagerUid: members[0]?.firebaseUid || "UID_ADMIN_01",
      status: "active",
    };

    setAvailableHouses((prev) => [...prev, newH]);
    setCurrentHouse(newH);

    try {
      await fetch("/api/houses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          managerFirebaseUid: newH.managerFirebaseUid,
        }),
      });
    } catch (e) {}
  };

  // Compute live summary reactively
  const { summary, memberStatements } = calculateHouseSummary(
    members,
    meals,
    bazaars,
    deposits,
    fixedCosts,
    []
  );

  const addMealEntry = async (date: string, uid: string, b: number, l: number, d: number) => {
    const total = b + l + d;
    setMeals((prev) => {
      const filtered = prev.filter((item) => !(item.date === date && item.firebaseUid === uid));
      return [...filtered, { date, firebaseUid: uid, breakfast: b, lunch: l, dinner: d, totalMeals: total }];
    });

    try {
      await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ houseId: currentHouse.houseId, date, firebaseUid: uid, breakfast: b, lunch: l, dinner: d }),
      });
    } catch (e) {}
  };

  const saveBulkMeals = async (date: string, entries: { uid: string; b: number; l: number; d: number }[]) => {
    setMeals((prev) => {
      let updated = [...prev];
      entries.forEach((ent) => {
        updated = updated.filter((item) => !(item.date === date && item.firebaseUid === ent.uid));
        updated.push({
          date,
          firebaseUid: ent.uid,
          breakfast: ent.b,
          lunch: ent.l,
          dinner: ent.d,
          totalMeals: ent.b + ent.l + ent.d,
        });
      });
      return updated;
    });

    try {
      await fetch("/api/meals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ houseId: currentHouse.houseId, date, entries }),
      });
    } catch (e) {}
  };

  const addBazaarEntry = async (entry: Omit<IBazaarRecord, "_id">) => {
    const newEntry: IBazaarRecord = {
      ...entry,
      _id: `BAZ_${Date.now()}`,
    };
    setBazaars((prev) => [newEntry, ...prev]);

    try {
      await fetch("/api/bazaars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...entry, houseId: currentHouse.houseId, month: selectedMonth }),
      });
    } catch (e) {}
  };

  const deleteBazaarEntry = async (id: string) => {
    setBazaars((prev) => prev.filter((b) => b._id !== id));
    try {
      await fetch(`/api/bazaars?id=${id}`, { method: "DELETE" });
    } catch (e) {}
  };

  const addDepositEntry = async (entry: Omit<IDepositRecord, "_id">) => {
    const newEntry: IDepositRecord = {
      ...entry,
      _id: `DEP_${Date.now()}`,
    };
    setDeposits((prev) => [newEntry, ...prev]);

    try {
      await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...entry, houseId: currentHouse.houseId, month: selectedMonth }),
      });
    } catch (e) {}
  };

  const updateFixedCosts = async (costs: IFixedCostsData) => {
    setFixedCosts(costs);
    try {
      await fetch("/api/fixed-costs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ houseId: currentHouse.houseId, month: selectedMonth, ...costs }),
      });
    } catch (e) {}
  };

  return (
    <MessContext.Provider
      value={{
        currentHouse,
        availableHouses,
        setCurrentHouse,
        changeHouseManager,
        createNewHouse,
        dutyManagerUid,
        dutyStartDate,
        dutyEndDate,
        dutyRoster,
        handoverDutyManager,
        generateDutyRoster,
        selectedMonth,
        setSelectedMonth,
        members,
        meals,
        bazaars,
        deposits,
        fixedCosts,
        summary,
        memberStatements,
        addMealEntry,
        saveBulkMeals,
        addBazaarEntry,
        deleteBazaarEntry,
        addDepositEntry,
        updateFixedCosts,
        refreshData,
        loading,
      }}
    >
      {children}
    </MessContext.Provider>
  );
};

export const useMess = () => useContext(MessContext);
export default MessContext;
