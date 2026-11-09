import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import House from "@/lib/mongodb/models/House";
import User from "@/lib/mongodb/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get("houseId");
    const joinCode = searchParams.get("joinCode");

    await connectToDatabase();

    if (joinCode) {
      const house = await House.findOne({ joinCode: joinCode.toUpperCase() });
      if (!house) {
        return NextResponse.json({ error: "Invalid join code" }, { status: 404 });
      }
      return NextResponse.json({ house });
    }

    if (houseId) {
      const house = await House.findOne({ houseId });
      return NextResponse.json({ house });
    }

    const houses = await House.find({});
    return NextResponse.json({ houses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, address, managerFirebaseUid } = await req.json();

    if (!name || !managerFirebaseUid) {
      return NextResponse.json({ error: "Name and manager are required" }, { status: 400 });
    }

    await connectToDatabase();

    const houseId = `HOUSE_${Date.now().toString(36).toUpperCase()}`;
    const joinCode = `MMS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newHouse = await House.create({
      houseId,
      name,
      address: address || "",
      managerFirebaseUid,
      joinCode,
      status: "active",
    });

    // Update manager user profile
    await User.findOneAndUpdate(
      { firebaseUid: managerFirebaseUid },
      { houseId, role: "manager" }
    );

    return NextResponse.json({ house: newHouse });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { houseId, dutyManagerUid, dutyStartDate, dutyEndDate, dutyRoster } = await req.json();

    if (!houseId) {
      return NextResponse.json({ error: "houseId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updateFields: any = {};
    if (dutyManagerUid !== undefined) updateFields.dutyManagerUid = dutyManagerUid;
    if (dutyStartDate !== undefined) updateFields.dutyStartDate = dutyStartDate;
    if (dutyEndDate !== undefined) updateFields.dutyEndDate = dutyEndDate;
    if (dutyRoster !== undefined) updateFields.dutyRoster = dutyRoster;

    const updated = await House.findOneAndUpdate(
      { houseId },
      { $set: updateFields },
      { new: true }
    );

    return NextResponse.json({ house: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
