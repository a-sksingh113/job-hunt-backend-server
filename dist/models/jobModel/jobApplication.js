import { Schema, model } from "mongoose";
const jobApplicationSchema = new Schema({
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
}, {
    timestamps: true,
});
export default model("JobApplication", jobApplicationSchema);
