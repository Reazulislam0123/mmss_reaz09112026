import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  phone?: string;
  fullName: string;
  houseId?: string;
  roomNo?: string;
  role: "super_admin" | "manager" | "member";
  status: "active" | "inactive";
  pin?: string;
  customRent: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    fullName: { type: String, required: true },
    houseId: { type: String, index: true },
    roomNo: { type: String, default: "" },
    role: {
      type: String,
      enum: ["super_admin", "manager", "member"],
      default: "member",
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    pin: { type: String, default: "1234" },
    customRent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

