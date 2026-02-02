'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'PRODUCTS' | 'SETTINGS'>('MEMBERS')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false) // STATE UNTUK LOADING GAMBAR

  // Data State
  const [members, setMembers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  
  // State Settings
  const [settings, setSettings] = useState({
    admin_wa: '', footer_address: '', footer_email: '', footer_phone: ''
  })

  // State Organisasi
  const [orgMembers, setOrgMembers] = useState<any[]>([])
  const [newMember, setNewMember] = useState({ name: '', role_id: '', role_en: '', division: 'pengurus' })

  // State Produk
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title_id: '', title_en: '', desc_id: '', desc_en: '',
    moisture: '', origin: 'Java, Indonesia', packaging_id: '', packaging_en: '', 
    image_url: '' // Ini akan terisi otomatis setelah upload
  })

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin")
    if (isAdmin === "true") {
      setAuthorized(true)
      fetchMembers(); fetchProducts(); fetchSettings(); fetchOrgMembers()
    } else {
      window.location.href = '/login'
    }
  }, [])

  // --- FUNGSI FETCH ---
  const fetchMembers = async () => { const { data } = await supabase.from('members').select('*').order('id', { ascending: false }); setMembers(data || []) }
  const fetchProducts = async () => { const { data } = await supabase.from('products').select('*').order('id', { ascending: true }); setProducts(data || []) }
  const fetchSettings = async () => { 
    const { data } = await supabase.from('app_settings').select('*')
    if (data) { const n:any = {...settings}; data.forEach(i => n[i.key]=i.value); setSettings(n) }
  }
  const fetchOrgMembers = async () => { const { data } = await supabase.from('org_members').select('*').order('id', { ascending: true }); setOrgMembers(data || []) }

  // --- FUNGSI UPLOAD GAMBAR (BARU) ---
  const handleImageUpload = async (e: any) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      if (!file) return

      // 1. Buat nama file unik (biar tidak bentrok)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // 2. Upload ke Supabase Storage (Bucket: 'products')
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // 3. Ambil URL Publik
      const { data } = supabase.storage.from('products').getPublicUrl(filePath)
      
      // 4. Masukkan URL ke Form
      setFormData({ ...formData, image_url: data.publicUrl })
      alert("Gambar berhasil diupload!")

    } catch (error: any) {
      alert('Gagal upload gambar: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  // --- LOGIC LAINNYA ---
  const handleSaveSettings = async (e: any) => {
    e.preventDefault(); setLoading(true)
    const updates = [{ key: 'admin_wa', value: settings.admin_wa }, { key: 'footer_address', value: settings.footer_address }, { key: 'footer_email', value: settings.footer_email }, { key: 'footer_phone', value: settings.footer_phone }]
    await supabase.from('app_settings').upsert(updates); setLoading(false); alert("Tersimpan!")
  }
  const handleAddMember = async (e: any) => { e.preventDefault(); await supabase.from('org_members').insert([newMember]); setNewMember({name:'',role_id:'',role_en:'',division:'pengurus'}); fetchOrgMembers() }
  const handleDeleteMember = async (id: number) => { if(confirm("Hapus?")) await supabase.from('org_members').delete().eq('id', id); fetchOrgMembers() }
  const handleSubmitProduct = async (e: any) => {
    e.preventDefault(); setLoading(true)
    if(editingId) await supabase.from('products').update(formData).eq('id', editingId)
    else await supabase.from('products').insert([formData])
    setEditingId(null); setFormData({title_id:'',title_en:'',desc_id:'',desc_en:'',moisture:'',origin:'Java, Indonesia',packaging_id:'',packaging_en:'',image_url:''}); fetchProducts(); setLoading(false); alert("Produk Disimpan!")
  }
  const handleEditClick = (p:any) => { setEditingId(p.id); setFormData({...p}); window.scrollTo({top:0,behavior:'smooth'}) }
  const handleDeleteProduct = async (id:number) => { if(confirm("Hapus?")){ await supabase.from('products').delete().eq('id',id); fetchProducts() } }
  const handleLogout = () => { localStorage.removeItem("isAdmin"); window.location.href = '/login' }
  const handleApproveMember = async (id: number) => { await supabase.from('members').update({ status: 'APPROVED' }).eq('id', id); fetchMembers() }
  const handleDeleteMemberData = async (id: number) => { if(confirm("Hapus?")) { await supabase.from('members').delete().eq('id', id); fetchMembers() } }
  
  // EXPORT
  const handleExportExcel = () => { const d = members.map(m=>({Nama:m.nama_lengkap, WA:m.no_wa})); const ws=XLSX.utils.json_to_sheet(d); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,"Data"); XLSX.writeFile(wb,"Anggota.xlsx") }
  const handleExportProducts = () => { const d = products.map(p=>({Nama:p.title_id})); const ws=XLSX.utils.json_to_sheet(d); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,"Data"); XLSX.writeFile(wb,"Katalog.xlsx") }

  if (!authorized) return <div className="p-10 text-center">Memeriksa akses...</div>

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div><h1 className="text-2xl font-bold text-blue-900">Dashboard Admin</h1><p className="text-sm text-slate-500">Koperasi Samudera Komoditas Indonesia</p></div>
          <button onClick={handleLogout} className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded font-medium hover:bg-red-100">Logout</button>
        </div>

        <div className="flex gap-4 mb-6 border-b border-slate-300">
          <button onClick={() => setActiveTab('MEMBERS')} className={`pb-2 px-4 font-bold transition ${activeTab === 'MEMBERS' ? 'text-blue-900 border-b-4 border-blue-900' : 'text-slate-400'}`}>👥 Anggota</button>
          <button onClick={() => setActiveTab('PRODUCTS')} className={`pb-2 px-4 font-bold transition ${activeTab === 'PRODUCTS' ? 'text-blue-900 border-b-4 border-blue-900' : 'text-slate-400'}`}>📦 Produk</button>
          <button onClick={() => setActiveTab('SETTINGS')} className={`pb-2 px-4 font-bold transition ${activeTab === 'SETTINGS' ? 'text-blue-900 border-b-4 border-blue-900' : 'text-slate-400'}`}>⚙️ Pengaturan</button>
        </div>

        {/* TAB MEMBERS */}
        {activeTab === 'MEMBERS' && (
          <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
             <div className="p-4 bg-slate-50 border-b flex justify-between"><h3 className="font-bold text-gray-700">Data Anggota</h3><button onClick={handleExportExcel} className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">Download Excel</button></div>
             <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-slate-100 uppercase text-gray-500"><tr><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Kontak</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
                <tbody className="divide-y">{members.map(m => (<tr key={m.id}><td className="px-4 py-3 font-bold">{m.nama_lengkap}</td><td className="px-4 py-3">{m.email}<br/>{m.no_wa}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${m.status==='APPROVED'?'bg-green-100 text-green-800':'bg-yellow-100 text-yellow-800'}`}>{m.status}</span></td><td className="px-4 py-3 text-right">{m.status==='PENDING'&&<button onClick={()=>handleApproveMember(m.id)} className="text-green-600 font-bold mr-2">Approve</button>}<button onClick={()=>handleDeleteMemberData(m.id)} className="text-red-600 font-bold">Hapus</button></td></tr>))}</tbody>
             </table>
          </div>
        )}

        {/* TAB PRODUCTS */}
        {activeTab === 'PRODUCTS' && (
           <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow border h-fit">
                  <h2 className="font-bold text-lg mb-4 text-blue-900">{editingId ? 'Edit Produk' : 'Tambah Produk'}</h2>
                  <form onSubmit={handleSubmitProduct} className="space-y-3">
                      <input className="border p-2 w-full rounded text-slate-900" placeholder="Nama (ID)" value={formData.title_id} onChange={e=>setFormData({...formData, title_id: e.target.value})} required/>
                      <input className="border p-2 w-full rounded text-slate-900" placeholder="Name (EN)" value={formData.title_en} onChange={e=>setFormData({...formData, title_en: e.target.value})} required/>
                      <textarea className="border p-2 w-full rounded text-slate-900" placeholder="Deskripsi (ID)" rows={2} value={formData.desc_id} onChange={e=>setFormData({...formData, desc_id: e.target.value})} required/>
                      <textarea className="border p-2 w-full rounded text-slate-900" placeholder="Desc (EN)" rows={2} value={formData.desc_en} onChange={e=>setFormData({...formData, desc_en: e.target.value})} required/>
                      <div className="grid grid-cols-2 gap-2"><input className="border p-2 w-full rounded text-slate-900" placeholder="Moisture" value={formData.moisture} onChange={e=>setFormData({...formData, moisture: e.target.value})} required/><input className="border p-2 w-full rounded text-slate-900" placeholder="Origin" value={formData.origin} onChange={e=>setFormData({...formData, origin: e.target.value})} required/></div>
                      <div className="grid grid-cols-2 gap-2"><input className="border p-2 w-full rounded text-slate-900" placeholder="Kemasan (ID)" value={formData.packaging_id} onChange={e=>setFormData({...formData, packaging_id: e.target.value})} required/><input className="border p-2 w-full rounded text-slate-900" placeholder="Pack (EN)" value={formData.packaging_en} onChange={e=>setFormData({...formData, packaging_en: e.target.value})} required/></div>
                      
                      {/* === UPLOAD GAMBAR (BAGIAN BARU) === */}
                      <div className="border p-3 rounded bg-slate-50">
                        <label className="block text-xs font-bold text-gray-500 mb-2">FOTO PRODUK</label>
                        
                        {/* 1. Preview Gambar jika sudah ada */}
                        {formData.image_url ? (
                           <div className="mb-3 relative">
                              <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded border" />
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, image_url: ''})}
                                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                              >
                                Hapus
                              </button>
                           </div>
                        ) : (
                           <div className="h-32 bg-gray-200 rounded border border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-xs mb-3">
                              Belum ada gambar
                           </div>
                        )}

                        {/* 2. Tombol Upload */}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {uploading && <p className="text-xs text-blue-600 mt-1 animate-pulse">Sedang meng-upload...</p>}
                      </div>
                      
                      <div className="flex gap-2"><button className="bg-blue-900 text-white w-full py-2 rounded font-bold">{editingId?'Update':'Simpan'}</button>{editingId && <button type="button" onClick={()=>{setEditingId(null);setFormData({title_id:'',title_en:'',desc_id:'',desc_en:'',moisture:'',origin:'',packaging_id:'',packaging_en:'',image_url:''})}} className="bg-gray-200 text-gray-700 w-1/3 rounded">Batal</button>}</div>
                  </form>
              </div>
              <div className="lg:col-span-2 space-y-3">
                  <div className="flex justify-between bg-white p-3 rounded shadow-sm border"><h3 className="font-bold">List Produk</h3><button onClick={handleExportProducts} className="text-green-600 font-bold text-sm">Download Excel</button></div>
                  {products.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded shadow-sm border flex gap-4">
                        {/* Tampilkan Thumbnail Kecil di List */}
                        <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                           {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-xs">No Img</span>}
                        </div>
                        <div className="flex-1">
                           <h4 className="font-bold text-blue-900">{p.title_id}</h4>
                           <p className="text-xs text-gray-500">{p.moisture}</p>
                        </div>
                        <div><button onClick={()=>handleEditClick(p)} className="text-blue-600 mr-3">✏️</button><button onClick={()=>handleDeleteProduct(p.id)} className="text-red-600">🗑️</button></div>
                    </div>
                  ))}
              </div>
           </div>
        )}

        {/* TAB SETTINGS (SAMA SEPERTI SEBELUMNYA) */}
        {activeTab === 'SETTINGS' && (
          <div className="grid lg:grid-cols-2 gap-8">
             <div className="bg-white p-6 rounded-xl shadow border border-slate-200 h-fit">
                <h2 className="text-xl font-bold text-blue-900 mb-6 border-b pb-2">Info Kontak & Footer</h2>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div><label className="text-xs font-bold text-gray-500 uppercase">WhatsApp Admin</label><input className="w-full p-2 border rounded text-slate-900" value={settings.admin_wa} onChange={e=>setSettings({...settings, admin_wa: e.target.value})} /></div>
                  <div><label className="text-xs font-bold text-gray-500 uppercase">Telepon (Footer)</label><input className="w-full p-2 border rounded text-slate-900" value={settings.footer_phone} onChange={e=>setSettings({...settings, footer_phone: e.target.value})} /></div>
                  <div><label className="text-xs font-bold text-gray-500 uppercase">Email</label><input className="w-full p-2 border rounded text-slate-900" value={settings.footer_email} onChange={e=>setSettings({...settings, footer_email: e.target.value})} /></div>
                  <div><label className="text-xs font-bold text-gray-500 uppercase">Alamat</label><textarea rows={3} className="w-full p-2 border rounded text-slate-900" value={settings.footer_address} onChange={e=>setSettings({...settings, footer_address: e.target.value})} /></div>
                  <button disabled={loading} className="w-full bg-blue-900 text-white font-bold py-2 rounded hover:bg-blue-800">{loading ? 'Saving...' : 'Simpan'}</button>
                </form>
             </div>
             <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h2 className="text-xl font-bold text-blue-900 mb-6 border-b pb-2">Struktur Organisasi</h2>
                <form onSubmit={handleAddMember} className="bg-slate-50 p-4 rounded mb-6 border">
                   <div className="grid grid-cols-2 gap-2 mb-2"><input required placeholder="Nama" className="border p-2 rounded text-sm w-full text-slate-900" value={newMember.name} onChange={e=>setNewMember({...newMember, name: e.target.value})} /><select className="border p-2 rounded text-sm w-full text-slate-900" value={newMember.division} onChange={e=>setNewMember({...newMember, division: e.target.value})}><option value="penasihat">Penasihat</option><option value="pengawas">Pengawas</option><option value="pengurus">Pengurus</option><option value="pengelola">Pengelola</option></select></div>
                   <div className="grid grid-cols-2 gap-2 mb-2"><input required placeholder="Jabatan (ID)" className="border p-2 rounded text-sm w-full text-slate-900" value={newMember.role_id} onChange={e=>setNewMember({...newMember, role_id: e.target.value})} /><input required placeholder="Role (EN)" className="border p-2 rounded text-sm w-full text-slate-900" value={newMember.role_en} onChange={e=>setNewMember({...newMember, role_en: e.target.value})} /></div>
                   <button className="bg-green-600 text-white text-sm font-bold py-2 px-4 rounded w-full">+ Tambah</button>
                </form>
                <div className="space-y-2 max-h-96 overflow-y-auto">{orgMembers.map((m) => (<div key={m.id} className="flex justify-between items-center p-3 border rounded bg-white"><div><p className="font-bold text-slate-800 text-sm">{m.name}</p><p className="text-xs text-slate-500">{m.role_id}</p></div><button onClick={()=>handleDeleteMember(m.id)} className="text-red-500 text-xs font-bold">Hapus</button></div>))}</div>
             </div>
          </div>
        )}
      </div>
    </main>
  )
}