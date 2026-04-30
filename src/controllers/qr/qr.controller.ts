import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { QRService } from '../../services/qr/qr.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const qrService = new QRService();

export class QRController {
  async createQR(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const { name, type, whatsappData, websiteData } = req.body;
      const result = await qrService.createQR(req.userId!, name, type, {
        whatsappData,
        websiteData,
      });

      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllQRs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await qrService.getAllQRs(req.userId!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getQRById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const result = await qrService.getQRById(req.userId!, req.params.id);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateQR(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const { name, type, whatsappData, websiteData } = req.body;
      const result = await qrService.updateQR(req.userId!, req.params.id, {
        name,
        type,
        whatsappData,
        websiteData,
      });

      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteQR(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const result = await qrService.deleteQR(req.userId!, req.params.id);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      next(error);
    }
  }

  async incrementScan(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

      const result = await qrService.incrementScan(req.params.id);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Called when a physical QR code is scanned — increments scan count and redirects
  async resolveRedirect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Invalid QR ID',
        });
        return;
      }

      const result = await qrService.resolveRedirectUrl(req.params.id);

      if (!result.success || !result.redirectUrl) {
        res.status(404).json({
          success: false,
          message: result.message || 'QR not found',
        });
        return;
      }

      // 302 redirect to the resolved URL
      res.redirect(302, result.redirectUrl);
    } catch (error) {
      next(error);
    }
  }
}
