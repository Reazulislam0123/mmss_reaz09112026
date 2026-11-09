import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import User from "@/lib/mongodb/models/User";
import Meal from "@/lib/mongodb/models/Meal";
import Bazaar from "@/lib/mongodb/models/Bazaar";
import Deposit from "@/lib/mongodb/models/Deposit";
import FixedCost from "@/lib/mongodb/models/FixedCost";
import IndividualBill from "@/lib/mongodb/models/IndividualBill";
import { calculateHouseSummary } from "@/lib/calculations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get("houseId");
    const month = searchParams.get("month");

    if (!houseId || !month) {
      return NextResponse.json({ error: "houseId and month are required" }, { status: 400 });
    }

    try {
      await connectToDatabase();

      const [users, meals, bazaars, deposits, fixedCost, individualBills] = await Promise.all([
        User.find({ houseId, status: "active" }),
        Meal.find({ houseId, date: { $regex: `^${month}` } }),
        Bazaar.find({ houseId, month }),
        Deposit.find({ houseId, month }),
        FixedCost.findOne({ houseId, month }),
        IndividualBill.find({ houseId, month }),
      ]);

      const formattedMembers = users.map((u) => ({
        firebaseUid: u.firebaseUid,
        fullName: u.fullName,
        phone: u.phone,
        roomNo: u.roomNo,
        role: u.role,
        customRent: u.customRent,
      }));

      const ledgerResult = calculateHouseSummary(
        formattedMembers,
        meals as any,
        bazaars as any,
        deposits as any,
        fixedCost as any,
        individualBills as any
      );

      return NextResponse.json(ledgerResult);
    } catch (e: any) {
      return NextResponse.json({ error: e.message, mode: "fallback" }, { status: 200 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

