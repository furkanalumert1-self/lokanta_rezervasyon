import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MenuItemCard from "@/components/MenuItemCard";
import { UtensilsCrossed, QrCode } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { tableId: string };
}

export default async function QRMenuPage({ params }: Props) {
  const table = await prisma.table.findUnique({
    where: { id: params.tableId },
    include: { restaurant: true },
  });

  if (!table) notFound();

  const categories = await prisma.menuCategory.findMany({
    where: { restaurantId: table.restaurantId, isActive: true },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: [{ sortOrder: "asc" }],
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-gray-900 block leading-none">
                  {table.restaurant.name}
                </span>
                <span className="text-xs text-gray-400">{table.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-orange-50 text-primary-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              <QrCode className="w-3.5 h-3.5" />
              QR Menü
            </div>
          </div>
        </div>
      </header>

      {/* Category nav */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-primary-600 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {categories.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`} className="mb-10 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display text-xl font-bold text-gray-900">{cat.name}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cat.items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="max-w-3xl mx-auto px-4 pb-10">
        <div className="bg-primary-600 rounded-2xl p-6 text-center text-white">
          <p className="font-semibold mb-3">Rezervasyon yapmak ister misiniz?</p>
          <Link
            href="/rezervasyon"
            className="inline-block bg-white text-primary-600 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-50 transition-colors"
          >
            Rezervasyon Yap
          </Link>
        </div>
      </div>
    </div>
  );
}
