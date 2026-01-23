"use client"; // Wajib ada karena kita mainkan State (berubah-ubah)

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // State untuk menyimpan pilihan bahasa ('id' atau 'en')
  const [lang, setLang] = useState<"id" | "en">("id");

  // KAMUS DATA (Tempat kamu atur kata-kata)
  const content = {
    id: {
      heroTitle: "Koperasi Samudera \n Komoditas Indonesia",
      heroTagline: '"Mengangkat Potensi Lokal, Menembus Pasar Global"',
      btnJoin: "Bergabung Sekarang",
      btnLearn: "Pelajari Lebih Lanjut",

      section2Title: "Membangun Ekosistem Komoditas Indonesia",
      section2Desc: "Wadah kolaborasi petani, pengumpul, dan eksportir untuk meningkatkan nilai tambah hasil bumi Nusantara.",

      aboutTitle: "Tentang Kami",
      aboutP1: "Kami adalah koperasi pemasaran yang berfokus pada agregasi dan hilirisasi produk pertanian dan perkebunan.",
      aboutP2: "Misi kami adalah memotong rantai pasok yang tidak efisien dan membuka akses pasar global (ekspor) bagi komoditas lokal seperti sekam padi, hasil bumi, dan produk turunannya.",

      list1: "Akses Pasar Ekspor & Global Trading",
      list2: "Digitalisasi Rantai Pasok Pertanian",
      list3: "Peningkatan Kesejahteraan Anggota",

      ctaTitle: "Siap menjadi bagian dari perubahan?",
      ctaDesc: "Daftarkan diri Anda sebagai anggota koperasi hari ini dan dapatkan akses ke jaringan pasar yang lebih luas.",
      btnRegister: "Isi Formulir Pendaftaran",
    },
    en: {
      heroTitle: "Samudera Komoditas \n Indonesia Cooperative",
      heroTagline: '"Empowering Local Potential, Penetrating Global Markets"',
      btnJoin: "Join Now",
      btnLearn: "Learn More",

      section2Title: "Building Indonesia's Commodity Ecosystem",
      section2Desc: "A collaboration platform for farmers, aggregators, and exporters to increase the value of the archipelago's natural resources.",

      aboutTitle: "About Us",
      aboutP1: "We are a marketing cooperative focused on the aggregation and downstreaming of agricultural and plantation products.",
      aboutP2: "Our mission is to cut inefficient supply chains and open global market access (export) for local commodities such as rice husks, crops, and their derivatives.",

      list1: "Export Market Access & Global Trading",
      list2: "Agricultural Supply Chain Digitalization",
      list3: "Improving Members' Welfare",

      ctaTitle: "Ready to be part of the change?",
      ctaDesc: "Register as a cooperative member today and gain access to a wider market network.",
      btnRegister: "Fill Registration Form",
    },
  };

  // Helper untuk mengambil konten sesuai bahasa aktif
  const t = content[lang];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* === HERO SECTION === */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* VIDEO BACKGROUND */}
        <video autoPlay loop muted playsInline className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover">
          <source src="/video-hero.mp4" type="video/mp4" />
        </video>

        {/* OVERLAY HITAM */}
        <div className="absolute z-10 inset-0 bg-black/60"></div>

        {/* --- TOMBOL TOGGLE BAHASA (Letaknya di Pojok Kanan Atas Hero) --- */}
        <div className="absolute top-24 right-6 z-30 md:top-32 md:right-10">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-1 flex">
            <button onClick={() => setLang("id")} className={`px-4 py-1 rounded-full text-sm font-bold transition ${lang === "id" ? "bg-white text-blue-900 shadow" : "text-white hover:bg-white/10"}`}>
              🇮🇩 ID
            </button>
            <button onClick={() => setLang("en")} className={`px-4 py-1 rounded-full text-sm font-bold transition ${lang === "en" ? "bg-white text-blue-900 shadow" : "text-white hover:bg-white/10"}`}>
              🇬🇧 EN
            </button>
          </div>
        </div>

        {/* KONTEN UTAMA HERO */}
        <div className="relative z-20 text-center px-4 animate-fade-in-up max-w-5xl mx-auto">
          <div className="mx-auto w-32 h-32 md:w-48 md:h-48 relative mb-6">
            <Image src="/logo.png" alt="Logo SKI" fill className="object-contain drop-shadow-2xl" priority />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-wide uppercase drop-shadow-md whitespace-pre-line">{t.heroTitle}</h1>

          <p className="text-lg md:text-2xl text-blue-100 font-light italic tracking-wider mb-10">{t.heroTagline}</p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/daftar" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg transform hover:scale-105">
              {t.btnJoin}
            </Link>
            <a href="#visi-misi" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-3 px-8 rounded-full transition">
              {t.btnLearn}
            </a>
          </div>
        </div>
      </section>

      {/* === SECTION VISI MISI === */}
      <section id="visi-misi" className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t.section2Title}</h2>
          <p className="text-xl md:text-2xl mb-2 text-blue-100 font-light leading-relaxed">{t.section2Desc}</p>
        </div>
      </section>

      {/* === ABOUT SECTION === */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-900">{t.aboutTitle}</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">{t.aboutP1}</p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{t.aboutP2}</p>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2 text-xl">✓</span> {t.list1}
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2 text-xl">✓</span> {t.list2}
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2 text-xl">✓</span> {t.list3}
              </li>
            </ul>
          </div>
          <div className="bg-slate-200 h-80 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
            <span className="text-4xl mb-2">🏭</span>
            <span className="text-gray-500 font-medium">Foto Gudang / Aktivitas Ekspor</span>
            <span className="text-gray-500 font-medium">*Akan segera di Upload/Will be Uploaded Soon*</span>
          </div>
        </div>
      </section>

      {/* === CTA FOOTER === */}
      <section className="bg-slate-100 py-16 px-6 text-center border-t border-slate-200">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">{t.ctaTitle}</h2>
        <p className="mb-8 text-gray-600 max-w-2xl mx-auto">{t.ctaDesc}</p>
        <Link href="/daftar" className="bg-blue-900 text-white font-bold py-4 px-12 rounded shadow hover:bg-blue-800 transition inline-block">
          {t.btnRegister}
        </Link>
      </section>
    </main>
  );
}
