import express from 'express';
import { jobSeekerSignup } from '../../controllers/authController/jobSeeker.js';
import{ upload} from '../../cloudinary/cloudinaryUpload.js';
const router = express.Router();

router.post('/seeker-signup',upload.single("resumeUrl"),  jobSeekerSignup);

export default router;
