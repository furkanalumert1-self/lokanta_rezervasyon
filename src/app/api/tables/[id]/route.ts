import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const data = await req.json();
  const table = await prisma.table.update({
    where: { id: params.id },
    data: {
      name: data.name,
      capacity: Number(data.capacity),
      location: data.location,
      isActive: data.isActive,
    },
  });
  return NextResponse.json(table);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  await prisma.table.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
