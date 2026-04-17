"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
}

export default function WhatsAppButton({
  phone = "905551234567",
  message = "Merhaba, rezervasyon yapmak istiyorum.",
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group animate-float"
      aria-label="WhatsApp ile iletişime geç"
    >
      <div className="w-14 h-14 flex items-center justify-center">
        <MessageCircle className="w-7 h-7" />
      </div>
      <span className="hidden group-hover:block pr-4 text-sm font-semibold whitespace-nowrap">
        WhatsApp&apos;tan Yaz
      </span>
    </a>
  );
}
