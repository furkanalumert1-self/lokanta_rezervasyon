import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const data = await req.json();
  const item = await prisma.menuItem.update({
    where: { id: params.id },
    data: {
      name: data.name,
      description: data.description || null,
      price: Number(data.price),
      imageUrl: data.imageUrl || null,
      isAvailable: data.isAvailable,
      isPopular: data.isPopular,
      categoryId: data.categoryId,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  await prisma.menuItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
