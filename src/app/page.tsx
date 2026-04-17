import Link from "next/link";
import { UtensilsCrossed, MapPin, Clock, Phone, ChevronRight, Star } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      {/* Hero */}
      <section className="relative hero-pattern overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <Star className="w-3.5 h-3.5 fill-current" />
              Kadıköy&apos;ün En Çok Sevilen Kafe&apos;si
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Lezzetle Dolu
              <span className="text-primary-600 block">Bir Masa Sizi</span>
              Bekliyor
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Ev yapımı lezzetler, sıcak atmosfer. Her lokmada bir hikaye, her ziyarette 
              yeni anılar. Yerinizi hemen ayırtın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/rezervasyon"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
              >
                <UtensilsCrossed className="w-5 h-5" />
                Rezervasyon Yap
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-lg"
              >
                Menüyü Gör
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative blob */}
        <div className="absolute top-10 right-0 w-96 h-96 bg-orange-100 rounded-full opacity-40 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-amber-100 rounded-full opacity-30 blur-2xl -z-10" />
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🍽️",
                title: "Ev Yapımı Lezzetler",
                desc: "Her gün taze hazırlanan, özenle pişirilen Türk mutfağının en güzel tatları.",
              },
              {
                icon: "🌿",
                title: "Sıcak Atmosfer",
                desc: "Bahçe, teras ve iç mekân seçenekleriyle her havada keyifli bir ortam.",
              },
              {
                icon: "⚡",
                title: "Kolay Rezervasyon",
                desc: "Online rezervasyon sistemiyle dakikalar içinde masanızı ayırtın.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center p-6 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-16 bg-gray-50 dot-pattern">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-12">
            Bizi Ziyaret Edin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Çalışma Saatleri</h3>
              <p className="text-gray-600 text-sm">Her gün açığız</p>
              <p className="text-primary-600 font-bold text-lg mt-1">09:00 – 23:00</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Adresimiz</h3>
              <p className="text-gray-600 text-sm">Bağdat Caddesi No:42</p>
              <p className="text-gray-600 text-sm">Kadıköy / İstanbul</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
              <a href="tel:+905551234567" className="text-primary-600 font-bold text-lg hover:text-primary-700">
                +90 555 123 45 67
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Masanızı Hemen Ayırtın
          </h2>
          <p className="text-orange-100 mb-8">
            Online rezervasyon ile kolayca yer ayırtın, onay kodunuzu anında alın.
          </p>
          <Link
            href="/rezervasyon"
            className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-orange-50 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg text-lg"
          >
            Rezervasyon Yap
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
