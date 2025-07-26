import { Schema, model } from 'mongoose';
const jobSeekerSchema = new Schema({
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
}, {
    timestamps: true,
});
export default model('JobSeeker', jobSeekerSchema);
