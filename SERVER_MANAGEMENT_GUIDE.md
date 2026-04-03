# SERVER MANAGEMENT GUIDE - RA INSAN MADANI

**Last Updated:** 2026-03-27 01:00
**Purpose:** Panduan manajemen server karena server di luar jangkauan user

---

## 📋 ATURAN KRUSIAL (WAJIB DIPATUHI)

### YANG TIDAK BOLEH DILAKUKAN:

1. ❌ **JANGAN PERNAH** menghapus folder `.next` atau build cache
2. ❌ **JANGAN PERNAH** menghapus atau mengubah database yang sudah normal
3. ❌ **JANGAN PERNAH** menghapus file yang sudah berfungsi baik
4. ❌ **JANGAN PERNAH** menambahkan komentar ke `package.json` (tidak valid untuk JSON)
5. ❌ **JANGAN PERNAH** menghapus cache bun/node_modules kecuali perlu
6. ❌ **JANGAN PERNAH** mengambil tindakan drastis tanpa membaca panduan
7. ❌ **JANGAN PERNAH** lakukan backup RESTORE kecuali diminta

### YANG WAJIB DILAKUKAN:

1. ✅ **SELALU** baca panduan ini sebelum perbaikan
2. ✅ **SELALU** cek database file sebelum mengambil tindakan drastis
3. ✅ **SELALU** gunakan command yang sudah terbukti berhasil
4. ✅ **SELALU** backup file yang berfungsi normal setelah perbaikan
5. ✅ **SELALU** update catatan perbaikan di worklog.md
6. ✅ **SELALU** gunakan `bun run db:generate` setelah install/reinstall
7. ✅ **SELALU** restart dev server dengan command yang benar

---

## 🚀 COMMANDS YANG SUDAH TERBUKTI BERHASIL

### 1. Menjalankan Dev Server

**Command YANG BENAR (TERBUKTI BERHASIL):**
```bash
cd /home/z/my-project
(bun next dev -p 3000 > /tmp/next-dev-final.log 2>&1 &) &
```

**JANGAN GUNAKAN:**
- ❌ `bun run dev &` (tanpa redirection ke log)
- ❌ `nohup bun run dev` (sering mati)

### 2. Mematikan Dev Server

**Command YANG BENAR:**
```bash
pkill -f "bun next dev"
pkill -f "next dev"
```

**VERIFIKASI:**
```bash
ps aux | grep "next dev" | grep -v grep
# Harus tidak ada output
```

### 3. Memeriksa Status Dev Server

```bash
# Cek proses
ps aux | grep "next dev" | grep -v grep

# Cek port 3000
netstat -tlnp 2>/dev/null | grep 3000 || ss -tlnp 2>/dev/null | grep 3000

# Cek log
tail -30 /tmp/next-dev-final.log
```

### 4. Memperbaiki Prisma Client (JIKA LOGIN GAGAL)

**Command TERBUKTI BERHASIL:**
```bash
cd /home/z/my-project

# 1. Cek database masih ada
ls -lh /home/z/my-project/db/custom.db
# Harus muncul file dengan ukuran > 5MB

# 2. Hapus cache Prisma yang bermasalah
rm -rf /home/z/.bun/install/cache/@prisma

# 3. Reinstall dependencies
bun install

# 4. Generate Prisma Client
bun run db:generate

# 5. Verifikasi dengan script
cat > verify-db.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function verify() {
  const count = await prisma.user.count();
  console.log('Total Users:', count);
  await prisma.$disconnect();
}
verify();
EOF
bun run verify-db.ts

# 6. Restart dev server
pkill -f "bun next dev"
pkill -f "next dev"
(bun next dev -p 3000 > /tmp/next-dev-final.log 2>&1 &) &
```

### 5. Backup (WAJIB SETELAH SETIAP PERBAIKAN)

**Quick Backup (file penting saja):**
```bash
cd /home/z/my-project
bash backup-quick.sh
# ATAU
bun run backup:quick
```

**Full Backup (termasuk database):**
```bash
cd /home/z/my-project
bash backup-full.sh
# ATAU
bun run backup:full
```

**KAPAN MENGUNAKAN:**
- `backup:quick` - Setelah perbaikan kecil/medium
- `backup:full` - Setelah perubahan besar atau sebelum operasi berisiko

---

## 🔍 CHECKLIST SEBELUM & SESUDAH PERBAIKAN

### SEBELUM PERBAIKAN:

- [ ] Baca panduan perbaikan error: `/home/z/my-project/backups/20260325_125045_PREVIEW_PANEL_RECOVERY/docs/PANDUAN_PERBAIKAN_ERROR.md`
- [ ] Cek dev.log untuk error detail
- [ ] Cek database file masih ada: `ls -lh /home/z/my-project/db/custom.db`
- [ ] Identifikasi masalah dengan jelas
- [ ] Siapkan solusi yang sesuai

### SESUDAH PERBAIKAN:

- [ ] Dev server berjalan stabil (verifikasi dengan `ps aux | grep "next dev"`)
- [ ] Port 3000 listening
- [ ] Preview panel normal
- [ ] Login berfungsi
- [ ] Tidak ada error di log
- [ ] **BUAT BACKUP** (wajib!)
- [ ] Update worklog.md dengan detail perbaikan
- [ ] Update panduan jika ada solusi baru

---

## 🆘 TROUBLESHOOTING - ERROR UMUM

### Masalah 1: Login Gagal

**Cek Pertama:**
```bash
# Apakah database masih ada?
ls -lh /home/z/my-project/db/custom.db
```

**Jika database ada:**
- Masalahnya adalah Prisma Client, bukan database
- Ikuti langkah "Memperbaiki Prisma Client" di atas

