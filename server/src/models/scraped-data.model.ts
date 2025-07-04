import mongoose, { Schema, Document } from "mongoose";

export interface IScrapedData extends Document {
  url: string;
  data: any;
  userId: string;
  createdAt: Date;
}

const ScrapedDataSchema: Schema = new Schema(
  {
    url: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const ScrapedData = mongoose.model<IScrapedData>(
  "ScrapedData",
  ScrapedDataSchema
);
