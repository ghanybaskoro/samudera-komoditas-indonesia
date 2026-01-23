"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // IMPORT BARU: Untuk menampilkan logo
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      setUser("Administrator");
      return;
    }

    const userName = localStorage.getItem("userName");
    const userStatus = localStorage.getItem("userStatus");

    if (userName) {
      setUser(userName);
      setStatus(userStatus);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    localStorage.removeItem("userStatus");

    setUser(null);
    setStatus(null);
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* BAGIAN KIRI: LOGO & NAMA */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
          {/* Pastikan file 'logo.png' sudah ada di folder public */}
          <Image src="/logo.png" alt="Logo SKI" fill className="object-contain" priority />
        </div>
        <div className="leading-tight">
          <p className="text-[10px] text-gray-500 font-medium tracking-wider">Koperasi</p>
          <h1 className="text-lg font-bold text-blue-900 group-hover:text-blue-700 transition">Samudera Komoditas Indonesia</h1>
        </div>
      </Link>

      {/* BAGIAN KANAN: MENU USER */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-gray-600 hover:text-blue-900 text-sm font-medium">
          Home
        </Link>

        {/* --- TAMBAHAN BARU: MENU PRODUK --- */}
        <Link href="/produk" className="text-gray-600 hover:text-blue-900 text-sm font-medium">
          Products
        </Link>
        {/* ---------------------------------- */}

        {/* ... sisa kode login/user profile ... */}

        {user ? (
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-blue-900 font-bold hover:text-blue-700 transition">
              <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold shadow-sm">{user.charAt(0).toUpperCase()}</div>
              <span className="hidden md:block text-sm">{user}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
                {user !== "Administrator" && status && (
                  <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Status Keanggotaan</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                        status === "APPROVED" ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${status === "APPROVED" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                      {status}
                    </span>
                  </div>
                )}

                {user === "Administrator" && (
                  <Link href="/admin" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition border-b border-gray-50">
                    🖥️ Dashboard Admin
                  </Link>
                )}

                <button onClick={handleLogout} className="block w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition font-medium">
                  🚪 Keluar / Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <Link href="/login" className="text-gray-600 hover:text-blue-900 font-medium py-2 px-2 text-sm">
              Masuk
            </Link>
            <Link href="/daftar" className="bg-blue-900 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-blue-800 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Daftar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
