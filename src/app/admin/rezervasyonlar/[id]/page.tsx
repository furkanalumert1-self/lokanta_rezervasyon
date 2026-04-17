"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle, Phone, Calendar, Clock, Users, StickyNote, Hash } from "lucide-react";
import Link from "next/link";
import ReservationStatusBadge from "@/components/ReservationStatusBadge";
import { formatDate, formatTime } from "@/lib/utils";
import { buildWhatsAppUrl, getConfirmationMessage, getReminderMessage } from "@/lib/whatsapp";

type Reservation = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  guestCount: number;
  date: string;
  status: string;
  confirmationCode: string;
  notes?: string | null;
  tableId?: string | null;
  table?: { id: string; name: string } | null;
  restaurant: { name: string; phone: string };
};

type Table = { id: string; name: string };

const STATUS_ACTIONS = [
  { status: "confirmed", label: "Onayla", color: "bg-green-500 hover:bg-green-600 text-white" },
  { status: "completed", label: "Tamamlandı", color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { status: "no_show", label: "Gelmedi", color: "bg-gray-500 hover:bg-gray-600 text-white" },
  { status: "cancelled", label: "İptal Et", color: "bg-red-500 hover:bg-red-600 text-white" },
];

export default function ReservationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [res, setRes] = useState<Reservation | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [tableId, setTableId] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/reservations/${id}`).then((r) => r.json()),
      fetch("/api/tables").then((r) => r.json()),
    ]).then(([resData, tablesData]) => {
      setRes(resData);
      setNotes(resData.notes || "");
      setTableId(resData.tableId || "");
      setTables(Array.isArray(tablesData) ? tablesData : []);
    }).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    setSaving(true);
    await fetch(`/api/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, tableId: tableId || null, notes }),
    });
    setSaving(false);
    router.refresh();
    const updated = await fetch(`/api/reservations/${id}`).then((r) => r.json());
    setRes(updated);
  };

  const saveNotes = async () => {
    setSaving(true);
    await fetch(`/api/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: res?.status, tableId: tableId || null, notes }),
    });
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-gray-400 text-center">Yükleniyor...</div>;
  if (!res) return <div className="p-8 text-gray-400 text-center">Rezervasyon bulunamadı</div>;

  const confirmWa = buildWhatsAppUrl(res.customerPhone, getConfirmationMessage({
    customerName: res.customerName,
    restaurantName: res.restaurant.name,
    date: formatDate(res.date),
    time: formatTime(res.date),
    guests: res.guestCount,
    code: res.confirmationCode,
  }));

  const reminderWa = buildWhatsAppUrl(res.customerPhone, getReminderMessage({
    customerName: res.customerName,
    restaurantName: res.restaurant.name,
    time: formatTime(res.date),
    guests: res.guestCount,
    code: res.confirmationCode,
  }));

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/rezervasyonlar" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900">Rezervasyon Detayı</h1>
          <p className="text-sm text-gray-400">{res.confirmationCode}</p>
        </div>
        <div className="ml-auto">
          <ReservationStatusBadge status={res.status} />
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm">Müşteri Bilgileri</h3>
        <div className="space-y-3">
          {[
            { icon: Users, label: "Ad Soyad", value: res.customerName },
            { icon: Phone, label: "Telefon", value: res.customerPhone },
            { icon: Calendar, label: "Tarih", value: formatDate(res.date) },
            { icon: Clock, label: "Saat", value: formatTime(res.date) },
            { icon: Users, label: "Kişi", value: `${res.guestCount} kişi` },
            { icon: Hash, label: "Onay Kodu", value: res.confirmationCode },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <row.icon className="w-4 h-4" />
                {row.label}
              </div>
              <span className="text-sm font-medium text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table assignment */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">Masa Ata</h3>
        <select
          value={tableId}
          onChange={(e) => setTableId(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="">-- Masa seçin --</option>
          {tables.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm flex items-center gap-2">
          <StickyNote className="w-4 h-4" />
          Notlar
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Not ekleyin..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        <button
          onClick={saveNotes}
          disabled={saving}
          className="mt-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {/* Status actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">Durum Güncelle</h3>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_ACTIONS.filter((a) => a.status !== res.status).map((action) => (
            <button
              key={action.status}
              onClick={() => updateStatus(action.status)}
              disabled={saving}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${action.color}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* WhatsApp */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">WhatsApp Mesajları</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a
            href={confirmWa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Onay Gönder
          </a>
          <a
            href={reminderWa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Hatırlatma Gönder
          </a>
        </div>
      </div>
    </div>
  );
}
