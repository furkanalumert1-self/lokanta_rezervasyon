import { z } from "zod";

export const reservationSchema = z.object({
  date: z.string().min(1, "Tarih seçiniz"),
  time: z.string().min(1, "Saat seçiniz"),
  guestCount: z.number().min(1).max(12),
  customerName: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  customerPhone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  customerEmail: z.string().email("Geçerli bir e-posta giriniz").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta giriniz"),
  password: z.string().min(1, "Şifre giriniz"),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  description: z.string().optional(),
  price: z.number().min(0, "Fiyat 0 veya daha büyük olmalı"),
  imageUrl: z.string().url("Geçerli URL giriniz").optional().or(z.literal("")),
  isAvailable: z.boolean().default(true),
  isPopular: z.boolean().default(false),
  categoryId: z.string().min(1, "Kategori seçiniz"),
  sortOrder: z.number().default(0),
});

export const tableSchema = z.object({
  name: z.string().min(1, "Masa adı zorunludur"),
  capacity: z.number().min(1, "Kapasite en az 1 olmalı"),
  location: z.string().min(1, "Konum seçiniz"),
});

export const restaurantSettingsSchema = z.object({
  name: z.string().min(1, "Restoran adı zorunludur"),
  phone: z.string().min(10, "Geçerli telefon giriniz"),
  address: z.string().min(5, "Adres zorunludur"),
  description: z.string().optional(),
  openingTime: z.string(),
  closingTime: z.string(),
  slotDuration: z.number().min(30).max(240),
  maxGuests: z.number().min(1).max(50),
  maxAdvanceDays: z.number().min(1).max(365),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type MenuItemFormData = z.infer<typeof menuItemSchema>;
export type TableFormData = z.infer<typeof tableSchema>;
export type RestaurantSettingsFormData = z.infer<typeof restaurantSettingsSchema>;
