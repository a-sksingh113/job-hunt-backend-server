import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../../models/authModel/userModel";
import JobSeeker from "../../models/authModel/jobSeeker";
import Employer from "../../models/authModel/employer";
import { Types } from "mongoose";
import { createToken } from "../../authService/tokenCreateValidate";
import setTokenCookie from "../../authService/setTokenCookie";
import clearTokenCookie from "../../authService/clearTokenCookie";



export const adminSignup = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: "user",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Signup successful. Verify email and wait for approval.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Admin Signup Error:", error);
    res.status(500).json({ success: false, message: error.message || "Signup failed" });
  }
};

export const adminSignin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

     const user = (await User.findOne({ email })) as IUser & {
        _id: Types.ObjectId;
      };
  
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Invalid credentials" });
    }

   const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    const token = createToken({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });

    if (!token) {
      return res
        .status(500)
        .json({ success: false, message: "Token creation failed" });
    }

    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Admin Signin Error:", error);
    res.status(500).json({ success: false, message: error.message || "Login failed" });
  }
};

export const adminLogout = (req: Request, res: Response): void => {
  try {
    clearTokenCookie(res);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.error(`Logout error: ${error}`);
    res
      .status(500)
      .json({
        success: false,
        message: `Logout error: ${error.message || error}`,
      });
  }
};


