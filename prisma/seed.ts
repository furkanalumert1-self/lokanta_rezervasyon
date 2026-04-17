import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed verisi yukleniyor...");

  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.table.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.restaurant.deleteMany();

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Cafe Merhaba",
      slug: "cafe-merhaba",
      phone: "+905551234567",
      address: "Bagdat Caddesi No:42, Kadikoy/Istanbul",
      description: "Ev yapimi lezzetler, sicak atmosfer",
      primaryColor: "#ea580c",
      openingTime: "09:00",
      closingTime: "23:00",
      slotDuration: 90,
      maxGuests: 12,
      maxAdvanceDays: 30,
    },
  });

  console.log("Restoran olusturuldu:", restaurant.name);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@lokanta.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
    },
  });

  console.log("Admin kullanici olusturuldu:", adminEmail);

  const tables = await Promise.all([
    prisma.table.create({ data: { restaurantId: restaurant.id, name: "Masa 1", capacity: 2, location: "ic-mekan" } }),
    prisma.table.create({ data: { restaurantId: restaurant.id, name: "Masa 2", capacity: 2, location: "ic-mekan" } }),
    prisma.table.create({ data: { restaurantId: restaurant.id, name: "Masa 3", capacity: 4, location: "ic-mekan" } }),
    prisma.table.create({ data: { restaurantId: restaurant.id, name: "Masa 4", capacity: 4, location: "ic-mekan" } }),
    prisma.table.create({ data: { restaurantId: restaurant.id, name: "Masa 5", capacity: 6, location: "ic-mekan" } }),
    prisma.table.create({ data: { restaurantId: restaurant.id, name: "Bahce 1", capacity: 4, location: "bahce" } }),
    prisma.table.create({ data: { restaurantId: restaurant.id, name: "Bahce 2", capacity: 6, location: "bahce" } }),
    prisma.table.create({ data: { restaurantId: restaurant.id, name: "Teras 1", capacity: 8, location: "teras" } }),
  ]);

  console.log("8 masa olusturuldu");

  const baslangiclar = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: "Baslangiclar", sortOrder: 0 },
  });
  const anaYemekler = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: "Ana Yemekler", sortOrder: 1 },
  });
  const salatalar = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: "Salatalar", sortOrder: 2 },
  });
  const icecekler = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: "Icecekler", sortOrder: 3 },
  });
  const tatlilar = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: "Tatlilar", sortOrder: 4 },
  });

  await prisma.menuItem.createMany({
    data: [
      { categoryId: baslangiclar.id, name: "Mercimek Corbasi", description: "Geleneksel kirmizi mercimek", price: 65, isPopular: true, sortOrder: 0 },
      { categoryId: baslangiclar.id, name: "Sigara Boregi", description: "El acmasi, peynirli", price: 75, isPopular: false, sortOrder: 1 },
      { categoryId: baslangiclar.id, name: "Humus", description: "Tahin, zeytinyagi, nohut", price: 60, isPopular: false, sortOrder: 2 },
      { categoryId: baslangiclar.id, name: "Atom", description: "Acili ezme, cevizli", price: 55, isPopular: false, sortOrder: 3 },

      { categoryId: anaYemekler.id, name: "Adana Kebap", description: "El kiymasi, mangal", price: 280, isPopular: true, sortOrder: 0 },
      { categoryId: anaYemekler.id, name: "Iskender", description: "Tereyag, yogurt, domates sos", price: 260, isPopular: true, sortOrder: 1 },
      { categoryId: anaYemekler.id, name: "Karisik Izgara", description: "Adana, tavuk, pirzola, kofte", price: 350, isPopular: false, sortOrder: 2 },
      { categoryId: anaYemekler.id, name: "Tavuk Sis", description: "Marine edilmis, mangal", price: 200, isPopular: false, sortOrder: 3 },
      { categoryId: anaYemekler.id, name: "Etli Ekmek", description: "Konya usulu, ince hamur", price: 220, isPopular: false, sortOrder: 4 },

      { categoryId: salatalar.id, name: "Coban Salata", description: "Domates, salatalik, biber", price: 60, isPopular: false, sortOrder: 0 },
      { categoryId: salatalar.id, name: "Sezar Salata", description: "Marul, parmesan, kruton", price: 95, isPopular: false, sortOrder: 1 },
      { categoryId: salatalar.id, name: "Mevsim Salata", description: "Mevsim yesillikleri", price: 55, isPopular: false, sortOrder: 2 },

      { categoryId: icecekler.id, name: "Ayran", description: "Ev yapimi", price: 25, isPopular: true, sortOrder: 0 },
      { categoryId: icecekler.id, name: "Kola", description: "330ml", price: 40, isPopular: false, sortOrder: 1 },
      { categoryId: icecekler.id, name: "Taze Portakal Suyu", description: "Sikma", price: 55, isPopular: false, sortOrder: 2 },
      { categoryId: icecekler.id, name: "Cay", description: "Demlik", price: 15, isPopular: false, sortOrder: 3 },
      { categoryId: icecekler.id, name: "Turk Kahvesi", description: "Orta sekerli", price: 45, isPopular: false, sortOrder: 4 },
      { categoryId: icecekler.id, name: "Limonata", description: "Ev yapimi, naneli", price: 45, isPopular: false, sortOrder: 5 },

      { categoryId: tatlilar.id, name: "Kunefe", description: "Antep fistikli, kaymakli", price: 120, isPopular: true, sortOrder: 0 },
      { categoryId: tatlilar.id, name: "Sutlac", description: "Firin sutlac", price: 65, isPopular: false, sortOrder: 1 },
      { categoryId: tatlilar.id, name: "Baklava", description: "4 dilim, Antep fistikli", price: 95, isPopular: false, sortOrder: 2 },
    ],
  });

  console.log("Menu kategorileri ve urunler olusturuldu");

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(13, 0, 0, 0);

  const today = new Date(now);
  today.setHours(19, 0, 0, 0);

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(20, 30, 0, 0);

  await prisma.reservation.create({
    data: {
      restaurantId: restaurant.id,
      tableId: tables[2].id,
      customerName: "Ahmet Yilmaz",
      customerPhone: "+905551112233",
      guestCount: 4,
      date: yesterday,
      duration: 90,
      status: "completed",
      confirmationCode: "AHM001",
      source: "web",
    },
  });

  await prisma.reservation.create({
    data: {
      restaurantId: restaurant.id,
      tableId: tables[0].id,
      customerName: "Ayse Demir",
      customerPhone: "+905552223344",
      customerEmail: "ayse@example.com",
      guestCount: 2,
      date: today,
      duration: 90,
      status: "confirmed",
      confirmationCode: "AYS002",
      source: "web",
    },
  });

  await prisma.reservation.create({
    data: {
      restaurantId: restaurant.id,
      tableId: tables[4].id,
      customerName: "Mehmet Kaya",
      customerPhone: "+905553334455",
      guestCount: 6,
      date: tomorrow,
      duration: 90,
      status: "pending",
      confirmationCode: "MEH003",
      source: "web",
      notes: "Pencere kenari tercihimiz var",
    },
  });

  console.log("Ornek rezervasyonlar olusturuldu");
  console.log("\nSeed tamamlandi!");
  console.log("Admin giris: " + adminEmail + " / " + adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
