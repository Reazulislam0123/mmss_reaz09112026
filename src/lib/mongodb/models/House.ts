import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHouse extends Document {
  houseId: string;
  name: string;
  address?: string;
  managerFirebaseUid: string;
  joinCode: string;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const HouseSchema = new Schema<IHouse>(
  {
    houseId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    address: { type: String, default: "" },
    managerFirebaseUid: { type: String, required: true, index: true },
    joinCode: { type: String, required: true, unique: true, uppercase: true },
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  { timestamps: true }
);

export const House: Model<IHouse> =
  mongoose.models.House || mongoose.model<IHouse>("House", HouseSchema);

export default House;

