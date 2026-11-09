import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import House from "@/lib/mongodb/models/House";
import User from "@/lib/mongodb/models/User";
import Meal from "@/lib/mongodb/models/Meal";
import Bazaar from "@/lib/mongodb/models/Bazaar";
import Deposit from "@/lib/mongodb/models/Deposit";
import FixedCost from "@/lib/mongodb/models/FixedCost";

export async function GET() {
  try {
    await connectToDatabase();
    const houses = await House.find().sort({ createdAt: -1 });
    const users = await User.find();

    const houseList = houses.map((h) => {
      const houseMembers = users.filter((u) => u.houseId === h.houseId);
      const manager = users.find((u) => u.firebaseUid === h.managerFirebaseUid);
      return {
        houseId: h.houseId,
        name: h.name,
        address: h.address || "",
        joinCode: h.joinCode,
        managerFirebaseUid: h.managerFirebaseUid,
        managerName: manager?.fullName || "নির্ধারিত নয়",
        memberCount: houseMembers.length,
        status: h.status || "active",
        createdAt: h.createdAt,
      };
    });

    return NextResponse.json({ success: true, houses: houseList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { houseId, name, address, joinCode, managerFirebaseUid } = await req.json();

    if (!houseId) {
      return NextResponse.json({ error: "houseId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (joinCode) updateData.joinCode = joinCode.trim().toUpperCase();
    if (managerFirebaseUid) updateData.managerFirebaseUid = managerFirebaseUid;

    const updated = await House.findOneAndUpdate({ houseId }, { $set: updateData }, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "মেস খুঁজে পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      house: updated,
      message: "মেসের তথ্য সফলভাবে আপডেট করা হয়েছে!",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get("houseId");

    if (!houseId) {
      return NextResponse.json({ error: "houseId is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Delete the house
    const deletedHouse = await House.findOneAndDelete({ houseId });
    if (!deletedHouse) {
      return NextResponse.json({ error: "মেস খুঁজে পাওয়া যায়নি" }, { status: 404 });
    }

    // Clean up or detach users and house records
    await Promise.all([
      User.updateMany({ houseId }, { $set: { houseId: "UNASSIGNED" } }),
      Meal.deleteMany({ houseId }),
      Bazaar.deleteMany({ houseId }),
      Deposit.deleteMany({ houseId }),
      FixedCost.deleteMany({ houseId }),
    ]);

    return NextResponse.json({
      success: true,
      message: `মেস '${deletedHouse.name}' সফলভাবে ডিলিট করা হয়েছে!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

