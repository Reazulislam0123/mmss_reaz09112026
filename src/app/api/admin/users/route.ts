import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import User from "@/lib/mongodb/models/User";
import House from "@/lib/mongodb/models/House";
import Permission from "@/lib/mongodb/models/Permission";
import Meal from "@/lib/mongodb/models/Meal";
import Bazaar from "@/lib/mongodb/models/Bazaar";
import Deposit from "@/lib/mongodb/models/Deposit";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 });
    const houses = await House.find();

    const userList = users.map((u) => {
      const house = houses.find((h) => h.houseId === u.houseId);
      return {
        firebaseUid: u.firebaseUid,
        email: u.email,
        fullName: u.fullName,
        phone: u.phone || "",
        roomNo: u.roomNo || "",
        role: u.role || "member",
        status: u.status || "active",
        customRent: u.customRent || 0,
        houseId: u.houseId || "UNASSIGNED",
        houseName: house?.name || "মেস নির্ধারিত নয়",
        joinCode: house?.joinCode || "",
        createdAt: u.createdAt,
      };
    });

    return NextResponse.json({ success: true, users: userList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { firebaseUid, fullName, phone, roomNo, customRent, role, houseId } = await req.json();

    if (!firebaseUid) {
      return NextResponse.json({ error: "firebaseUid is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updateFields: any = {};
    if (fullName !== undefined && fullName.trim()) updateFields.fullName = fullName.trim();
    if (phone !== undefined) updateFields.phone = String(phone).trim();
    if (roomNo !== undefined) updateFields.roomNo = String(roomNo).trim();
    if (customRent !== undefined) updateFields.customRent = Number(customRent);
    if (role !== undefined) updateFields.role = role;
    if (houseId !== undefined) updateFields.houseId = houseId;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "সদস্য খুঁজে পাওয়া যায়নি" }, { status: 404 });
    }

    // If promoted to manager for a house, demote other members in that house
    if (role === "manager" && houseId) {
      await User.updateMany(
        { houseId, firebaseUid: { $ne: firebaseUid } },
        { $set: { role: "member" } }
      );
      await House.updateOne(
        { houseId },
        { $set: { managerFirebaseUid: firebaseUid } }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "সদস্যের তথ্য সফলভাবে আপডেট করা হয়েছে!",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get("firebaseUid");

    if (!firebaseUid) {
      return NextResponse.json({ error: "firebaseUid is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Prevent deleting the main super admin
    const userToDelete = await User.findOne({ firebaseUid });
    if (!userToDelete) {
      return NextResponse.json({ error: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" }, { status: 404 });
    }

    if (userToDelete.email?.toLowerCase() === "reazul.islam6164@gmail.com") {
      return NextResponse.json(
        { error: "প্রধান সুপার অ্যাডমিন অ্যাকাউন্ট ডিলিট করা নিষিদ্ধ!" },
        { status: 403 }
      );
    }

    // Delete user and associated permissions and records
    await Promise.all([
      User.deleteOne({ firebaseUid }),
      Permission.deleteMany({ firebaseUid }),
      Meal.deleteMany({ firebaseUid }),
      Bazaar.deleteMany({ paidByUid: firebaseUid }),
      Deposit.deleteMany({ firebaseUid }),
    ]);

    return NextResponse.json({
      success: true,
      message: `সদস্য '${userToDelete.fullName}' সফলভাবে ডিলিট করা হয়েছে!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

