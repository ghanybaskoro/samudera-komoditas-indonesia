"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; // Import Supabase

export default function ProductPage() {
  const [lang, setLang] = useState<"id" | "en">("id");
  const [products, setProducts] = useState<any[]>([]); // State untuk menyimpan data DB
  const [loading, setLoading] = useState(true);

  // Fetch Data dari Supabase saat halaman dibuka
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });

      if (data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Fungsi helper untuk menentukan icon jika tidak ada gambar
  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("jerami") || lower.includes("straw")) return "🌾";
    if (lower.includes("sekam") || lower.includes("husk")) return "🍂";
    if (lower.includes("bekatul") || lower.includes("bran")) return "🥣";
    return "📦";
  };

  // Kamus Bahasa Statis (Header & Label)
  const t = {
    id: {
      title: "Katalog Produk Ekspor",
      subtitle: "Komoditas pertanian terbaik dari petani Indonesia untuk pasar dunia.",
      specTitle: "Spesifikasi:",
      btnContact: "Minta Penawaran / Order",
      moisture: "Kadar Air",
      pack: "Kemasan",
      origin: "Asal",
    },
    en: {
      title: "Export Product Catalog",
      subtitle: "The finest agricultural commodities from Indonesian farmers to the world.",
      specTitle: "Specifications:",
      btnContact: "Request Quote / Order",
      moisture: "Moisture",
      pack: "Packaging",
      origin: "Origin",
    },
  }[lang];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* HEADER SECTION */}
      <section className="bg-blue-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-6 right-6 z-20">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-1 flex">
            <button onClick={() => setLang("id")} className={`px-3 py-1 rounded-full text-xs font-bold transition ${lang === "id" ? "bg-white text-blue-900" : "text-white hover:bg-white/10"}`}>
              🇮🇩 ID
            </button>
            <button onClick={() => setLang("en")} className={`px-3 py-1 rounded-full text-xs font-bold transition ${lang === "en" ? "bg-white text-blue-900" : "text-white hover:bg-white/10"}`}>
              🇬🇧 EN
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto font-light">{t.subtitle}</p>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-6xl mx-auto px-6 -mt-10">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-gray-500 animate-pulse">Memuat Katalog Produk...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden border border-slate-100 flex flex-col">
                {/* IMAGE AREA */}
                <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative overflow-hidden">
                  {product.image_url ? <img src={product.image_url} alt={product.title_id} className="w-full h-full object-cover" /> : <span className="text-6xl drop-shadow-md">{getIcon(product.title_id)}</span>}
                  <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-tl-lg">Export Quality</div>
                </div>

                {/* CONTENT AREA */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold text-blue-900 mb-3">{lang === "id" ? product.title_id : product.title_en}</h2>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-1">{lang === "id" ? product.desc_id : product.desc_en}</p>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6 text-sm">
                    <h3 className="font-bold text-slate-700 mb-2 border-b pb-1">{t.specTitle}</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-gray-500">{t.moisture}:</span>
                      <span className="font-medium text-right">{product.moisture}</span>

                      <span className="text-gray-500">{t.pack}:</span>
                      <span className="font-medium text-right">{lang === "id" ? product.packaging_id : product.packaging_en}</span>

                      <span className="text-gray-500">{t.origin}:</span>
                      <span className="font-medium text-right">{product.origin}</span>
                    </div>
                  </div>

                  <Link
                    href={`https://wa.me/6281234567890?text=Hello, I am interested in your ${product.title_en}...`}
                    target="_blank"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded text-center transition flex items-center justify-center gap-2">
                    <span>💬</span> {t.btnContact}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
