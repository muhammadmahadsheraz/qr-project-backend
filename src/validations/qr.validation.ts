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
    .isIn(['whatsapp', 'website', 'image'])
    .withMessage('Type must be "whatsapp", "website", or "image"'),

  // Whatsapp-specific validation
  body('whatsappData.phone')
    .if(body('type').equals('whatsapp'))
    .trim()
    .notEmpty()
    .withMessage('WhatsApp phone number is required when type is whatsapp'),

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

  // Image-specific validation
  body('imageData.imageName')
    .if(body('type').equals('image'))
    .trim()
    .notEmpty()
    .withMessage('Image name is required when type is image'),

  body('imageData.imageUrl')
    .if(body('type').equals('image'))
    .trim()
    .notEmpty()
    .withMessage('Image URL is required when type is image')
    .isURL()
    .withMessage('Please provide a valid image URL'),

  body('imageData.imageDescription')
    .if(body('type').equals('image'))
    .trim()
    .notEmpty()
    .withMessage('Image description is required when type is image'),
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
    .isIn(['whatsapp', 'website', 'image'])
    .withMessage('Type must be "whatsapp", "website", or "image"'),

  body('whatsappData.phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('WhatsApp phone cannot be empty'),

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

  body('imageData.imageName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Image name cannot be empty'),

  body('imageData.imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid image URL'),

  body('imageData.imageDescription')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Image description cannot be empty'),
];

export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid QR ID'),
];
