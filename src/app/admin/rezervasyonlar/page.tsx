"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Search, Filter } from "lucide-react";
import ReservationStatusBadge from "@/components/ReservationStatusBadge";
import { formatDate, formatTime } from "@/lib/utils";
import Link from "next/link";
import { buildWhatsAppUrl, getConfirmationMessage } from "@/lib/whatsapp";

type Reservation = {
  id: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  date: string;
  status: string;
  confirmationCode: string;
  table?: { name: string } | null;
};

const STATUS_TABS = [
  { key: "all", label: "Tümü" },
  { key: "pending", label: "Bekleyen" },
  { key: "confirmed", label: "Onaylanan" },
  { key: "completed", label: "Tamamlanan" },
  { key: "cancelled", label: "İptal" },
];

const DATE_FILTERS = [
  { key: "today", label: "Bugün" },
  { key: "week", label: "Bu Hafta" },
  { key: "month", label: "Bu Ay" },
  { key: "all", label: "Tümü" },
];

function getDateRange(filter: string) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  switch (filter) {
    case "today":
      return { from: start.toISOString(), to: new Date(now.setHours(23, 59, 59, 999)).toISOString() };
    case "week": {
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { from: start.toISOString(), to: end.toISOString() };
    }
    case "month": {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      return { from: monthStart.toISOString(), to: monthEnd.toISOString() };
    }
    default:
      return {};
  }
}

export default function RezerasyonlarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [search, setSearch] = useState("");

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const range = getDateRange(dateFilter);
      if (range.from) params.set("dateFrom", range.from);
      if (range.to) params.set("dateTo", range.to);

      const res = await fetch(`/api/reservations?${params}`);
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, [statusFilter, dateFilter]);

  const filtered = reservations.filter((r) =>
    !search ||
    r.customerName.toLowerCase().includes(search.toLowerCase()) ||
    r.customerPhone.includes(search) ||
    r.confirmationCode.includes(search.toUpperCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Rezervasyonlar</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        {/* Date filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 text-xs text-gray-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Dönem:
          </div>
          {DATE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setDateFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                dateFilter === f.key
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ad, telefon veya kod ile ara..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto mb-4">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatusFilter(t.key)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === t.key
                ? "bg-white border-2 border-primary-600 text-primary-600 shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Rezervasyon bulunamadı</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Müşteri</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Tarih / Saat</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Kişi</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Masa</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Durum</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((res) => {
                  const waUrl = buildWhatsAppUrl(
                    res.customerPhone,
                    getConfirmationMessage({
                      customerName: res.customerName,
                      restaurantName: "Cafe Merhaba",
                      date: formatDate(res.date),
                      time: formatTime(res.date),
                      guests: res.guestCount,
                      code: res.confirmationCode,
                    })
                  );
                  return (
                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 text-sm">{res.customerName}</div>
                        <div className="text-xs text-gray-400">{res.customerPhone}</div>
                        <div className="text-xs text-gray-300 sm:hidden mt-0.5">
                          {formatDate(res.date)} {formatTime(res.date)}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="text-sm text-gray-900">{formatDate(res.date)}</div>
                        <div className="text-xs text-gray-400">{formatTime(res.date)}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-700">{res.guestCount}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-500">{res.table?.name || "—"}</td>
                      <td className="px-4 py-3"><ReservationStatusBadge status={res.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/rezervasyonlar/${res.id}`}
                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Detay
                          </Link>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-green-50 text-green-700 px-2.5 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
