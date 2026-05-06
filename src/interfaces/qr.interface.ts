import { Document, Types } from 'mongoose';

export type QRType = 'whatsapp' | 'website' | 'image';

export interface IWhatsappData {
  phone: string;
  message: string;
}

export interface IWebsiteData {
  url: string;
}

export interface IImageData {
  imageName: string;
  imageUrl: string;
  imageDescription: string;
}

export interface IQR extends Document {
  name: string;
  scans: number;
  type: QRType;
  whatsappData?: IWhatsappData;
  websiteData?: IWebsiteData;
  imageData?: IImageData;
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
