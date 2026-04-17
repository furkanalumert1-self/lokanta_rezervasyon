import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed verisi yukleniyor...");

  // Restoran olustur
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "cafe-merhaba" },
    update: {},
    create: {
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
  console.log("✅ Restoran olusturuldu:", restaurant.name);

  // Admin kullanici
  const adminEmail = process.env.ADMIN_EMAIL || "admin@lokanta.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcryptjs.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
    },
  });
  console.log("✅ Admin kullanici olusturuldu:", adminEmail);

  // Masalar
  const tableData = [
    { name: "Masa 1", capacity: 2, location: "ic-mekan" },
    { name: "Masa 2", capacity: 2, location: "ic-mekan" },
    { name: "Masa 3", capacity: 4, location: "ic-mekan" },
    { name: "Masa 4", capacity: 4, location: "ic-mekan" },
    { name: "Masa 5", capacity: 6, location: "ic-mekan" },
    { name: "Bahce 1", capacity: 4, location: "bahce" },
    { name: "Bahce 2", capacity: 6, location: "bahce" },
    { name: "Teras 1", capacity: 8, location: "teras" },
  ];

  const tables = [];
  for (const t of tableData) {
    const table = await prisma.table.upsert({
      where: {
        id: `table-${t.name.toLowerCase().replace(/\s/g, "-")}`,
      },
      update: {},
      create: {
        id: `table-${t.name.toLowerCase().replace(/\s/g, "-")}`,
        restaurantId: restaurant.id,
        ...t,
      },
    });
    tables.push(table);
  }
  console.log("✅", tables.length, "masa olusturuldu");

  // Menu kategorileri ve urunler
  const menuData = [
    {
      name: "Başlangıçlar",
      sortOrder: 1,
      items: [
        { name: "Mercimek Çorbası", price: 65, description: "Geleneksel kırmızı mercimek", isPopular: true },
        { name: "Sigara Böreği", price: 75, description: "El açması, peynirli", isPopular: false },
        { name: "Humus", price: 60, description: "Tahin, zeytinyağı, nohut", isPopular: false },
        { name: "Atom", price: 55, description: "Acılı ezme, cevizli", isPopular: false },
      ],
    },
    {
      name: "Ana Yemekler",
      sortOrder: 2,
      items: [
        { name: "Adana Kebap", price: 280, description: "El kıyması, mangal", isPopular: true },
        { name: "İskender", price: 260, description: "Tereyağ, yoğurt, domates sos", isPopular: true },
        { name: "Karışık Izgara", price: 350, description: "Adana, tavuk, pirzola, köfte", isPopular: false },
        { name: "Tavuk Şiş", price: 200, description: "Marine edilmiş, mangal", isPopular: false },
        { name: "Etli Ekmek", price: 220, description: "Konya usulü, ince hamur", isPopular: false },
      ],
    },
    {
      name: "Salatalar",
      sortOrder: 3,
      items: [
        { name: "Çoban Salata", price: 60, description: "Domates, salatalık, biber", isPopular: false },
        { name: "Sezar Salata", price: 95, description: "Marul, parmesan, kruton", isPopular: false },
        { name: "Mevsim Salata", price: 55, description: "Mevsim yeşillikleri", isPopular: false },
      ],
    },
    {
      name: "İçecekler",
      sortOrder: 4,
      items: [
        { name: "Ayran", price: 25, description: "Ev yapımı", isPopular: true },
        { name: "Kola", price: 40, description: "330ml", isPopular: false },
        { name: "Taze Portakal Suyu", price: 55, description: "Sıkma", isPopular: false },
        { name: "Çay", price: 15, description: "Demlik", isPopular: false },
        { name: "Türk Kahvesi", price: 45, description: "Orta şekerli", isPopular: false },
        { name: "Limonata", price: 45, description: "Ev yapımı, naneli", isPopular: false },
      ],
    },
    {
      name: "Tatlılar",
      sortOrder: 5,
      items: [
        { name: "Künefe", price: 120, description: "Antep fıstıklı, kaymaklı", isPopular: true },
        { name: "Sütlaç", price: 65, description: "Fırın sütlaç", isPopular: false },
        { name: "Baklava", price: 95, description: "4 dilim, Antep fıstıklı", isPopular: false },
      ],
    },
  ];

  for (const cat of menuData) {
    const category = await prisma.menuCategory.upsert({
      where: {
        id: `cat-${cat.name.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "")}`,
      },
      update: {},
      create: {
        id: `cat-${cat.name.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "")}`,
        restaurantId: restaurant.id,
        name: cat.name,
        sortOrder: cat.sortOrder,
      },
    });

    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i];
      await prisma.menuItem.upsert({
        where: {
          id: `item-${cat.name.slice(0, 3)}-${i}`,
        },
        update: {},
        create: {
          id: `item-${cat.name.slice(0, 3)}-${i}`,
          categoryId: category.id,
          name: item.name,
          description: item.description,
          price: item.price,
          isPopular: item.isPopular,
          isAvailable: true,
          sortOrder: i,
        },
      });
    }
  }
  console.log("✅ Menu kategorileri ve urunler olusturuldu");

  // Ornek rezervasyonlar
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(19, 0, 0, 0);

  const today = new Date(now);
  today.setHours(19, 0, 0, 0);

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(20, 30, 0, 0);

  await prisma.reservation.upsert({
    where: { confirmationCode: "AHMT01" },
    update: {},
    create: {
      restaurantId: restaurant.id,
      tableId: tables[2].id,
      customerName: "Ahmet Yılmaz",
      customerPhone: "+905551111111",
      customerEmail: "ahmet@example.com",
      guestCount: 4,
      date: yesterday,
      duration: 90,
      status: "completed",
      confirmationCode: "AHMT01",
      notes: "Pencere kenarı tercih ederiz",
    },
  });

  await prisma.reservation.upsert({
    where: { confirmationCode: "AYSE02" },
    update: {},
    create: {
      restaurantId: restaurant.id,
      tableId: tables[0].id,
      customerName: "Ayşe Demir",
      customerPhone: "+905552222222",
      guestCount: 2,
      date: today,
      duration: 90,
      status: "confirmed",
      confirmationCode: "AYSE02",
    },
  });

  await prisma.reservation.upsert({
    where: { confirmationCode: "MHMT03" },
    update: {},
    create: {
      restaurantId: restaurant.id,
      tableId: tables[4].id,
      customerName: "Mehmet Kaya",
      customerPhone: "+905553333333",
      guestCount: 6,
      date: tomorrow,
      duration: 90,
      status: "pending",
      confirmationCode: "MHMT03",
      notes: "Doğum günü kutlaması",
    },
  });

  console.log("✅ Ornek rezervasyonlar olusturuldu");
  console.log("\n🎉 Seed islemi tamamlandi!");
  console.log("📧 Admin email:", adminEmail);
  console.log("🔑 Admin sifre:", adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
