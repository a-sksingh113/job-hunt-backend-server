import { Request, Response } from "express";
import User from "../../models/authModel/userModel";
import JobSeeker from "../../models/authModel/jobSeeker";
import Employer from "../../models/authModel/employer";

export const getAllPendingSeeker = async (_req: Request, res: Response) => {
  try {
    const seekers = await User.find({  isApproved: false,role: "job_seeker" })
      .select("-password")
      .populate("jobSeekerDetails");

    res.status(200).json({ success: true, seekers });
  } catch (error: any) {
    console.error("Get All Seekers Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Error fetching seekers",
      });
  }
};

export const getAllPendingEmployer = async (_req: Request, res: Response) => {
  try {
    const employers = await User.find({ isApproved: false, role: "employer" })
      .select("-password")
      .populate('employerDetails');

    res.status(200).json({ success: true, employers });
  } catch (error: any) {
    console.error("Get All Employers Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Error fetching employers",
      });
  }
};

export const approveEmployerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.role !== "employer") {
      return res
        .status(404)
        .json({ success: false, message: "Employer not found" });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({ success: true, message: "Employer approved", user });
  } catch (error: any) {
    console.error("Approve Employer Error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Approval failed" });
  }
};

export const approveJobSeekerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.role !== "job_seeker") {
      return res
        .status(404)
        .json({ success: false, message: "JobSeeker not found" });
    }

    user.isApproved = true;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "JobSeeker approved", user });
  } catch (error: any) {
    console.error("Approve JobSeeker Error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Approval failed" });
  }
};

export const rejectJobSeekerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.role !== "job_seeker") {
      return res
        .status(404)
        .json({ success: false, message: "JobSeeker not found" });
    }

    await JobSeeker.deleteOne({ userId: user._id });
    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "JobSeeker rejected and removed" });
  } catch (error: any) {
    console.error("Reject JobSeeker Error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Rejection failed" });
  }
};

export const rejectEmployerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.role !== "employer") {
      return res
        .status(404)
        .json({ success: false, message: "Employer not found" });
    }

    await Employer.deleteOne({ userId: user._id });
    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Employer rejected and removed" });
  } catch (error: any) {
    console.error("Reject Employer Error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Rejection failed" });
  }
};
