import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import House from "@/lib/mongodb/models/House";
import User from "@/lib/mongodb/models/User";
import Permission from "@/lib/mongodb/models/Permission";

export async function POST(req: Request) {
  try {
    const { firebaseUid, code } = await req.json();

    if (!firebaseUid || !code) {
      return NextResponse.json({ error: "ইউজার আইডি এবং মেস কোড প্রদান করুন" }, { status: 400 });
    }

    await connectToDatabase();

    const cleanCode = code.trim();
    // Search by joinCode OR houseId
    const foundHouse = await House.findOne({
      $or: [
        { joinCode: cleanCode.toUpperCase() },
        { houseId: cleanCode },
        { houseId: cleanCode.toUpperCase() },
      ],
      status: "active",
    });

    if (!foundHouse) {
      return NextResponse.json(
        { error: "এই কোড বা হাউস আইডি দিয়ে কোনো সক্রিয় মেস পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    // Update user's houseId
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      { $set: { houseId: foundHouse.houseId } },
      { new: true }
    );

    // Ensure permissions document exists
    await Permission.findOneAndUpdate(
      { houseId: foundHouse.houseId, firebaseUid },
      {
        $setOnInsert: {
          canEntryMeal: true,
          canEntryBazaar: false,
          canManagePeoples: false,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      house: foundHouse,
      user: updatedUser,
      message: `আপনি সফলভাবে "${foundHouse.name}" মেসে যুক্ত হয়েছেন!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

