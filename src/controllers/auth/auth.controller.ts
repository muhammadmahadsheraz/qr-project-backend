import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../../services/auth/auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { username, email, phoneNumber, password } = req.body;
      const result = await authService.signup(username, email, phoneNumber, password);

      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }

  async verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { email, otp } = req.body;
      const result = await authService.verifyOTP(email, otp);

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(result.success ? 200 : 401).json(result);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { email } = req.body;
      const result = await authService.forgotPassword(email);

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { email, otp, newPassword } = req.body;
      const result = await authService.resetPassword(email, otp, newPassword);

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resendOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required',
        });
        return;
      }

      const result = await authService.resendOTP(email);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { username, email, phoneNumber } = req.body;
      const result = await authService.updateUser(req.userId!, { username, email, phoneNumber });

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }
}
