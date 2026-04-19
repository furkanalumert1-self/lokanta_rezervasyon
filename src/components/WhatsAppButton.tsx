"use client";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
}

export default function WhatsAppButton({ phone, message = "Merhaba, rezervasyon hakkinda bilgi almak istiyorum." }: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl(phone, message);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all hover:scale-105 group"
      aria-label="WhatsApp ile iletisim"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden group-hover:inline text-sm font-medium pr-1">WhatsApp</span>
    </a>
  );
}
