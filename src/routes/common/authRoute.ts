import express from 'express';
import { forgotPassword, globalSignin, handleLogout, resendOtp, resendVerificationEmail, resetPassword, verifyEmail, verifyEmailLink, verifyOtp } from '../../controllers/authController/user.js';

const router = express.Router();

router.post('/signin', globalSignin);
router.post('/logout', handleLogout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/verify-email', verifyEmail);
router.get("/verify-email/:token", verifyEmailLink);
router.post("/resend-link", resendVerificationEmail);
router.post('/resend-otp', resendOtp);
router.post('/reset-password', resetPassword);

export default router;
