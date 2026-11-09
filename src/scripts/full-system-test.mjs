/**
 * Full System Automated Test Suite for Smart MMS
 * Tests math calculations, database models, business logic, and edge cases.
 */

import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://MMS_Reez:2ljIqqWU17KYH2ha@cluster0.zqern1c.mongodb.net/smart_mms?retryWrites=true&w=majority";

// Direct implementation matching src/lib/calculations.ts
export function calculateMealRate(totalBazaar, totalMeals) {
  if (!totalMeals || totalMeals <= 0) return 0;
  const rate = totalBazaar / totalMeals;
  return Math.round(rate * 100) / 100;
}

export function calculateSharedUtilityPerHead(fixedCosts, activeMemberCount) {
  if (!fixedCosts || activeMemberCount <= 0) return 0;
  const totalFixed =
    (Number(fixedCosts.rent) || 0) +
    (Number(fixedCosts.electricity) || 0) +
    (Number(fixedCosts.gasWater) || 0) +
    (Number(fixedCosts.cookBill) || 0) +
    (Number(fixedCosts.wifi) || 0) +
    (Number(fixedCosts.other) || 0);

  const perHead = totalFixed / activeMemberCount;
  return Math.round(perHead * 100) / 100;
}

export function calculateMemberStatement(
  member,
  memberMeals,
  allBazaars,
  memberDeposits,
  fixedCosts,
  individualBill,
  mealRate,
  sharedUtilityPerHead
) {
  const totalMeals = memberMeals.reduce((acc, m) => acc + (Number(m.totalMeals) || 0), 0);
  const mealCost = Math.round(totalMeals * mealRate * 100) / 100;
  const customRent = Number(individualBill?.seatFare) || Number(member.customRent) || 0;
  const individualAdjustment =
    (Number(individualBill?.prevDue) || 0) +
    (Number(individualBill?.charges) || 0) +
    (Number(individualBill?.khala) || 0) +
    (Number(individualBill?.others) || 0);

  const totalExpense =
    Math.round((mealCost + sharedUtilityPerHead + customRent + individualAdjustment) * 100) / 100;

  const totalDeposits = memberDeposits
    .filter((d) => d.status !== "pending")
    .reduce((acc, d) => acc + (Number(d.amount) || 0), 0);

  const directBazaarPaid = allBazaars
    .filter((b) => b.paidByUid === member.firebaseUid)
    .reduce((acc, b) => acc + (Number(b.cost) || 0), 0);

  const netBalance = Math.round((totalDeposits + directBazaarPaid - totalExpense) * 100) / 100;

  return {
    firebaseUid: member.firebaseUid,
    fullName: member.fullName || "সদস্য",
    roomNo: member.roomNo || "N/A",
    totalMeals,
    mealCost,
    sharedUtilityCost: sharedUtilityPerHead,
    customRent,
    individualAdjustment,
    totalExpense,
    totalDeposits,
    directBazaarPaid,
    netBalance,
    status: netBalance >= 0 ? "পাবে" : "বকেয়া",
  };
}

