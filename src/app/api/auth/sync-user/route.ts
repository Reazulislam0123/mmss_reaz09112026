import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import User from "@/lib/mongodb/models/User";
import House from "@/lib/mongodb/models/House";
import Permission from "@/lib/mongodb/models/Permission";

export async function POST(req: Request) {
  try {
    const { firebaseUid, email, fullName, joinCode } = await req.json();

    if (!firebaseUid || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await connectToDatabase();
    } catch (dbErr) {
      // Return graceful fallback if database is not reachable
      return NextResponse.json({
        user: {
          firebaseUid,
          email,
          fullName: fullName || email.split("@")[0],
          role: "member",
          houseId: "HOUSE_DHAKA_01",
        },
        mode: "mock_fallback",
      });
    }

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      let assignedHouseId = "HOUSE_DHAKA_01";
      let userRole: "super_admin" | "manager" | "member" = "member";

      if (joinCode) {
        const cleanCode = joinCode.trim();
        const foundHouse = await House.findOne({
          $or: [
            { joinCode: cleanCode.toUpperCase() },
            { houseId: cleanCode },
            { houseId: cleanCode.toUpperCase() },
          ],
        });
        if (foundHouse) {
          assignedHouseId = foundHouse.houseId;
        }
      }

      user = await User.create({
        firebaseUid,
        email,
        fullName: fullName || email.split("@")[0],
        houseId: assignedHouseId,
        role: userRole,
        status: "active",
      });

      await Permission.create({
        houseId: assignedHouseId,
        firebaseUid,
        canEntryMeal: true,
        canEntryBazaar: false,
        canManagePeoples: false,
      });
    }

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

