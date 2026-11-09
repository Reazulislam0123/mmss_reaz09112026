import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import IndividualBill from "@/lib/mongodb/models/IndividualBill";

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
      const bills = await IndividualBill.find({ houseId, month });
      return NextResponse.json({ bills });
    } catch (e) {
      return NextResponse.json({ bills: [], mode: "fallback" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { houseId, month, firebaseUid, seatFare, prevDue, charges, khala, others } = await req.json();

    if (!houseId || !month || !firebaseUid) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sf = Number(seatFare) || 0;
    const pd = Number(prevDue) || 0;
    const ch = Number(charges) || 0;
    const kh = Number(khala) || 0;
    const ot = Number(others) || 0;
    const grandTotal = sf + pd + ch + kh + ot;

    try {
      await connectToDatabase();
      const bill = await IndividualBill.findOneAndUpdate(
        { houseId, month, firebaseUid },
        { seatFare: sf, prevDue: pd, charges: ch, khala: kh, others: ot, grandTotal },
        { upsert: true, new: true }
      );
      return NextResponse.json({ bill });
    } catch (e) {
      return NextResponse.json({
        bill: { houseId, month, firebaseUid, seatFare: sf, prevDue: pd, charges: ch, khala: kh, others: ot, grandTotal },
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

