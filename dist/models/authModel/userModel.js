import { Schema, model } from 'mongoose';
const userSchema = new Schema({
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.virtual('employerDetails', {
    ref: 'Employer',
    localField: '_id',
    foreignField: 'userId',
    justOne: true,
});
userSchema.virtual('jobSeekerDetails', {
    ref: 'JobSeeker',
    localField: '_id',
    foreignField: 'userId',
    justOne: true
});
export default model('User', userSchema);
