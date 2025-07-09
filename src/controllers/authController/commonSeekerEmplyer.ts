import { Request, Response } from "express";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import User from "../../models/authModel/userModel";
import JobSeeker from "../../models/authModel/jobSeeker";
import { IUser } from "../../models/authModel/userModel";
import { createToken } from "../../authService/tokenCreateValidate";

export const globalSignin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) as IUser & {
      _id: Types.ObjectId;
    };

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

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
    res.status(200).json({ success: true, token });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
