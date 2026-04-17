"use client";

import { useState } from "react";
import { QrCode, Download, RefreshCw } from "lucide-react";

interface QRCodeCardProps {
  tableId: string;
  tableName: string;
}

export default function QRCodeCard({ tableId, tableName }: QRCodeCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId }),
      });
      const data = await res.json();
      setQrDataUrl(data.dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qr-${tableName.toLowerCase().replace(/\s/g, "-")}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {qrDataUrl ? (
        <>
          <img src={qrDataUrl} alt={`QR - ${tableName}`} className="w-32 h-32 rounded-lg border" />
          <div className="flex gap-2">
            <button
              onClick={downloadQR}
              className="flex items-center gap-1 text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-3 h-3" />
              İndir
            </button>
            <button
              onClick={generateQR}
              className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Yenile
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={generateQR}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <QrCode className="w-4 h-4" />
          {loading ? "Oluşturuluyor..." : "QR Oluştur"}
        </button>
      )}
    </div>
  );
}
