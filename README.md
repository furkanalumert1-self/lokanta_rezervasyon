# 🍽️ Lokanta Rezervasyon Sistemi

Tam özellikli restoran rezervasyon ve dijital menü sistemi — Next.js 14 ile.

## 🚀 Hızlı Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/kullanici/lokanta-rezervasyon.git
cd lokanta-rezervasyon

# 2. Tek komutla kur ve başlat
npm run setup && npm run dev
```

Tarayıcıda aç: **http://localhost:3000**

Admin panel: **http://localhost:3000/admin**

## 🔑 Varsayılan Admin Bilgileri

| Alan | Değer |
|------|-------|
| E-posta | admin@lokanta.com |
| Şifre | admin123 |

## ✨ Özellikler

- **QR Menü** — Her masa için QR kod üret, müşteriler tarayıp dijital menüyü görsün
- **Online Rezervasyon** — 4 adımlı form: takvim → saat → kişi → bilgiler
- **Onay Kodu** — Her rezervasyona benzersiz 6 karakterli kod
- **WhatsApp Entegrasyonu** — Hazır mesaj şablonlarıyla wa.me linkleri
- **Admin Paneli** — Dashboard, rezervasyon yönetimi, menü düzenleme, masa yönetimi
- **Gerçek Zamanlı Slot** — Dolu saatler otomatik pasif, anlık kapasite kontrolü
- **Türkçe Arayüz** — Tüm etiketler, bildirimler ve tarih formatları Türkçe
- **Mobile-first** — Her ekran boyutunda kusursuz

## 🛠 Teknolojiler

- **Next.js 14** App Router + TypeScript
- **SQLite + Prisma ORM** — Sıfır konfigürasyon
- **Tailwind CSS** — Turuncu temalı tasarım
- **iron-session** — Güvenli admin oturumu
- **qrcode** — QR kod üretimi
- **bcryptjs** — Şifre hashleme

## 📁 Klasör Yapısı

```
src/
├── app/
│   ├── page.tsx          # Landing
│   ├── menu/             # Dijital menü
│   ├── rezervasyon/      # Rezervasyon formu + sorgula + başarılı
│   ├── qr/[tableId]/     # QR menü
│   ├── admin/            # Tüm admin sayfalar
│   └── api/              # REST API routes
├── components/           # UI bileşenleri
└── lib/                  # Yardımcı fonksiyonlar
```

## 📜 NPM Scriptler

```bash
npm run setup      # Tam kurulum (install + db + seed)
npm run dev        # Geliştirme sunucusu
npm run build      # Production build
npm run db:studio  # Prisma Studio (DB görselleştirme)
npm run db:seed    # Seed verisini yeniden yükle
```

## 🚢 Deployment

### Vercel (Önerilen)

```bash
vercel --prod
```

> **Not:** Vercel'de SQLite çalışmaz. `DATABASE_URL`'yi Turso ile değiştirin:
> ```prisma
> datasource db {
>   provider = "sqlite"        # "turso" ile değiştir
>   url      = env("DATABASE_URL")
>   authToken = env("TURSO_AUTH_TOKEN")  # ekle
> }
> ```

## 📄 Lisans

MIT © 2024
