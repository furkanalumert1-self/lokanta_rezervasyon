import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateConfirmationCode } from "@/lib/reservation-utils";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  const range = searchParams.get("range");

  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

  const where: Record<string, unknown> = { restaurantId: restaurant.id };
  if (status && status !== "all") where.status = status;

  if (date) {
    const d = new Date(date);
    const start = new Date(d); start.setHours(0, 0, 0, 0);
    const end = new Date(d); end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  } else if (range === "week") {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setDate(end.getDate() + 7); end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  } else if (range === "month") {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setDate(end.getDate() + 30); end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }

  const reservations = await prisma.reservation.findMany({
    where,
    include: { table: true },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(reservations);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurantId, customerName, customerPhone, customerEmail, guestCount, date, time, notes } = body;

    if (!restaurantId || !customerName || !customerPhone || !guestCount || !date || !time) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

    const [h, m] = time.split(":").map(Number);
    const reservationDate = new Date(date);
    reservationDate.setHours(h, m, 0, 0);

    let confirmationCode: string;
    let attempts = 0;
    do {
      confirmationCode = generateConfirmationCode();
      attempts++;
      const existing = await prisma.reservation.findUnique({ where: { confirmationCode } });
      if (!existing) break;
    } while (attempts < 10);

    const reservation = await prisma.reservation.create({
      data: {
        restaurantId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        guestCount: Number(guestCount),
        date: reservationDate,
        duration: restaurant.slotDuration,
        notes: notes || null,
        status: "pending",
        source: "web",
        confirmationCode: confirmationCode!,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
