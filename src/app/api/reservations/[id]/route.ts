import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const reservation = await prisma.reservation.findUnique({ where: { id: params.id }, include: { table: true, restaurant: true } });
  if (!reservation) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(reservation);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const body = await req.json();
  const reservation = await prisma.reservation.update({
    where: { id: params.id },
    data: { status: body.status, tableId: body.tableId || null, notes: body.notes, whatsappSent: body.whatsappSent },
    include: { table: true },
  });
  return NextResponse.json(reservation);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  await prisma.reservation.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
