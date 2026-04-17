import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import MenuItemCard from "@/components/MenuItemCard";
import { UtensilsCrossed } from "lucide-react";

export const revalidate = 60;

export default async function MenuPage() {
  const restaurant = await prisma.restaurant.findFirst();
  const categories = await prisma.menuCategory.findMany({
    where: { isActive: true, restaurant: { slug: "cafe-merhaba" } },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <div className="inline-flex items-center gap-2 text-primary-600 mb-2">
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Menümüz</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
            {restaurant?.name || "Cafe Merhaba"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Tüm fiyatlara KDV dahildir</p>
        </div>
      </div>

      {/* Category nav - sticky */}
      <div className="sticky top-[57px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-primary-600 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Menu content */}
      <div className="max-w-5xl mx-auto px-4 py-10 w-full flex-1">
        {categories.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`} className="mb-12 scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display text-2xl font-bold text-gray-900">{cat.name}</h2>
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">{cat.items.length} ürün</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
