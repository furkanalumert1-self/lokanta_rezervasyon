"use client";

import { useState } from "react";
import { Flame, Info } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    isPopular: boolean;
  };
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5 overflow-hidden"
        onClick={() => setShowDetail(true)}
      >
        {item.imageUrl && (
          <div className="h-40 overflow-hidden bg-orange-50">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                {item.isPopular && (
                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3" />
                    Popüler
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h3>
              {item.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
            <span className="text-primary-600 font-bold text-base shrink-0">
              {formatPrice(item.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      {showDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {item.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                {item.isPopular && (
                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3" />
                    Popüler
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">{item.name}</h3>
              {item.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-primary-600 font-bold text-2xl">{formatPrice(item.price)}</span>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
