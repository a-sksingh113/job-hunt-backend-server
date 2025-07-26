import { Schema, model } from 'mongoose';
const jobOfferSchema = new Schema({
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
}, {
    timestamps: true,
});
export default model('JobOffer', jobOfferSchema);
