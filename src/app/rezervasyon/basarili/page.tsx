"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MessageCircle, Search, Calendar, Clock, Users } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { buildWhatsAppUrl, getConfirmationMessage } from "@/lib/whatsapp";
import { Suspense } from "react";

function BasariliContent() {
  const params = useSearchParams();
  const code = params.get("code") || "";
  const date = params.get("date") || "";
  const time = params.get("time") || "";
  const guests = params.get("guests") || "";

  const waMessage = getConfirmationMessage({
    customerName: "Misafir",
    restaurantName: "Cafe Merhaba",
    date,
    time,
    guests: parseInt(guests),
    code,
  });
  const waUrl = buildWhatsAppUrl("+905551234567", waMessage);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {/* Success icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-slide-up">
        <CheckCircle className="w-14 h-14 text-green-500" />
      </div>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
        Rezervasyonunuz Alındı!
      </h1>
      <p className="text-gray-500 mb-8">
        En kısa sürede sizi arayarak onaylayacağız.
      </p>

      {/* Confirmation code */}
      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
        <p className="text-sm text-gray-500 mb-1">Onay Kodunuz</p>
        <div className="font-display font-bold text-4xl text-primary-600 tracking-widest">{code}</div>
        <p className="text-xs text-gray-400 mt-2">Bu kodu saklayın, rezervasyonunuzu sorgulamak için gereklidir</p>
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Rezervasyon Özeti</h3>
        <div className="space-y-3">
          {[
            { icon: Calendar, label: "Tarih", value: date },
            { icon: Clock, label: "Saat", value: time },
            { icon: Users, label: "Kişi Sayısı", value: `${guests} kişi` },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <row.icon className="w-4 h-4" />
                {row.label}
              </div>
              <span className="font-semibold text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-xl transition-colors shadow-sm"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp ile Onayla
        </a>
        <Link
          href="/rezervasyon/sorgula"
          className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <Search className="w-4 h-4" />
          Rezervasyonu Sorgula
        </Link>
        <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}

export default function BasariliPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />
      <div className="flex-1">
        <Suspense fallback={<div className="p-8 text-center text-gray-400">Yükleniyor...</div>}>
          <BasariliContent />
        </Suspense>
      </div>
      <PublicFooter />
    </div>
  );
}
