import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFixedCost extends Document {
  houseId: string;
  month: string; // YYYY-MM
  rent: number;
  electricity: number;
  gasWater: number;
  cookBill: number;
  wifi: number;
  other: number;
  updatedAt: Date;
}

const FixedCostSchema = new Schema<IFixedCost>(
  {
    houseId: { type: String, required: true, index: true },
    month: { type: String, required: true, index: true },
    rent: { type: Number, default: 0 },
    electricity: { type: Number, default: 0 },
    gasWater: { type: Number, default: 0 },
    cookBill: { type: Number, default: 0 },
    wifi: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  { timestamps: true }
);

FixedCostSchema.index({ houseId: 1, month: 1 }, { unique: true });

export const FixedCost: Model<IFixedCost> =
  mongoose.models.FixedCost ||
  mongoose.model<IFixedCost>("FixedCost", FixedCostSchema);

export default FixedCost;

