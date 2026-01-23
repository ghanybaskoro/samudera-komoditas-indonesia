"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"MEMBERS" | "PRODUCTS" | "SETTINGS">("MEMBERS"); // Tambah Tab Settings
  const [loading, setLoading] = useState(false);

  // Data State
  const [members, setMembers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // State Settings
  const [adminWa, setAdminWa] = useState("");

  // State untuk EDIT PRODUK
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State Produk
  const [formData, setFormData] = useState({
    title_id: "",
    title_en: "",
    desc_id: "",
    desc_en: "",
    moisture: "",
    origin: "Java, Indonesia",
    packaging_id: "",
    packaging_en: "",
    image_url: "",
  });

  // CEK LOGIN & FETCH DATA
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      setAuthorized(true);
      fetchMembers();
      fetchProducts();
      fetchSettings(); // Ambil nomor WA
    } else {
      window.location.href = "/login";
    }
  }, []);

  // --- FUNGSI FETCH DATA ---
  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").order("id", { ascending: false });
    setMembers(data || []);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: true });
    setProducts(data || []);
  };

  const fetchSettings = async () => {
    // Ambil nomor WA dari tabel app_settings
    const { data } = await supabase.from("app_settings").select("value").eq("key", "admin_wa").single();
    if (data) setAdminWa(data.value);
  };

  // --- FUNGSI UPDATE SETTINGS (WA) ---
  const handleUpdateWa = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("app_settings").upsert({ key: "admin_wa", value: adminWa }); // Upsert = Update jika ada, Insert jika belum

    if (error) alert("Gagal update nomor WA: " + error.message);
    else alert("Nomor WhatsApp berhasil diperbarui!");

    setLoading(false);
  };

  // --- FUNGSI EXPORT EXCEL ---
  const handleExportExcel = () => {
    if (members.length === 0) {
      alert("Data kosong");
      return;
    }
    const dataToExport = members.map((m) => ({
      ID: m.id,
      Tanggal: new Date(m.created_at).toLocaleDateString("id-ID"),
      Nama: m.nama_lengkap,
      Email: m.email,
      WA: m.no_wa,
      Alasan: m.alasan_bergabung,
      Status: m.status,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    XLSX.writeFile(wb, "Data_Anggota.xlsx");
  };

  const handleExportProducts = () => {
    if (products.length === 0) {
      alert("Data kosong");
      return;
    }
    const dataToExport = products.map((p) => ({
      ID: p.id,
      "Nama (ID)": p.title_id,
      Moisture: p.moisture,
      Origin: p.origin,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Katalog");
    XLSX.writeFile(wb, "Katalog_Produk.xlsx");
  };

  // --- LOGIC LAINNYA (Sama seperti sebelumnya) ---
  const handleApproveMember = async (id: number) => {
    if (!confirm("Setujui?")) return;
    await supabase.from("members").update({ status: "APPROVED" }).eq("id", id);
    fetchMembers();
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("Hapus?")) return;
    await supabase.from("members").delete().eq("id", id);
    fetchMembers();
  };

  const handleSubmitProduct = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      await supabase.from("products").update(formData).eq("id", editingId);
      alert("Updated!");
    } else {
      await supabase.from("products").insert([formData]);
      alert("Saved!");
    }
    setEditingId(null);
    setFormData({ title_id: "", title_en: "", desc_id: "", desc_en: "", moisture: "", origin: "Java, Indonesia", packaging_id: "", packaging_en: "", image_url: "" });
    fetchProducts();
    setLoading(false);
  };

  const handleEditClick = (p: any) => {
    setEditingId(p.id);
    setFormData({ ...p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Hapus?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };
  const resetForm = () => {
    setEditingId(null);
    setFormData({ title_id: "", title_en: "", desc_id: "", desc_en: "", moisture: "", origin: "Java, Indonesia", packaging_id: "", packaging_en: "", image_url: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
  };

  if (!authorized) return <div className="p-10 text-center">Memeriksa akses...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Dashboard Admin</h1>
            <p className="text-sm text-slate-500">Koperasi Samudera Komoditas Indonesia</p>
          </div>
          <button onClick={handleLogout} className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded font-medium hover:bg-red-100">
            Logout
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b border-slate-300">
          <button onClick={() => setActiveTab("MEMBERS")} className={`pb-2 px-4 font-bold transition ${activeTab === "MEMBERS" ? "text-blue-900 border-b-4 border-blue-900" : "text-slate-400"}`}>
            👥 Anggota
          </button>
          <button onClick={() => setActiveTab("PRODUCTS")} className={`pb-2 px-4 font-bold transition ${activeTab === "PRODUCTS" ? "text-blue-900 border-b-4 border-blue-900" : "text-slate-400"}`}>
            📦 Produk
          </button>
          <button onClick={() => setActiveTab("SETTINGS")} className={`pb-2 px-4 font-bold transition ${activeTab === "SETTINGS" ? "text-blue-900 border-b-4 border-blue-900" : "text-slate-400"}`}>
            ⚙️ Pengaturan
          </button>
        </div>

        {/* === TAB: MEMBERS === */}
        {activeTab === "MEMBERS" && (
          <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex justify-between">
              <h3 className="font-bold text-gray-700">Data Anggota</h3>
              <button onClick={handleExportExcel} className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">
                Download Excel
              </button>
            </div>
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-slate-100 uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Kontak</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-3 font-bold">{m.nama_lengkap}</td>
                    <td className="px-4 py-3">
                      {m.email}
                      <br />
                      {m.no_wa}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.status === "APPROVED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{m.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {m.status === "PENDING" && (
                        <button onClick={() => handleApproveMember(m.id)} className="text-green-600 font-bold mr-2">
                          Approve
                        </button>
                      )}
                      <button onClick={() => handleDeleteMember(m.id)} className="text-red-600 font-bold">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* === TAB: PRODUCTS === */}
        {activeTab === "PRODUCTS" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow border h-fit">
              <h2 className="font-bold text-lg mb-4 text-blue-900">{editingId ? "Edit Produk" : "Tambah Produk"}</h2>
              <form onSubmit={handleSubmitProduct} className="space-y-3">
                <input className="border p-2 w-full rounded text-slate-900" placeholder="Nama (ID)" value={formData.title_id} onChange={(e) => setFormData({ ...formData, title_id: e.target.value })} required />
                <input className="border p-2 w-full rounded text-slate-900" placeholder="Name (EN)" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required />
                <textarea className="border p-2 w-full rounded text-slate-900" placeholder="Deskripsi (ID)" rows={2} value={formData.desc_id} onChange={(e) => setFormData({ ...formData, desc_id: e.target.value })} required />
                <textarea className="border p-2 w-full rounded text-slate-900" placeholder="Desc (EN)" rows={2} value={formData.desc_en} onChange={(e) => setFormData({ ...formData, desc_en: e.target.value })} required />
                <div className="grid grid-cols-2 gap-2">
                  <input className="border p-2 w-full rounded text-slate-900" placeholder="Moisture" value={formData.moisture} onChange={(e) => setFormData({ ...formData, moisture: e.target.value })} required />
                  <input className="border p-2 w-full rounded text-slate-900" placeholder="Origin" value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="border p-2 w-full rounded text-slate-900" placeholder="Kemasan (ID)" value={formData.packaging_id} onChange={(e) => setFormData({ ...formData, packaging_id: e.target.value })} required />
                  <input className="border p-2 w-full rounded text-slate-900" placeholder="Pack (EN)" value={formData.packaging_en} onChange={(e) => setFormData({ ...formData, packaging_en: e.target.value })} required />
                </div>
                <input className="border p-2 w-full rounded text-slate-900" placeholder="URL Gambar" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
                <div className="flex gap-2">
                  <button className="bg-blue-900 text-white w-full py-2 rounded font-bold">{editingId ? "Update" : "Simpan"}</button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 w-1/3 rounded">
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-3">
              <div className="flex justify-between bg-white p-3 rounded shadow-sm border">
                <h3 className="font-bold">List Produk</h3>
                <button onClick={handleExportProducts} className="text-green-600 font-bold text-sm">
                  Download Excel
                </button>
              </div>
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded shadow-sm border flex justify-between">
                  <div>
                    <h4 className="font-bold text-blue-900">{p.title_id}</h4>
                    <p className="text-xs text-gray-500">
                      {p.moisture} | {p.origin}
                    </p>
                  </div>
                  <div>
                    <button onClick={() => handleEditClick(p)} className="text-blue-600 mr-3">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === TAB: SETTINGS (BARU) === */}
        {activeTab === "SETTINGS" && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Pengaturan Kontak Pemesanan</h2>
            <form onSubmit={handleUpdateWa}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp Admin (Untuk Order)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-bold">📞</span>
                <input
                  type="text"
                  required
                  className="w-full pl-10 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="Contoh: 628123456789 (Gunakan kode negara 62)"
                  value={adminWa}
                  onChange={(e) => setAdminWa(e.target.value.replace(/[^0-9]/g, ""))} // Hanya boleh angka
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 mb-6">*Nomor ini akan digunakan sebagai tujuan link "Order" di halaman Katalog Produk. Pastikan menggunakan format internasional (62...) tanpa tanda plus (+).</p>
              <button disabled={loading} className="w-full bg-blue-900 text-white font-bold py-3 rounded hover:bg-blue-800 transition">
                {loading ? "Menyimpan..." : "Simpan Nomor Baru"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
