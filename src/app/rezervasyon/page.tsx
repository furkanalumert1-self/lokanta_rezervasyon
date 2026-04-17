import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import ReservationForm from "@/components/ReservationForm";

export default async function ReservasyonPage() {
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return <div className="p-8 text-center">Restoran bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader restaurantName={restaurant.name} />
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Yap</h1>
          <p className="text-gray-500 mt-1 text-sm">Masanızı şimdiden ayırtın, gelişinizi bekliyoruz.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <ReservationForm
            restaurantId={restaurant.id}
            maxGuests={restaurant.maxGuests}
            maxAdvanceDays={restaurant.maxAdvanceDays}
          />
        </div>
      </div>
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
