import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDutyShift {
  firebaseUid: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  daysCount: number;
  status: "completed" | "active" | "upcoming";
}

export interface IHouse extends Document {
  houseId: string;
  name: string;
  address?: string;
  managerFirebaseUid: string;
  joinCode: string;
  status: "active" | "archived";
  dutyManagerUid?: string;
  dutyStartDate?: string;
  dutyEndDate?: string;
  dutyRoster?: IDutyShift[];
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
    dutyManagerUid: { type: String, default: "" },
    dutyStartDate: { type: String, default: "" },
    dutyEndDate: { type: String, default: "" },
    dutyRoster: [{ type: Schema.Types.Mixed }],
  },
  { timestamps: true }
);

export const House: Model<IHouse> =
  mongoose.models.House || mongoose.model<IHouse>("House", HouseSchema);

export default House;
