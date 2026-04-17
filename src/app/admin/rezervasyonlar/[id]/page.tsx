"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, UserX, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ReservationStatusBadge from "@/components/ReservationStatusBadge";
import { formatTurkishDate, formatTime } from "@/lib/reservation-utils";
import { buildWhatsAppUrl, getConfirmationMessage, getReminderMessage } from "@/lib/whatsapp";
import { useToast } from "@/components/ui/use-toast";

interface Table { id: string; name: string; }
interface Reservation {
  id: string; customerName: string; customerPhone: string; customerEmail?: string | null;
  guestCount: number; date: string; status: string; confirmationCode: string;
  notes?: string | null; tableId?: string | null; table?: Table | null;
  restaurant: { name: string; phone: string };
  whatsappSent: boolean; duration: number;
}

const STATUS_ACTIONS = [
  { status: "confirmed", label: "Onayla", icon: CheckCircle2, color: "bg-green-600 hover:bg-green-700 text-white" },
  { status: "cancelled", label: "İptal Et", icon: XCircle, color: "bg-red-600 hover:bg-red-700 text-white" },
  { status: "completed", label: "Tamamlandı", icon: Trophy, color: "bg-blue-600 hover:bg-blue-700 text-white" },
  { status: "no_show", label: "Gelmedi", icon: UserX, color: "bg-gray-500 hover:bg-gray-600 text-white" },
];

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedTable, setSelectedTable] = useState<string>("");

  const load = useCallback(async () => {
    const [resRes, tablesRes] = await Promise.all([
      fetch(`/api/reservations/${params.id}`),
      fetch("/api/tables"),
    ]);
    if (resRes.ok) {
      const data = await resRes.json();
      setReservation(data);
      setNotes(data.notes || "");
      setSelectedTable(data.tableId || "");
    }
    if (tablesRes.ok) setTables(await tablesRes.json());
    setLoading(false);
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    const res = await fetch(`/api/reservations/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, tableId: selectedTable || null, notes }),
    });
    if (res.ok) {
      const data = await res.json();
      setReservation((prev) => prev ? { ...prev, ...data } : prev);
      toast({ title: "Güncellendi", description: "Rezervasyon durumu güncellendi." });
    }
    setUpdating(false);
  };

  const saveNotes = async () => {
    setUpdating(true);
    await fetch(`/api/reservations/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableId: selectedTable || null, notes }),
    });
    toast({ title: "Kaydedildi" });
    setUpdating(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>;
  if (!reservation) return <div className="text-center py-20 text-gray-500">Rezervasyon bulunamadı.</div>;

  const dateObj = new Date(reservation.date);
  const turkishDate = formatTurkishDate(dateObj);
  const time = formatTime(dateObj);

  const waConfirmMsg = getConfirmationMessage({
    customerName: reservation.customerName,
    restaurantName: reservation.restaurant.name,
    date: turkishDate,
    time,
    guests: reservation.guestCount,
    code: reservation.confirmationCode,
  });
  const waReminderMsg = getReminderMessage({
    customerName: reservation.customerName,
    restaurantName: reservation.restaurant.name,
    time,
    guests: reservation.guestCount,
    code: reservation.confirmationCode,
  });

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/rezervasyonlar" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Rezervasyon Detayı</h1>
        <ReservationStatusBadge status={reservation.status} />
      </div>

      {/* Info card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Onay Kodu</span>
          <span className="font-mono font-bold text-orange-600 text-base tracking-wider">{reservation.confirmationCode}</span>
        </div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">Müşteri</span><span className="font-medium">{reservation.customerName}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">Telefon</span><a href={`tel:${reservation.customerPhone}`} className="text-orange-600 hover:underline">{reservation.customerPhone}</a></div>
        {reservation.customerEmail && <div className="flex justify-between text-sm"><span className="text-gray-500">E-posta</span><span>{reservation.customerEmail}</span></div>}
        <div className="flex justify-between text-sm"><span className="text-gray-500">Tarih</span><span className="font-medium">{turkishDate}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">Saat</span><span className="font-mono font-medium text-orange-600">{time}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">Kişi Sayısı</span><span className="font-medium">{reservation.guestCount} kişi</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">Süre</span><span>{reservation.duration} dk</span></div>
      </div>

      {/* Masa & Notlar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4 space-y-4">
        <div>
          <Label className="mb-1.5 block">Masa Ata</Label>
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger><SelectValue placeholder="Masa seçin..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">— Masa atanmadı —</SelectItem>
              {tables.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block">Not</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Notlar..." />
        </div>
        <Button onClick={saveNotes} disabled={updating} variant="outline" className="w-full">Kaydet</Button>
      </div>

      {/* Status actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Durum Güncelle</h3>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_ACTIONS.map(({ status, label, icon: Icon, color }) => (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              disabled={updating || reservation.status === status}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${color}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* WhatsApp buttons */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-3">WhatsApp Mesajları</h3>
        <div className="space-y-2">
          <a
            href={buildWhatsAppUrl(reservation.customerPhone, waConfirmMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Onay Mesajı Gönder
          </a>
          <a
            href={buildWhatsAppUrl(reservation.customerPhone, waReminderMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full bg-green-400 hover:bg-green-500 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Hatırlatma Mesajı Gönder
          </a>
        </div>
      </div>
    </div>
  );
}
