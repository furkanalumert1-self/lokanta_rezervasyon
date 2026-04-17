"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronRight, Flame } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type MenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  isPopular: boolean;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
  items: MenuItem[];
};

const emptyItem = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  isAvailable: true,
  isPopular: false,
  categoryId: "",
};

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<MenuItem> | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchMenu = async () => {
    setLoading(true);
    const res = await fetch("/api/menu/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchMenu(); }, []);
  useEffect(() => {
    if (categories.length && !selectedCat) setSelectedCat(categories[0].id);
  }, [categories]);

  const currentItems = categories.find((c) => c.id === selectedCat)?.items || [];

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    await fetch("/api/menu/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName }),
    });
    setNewCatName("");
    fetchMenu();
  };

  const deleteCategory = async (id: string) => {
    await fetch(`/api/menu/categories?id=${id}`, { method: "DELETE" });
    if (selectedCat === id) setSelectedCat("");
    fetchMenu();
  };

  const saveItem = async () => {
    if (!editItem || !editItem.name || !editItem.categoryId) return;
    setSaving(true);

    if (isNewItem) {
      await fetch("/api/menu/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editItem, price: Number(editItem.price) }),
      });
    } else {
      await fetch(`/api/menu/items/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editItem, price: Number(editItem.price) }),
      });
    }

    setSaving(false);
    setEditItem(null);
    fetchMenu();
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/menu/items/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    fetchMenu();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Menü Yönetimi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm">Kategoriler</h2>
          <div className="space-y-1 mb-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                  selectedCat === cat.id ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => setSelectedCat(cat.id)}
              >
                <div className="flex items-center gap-2">
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedCat === cat.id ? "rotate-90" : ""}`} />
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-xs text-gray-400">({cat.items.length})</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}
                  className="p-1 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add category */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="Yeni kategori..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button onClick={addCategory} className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Items list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700 text-sm">
              {categories.find((c) => c.id === selectedCat)?.name || "Kategori Seçin"}
            </h2>
            {selectedCat && (
              <button
                onClick={() => { setIsNewItem(true); setEditItem({ ...emptyItem, categoryId: selectedCat }); }}
                className="flex items-center gap-1 text-sm bg-primary-600 text-white px-3 py-2 rounded-xl hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ürün Ekle
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-400">Yükleniyor...</div>
          ) : currentItems.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">Bu kategoride ürün yok</div>
          ) : (
            <div className="space-y-2">
              {currentItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                      {item.isPopular && <Flame className="w-3.5 h-3.5 text-orange-500" />}
                      {!item.isAvailable && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Pasif</span>}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>
                    )}
                  </div>
                  <span className="font-semibold text-primary-600 text-sm shrink-0">{formatPrice(item.price)}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setIsNewItem(false); setEditItem({ ...item }); }}
                      className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-400"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-gray-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Item Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-gray-900 mb-5">
              {isNewItem ? "Yeni Ürün" : "Ürün Düzenle"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">İsim *</label>
                <input
                  type="text"
                  value={editItem.name || ""}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Açıklama</label>
                <textarea
                  value={editItem.description || ""}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fiyat (₺) *</label>
                <input
                  type="number"
                  value={editItem.price || 0}
                  onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Görsel URL</label>
                <input
                  type="url"
                  value={editItem.imageUrl || ""}
                  onChange={(e) => setEditItem({ ...editItem, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editItem.isPopular}
                    onChange={(e) => setEditItem({ ...editItem, isPopular: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  Popüler
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editItem.isAvailable}
                    onChange={(e) => setEditItem({ ...editItem, isAvailable: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  Aktif
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditItem(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={saveItem}
                disabled={saving}
                className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Ürünü Sil</h3>
            <p className="text-gray-500 text-sm mb-6">Bu ürünü silmek istediğinizden emin misiniz?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">İptal</button>
              <button onClick={() => deleteItem(deleteConfirm)} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600">Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
