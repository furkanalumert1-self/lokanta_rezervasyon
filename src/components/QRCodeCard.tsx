"use client";
import { useState } from "react";
import { QrCode, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      const res = await fetch(`/api/qr/generate?tableId=${tableId}`);
      const data = await res.json();
      setQrDataUrl(data.qrCode);
    } catch {
      alert("QR kod oluşturulurken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qr-${tableName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {qrDataUrl ? (
        <>
          <img src={qrDataUrl} alt={`QR - ${tableName}`} className="w-32 h-32 rounded border" />
          <Button size="sm" variant="outline" onClick={downloadQR} className="gap-1">
            <Download className="h-3.5 w-3.5" />
            İndir
          </Button>
        </>
      ) : (
        <Button size="sm" variant="outline" onClick={generateQR} disabled={loading} className="gap-1">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <QrCode className="h-3.5 w-3.5" />}
          QR Oluştur
        </Button>
      )}
    </div>
  );
}
