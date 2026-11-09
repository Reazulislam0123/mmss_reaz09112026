import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMeal extends Document {
  houseId: string;
  date: string; // YYYY-MM-DD
  firebaseUid: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  totalMeals: number;
  updatedAt: Date;
}

const MealSchema = new Schema<IMeal>(
  {
    houseId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    breakfast: { type: Number, default: 0 },
    lunch: { type: Number, default: 0 },
    dinner: { type: Number, default: 0 },
    totalMeals: { type: Number, default: 0 },
  },
  { timestamps: true }
);

MealSchema.index({ houseId: 1, date: 1, firebaseUid: 1 }, { unique: true });

export const Meal: Model<IMeal> =
  mongoose.models.Meal || mongoose.model<IMeal>("Meal", MealSchema);

export default Meal;

