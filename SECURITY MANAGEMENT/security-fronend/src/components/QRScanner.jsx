import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan, onError }) {
  const scannerRef = useRef(null);
  const qrId = "qr-reader";

  useEffect(() => {
    if (!scannerRef.current) return;

    const html5QrCode = new Html5Qrcode(qrId);

    const config = { fps: 10, qrbox: 250 };

    html5QrCode
      .start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          onScan(decodedText); // returns the scanned QR value
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
  }, [onScan, onError]);

  return <div ref={scannerRef} id={qrId} style={{ width: "100%" }} />;
}
