export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, Clock, Users, CheckCircle2, MessageCircle, ChevronRight } from "lucide-react";
import ReservationStatusBadge from "@/components/ReservationStatusBadge";
import { formatTime } from "@/lib/reservation-utils";
import { buildWhatsAppUrl, getConfirmationMessage } from "@/lib/whatsapp";

export const revalidate = 0;

export default async function AdminDashboard() {
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return <div>Restoran bulunamadı</div>;

  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);

  const todaysReservations = await prisma.reservation.findMany({
    where: { restaurantId: restaurant.id, date: { gte: todayStart, lte: todayEnd } },
    include: { table: true },
    orderBy: { date: "asc" },
  });

  const pendingCount = todaysReservations.filter((r) => r.status === "pending").length;
  const totalGuests = todaysReservations
    .filter((r) => !["cancelled", "no_show"].includes(r.status))
    .reduce((sum, r) => sum + r.guestCount, 0);

  const months = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  const days = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
  const todayLabel = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />{todayLabel}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Bugünün Rezervasyonları</span>
            <CalendarDays className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{todaysReservations.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Bekleyen Onay</span>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Toplam Misafir</span>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalGuests}</p>
        </div>
      </div>

      {/* Today's reservations */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Bugünün Rezervasyonları</h2>
          <Link href="/admin/rezervasyonlar" className="text-sm text-orange-600 hover:underline flex items-center gap-1">
            Tümünü Gör <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        {todaysReservations.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Bugün için rezervasyon yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
                  <th className="px-4 py-3 text-left font-medium">Saat</th>
                  <th className="px-4 py-3 text-left font-medium">Müşteri</th>
                  <th className="px-4 py-3 text-left font-medium">Kişi</th>
                  <th className="px-4 py-3 text-left font-medium">Masa</th>
                  <th className="px-4 py-3 text-left font-medium">Durum</th>
                  <th className="px-4 py-3 text-left font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todaysReservations.map((r) => {
                  const waMsg = getConfirmationMessage({
                    customerName: r.customerName,
                    restaurantName: restaurant.name,
                    date: todayLabel,
                    time: formatTime(new Date(r.date)),
                    guests: r.guestCount,
                    code: r.confirmationCode,
                  });
                  const waUrl = buildWhatsAppUrl(r.customerPhone, waMsg);
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-orange-600">{formatTime(new Date(r.date))}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{r.customerName}</div>
                        <div className="text-xs text-gray-400">{r.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3">{r.guestCount} kişi</td>
                      <td className="px-4 py-3 text-gray-500">{r.table?.name || "—"}</td>
                      <td className="px-4 py-3"><ReservationStatusBadge status={r.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {r.status === "pending" && (
                            <form action={`/api/reservations/${r.id}`} method="POST">
                              <Link
                                href={`/admin/rezervasyonlar/${r.id}`}
                                className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 transition-colors"
                              >
                                <CheckCircle2 className="h-3 w-3" /> Onayla
                              </Link>
                            </form>
                          )}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 transition-colors"
                          >
                            <MessageCircle className="h-3 w-3" /> WA
                          </a>
                          <Link
                            href={`/admin/rezervasyonlar/${r.id}`}
                            className="text-xs text-gray-400 hover:text-orange-600 px-2 py-1 rounded hover:bg-orange-50 transition-colors"
                          >
                            Detay
                          </Link>
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
