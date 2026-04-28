import { Router } from 'express';
import { AuthController } from '../controllers/auth/auth.controller';
import {
  signupValidation,
  verifyOTPValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../validations/auth.validation';

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user and send OTP
 * @access  Public
 */
router.post('/signup', signupValidation, authController.signup);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and complete registration
 * @access  Public
 */
router.post('/verify-otp', verifyOTPValidation, authController.verifyOTP);

/**
 * @route   POST /api/auth/login
 * @desc    Login user with email and password
 * @access  Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send OTP for password reset
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with OTP verification
 * @access  Public
 */
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP to user's email
 * @access  Public
 */
router.post('/resend-otp', authController.resendOTP);

export default router;
