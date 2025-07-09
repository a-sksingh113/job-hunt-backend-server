import mongoose, { Schema, model, Document, Types } from 'mongoose';

export type JobOfferStatus = 'sent' | 'accepted' | 'rejected';

export interface IJobOffer extends Document {
  status: JobOfferStatus;
  employerId: Types.ObjectId;
  jobId: Types.ObjectId;
  jobSeekerId: Types.ObjectId;
  sentAt: Date;
  respondedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobOfferSchema = new Schema<IJobOffer>(
  {
    status: {
      type: String,
      enum: ['sent', 'accepted', 'rejected'],
      default: 'sent',
    },

    employerId: {
      type: Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },

    jobSeekerId: {
      type: Schema.Types.ObjectId,
      ref: 'JobSeeker',
      required: true,
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

export default model<IJobOffer>('JobOffer', jobOfferSchema);
