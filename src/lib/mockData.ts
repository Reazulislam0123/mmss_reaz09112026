/**
 * Pre-seeded realistic Bangladeshi Bachelor Mess mock data
 * Used for offline demo and initial testing
 */

export const MOCK_HOUSE = {
  houseId: "HOUSE_DHAKA_01",
  name: "ধানমন্ডি ব্যাচেলর পয়েন্ট",
  address: "রোড ৪/এ, ধানমন্ডি, ঢাকা ১২০৯",
  joinCode: "MMS-7K2X",
  status: "active",
};

export const MOCK_USERS = [
  {
    firebaseUid: "UID_ADMIN_01",
    email: "manager@smartmms.bd",
    fullName: "তানভীর আহমেদ (ম্যানেজার)",
    phone: "01711000001",
    roomNo: "৩০১",
    role: "manager",
    status: "active",
    customRent: 4500,
  },
  {
    firebaseUid: "UID_MEMBER_02",
    email: "shakil@smartmms.bd",
    fullName: "শাকিল হোসেন",
    phone: "01811000002",
    roomNo: "৩০২",
    role: "member",
    status: "active",
    customRent: 4000,
  },
  {
    firebaseUid: "UID_MEMBER_03",
    email: "rakib@smartmms.bd",
    fullName: "রাকিবুল হাসান",
    phone: "01911000003",
    roomNo: "৩০৩",
    role: "member",
    status: "active",
    customRent: 4000,
  },
  {
    firebaseUid: "UID_MEMBER_04",
    email: "arif@smartmms.bd",
    fullName: "আরিফুল ইসলাম",
    phone: "01611000004",
    roomNo: "৩০৩",
    role: "member",
    status: "active",
    customRent: 3500,
  },
];

export const MOCK_BAZAARS = [
  {
    _id: "BAZ_01",
    date: "2026-11-01",
    month: "2026-11",
    itemDetails: "মিনিকেট চাল ২৫ কেজি, মসুর ডাল ২ কেজি, তেল ৫ লিটার",
    category: "Grocery/মুদি",
    cost: 3200,
    paidByUid: "UID_ADMIN_01",
  },
  {
    _id: "BAZ_02",
    date: "2026-11-03",
    month: "2026-11",
    itemDetails: "রুই মাছ ২.৫ কেজি, মুরগি ৩ কেজি, আলু ৫ কেজি",
    category: "Meat-Fish/মাছ-মাংস",
    cost: 2150,
    paidByUid: "UID_MEMBER_02",
  },
  {
    _id: "BAZ_03",
    date: "2026-11-05",
    month: "2026-11",
    itemDetails: "পেঁয়াজ, রসুন, আদা, কাঁচামরিচ, ডিম ৩০টি",
    category: "Spices/তেল-মসলা",
    cost: 1450,
    paidByUid: "UID_MEMBER_03",
  },
  {
    _id: "BAZ_04",
    date: "2026-11-07",
    month: "2026-11",
    itemDetails: "বেগুন, পটল, মিষ্টি কুমড়া, ফুলকপি ও শাকসবজি",
    category: "Vegetables/সবজি",
    cost: 650,
    paidByUid: "UID_ADMIN_01",
  },
];

export const MOCK_DEPOSITS = [
  {
    _id: "DEP_01",
    date: "2026-11-01",
    month: "2026-11",
    firebaseUid: "UID_ADMIN_01",
    amount: 5000,
    paymentMethod: "bKash",
    trxId: "BKH98273611",
    notes: "নভেম্বরের অগ্রিম মেস জমা",
    status: "approved",
  },
  {
    _id: "DEP_02",
    date: "2026-11-02",
    month: "2026-11",
    firebaseUid: "UID_MEMBER_02",
    amount: 4500,
    paymentMethod: "Nagad",
    trxId: "NGD71625344",
    notes: "নভেম্বর মিল ও সিট ভাড়া",
    status: "approved",
  },
  {
    _id: "DEP_03",
    date: "2026-11-03",
    month: "2026-11",
    firebaseUid: "UID_MEMBER_03",
    amount: 4500,
    paymentMethod: "Cash",
    trxId: "CASH-01",
    notes: "হাতে ক্যাশ দেওয়া হয়েছে",
    status: "approved",
  },
  {
    _id: "DEP_04",
    date: "2026-11-04",
    month: "2026-11",
    firebaseUid: "UID_MEMBER_04",
    amount: 4000,
    paymentMethod: "bKash",
    trxId: "BKH55443322",
    notes: "অগ্রিম মিল জমা",
    status: "approved",
  },
];

export const MOCK_FIXED_COSTS = {
  month: "2026-11",
  rent: 0, // Individual room rents tracked per member
  electricity: 1850,
  gasWater: 1400,
  cookBill: 4000,
  wifi: 1000,
  other: 500, // ময়লা বিল ইত্যাদি
};

