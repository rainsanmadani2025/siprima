# PANDUAN PERBAIKAN ERROR - PREVIEW PANEL & DEV SERVER

**Dibuat:** 2025-03-25 12:50  
**Tujuan:** Dokumentasi langkah-langkah perbaikan jika terjadi error di preview panel atau dev server

---

## ⚠️ ATURAN KRUSIAL (WAJIB DIPATUHI)

### TIDAK BOLEH DILAKUKAN (KECUALI TERPAKSA DAN IZIN USER):
1. ❌ **JANGAN PERNAH** menghapus folder `.next` atau build cache
2. ❌ **JANGAN PERNAH** menghapus atau mengubah database yang sudah normal
3. ❌ **JANGAN PERNAH** menghapus file yang sudah berfungsi baik
4. ❌ **JANGAN PERNAH** mengambil tindakan tanpa bertanya ke USER terlebih dahulu

### WAJIB DILAKUKAN:
1. ✅ **SELALU** tanya USER jika ada masalah yang tidak jelas
2. ✅ **SELALU** minta izin sebelum tindakan yang berpotensi berisiko
3. ✅ **SELALU** gunakan pendekatan paling aman terlebih dahulu
4. ✅ **SELALU** baca catatan ini sebelum perbaikan

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

# Cara 1: Jalankan di background (GUNAKAN INI)
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

## 🔧 MASALAH UMUM DAN SOLUSI

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

**SOLUSI:**
1. Cek log untuk detail error:
```bash
tail -100 /tmp/next-dev-final.log
```

2. Jika ada error spesifik, cari solusi di bagian ini
3. Jika tidak jelas, TANYA USER terlebih dahulu
4. Coba jalankan ulang dev server

---

### Error: "@prisma/client did not initialize yet" atau Login Gagal

**Gejala:**
- Tidak bisa login ke aplikasi
- Preview panel menampilkan aplikasi tapi login tidak berfungsi
- Error di log: `@prisma/client did not initialize yet. Please run "prisma generate"`
- Error: `Cannot find module '.prisma/client/default'`

**Penyebab Utama:**
1. Prisma Client tidak ter-generate dengan benar
2. Cache bun memiliki versi Prisma yang berbeda dengan package.json
3. node_modules/.prisma rusak atau tidak valid

**SOLUSI (TANPA MENGHAPUS DATABASE):**

#### Langkah 1: Verifikasi Database Masih Ada
```bash
# Cek apakah database file masih ada
ls -lh /home/z/my-project/db/custom.db

# Database harus masih ada (tidak dihapus)
# Jika database hilang, restore dari backup
```

#### Langkah 2: Perbaiki Prisma Client
```bash
cd /home/z/my-project

# Hapus cache Prisma di bun
rm -rf /home/z/.bun/install/cache/@prisma

# Reinstall dependencies
bun install

# Generate Prisma Client
bun run db:generate
```

#### Langkah 3: Verifikasi Prisma Client
```bash
# Buat script cek users
cat > check-users.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, name: true, role: true }
    });
    console.log('Total Users:', users.length);
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
EOF

# Jalankan script
bun run check-users.ts
```

**Hasil yang Diharapkan:**
- Harus menampilkan jumlah users (contoh: "Total Users: 8")
- Jika berhasil, Prisma Client sudah normal

#### Langkah 4: Restart Dev Server
```bash
# Kill old processes
pkill -f "bun next dev"
pkill -f "next dev"
sleep 2

# Start new dev server
(bun next dev -p 3000 > /tmp/next-dev-final.log 2>&1 &) &

# Cek status
sleep 10
ps aux | grep "next dev" | grep -v grep
tail -30 /tmp/next-dev-final.log
```

#### Langkah 5: Cek Login
- Buka aplikasi di preview panel
- Coba login dengan user yang ada
- Login seharusnya berhasil

**PENTING:**
- Database TIDAK perlu dihapus atau di-restore
- Masalahnya adalah Prisma Client, bukan database
- SELALU jalankan `bun run db:generate` setelah install/reinstall dependencies
- JANGAN menghapus cache bun kecuali perlu

---

## 🔄 SOLUSI PERMANEN UNTUK MENCEGAH MASALAH INI

### Masalah Ini Berulang Ketika:
- Dev server error dan di-restart
- Dependencies di-reinstall
- Cache/node_modules terpengaruh

### Opsi 1: Tambahkan predev Script (REKOMENDASI)
Edit `package.json`:
```json
{
  "scripts": {
    "predev": "prisma generate",
    "dev": "next dev -p 3000 2>&1 | tee dev.log"
  }
}
```

**Keuntungan:** Prisma Client otomatis di-generate setiap kali dev server dijalankan

### Opsi 2: Cek Prisma di Awal
Buat script start-dev.sh:
```bash
#!/bin/bash
cd /home/z/my-project

# Generate Prisma Client setiap kali
bun run db:generate

# Start dev server
bun run dev
```

### Opsi 3: Jangan Sentuh Cache Kecuali Perlu
- Hanya hapus cache jika benar-benar perlu
- Setelah menghapus, SELALU jalankan `bun run db:generate`

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
├── docs/              # Dokumentasi dan catatan
└── SESSION_LOG.md     # Log perubahan yang dilakukan
```

### Backup yang Tersedia:
- File database utuh di folder `database/`
- Schema prisma di folder `schemas/`
- File penting (page.tsx, buat/page.tsx, API routes) di folder `important-files/`
- Dokumentasi ini di folder `docs/`

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
- [ ] Backup baru dibuat (jika ada perubahan penting)

---

## 📝 CATATAN PENTING

### Yang Sudah Diperbaiki (Status Saat Ini):
1. ✅ Auto-fill nama guru di halaman buat RPP
2. ✅ Dev server berjalan di port 3000
3. ✅ Database normal dan terhubung
4. ✅ Semua API berfungsi (rpp, prosem, announcements, dll)
5. ✅ Preview panel normal (bukan lagi huruf 'Z')

### File yang Sudah Dimodifikasi (untuk Perbaikan):
1. `/src/app/page.tsx` - Ditambahkan comment
2. `/src/app/dashboard/guru/perencanaan/buat/page.tsx` - Ditambahkan fungsi `fetchUserAndClasses()`
3. `/tmp/next-dev-final.log` - Log dev server terbaru

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
5. Buat backup baru jika ada perubahan file/database

---

**Dokumentasi ini dibuat untuk membantu perbaikan di masa depan.**
**Jangan lupa untuk selalu baca dan patuhi aturan yang tercantum di bagian atas.**
