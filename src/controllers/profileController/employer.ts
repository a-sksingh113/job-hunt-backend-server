import { Request, Response } from "express";
import EmployerModel from "../../models/authModel/employer.js";

export const handleGetEmployerProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string };

    const employer = await EmployerModel.findOne({ userId: user.id }).populate(
      "userId",
      "-password"
    );

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employer,
    });
  } catch (error: any) {
    console.error("getMyProfile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const updateEmployerProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string };
    const updatedFields = req.body;

    const employer = await EmployerModel.findOneAndUpdate(
      { userId: user.id },
      { $set: updatedFields },
      { new: true }
    ).populate("userId", "-password");

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: employer,
    });
  } catch (error: any) {
    console.error("updateEmployerProfile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
