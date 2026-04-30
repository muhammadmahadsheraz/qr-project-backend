import { body, param } from 'express-validator';

export const createQRValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('QR name is required'),

  body('type')
    .trim()
    .notEmpty()
    .withMessage('QR type is required')
    .isIn(['whatsapp', 'website'])
    .withMessage('Type must be either "whatsapp" or "website"'),

  // Whatsapp-specific validation
  body('whatsappData.name')
    .if(body('type').equals('whatsapp'))
    .trim()
    .notEmpty()
    .withMessage('WhatsApp name is required when type is whatsapp'),

  body('whatsappData.message')
    .if(body('type').equals('whatsapp'))
    .trim()
    .notEmpty()
    .withMessage('WhatsApp message is required when type is whatsapp'),

  // Website-specific validation
  body('websiteData.url')
    .if(body('type').equals('website'))
    .trim()
    .notEmpty()
    .withMessage('URL is required when type is website')
    .isURL()
    .withMessage('Please provide a valid URL'),
];

export const updateQRValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid QR ID'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('QR name cannot be empty'),

  body('type')
    .optional()
    .isIn(['whatsapp', 'website'])
    .withMessage('Type must be either "whatsapp" or "website"'),

  body('whatsappData.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('WhatsApp name cannot be empty'),

  body('whatsappData.message')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('WhatsApp message cannot be empty'),

  body('websiteData.url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL'),
];

export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid QR ID'),
];
