import Link from "next/link";
import { UtensilsCrossed, Phone, MapPin, Clock } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Cafe Merhaba
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ev yapımı lezzetler, sıcak atmosfer. Her lokmada bir hikaye.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="hover:text-primary-400 transition-colors">Menümüz</Link></li>
              <li><Link href="/rezervasyon" className="hover:text-primary-400 transition-colors">Rezervasyon Yap</Link></li>
              <li><Link href="/rezervasyon/sorgula" className="hover:text-primary-400 transition-colors">Rezervasyon Sorgula</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <a href="tel:+905551234567" className="hover:text-primary-400 transition-colors">+90 555 123 45 67</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                <span>Bağdat Caddesi No:42, Kadıköy/İstanbul</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-400 shrink-0" />
                <span>Her gün 09:00 – 23:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Cafe Merhaba. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
