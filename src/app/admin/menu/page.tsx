"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Loader2, Star, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface MenuItem { id: string; name: string; description?: string | null; price: number; imageUrl?: string | null; isAvailable: boolean; isPopular: boolean; sortOrder: number; }
interface Category { id: string; name: string; items: MenuItem[]; }

const emptyItem = { name: "", description: "", price: "", imageUrl: "", isAvailable: true, isPopular: false };

export default function MenuPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [itemDialog, setItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [newCatName, setNewCatName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/menu/categories");
    const data = await res.json();
    setCategories(data);
    if (data.length > 0 && !activeCategory) setActiveCategory(data[0].id);
    setLoading(false);
  }, [activeCategory]);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const activeCat = categories.find((c) => c.id === activeCategory);

  const openNewItem = () => { setEditingItem(null); setItemForm(emptyItem); setItemDialog(true); };
  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({ name: item.name, description: item.description || "", price: String(item.price), imageUrl: item.imageUrl || "", isAvailable: item.isAvailable, isPopular: item.isPopular });
    setItemDialog(true);
  };

  const saveItem = async () => {
    if (!itemForm.name || !itemForm.price) return;
    setSaving(true);
    const body = { ...itemForm, price: Number(itemForm.price), categoryId: activeCategory };
    if (editingItem) {
      await fetch(`/api/menu/items/${editingItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/menu/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    await loadCategories();
    setItemDialog(false);
    setSaving(false);
    toast({ title: editingItem ? "Güncellendi" : "Eklendi" });
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/menu/items/${id}`, { method: "DELETE" });
    await loadCategories();
    setDeleteDialog(null);
    toast({ title: "Silindi" });
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    await fetch("/api/menu/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName, sortOrder: categories.length }),
    });
    setNewCatName("");
    await loadCategories();
    toast({ title: "Kategori eklendi" });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menü Yönetimi</h1>
        <Button onClick={openNewItem} className="bg-orange-600 hover:bg-orange-700 gap-1" disabled={!activeCategory}>
          <Plus className="h-4 w-4" /> Ürün Ekle
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Categories sidebar */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 mb-3">
            <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Kategoriler</p>
            <div className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === c.id ? "bg-orange-600 text-white font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {c.name}
                  <span className="ml-1 opacity-60 text-xs">({c.items.length})</span>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
            <p className="text-xs text-gray-400 font-medium mb-2">Yeni Kategori</p>
            <Input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Kategori adı" className="mb-2 text-sm h-8" onKeyDown={(e) => e.key === "Enter" && addCategory()} />
            <Button onClick={addCategory} size="sm" className="w-full bg-orange-600 hover:bg-orange-700 h-8 text-xs gap-1">
              <Plus className="h-3 w-3" /> Ekle
            </Button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1">
          {activeCat ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-800">{activeCat.name}</h2>
              </div>
              {activeCat.items.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  Bu kategoride ürün yok. Eklemek için &ldquo;Ürün Ekle&rdquo; butonunu kullanın.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs border-b border-gray-50">
                      <th className="px-4 py-3 text-left font-medium">Ürün</th>
                      <th className="px-4 py-3 text-left font-medium">Fiyat</th>
                      <th className="px-4 py-3 text-left font-medium">Durum</th>
                      <th className="px-4 py-3 text-right font-medium">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activeCat.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            {item.isPopular && <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />}
                          </div>
                          {item.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>}
                        </td>
                        <td className="px-4 py-3 font-medium text-orange-600">₺{item.price}</td>
                        <td className="px-4 py-3">
                          {item.isAvailable ? (
                            <span className="text-green-600 text-xs flex items-center gap-1"><Eye className="h-3 w-3" />Aktif</span>
                          ) : (
                            <span className="text-gray-400 text-xs flex items-center gap-1"><EyeOff className="h-3 w-3" />Gizli</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditItem(item)} className="text-gray-400 hover:text-orange-600 transition-colors">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => setDeleteDialog(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
              Sol taraftan bir kategori seçin.
            </div>
          )}
        </div>
      </div>

      {/* Item dialog */}
      <Dialog open={itemDialog} onOpenChange={setItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Ürün Adı *</Label>
              <Input value={itemForm.name} onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))} className="mt-1" placeholder="Adana Kebap" />
            </div>
            <div>
              <Label>Açıklama</Label>
              <Textarea value={itemForm.description} onChange={(e) => setItemForm((p) => ({ ...p, description: e.target.value }))} className="mt-1" rows={2} placeholder="Kısa açıklama..." />
            </div>
            <div>
              <Label>Fiyat (₺) *</Label>
              <Input type="number" value={itemForm.price} onChange={(e) => setItemForm((p) => ({ ...p, price: e.target.value }))} className="mt-1" placeholder="0" min="0" step="0.5" />
            </div>
            <div>
              <Label>Görsel URL</Label>
              <Input value={itemForm.imageUrl} onChange={(e) => setItemForm((p) => ({ ...p, imageUrl: e.target.value }))} className="mt-1" placeholder="https://..." />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={itemForm.isAvailable} onCheckedChange={(v) => setItemForm((p) => ({ ...p, isAvailable: v }))} />
                <Label>Aktif (menüde görünsün)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={itemForm.isPopular} onCheckedChange={(v) => setItemForm((p) => ({ ...p, isPopular: v }))} />
                <Label>Popüler</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialog(false)}>İptal</Button>
            <Button onClick={saveItem} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingItem ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ürünü Sil</DialogTitle></DialogHeader>
          <p className="text-gray-600 text-sm">Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>İptal</Button>
            <Button onClick={() => deleteDialog && deleteItem(deleteDialog)} className="bg-red-600 hover:bg-red-700 text-white">Sil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
