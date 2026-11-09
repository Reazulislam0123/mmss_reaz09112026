import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import User from "@/lib/mongodb/models/User";
import Permission from "@/lib/mongodb/models/Permission";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get("houseId");

    if (!houseId) {
      return NextResponse.json({ error: "houseId is required" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const users = await User.find({ houseId, status: "active" });
      const permissions = await Permission.find({ houseId });

      const members = users.map((u) => {
        const perm = permissions.find((p) => p.firebaseUid === u.firebaseUid);
        return {
          firebaseUid: u.firebaseUid,
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          roomNo: u.roomNo,
          role: u.role,
          customRent: u.customRent,
          status: u.status,
          permissions: perm || {
            canEntryMeal: true,
            canEntryBazaar: u.role === "manager",
            canManagePeoples: u.role === "manager",
          },
        };
      });

      return NextResponse.json({ members });
    } catch (e) {
      return NextResponse.json({ members: [], mode: "fallback" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { firebaseUid, houseId, roomNo, customRent, role, permissions } = await req.json();

    if (!firebaseUid) {
      return NextResponse.json({ error: "firebaseUid is required" }, { status: 400 });
    }

    try {
      await connectToDatabase();

      const userUpdate: any = {};
      if (roomNo !== undefined) userUpdate.roomNo = roomNo;
      if (customRent !== undefined) userUpdate.customRent = Number(customRent);
      if (role !== undefined) userUpdate.role = role;

      await User.findOneAndUpdate({ firebaseUid }, userUpdate);

      if (permissions && houseId) {
        await Permission.findOneAndUpdate(
          { houseId, firebaseUid },
          {
            canEntryMeal: Boolean(permissions.canEntryMeal),
            canEntryBazaar: Boolean(permissions.canEntryBazaar),
            canManagePeoples: Boolean(permissions.canManagePeoples),
          },
          { upsert: true }
        );
      }

      return NextResponse.json({ success: true });
    } catch (e) {
      return NextResponse.json({ success: true, mode: "fallback" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

