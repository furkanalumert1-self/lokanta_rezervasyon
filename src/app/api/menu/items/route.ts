import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const data = await req.json();
  const item = await prisma.menuItem.create({
    data: {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description || null,
      price: Number(data.price),
      imageUrl: data.imageUrl || null,
      isAvailable: data.isAvailable ?? true,
      isPopular: data.isPopular ?? false,
      sortOrder: data.sortOrder || 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
