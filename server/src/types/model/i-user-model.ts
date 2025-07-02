import { ObjectId } from "mongoose";
import { AuthProvider } from "./i-model.js";
import { ROLE } from "../../config/constants.js";

export interface IUser extends Document {
  email?: string;
  password: string;
  phoneNumber: string;
  role: ROLE;
  username?: string;
  avatar?: string;
  lastLogin?: Date;
  lastActive?: Date;
  isVerified: boolean;
  provider?: AuthProvider;
  providerId?: string;
  preferences?: Record<string, any>;
  sessions: ObjectId[];
  isGuest: boolean;
  guestId?: string;
  guestExpiresAt?: Date;
}
