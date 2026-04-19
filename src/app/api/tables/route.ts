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
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const data = await req.json();
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

  const table = await prisma.table.create({
    data: {
      restaurantId: restaurant.id,
      name: data.name,
      capacity: Number(data.capacity),
      location: data.location || "ic-mekan",
      isActive: true,
    },
  });
  return NextResponse.json(table, { status: 201 });
}
