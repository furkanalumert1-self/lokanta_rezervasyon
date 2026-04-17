// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/auth";
 
export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/admin/giris", req.url));
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.destroy();
  return res;
}
