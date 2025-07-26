import JobSeeker from "../../models/authModel/jobSeeker.js";
export const handleGetSeekerProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const jobSeeker = await JobSeeker.findOne({ userId }).populate('userId', '-password');
        if (!jobSeeker)
            return res.status(404).json({ success: false, message: 'Job seeker profile not found' });
        res.status(200).json({ success: true, jobSeeker });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const updateSeekerProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const updateFields = {
            ...req.body,
        };
        if (req.file) {
            updateFields.resumeUrl = req.file.path;
        }
        const updated = await JobSeeker.findOneAndUpdate({ userId }, { $set: updateFields }, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.status(200).json({ success: true, message: 'Profile updated', updated });
    }
    catch (error) {
        console.error("Update seeker profile error:", error);
        console.error("Error message:", error.message);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};
