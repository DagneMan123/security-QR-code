import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan, onError, onClose }) {
  const scannerRef = useRef(null);
  const qrId = "qr-reader";
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (!scannerRef.current || !isScanning) return;

    const html5QrCode = new Html5Qrcode(qrId);

    const config = { fps: 10, qrbox: 250 };

    html5QrCode
      .start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          setIsScanning(false);
          onScan(decodedText);
        },
        (errorMessage) => {
          if (onError) onError(errorMessage);
        }
      )
      .catch((err) => {
        console.error("QR start failed:", err);
        if (onError) onError(err);
      });

    return () => {
      html5QrCode.stop().catch((err) => console.error("QR stop failed:", err));
    };
  }, [isScanning, onScan, onError]);

  const handleClose = () => {
    setIsScanning(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Scan QR Code</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div ref={scannerRef} id={qrId} className="w-full rounded-lg overflow-hidden" />
          
          <p className="text-center text-gray-600 text-sm mt-4">
            Position the QR code within the frame
          </p>
        </div>
      </div>
    </div>
  );
}

