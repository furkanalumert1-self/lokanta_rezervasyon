import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "bu-en-az-32-karakter-olmali-gizli-anahtar-123"
);

export interface SessionData {
  userId: string;
  email: string;
  name: string;
}

export async function createSession(data: SessionData) {
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);

  cookies().set("lokanta-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const token = cookies().get("lokanta-session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  cookies().delete("lokanta-session");
}
