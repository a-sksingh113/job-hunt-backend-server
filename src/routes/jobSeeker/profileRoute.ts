import express from 'express';
import { handleGetSeekerProfile, updateSeekerProfile } from '../../controllers/profileController/jobSeeker.js';
import {upload} from '../../cloudinary/cloudinaryUpload.js';

const router = express.Router();

router.get('/profile', handleGetSeekerProfile);
router.put('/profile/update', upload.single("resumeUrl"), updateSeekerProfile);

export default router;
