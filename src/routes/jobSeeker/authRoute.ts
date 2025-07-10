import express from 'express';
import { jobSeekerSignup } from '../../controllers/authController/jobSeeker';
const router = express.Router();

router.post('/signup',  jobSeekerSignup);

export default router;
