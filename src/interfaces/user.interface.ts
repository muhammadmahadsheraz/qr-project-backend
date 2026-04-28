import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      username: string;
      email: string;
      phoneNumber: string;
      isVerified: boolean;
    };
    token?: string;
  };
}
