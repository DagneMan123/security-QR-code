import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

export default function QRCodeDisplay({ deviceId, onClose }) {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/qr/generate/${deviceId}`);
        if (response.data.success) {
          setQrCode(response.data.data.qrCode);
        }
      } catch (error) {
        toast.error("Failed to generate QR code");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [deviceId]);

  const handleDownload = () => {
    if (!qrCode) return;
    
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qr-${deviceId}.png`;
    link.click();
  };

  const handlePrint = () => {
    if (!qrCode) return;
    
    const printWindow = window.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${deviceId}</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            img { max-width: 500px; }
          </style>
        </head>
        <body>
          <img src="${qrCode}" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : qrCode ? (
          <div className="space-y-4">
            <div className="flex justify-center bg-gray-100 p-4 rounded-lg">
              <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            </div>
            <p className="text-center text-sm text-gray-600">Device ID: {deviceId}</p>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Download
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Print
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600">Failed to load QR code</p>
        )}
      </div>
    </div>
  );
}
