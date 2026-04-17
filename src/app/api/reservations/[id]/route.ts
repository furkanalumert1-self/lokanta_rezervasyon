import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const reservation = await prisma.reservation.findUnique({
    where: { id: params.id },
    include: { table: true, restaurant: true },
  });
  if (!reservation) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(reservation);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const data = await req.json();
    const updated = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        status: data.status,
        tableId: data.tableId ?? undefined,
        notes: data.notes ?? undefined,
        whatsappSent: data.whatsappSent ?? undefined,
      },
      include: { table: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Güncelleme hatası" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  await prisma.reservation.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
