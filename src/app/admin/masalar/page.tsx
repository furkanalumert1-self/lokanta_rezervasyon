"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, QrCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import QRCodeCard from "@/components/QRCodeCard";
import { LOCATION_LABELS } from "@/lib/constants";

interface Table { id: string; name: string; capacity: number; location: string; isActive: boolean; }

const emptyForm = { name: "", capacity: "2", location: "ic-mekan" };

export default function MasalarPage() {
  const { toast } = useToast();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/tables");
    if (res.ok) setTables(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTable = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
    });
    await load();
    setDialog(false);
    setForm(emptyForm);
    setSaving(false);
    toast({ title: "Masa eklendi" });
  };

  const toggleActive = async (table: Table) => {
    await fetch(`/api/tables/${table.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...table, isActive: !table.isActive }),
    });
    await load();
  };

  const deleteTable = async (id: string) => {
    await fetch(`/api/tables/${id}`, { method: "DELETE" });
    await load();
    setDeleteId(null);
    toast({ title: "Masa silindi" });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>;

  const totalCapacity = tables.filter((t) => t.isActive).reduce((sum, t) => sum + t.capacity, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Masalar & QR Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam aktif kapasite: <span className="font-semibold text-orange-600">{totalCapacity} kişi</span></p>
        </div>
        <Button onClick={() => setDialog(true)} className="bg-orange-600 hover:bg-orange-700 gap-1">
          <Plus className="h-4 w-4" /> Masa Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div key={table.id} className={`bg-white rounded-xl border shadow-sm p-5 ${table.isActive ? "border-gray-100" : "border-gray-200 opacity-60"}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{table.name}</h3>
                <p className="text-sm text-gray-500">{LOCATION_LABELS[table.location as keyof typeof LOCATION_LABELS] || table.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={table.isActive} onCheckedChange={() => toggleActive(table)} />
                <button onClick={() => setDeleteId(table.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {table.capacity} kişilik
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${table.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {table.isActive ? "Aktif" : "Pasif"}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><QrCode className="h-3.5 w-3.5" />QR Kod</p>
              <QRCodeCard tableId={table.id} tableName={table.name} />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Yeni Masa Ekle</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Masa Adı *</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1" placeholder="Masa 1, Bahçe 1..." />
            </div>
            <div>
              <Label>Kapasite</Label>
              <Input type="number" value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} className="mt-1" min="1" max="20" />
            </div>
            <div>
              <Label>Konum</Label>
              <Select value={form.location} onValueChange={(v) => setForm((p) => ({ ...p, location: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ic-mekan">İç Mekan</SelectItem>
                  <SelectItem value="bahce">Bahçe</SelectItem>
                  <SelectItem value="teras">Teras</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>İptal</Button>
            <Button onClick={addTable} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Masayı Sil</DialogTitle></DialogHeader>
          <p className="text-gray-600 text-sm">Bu masayı silmek istediğinizden emin misiniz?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>İptal</Button>
            <Button onClick={() => deleteId && deleteTable(deleteId)} className="bg-red-600 hover:bg-red-700 text-white">Sil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
