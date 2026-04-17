import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId?: string;
  email?: string;
  name?: string;
  isLoggedIn?: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "bu-en-az-32-karakter-olmali-gizli-anahtar-default",
  cookieName: "lokanta-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 gun
  },
};

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session;
}
