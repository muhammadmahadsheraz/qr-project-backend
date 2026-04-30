import { QR } from '../../models/qr/qr.model';
import { IQRResponse, QRType } from '../../interfaces/qr.interface';

export class QRService {
  async createQR(
    userId: string,
    name: string,
    type: QRType,
    typeData: {
      whatsappData?: { phone: string; message: string };
      websiteData?: { url: string };
    }
  ): Promise<IQRResponse> {
    const qrPayload: any = { name, type, userId };

    if (type === 'whatsapp') {
      qrPayload.whatsappData = typeData.whatsappData;
    } else {
      qrPayload.websiteData = typeData.websiteData;
    }

    const qr = await QR.create(qrPayload);

    return {
      success: true,
      message: 'QR created successfully',
      data: { qr: this.formatQR(qr) },
    };
  }

  async getAllQRs(userId: string): Promise<IQRResponse> {
    const qrs = await QR.find({ userId }).sort({ createdAt: -1 });

    return {
      success: true,
      message: 'QRs fetched successfully',
      data: {
        qrs: qrs.map((qr) => this.formatQR(qr)),
        total: qrs.length,
      },
    };
  }

  async getQRById(userId: string, qrId: string): Promise<IQRResponse> {
    const qr = await QR.findOne({ _id: qrId, userId });

    if (!qr) {
      return {
        success: false,
        message: 'QR not found',
      };
    }

    return {
      success: true,
      message: 'QR fetched successfully',
      data: { qr: this.formatQR(qr) },
    };
  }

  async updateQR(
    userId: string,
    qrId: string,
    updates: {
      name?: string;
      type?: QRType;
      whatsappData?: { phone: string; message: string };
      websiteData?: { url: string };
    }
  ): Promise<IQRResponse> {
    const qr = await QR.findOne({ _id: qrId, userId });

    if (!qr) {
      return {
        success: false,
        message: 'QR not found',
      };
    }

    // Determine the effective type after update
    const effectiveType = updates.type || qr.type;

    // Build update payload
    const updatePayload: any = {};

    if (updates.name) updatePayload.name = updates.name;
    if (updates.type) updatePayload.type = updates.type;

    if (effectiveType === 'whatsapp') {
      if (updates.whatsappData) updatePayload.whatsappData = updates.whatsappData;
      // Clear website data if switching type
      if (updates.type === 'whatsapp') updatePayload.websiteData = undefined;
    } else {
      if (updates.websiteData) updatePayload.websiteData = updates.websiteData;
      // Clear whatsapp data if switching type
      if (updates.type === 'website') updatePayload.whatsappData = undefined;
    }

    const updatedQR = await QR.findByIdAndUpdate(qrId, updatePayload, {
      new: true,
      runValidators: true,
    });

    return {
      success: true,
      message: 'QR updated successfully',
      data: { qr: this.formatQR(updatedQR!) },
    };
  }

  async deleteQR(userId: string, qrId: string): Promise<IQRResponse> {
    const qr = await QR.findOneAndDelete({ _id: qrId, userId });

    if (!qr) {
      return {
        success: false,
        message: 'QR not found',
      };
    }

    return {
      success: true,
      message: 'QR deleted successfully',
    };
  }

  async incrementScan(qrId: string): Promise<IQRResponse> {
    const qr = await QR.findByIdAndUpdate(
      qrId,
      { $inc: { scans: 1 } },
      { new: true }
    );

    if (!qr) {
      return {
        success: false,
        message: 'QR not found',
      };
    }

    return {
      success: true,
      message: 'Scan recorded successfully',
      data: { qr: this.formatQR(qr) },
    };
  }

  // Resolves the redirect URL and increments scan count atomically
  async resolveRedirectUrl(qrId: string): Promise<{ success: boolean; redirectUrl?: string; message?: string }> {
    const qr = await QR.findByIdAndUpdate(
      qrId,
      { $inc: { scans: 1 } },
      { new: true }
    );

    if (!qr) {
      return { success: false, message: 'QR not found' };
    }

    let redirectUrl: string;

    if (qr.type === 'website') {
      redirectUrl = qr.websiteData!.url;
    } else {
      // Build WhatsApp deep link: https://wa.me/<phone>?text=<encodedMessage>
      const encodedMessage = encodeURIComponent(qr.whatsappData!.message);
      redirectUrl = `https://wa.me/${qr.whatsappData!.phone}?text=${encodedMessage}`;
    }

    return { success: true, redirectUrl };
  }

  private formatQR(qr: any): object {
    const base = {
      id: qr._id.toString(),
      name: qr.name,
      scans: qr.scans,
      type: qr.type,
      userId: qr.userId.toString(),
      createdAt: qr.createdAt,
      updatedAt: qr.updatedAt,
    };

    if (qr.type === 'whatsapp') {
      return { ...base, whatsappData: qr.whatsappData };
    } else {
      return { ...base, websiteData: qr.websiteData };
    }
  }
}
