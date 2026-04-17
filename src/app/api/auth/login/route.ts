import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/auth";
import { getIronSession } from "iron-session";
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

    const res = NextResponse.json({ ok: true });
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    session.userId = user.id;
    session.email = user.email;
    session.name = user.name;
    session.isLoggedIn = true;
    await session.save();

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
