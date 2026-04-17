"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight, ChevronLeft, Calendar, Clock, Users, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TimeSlotPicker from "./TimeSlotPicker";

const formSchema = z.object({
  customerName: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  customerPhone: z.string().min(10, "Geçerli telefon numarası girin"),
  customerEmail: z.string().email("Geçerli e-posta girin").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const STEPS = ["Tarih", "Saat", "Kişi", "Bilgiler"];

interface ReservationFormProps {
  restaurantId: string;
  maxGuests: number;
  maxAdvanceDays: number;
}

export default function ReservationForm({ restaurantId, maxGuests, maxAdvanceDays }: ReservationFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [guestCount, setGuestCount] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const today = new Date();
  const dates: { label: string; value: string; dayName: string }[] = [];
  const dayNames = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];
  const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

  for (let i = 0; i < maxAdvanceDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const val = d.toISOString().split("T")[0];
    const label = `${d.getDate()} ${monthNames[d.getMonth()]}`;
    const dayName = i === 0 ? "Bugün" : i === 1 ? "Yarın" : dayNames[d.getDay()];
    dates.push({ label, value: val, dayName });
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || undefined,
          notes: data.notes || undefined,
          guestCount,
          date: selectedDate,
          time: selectedTime,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Rezervasyon oluşturulamadı");
      router.push(
        `/rezervasyon/basarili?code=${result.confirmationCode}&date=${selectedDate}&time=${selectedTime}&guests=${guestCount}&name=${encodeURIComponent(data.customerName)}&phone=${encodeURIComponent(data.customerPhone)}`
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
              i < step ? "bg-green-500 text-white" : i === step ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-400"
            }`}>
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`ml-1.5 text-xs font-medium hidden sm:inline ${i === step ? "text-orange-600" : "text-gray-400"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-8 sm:w-12 h-0.5 mx-2 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Date */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-orange-600" />Tarih Seçin</h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
            {dates.map((d) => (
              <button
                key={d.value}
                onClick={() => { setSelectedDate(d.value); setSelectedTime(""); }}
                className={`flex flex-col items-center p-2.5 rounded-lg border text-center transition-all ${
                  selectedDate === d.value
                    ? "bg-orange-600 border-orange-600 text-white"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                <span className="text-xs font-medium">{d.dayName}</span>
                <span className="text-sm font-bold mt-0.5">{d.label}</span>
              </button>
            ))}
          </div>
          <Button onClick={() => setStep(1)} disabled={!selectedDate} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 gap-2">
            Devam Et <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 1: Time */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-orange-600" />Saat Seçin</h2>
          <TimeSlotPicker
            date={selectedDate}
            selected={selectedTime}
            onSelect={setSelectedTime}
          />
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setStep(0)} className="gap-1"><ChevronLeft className="h-4 w-4" />Geri</Button>
            <Button onClick={() => setStep(2)} disabled={!selectedTime} className="flex-1 bg-orange-600 hover:bg-orange-700 gap-2">
              Devam Et <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Guest count */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-orange-600" />Kişi Sayısı</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setGuestCount(n)}
                className={`py-3 rounded-lg border text-sm font-bold transition-all ${
                  guestCount === n
                    ? "bg-orange-600 border-orange-600 text-white"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">Seçilen: <span className="font-semibold text-orange-600">{guestCount} kişi</span></p>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-1"><ChevronLeft className="h-4 w-4" />Geri</Button>
            <Button onClick={() => setStep(3)} className="flex-1 bg-orange-600 hover:bg-orange-700 gap-2">
              Devam Et <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Contact info */}
      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><User className="h-5 w-5 text-orange-600" />İletişim Bilgileri</h2>

          {/* Summary */}
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-5 text-sm text-gray-700 space-y-1">
            <div className="flex gap-2"><Calendar className="h-4 w-4 text-orange-500" /><span>{selectedDate}</span></div>
            <div className="flex gap-2"><Clock className="h-4 w-4 text-orange-500" /><span>{selectedTime}</span></div>
            <div className="flex gap-2"><Users className="h-4 w-4 text-orange-500" /><span>{guestCount} kişi</span></div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Ad Soyad *</Label>
              <Input id="customerName" placeholder="Ahmet Yılmaz" className="mt-1" {...register("customerName")} />
              {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
            </div>
            <div>
              <Label htmlFor="customerPhone">Telefon *</Label>
              <Input id="customerPhone" placeholder="+90 555 123 4567" className="mt-1" {...register("customerPhone")} />
              {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>}
            </div>
            <div>
              <Label htmlFor="customerEmail">E-posta (opsiyonel)</Label>
              <Input id="customerEmail" type="email" placeholder="ahmet@example.com" className="mt-1" {...register("customerEmail")} />
              {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>}
            </div>
            <div>
              <Label htmlFor="notes">Not (opsiyonel)</Label>
              <Textarea id="notes" placeholder="Doğum günü kutlaması, pencere kenarı tercih..." className="mt-1" rows={3} {...register("notes")} />
            </div>
          </div>

          {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setStep(2)} className="gap-1"><ChevronLeft className="h-4 w-4" />Geri</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-orange-600 hover:bg-orange-700">
              {loading ? "Gönderiliyor..." : "Rezervasyon Yap"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
