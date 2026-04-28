import { User } from '../../models/auth/user.model';
import { IAuthResponse } from '../../interfaces/user.interface';
import { generateToken } from '../../utils/jwt.util';
import { generateOTP, getOTPExpiry } from '../../utils/otp.util';
import { sendOTPEmail } from '../../config/email';

export class AuthService {
  async signup(
    username: string,
    email: string,
    phoneNumber: string,
    password: string
  ): Promise<IAuthResponse> {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
      };
    }

    const otp = generateOTP();
    const otpExpires = getOTPExpiry();

    const user = await User.create({
      username,
      email,
      phoneNumber,
      password,
      otp,
      otpExpires,
      isVerified: false,
    });

    await sendOTPEmail(email, otp);

    return {
      success: true,
      message: 'Signup successful. Please check your email for OTP verification.',
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified,
        },
      },
    };
  }

  async verifyOTP(email: string, otp: string): Promise<IAuthResponse> {
    const user = await User.findOne({ email }).select('+otp +otpExpires');

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    if (user.isVerified) {
      return {
        success: false,
        message: 'User is already verified',
      };
    }

    if (!user.otp || !user.otpExpires) {
      return {
        success: false,
        message: 'OTP not found. Please request a new one.',
      };
    }

    if (user.otpExpires < new Date()) {
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.',
      };
    }

    if (user.otp !== otp) {
      return {
        success: false,
        message: 'Invalid OTP',
      };
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id.toString());

    return {
      success: true,
      message: 'Email verified successfully. You are now logged in.',
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified,
        },
        token,
      },
    };
  }

  async login(email: string, password: string): Promise<IAuthResponse> {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    if (!user.isVerified) {
      return {
        success: false,
        message: 'Please verify your email first',
      };
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const token = generateToken(user._id.toString());

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified,
        },
        token,
      },
    };
  }

  async forgotPassword(email: string): Promise<IAuthResponse> {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const otp = generateOTP();
    const otpExpires = getOTPExpiry();

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(email, otp);

    return {
      success: true,
      message: 'OTP sent to your email. Please verify to reset your password.',
    };
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<IAuthResponse> {
    const user = await User.findOne({ email }).select('+otp +otpExpires +password');

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    if (!user.otp || !user.otpExpires) {
      return {
        success: false,
        message: 'OTP not found. Please request a new one.',
      };
    }

    if (user.otpExpires < new Date()) {
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.',
      };
    }

    if (user.otp !== otp) {
      return {
        success: false,
        message: 'Invalid OTP',
      };
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return {
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    };
  }

  async resendOTP(email: string): Promise<IAuthResponse> {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    if (user.isVerified) {
      return {
        success: false,
        message: 'User is already verified',
      };
    }

    const otp = generateOTP();
    const otpExpires = getOTPExpiry();

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(email, otp);

    return {
      success: true,
      message: 'OTP resent successfully. Please check your email.',
    };
  }
}
