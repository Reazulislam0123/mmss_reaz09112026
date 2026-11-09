import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBazaar extends Document {
  houseId: string;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  itemDetails: string;
  category: "Grocery/মুদি" | "Meat-Fish/মাছ-মাংস" | "Vegetables/সবজি" | "Spices/তেল-মসলা" | "Snacks/অন্যান্য";
  cost: number;
  paidByUid: string; // Firebase UID or "MESS_FUND"
  voucherImageUrl?: string;
  createdAt: Date;
}

const BazaarSchema = new Schema<IBazaar>(
  {
    houseId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    month: { type: String, required: true, index: true },
    itemDetails: { type: String, required: true },
    category: {
      type: String,
      enum: ["Grocery/মুদি", "Meat-Fish/মাছ-মাংস", "Vegetables/সবজি", "Spices/তেল-মসলা", "Snacks/অন্যান্য"],
      default: "Grocery/মুদি",
    },
    cost: { type: Number, required: true },
    paidByUid: { type: String, required: true },
    voucherImageUrl: { type: String },
  },
  { timestamps: true }
);

export const Bazaar: Model<IBazaar> =
  mongoose.models.Bazaar || mongoose.model<IBazaar>("Bazaar", BazaarSchema);

export default Bazaar;

