import mongoose, { Schema, Document, model, Types } from 'mongoose';

export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '500+';

export interface IEmployer extends Document {
  userId: Types.ObjectId;
  companyName: string;
  companyLogoUrl?: string;
  companySize: CompanySize;
  industry: string;
  location: string;
  description: string;
  phone: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const employerSchema = new Schema<IEmployer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogoUrl: {
      type: String,
      default: null,
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
      required: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IEmployer>('Employer', employerSchema);
