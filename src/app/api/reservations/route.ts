import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateConfirmationCode } from "@/lib/reservation-utils";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return NextResponse.json([]);

  const where: Record<string, unknown> = { restaurantId: restaurant.id };
  if (status && status !== "all") where.status = status;
  if (dateFrom || dateTo) {
    where.date = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo) } : {}),
    };
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
    const restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) {
      return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });
    }

    // Parse date/time
    const dateStr = body.date; // YYYY-MM-DD
    const timeStr = body.time; // HH:MM
    const [hour, min] = timeStr.split(":").map(Number);
    const reservationDate = new Date(dateStr);
    reservationDate.setHours(hour, min, 0, 0);

    // Generate unique code
    let confirmationCode = generateConfirmationCode();
    let exists = await prisma.reservation.findUnique({ where: { confirmationCode } });
    while (exists) {
      confirmationCode = generateConfirmationCode();
      exists = await prisma.reservation.findUnique({ where: { confirmationCode } });
    }

    const reservation = await prisma.reservation.create({
      data: {
        restaurantId: restaurant.id,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail || null,
        guestCount: body.guestCount,
        date: reservationDate,
        duration: restaurant.slotDuration,
        notes: body.notes || null,
        confirmationCode,
        status: "pending",
        source: "web",
      },
    });

    return NextResponse.json({ reservation, confirmationCode });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Rezervasyon oluşturulamadı" }, { status: 500 });
  }
}
