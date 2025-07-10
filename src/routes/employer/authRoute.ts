import express from 'express';
import { employerSignup } from '../../controllers/authController/employer';
const router = express.Router();

router.post('/signup',  employerSignup);

export default router;
