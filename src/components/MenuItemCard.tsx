"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    isPopular: boolean;
    isAvailable: boolean;
  };
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
        onClick={() => setOpen(true)}
      >
        {item.imageUrl && (
          <div className="h-40 bg-gray-100 overflow-hidden">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                {item.isPopular && (
                  <span className="flex items-center gap-0.5 bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                    <Star className="h-3 w-3 fill-current" />
                    Popüler
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-gray-500 text-xs line-clamp-2">{item.description}</p>
              )}
            </div>
            <span className="text-orange-600 font-bold text-sm whitespace-nowrap">₺{item.price}</span>
          </div>
          {!item.isAvailable && (
            <span className="mt-2 inline-block text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">Mevcut değil</span>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {item.name}
              {item.isPopular && (
                <span className="flex items-center gap-0.5 bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3 fill-current" /> Popüler
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          {item.imageUrl && (
            <div className="rounded-lg overflow-hidden h-48 bg-gray-100">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
          )}
          {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-2xl font-bold text-orange-600">₺{item.price}</span>
            {!item.isAvailable && (
              <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full">Mevcut değil</span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
