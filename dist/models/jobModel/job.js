import { Schema, model } from 'mongoose';
const jobSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    openings: {
        type: Number,
        default: 1,
        required: true,
    },
    acceptedCount: {
        type: Number,
        default: 0,
    },
    location: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        default: null,
    },
    domain: {
        type: String,
        required: true,
    },
    experienceRequired: {
        type: String,
        default: null,
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time',
        required: true,
    },
    deadline: {
        type: Date,
        default: null,
    },
    isOfferSent: {
        type: Boolean,
        default: false,
    },
    offeredJobSeekerId: {
        type: Schema.Types.ObjectId,
        ref: 'JobSeeker',
        default: null,
    },
    isAcceptedByJobSeeker: {
        type: Boolean,
        default: false,
    },
    employerId: {
        type: Schema.Types.ObjectId,
        ref: 'Employer',
        required: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    hiredJobSeekerId: {
        type: Schema.Types.ObjectId,
        ref: 'JobSeeker',
        default: null,
    },
}, {
    timestamps: true,
});
export default model('Job', jobSchema);
