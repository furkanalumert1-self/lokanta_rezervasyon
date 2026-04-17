import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import MenuContent from "./MenuContent";

export const revalidate = 60;

export default async function MenuPage() {
  const restaurant = await prisma.restaurant.findFirst();
  const categories = await prisma.menuCategory.findMany({
    where: { isActive: true },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  if (!restaurant) return <div className="p-8 text-center">Restoran bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader restaurantName={restaurant.name} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Menümüz</h1>
        <MenuContent categories={categories} />
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
