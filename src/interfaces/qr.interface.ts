import { Document, Types } from 'mongoose';

export type QRType = 'whatsapp' | 'website';

export interface IWhatsappData {
  phone: string;
  message: string;
}

export interface IWebsiteData {
  url: string;
}

export interface IQR extends Document {
  name: string;
  scans: number;
  type: QRType;
  whatsappData?: IWhatsappData;
  websiteData?: IWebsiteData;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQRResponse {
  success: boolean;
  message: string;
  data?: {
    qr?: object;
    qrs?: object[];
    total?: number;
  };
}
