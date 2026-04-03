# PANDUAN PERBAIKAN ERROR - PREVIEW PANEL & DEV SERVER

**Dibuat:** 2025-03-25 12:50  
**Update Terakhir:** 2026-03-27 00:47
**Tujuan:** Dokumentasi langkah-langkah perbaikan jika terjadi error di preview panel atau dev server

---

## ⚠️ ATURAN KRUSIAL (WAJIB DIPATUHI)

### TIDAK BOLEH DILAKUKAN (KECUALI TERPAKSA DAN IZIN USER):
1. ❌ **JANGAN PERNAH** menghapus folder `.next` atau build cache
2. ❌ **JANGAN PERNAH** menghapus atau mengubah database yang sudah normal
3. ❌ **JANGAN PERNAH** menghapus file yang sudah berfungsi baik
4. ❌ **JANGAN PERNAH** mengambil tindakan tanpa bertanya ke USER terlebih dahulu
5. ❌ **JANGAN PERNAH** menambahkan komentar ke package.json (tidak valid untuk JSON)

### WAJIB DILAKUKAN:
1. ✅ **SELALU** tanya USER jika ada masalah yang tidak jelas
2. ✅ **SELALU** minta izin sebelum tindakan yang berpotensi berisiko
3. ✅ **SELALU** gunakan pendekatan paling aman terlebih dahulu
4. ✅ **SELALU** baca catatan ini sebelum perbaikan
5. ✅ **SETELAH PERBAIKAN BERHASIL** - backup file yang berfungsi normal dan buat catatan

---

## 📋 INDEKS MASALAH DAN SOLUSI

### Masalah 1: Preview Panel Menampilkan Huruf 'Z' dengan Background Putih
**Gejala:**
- Preview panel tidak menampilkan aplikasi
- Hanya muncul huruf 'Z' dengan background putih
- Indikasi dev server mati atau tidak berjalan

**Langkah Perbaikan:**

#### Langkah 1: Cek Status Dev Server
```bash
# Cek apakah dev server berjalan
ps aux | grep -E "(next|bun.*dev)" | grep -v grep

# Cek port 3000
netstat -tlnp 2>/dev/null | grep 3000 || ss -tlnp 2>/dev/null | grep 3000
```

**Hasil yang Diharapkan:**
- Ada proses "bun next dev -p 3000" atau "node ... next dev -p 3000"
- Port 3000 sedang digunakan

**Jika TIDAK ada proses:**
- Dev server mati dan perlu dijalankan ulang
- Lanjut ke Langkah 2

#### Langkah 2: Jalankan Dev Server
```bash
cd /home/z/my-project

# Cara 1: Jalankan di background (GUNAKAN INI - TERBUKTI BERHASIL)
(bun next dev -p 3000 > /tmp/next-dev-final.log 2>&1 &) &

# Cara 2: Jika cara 1 gagal, coba ini
cd /home/z/my-project && nohup bun run dev > /tmp/bun-dev.log 2>&1 &
```

#### Langkah 3: Verifikasi Dev Server Berjalan
```bash
# Tunggu 5-10 detik
sleep 10

# Cek apakah server berjalan
ps aux | grep "next dev" | grep -v grep

# Cek log
tail -30 /tmp/next-dev-final.log
```

**Hasil yang Diharapkan:**
```
▲ Next.js 16.1.3 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://21.0.5.214:3000
- Environments: .env

✓ Starting...
✓ Ready in 700ms
 GET / 200 in ...
```

**Jika server berhasil, preview panel seharusnya normal.**

---

### Masalah 2: Dev Server Berjalan Tapi Preview Panel Masih Error

#### Langkah 1: Cek Log Server
```bash
# Cek log terbaru
tail -100 /tmp/next-dev-final.log

# Cek error
tail -100 /tmp/next-dev-final.log | grep -i error
```

**Jika ada error:**
- Baca error message
- Cari solusi di bagian "Masalah Umum" di bawah
- Jika tidak ada solusi, TANYA USER terlebih dahulu

