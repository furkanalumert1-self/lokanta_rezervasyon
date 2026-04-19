import { NextRequest, NextResponse } from "next/server";
import { generateQRCode } from "@/lib/qr";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tableId = searchParams.get("tableId");
  if (!tableId) return NextResponse.json({ error: "tableId gerekli" }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const qrCode = await generateQRCode(tableId, baseUrl);
  return NextResponse.json({ qrCode });
}
