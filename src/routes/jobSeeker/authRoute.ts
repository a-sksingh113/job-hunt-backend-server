import express from 'express';
import { jobSeekerSignup } from '../../controllers/authController/jobSeeker';
import upload from '../../cloudinary/cloudinaryUpload';
const router = express.Router();

router.post('/seeker-signup',upload("resumeLogos").single("resumeUrl"),  jobSeekerSignup);

export default router;
