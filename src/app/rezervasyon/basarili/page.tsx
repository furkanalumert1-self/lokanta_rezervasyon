export const dynamic = 'force-dynamic';

import Link from "next/link";
import { CheckCircle2, Calendar, Clock, Users, MessageCircle, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/PublicHeader";
import { buildWhatsAppUrl, getConfirmationMessage } from "@/lib/whatsapp";
import { formatTurkishDate } from "@/lib/reservation-utils";

interface Props {
  searchParams: { code?: string; date?: string; time?: string; guests?: string; name?: string; phone?: string };
}

export default async function BasariliPage({ searchParams }: Props) {
  const { code, date, time, guests, name, phone } = searchParams;
  const restaurant = await prisma.restaurant.findFirst();

  const turkishDate = date ? formatTurkishDate(new Date(date)) : date || "";
  const waMessage = restaurant && code && name
    ? getConfirmationMessage({
        customerName: name,
        restaurantName: restaurant.name,
        date: turkishDate,
        time: time || "",
        guests: Number(guests),
        code: code,
      })
    : "";

  const waUrl = restaurant && phone ? buildWhatsAppUrl(restaurant.phone, waMessage) : "#";

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader restaurantName={restaurant?.name} />
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Rezervasyonunuz Alındı!</h1>
          <p className="text-gray-500 mb-6 text-sm">
            Rezervasyonunuz başarıyla alındı. En kısa sürede size geri dönüş yapacağız.
          </p>

          {code && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">Onay Kodunuz</p>
              <p className="text-4xl font-bold tracking-widest text-orange-600 font-mono">{code}</p>
              <p className="text-xs text-gray-400 mt-1">Bu kodu saklayın</p>
            </div>
          )}

          <div className="text-left space-y-3 mb-8">
            {date && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>{turkishDate}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>{time}</span>
              </div>
            )}
            {guests && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Users className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>{guests} kişi</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp ile Onay Gönder
            </a>
            <Link
              href="/rezervasyon/sorgula"
              className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition-colors text-sm"
            >
              <Search className="h-4 w-4" />
              Rezervasyonumu Sorgula
            </Link>
            <Link href="/" className="block text-center text-orange-600 hover:underline text-sm mt-2">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
