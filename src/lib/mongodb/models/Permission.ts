import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPermission extends Document {
  houseId: string;
  firebaseUid: string;
  canEntryMeal: boolean;
  canEntryBazaar: boolean;
  canManagePeoples: boolean;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    houseId: { type: String, required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    canEntryMeal: { type: Boolean, default: true },
    canEntryBazaar: { type: Boolean, default: false },
    canManagePeoples: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PermissionSchema.index({ houseId: 1, firebaseUid: 1 }, { unique: true });

export const Permission: Model<IPermission> =
  mongoose.models.Permission ||
  mongoose.model<IPermission>("Permission", PermissionSchema);

export default Permission;

