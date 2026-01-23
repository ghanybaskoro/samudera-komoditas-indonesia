"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"MEMBERS" | "PRODUCTS">("MEMBERS");
  const [loading, setLoading] = useState(false);

  // Data State
  const [members, setMembers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // State untuk EDIT PRODUK
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
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

  // CEK LOGIN
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      setAuthorized(true);
      fetchMembers();
      fetchProducts();
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

  // --- FUNGSI EXPORT MEMBER (Excel) ---
  const handleExportExcel = () => {
    if (members.length === 0) {
      alert("Tidak ada data anggota untuk diexport.");
      return;
    }
    const dataToExport = members.map((m) => ({
      ID: m.id,
      "Tanggal Daftar": new Date(m.created_at).toLocaleDateString("id-ID"),
      "Nama Lengkap": m.nama_lengkap,
      Email: m.email,
      WhatsApp: m.no_wa,
      "Alasan Bergabung": m.alasan_bergabung,
      Status: m.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Anggota");
    XLSX.writeFile(workbook, "Data_Anggota_Koperasi.xlsx");
  };

  // --- FUNGSI EXPORT PRODUK (Excel) - BARU ---
  const handleExportProducts = () => {
    if (products.length === 0) {
      alert("Tidak ada produk untuk diexport.");
      return;
    }
    const dataToExport = products.map((p) => ({
      ID: p.id,
      "Nama (ID)": p.title_id,
      "Name (EN)": p.title_en,
      "Deskripsi (ID)": p.desc_id,
      "Description (EN)": p.desc_en,
      Moisture: p.moisture,
      Origin: p.origin,
      "Kemasan (ID)": p.packaging_id,
      "Packaging (EN)": p.packaging_en,
      "Image URL": p.image_url,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Katalog Produk");
    XLSX.writeFile(workbook, "Katalog_Produk_SKI.xlsx");
  };

  // --- LOGIC MEMBER ---
  const handleApproveMember = async (id: number) => {
    if (!confirm("Setujui anggota ini?")) return;
    await supabase.from("members").update({ status: "APPROVED" }).eq("id", id);
    fetchMembers();
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("Hapus data ini permanen?")) return;
    await supabase.from("members").delete().eq("id", id);
    fetchMembers();
  };

  // --- LOGIC PRODUK (CRUD) ---
  const resetForm = () => {
    setEditingId(null);
    setFormData({
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
  };

  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setFormData({
      title_id: product.title_id,
      title_en: product.title_en,
      desc_id: product.desc_id,
      desc_en: product.desc_en,
      moisture: product.moisture,
      origin: product.origin,
      packaging_id: product.packaging_id,
      packaging_en: product.packaging_en,
      image_url: product.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitProduct = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      const { error } = await supabase.from("products").update(formData).eq("id", editingId);
      if (error) alert("Gagal update: " + error.message);
      else {
        alert("Produk berhasil diperbarui!");
        resetForm();
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert([formData]);
      if (error) alert("Gagal tambah: " + error.message);
      else {
        alert("Produk baru ditambahkan!");
        resetForm();
        fetchProducts();
      }
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Hapus produk ini dari katalog?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
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
            👥 Kelola Anggota
          </button>
          <button onClick={() => setActiveTab("PRODUCTS")} className={`pb-2 px-4 font-bold transition ${activeTab === "PRODUCTS" ? "text-blue-900 border-b-4 border-blue-900" : "text-slate-400"}`}>
            📦 Kelola Produk
          </button>
        </div>

        {/* === TAB: MEMBERS === */}
        {activeTab === "MEMBERS" && (
          <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-gray-700">Daftar Pendaftar</h3>
              <button onClick={handleExportExcel} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 flex items-center gap-2 shadow-sm transition">
                📊 Download Excel
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 uppercase font-semibold text-slate-500 border-b">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nama & Kontak</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">#{m.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{m.nama_lengkap}</div>
                      <div className="text-xs text-slate-500">
                        {m.email} | {m.no_wa}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{m.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right gap-2 flex justify-end">
                      {m.status === "PENDING" && (
                        <button onClick={() => handleApproveMember(m.id)} className="text-green-600 bg-green-50 px-2 py-1 rounded font-bold text-xs">
                          Approve
                        </button>
                      )}
                      <button onClick={() => handleDeleteMember(m.id)} className="text-red-600 bg-red-50 px-2 py-1 rounded font-bold text-xs">
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
          <div className="space-y-4">
            {/* HEADER TOOLBAR PRODUK */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-gray-700">Manajemen Katalog</h3>
              <button onClick={handleExportProducts} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 flex items-center gap-2 shadow-sm transition">
                📊 Download Katalog (Excel)
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* FORM INPUT (KIRI) */}
              <div className="lg:col-span-1">
                <div className={`bg-white p-6 rounded-xl shadow border sticky top-6 ${editingId ? "border-orange-300 ring-2 ring-orange-100" : "border-slate-200"}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`font-bold text-lg ${editingId ? "text-orange-600" : "text-blue-900"}`}>{editingId ? "✏️ Edit Produk" : "➕ Tambah Produk"}</h2>
                    {editingId && (
                      <button onClick={resetForm} className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">
                        Batal
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmitProduct} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nama (ID)"
                        required
                        className="border p-2 rounded text-sm w-full text-slate-900 placeholder:text-gray-400"
                        value={formData.title_id}
                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Name (EN)"
                        required
                        className="border p-2 rounded text-sm w-full text-slate-900 placeholder:text-gray-400"
                        value={formData.title_en}
                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      />
                    </div>

                    <textarea
                      placeholder="Deskripsi (Indonesia)"
                      required
                      className="border p-2 rounded text-sm w-full text-slate-900 placeholder:text-gray-400"
                      rows={2}
                      value={formData.desc_id}
                      onChange={(e) => setFormData({ ...formData, desc_id: e.target.value })}
                    />
                    <textarea
                      placeholder="Description (English)"
                      required
                      className="border p-2 rounded text-sm w-full text-slate-900 placeholder:text-gray-400"
                      rows={2}
                      value={formData.desc_en}
                      onChange={(e) => setFormData({ ...formData, desc_en: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Moisture"
                        required
                        className="border p-2 rounded text-sm w-full text-slate-900 placeholder:text-gray-400"
                        value={formData.moisture}
                        onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Origin"
                        required
                        className="border p-2 rounded text-sm w-full text-slate-900 placeholder:text-gray-400"
                        value={formData.origin}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Kemasan (ID)"
                        required
                        className="border p-2 rounded text-sm w-full text-slate-900 placeholder:text-gray-400"
                        value={formData.packaging_id}
                        onChange={(e) => setFormData({ ...formData, packaging_id: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Packaging (EN)"
                        required
                        className="border p-2 rounded text-sm w-full text-slate-900 placeholder:text-gray-400"
                        value={formData.packaging_en}
                        onChange={(e) => setFormData({ ...formData, packaging_en: e.target.value })}
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="URL Gambar (Opsional)"
                      className="border p-2 rounded text-sm w-full text-slate-900 placeholder:text-gray-400"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />

                    <button disabled={loading} className={`w-full text-white py-2 rounded font-bold transition ${editingId ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-900 hover:bg-blue-800"}`}>
                      {loading ? "Menyimpan..." : editingId ? "Update Perubahan" : "Simpan Produk"}
                    </button>
                  </form>
                </div>
              </div>

              {/* LIST PRODUK (KANAN) */}
              <div className="lg:col-span-2 space-y-4">
                {products.map((p) => (
                  <div key={p.id} className={`bg-white p-4 rounded-xl shadow-sm border flex justify-between items-start transition ${editingId === p.id ? "border-orange-500 ring-1 ring-orange-200 bg-orange-50" : "border-slate-200"}`}>
                    <div className="flex-1">
                      <h3 className="font-bold text-blue-900">
                        {p.title_id} <span className="text-slate-400 font-normal">| {p.title_en}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.desc_id}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">💧 {p.moisture}</span>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">📦 {p.packaging_id}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleEditClick(p)} className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100 transition" title="Edit Produk">
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100 transition" title="Hapus Produk">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && <p className="text-center text-gray-400 py-10">Belum ada produk di katalog.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
