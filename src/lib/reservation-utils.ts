import { SLOT_INTERVAL } from "./constants";

export function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateTimeSlots(openingTime: string, closingTime: string, slotDuration: number): string[] {
  const slots: string[] = [];
  const [openHour, openMin] = openingTime.split(":").map(Number);
  const [closeHour, closeMin] = closingTime.split(":").map(Number);

  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;
  const lastSlot = closeMinutes - slotDuration;

  for (let minutes = openMinutes; minutes <= lastSlot; minutes += SLOT_INTERVAL) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
}

export function isSlotAvailable(
  slot: string,
  date: string,
  reservations: { date: Date; duration: number; guestCount: number }[],
  totalCapacity: number,
  slotDuration: number
): boolean {
  const [slotH, slotM] = slot.split(":").map(Number);
  const slotStart = slotH * 60 + slotM;
  const slotEnd = slotStart + slotDuration;

  const targetDate = new Date(date);
  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(targetDate);
  dayEnd.setHours(23, 59, 59, 999);

  let bookedGuests = 0;
  for (const res of reservations) {
    const resDate = new Date(res.date);
    if (resDate < dayStart || resDate > dayEnd) continue;

    const resH = resDate.getHours();
    const resM = resDate.getMinutes();
    const resStart = resH * 60 + resM;
    const resEnd = resStart + res.duration;

    if (slotStart < resEnd && slotEnd > resStart) {
      bookedGuests += res.guestCount;
    }
  }
  return bookedGuests < totalCapacity;
}

export function formatTurkishDate(date: Date): string {
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
