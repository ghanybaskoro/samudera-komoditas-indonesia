"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DaftarPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    wa: "",
    alasan: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("members").insert([
      {
        nama_lengkap: formData.nama,
        email: formData.email,
        no_wa: formData.wa,
        alasan_bergabung: formData.alasan,
        password: formData.password,
      },
    ]);

    if (error) {
      setMessage("Gagal mendaftar: " + error.message);
    } else {
      alert("Pendaftaran berhasil! Silakan Login.");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">Daftar Anggota</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAMA LENGKAP */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Nama Lengkap</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-gray-400"
              placeholder="Sesuai KTP"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-gray-400"
              placeholder="contoh@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-gray-400"
              placeholder="Buat kata sandi rahasia"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* WHATSAPP */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">No. WhatsApp</label>
            <input
              type="tel"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-gray-400"
              placeholder="0812..."
              value={formData.wa}
              onChange={(e) => setFormData({ ...formData, wa: e.target.value })}
            />
          </div>

          {/* ALASAN BERGABUNG */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Alasan Bergabung</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-gray-400"
              rows={3}
              placeholder="Ceritakan ketertarikan Anda pada komoditas..."
              value={formData.alasan}
              onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white font-bold py-3 rounded hover:bg-blue-800 transition disabled:opacity-50">
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>

          {message && <p className="text-center text-red-500 mt-4">{message}</p>}
        </form>
      </div>
    </main>
  );
}
