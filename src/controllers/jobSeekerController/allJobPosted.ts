import { Request, Response } from "express";
import { Types } from "mongoose";
import Job from "../../models/jobModel/job";
import JobSeeker from "../../models/authModel/jobSeeker";
import JobApplication from "../../models/jobModel/jobApplication";
import { getInsightScore } from "../../aiInSight/score"

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");
    const skip = (page - 1) * limit;

    const { location, domain, jobType, keyword } = req.query;
    const filter: any = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (domain) filter.domain = { $regex: domain, $options: "i" };
    if (jobType) filter.jobType = jobType;
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const totalJobs = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
      jobs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: `Server error: ${err}` });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({
      success: true,
      message: "Job details fetched successfully",
      job,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Error fetching job: ${err}` });
  }
};

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.body;
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

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    const existingApplication = await JobApplication.findOne({
      jobId: job._id,
      jobSeekerId: jobSeeker._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    const jobText = `
   ${job.title}. ${job.description}.
Domain: ${job.domain}.
Skills required: ${job.skills?.join(", ") || ""}
    `.trim();

    const seekerText = `
Domain: ${jobSeeker.domain}.
Skills: ${jobSeeker.skills?.join(", ") || ""}
    `.trim();

    const { score: aiInsightScore } = await getInsightScore(
      jobText,
      seekerText
    );

    const application = await JobApplication.create({
      jobId: job._id,
      jobSeekerId: jobSeeker._id,
      aiInsightScore,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Error applying: ${error}` });
  }
};
