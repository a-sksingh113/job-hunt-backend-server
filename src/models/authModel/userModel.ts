import mongoose, { Document, Schema, model } from 'mongoose';
export type UserRole = 'user' | 'job_seeker' | 'employer' | 'admin';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phone:string;
  role: UserRole;
  isEmailVerified: boolean;
  isApproved: boolean;
    otp?: string;
  otpExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['user', 'job_seeker', 'employer', 'admin'],
      default: 'user',
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
       otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
     phone: {
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);

export default model<IUser>('User', userSchema);
