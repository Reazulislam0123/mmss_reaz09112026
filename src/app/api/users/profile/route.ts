import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import User from "@/lib/mongodb/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get("firebaseUid");

    if (!firebaseUid) {
      return NextResponse.json({ error: "firebaseUid is required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { firebaseUid, fullName, phone, roomNo } = await req.json();

    if (!firebaseUid) {
      return NextResponse.json({ error: "firebaseUid is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updateFields: any = {};
    if (typeof fullName === "string" && fullName.trim()) {
      updateFields.fullName = fullName.trim();
    }
    if (phone !== undefined) {
      updateFields.phone = String(phone).trim();
    }
    if (roomNo !== undefined) {
      updateFields.roomNo = String(roomNo).trim();
    }

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        firebaseUid: updatedUser.firebaseUid,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        roomNo: updatedUser.roomNo,
        role: updatedUser.role,
        houseId: updatedUser.houseId,
        customRent: updatedUser.customRent,
      },
      message: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

