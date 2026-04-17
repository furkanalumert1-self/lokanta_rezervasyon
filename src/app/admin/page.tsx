import { prisma } from "@/lib/prisma";
import { CalendarDays, Users, Clock, MessageCircle, CheckCircle2 } from "lucide-react";
import ReservationStatusBadge from "@/components/ReservationStatusBadge";
import { formatTime } from "@/lib/utils";
import Link from "next/link";
import { buildWhatsAppUrl, getConfirmationMessage } from "@/lib/whatsapp";

export const revalidate = 0;

async function getDashboardData() {
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return null;

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const [todayReservations, pendingCount] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        restaurantId: restaurant.id,
        date: { gte: todayStart, lte: todayEnd },
        status: { notIn: ["cancelled"] },
      },
      include: { table: true },
      orderBy: { date: "asc" },
    }),
    prisma.reservation.count({
      where: {
        restaurantId: restaurant.id,
        status: "pending",
        date: { gte: todayStart },
      },
    }),
  ]);

  const totalGuests = todayReservations.reduce((s, r) => s + r.guestCount, 0);

  return { restaurant, todayReservations, pendingCount, totalGuests };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!data) {
    return <div className="text-gray-500 p-8">Veri yüklenemedi.</div>;
  }

  const { todayReservations, pendingCount, totalGuests, restaurant } = data;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 capitalize">{today}</p>
        <h1 className="font-display text-2xl font-bold text-gray-900 mt-0.5">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Bugünün Rezervasyonları", value: todayReservations.length, icon: CalendarDays, color: "blue" },
          { label: "Bekleyen Onay", value: pendingCount, icon: Clock, color: "yellow" },
          { label: "Toplam Misafir", value: totalGuests, icon: Users, color: "green" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              stat.color === "blue" ? "bg-blue-50" :
              stat.color === "yellow" ? "bg-yellow-50" : "bg-green-50"
            }`}>
              <stat.icon className={`w-5 h-5 ${
                stat.color === "blue" ? "text-blue-600" :
                stat.color === "yellow" ? "text-yellow-600" : "text-green-600"
              }`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Today's table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Bugünün Rezervasyonları</h2>
          <Link href="/admin/rezervasyonlar" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Tümünü Gör →
          </Link>
        </div>

        {todayReservations.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Bugün için rezervasyon yok</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {todayReservations.map((res) => {
              const waMsg = getConfirmationMessage({
                customerName: res.customerName,
                restaurantName: restaurant.name,
                date: new Date(res.date).toLocaleDateString("tr-TR"),
                time: formatTime(res.date),
                guests: res.guestCount,
                code: res.confirmationCode,
              });
              const waUrl = buildWhatsAppUrl(res.customerPhone, waMsg);

              return (
                <div key={res.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-14 text-center">
                    <div className="font-bold text-gray-900 text-sm">{formatTime(res.date)}</div>
                    <div className="text-xs text-gray-400">{res.guestCount} kişi</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{res.customerName}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {res.table?.name || "Masa atanmadı"} · {res.confirmationCode}
                    </div>
                  </div>

                  <ReservationStatusBadge status={res.status} />

                  <div className="flex items-center gap-2">
                    {res.status === "pending" && (
                      <form action={`/api/reservations/${res.id}`} method="PUT">
                        <Link
                          href={`/admin/rezervasyonlar/${res.id}`}
                          className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Onayla
                        </Link>
                      </form>
                    )}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      WA
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
