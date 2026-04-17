import { SessionOptions, getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";

export interface SessionData {
  userId?: string;
  email?: string;
  name?: string;
  isLoggedIn?: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "bu-en-az-32-karakter-olmali-gizli-anahtar-123",
  cookieName: "lokanta-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

export async function getSession(req: NextRequest, res: NextResponse) {
  return getIronSession<SessionData>(req, res, sessionOptions);
}
