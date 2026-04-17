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
  return `Merhaba ${data.customerName}! 🎉

${data.restaurantName} rezervasyonunuz onaylandı.

📅 Tarih: ${data.date}
🕐 Saat: ${data.time}
👥 Kişi: ${data.guests}
🎫 Onay Kodu: ${data.code}

Değişiklik veya iptal için bu mesajı yanıtlayabilirsiniz.

Hoşgeldiniz! 🍽️`;
}

export function getReminderMessage(data: {
  customerName: string;
  restaurantName: string;
  time: string;
  guests: number;
  code: string;
}) {
  return `Merhaba ${data.customerName}! 👋

Yarın saat ${data.time}'da ${data.restaurantName} rezervasyonunuz var.

👥 ${data.guests} kişi
🎫 Kod: ${data.code}

Sizi bekliyoruz! 🍽️`;
}

export function getCancellationMessage(data: {
  customerName: string;
  date: string;
  reservationUrl: string;
}) {
  return `Merhaba ${data.customerName},

${data.date} tarihli rezervasyonunuz iptal edilmiştir.

Yeni rezervasyon için: ${data.reservationUrl}

İyi günler dileriz. 🙏`;
}