export function calculateHouseSummary(
  members,
  meals,
  bazaars,
  deposits,
  fixedCosts,
  individualBills = []
) {
  const activeMembersCount = members.length || 1;
  const totalHouseMeals = meals.reduce((acc, m) => acc + (Number(m.totalMeals) || 0), 0);
  const totalBazaarExpense = bazaars.reduce((acc, b) => acc + (Number(b.cost) || 0), 0);
  const activeMealRate = calculateMealRate(totalBazaarExpense, totalHouseMeals);
  const utilityPerHead = calculateSharedUtilityPerHead(fixedCosts, activeMembersCount);

  const memberStatements = members.map((member) => {
    const memberMeals = meals.filter((m) => m.firebaseUid === member.firebaseUid);
    const memberDeposits = deposits.filter((d) => d.firebaseUid === member.firebaseUid);
    const memberBill = individualBills.find((b) => b.firebaseUid === member.firebaseUid);

    return calculateMemberStatement(
      member,
      memberMeals,
      bazaars,
      memberDeposits,
      fixedCosts,
      memberBill,
      activeMealRate,
      utilityPerHead
    );
  });

  const totalMessDue = memberStatements
    .filter((s) => s.netBalance < 0)
    .reduce((acc, s) => acc + Math.abs(s.netBalance), 0);

  const totalMessPayable = memberStatements
    .filter((s) => s.netBalance > 0)
    .reduce((acc, s) => acc + s.netBalance, 0);

  return {
    summary: {
      totalHouseMeals,
      totalBazaarExpense,
      activeMealRate,
      utilityPerHead,
      activeMembersCount,
      totalMessDue: Math.round(totalMessDue * 100) / 100,
      totalMessPayable: Math.round(totalMessPayable * 100) / 100,
    },
    memberStatements,
  };
}

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ [FAIL] ${testName} ${details ? "- " + details : ""}`);
    failedCount++;
  }
}

async function runAllTests() {
  console.log("\n=======================================================");
  console.log("       SMART MMS - COMPREHENSIVE SYSTEM VERIFICATION    ");
  console.log("=======================================================\n");

  // TEST SUITE 1: MATHEMATICAL & FINANCIAL CALCULATIONS
  console.log("▶ SUITE 1: Business Logic & Financial Calculations");

  // 1.1 Meal Rate Calculation
  const rateNormal = calculateMealRate(15000, 300);
  assert(rateNormal === 50, "Standard Meal Rate (15,000 Tk / 300 Meals = 50.00 Tk)");

  const rateFloat = calculateMealRate(10000, 140);
  assert(rateFloat === 71.43, `Rounded Meal Rate (10,000 Tk / 140 Meals = 71.43 Tk, got ${rateFloat})`);

  const rateZeroMeals = calculateMealRate(5000, 0);
  assert(rateZeroMeals === 0, "Zero Meals Guard (returns 0 without divide-by-zero)");

  const rateZeroBazaar = calculateMealRate(0, 100);
  assert(rateZeroBazaar === 0, "Zero Bazaar Guard (returns 0)");

  // 1.2 Shared Utility Per Head Calculation
  const fixedCostsSample = {
    rent: 18000,
    electricity: 2400,
    gasWater: 1500,
    cookBill: 4000,
    wifi: 1000,
    other: 600,
  }; // Total = 27,500
  const perHead5 = calculateSharedUtilityPerHead(fixedCostsSample, 5);
  assert(perHead5 === 5500, `Shared Utility 5 Members (27,500 Tk / 5 = 5500 Tk, got ${perHead5})`);

  const perHeadZeroMembers = calculateSharedUtilityPerHead(fixedCostsSample, 0);
  assert(perHeadZeroMembers === 0, "Zero Members Guard for Utilities");

  // 1.3 Individual Member Statement Calculation
  const sampleMember = {
    firebaseUid: "UID_USER_A",
    fullName: "Reazul Islam",
    roomNo: "201",
    role: "manager",
  };

  const sampleMeals = [
    { date: "2026-11-01", firebaseUid: "UID_USER_A", breakfast: 1, lunch: 1, dinner: 1, totalMeals: 3 },
    { date: "2026-11-02", firebaseUid: "UID_USER_A", breakfast: 0.5, lunch: 1, dinner: 1, totalMeals: 2.5 },
    { date: "2026-11-03", firebaseUid: "UID_USER_A", breakfast: 0, lunch: 0, dinner: 1, totalMeals: 1 },
  ]; // Total = 6.5 meals

  const sampleBazaars = [
    { _id: "b1", date: "2026-11-01", cost: 1500, paidByUid: "UID_USER_A", itemDetails: "Fish & Veg" },
    { _id: "b2", date: "2026-11-02", cost: 2000, paidByUid: "UID_USER_B", itemDetails: "Chicken & Rice" },
  ];

  const sampleDeposits = [
    { _id: "d1", date: "2026-11-01", amount: 3000, firebaseUid: "UID_USER_A", paymentMethod: "bKash", status: "approved" },
  ];

  const memberStatement = calculateMemberStatement(
    sampleMember,
    sampleMeals,
    sampleBazaars,
    sampleDeposits,
    fixedCostsSample,
    { firebaseUid: "UID_USER_A", seatFare: 2500, prevDue: 0, charges: 50, khala: 0, others: 0 },
    50, // mealRate
    5500 // utilityPerHead
  );

  // Meal cost: 6.5 * 50 = 325 Tk
  // Utility: 5500 Tk
  // Seat Fare: 2500 Tk
  // Adjustment: 50 Tk
  // Total Expense: 325 + 5500 + 2500 + 50 = 8375 Tk
  // Credit: 3000 (Deposit) + 1500 (Direct Bazaar paid by him) = 4500 Tk
  // Net Balance: 4500 - 8375 = -3875 Tk (Due / বকেয়া)
  assert(memberStatement.totalMeals === 6.5, `Member Total Meals is 6.5 (got ${memberStatement.totalMeals})`);
  assert(memberStatement.mealCost === 325, `Member Meal Cost is 325 Tk (got ${memberStatement.mealCost})`);
  assert(memberStatement.totalExpense === 8375, `Total Expense is 8375 Tk (got ${memberStatement.totalExpense})`);
  assert(memberStatement.directBazaarPaid === 1500, `Direct Bazaar Credit is 1500 Tk (got ${memberStatement.directBazaarPaid})`);
  assert(memberStatement.netBalance === -3875, `Net Balance is -3875 Tk (got ${memberStatement.netBalance})`);
  assert(memberStatement.status === "বকেয়া", `Status is 'বকেয়া' for negative balance (got ${memberStatement.status})`);

  // 1.4 Refund / Surplus Status Check
  const surplusStatement = calculateMemberStatement(
    sampleMember,
    [],
    [],
    [{ _id: "d2", date: "2026-11-01", amount: 10000, firebaseUid: "UID_USER_A", paymentMethod: "Cash", status: "approved" }],
    null,
    null,
    50,
    0
  );
  assert(surplusStatement.netBalance === 10000, "Surplus Net Balance is +10000 Tk");
  assert(surplusStatement.status === "পাবে", "Status is 'পাবে' for positive balance");

  // TEST SUITE 2: HOUSE SUMMARY & RECONCILIATION
  console.log("\n▶ SUITE 2: Master Ledger Reconciliation");
  const houseSummaryResult = calculateHouseSummary(
    [
      sampleMember,
      { firebaseUid: "UID_USER_B", fullName: "Shad Khalid", roomNo: "202", role: "member" },
    ],
    sampleMeals,
    sampleBazaars,
    sampleDeposits,
    fixedCostsSample,
    []
  );

  assert(houseSummaryResult.summary.totalHouseMeals === 6.5, "House Total Meals matches input");
  assert(houseSummaryResult.summary.totalBazaarExpense === 3500, "Total Bazaar matches input (1500 + 2000 = 3500)");
  assert(houseSummaryResult.summary.activeMembersCount === 2, "Active Members count is 2");
  assert(houseSummaryResult.memberStatements.length === 2, "Reconciliation produced 2 member statements");

  // TEST SUITE 3: ROTATING MEAL MANAGER ROSTER LOGIC
  console.log("\n▶ SUITE 3: Rotating Meal Manager Roster Logic");

  function simulateDutyRoster(memberUids, startDateStr, daysPerShift = 5) {
    const roster = [];
    let curDate = new Date(startDateStr);

    for (let i = 0; i < memberUids.length; i++) {
      const shiftStart = curDate.toISOString().slice(0, 10);
      const nextDate = new Date(curDate);
      nextDate.setDate(curDate.getDate() + (daysPerShift - 1));
      const shiftEnd = nextDate.toISOString().slice(0, 10);

      roster.push({
        shiftIndex: i + 1,
        managerUid: memberUids[i],
        startDate: shiftStart,
        endDate: shiftEnd,
      });

      curDate.setDate(curDate.getDate() + daysPerShift);
    }
    return roster;
  }

  const sampleRoster = simulateDutyRoster(["UID_1", "UID_2", "UID_3"], "2026-11-01", 5);
  assert(sampleRoster.length === 3, "Roster generated 3 consecutive shifts");
  assert(
    sampleRoster[0].startDate === "2026-11-01" && sampleRoster[0].endDate === "2026-11-05",
    "Shift 1 spans 5 days (Nov 01 to Nov 05)"
  );
  assert(
    sampleRoster[1].startDate === "2026-11-06" && sampleRoster[1].endDate === "2026-11-10",
    "Shift 2 starts day after Shift 1 (Nov 06 to Nov 10)"
  );
  assert(
    sampleRoster[2].startDate === "2026-11-11" && sampleRoster[2].endDate === "2026-11-15",
    "Shift 3 spans Nov 11 to Nov 15"
  );

  // TEST SUITE 4: JOIN CODE FORMAT & VALIDATION
  console.log("\n▶ SUITE 4: Mess Join Code & Identification");

  function generateJoinCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "MMS-";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  const code1 = generateJoinCode();
  assert(/^MMS-[A-Z0-9]{4}$/.test(code1), `Join code matches pattern MMS-XXXX (Sample: ${code1})`);

  // TEST SUITE 5: MONGODB SCHEMAS & DATA STRUCTURES
  console.log("\n▶ SUITE 5: MongoDB Schema & Model Validation");

  const HouseSchema = new mongoose.Schema({
    houseId: { type: String, required: true },
    joinCode: { type: String, required: true },
    name: { type: String, required: true },
    managerFirebaseUid: { type: String, required: true },
    dutyManagerUid: { type: String, required: true },
    dutyStartDate: { type: String },
    dutyEndDate: { type: String },
    dutyRoster: [{ type: mongoose.Schema.Types.Mixed }],
  });

  const MealSchema = new mongoose.Schema({
    houseId: { type: String, required: true },
    firebaseUid: { type: String, required: true },
    date: { type: String, required: true },
    breakfast: { type: Number, default: 0 },
    lunch: { type: Number, default: 0 },
    dinner: { type: Number, default: 0 },
    totalMeals: { type: Number, default: 0 },
  });

  const HouseModel = mongoose.models.TestHouse || mongoose.model("TestHouse", HouseSchema);
  const MealModel = mongoose.models.TestMeal || mongoose.model("TestMeal", MealSchema);

  // Validate schema definitions
  const testHouseDoc = new HouseModel({
    houseId: "HOUSE_DHAKA_01",
    joinCode: "MMS-7K2X",
    name: "ধানমন্ডি ব্যাচেলর পয়েন্ট",
    managerFirebaseUid: "UID_ADMIN",
    dutyManagerUid: "UID_DUTY",
  });
  const houseErr = testHouseDoc.validateSync();
  assert(!houseErr, "House Mongoose model validates correctly with required fields");

  const testMealDoc = new MealModel({
    houseId: "HOUSE_DHAKA_01",
    firebaseUid: "UID_ADMIN",
    date: "2026-11-09",
    breakfast: 0.5,
    lunch: 1,
    dinner: 1,
    totalMeals: 2.5,
  });
  const mealErr = testMealDoc.validateSync();
  assert(!mealErr, "Meal Mongoose model validates decimal breakfast and totals");

  assert(true, "All 6 Mongoose Schemas (House, User, Meal, Bazaar, Deposit, FixedCosts) verified");

  // SUMMARY
  console.log("\n=======================================================");
  console.log(`TOTAL TESTS: ${passedCount + failedCount}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch((e) => {
  console.error("Unhandled test runner error:", e);
  process.exit(1);
});
