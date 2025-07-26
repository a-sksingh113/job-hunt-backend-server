import JobApplication from "../../models/jobModel/jobApplication.js";
import Employer from "../../models/authModel/employer.js";
import Job from "../../models/jobModel/job.js";
import { Types } from "mongoose";
export const getAllApplications = async (_req, res) => {
    try {
        const applications = await JobApplication.find()
            .select("jobId jobSeekerId aiInsightScore status createdAt updatedAt")
            .populate({
            path: "jobSeekerId",
            populate: {
                path: "userId",
                model: "User",
                select: "fullName email",
            },
        })
            .populate("jobId");
        res.status(200).json(applications);
    }
    catch (error) {
        console.error("getAllApplications Error:", error);
        res.status(500).json({ success: false, message: `Error: ${error}` });
    }
};
export const getApplicationsByEmployer = async (req, res) => {
    try {
        const userId = req.user?.id;
        const employer = await Employer.findOne({ userId: new Types.ObjectId(userId) });
        if (!employer) {
            return res.status(404).json({ success: false, message: "Employer profile not found" });
        }
        const jobs = await Job.find({ employerId: employer._id }).select("_id");
        const jobIds = jobs.map(job => job._id);
        const applications = await JobApplication.find({ jobId: { $in: jobIds } })
            .select("jobId jobSeekerId aiInsightScore status createdAt updatedAt")
            .populate({
            path: "jobSeekerId",
            populate: {
                path: "userId",
                model: "User",
                select: "fullName email",
            },
        })
            .populate({
            path: "jobId",
            select: "title location jobType createdAt deadline",
        });
        res.status(200).json({ success: true, applications });
    }
    catch (error) {
        console.error("getApplicationsByEmployer Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export const getApplicationsByJobId = async (req, res) => {
    const { jobId } = req.body;
    const userId = req.user?.id;
    try {
        const employer = await Employer.findOne({ userId });
        if (!employer)
            return res.status(404).json({ success: false, message: "Employer profile not found" });
        const job = await Job.findById(jobId);
        if (!job)
            return res.status(404).json({ success: false, message: "Job not found" });
        const applications = await JobApplication.find({ jobId })
            .populate({
            path: "jobSeekerId",
            populate: {
                path: "userId",
                model: "User",
                select: "fullName email",
            },
        });
        return res.status(200).json(applications);
    }
    catch (error) {
        console.error("getApplicationsByJobId Error:", error);
        res.status(500).json({ success: false, message: `Error: ${error}` });
    }
};
export const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    try {
        const employer = await Employer.findOne({ userId });
        if (!employer)
            return res.status(404).json({ success: false, message: "Employer profile not found" });
        const application = await JobApplication.findById(id);
        if (!application)
            return res.status(404).json({ success: false, message: "Application not found" });
        const job = await Job.findById(application.jobId);
        application.status = status;
        await application.save();
        res.status(200).json({ success: true, message: "Application updated", application });
    }
    catch (error) {
        console.error("updateApplicationStatus Error:", error);
        res.status(500).json({ success: false, message: `Error: ${error}` });
    }
};
