"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface TimeSlotPickerProps {
  date: string;
  selected: string;
  onSelect: (time: string) => void;
}

interface SlotData {
  time: string;
  available: boolean;
}

export default function TimeSlotPicker({ date, selected, onSelect }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    fetch(`/api/reservations/available-slots?date=${date}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [date]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-500 text-sm">Müsait saatler yükleniyor...</span>
      </div>
    );
  }

  if (!slots.length) {
    return <p className="text-center text-gray-500 py-8 text-sm">Bu tarih için müsait saat bulunamadı.</p>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map(({ time, available }) => (
        <button
          key={time}
          disabled={!available}
          onClick={() => available && onSelect(time)}
          className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
            selected === time
              ? "bg-orange-600 border-orange-600 text-white"
              : available
              ? "border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700"
              : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
