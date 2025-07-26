import express from "express";
import { employerSignup } from "../../controllers/authController/employer.js";
import { upload } from "../../cloudinary/cloudinaryUpload.js";
const router = express.Router();
router.post("/employer-signup", upload.single("companyLogoUrl"), employerSignup);
export default router;
