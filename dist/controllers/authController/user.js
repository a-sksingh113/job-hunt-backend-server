import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../../models/authModel/userModel.js";
import { createToken } from "../../authService/tokenCreateValidate.js";
import { sendForgetPasswordOtp, sendVerificationEmail, sendVerificationEmailLink, } from "../../emailService/authEmail/userAuth.js";
import setTokenCookie from "../../authService/setTokenCookie.js";
import clearTokenCookie from "../../authService/clearTokenCookie.js";
//globalSignin
//handleLogout
//forgotPassword
//verifyEmail
//resendOtp
//resetPassword
export const globalSignin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = (await User.findOne({ email }));
        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Email not verified. Please verify your email.",
            });
        }
        if (!user.isApproved) {
            return res.status(403).json({
                success: false,
                message: "Account not Approved by admin.",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
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
        res.status(200).json({ success: true, token, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const handleLogout = (req, res) => {
    try {
        clearTokenCookie(res);
        res.status(200).json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        console.error(`Logout error: ${error}`);
        res
            .status(500)
            .json({
            success: false,
            message: `Logout error: ${error.message || error}`,
        });
    }
};
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" });
            return;
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "Email not found" });
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        await sendForgetPasswordOtp(user.email, user.fullName, otp);
        res.status(200).json({ success: true, message: "OTP sent to email", user });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || error,
        });
    }
};
export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            res
                .status(400)
                .json({ success: false, message: "Email and OTP are required" });
            return;
        }
        const user = await User.findOne({ otp });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        if (!user.otp ||
            !user.otpExpires ||
            user.otp !== otp ||
            user.otpExpires < new Date()) {
            res
                .status(400)
                .json({ success: false, message: "Invalid or expired OTP" });
            return;
        }
        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res
            .status(200)
            .json({ success: true, message: "Email verified successfully" });
    }
    catch (error) {
        console.error("Verify Email Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || error,
        });
    }
};
export const verifyEmailLink = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid or expired verification link." });
        }
        if (user.isEmailVerified) {
            return res
                .status(200)
                .json({ success: true, message: "Email already verified." });
        }
        user.isEmailVerified = true;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Email successfully verified. You can now log in.",
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Invalid or expired token." });
    }
};
export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: "Email is already verified." });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
        const emailSent = await sendVerificationEmailLink(email, verificationUrl, user.fullName);
        if (!emailSent) {
            return res.status(500).json({ success: false, message: "Failed to send email." });
        }
        return res.status(200).json({
            success: true,
            message: "Verification email resent successfully.",
        });
    }
    catch (error) {
        console.error("Resend verification error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};
export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            res
                .status(400)
                .json({ success: false, message: "Email and OTP are required" });
            return;
        }
        const user = await User.findOne({ otp });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        if (!user.otp ||
            !user.otpExpires ||
            user.otp !== otp ||
            user.otpExpires < new Date()) {
            res
                .status(400)
                .json({ success: false, message: "Invalid or expired OTP" });
            return;
        }
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res
            .status(200)
            .json({ success: true, message: "Otp verified successfully" });
    }
    catch (error) {
        console.error("Verify Otp Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || error,
        });
    }
};
export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" });
            return;
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        await sendVerificationEmail(user.email, otp, user.fullName);
        res.status(200).json({ success: true, message: "OTP resent successfully" });
    }
    catch (error) {
        console.error("Resend OTP Error:", error);
        res
            .status(500)
            .json({ success: false, message: `ResendOtp error: ${error}` });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            res.status(400).json({
                success: false,
                message: "Email and new password are required",
            });
            return;
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res
            .status(200)
            .json({ success: true, message: "Password reset successful" });
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || error,
        });
    }
};
