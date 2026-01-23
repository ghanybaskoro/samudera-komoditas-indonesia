"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ANGGOTA" | "ADMIN">("ANGGOTA");

  // State Form Anggota
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State Form Admin
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  const [loading, setLoading] = useState(false);

  // -- LOGIC LOGIN ADMIN --
  const handleAdminLogin = (e: any) => {
    e.preventDefault();

    // Login Admin Sederhana
    if (adminUser === "admin" && adminPass === "123456") {
      localStorage.setItem("isAdmin", "true");
      // Refresh halaman agar Navbar berubah
      window.location.href = "/admin";
    } else {
      alert("Username atau Password Admin Salah!");
    }
  };

  // -- LOGIC LOGIN ANGGOTA --
  const handleMemberLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // Cek Database
    const { data, error } = await supabase.from("members").select("*").eq("email", email).eq("password", password).single();

    if (error || !data) {
      alert("Email atau Password salah!");
    } else {
      // Simpan data sesi lengkap
      localStorage.setItem("userName", data.nama_lengkap);
      localStorage.setItem("userStatus", data.status);

      alert(`Selamat datang, ${data.nama_lengkap}!`);
      // Refresh halaman agar Navbar berubah
      window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        {/* TAB HEADER */}
        <div className="flex border-b">
          <button onClick={() => setActiveTab("ANGGOTA")} className={`flex-1 py-4 font-bold text-center transition ${activeTab === "ANGGOTA" ? "bg-blue-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            Login Anggota
          </button>
          <button onClick={() => setActiveTab("ADMIN")} className={`flex-1 py-4 font-bold text-center transition ${activeTab === "ADMIN" ? "bg-blue-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            Login Admin
          </button>
        </div>

        {/* FORM CONTENT */}
        <div className="p-8">
          {activeTab === "ANGGOTA" ? (
            // --- FORM ANGGOTA ---
            <form onSubmit={handleMemberLogin} className="space-y-4">
              <h2 className="text-xl font-bold text-center mb-6 text-gray-700">Masuk sebagai Anggota</h2>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input type="email" required className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none text-slate-900" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Password</label>
                <input type="password" required className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none text-slate-900" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded font-bold hover:bg-blue-800 transition">
                {loading ? "Memuat..." : "Masuk Sekarang"}
              </button>
            </form>
          ) : (
            // --- FORM ADMIN ---
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <h2 className="text-xl font-bold text-center mb-6 text-gray-700">Akses Pengurus Koperasi</h2>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Username Admin</label>
                <input
                  type="text"
                  required
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 placeholder:text-gray-400"
                  placeholder="Masukkan username"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Password Admin</label>
                <input
                  type="password"
                  required
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 placeholder:text-gray-400"
                  placeholder="Masukkan password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
              </div>
              <button className="w-full bg-orange-600 text-white py-3 rounded font-bold hover:bg-orange-700 transition">Masuk Dashboard</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
