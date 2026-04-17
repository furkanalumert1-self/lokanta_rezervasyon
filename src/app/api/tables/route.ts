import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return NextResponse.json([]);

  const tables = await prisma.table.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(tables);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

  const body = await req.json();
  const table = await prisma.table.create({
    data: {
      restaurantId: restaurant.id,
      name: body.name,
      capacity: body.capacity,
      location: body.location,
    },
  });

  return NextResponse.json(table);
}
