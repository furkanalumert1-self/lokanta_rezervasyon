export const RESERVATION_STATUS = {
  pending: { label: "Bekleyen", color: "yellow" },
  confirmed: { label: "Onaylandı", color: "green" },
  cancelled: { label: "İptal", color: "red" },
  completed: { label: "Tamamlandı", color: "blue" },
  no_show: { label: "Gelmedi", color: "gray" },
} as const;

export const TABLE_LOCATIONS = {
  "ic-mekan": "İç Mekan",
  bahce: "Bahçe",
  teras: "Teras",
  vip: "VIP",
} as const;

export const GUEST_COUNT_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

export const TURKISH_DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
export const TURKISH_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
