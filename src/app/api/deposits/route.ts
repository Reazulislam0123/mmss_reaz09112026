import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import Deposit from "@/lib/mongodb/models/Deposit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get("houseId");
    const month = searchParams.get("month");

    if (!houseId) {
      return NextResponse.json({ error: "houseId is required" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const query: any = { houseId };
      if (month) query.month = month;
      const deposits = await Deposit.find(query).sort({ date: -1 });
      return NextResponse.json({ deposits });
    } catch (e) {
      return NextResponse.json({ deposits: [], mode: "fallback" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { houseId, date, month, firebaseUid, amount, paymentMethod, trxId, notes } = await req.json();

    if (!houseId || !date || !firebaseUid || !amount) {
      return NextResponse.json({ error: "Missing required deposit fields" }, { status: 400 });
    }

    const calculatedMonth = month || date.substring(0, 7);

    try {
      await connectToDatabase();
      const newDeposit = await Deposit.create({
        houseId,
        date,
        month: calculatedMonth,
        firebaseUid,
        amount: Number(amount),
        paymentMethod: paymentMethod || "bKash",
        trxId: trxId || "",
        notes: notes || "",
        status: "approved",
      });
      return NextResponse.json({ deposit: newDeposit });
    } catch (e) {
      return NextResponse.json({
        deposit: {
          _id: `DEP_${Date.now()}`,
          houseId,
          date,
          month: calculatedMonth,
          firebaseUid,
          amount: Number(amount),
          paymentMethod,
          trxId,
          notes,
          status: "approved",
        },
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

