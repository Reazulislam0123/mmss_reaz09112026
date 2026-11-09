export interface IFixedCostsData {
  rent?: number;
  electricity?: number;
  gasWater?: number;
  cookBill?: number;
  wifi?: number;
  other?: number;
}

export interface IMealRecord {
  date: string;
  firebaseUid: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  totalMeals: number;
}

export interface IBazaarRecord {
  _id?: string;
  date: string;
  cost: number;
  paidByUid: string;
  itemDetails: string;
  category?: string;
}

export interface IDepositRecord {
  _id?: string;
  date: string;
  amount: number;
  firebaseUid: string;
  paymentMethod: string;
  trxId?: string;
  notes?: string;
  status?: string;
}

export interface IIndividualBillRecord {
  firebaseUid: string;
  seatFare?: number;
  prevDue?: number;
  charges?: number;
  khala?: number;
  others?: number;
}

export interface IMemberProfile {
  firebaseUid: string;
  fullName: string;
  phone?: string;
  roomNo?: string;
  role?: string;
  customRent?: number;
}

export interface IMemberStatement {
  firebaseUid: string;
  fullName: string;
  roomNo: string;
  totalMeals: number;
  mealCost: number;
  sharedUtilityCost: number;
  customRent: number;
  individualAdjustment: number;
  totalExpense: number;
  totalDeposits: number;
  directBazaarPaid: number;
  netBalance: number; // positive = refund ("পাবে"), negative = due ("বকেয়া")
  status: "পাবে" | "বকেয়া";
}

export interface IHouseSummary {
  totalHouseMeals: number;
  totalBazaarExpense: number;
  activeMealRate: number;
  totalSharedUtilities: number;
  utilityPerHead: number;
  totalDepositsCollected: number;
  activeMembersCount: number;
  totalMessDue: number;
  totalMessPayable: number;
}

/**
 * Calculates live meal rate = Total Bazaar / Total Meals
 * Returns 0 if total meals is 0
 */
export function calculateMealRate(totalBazaar: number, totalMeals: number): number {
  if (!totalMeals || totalMeals <= 0) return 0;
  const rate = totalBazaar / totalMeals;
  return Math.round(rate * 100) / 100;
}

/**
 * Calculates shared utility cost per head = Sum of shared utilities / activeMemberCount
 */
export function calculateSharedUtilityPerHead(
  fixedCosts: IFixedCostsData | null | undefined,
  activeMemberCount: number
): number {
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

/**
 * Calculates complete financial balance for a specific member
 */
export function calculateMemberStatement(
  member: IMemberProfile,
  memberMeals: IMealRecord[],
  allBazaars: IBazaarRecord[],
  memberDeposits: IDepositRecord[],
  fixedCosts: IFixedCostsData | null | undefined,
  individualBill: IIndividualBillRecord | null | undefined,
  mealRate: number,
  sharedUtilityPerHead: number
): IMemberStatement {
  // 1. Total meals consumed by this member
  const totalMeals = memberMeals.reduce((acc, m) => acc + (Number(m.totalMeals) || 0), 0);

  // 2. Individual meal cost
  const mealCost = Math.round(totalMeals * mealRate * 100) / 100;

  // 3. Custom rent or seat fare
  const customRent = Number(individualBill?.seatFare) || Number(member.customRent) || 0;

  // 4. Individual bill adjustments (prevDue + charges + khala + others)
  const individualAdjustment =
    (Number(individualBill?.prevDue) || 0) +
    (Number(individualBill?.charges) || 0) +
    (Number(individualBill?.khala) || 0) +
    (Number(individualBill?.others) || 0);

  // 5. Total expense for member
  const totalExpense =
    Math.round((mealCost + sharedUtilityPerHead + customRent + individualAdjustment) * 100) / 100;

  // 6. Total deposits paid by member
  const totalDeposits = memberDeposits
    .filter((d) => d.status !== "pending")
    .reduce((acc, d) => acc + (Number(d.amount) || 0), 0);

  // 7. Direct bazaar money paid out of pocket by member
  const directBazaarPaid = allBazaars
    .filter((b) => b.paidByUid === member.firebaseUid)
    .reduce((acc, b) => acc + (Number(b.cost) || 0), 0);

  // 8. Net Balance = (Deposits + Out-of-pocket Bazaar) - Total Expense
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

/**
 * Calculates house-wide master summary
 */
export function calculateHouseSummary(
  members: IMemberProfile[],
  meals: IMealRecord[],
  bazaars: IBazaarRecord[],
  deposits: IDepositRecord[],
  fixedCosts: IFixedCostsData | null | undefined,
  individualBills: IIndividualBillRecord[]
): {
  summary: IHouseSummary;
  memberStatements: IMemberStatement[];
} {
  const activeMembersCount = members.length || 1;

  // Total meals across all members
  const totalHouseMeals = meals.reduce((acc, m) => acc + (Number(m.totalMeals) || 0), 0);

  // Total bazaar cost
  const totalBazaarExpense = bazaars.reduce((acc, b) => acc + (Number(b.cost) || 0), 0);

  // Live meal rate
  const activeMealRate = calculateMealRate(totalBazaarExpense, totalHouseMeals);

  // Shared utilities
  const totalSharedUtilities =
    (Number(fixedCosts?.rent) || 0) +
    (Number(fixedCosts?.electricity) || 0) +
    (Number(fixedCosts?.gasWater) || 0) +
    (Number(fixedCosts?.cookBill) || 0) +
    (Number(fixedCosts?.wifi) || 0) +
    (Number(fixedCosts?.other) || 0);

  const utilityPerHead = calculateSharedUtilityPerHead(fixedCosts, activeMembersCount);

  // Total deposits collected
  const totalDepositsCollected = deposits
    .filter((d) => d.status !== "pending")
    .reduce((acc, d) => acc + (Number(d.amount) || 0), 0);

  // Individual statements
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
      totalSharedUtilities,
      utilityPerHead,
      totalDepositsCollected,
      activeMembersCount,
      totalMessDue: Math.round(totalMessDue * 100) / 100,
      totalMessPayable: Math.round(totalMessPayable * 100) / 100,
    },
    memberStatements,
  };
}

