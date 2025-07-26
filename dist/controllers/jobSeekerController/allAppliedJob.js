import { Types } from "mongoose";
import JobSeeker from "../../models/authModel/jobSeeker.js";
import JobApplication from "../../models/jobModel/jobApplication.js";
export const getAppliedJobs = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const userId = req.user.id;
        const jobSeeker = await JobSeeker.findOne({
            userId: new Types.ObjectId(userId),
        });
        if (!jobSeeker)
            return res
                .status(404)
                .json({ success: false, message: "Job seeker profile not found" });
        const applications = await JobApplication.find({
            jobSeekerId: jobSeeker._id,
        })
            .populate("jobId", [
            "title",
            "description",
            "location",
            "salary",
            "jobType",
            "domain",
            "experienceRequired",
        ])
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Applied jobs fetched successfully",
            applications,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({
            success: false,
            message: `Error fetching applied jobs: ${error}`,
        });
    }
};
export const getAppliedJobById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const userId = req.user.id;
        const { jobId } = req.params;
        const jobSeeker = await JobSeeker.findOne({
            userId: new Types.ObjectId(userId),
        });
        if (!jobSeeker)
            return res
                .status(404)
                .json({ success: false, message: "Job seeker profile not found" });
        const application = await JobApplication.findOne({
            jobId: new Types.ObjectId(jobId),
            jobSeekerId: jobSeeker._id,
        }).populate("jobId", [
            "title",
            "description",
            "location",
            "salary",
            "jobType",
            "domain",
            "experienceRequired",
        ]);
        if (!application) {
            return res
                .status(404)
                .json({ success: false, message: "No application found for this job" });
        }
        res.status(200).json({
            success: true,
            message: "Applied job fetched successfully",
            application,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({
            success: false,
            message: `Error fetching application: ${error}`,
        });
    }
};
