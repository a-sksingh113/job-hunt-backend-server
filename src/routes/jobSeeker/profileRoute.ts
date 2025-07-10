import express from 'express';
import { handleGetSeekerProfile, updateSeekerProfile } from '../../controllers/profileController/jobSeeker';

const router = express.Router();

router.get('/me', handleGetSeekerProfile);
router.put('/me',  updateSeekerProfile);

export default router;
