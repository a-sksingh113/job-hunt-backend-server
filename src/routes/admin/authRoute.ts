import express from 'express';
import { adminSignup } from '../../controllers/authController/admin';
const router = express.Router();

router.post('/admin-signup',  adminSignup);

export default router;
