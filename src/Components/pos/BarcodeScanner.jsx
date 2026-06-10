import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function BarcodeScanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 550, height: 100 },  
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);  
        scanner.clear();    
      },
      (error) => {
        console.warn("QR code scan error:", error);
      }
    );

    return () => scanner.clear();
  }, []);

  return <div id="reader" />;
}