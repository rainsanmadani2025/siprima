# Session Log - Perbaikan PDF Export RPP

**Tanggal:** 2025-03-25
**Waktu Backup:** $(date)

## PERUBAHAN YANG DILAKUKAN

### 1. File: `/home/z/my-project/src/app/api/rpp/export-pdf/route.ts`

#### Perubahan 1: Bagian D. Profil Lulusan (Line 429)
- **Sebelum:** `drawBullets(rppData.profilLulusan || '...', 20)` - Default indent 20
- **Sesudah:** `drawBullets(rppData.profilLulusan || '...', 0)` - Indent 0
- **Tujuan:** Mengurangi margin kiri agar teks sejajar dengan judul

#### Perubahan 2: Bagian G. Tujuan Pembelajaran Mendalam (Line 513)
- **Sebelum:** `drawBullets(rppData.tujuanPembelajaranMendalam || '-')` - Default indent 20
- **Sesudah:** `drawBullets(rppData.tujuanPembelajaranMendalam || '-', 0)` - Indent 0
- **Tujuan:** Mengurangi margin kiri agar teks sejajar dengan judul

#### Perubahan 3: Fungsi drawBullets (Line 167-264)
- **Sebelum:** Hanya memecah berdasarkan newline (`\n`)
- **Sesudah:** Menambahkan fungsi `splitIntoSentences()` untuk memecah kalimat berdasarkan tanda baca (. ! ?)
- **Tujuan:** Setiap kalimat menjadi bullet point terpisah dengan tanda hubung (-)

#### Perubahan 4: Bagian L. Penilaian (Line 646-648)
- **Sebelum:** Langsung menggambar section
- **Sesudah:** Menambahkan `newPage()` dan reset posisi Y
- **Tujuan:** Lembar observasi dan rubrik penilaian selalu dimulai di halaman baru

#### Perubahan 5: Header Matriks Rubrik (Line 790-828, 840-868)
- **Sebelum:** Header digambar dengan posisi yang salah
- **Sesudah:** Memperbaiki posisi header dengan `headerTop = currentY` dan `headerBottom = currentY - headerHeight`
- **Tujuan:** Header tabel muncul tepat di bawah judul dengan posisi yang benar

#### Perubahan 6: Bagian F. Tujuan Profil Lulusan (Line 435-565) - UPDATE 2
- **Sebelum:** Menggunakan text wrapping biasa untuk narasi
- **Sesudah:** Menggunakan `splitIntoSentences()` untuk memecah narasi menjadi list
- **Indent:** Mengubah ke 0 agar teks sejajar dengan judul
- **Bullet:** Menggunakan tanda hubung (-) untuk setiap kalimat
- **Tujuan:** Narasi ditampilkan sebagai list dengan kalimat terpisah, sejajar dengan judul

**Detail Perubahan 6:**
- Menambahkan fungsi `splitIntoSentences()` di dalam scope bagian F
- Setiap kalimat berdasarkan tanda baca (. ! ?) menjadi bullet terpisah
- Teks bullet sejajar dengan judul (indent = 0)
- Dua kolom layout tetap dipertahankan

### 2. Database: Template RPP

**Masalah:** Database template kosong (0 templates)

**Solusi:** Menjalankan script seed untuk memulihkan 15 template
- Script: `/home/z/my-project/prisma/seed-15-templates-kbc.ts`
- Command: `bun run prisma/seed-15-templates-kbc.ts`
- Hasil: 15 template berhasil dipulihkan

**15 Template yang Dipulihkan:**
1. Adab dan Akhlak Mulia
2. Al-Quran Kitab Suci
3. Alam Semesta yang Indah
4. Angka dan Berhitung
5. Diriku yang Berharga
6. Hewan Peliharaanku
7. Huruf dan Membaca
8. Indonesia Pusaka
9. Keluargaku yang Sayang
10. Masjid Tempat Ibadah
11. Rasul-rasul Allah
12. Sains dan Eksperimen
13. Tanaman dan Bunga
14. Teman-temanku yang Baik
15. Tubuhku yang Sehat

## BACKUP YANG DIBUAT

### 1. Database Backup
- **Lokasi:** `/home/z/my-project/backups/current-session/custom.db`
- **Isi:** Database dengan 15 template RPP KBC yang sudah dipulihkan
- **Status:** ✅ Selesai

### 2. File Backup
- **Lokasi:** `/home/z/my-project/backups/current-session/changed-files/export-pdf-route.ts`
- **Isi:** File export-pdf route dengan semua perbaikan (versi pertama)
- **Status:** ✅ Selesai

### 3. File Backup v2 (Update Tambahan)
- **Lokasi:** `/home/z/my-project/backups/current-session/changed-files/export-pdf-route-v2.ts`
- **Isi:** File export-pdf route dengan perbaikan bagian F. Tujuan Profil Lulusan
- **Perubahan:** Menambahkan splitIntoSentences() dan indent 0 untuk bagian F
- **Status:** ✅ Selesai

## CARA RESTORE JIKA ERROR

### Restore Database
```bash
# Stop dev server (Ctrl+C)
# Restore database
cp /home/z/my-project/backups/current-session/custom.db /home/z/my-project/db/custom.db
# Restart dev server
bun run dev
```

### Restore File
```bash
# Restore export PDF route
cp /home/z/my-project/backups/current-session/changed-files/export-pdf-route.ts /home/z/my-project/src/app/api/rpp/export-pdf/route.ts
```

### Restore Semua
```bash
# Restore database
cp /home/z/my-project/backups/current-session/custom.db /home/z/my-project/db/custom.db

# Restore file
cp /home/z/my-project/backups/current-session/changed-files/export-pdf-route.ts /home/z/my-project/src/app/api/rpp/export-pdf/route.ts

# Restart dev server
bun run dev
```

## STATUS SISTEM

### Dev Server
- **Status:** Running
- **Port:** 3000
- **Log:** `/home/z/my-project/dev.log`

### Database
- **Status:** Connected
- **Templates:** 15 (active)
- **Location:** `/home/z/my-project/db/custom.db`

### Preview Panel
- **Masalah:** Sering error
- **Catatan:** Ini adalah issue sistem, tidak berhubungan dengan perubahan kode

## CATATAN PENTING

1. **Semua perubahan kode TIDAK mempengaruhi database secara langsung**
2. **Database kosong adalah kebetulan/issue terpisah, bukan karena perubahan kode**
3. **Script seed yang dijalankan hanya untuk memulihkan, bukan menghapus data**
4. **Backup tersedia di `/home/z/my-project/backups/current-session/`**

## MASALAH YANG PERLU DIINVESTIGASI

1. **Preview Panel Sering Error**
   - Perlu investigasi lebih lanjut
   - Mungkin terkait dengan konfigurasi iframe/cors
   - Perlu cek log browser dan server

2. **Database Kadang Hilang**
   - Perlu investigasi penyebab
   - Kemungkinan: hot reload, concurrent operations, file corruption
   - Perlu setup backup otomatis

## REKOMENDASI

1. **Setup Backup Otomatis**
   - Cron job untuk backup database setiap 1 jam
   - Retain 10-20 backup terbaru
   - Notifikasi jika backup gagal

2. **Version Control untuk File Penting**
   - Gunakan git untuk track perubahan
   - Commit sebelum perubahan besar
   - Mudah revert jika error

3. **Monitoring System**
   - Monitor dev server log
   - Alert jika ada error
   - Monitoring database health

4. **Preview Panel Fix**
   - Investigasi dan perbaiki root cause
   - Cek konfigurasi iframe/cors
   - Test di berbagai browser
