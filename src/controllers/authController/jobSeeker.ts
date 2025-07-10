import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/authModel/userModel";
import JobSeeker from "../../models/authModel/jobSeeker";
import { IUser } from "../../models/authModel/userModel";
import { sendVerificationEmail } from "../../emailService/authEmail/userAuth";

export const jobSeekerSignup = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      domain,
      location,
      experienceYears,
      skills,
    } = req.body;
    const resumeUrl = req.file?.path || null;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "job_seeker",
      isEmailVerified: false,
      otp,
      otpExpires,
      isApproved:false
    });

    await JobSeeker.create({
      userId: newUser._id,
      phone,
      domain,
      location,
      experienceYears,
      skills,
      resumeUrl,
    
    });

    await sendVerificationEmail(newUser.email, otp, newUser.fullName);

    res.status(201).json({ success: true,newUser, JobSeeker });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
