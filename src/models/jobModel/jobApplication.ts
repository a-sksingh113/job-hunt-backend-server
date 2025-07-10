import mongoose, { Schema, Document, Types, model } from "mongoose";

export type ApplicationStatus =
  | "applied"
  | "reviewed"
  | "accepted"
  | "interview"
  | "rejected";

export interface IJobApplication extends Document {
  jobId: Types.ObjectId;
  jobSeekerId: Types.ObjectId;
  status: ApplicationStatus;
  coverLetter?: string;
  aiInsightScore: Number;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobSeekerId: {
      type: Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "reviewed", "accepted", "interview", "rejected"],
      default: "applied",
      required: true,
    },
     aiInsightScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0, 
    }, 
  },
  {
    timestamps: true,
  }
);

export default model<IJobApplication>("JobApplication", jobApplicationSchema);
