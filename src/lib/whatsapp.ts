export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function getConfirmationMessage(data: {
  customerName: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  code: string;
}) {
  return `Merhaba ${data.customerName}! 🌟

${data.restaurantName} rezervasyonunuz onaylandi.

📅 Tarih: ${data.date}
🕐 Saat: ${data.time}
👥 Kisi: ${data.guests}
🎫 Onay Kodu: ${data.code}

Degisiklik veya iptal icin bu mesaji yanitlayabilirsiniz.

Hosgeldiniz! 🍽️`;
}

export function getReminderMessage(data: {
  customerName: string;
  restaurantName: string;
  time: string;
  guests: number;
  code: string;
}) {
  return `Merhaba ${data.customerName}! 🌟

Yarin saat ${data.time}'da ${data.restaurantName} rezervasyonunuz var.

👥 ${data.guests} kisi
🎫 Kod: ${data.code}

Sizi bekliyoruz! 🍽️`;
}

export function getCancellationMessage(data: {
  customerName: string;
  date: string;
  reservationUrl: string;
}) {
  return `Merhaba ${data.customerName},

${data.date} tarihli rezervasyonunuz iptal edilmistir.

Yeni rezervasyon icin: ${data.reservationUrl}

Iyi gunler dileriz. 🙏`;
}

export function getCustomMessage(data: {
  customerName: string;
  restaurantPhone: string;
  message: string;
}) {
  return data.message;
}
