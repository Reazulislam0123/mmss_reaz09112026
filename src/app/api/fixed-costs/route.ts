import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import FixedCost from "@/lib/mongodb/models/FixedCost";

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
      const fixedCost = await FixedCost.findOne({ houseId, month });
      return NextResponse.json({ fixedCost });
    } catch (e) {
      return NextResponse.json({ fixedCost: null, mode: "fallback" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { houseId, month, rent, electricity, gasWater, cookBill, wifi, other } = await req.json();

    if (!houseId || !month) {
      return NextResponse.json({ error: "houseId and month are required" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const updated = await FixedCost.findOneAndUpdate(
        { houseId, month },
        {
          rent: Number(rent) || 0,
          electricity: Number(electricity) || 0,
          gasWater: Number(gasWater) || 0,
          cookBill: Number(cookBill) || 0,
          wifi: Number(wifi) || 0,
          other: Number(other) || 0,
        },
        { upsert: true, new: true }
      );
      return NextResponse.json({ fixedCost: updated });
    } catch (e) {
      return NextResponse.json({
        fixedCost: { houseId, month, rent, electricity, gasWater, cookBill, wifi, other },
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

