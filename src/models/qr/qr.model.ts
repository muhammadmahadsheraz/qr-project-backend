import mongoose, { Schema } from 'mongoose';
import { IQR } from '../../interfaces/qr.interface';

const qrSchema = new Schema<IQR>(
  {
    name: {
      type: String,
      required: [true, 'QR name is required'],
      trim: true,
    },
    scans: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: {
        values: ['whatsapp', 'website'],
        message: 'Type must be either "whatsapp" or "website"',
      },
      required: [true, 'QR type is required'],
    },
    whatsappData: {
      phone: {
        type: String,
        trim: true,
      },
      message: {
        type: String,
        trim: true,
      },
    },
    websiteData: {
      url: {
        type: String,
        trim: true,
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const QR = mongoose.model<IQR>('QR', qrSchema);
