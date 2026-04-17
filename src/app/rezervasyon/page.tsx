"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, User, Check } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";

const TURKISH_DAYS_SHORT = ["Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cmt"];
const TURKISH_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

function formatDateTR(date: Date) {
  return `${date.getDate()} ${TURKISH_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function toDateStr(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ReservasyonPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Calendar state
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [calMonth, setCalMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // Slots
  const [slots, setSlots] = useState<Array<{ time: string; isAvailable: boolean; isPast: boolean }>>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  // Calendar helpers
  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay();

  const fetchSlots = async (date: Date) => {
    setLoadingSlots(true);
    try {
      const dateStr = toDateStr(date);
      const res = await fetch(`/api/reservations/available-slots?date=${dateStr}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
    await fetchSlots(date);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !name || !phone) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: toDateStr(selectedDate),
          time: selectedTime,
          guestCount,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hata oluştu");

      router.push(`/rezervasyon/basarili?code=${data.confirmationCode}&date=${encodeURIComponent(formatDateTR(selectedDate))}&time=${selectedTime}&guests=${guestCount}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Rezervasyon oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { n: 1, label: "Tarih", icon: Calendar },
    { n: 2, label: "Saat", icon: Clock },
    { n: 3, label: "Kişi", icon: Users },
    { n: 4, label: "Bilgiler", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />

      <div className="max-w-2xl mx-auto px-4 py-10 w-full flex-1">
        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Rezervasyon Yap</h1>
          <p className="text-gray-500 text-sm">Masanızı kolayca ayırtın</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className={`flex flex-col items-center gap-1 cursor-pointer`} onClick={() => step > s.n && setStep(s.n)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step > s.n ? "bg-primary-600 border-primary-600 text-white" :
                  step === s.n ? "border-primary-600 text-primary-600 bg-white" :
                  "border-gray-200 text-gray-400 bg-white"
                }`}>
                  {step > s.n ? <Check className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s.n ? "text-primary-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 sm:w-20 h-0.5 mx-1 transition-colors ${step > s.n ? "bg-primary-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Step 1: Calendar */}
          {step === 1 && (
            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                Tarih Seçin
              </h2>
              <div className="select-none">
                {/* Month nav */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))}
                    disabled={calMonth <= new Date(today.getFullYear(), today.getMonth(), 1)}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-semibold text-gray-900">
                    {TURKISH_MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}
                  </span>
                  <button
                    onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {TURKISH_DAYS_SHORT.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
                    const isPast = date < today;
                    const isFuture = date > maxDate;
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isToday = date.toDateString() === today.toDateString();
                    const disabled = isPast || isFuture;

                    return (
                      <button
                        key={day}
                        disabled={disabled}
                        onClick={() => !disabled && handleDateSelect(date)}
                        className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                          isSelected ? "bg-primary-600 text-white shadow-sm" :
                          isToday ? "border-2 border-primary-300 text-primary-600 hover:bg-orange-50" :
                          disabled ? "text-gray-200 cursor-not-allowed" :
                          "text-gray-700 hover:bg-orange-50 hover:text-primary-600"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Time slots */}
          {step === 2 && (
            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                Saat Seçin
              </h2>
              {selectedDate && (
                <p className="text-sm text-gray-500 mb-5">{formatDateTR(selectedDate)}</p>
              )}
              {loadingSlots ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Saatler yükleniyor...
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.isAvailable}
                      onClick={() => { setSelectedTime(slot.time); setStep(3); }}
                      className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedTime === slot.time
                          ? "bg-primary-600 border-primary-600 text-white"
                          : !slot.isAvailable
                          ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                          : "border-gray-200 text-gray-700 hover:border-primary-400 hover:text-primary-600 hover:bg-orange-50"
                      }`}
                    >
                      {slot.time}
                      {!slot.isAvailable && !slot.isPast && (
                        <span className="block text-xs font-normal">Dolu</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setStep(1)} className="mt-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                <ChevronLeft className="w-4 h-4" /> Geri
              </button>
            </div>
          )}

          {/* Step 3: Guest count */}
          {step === 3 && (
            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-5 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                Kişi Sayısı
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setGuestCount(n)}
                    className={`aspect-square rounded-xl text-lg font-bold border-2 transition-all ${
                      guestCount === n
                        ? "bg-primary-600 border-primary-600 text-white shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-primary-400 hover:text-primary-600 hover:bg-orange-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                  <ChevronLeft className="w-4 h-4" /> Geri
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Devam Et <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Personal info */}
          {step === 4 && (
            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                Bilgileriniz
              </h2>

              {/* Summary */}
              <div className="bg-orange-50 rounded-xl p-4 mb-6 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-gray-500">Tarih</div>
                  <div className="font-semibold text-sm text-gray-900 mt-0.5">
                    {selectedDate ? formatDateTR(selectedDate) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Saat</div>
                  <div className="font-semibold text-sm text-gray-900 mt-0.5">{selectedTime}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Kişi</div>
                  <div className="font-semibold text-sm text-gray-900 mt-0.5">{guestCount} kişi</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 5xx xxx xx xx"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    E-posta <span className="text-gray-400 text-xs">(isteğe bağlı)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Notlar <span className="text-gray-400 text-xs">(isteğe bağlı)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Doğum günü kutlaması, allerji bilgisi vb."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-4">
                  <ChevronLeft className="w-4 h-4" /> Geri
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !name || !phone}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Rezervasyon Yap
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
