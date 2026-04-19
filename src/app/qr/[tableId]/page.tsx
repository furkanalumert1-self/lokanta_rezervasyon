export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/PublicHeader";
import MenuItemCard from "@/components/MenuItemCard";
import Link from "next/link";
import { CalendarDays, UtensilsCrossed } from "lucide-react";

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
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader restaurantName={table.restaurant.name} />

      {/* Table info banner */}
      <div className="bg-orange-600 text-white py-3 px-4 text-center text-sm font-medium">
        <span className="flex items-center justify-center gap-2">
          <UtensilsCrossed className="h-4 w-4" />
          {table.name} — {table.restaurant.name}
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Menümüz</h1>
          <Link
            href="/rezervasyon"
            className="flex items-center gap-1.5 text-sm text-orange-600 font-medium hover:underline"
          >
            <CalendarDays className="h-4 w-4" />
            Rezervasyon Yap
          </Link>
        </div>

        {categories.map((category) => (
          <div key={category.id} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
