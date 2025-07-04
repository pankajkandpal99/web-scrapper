import { Schema, model, Document } from "mongoose";

export interface IScrapedData extends Document {
  url: string;
  title: string;
  description?: string;
  content: string;
  metadata: {
    scrapedAt: Date;
    responseTime: number;
    statusCode: number;
    contentLength: number;
  };
  companyInfo?: {
    name?: string;
    description?: string;
    website?: string;
    location?: string;
    industry?: string;
    employees?: string;
    founded?: string;
    contact?: {
      email?: string;
      phone?: string;
      address?: string;
    };
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
  };
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const scrapedDataSchema = new Schema<IScrapedData>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      scrapedAt: {
        type: Date,
        default: Date.now,
      },
      responseTime: {
        type: Number,
        required: true,
      },
      statusCode: {
        type: Number,
        required: true,
      },
      contentLength: {
        type: Number,
        required: true,
      },
    },
    companyInfo: {
      name: String,
      description: String,
      website: String,
      location: String,
      industry: String,
      employees: String,
      founded: String,
      contact: {
        email: String,
        phone: String,
        address: String,
      },
      socialMedia: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String,
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

scrapedDataSchema.index({ userId: 1, createdAt: -1 });
scrapedDataSchema.index({ url: 1 });

export const ScrapedData = model<IScrapedData>(
  "ScrapedData",
  scrapedDataSchema
);

// import mongoose, { Schema, Document } from "mongoose";

// export interface IScrapedData extends Document {
//   url: string;
//   data: any;
//   userId: string;
//   createdAt: Date;
// }

// const ScrapedDataSchema: Schema = new Schema(
//   {
//     url: { type: String, required: true },
//     data: { type: Schema.Types.Mixed, required: true },
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     createdAt: { type: Date, default: Date.now },
//   },
//   {
//     timestamps: false,
//     versionKey: false,
//   }
// );

// export const ScrapedData = mongoose.model<IScrapedData>(
//   "ScrapedData",
//   ScrapedDataSchema
// );
