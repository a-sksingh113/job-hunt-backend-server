import express from 'express';
import { handleGetSeekerProfile, updateSeekerProfile } from '../../controllers/profileController/jobSeeker';
import upload from '../../cloudinary/cloudinaryUpload';

const router = express.Router();

router.get('/profile', handleGetSeekerProfile);
router.put('/profile/update', upload.single("resumeUrl"), updateSeekerProfile);

export default router;
