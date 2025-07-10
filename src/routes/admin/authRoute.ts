import express from 'express';
import { adminSignup } from '../../controllers/authController/admin';
const router = express.Router();

router.post('/signup',  adminSignup);

export default router;
