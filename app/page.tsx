'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [lang, setLang] = useState<'id' | 'en'>('id')
  
  // STATE DATA DINAMIS
  const [footerInfo, setFooterInfo] = useState({
    address: 'Loading...',
    email: 'Loading...',
    phone: 'Loading...'
  })
  
  const [orgTeam, setOrgTeam] = useState<{ [key: string]: any[] }>({
    penasihat: [],
    pengawas: [],
    pengurus: [],
    pengelola: []
  })

  // FETCH DATA SAAT LOAD
  useEffect(() => {
    const fetchData = async () => {
      // 1. Ambil Info Footer
      const { data: settings } = await supabase.from('app_settings').select('*')
      if (settings) {
        const info: any = {}
        settings.forEach(item => info[item.key] = item.value)
        setFooterInfo({
          address: info.footer_address || 'Alamat belum diatur',
          email: info.footer_email || 'Email belum diatur',
          phone: info.footer_phone || 'Telepon belum diatur'
        })
      }

      // 2. Ambil Struktur Organisasi
      const { data: members } = await supabase.from('org_members').select('*').order('id', { ascending: true })
      if (members) {
        const grouped: any = { penasihat: [], pengawas: [], pengurus: [], pengelola: [] }
        members.forEach(m => {
          if (grouped[m.division]) grouped[m.division].push(m)
        })
        setOrgTeam(grouped)
      }
    }

    fetchData()
  }, [])

  const content = {
    id: {
      heroTitle: "Koperasi Samudera \n Komoditas Indonesia",
      heroTagline: "\"Mengangkat Potensi Lokal, Menembus Pasar Global\"",
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
      
      legalTitle: "Legalitas & Izin Usaha",
      legalDesc: "Kami beroperasi secara transparan di bawah payung hukum Republik Indonesia.",
      legalItems: [
        { label: "Nama Badan Hukum", value: "Koperasi Jasa Samudera Komoditas Indonesia" },
        { label: "Akta Notaris", value: "No. 03 (12 Juli 2022) - Nenden Dewi Anggraeni, SH, M.Kn" },
        { label: "SK Kemenkumham", value: "AHU-0004095.A.H.01.29. Tahun 2022" },
        { label: "NIB (Perizinan Berusaha)", value: "2108220004567" },
        { label: "Alamat Terdaftar", value: footerInfo.address },
      ],

      orgTitle: "Struktur Organisasi",
      orgDesc: "Dipimpin oleh para profesional dan ahli di bidang pertanian & agrobisnis.",
      orgSections: { pengurus: "Pengurus Harian", pengawas: "Dewan Pengawas", penasihat: "Dewan Penasihat", pengelola: "Tim Pengelola" },
      
      ctaTitle: "Siap menjadi bagian dari perubahan?",
      ctaDesc: "Daftarkan diri Anda sebagai anggota koperasi hari ini dan dapatkan akses ke jaringan pasar yang lebih luas.",
      btnRegister: "Isi Formulir Pendaftaran",

      footer: {
        desc: "Mitra terpercaya untuk agregasi dan ekspor komoditas pertanian Indonesia. Menghubungkan petani lokal dengan pasar global.",
        contactTitle: "Hubungi Kami",
        linkTitle: "Tautan Cepat",
        copyright: "© 2026 Koperasi Samudera Komoditas Indonesia. All rights reserved."
      }
    },
    en: {
      heroTitle: "Samudera Komoditas \n Indonesia Cooperative",
      heroTagline: "\"Empowering Local Potential, Penetrating Global Markets\"",
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

      legalTitle: "Legality & Business Licenses",
      legalDesc: "We operate transparently under the laws of the Republic of Indonesia.",
      legalItems: [
        { label: "Legal Entity Name", value: "Koperasi Jasa Samudera Komoditas Indonesia" },
        { label: "Notary Deed", value: "No. 03 (July 12, 2022) - Nenden Dewi Anggraeni, SH, M.Kn" },
        { label: "Ministry Decree (SK)", value: "AHU-0004095.A.H.01.29. Year 2022" },
        { label: "Business License (NIB)", value: "2108220004567" },
        { label: "Registered Address", value: footerInfo.address },
      ],

      orgTitle: "Organizational Structure",
      orgDesc: "Led by professionals and experts in agriculture & agribusiness.",
      orgSections: { pengurus: "Executive Board", pengawas: "Supervisory Board", penasihat: "Advisory Board", pengelola: "Management Team" },
      
      ctaTitle: "Ready to be part of the change?",
      ctaDesc: "Register as a cooperative member today and gain access to a wider market network.",
      btnRegister: "Fill Registration Form",

      footer: {
        desc: "Trusted partner for aggregation and export of Indonesian agricultural commodities. Connecting local farmers with global markets.",
        contactTitle: "Contact Us",
        linkTitle: "Quick Links",
        copyright: "© 2026 Samudera Komoditas Indonesia Cooperative. All rights reserved."
      }
    }
  }

  const t = content[lang]

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      
      {/* === HERO SECTION === */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover">
          <source src="/video-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute z-10 inset-0 bg-black/60"></div>
        
        {/* Toggle Bahasa */}
        <div className="absolute top-24 right-6 z-30 md:top-32 md:right-10">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-1 flex">
            <button onClick={() => setLang('id')} className={`px-4 py-1 rounded-full text-sm font-bold transition ${lang === 'id' ? 'bg-white text-blue-900 shadow' : 'text-white hover:bg-white/10'}`}>🇮🇩 ID</button>
            <button onClick={() => setLang('en')} className={`px-4 py-1 rounded-full text-sm font-bold transition ${lang === 'en' ? 'bg-white text-blue-900 shadow' : 'text-white hover:bg-white/10'}`}>🇬🇧 EN</button>
          </div>
        </div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          
          {/* --- LOGO DIPERBESAR DISINI --- */}
          {/* Sebelumnya: w-32 h-32 md:w-48 md:h-48 */}
          {/* Sekarang: w-48 h-48 md:w-80 md:h-80 (Jauh lebih besar) */}
          <div className="mx-auto w-48 h-48 md:w-80 md:h-80 relative mb-8">
            <Image src="/logo.png" alt="Logo SKI" fill className="object-contain drop-shadow-2xl" priority />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-wide uppercase drop-shadow-md whitespace-pre-line">{t.heroTitle}</h1>
          <p className="text-lg md:text-2xl text-blue-100 font-light italic tracking-wider mb-10">{t.heroTagline}</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
             <Link href="/daftar" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg transform hover:scale-105">{t.btnJoin}</Link>
             <a href="#visi-misi" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-3 px-8 rounded-full transition">{t.btnLearn}</a>
          </div>
        </div>
      </section>

      {/* === VISI MISI === */}
      <section id="visi-misi" className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto"><h2 className="text-3xl md:text-5xl font-bold mb-6">{t.section2Title}</h2><p className="text-xl md:text-2xl mb-2 text-blue-100 font-light leading-relaxed">{t.section2Desc}</p></div>
      </section>

      {/* === ABOUT SECTION === */}
      <section className="py-20 px-6 bg-white"><div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"><div><h2 className="text-3xl font-bold mb-6 text-blue-900">{t.aboutTitle}</h2><p className="text-lg text-gray-700 mb-4 leading-relaxed">{t.aboutP1}</p><p className="text-lg text-gray-700 mb-6 leading-relaxed">{t.aboutP2}</p><ul className="space-y-3"><li className="flex items-center text-gray-700"><span className="text-green-500 mr-2 text-xl">✓</span> {t.list1}</li><li className="flex items-center text-gray-700"><span className="text-green-500 mr-2 text-xl">✓</span> {t.list2}</li><li className="flex items-center text-gray-700"><span className="text-green-500 mr-2 text-xl">✓</span> {t.list3}</li></ul></div><div className="bg-slate-200 h-80 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300"><span className="text-4xl mb-2">🏭</span><span className="text-gray-500 font-medium">Foto Gudang / Aktivitas Ekspor</span></div></div></section>

      {/* === LEGALITAS === */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200"><div className="max-w-5xl mx-auto"><div className="text-center mb-12"><h2 className="text-3xl font-bold text-blue-900 mb-4">{t.legalTitle}</h2><p className="text-gray-600 max-w-2xl mx-auto">{t.legalDesc}</p></div><div className="grid md:grid-cols-2 gap-6">{t.legalItems.map((item, index) => (<div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col hover:border-blue-300 transition-colors"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</span><span className="text-lg font-medium text-slate-800 break-words">{item.value}</span></div>))}</div></div></section>

      {/* === ORGANISASI (DATA DINAMIS - CENTERED) === */}
      <section className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold text-blue-900 mb-4">{t.orgTitle}</h2><p className="text-gray-600 max-w-2xl mx-auto">{t.orgDesc}</p></div>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Penasihat */}
            {orgTeam.penasihat.length > 0 && (
              <div className="w-full md:w-[45%] lg:w-[22%] bg-slate-50 p-6 rounded-xl border border-slate-100 animate-fade-in-up shadow-sm hover:shadow-md transition">
                <h3 className="font-bold text-xl text-blue-900 mb-4 border-b pb-2">{t.orgSections.penasihat}</h3>
                <ul className="space-y-4">{orgTeam.penasihat.map((p, i) => (<li key={i}><p className="font-bold text-gray-800">{p.name}</p><p className="text-xs text-slate-500 font-medium">{lang === 'id' ? p.role_id : p.role_en}</p></li>))}</ul>
              </div>
            )}
            {/* Pengawas */}
            {orgTeam.pengawas.length > 0 && (
              <div className="w-full md:w-[45%] lg:w-[22%] bg-slate-50 p-6 rounded-xl border border-slate-100 animate-fade-in-up shadow-sm hover:shadow-md transition">
                <h3 className="font-bold text-xl text-blue-900 mb-4 border-b pb-2">{t.orgSections.pengawas}</h3>
                <ul className="space-y-4">{orgTeam.pengawas.map((p, i) => (<li key={i}><p className="font-bold text-gray-800">{p.name}</p><p className="text-sm text-slate-500">{lang === 'id' ? p.role_id : p.role_en}</p></li>))}</ul>
              </div>
            )}
            {/* Pengurus */}
            {orgTeam.pengurus.length > 0 && (
              <div className="w-full md:w-[45%] lg:w-[22%] bg-slate-50 p-6 rounded-xl border border-slate-100 animate-fade-in-up shadow-sm hover:shadow-md transition">
                <h3 className="font-bold text-xl text-blue-900 mb-4 border-b pb-2">{t.orgSections.pengurus}</h3>
                <ul className="space-y-4">{orgTeam.pengurus.map((p, i) => (<li key={i}><p className="font-bold text-gray-800">{p.name}</p><p className="text-sm text-slate-500">{lang === 'id' ? p.role_id : p.role_en}</p></li>))}</ul>
              </div>
            )}
            {/* Pengelola */}
            {orgTeam.pengelola.length > 0 && (
              <div className="w-full md:w-[45%] lg:w-[22%] bg-slate-50 p-6 rounded-xl border border-slate-100 animate-fade-in-up shadow-sm hover:shadow-md transition">
                <h3 className="font-bold text-xl text-blue-900 mb-4 border-b pb-2">{t.orgSections.pengelola}</h3>
                <ul className="space-y-4">{orgTeam.pengelola.map((p, i) => (<li key={i}><p className="font-bold text-gray-800">{p.name}</p><p className="text-sm text-slate-500">{lang === 'id' ? p.role_id : p.role_en}</p></li>))}</ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER & CTA */}
      <section className="bg-slate-50 py-16 px-6 text-center border-t border-slate-200">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">{t.ctaTitle}</h2><p className="mb-8 text-gray-600 max-w-2xl mx-auto">{t.ctaDesc}</p>
        <Link href="/daftar" className="bg-blue-900 text-white font-bold py-4 px-12 rounded shadow hover:bg-blue-800 transition inline-block">{t.btnRegister}</Link>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-12 px-6 border-t border-slate-800 mt-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
             <div className="flex items-center gap-3 mb-4"><div className="relative w-10 h-10"><Image src="/logo.png" alt="Logo SKI" fill className="object-contain" /></div><span className="font-bold text-white text-lg leading-tight">Samudera Komoditas <br/> Indonesia</span></div>
             <p className="text-sm text-slate-400 leading-relaxed">{t.footer.desc}</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">{t.footer.linkTitle}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition">Beranda (Home)</Link></li><li><Link href="/produk" className="hover:text-white transition">Produk Ekspor (Catalog)</Link></li><li><Link href="/daftar" className="hover:text-white transition">Daftar Anggota (Join Us)</Link></li><li><Link href="/login" className="hover:text-white transition">Login Anggota / Admin</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">{t.footer.contactTitle}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3"><span className="text-xl">📍</span><span>{footerInfo.address}</span></li>
              <li className="flex items-center gap-3"><span className="text-xl">📧</span><a href={`mailto:${footerInfo.email}`} className="hover:text-white transition">{footerInfo.email}</a></li>
              <li className="flex items-center gap-3"><span className="text-xl">📞</span><a href={`tel:${footerInfo.phone}`} className="hover:text-white transition">{footerInfo.phone}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">{t.footer.copyright}</div>
      </footer>
    </main>
  )
}