"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  table?: { name: string } | null;
}

const STATUS_TABS = [
  { value: "all", label: "Tümü" },
  { value: "pending", label: "Bekleyen" },
  { value: "confirmed", label: "Onaylanan" },
  { value: "cancelled", label: "İptal" },
  { value: "completed", label: "Tamamlanan" },
];

const RANGE_OPTIONS = [
  { value: "today", label: "Bugün" },
  { value: "week", label: "Bu Hafta" },
  { value: "month", label: "Bu Ay" },
  { value: "all", label: "Tümü" },
];

export default function RezervasiyonlarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [range, setRange] = useState("today");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (range === "today") {
      params.set("date", new Date().toISOString().split("T")[0]);
    } else if (range !== "all") {
      params.set("range", range);
    }
    const res = await fetch(`/api/reservations?${params}`);
    const data = await res.json();
    setReservations(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [status, range]);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  const updateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id + newStatus);
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = reservations.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.customerName.toLowerCase().includes(q) || r.customerPhone.includes(q) || r.confirmationCode.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlar</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                range === opt.value ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                status === tab.value ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İsim, telefon veya onay kodu ara..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">Rezervasyon bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-medium">Müşteri</th>
                  <th className="px-4 py-3 text-left font-medium">Tarih / Saat</th>
                  <th className="px-4 py-3 text-left font-medium">Kişi</th>
                  <th className="px-4 py-3 text-left font-medium">Masa</th>
                  <th className="px-4 py-3 text-left font-medium">Durum</th>
                  <th className="px-4 py-3 text-left font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{r.customerName}</div>
                      <div className="text-xs text-gray-400">{r.customerPhone}</div>
                      <div className="text-xs text-gray-300 font-mono">{r.confirmationCode}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-700">{formatTurkishDate(new Date(r.date))}</div>
                      <div className="text-xs text-orange-600 font-mono font-medium">{formatTime(new Date(r.date))}</div>
                    </td>
                    <td className="px-4 py-3">{r.guestCount} kişi</td>
                    <td className="px-4 py-3 text-gray-500">{r.table?.name || "—"}</td>
                    <td className="px-4 py-3"><ReservationStatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {r.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(r.id, "confirmed")}
                              disabled={actionLoading === r.id + "confirmed"}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === r.id + "confirmed" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                              Onayla
                            </button>
                            <button
                              onClick={() => updateStatus(r.id, "cancelled")}
                              disabled={actionLoading === r.id + "cancelled"}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === r.id + "cancelled" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              İptal
                            </button>
                          </>
                        )}
                        <Link
                          href={`/admin/rezervasyonlar/${r.id}`}
                          className="text-xs text-orange-600 hover:underline font-medium"
                        >
                          Detay →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