#### Langkah 2: Cek Build Cache
```bash
# Cek apakah .next ada
ls -la /home/z/my-project/.next

# Cek apakah build-manifest.json ada
find /home/z/my-project/.next -name "build-manifest.json"
```

**Jika build-manifest.json tidak ada:**
- Ini kemungkinan karena cache rusak
- **JANGAN HAPUS .next** - gunakan pendekatan aman
- Coba trigger recompile dengan mengubah comment di file

#### Langkah 3: Trigger Recompile (Tanpa Menghapus)
```bash
# Tambahkan comment ke file untuk memicu recompile
cd /home/z/my-project

# Tambahkan comment ke page.tsx
echo "// Recompile trigger" >> src/app/page.tsx

# Tambahkan comment ke buat page.tsx  
echo "// Recompile trigger" >> src/app/dashboard/guru/perencanaan/buat/page.tsx

# Tunggu beberapa detik untuk recompile
sleep 5
```

#### Langkah 4: Cek Log Setelah Recompile
```bash
tail -50 /tmp/next-dev-final.log
```

**Jika recompile berhasil:**
- Harus ada pesan "✓ Compiled"
- Preview panel seharusnya normal

---

### Masalah 3: Error "Module not found" atau "Cannot resolve"

#### Langkah 1: Identifikasi File yang Error
```bash
# Cari error di log
tail -100 /tmp/next-dev-final.log | grep -E "Module not found|Cannot resolve"
```

#### Langkah 2: Cek File yang Menyebabkan Error
```bash
# Jika error di file tertentu, cek apakah ada
ls -la /path/ke/file/yang/error
```

#### Langkah 3: Jika File Tidak Ada
**JANGAN HAPUS atau MODIFY file lain!**
- Cek di backup untuk melihat apakah file ini ada di backup
- Jika ada di backup, restore dari backup

```bash
# Contoh restore dari backup
cp /home/z/my-project/backups/[tanggal]/important-files/[file] /path/ke/target/[file]
```

---

### Masalah 4: Database Error

#### Langkah 1: Cek Database Connection
```bash
# Cek apakah database file ada
ls -la /home/z/my-project/db/*.db

# Cek log untuk error database
tail -100 /tmp/next-dev-final.log | grep -i database
tail -100 /tmp/next-dev-final.log | grep -i prisma
```

#### Langkah 2: Jika Database File Hilang
**JANGAN BUAT DATABASE BARU!**
- Cek backup database
- Restore dari backup terbaru

```bash
# List backup database
ls -la /home/z/my-project/backups/*/database/

# Restore dari backup terbaru (CONTOH - ganti dengan tanggal yang sesuai)
cp /home/z/my-project/backups/[tanggal_terbaru]/database/*.db /home/z/my-project/db/
```

---

### Masalah 5: Halaman Spesifik Error

#### Langkah 1: Identifikasi Halaman yang Error
- Halaman mana yang error? (/dashboard/admin/guru, /dashboard/guru/perencanaan, dll)
- Apakah semua halaman error atau hanya spesifik?

#### Langkah 2: Cek Log untuk Halaman Tersebut
```bash
# Cek request ke halaman tersebut
tail -100 /tmp/next-dev-final.log | grep "/path/ke/halaman"
```

#### Langkah 3: Cek File Component yang Terkait
- Setiap halaman ada file di `src/app/`
- Cek apakah file tersebut ada dan tidak error

#### Langkah 4: Jika File Error
- Cek backup untuk file tersebut
- Restore dari backup jika perlu

---

### Masalah 6: Dev Server Mati Terus Setelah Start
**Gejala:**
- Dev server berhasil start
- Tapi kemudian mati sendiri dalam beberapa detik/menit
- Preview panel muncul sebentar lalu hilang

**Penyebab Umum:**
1. **package.json invalid** - ada komentar atau format salah
2. **Runtime error** di file yang baru dimodifikasi
3. **Port conflict** - port 3000 sudah digunakan

