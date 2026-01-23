import os
from supabase import create_client, Client

# Masukkan URL dan Key dari Supabase Project Settings
url: str = "https://efyompjrzenjgtuzazjv.supabase.co"
key: str = "sb_publishable_COBmu7TqgFkg6PNyEHLf5g_Ht24Lgsb" # Note: Untuk keamanan level tinggi, gunakan SERVICE_ROLE_KEY di backend, tapi anon key cukup untuk test awal jika RLS dimatikan.

supabase: Client = create_client(url, key)

def lihat_pendaftar_pending():
    print("\n--- DAFTAR PENDING ---")
    # Mengambil data dengan status PENDING
    response = supabase.table("members").select("*").eq("status", "PENDING").execute()
    data = response.data
    
    if not data:
        print("Tidak ada pendaftar baru.")
        return

    for i, member in enumerate(data):
        print(f"{i+1}. [ID: {member['id']}] {member['nama_lengkap']} - {member['email']} ({member['alasan_bergabung']})")
    
    return data

def approve_member(member_id):
    # Update status menjadi APPROVED
    data = supabase.table("members").update({"status": "APPROVED"}).eq("id", member_id).execute()
    print(f"Member ID {member_id} berhasil di-approve!")

# Loop Menu Utama
while True:
    print("\n=== ADMIN SAMUDERA KOMODITAS ===")
    print("1. Lihat Pendaftar Pending")
    print("2. Approve Anggota")
    print("3. Keluar")
    
    pilihan = input("Pilih menu: ")
    
    if pilihan == "1":
        lihat_pendaftar_pending()
    elif pilihan == "2":
        id_input = input("Masukkan ID member yang mau di-approve: ")
        approve_member(id_input)
    elif pilihan == "3":
        break