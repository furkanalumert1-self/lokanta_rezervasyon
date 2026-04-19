import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return NextResponse.json([], { status: 200 });

  const categories = await prisma.menuCategory.findMany({
    where: { restaurantId: restaurant.id },
    include: { items: { where: { isAvailable: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const data = await req.json();
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

  const category = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: data.name, sortOrder: data.sortOrder || 0 },
  });
  return NextResponse.json(category, { status: 201 });
}
