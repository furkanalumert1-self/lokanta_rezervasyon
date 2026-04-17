import { SessionOptions } from "iron-session";
 
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
