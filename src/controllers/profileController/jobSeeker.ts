import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/authModel/userModel";
import JobSeeker from "../../models/authModel/jobSeeker";
import { IUser } from "../../models/authModel/userModel";
import { sendVerificationEmail } from "../../emailService/authEmail/userAuth";

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const jobSeeker = await JobSeeker.findOne({ userId }).populate('userId', '-password');

    if (!jobSeeker)
      return res.status(404).json({ success: false, message: 'Job seeker profile not found' });

    res.status(200).json({ success: true, jobSeeker });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSeekerProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const updated = await JobSeeker.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: 'Profile not found' });

    res.status(200).json({ success: true, message: 'Profile updated', updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
