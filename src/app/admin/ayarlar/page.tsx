"use client";

import { useEffect, useState } from "react";
import { Save, Settings } from "lucide-react";

type Restaurant = {
  name: string;
  phone: string;
  address: string;
  description?: string | null;
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  maxGuests: number;
  maxAdvanceDays: number;
};

export default function AyarlarPage() {
  const [form, setForm] = useState<Restaurant>({
    name: "",
    phone: "",
    address: "",
    description: "",
    openingTime: "09:00",
    closingTime: "23:00",
    slotDuration: 90,
    maxGuests: 12,
    maxAdvanceDays: 30,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/restaurant").then((r) => r.json()).then((data) => {
      setForm({
        name: data.name,
        phone: data.phone,
        address: data.address,
        description: data.description || "",
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        slotDuration: data.slotDuration,
        maxGuests: data.maxGuests,
        maxAdvanceDays: data.maxAdvanceDays,
      });
    }).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/restaurant", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  const fields = [
    { key: "name", label: "Restoran Adı", type: "text", required: true },
    { key: "phone", label: "Telefon", type: "tel", required: true },
    { key: "address", label: "Adres", type: "text", required: true },
    { key: "description", label: "Açıklama", type: "textarea" },
    { key: "openingTime", label: "Açılış Saati", type: "time" },
    { key: "closingTime", label: "Kapanış Saati", type: "time" },
    { key: "slotDuration", label: "Slot Süresi (dakika)", type: "number" },
    { key: "maxGuests", label: "Maksimum Misafir", type: "number" },
    { key: "maxAdvanceDays", label: "İleri Rezervasyon Günü", type: "number" },
  ];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-primary-600" />
        <h1 className="font-display text-2xl font-bold text-gray-900">Restoran Ayarları</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="space-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={(form[field.key as keyof Restaurant] as string) || ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              ) : (
                <input
                  type={field.type}
                  value={(form[field.key as keyof Restaurant] as string | number) || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field.key]: field.type === "number" ? parseInt(e.target.value) : e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Kaydediliyor..." : saved ? "✓ Kaydedildi" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
