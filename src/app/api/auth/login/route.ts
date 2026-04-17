import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcryptjs from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email ve şifre zorunludur" }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Geçersiz email veya şifre" }, { status: 401 });
    }

    const valid = await bcryptjs.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Geçersiz email veya şifre" }, { status: 401 });
    }

    await createSession({ userId: user.id, email: user.email, name: user.name });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
