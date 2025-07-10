import express from 'express';
import { forgotPassword, globalSignin, handleLogout, resendOtp, resetPassword, verifyEmail, verifyOtp } from '../../controllers/authController/user';

const router = express.Router();

router.post('/signin', globalSignin);
router.post('/logout', handleLogout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/reset-password', resetPassword);

export default router;
