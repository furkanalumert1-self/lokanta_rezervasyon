import Link from "next/link";
import { MapPin, Phone, Clock, ChevronRight, Star, UtensilsCrossed } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";

export const revalidate = 60;

export default async function HomePage() {
  const restaurant = await prisma.restaurant.findFirst();
  const popularItems = await prisma.menuItem.findMany({
    where: { isPopular: true, isAvailable: true },
    include: { category: true },
    take: 6,
  });

  if (!restaurant) return <div className="p-8 text-center">Restoran bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader restaurantName={restaurant.name} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <UtensilsCrossed className="h-16 w-16 opacity-90" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{restaurant.name}</h1>
          <p className="text-xl text-orange-100 mb-10 max-w-xl mx-auto">{restaurant.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-colors shadow-md"
            >
              <UtensilsCrossed className="h-5 w-5" />
              Menümüzü İnceleyin
            </Link>
            <Link
              href="/rezervasyon"
              className="flex items-center justify-center gap-2 bg-orange-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-900 transition-colors shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
              Rezervasyon Yapın
            </Link>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
          <div className="bg-orange-100 p-3 rounded-lg"><MapPin className="h-5 w-5 text-orange-600" /></div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Adresimiz</h3>
            <p className="text-gray-600 text-sm">{restaurant.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
          <div className="bg-orange-100 p-3 rounded-lg"><Phone className="h-5 w-5 text-orange-600" /></div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
            <a href={`tel:${restaurant.phone}`} className="text-orange-600 font-medium hover:underline text-sm">
              {restaurant.phone}
            </a>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
          <div className="bg-orange-100 p-3 rounded-lg"><Clock className="h-5 w-5 text-orange-600" /></div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Çalışma Saatleri</h3>
            <p className="text-gray-600 text-sm">{restaurant.openingTime} – {restaurant.closingTime}</p>
            <p className="text-gray-400 text-xs mt-0.5">Her gün açık</p>
          </div>
        </div>
      </section>

      {/* Popular items */}
      {popularItems.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="h-6 w-6 text-orange-500 fill-orange-500" />
              Popüler Lezzetler
            </h2>
            <Link href="/menu" className="text-orange-600 hover:underline text-sm font-medium">
              Tüm menü →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                {item.imageUrl && (
                  <div className="h-32 rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h3>
                <p className="text-gray-500 text-xs mb-2 line-clamp-1">{item.description}</p>
                <span className="text-orange-600 font-bold">₺{item.price}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gray-900 text-white py-14 px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">Rezervasyon Yapın</h2>
        <p className="text-gray-400 mb-8">Online rezervasyon yapın, masanız hazır olsun.</p>
        <Link
          href="/rezervasyon"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
        >
          Hemen Rezervasyon Yap <ChevronRight className="h-5 w-5" />
        </Link>
      </section>

      <PublicFooter
        restaurantName={restaurant.name}
        address={restaurant.address}
        phone={restaurant.phone}
        openingTime={restaurant.openingTime}
        closingTime={restaurant.closingTime}
      />
      <WhatsAppButton phone={restaurant.phone} />
    </div>
  );
}
