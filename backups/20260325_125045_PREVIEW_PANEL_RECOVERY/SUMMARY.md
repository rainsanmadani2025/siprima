# SUMMARY - QUICK REFERENCE PERBAIKAN

**Dibuat:** 2025-03-25 12:50  
**Status:** Aplikasi Normal & Berjalan

---

## ⚠️ 3 ATURAN WAJIB (TIDAK BOLEH DILANGGAR!)

### ❌ JANGAN PERNAH:
1. Menghapus folder `.next` atau build cache
2. Menghapus atau mengubah database yang sudah normal  
3. Menghapus file yang sudah berfungsi baik

### ✅ SELALU:
1. Tanya USER jika ada masalah yang tidak jelas
2. Minta izin sebelum tindakan yang berisiko
3. Baca catatan ini sebelum perbaikan
4. Gunakan pendekatan paling aman terlebih dahulu

---

## 🚨 MASALAH #1: Preview Panel Menampilkan 'Z'

**Solusi Cepat:**

### 1. Cek Status Dev Server
```bash
ps aux | grep "next dev" | grep -v grep
```

### 2. Jika Tidak Ada Proses, Jalankan Server:
```bash
cd /home/z/my-project
(bun next dev -p 3000 > /tmp/next-dev-final.log 2>&1 &) &
```

### 3. Cek Status (5-10 detik kemudian):
```bash
ps aux | grep "next dev" | grep -v grep
tail -30 /tmp/next-dev-final.log
```

**Hasil yang Diharapkan:**
```
✓ Ready in 700ms
GET / 200 in ...
```

---

## 🔧 MASALAH #2: Error Build Cache

**Tanpa Menghapus .next, Lakukan:**

### 1. Trigger Recompile:
```bash
cd /home/z/my-project
echo "// Recompile trigger" >> src/app/page.tsx
echo "// Recompile trigger" >> src/app/dashboard/guru/perencanaan/buat/page.tsx
sleep 5
```

### 2. Cek Log:
```bash
tail -50 /tmp/next-dev-final.log
```

---

## 💾 MASALAH #3: Database Hilang/Error

### 1. Cek Backup Database:
```bash
ls -la /home/z/my-project/backups/*/database/
```

### 2. Restore dari Backup:
```bash
# Ganti [tanggal] dengan backup terbaru
cp /home/z/my-project/backups/[tanggal]/database/*.db /home/z/my-project/db/
```

---

## 📋 MASALAH #4: File Hilang/Error

### 1. Cek Backup File:
```bash
ls -la /home/z/my-project/backups/[tanggal]/important-files/
```

### 2. Restore File:
```bash
# Contoh untuk halaman buat RPP
cp /home/z/my-project/backups/[tanggal]/important-files/pages/buat/page.tsx \
   /home/z/my-project/src/app/dashboard/guru/perencanaan/buat/page.tsx
```

---

## ✅ CHECKLIST VERIFIKASI

Setelah perbaikan, pastikan:
- [ ] Dev server berjalan (`ps aux | grep "next dev"`)
- [ ] Log tidak ada error (`tail -50 /tmp/next-dev-final.log`)
- [ ] Preview panel normal (bukan 'Z')
- [ ] Halaman bisa diakses

---

## 📍 LOKASI PENTING

### Backup Database:
```
/home/z/my-project/backups/[tanggal]/database/
```

### Backup File Penting:
```
/home/z/my-project/backups/[tanggal]/important-files/
```

### Dokumentasi Lengkap:
```
/home/z/my-project/backups/[tanggal]/docs/PANDUAN_PERBAIKAN_ERROR.md
```

### Log Dev Server:
```
/tmp/next-dev-final.log
```

### Database Aktif:
```
/home/z/my-project/db/
```

---

## 🚨 JIKA TIDAK BISA DIPERBAIKI

1. **STOP** - Jangan lakukan tindakan lanjut
2. **TANYA USER** - Jelaskan situasi
3. **DOKUMENTASIKAN** - Catat langkah yang dicoba
4. **TUNGGU** - Tunggu instruksi USER

---

## 📞 INFORMASI YANG PERLU DIPERSIAPKAN

Saat meminta bantuan USER, siapkan:
- Error message lengkap dari log
- Langkah yang sudah dicoba
- File yang terakhir diubah
- Screenshot error (jika ada)

---

**INGAT:**
- Baca panduan lengkap di `docs/PANDUAN_PERBAIKAN_ERROR.md`
- Selalu patuhi 3 ATURAN WAJIB di atas
- Jangan ragu untuk TANYA USER jika tidak yakin
