import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/authModel/userModel';
import JobSeeker from '../../models/authModel/jobSeeker';
import { IUser } from '../../models/authModel/userModel';


export const jobSeekerSignup = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: 'job_seeker',
    });

    await JobSeeker.create({
      userId: newUser._id,
      phone,
    });


    res.status(201).json({ success: true, JobSeeker});
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
