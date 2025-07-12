import { Request, Response } from "express";
import JobApplication from "../../models/jobModel/jobApplication";
import Employer from "../../models/authModel/employer";
import Job from "../../models/jobModel/job";


export const getAllApplications = async (_req: Request, res: Response) => {
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
  } catch (error) {
    console.error("getAllApplications Error:", error);
    res.status(500).json({ success: false, message: `Error: ${error}` });
  }
};

export const getApplicationsByJobId = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("getApplicationsByJobId Error:", error);
    res.status(500).json({ success: false, message: `Error: ${error}` });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("updateApplicationStatus Error:", error);
    res.status(500).json({ success: false, message: `Error: ${error}` });
  }
};

