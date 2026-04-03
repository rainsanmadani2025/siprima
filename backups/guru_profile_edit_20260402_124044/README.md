# Backup Guru Profile Edit - 2026-04-02 12:40

## File yang di-backup:

1. **profile-route.ts** - API `/api/guru/profile/route.ts` sebelum perubahan
2. **profil-page.tsx** - Halaman profil guru sebelum perubahan
3. **profil-page-before-upload.tsx** - Halaman profil sebelum fitur upload foto
4. **profil-page-before-birthdate.tsx** - Halaman profil sebelum tambah tempat/tanggal lahir
5. **header-before-avatar.tsx** - Header sebelum fitur avatar

## Perubahan yang dilakukan:

### 1. API `/api/guru/profile/route.ts`
- Method GET: Sudah ada (untuk membaca data profil)
- Method PATCH: Baru ditambahkan (untuk mengupdate profil guru sendiri)

Field yang bisa diupdate:
- name (dari User)
- email (dari User)
- phone (dari User)
- avatar (dari User) - untuk foto profil
- nuptk (dari Teacher)
- birthPlace (dari Teacher) - tempat lahir
- birthDate (dari Teacher) - tanggal lahir
- lastEducation (dari Teacher)
- address (dari Teacher)

### 2. API `/api/guru/profile/upload/route.ts` (BARU)
- Method POST: Upload foto profil
- Validasi tipe file (JPEG, PNG, GIF, WebP)
- Validasi ukuran file (maksimal 2MB)
- Simpan file di `public/uploads/avatars/`
- Update database field `avatar` di tabel `User`

### 3. API `/api/user/avatar/route.ts` (BARU)
- Method GET: Mengambil avatar user untuk header

### 4. Frontend `/src/app/dashboard/guru/profil/page.tsx`
- Fetch data dari API saat halaman dimuat
- Tampilkan data real dari database
- Tambahkan fungsi untuk menyimpan perubahan ke API
- Tampilkan notifikasi sukses/gagal
- **Fitur Upload Foto:**
  - File input untuk upload foto
  - Preview foto sebelum upload
  - Loading state saat upload
  - Tombol hapus foto (X)
  - Validasi tipe dan ukuran file di client
  - Menampilkan foto yang sudah diupload
- **Field Tempat dan Tanggal Lahir:**
  - Tempat Lahir (dibawah Nama Guru)
  - Tanggal Lahir (dibawah Tempat Lahir)
  - Posisi: Dibawah Nama Guru, sebelum NUPTK

### 5. Frontend `/src/components/dashboard/header.tsx`
- Fetch avatar dari API saat komponen mount
- Tampilkan foto jika ada, icon User jika tidak ada
- Mendengarkan custom event `avatarUpdated` untuk update real-time
- Avatar otomatis update setelah upload foto baru

## SOP yang diikuti:
✅ Backup file sebelum perubahan
❌ Tidak mengubah database schema (field sudah ada)
❌ Tidak menjalankan db:push atau migrasi
❌ Tidak menghapus .next atau database
❌ Tidak restart dev server

## Database Schema (TIDAK DIUBAH):

### Model User:
- name ✅
- email ✅
- phone ✅
- avatar ✅ (sudah ada)

### Model Teacher:
- nuptk ✅
- birthPlace ✅ (sudah ada)
- birthDate ✅ (sudah ada)
- lastEducation ✅
- address ✅

---

**Backup dibuat sebelum implementasi fitur edit profil guru lengkap dengan upload foto, avatar di header, dan field tempat/tanggal lahir.**
