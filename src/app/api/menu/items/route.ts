import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const item = await prisma.menuItem.create({
    data: {
      categoryId: body.categoryId,
      name: body.name,
      description: body.description || null,
      price: body.price,
      imageUrl: body.imageUrl || null,
      isAvailable: body.isAvailable ?? true,
      isPopular: body.isPopular ?? false,
      sortOrder: body.sortOrder ?? 0,
    },
  });
  return NextResponse.json(item);
}
