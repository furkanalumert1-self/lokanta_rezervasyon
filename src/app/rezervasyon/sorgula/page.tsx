"use client";
import { useState } from "react";
import { Search, Calendar, Clock, Users, Phone, FileText } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReservationStatusBadge from "@/components/ReservationStatusBadge";
import { formatTurkishDate, formatTime } from "@/lib/reservation-utils";

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  date: string;
  status: string;
  confirmationCode: string;
  notes?: string | null;
  table?: { name: string } | null;
  restaurant: { name: string; phone: string };
}

export default function SorgulaPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Reservation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/reservations/check?code=${code.trim().toUpperCase()}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Rezervasyon bulunamadı");
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Sorgula</h1>
          <p className="text-gray-500 text-sm mt-1">Onay kodunuzla rezervasyonunuzu görüntüleyin</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Onay Kodu</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Örn: RZ4K8M"
                maxLength={6}
                className="mt-1 font-mono text-center text-lg tracking-widest uppercase"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading || code.length < 4}
              className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
            >
              <Search className="h-4 w-4" />
              {loading ? "Aranıyor..." : "Sorgula"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">{result.customerName}</h2>
              <ReservationStatusBadge status={result.status} />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-4 w-4 text-orange-500" />
                <span>{formatTurkishDate(new Date(result.date))}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>{formatTime(new Date(result.date))}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Users className="h-4 w-4 text-orange-500" />
                <span>{result.guestCount} kişi</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>{result.customerPhone}</span>
              </div>
              {result.table && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span>{result.table.name}</span>
                </div>
              )}
              {result.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-gray-600 text-xs">
                  <span className="font-medium">Not: </span>{result.notes}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Onay kodu: <span className="font-mono font-semibold text-gray-600">{result.confirmationCode}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
