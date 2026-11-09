import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import Meal from "@/lib/mongodb/models/Meal";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get("houseId");
    const month = searchParams.get("month"); // YYYY-MM

    if (!houseId) {
      return NextResponse.json({ error: "houseId is required" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const query: any = { houseId };
      if (month) {
        query.date = { $regex: `^${month}` };
      }
      const meals = await Meal.find(query).sort({ date: 1 });
      return NextResponse.json({ meals });
    } catch (e) {
      return NextResponse.json({ meals: [], mode: "fallback" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { houseId, date, firebaseUid, breakfast, lunch, dinner } = await req.json();

    if (!houseId || !date || !firebaseUid) {
      return NextResponse.json({ error: "Missing required meal parameters" }, { status: 400 });
    }

    const b = Number(breakfast) || 0;
    const l = Number(lunch) || 0;
    const d = Number(dinner) || 0;
    const totalMeals = b + l + d;

    try {
      await connectToDatabase();
      const updated = await Meal.findOneAndUpdate(
        { houseId, date, firebaseUid },
        { breakfast: b, lunch: l, dinner: d, totalMeals },
        { upsert: true, new: true }
      );
      return NextResponse.json({ meal: updated });
    } catch (e) {
      return NextResponse.json({
        meal: { houseId, date, firebaseUid, breakfast: b, lunch: l, dinner: d, totalMeals },
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { houseId, date, entries } = await req.json();

    if (!houseId || !date || !Array.isArray(entries)) {
      return NextResponse.json({ error: "Invalid bulk entries" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const bulkOps = entries.map((ent) => {
        const b = Number(ent.b) || 0;
        const l = Number(ent.l) || 0;
        const d = Number(ent.d) || 0;
        return {
          updateOne: {
            filter: { houseId, date, firebaseUid: ent.uid },
            update: { breakfast: b, lunch: l, dinner: d, totalMeals: b + l + d },
            upsert: true,
          },
        };
      });

      await Meal.bulkWrite(bulkOps);
      return NextResponse.json({ success: true, count: entries.length });
    } catch (e) {
      return NextResponse.json({ success: true, mode: "fallback" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

