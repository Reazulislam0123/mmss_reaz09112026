import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import User from "@/lib/mongodb/models/User";
import House from "@/lib/mongodb/models/House";
import Permission from "@/lib/mongodb/models/Permission";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPassword = String(password || "").trim();

    // Check for super admin credentials
    const isSuperAdminEmail = cleanEmail === "reazul.islam6164@gmail.com";
    const isSuperAdminPass = cleanPassword === "admin123" || cleanPassword === "admin1234";

    if (isSuperAdminEmail && isSuperAdminPass) {
      await connectToDatabase();

      let user = await User.findOne({ email: cleanEmail });
      const defaultHouseId = "HOUSE_DHAKA_01";
      const adminUid = user?.firebaseUid || "N6RYUMDmk1UcRabVKdxwva4LmEF2";

      if (!user) {
        user = await User.create({
          firebaseUid: adminUid,
          email: cleanEmail,
          fullName: "ANM Reazul Islam",
          role: "super_admin",
          houseId: defaultHouseId,
          status: "active",
          roomNo: "302",
        });
      } else if (user.role !== "super_admin") {
        user.role = "super_admin";
        await user.save();
      }

      // Ensure House manager and duty manager are linked
      await House.updateOne(
        { houseId: defaultHouseId },
        {
          $set: {
            managerFirebaseUid: user.firebaseUid,
            dutyManagerUid: user.firebaseUid,
          },
        }
      );

      // Ensure full permissions
      await Permission.updateOne(
        { firebaseUid: user.firebaseUid },
        {
          $set: {
            firebaseUid: user.firebaseUid,
            houseId: defaultHouseId,
            canEntryMeal: true,
            canEntryBazaar: true,
            canManagePeoples: true,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        user: {
          firebaseUid: user.firebaseUid,
          email: user.email,
          fullName: user.fullName || "ANM Reazul Islam",
          role: "super_admin",
          houseId: user.houseId || defaultHouseId,
          phone: user.phone || "",
          roomNo: user.roomNo || "302",
          customRent: user.customRent || 0,
        },
        message: "সুপার অ্যাডমিন মুডে সফলভাবে লগইন হয়েছে!",
      });
    }

    return NextResponse.json(
      { error: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।" },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

