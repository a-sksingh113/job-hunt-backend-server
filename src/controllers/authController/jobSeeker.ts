import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../../models/authModel/userModel.js";
import JobSeeker from "../../models/authModel/jobSeeker.js";
import {  sendSignupNotificationToAdmin, sendVerificationEmailLink } from "../../emailService/authEmail/userAuth.js";

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


    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "job_seeker",
      isEmailVerified: false,
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

  const verificationToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendVerificationEmailLink(email, fullName, verificationUrl);
    await sendSignupNotificationToAdmin(fullName, email);

    
    res.status(201).json({ success: true,newUser, JobSeeker });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
