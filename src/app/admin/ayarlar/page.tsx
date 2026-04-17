"use client";
import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface RestaurantSettings {
  name: string; phone: string; address: string; description: string;
  openingTime: string; closingTime: string; slotDuration: number; maxGuests: number; maxAdvanceDays: number;
}

export default function AyarlarPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<RestaurantSettings>({
    name: "", phone: "", address: "", description: "",
    openingTime: "09:00", closingTime: "23:00", slotDuration: 90, maxGuests: 12, maxAdvanceDays: 30,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/restaurant").then((r) => r.json()).then((data) => {
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        openingTime: data.openingTime || "09:00",
        closingTime: data.closingTime || "23:00",
        slotDuration: data.slotDuration || 90,
        maxGuests: data.maxGuests || 12,
        maxAdvanceDays: data.maxAdvanceDays || 30,
      });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/restaurant", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      toast({ title: "Ayarlar kaydedildi!" });
    } else {
      toast({ title: "Hata oluştu", variant: "destructive" });
    }
  };

  const set = (key: keyof RestaurantSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Restoran Ayarları</h1>
      </div>

      <div className="space-y-6">
        {/* Restoran Bilgileri */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Restoran Bilgileri</h2>
          <div>
            <Label>Restoran Adı *</Label>
            <Input value={form.name} onChange={set("name")} className="mt-1" />
          </div>
          <div>
            <Label>Telefon *</Label>
            <Input value={form.phone} onChange={set("phone")} className="mt-1" placeholder="+905551234567" />
          </div>
          <div>
            <Label>Adres *</Label>
            <Textarea value={form.address} onChange={set("address")} className="mt-1" rows={2} />
          </div>
          <div>
            <Label>Açıklama</Label>
            <Textarea value={form.description} onChange={set("description")} className="mt-1" rows={2} />
          </div>
        </div>

        {/* Çalışma Saatleri */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Çalışma Saatleri & Rezervasyon</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Açılış Saati</Label>
              <Input type="time" value={form.openingTime} onChange={set("openingTime")} className="mt-1" />
            </div>
            <div>
              <Label>Kapanış Saati</Label>
              <Input type="time" value={form.closingTime} onChange={set("closingTime")} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Slot Süresi (dakika)</Label>
            <Input
              type="number"
              value={form.slotDuration}
              onChange={(e) => setForm((p) => ({ ...p, slotDuration: Number(e.target.value) }))}
              className="mt-1"
              min="30"
              max="240"
              step="30"
            />
            <p className="text-xs text-gray-400 mt-1">Her rezervasyonun minimum süresi</p>
          </div>
          <div>
            <Label>Maksimum Kişi Sayısı</Label>
            <Input
              type="number"
              value={form.maxGuests}
              onChange={(e) => setForm((p) => ({ ...p, maxGuests: Number(e.target.value) }))}
              className="mt-1"
              min="1"
              max="50"
            />
          </div>
          <div>
            <Label>İleri Rezervasyon (gün)</Label>
            <Input
              type="number"
              value={form.maxAdvanceDays}
              onChange={(e) => setForm((p) => ({ ...p, maxAdvanceDays: Number(e.target.value) }))}
              className="mt-1"
              min="1"
              max="365"
            />
            <p className="text-xs text-gray-400 mt-1">Kaç gün öncesine kadar rezervasyon yapılabilsin</p>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full bg-orange-600 hover:bg-orange-700 gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Ayarları Kaydet
        </Button>
      </div>
    </div>
  );
}
