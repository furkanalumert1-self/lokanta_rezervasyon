import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

interface PublicHeaderProps {
  restaurantName?: string;
}

export default function PublicHeader({ restaurantName = "Cafe Merhaba" }: PublicHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-orange-600 font-bold text-xl">
          <UtensilsCrossed className="h-6 w-6" />
          <span>{restaurantName}</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/menu" className="text-gray-600 hover:text-orange-600 text-sm font-medium transition-colors">
            Menü
          </Link>
          <Link
            href="/rezervasyon"
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            Rezervasyon
          </Link>
        </nav>
      </div>
    </header>
  );
}
