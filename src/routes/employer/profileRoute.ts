import express from 'express';
import { handleGetEmployerProfile, updateEmployerProfile } from '../../controllers/profileController/employer';
const router = express.Router();

router.get('/me', handleGetEmployerProfile);
router.put('/me',  updateEmployerProfile);

export default router;
