import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });
    return NextResponse.json(restaurant);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const data = await req.json();
    const restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

    const updated = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        description: data.description,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        slotDuration: Number(data.slotDuration),
        maxGuests: Number(data.maxGuests),
        maxAdvanceDays: Number(data.maxAdvanceDays),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
