import { Request, Response } from 'express';
import EmployerModel, { IEmployer } from '../../models/authModel/employer';
import User from '../../models/authModel/userModel';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { sendVerificationEmailLink } from '../../emailService/authEmail/userAuth';

export const employerSignup = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      companyName,
      companySize,
      industry,
      location,
      description,
    } = req.body;

     const companyLogoUrl = req.file?.path || null;
    
    const existingEmployer = await User.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({
        success: false,
        message: 'Employer already exists.',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);


   const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "employer",
      isEmailVerified: false,
   
      isApproved:false
    });

    const newEmployer = new EmployerModel({
      userId: newUser.id,
      companyName,
      companySize,
      industry,
      location,
      description,
      phone,
      companyLogoUrl,
      
    });

    await newEmployer.save();

   const verificationToken = jwt.sign(
       { userId: newUser._id },
       process.env.JWT_SECRET!,
       { expiresIn: "1h" }
     );
 
     const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
     await sendVerificationEmailLink(email, fullName, verificationUrl);
    return res.status(201).json({
      success: true,
      message: 'Employer profile created successfully',
      newUser,
      newEmployer,
    });
  } catch (error: any) {
    console.error('EmployerSignup error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
