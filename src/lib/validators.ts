import { z } from "zod";

export const reservationSchema = z.object({
  restaurantId: z.string().min(1, "Restoran ID gerekli"),
  customerName: z.string().min(2, "Ad soyad en az 2 karakter olmali"),
  customerPhone: z.string().min(10, "Gecerli bir telefon numarasi girin"),
  customerEmail: z.string().email("Gecerli bir e-posta girin").optional().or(z.literal("")),
  guestCount: z.number().min(1).max(20),
  date: z.string().min(1, "Tarih secin"),
  time: z.string().min(1, "Saat secin"),
  notes: z.string().optional(),
});

export const menuItemSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1, "Urun adi gerekli"),
  description: z.string().optional(),
  price: z.number().min(0, "Fiyat 0 veya daha buyuk olmali"),
  imageUrl: z.string().url("Gecerli URL girin").optional().or(z.literal("")),
  isAvailable: z.boolean().default(true),
  isPopular: z.boolean().default(false),
});

export const menuCategorySchema = z.object({
  name: z.string().min(1, "Kategori adi gerekli"),
  sortOrder: z.number().default(0),
});

export const tableSchema = z.object({
  name: z.string().min(1, "Masa adi gerekli"),
  capacity: z.number().min(1, "Kapasite en az 1 olmali"),
  location: z.enum(["ic-mekan", "bahce", "teras"]),
});

export const loginSchema = z.object({
  email: z.string().email("Gecerli bir e-posta girin"),
  password: z.string().min(6, "Sifre en az 6 karakter olmali"),
});

export const restaurantSettingsSchema = z.object({
  name: z.string().min(1, "Restoran adi gerekli"),
  phone: z.string().min(10, "Gecerli telefon girin"),
  address: z.string().min(5, "Adres gerekli"),
  description: z.string().optional(),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM formatinda girin"),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM formatinda girin"),
  slotDuration: z.number().min(30).max(240),
  maxGuests: z.number().min(1).max(50),
  maxAdvanceDays: z.number().min(1).max(365),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RestaurantSettingsInput = z.infer<typeof restaurantSettingsSchema>;
