import { ObjectId } from "mongoose";
import { AuthProvider } from "./i-model.js";

export interface ISession extends Document {
  userId: ObjectId;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  loginMethod: AuthProvider;
}
