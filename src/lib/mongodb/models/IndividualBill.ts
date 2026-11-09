import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIndividualBill extends Document {
  houseId: string;
  month: string; // YYYY-MM
  firebaseUid: string;
  seatFare: number;
  prevDue: number;
  charges: number;
  khala: number;
  others: number;
  grandTotal: number;
  updatedAt: Date;
}

const IndividualBillSchema = new Schema<IIndividualBill>(
  {
    houseId: { type: String, required: true, index: true },
    month: { type: String, required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    seatFare: { type: Number, default: 0 },
    prevDue: { type: Number, default: 0 },
    charges: { type: Number, default: 0 },
    khala: { type: Number, default: 0 },
    others: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

IndividualBillSchema.index({ houseId: 1, month: 1, firebaseUid: 1 }, { unique: true });

export const IndividualBill: Model<IIndividualBill> =
  mongoose.models.IndividualBill ||
  mongoose.model<IIndividualBill>("IndividualBill", IndividualBillSchema);

export default IndividualBill;

