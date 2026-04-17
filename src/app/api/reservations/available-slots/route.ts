import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots, getSlotGuestCount } from "@/lib/reservation-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ error: "Tarih gerekli" }, { status: 400 });
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return NextResponse.json({ slots: [] });
  const tables = await prisma.table.findMany({ where: { restaurantId: restaurant.id, isActive: true } });
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999);
  const reservations = await prisma.reservation.findMany({
    where: { restaurantId: restaurant.id, date: { gte: dayStart, lte: dayEnd }, status: { notIn: ["cancelled"] } },
    select: { date: true, duration: true, guestCount: true },
  });
  const allSlots = generateTimeSlots(restaurant.openingTime, restaurant.closingTime, restaurant.slotDuration);
  const now = new Date();
  const slots = allSlots.map((time) => {
    const [h, m] = time.split(":").map(Number);
    const slotDate = new Date(date); slotDate.setHours(h, m, 0, 0);
    const isPast = slotDate <= now;
    const guestsInSlot = getSlotGuestCount(time, date, reservations, restaurant.slotDuration);
    const isAvailable = !isPast && guestsInSlot < totalCapacity;
    return { time, isAvailable, isPast, guestsInSlot, totalCapacity };
  });
  return NextResponse.json({ slots });
}
