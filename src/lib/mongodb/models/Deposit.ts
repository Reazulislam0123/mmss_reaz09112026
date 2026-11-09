import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDeposit extends Document {
  houseId: string;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  firebaseUid: string;
  amount: number;
  receivedByUid?: string;
  paymentMethod: "bKash" | "Nagad" | "Rocket" | "Bank" | "Cash";
  trxId?: string;
  notes?: string;
  status: "pending" | "approved";
  createdAt: Date;
}

const DepositSchema = new Schema<IDeposit>(
  {
    houseId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    month: { type: String, required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    receivedByUid: { type: String },
    paymentMethod: {
      type: String,
      enum: ["bKash", "Nagad", "Rocket", "Bank", "Cash"],
      default: "bKash",
    },
    trxId: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved"], default: "approved" },
  },
  { timestamps: true }
);

export const Deposit: Model<IDeposit> =
  mongoose.models.Deposit || mongoose.model<IDeposit>("Deposit", DepositSchema);

export default Deposit;

