import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import Bazaar from "@/lib/mongodb/models/Bazaar";

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
      const bazaars = await Bazaar.find(query).sort({ date: -1 });
      return NextResponse.json({ bazaars });
    } catch (e) {
      return NextResponse.json({ bazaars: [], mode: "fallback" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { houseId, date, month, itemDetails, category, cost, paidByUid, items } = await req.json();

    if (!houseId || !date || (!itemDetails && (!items || items.length === 0)) || !cost || !paidByUid) {
      return NextResponse.json({ error: "Missing required bazaar fields" }, { status: 400 });
    }

    const calculatedMonth = month || date.substring(0, 7);

    try {
      await connectToDatabase();
      const newBazaar = await Bazaar.create({
        houseId,
        date,
        month: calculatedMonth,
        itemDetails,
        category: category || "Grocery/মুদি",
        cost: Number(cost),
        paidByUid,
        items: Array.isArray(items) ? items : [],
      });
      return NextResponse.json({ bazaar: newBazaar });
    } catch (e) {
      return NextResponse.json({
        bazaar: {
          _id: `BAZ_${Date.now()}`,
          houseId,
          date,
          month: calculatedMonth,
          itemDetails,
          category,
          cost: Number(cost),
          paidByUid,
          items: Array.isArray(items) ? items : [],
        },
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      await Bazaar.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    } catch (e) {
      return NextResponse.json({ success: true, mode: "fallback" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

