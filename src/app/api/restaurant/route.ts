import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(restaurant);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  const updated = await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: {
      name: body.name, phone: body.phone, address: body.address,
      description: body.description, openingTime: body.openingTime,
      closingTime: body.closingTime, slotDuration: body.slotDuration,
      maxGuests: body.maxGuests, maxAdvanceDays: body.maxAdvanceDays,
    },
  });
  return NextResponse.json(updated);
}
