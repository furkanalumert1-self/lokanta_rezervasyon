import { MapPin, Phone, Clock } from "lucide-react";

interface PublicFooterProps {
  restaurantName?: string;
  address?: string;
  phone?: string;
  openingTime?: string;
  closingTime?: string;
}

export default function PublicFooter({
  restaurantName = "Cafe Merhaba",
  address = "Bagdat Caddesi No:42, Kadikoy/Istanbul",
  phone = "+905551234567",
  openingTime = "09:00",
  closingTime = "23:00",
}: PublicFooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">{restaurantName}</h3>
          <p className="text-sm text-gray-400">Ev yapimi lezzetler, sicak atmosfer.</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span>{address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span>{openingTime} - {closingTime}</span>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Hizli Erisim</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/menu" className="hover:text-orange-400 transition-colors">Dijital Menu</a></li>
            <li><a href="/rezervasyon" className="hover:text-orange-400 transition-colors">Rezervasyon Yap</a></li>
            <li><a href="/rezervasyon/sorgula" className="hover:text-orange-400 transition-colors">Rezervasyon Sorgula</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {restaurantName}. Tum haklari saklidir.
      </div>
    </footer>
  );
}
