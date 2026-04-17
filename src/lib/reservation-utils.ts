export function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateTimeSlots(
  openingTime: string,
  closingTime: string,
  slotDuration: number
): string[] {
  const slots: string[] = [];

  const [openHour, openMin] = openingTime.split(":").map(Number);
  const [closeHour, closeMin] = closingTime.split(":").map(Number);

  let currentMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;
  const lastSlotMinutes = closeMinutes - slotDuration;

  while (currentMinutes <= lastSlotMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    currentMinutes += 30;
  }

  return slots;
}

export function isSlotAvailable(
  slotTime: string,
  date: string,
  reservations: Array<{ date: Date; duration: number; guestCount: number }>,
  totalCapacity: number,
  slotDuration: number
): boolean {
  const [slotHour, slotMin] = slotTime.split(":").map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(slotHour, slotMin, 0, 0);

  const slotEnd = new Date(slotDate.getTime() + slotDuration * 60 * 1000);

  let guestsInSlot = 0;

  for (const res of reservations) {
    const resStart = new Date(res.date);
    const resEnd = new Date(resStart.getTime() + res.duration * 60 * 1000);

    // Check if reservations overlap
    if (resStart < slotEnd && resEnd > slotDate) {
      guestsInSlot += res.guestCount;
    }
  }

  return guestsInSlot < totalCapacity;
}

export function getSlotGuestCount(
  slotTime: string,
  date: string,
  reservations: Array<{ date: Date; duration: number; guestCount: number }>,
  slotDuration: number
): number {
  const [slotHour, slotMin] = slotTime.split(":").map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(slotHour, slotMin, 0, 0);

  const slotEnd = new Date(slotDate.getTime() + slotDuration * 60 * 1000);

  let guestsInSlot = 0;

  for (const res of reservations) {
    const resStart = new Date(res.date);
    const resEnd = new Date(resStart.getTime() + res.duration * 60 * 1000);

    if (resStart < slotEnd && resEnd > slotDate) {
      guestsInSlot += res.guestCount;
    }
  }

  return guestsInSlot;
}
