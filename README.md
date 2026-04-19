# Lokanta Rezervasyon Sistemi

Lokanta ve kafeler için tam kapsamlı rezervasyon ve dijital menü yönetim sistemi.

## Özellikler

- **QR Menü** — Her masa için benzersiz QR kod, müşteriler tarayınca dijital menüyü görür
- **Online Rezervasyon** — Adım adım form, müsait saat kontrolü, onay kodu
- **WhatsApp Entegrasyonu** — wa.me linkleriyle hazır mesaj şablonları
- **Admin Paneli** — Rezervasyon yönetimi, menü düzenleme, masa yönetimi, ayarlar

## Hızlı Kurulum

```bash
git clone <repo>
cd lokanta-rezervasyon
npm run setup
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açın.

## Admin Girişi

- URL: http://localhost:3000/admin
- E-posta: `admin@lokanta.com`
- Şifre: `admin123`

## Teknolojiler

| Teknoloji | Açıklama |
|-----------|----------|
| Next.js 14 (App Router) | React framework |
| TypeScript | Tip güvenliği |
| SQLite + Prisma | Veritabanı |
| Tailwind CSS | Stil |
| iron-session | Admin oturum yönetimi |
| bcryptjs | Şifre hashleme |
| qrcode | QR kod oluşturma |
| react-hook-form + zod | Form validasyonu |

## Komutlar

```bash
npm run dev       # Geliştirme sunucusu
npm run build     # Production build
npm run db:studio # Prisma Studio (DB görüntüle)
npm run db:seed   # Seed verisini yeniden yükle
npm run setup     # İlk kurulum (install + db push + seed)
```

## Deployment

### Vercel (SQLite → Turso)

`prisma/schema.prisma` dosyasında tek satır değiştirin:

```prisma
datasource db {
  provider = "sqlite"        // bunu
  provider = "libsql"        // buna değiştirin
  url      = env("DATABASE_URL")
  // Turso için ekleyin:
  // authToken = env("TURSO_AUTH_TOKEN")
}
```

## Lisans

MIT
