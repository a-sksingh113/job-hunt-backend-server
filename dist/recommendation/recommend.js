import Job from "../models/jobModel/job.js";
import JobSeeker from "../models/authModel/jobSeeker.js";
import JobApplication from "../models/jobModel/jobApplication.js";
import { getInsightScore } from "../aiInSight/score.js";
export const recommendJobs = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const userId = req.user.id;
        const jobSeeker = await JobSeeker.findOne({ userId }).lean();
        if (!jobSeeker) {
            return res
                .status(404)
                .json({ success: false, message: "Job seeker profile not found" });
        }
        const appliedJobs = await JobApplication.find({
            jobSeekerId: jobSeeker._id,
        }).select("jobId");
        const appliedJobIds = appliedJobs.map((app) => app.jobId.toString());
        const jobs = await Job.find({
            deadline: { $gt: new Date() },
            _id: { $nin: appliedJobIds },
        }).lean();
        const seekerText = `
Domain: ${jobSeeker.domain || ""}.
Skills: ${jobSeeker.skills?.join(", ") || ""}
    `.trim();
        const scoredJobs = await Promise.all(jobs.map(async (job) => {
            const jobText = `
${job.title}. ${job.description}.
Domain: ${job.domain}.
Skills required: ${job.skills?.join(", ") || ""}
        `.trim();
            const { score } = await getInsightScore(jobText, seekerText);
            return { ...job, aiInsightScore: score };
        }));
        const filteredAndSortedJobs = scoredJobs
            .filter((job) => job.aiInsightScore > 7)
            .sort((a, b) => b.aiInsightScore - a.aiInsightScore)
            .slice(0, 10);
        return res.json({ success: true, jobs: filteredAndSortedJobs });
    }
    catch (err) {
        console.error("Job recommendation error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
