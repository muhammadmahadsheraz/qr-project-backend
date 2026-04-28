import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { User } from '../models/auth/user.model';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication token is required',
      });
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({
        success: false,
        message: 'Please verify your email first',
      });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
