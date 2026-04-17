"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, QrCode, Users, MapPin } from "lucide-react";
import QRCodeCard from "@/components/QRCodeCard";
import { TABLE_LOCATIONS } from "@/lib/constants";

type Table = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  isActive: boolean;
};

export default function MasalarPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", capacity: 4, location: "ic-mekan" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchTables = async () => {
    const res = await fetch("/api/tables");
    const data = await res.json();
    setTables(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchTables(); }, []);

  const addTable = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowAdd(false);
    setForm({ name: "", capacity: 4, location: "ic-mekan" });
    fetchTables();
  };

  const toggleActive = async (table: Table) => {
    await fetch(`/api/tables/${table.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...table, isActive: !table.isActive }),
    });
    fetchTables();
  };

  const deleteTable = async (id: string) => {
    await fetch(`/api/tables/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    fetchTables();
  };

  const locationGroups = Object.entries(TABLE_LOCATIONS).map(([key, label]) => ({
    key,
    label,
    tables: tables.filter((t) => t.location === key),
  })).filter((g) => g.tables.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Masa & QR Yönetimi</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Masa Ekle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
      ) : (
        <div className="space-y-8">
          {locationGroups.map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary-600" />
                <h2 className="font-semibold text-gray-700">{group.label}</h2>
                <span className="text-xs text-gray-400">({group.tables.length} masa)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.tables.map((table) => (
                  <div
                    key={table.id}
                    className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                      table.isActive ? "border-gray-100" : "border-gray-100 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{table.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                          <Users className="w-3.5 h-3.5" />
                          {table.capacity} kişi
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(table)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                            table.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {table.isActive ? "Aktif" : "Pasif"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(table.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-3">
                      <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5" />
                        QR Kod
                      </p>
                      <QRCodeCard tableId={table.id} tableName={table.name} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add table modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg mb-5">Yeni Masa</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Masa Adı *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Masa 9"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Kapasite</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Konum</label>
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  {Object.entries(TABLE_LOCATIONS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={addTable}
                disabled={saving}
                className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? "Ekleniyor..." : "Masa Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <h3 className="font-bold text-gray-900 mb-2">Masayı Sil</h3>
            <p className="text-gray-500 text-sm mb-6">Bu masayı silmek istediğinizden emin misiniz?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm">İptal</button>
              <button onClick={() => deleteTable(deleteConfirm)} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600">Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