**Jika database tidak ada:**
- Restore dari backup terbaru
- Cari di: `/home/z/my-project/backups/*/database/`

### Masalah 2: Dev Server Mati Terus

**Cek package.json:**
```bash
# Validasi JSON
cat package.json | python3 -m json.tool > /dev/null 2>&1 && echo "Valid" || echo "INVALID!"
```

**Jika invalid:**
- Cek apakah ada komentar di akhir file: `tail -5 package.json`
- Hapus komentar tersebut
- Restore dari backup jika perlu

**Jika valid:**
- Cek log error: `tail -100 /tmp/next-dev-final.log`
- Cari solusi di panduan perbaikan error

### Masalah 3: Preview Panel Hanya Menampilkan 'Z'

**Langkah Perbaikan:**
```bash
# 1. Cek apakah dev server berjalan
ps aux | grep "next dev" | grep -v grep

# 2. Jika tidak berjalan, start ulang
cd /home/z/my-project
(bun next dev -p 3000 > /tmp/next-dev-final.log 2>&1 &) &

# 3. Tunggu 10 detik, cek lagi
sleep 10
ps aux | grep "next dev" | grep -v grep
tail -30 /tmp/next-dev-final.log
```

---

## 📁 STRUKTUR FILE PENTING

### Database:
- `/home/z/my-project/db/custom.db` - Database utama (5.7MB, 8 users)

### Configuration:
- `/home/z/my-project/package.json` - Dependencies dan scripts (SUDAH ADA predev!)
- `/home/z/my-project/.env` - Environment variables
- `/home/z/my-project/prisma/schema.prisma` - Schema database

### Logs:
- `/tmp/next-dev-final.log` - Log dev server terbaru
- `/home/z/my-project/dev.log` - Log dev server di project root

### Documentation:
- `/home/z/my-project/backups/20260325_125045_PREVIEW_PANEL_RECOVERY/docs/PANDUAN_PERBAIKAN_ERROR.md` - Panduan perbaikan error lengkap
- `/home/z/my-project/worklog.md` - Catatan semua perbaikan

### Backup Scripts:
- `/home/z/my-project/backup-quick.sh` - Quick backup
- `/home/z/my-project/backup-full.sh` - Full backup
- `/home/z/my-project/backup-changes.sh` - Script backup lama

---

## 🔄 PREVENTIVE MEASURES YANG SUDAH DIIMPLEMENTASI

### 1. predev Script (SUDAH DITAMBAH KE package.json)

**Apa yang dilakukan:**
- Setiap kali `bun run dev` dijalankan, `prisma generate` otomatis dijalankan
- Mencegah masalah Prisma Client tidak valid

**Cek di package.json:**
```json
{
  "scripts": {
    "predev": "prisma generate",
    "dev": "next dev -p 3000 2>&1 | tee dev.log"
  }
}
```

### 2. Backup Scripts (SUDAH DIBUAT)

**backup-quick.sh:**
- Backup file penting saja (package.json, schema.prisma, .env, dll)
- Dijalankan dengan: `bash backup-quick.sh` atau `bun run backup:quick`

**backup-full.sh:**
- Backup lengkap termasuk database
- Dijalankan dengan: `bash backup-full.sh` atau `bun run backup:full`

### 3. Panduan Perbaikan Error (SUDAH DIPERBARUI)

**Lokasi:** `/home/z/my-project/backups/20260325_125045_PREVIEW_PANEL_RECOVERY/docs/PANDUAN_PERBAIKAN_ERROR.md`

**Isi:**
- Solusi untuk dev server mati
- Solusi untuk Prisma Client error
- Solusi untuk package.json invalid
- Procedur backup dan restore

---

## 📝 CHECKLIST HARIAN

Setiap hari sebelum bekerja:

- [ ] Baca panduan ini
- [ ] Cek status dev server
- [ ] Cek apakah ada error di log
- [ ] Pastikan database file masih ada

Setiap kali selesai perbaikan:

- [ ] Verifikasi dev server berjalan
- [ ] Verifikasi login berfungsi
- [ ] BUAT BACKUP
- [ ] Update worklog.md
- [ ] Update panduan jika ada solusi baru

---

## ⚠️ EMERGENCY PROCEDURES

### Jika Semua Solusi Gagal:

1. **STOP** - Jangan lakukan tindakan lebih lanjut
2. **READ** - Baca panduan perbaikan error lagi
3. **CHECK** - Cek backup yang tersedia
4. **WAIT** - Tunggu instruksi dari user
5. **DOCUMENT** - Catat semua yang sudah dicoba

### Hal yang TIDAK BOLEH DILAKUKAN TANPA IZIN:

- ❌ Menghapus `.next`
- ❌ Menghapus database
- ❌ Menghapus file yang sudah normal
- ❌ Menginstall/uninstall package
- ❌ Mengubah schema database
- ❌ Menjalankan command yang tidak jelas

---

## 📊 STATISTIK MASALAH YANG SUDAH DIPERBAIKI

### 2026-03-27:
1. ✅ Dev server mati terus - Diperbaiki dengan command yang benar
2. ✅ package.json invalid - Diperbaiki dengan menghapus komentar
3. ✅ Prisma Client error - Diperbaiki dengan generate ulang
4. ✅ Login gagal - Diperbaiki dengan perbaikan Prisma Client

### Root Cause yang Ditemukan:
- Masalah login gagal bukan karena database hilang
- Masalahnya adalah Prisma Client yang tidak valid
- Ini terjadi ketika dev server error dan cache terpengaruh

---

**INGAT:** Server ini di luar jangkauan user. Saya bertanggung jawab penuh atas manajemen server. Selalu berhati-hati dan ikuti panduan ini.
