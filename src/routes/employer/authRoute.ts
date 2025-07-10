import express from "express";
import { employerSignup } from "../../controllers/authController/employer";
import upload from "../../cloudinary/cloudinaryUpload";
const router = express.Router();

router.post(
  "/employer-signup",
  upload.single("companyLogoUrl"),
  employerSignup
);

export default router;
