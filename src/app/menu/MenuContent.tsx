"use client";
import { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";

interface Category {
  id: string;
  name: string;
  items: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isPopular: boolean;
    isAvailable: boolean;
  }[];
}

export default function MenuContent({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");

  const active = categories.find((c) => c.id === activeCategory);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
            }`}
          >
            {cat.name}
            <span className="ml-1.5 text-xs opacity-70">({cat.items.length})</span>
          </button>
        ))}
      </div>

      {/* Items grid */}
      {active && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{active.name}</h2>
          {active.items.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">Bu kategoride ürün yok.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
