import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Kod gerekli" }, { status: 400 });

  const reservation = await prisma.reservation.findUnique({
    where: { confirmationCode: code.toUpperCase() },
    include: { table: true, restaurant: { select: { name: true, phone: true } } },
  });

  if (!reservation) return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });
  return NextResponse.json(reservation);
}
