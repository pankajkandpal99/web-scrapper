import { Schema, model } from "mongoose";
import { IUser } from "../types/model/i-user-model.js";
import { AuthProvider } from "../types/model/i-model.js";
import { ROLE } from "../config/constants.js";

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => /^[0-9]{10}$/.test(v),
        message: "Phone number must be 10 digits",
      },
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    username: {
      type: String,
      minlength: [3, "Username must be at least 3 characters"],
    },
    avatar: String,
    lastLogin: Date,
    lastActive: Date,
    isVerified: { type: Boolean, default: false },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
    },
    providerId: String,
    preferences: Schema.Types.Mixed,
    sessions: [{ type: Schema.Types.ObjectId, ref: "Session" }],
    isGuest: { type: Boolean, default: false },
    guestId: { type: String },
    guestExpiresAt: Date,
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// UserSchema.index({ phoneNumber: 1 }, { unique: true });

export const User = model<IUser>("User", UserSchema);
