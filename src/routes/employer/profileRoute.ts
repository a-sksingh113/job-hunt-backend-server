import express from 'express';
import { handleGetEmployerProfile, updateEmployerProfile } from '../../controllers/profileController/employer.js';
const router = express.Router();

router.get('/profile', handleGetEmployerProfile);
router.put('/profile/update',  updateEmployerProfile);

export default router;
