import QRCode from 'qrcode';
import { Device } from "../models/index.js";
import { encrypt, decrypt } from "../utils/crypto.js";

export const generateQRCode = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const device = await Device.findOne({ where: { deviceId } });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(device.qrEncrypted);

    return res.status(200).json({
      success: true,
      data: {
        deviceId: device.deviceId,
        qrCode: qrDataUrl,
        qrEncrypted: device.qrEncrypted
      }
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate QR code"
    });
  }
};

export const validateQRCode = async (req, res) => {
  try {
    const { qrData, deviceId } = req.body;

    if (!qrData || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "QR data and device ID are required"
      });
    }

    const device = await Device.findOne({ where: { deviceId } });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    try {
      const decrypted = decrypt(qrData);
      const qrPayload = JSON.parse(decrypted);

      // Verify QR belongs to this device
      if (qrPayload.ownerId !== device.ownerId || qrPayload.serialNumber !== device.serialNumber) {
        return res.status(400).json({
          success: false,
          message: "QR code does not match device"
        });
      }

      return res.status(200).json({
        success: true,
        message: "QR code is valid",
        data: qrPayload
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR code"
      });
    }
  } catch (error) {
    console.error("QR validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
