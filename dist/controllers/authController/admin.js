import bcrypt from "bcrypt";
import User from "../../models/authModel/userModel.js";
export const adminSignup = async (req, res) => {
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
            isEmailVerified: false,
            isApproved: false,
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
    }
    catch (error) {
        console.error("Admin Signup Error:", error);
        res.status(500).json({ success: false, message: error.message || "Signup failed" });
    }
};