**Langkah Perbaikan:**

#### Langkah 1: Cek package.json
```bash
# Validasi JSON
cd /home/z/my-project
cat package.json | python3 -m json.tool > /dev/null 2>&1 && echo "Valid JSON" || echo "INVALID JSON!"

# Jika invalid, periksa apakah ada komentar
tail -5 package.json
```

**Jika ada komentar di akhir package.json:**
- Hapus komentar tersebut
- package.json HARUS valid JSON (tidak boleh ada komentar JavaScript seperti //)

#### Langkah 2: Restore package.json dari Backup
```bash
# Cari backup package.json terbaru
find /home/z/my-project/backups -name "package.json" -type f

# Restore (CONTOH - ganti dengan path backup yang sesuai)
cp /home/z/my-project/backups/[tanggal]/changed-files/package.json /home/z/my-project/package.json
```

#### Langkah 3: Jalankan Dev Server Lagi
```bash
cd /home/z/my-project
(bun next dev -p 3000 > /tmp/next-dev-final.log 2>&1 &) &
sleep 15
ps aux | grep "next dev" | grep -v grep
```

**Jika server tetap mati:**
- Cek log untuk error detail
- Bisa jadi ada file lain yang menyebabkan runtime error
- Restore file yang baru dimodifikasi dari backup

---

## 🔧 MASALAH UMUM DAN SOLUSI

### Error: "package.json: JSONParseError"

**Penyebab:** package.json tidak valid karena ada komentar atau format salah

**SOLUSI:**
1. Cek apakah ada komentar di akhir file:
```bash
tail -5 package.json
```

2. Jika ada komentar (misal: `// comment`), hapus komentar tersebut
3. Validasi JSON:
```bash
cat package.json | python3 -m json.tool > /dev/null 2>&1 && echo "Valid" || echo "Invalid"
```

4. Jika masih invalid, restore dari backup

**PENTING:** TIDAK BOLEH menambahkan komentar JavaScript ke package.json!

---

### Error: "ENOENT: no such file or directory, open '.next/dev/server/pages/_app/build-manifest.json'"

**Penyebab:** Build cache rusak atau tidak lengkap

**SOLUSI (TANPA MENGHAPUS):**
1. Coba trigger recompile dengan mengubah comment di file (lihat Masalah 2, Langkah 3)
2. Jika masih error, TANYA USER terlebih dahulu
3. JANGAN HAPUS .next - ini melanggar aturan!

---

### Error: "Module not found: Can't resolve '@/app/api/auth/[...nextauth]/route'"

**Penyebab:** Mengimport file yang tidak ada atau sudah dihapus

**SOLUSI:**
1. Cari di mana authOptions didefinisikan:
```bash
grep -r "authOptions" /home/z/my-project/src/app/api/
```

2. Jika tidak ditemukan, file tersebut mungkin dihapus
3. Cek backup untuk melihat apakah file ini ada
4. Jika ada di backup, restore
5. Jika tidak ada di backup dan tidak perlu, hapus import yang bermasalah

---

### Error: Preview Panel Terus Loading atau Timeout

**Penyebab:** Dev server mati atau tidak merespon

**SOLUSI:**
1. Cek apakah dev server masih berjalan (lihat Masalah 1, Langkah 1)
2. Jika tidak berjalan, jalankan ulang (lihat Masalah 1, Langkah 2)
3. Jika masih loading setelah server berjalan, cek log untuk error

---

### Error: "Process exited with code 1" atau Dev Server Mati Sendiri

**Penyebab Bisa Berbagai:**
- Runtime error
- Port conflict
- Out of memory
- package.json invalid

**SOLUSI:**
1. Cek log untuk detail error:
```bash
tail -100 /tmp/next-dev-final.log
```

2. Cek package.json (lihat Masalah 6, Langkah 1)

3. Jika ada error spesifik, cari solusi di bagian ini
4. Jika tidak jelas, TANYA USER terlebih dahulu
5. Coba jalankan ulang dev server

---

## 📁 STRUKTUR BACKUP

### Lokasi Backup:
```
/home/z/my-project/backups/[tanggal]_[keterangan]/
├── database/           # Backup semua file database (.db)
├── schemas/            # Backup schema.prisma
├── important-files/    # Backup file penting yang diperbaiki
│   ├── pages/         # Backup halaman penting
│   └── api/           # Backup API route penting
├── changed-files/      # File yang dimodifikasi/berubah
├── docs/              # Dokumentasi dan catatan
└── README.md          # Catatan backup
```

### Backup yang Tersedia:
- File database utuh di folder `database/`
- Schema prisma di folder `schemas/`
- File penting (page.tsx, buat/page.tsx, API routes) di folder `important-files/`
- File yang dimodifikasi di folder `changed-files/`
- Dokumentasi ini di folder `docs/`

---

## 🚨 PROSEDUR BACKUP SETELAH PERBAIKAN BERHASIL

### WAJIB DILAKUKAN SETELAH SETIAP PERBAIKAN:

1. **Backup File yang Berfungsi Normal:**
```bash
BACKUP_DIR="/home/z/my-project/backups/$(date +%Y%m%d_%H%M%S)_[KETERANGAN_PERBAIKAN]"
mkdir -p "$BACKUP_DIR"/{changed-files,docs,database,schemas}

# Backup file yang berfungsi normal
cp /home/z/my-project/package.json "$BACKUP_DIR/changed-files/"
cp /home/z/my-project/src/app/dashboard/guru/absensi/page.tsx "$BACKUP_DIR/changed-files/"
# ... tambahkan file penting lainnya
```

2. **Update Catatan Perbaikan:**
- Tambahkan bagian baru di file ini
- Catat error yang terjadi
- Catat solusi yang berhasil
- Catat file yang dimodifikasi/restore

3. **Dokumentasikan di worklog:**
```bash
# Update /home/z/my-project/worklog.md dengan:
# - ID task
# - Error yang dihadapi
# - Langkah perbaikan
# - Hasil yang dicapai
```

---

## 🚨 PROSEDUR DARURAT (JIKA TIDAK BISA DIPERBAIKI)

### Jika Semua Solusi Gagal:

1. **STOP** - Jangan lakukan tindakan lebih lanjut
2. **TANYA USER** - Jelaskan situasi dan minta panduan
3. **DOKUMENTASIKAN** - Catat semua langkah yang sudah dicoba
4. **TUNGGU** - Tunggu instruksi dari USER

### Hal yang TIDAK BOLEH Dilakukan Tanpa Izin:
- ❌ Menghapus `.next`
- ❌ Menghapus database
- ❌ Menghapus atau mengubah file yang sudah normal
- ❌ Menjalankan command yang tidak jelas fungsinya
- ❌ Menginstall/uninstall package
- ❌ Menambahkan komentar ke package.json

---

## 📞 KONTAK BANTUAN

### Jika Tidak Bisa Memperbaiki Sendiri:

1. Baca catatan ini dengan teliti
2. Cek backup yang tersedia
3. Coba solusi yang relevan
4. Jika masih tidak bisa, tanyakan ke USER

### Informasi yang Perlu Disiapkan Saat Minta Bantuan:
- Error message lengkap (copy dari log)
- Langkah yang sudah dicoba
- Screenshot error (jika ada)
- File yang terakhir diubah (jika ada)

---

## ✅ CHECKLIST SETELAH PERBAIKAN

Setelah melakukan perbaikan, pastikan:

- [ ] Dev server berjalan (proses aktif)
- [ ] Server ready di port 3000
- [ ] Halaman utama (http://localhost:3000) bisa diakses
- [ ] Preview panel menampilkan aplikasi (bukan huruf 'Z')
- [ ] Tidak ada error di log server
- [ ] Database terhubung dengan benar
- [ ] API yang penting berfungsi
- [ ] **Backup baru dibuat** (WAJIB!)
- [ ] Catatan perbaikan di-update (WAJIB!)

---

## 📝 CATATAN PERBAIKAN YANG TELAH DILAKUKAN

### Perbaikan Tanggal 2026-03-27 00:47 (DEV SERVER RECOVERY)

**Masalah:**
1. Dev server mati terus setelah start
2. Preview panel muncul sebentar lalu hilang
3. Dev.log tidak ditemukan

**Penyebab:**
1. package.json invalid karena ada komentar `// Trigger rebuild` di akhir file
2. Komentar JavaScript tidak valid di file JSON

**Langkah Perbaikan:**
1. Menghapus komentar invalid dari package.json
2. Menggunakan command yang benar untuk menjalankan dev server:
   ```bash
   (bun next dev -p 3000 > /tmp/next-dev-final.log 2>&1 &) &
   ```
3. Restore absensi/page.tsx dari backup ke versi sebelum perubahan bermasalah

**Hasil:**
✅ Dev server berjalan stabil
✅ Port 3000 listening
✅ Server ready dan menerima request
✅ Preview panel berfungsi normal

**File yang Dimodifikasi:**
- `/home/z/my-project/package.json` - Diperbaiki dari invalid JSON

**File yang Di-restore:**
- `/home/z/my-project/src/app/dashboard/guru/absensi/page.tsx` - Dikembalikan ke versi sebelum perubahan

**Backup yang Dibuat:**
- `/home/z/my-project/backups/20260327_004714_DEV_SERVER_RECOVERY/`

**Pelajaran Penting:**
1. TIDAK BOLEH menambahkan komentar JavaScript ke package.json
2. SELALU gunakan command `(bun next dev -p 3000 > /tmp/next-dev-final.log 2>&1 &) &` untuk menjalankan dev server
3. SELALU backup file yang berfungsi normal setelah perbaikan
4. SELALU update catatan perbaikan

---

### Yang Sudah Diperbaiki (Status Saat Ini):
1. ✅ Auto-fill nama guru di halaman buat RPP
2. ✅ Dev server berjalan di port 3000
3. ✅ Database normal dan terhubung
4. ✅ Semua API berfungsi (rpp, prosem, announcements, dll)
5. ✅ Preview panel normal (bukan lagi huruf 'Z')
6. ✅ package.json valid JSON
7. ✅ Dev server tidak mati sendiri

### File yang Sudah Dimodifikasi (untuk Perbaikan):
1. `/src/app/page.tsx` - Ditambahkan comment
2. `/src/app/dashboard/guru/perencanaan/buat/page.tsx` - Ditambahkan fungsi `fetchUserAndClasses()`
3. `/tmp/next-dev-final.log` - Log dev server terbaru
4. `/home/z/my-project/package.json` - Diperbaiki dari invalid JSON

### File yang DIBUAT BARU:
1. `/home/z/my-project/start-dev.sh` - Script untuk menjalankan dev server
2. `/home/z/my-project/run-dev-server.sh` - Script persisten untuk dev server
3. Catatan ini (`PANDUAN_PERBAIKAN_ERROR.md`)

---

## 🔄 UPDATE CATATAN INI

Setiap melakukan perbaikan atau perubahan penting:
1. Catat langkah yang dilakukan
2. Catat error yang dihadapi
3. Catat solusi yang berhasil
4. Update bagian "Yang Sudah Diperbaiki" di atas
5. **BUAT BACKUP BARU** jika ada perubahan file/database (WAJIB!)
6. Update bagian "CATATAN PERBAIKAN YANG TELAH DILAKUKAN" di atas

---

**Dokumentasi ini dibuat untuk membantu perbaikan di masa depan.**
**Jangan lupa untuk selalu baca dan patuhi aturan yang tercantum di bagian atas.**
**Saat ini versi: v2.0 (Updated 2026-03-27 00:47)**
