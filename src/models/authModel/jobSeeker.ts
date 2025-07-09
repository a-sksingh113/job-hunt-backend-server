import mongoose, { Document, Schema, model, Types } from 'mongoose';
import { IUser } from '../authModel/userModel'; 

export type AvailabilityStatus = 'available' | 'not_available' | 'employed';

export interface IJobSeeker extends Document {
  userId: Types.ObjectId;
  profilePicUrl?: string;
  domain?: string;
  location?: string;
  experienceYears?: number;
  phone: string;
  skills?: string[]; 
  resumeUrl?: string;
  availabilityStatus: AvailabilityStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobSeekerSchema = new Schema<IJobSeeker>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    profilePicUrl: {
      type: String,
      default: null,
    },

    domain: {
      type: String,
      default: null,
    },

    location: {
      type: String,
      default: null,
    },

    experienceYears: {
      type: Number,
      default: null,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    resumeUrl: {
      type: String,
      default: null,
    },

    availabilityStatus: {
      type: String,
      enum: ['available', 'not_available', 'employed'],
      default: 'available',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IJobSeeker>('JobSeeker', jobSeekerSchema);
