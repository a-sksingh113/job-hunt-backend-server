import { Request, Response } from "express";
import { Types } from "mongoose";
import Employer from "../../models/authModel/employer";
import Job from "../../models/jobModel/job";

export const postJob = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id as string;
  const { expireInDays, ...jobData } = req.body;

  try {
    const employer = await Employer.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!employer) {
      res
        .status(404)
        .json({ success: false, message: "Employer profile not found" });
      return;
    }

    const daysToExpire = expireInDays ?? 30;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + daysToExpire);

    const job = await Job.create({
      employerId: employer._id,
      ...jobData,
      deadline,
    });

    res
      .status(201)
      .json({ success: true, message: "Job posted successfully", job });
  } catch (error: any) {
    console.error(`Job post error: ${error}`);
    res
      .status(500)
      .json({ success: false, message: `Job post error: ${error.message}` });
  }
};

export const updateJob = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id as string;
  const jobId = req.params.jobId;
  const updateData = req.body;

  try {
    const employer = await Employer.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!employer) {
      res
        .status(404)
        .json({ success: false, message: "Employer profile not found" });
      return;
    }

    const job = await Job.findOne({ _id: jobId, employerId: employer._id });
    if (!job) {
      res
        .status(404)
        .json({ success: false, message: "Job not found or unauthorized" });
      return;
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error: any) {
    console.error(`Update job error: ${error}`);
    res
      .status(500)
      .json({ success: false, message: `Update job error: ${error.message}` });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id as string;
  const jobId = req.params.jobId;

  try {
    const employer = await Employer.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!employer) {
      res
        .status(404)
        .json({ success: false, message: "Employer profile not found" });
      return;
    }

    const job = await Job.findOne({ _id: jobId, employerId: employer._id });
    if (!job) {
      res
        .status(404)
        .json({ success: false, message: "Job not found or unauthorized" });
      return;
    }

    await Job.findByIdAndDelete(jobId);

    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error: any) {
    console.error(`Delete job error: ${error}`);
    res
      .status(500)
      .json({ success: false, message: `Delete job error: ${error.message}` });
  }
};

export const getAllMyCreatedJobs = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const userId = req.user.id;

  try {
    const employer = await Employer.findOne({ userId });
    if (!employer)
      return res
        .status(404)
        .json({ success: false, message: "Employer profile not found" });

    const { title, jobType, salaryRange, deadline } = req.query;

    const filter: any = { employerId: employer._id };

    if (title) {
      filter.title = { $regex: new RegExp(title as string, "i") };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (salaryRange) {
      const [min, max] = (salaryRange as string).split(",").map(Number);
      filter.salary = { $gte: min, $lte: max };
    }

    if (deadline) {
      filter.deadline = { $lte: new Date(deadline as string) };
    }

    const jobs = await Job.find(filter);

    res.status(200).json({ success: true, jobs });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: `Error fetching jobs: ${error.message || error}`,
    });
  }
};

export const getPostedJobById = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const userId = req.user.id;
  const { jobId } = req.params;

  try {
    const employer = await Employer.findOne({ userId });
    if (!employer) {
      return res
        .status(404)
        .json({ success: false, message: "Employer profile not found" });
    }

    const job = await Job.findOne({
      _id: jobId,
      employerId: employer._id,
    });

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found or unauthorized" });
    }

    res.status(200).json({ success: true, job });
  } catch (error: any) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({
      success: false,
      message: `getPostedJobById error: ${error.message || error}`,
    });
  }
};
