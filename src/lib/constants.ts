export const RESERVATION_STATUS = {
  pending: "Bekliyor",
  confirmed: "Onaylandı",
  cancelled: "İptal",
  completed: "Tamamlandı",
  no_show: "Gelmedi",
} as const;

export const LOCATION_LABELS = {
  "ic-mekan": "İç Mekan",
  bahce: "Bahçe",
  teras: "Teras",
} as const;

export const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  no_show: "bg-gray-100 text-gray-800",
} as const;

export const SLOT_INTERVAL = 30;

export const TURKISH_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export const TURKISH_DAYS = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi",
];
