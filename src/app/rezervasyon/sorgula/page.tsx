"use client";

import { useState } from "react";
import { Search, Calendar, Clock, Users, Phone, User } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import ReservationStatusBadge from "@/components/ReservationStatusBadge";
import { formatDate, formatTime } from "@/lib/utils";

type ReservationResult = {
  customerName: string;
  customerPhone: string;
  date: string;
  guestCount: number;
  status: string;
  notes?: string | null;
};

export default function SorgulaPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReservationResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/reservations/check?code=${code.toUpperCase().trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rezervasyon bulunamadı");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />

      <div className="max-w-lg mx-auto px-4 py-12 w-full flex-1">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Rezervasyon Sorgula</h1>
          <p className="text-gray-500 text-sm">Onay kodunuzla rezervasyonunuzu sorgulayın</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Onay Kodu</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Örn: RZ4K8M"
              maxLength={6}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={loading || code.length < 4}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-5 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Sorgula
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Rezervasyon Detayı</h3>
              <ReservationStatusBadge status={result.status} />
            </div>

            <div className="space-y-3">
              {[
                { icon: User, label: "Misafir", value: result.customerName },
                { icon: Phone, label: "Telefon", value: result.customerPhone },
                { icon: Calendar, label: "Tarih", value: formatDate(result.date) },
                { icon: Clock, label: "Saat", value: formatTime(result.date) },
                { icon: Users, label: "Kişi Sayısı", value: `${result.guestCount} kişi` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <row.icon className="w-4 h-4" />
                    {row.label}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{row.value}</span>
                </div>
              ))}
              {result.notes && (
                <div className="pt-1">
                  <p className="text-xs text-gray-400 mb-1">Not</p>
                  <p className="text-sm text-gray-700">{result.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
