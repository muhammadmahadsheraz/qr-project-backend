import { Router } from 'express';
import { QRController } from '../controllers/qr/qr.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createQRValidation,
  updateQRValidation,
  mongoIdValidation,
} from '../validations/qr.validation';

const router = Router();
const qrController = new QRController();

/**
 * @route   POST /api/qr
 * @desc    Create a new QR code
 * @access  Private
 */
router.post('/', authenticate, createQRValidation, qrController.createQR);

/**
 * @route   GET /api/qr
 * @desc    Get all QR codes for the logged-in user
 * @access  Private
 */
router.get('/', authenticate, qrController.getAllQRs);

/**
 * @route   GET /api/qr/:id
 * @desc    Get a single QR code by ID
 * @access  Private
 */
router.get('/:id', authenticate, mongoIdValidation, qrController.getQRById);

/**
 * @route   PUT /api/qr/:id
 * @desc    Update a QR code
 * @access  Private
 */
router.put('/:id', authenticate, updateQRValidation, qrController.updateQR);

/**
 * @route   DELETE /api/qr/:id
 * @desc    Delete a QR code
 * @access  Private
 */
router.delete('/:id', authenticate, mongoIdValidation, qrController.deleteQR);

/**
 * @route   PATCH /api/qr/:id/scan
 * @desc    Increment scan count (called when QR is scanned)
 * @access  Public
 */
router.patch('/:id/scan', mongoIdValidation, qrController.incrementScan);

export default router;
