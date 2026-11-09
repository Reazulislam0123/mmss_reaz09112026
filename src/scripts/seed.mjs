import mongoose from "mongoose";

const uri = "mongodb+srv://MMS_Reez:2ljIqqWU17KYH2ha@cluster0.zqern1c.mongodb.net/smart_mms?retryWrites=true&w=majority";

console.log("Seeding MongoDB Atlas with initial mess records...");

await mongoose.connect(uri);

const db = mongoose.connection.db;

// 1. Seed House
const housesColl = db.collection("houses");
await housesColl.updateOne(
  { houseId: "HOUSE_DHAKA_01" },
  {
    $set: {
      houseId: "HOUSE_DHAKA_01",
      name: "ধানমন্ডি ব্যাচেলর পয়েন্ট",
      address: "রোড ৪/এ, ধানমন্ডি, ঢাকা ১২০৯",
      managerFirebaseUid: "UID_ADMIN_01",
      joinCode: "MMS-7K2X",
      status: "active",
      updatedAt: new Date(),
    },
    $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true }
);

// 2. Seed Users
const usersColl = db.collection("users");
const users = [
  {
    firebaseUid: "UID_ADMIN_01",
    email: "manager@smartmms.bd",
    fullName: "তানভীর আহমেদ (ম্যানেজার)",
    phone: "01711000001",
    houseId: "HOUSE_DHAKA_01",
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
    houseId: "HOUSE_DHAKA_01",
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
    houseId: "HOUSE_DHAKA_01",
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
    houseId: "HOUSE_DHAKA_01",
    roomNo: "৩০৩",
    role: "member",
    status: "active",
    customRent: 3500,
  },
];

for (const u of users) {
  await usersColl.updateOne(
    { firebaseUid: u.firebaseUid },
    { $set: { ...u, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
}

// 3. Seed Fixed Costs
const fixedCostsColl = db.collection("fixed_costs");
await fixedCostsColl.updateOne(
  { houseId: "HOUSE_DHAKA_01", month: "2026-11" },
  {
    $set: {
      houseId: "HOUSE_DHAKA_01",
      month: "2026-11",
      rent: 0,
      electricity: 1850,
      gasWater: 1400,
      cookBill: 4000,
      wifi: 1000,
      other: 500,
      updatedAt: new Date(),
    },
  },
  { upsert: true }
);

// 4. Seed Bazaar Records
const bazaarsColl = db.collection("bazaars");
const bazaarsCount = await bazaarsColl.countDocuments({ houseId: "HOUSE_DHAKA_01" });
if (bazaarsCount === 0) {
  await bazaarsColl.insertMany([
    {
      houseId: "HOUSE_DHAKA_01",
      date: "2026-11-01",
      month: "2026-11",
      itemDetails: "মিনিকেট চাল ২৫ কেজি, মসুর ডাল ২ কেজি, তেল ৫ লিটার",
      category: "Grocery/মুদি",
      cost: 3200,
      paidByUid: "UID_ADMIN_01",
      createdAt: new Date(),
    },
    {
      houseId: "HOUSE_DHAKA_01",
      date: "2026-11-03",
      month: "2026-11",
      itemDetails: "রুই মাছ ২.৫ কেজি, মুরগি ৩ কেজি, আলু ৫ কেজি",
      category: "Meat-Fish/মাছ-মাংস",
      cost: 2150,
      paidByUid: "UID_MEMBER_02",
      createdAt: new Date(),
    },
    {
      houseId: "HOUSE_DHAKA_01",
      date: "2026-11-05",
      month: "2026-11",
      itemDetails: "পেঁয়াজ, রসুন, আদা, কাঁচামরিচ, ডিম ৩০টি",
      category: "Spices/তেল-মসলা",
      cost: 1450,
      paidByUid: "UID_MEMBER_03",
      createdAt: new Date(),
    },
    {
      houseId: "HOUSE_DHAKA_01",
      date: "2026-11-07",
      month: "2026-11",
      itemDetails: "বেগুন, পটল, মিষ্টি কুমড়া, ফুলকপি ও শাকসবজি",
      category: "Vegetables/সবজি",
      cost: 650,
      paidByUid: "UID_ADMIN_01",
      createdAt: new Date(),
    },
  ]);
}

// 5. Seed Deposits
const depositsColl = db.collection("deposits");
const depositsCount = await depositsColl.countDocuments({ houseId: "HOUSE_DHAKA_01" });
if (depositsCount === 0) {
  await depositsColl.insertMany([
    {
      houseId: "HOUSE_DHAKA_01",
      date: "2026-11-01",
      month: "2026-11",
      firebaseUid: "UID_ADMIN_01",
      amount: 5000,
      paymentMethod: "bKash",
      trxId: "BKH98273611",
      notes: "নভেম্বরের অগ্রিম মেস জমা",
      status: "approved",
      createdAt: new Date(),
    },
    {
      houseId: "HOUSE_DHAKA_01",
      date: "2026-11-02",
      month: "2026-11",
      firebaseUid: "UID_MEMBER_02",
      amount: 4500,
      paymentMethod: "Nagad",
      trxId: "NGD71625344",
      notes: "নভেম্বর মিল ও সিট ভাড়া",
      status: "approved",
      createdAt: new Date(),
    },
    {
      houseId: "HOUSE_DHAKA_01",
      date: "2026-11-03",
      month: "2026-11",
      firebaseUid: "UID_MEMBER_03",
      amount: 4500,
      paymentMethod: "Cash",
      trxId: "CASH-01",
      notes: "হাতে ক্যাশ দেওয়া হয়েছে",
      status: "approved",
      createdAt: new Date(),
    },
    {
      houseId: "HOUSE_DHAKA_01",
      date: "2026-11-04",
      month: "2026-11",
      firebaseUid: "UID_MEMBER_04",
      amount: 4000,
      paymentMethod: "bKash",
      trxId: "BKH55443322",
      notes: "অগ্রিম মিল জমা",
      status: "approved",
      createdAt: new Date(),
    },
  ]);
}

// 6. Seed Daily Meals (Days 1 to 9)
const mealsColl = db.collection("meals");
for (let d = 1; d <= 9; d++) {
  const dateStr = `2026-11-${String(d).padStart(2, "0")}`;
  for (const u of users) {
    await mealsColl.updateOne(
      { houseId: "HOUSE_DHAKA_01", date: dateStr, firebaseUid: u.firebaseUid },
      {
        $set: {
          houseId: "HOUSE_DHAKA_01",
          date: dateStr,
          firebaseUid: u.firebaseUid,
          breakfast: 1,
          lunch: 1,
          dinner: 1,
          totalMeals: 3,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }
}

console.log("✅ Seed data successfully inserted into MongoDB Atlas!");
await mongoose.disconnect();

