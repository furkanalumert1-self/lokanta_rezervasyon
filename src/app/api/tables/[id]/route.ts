import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const res = NextResponse.json({});
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await req.json();
  const table = await prisma.table.update({
    where: { id: params.id },
    data: {
      name: body.name,
      capacity: body.capacity,
      location: body.location,
      isActive: body.isActive,
    },
  });

  return NextResponse.json(table);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const res = NextResponse.json({});
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await prisma.table.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
