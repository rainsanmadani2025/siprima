# Backup - Format Absensi Baru (Per Siswa)

**Waktu:** 2026-03-26 13:21:25
**Deskripsi:** Mengubah format absensi dari matriks multi-siswa menjadi format per siswa dengan kolom Tanggal, Jam Masuk/Pulang, dan Status Kehadiran

## Perubahan yang Dilakukan

### 1. Halaman Absensi (`src/app/dashboard/guru/absensi/page.tsx`)
- Mengubah format dari matriks (siswa x tanggal) menjadi format per siswa (tanggal x status)
- Menampilkan nama dan NISN siswa di bagian atas
- Kolom: No, Tanggal, Absen (Masuk, Pulang), Kehadiran (Hadir, Sakit, Izin, Alpa), Keterangan
- Hari Sabtu & Minggu ditandai dengan background merah dan teks "LIBUR"
- Input jam masuk dan jam keluar menggunakan time picker
- Status kehadiran menggunakan radio button
- Kolom keterangan untuk catatan tambahan

### 2. API Baru
- `/api/guru/attendance/student-month/route.ts` - Mengambil data absensi per siswa per bulan
- `/api/guru/attendance/save-student/route.ts` - Menyimpan data absensi per siswa

## File yang Di-backup

### Halaman Dashboard:
- absensi-page.tsx (format baru)

### API Routes:
- student-month-route.ts (API baru)
- save-student-route.ts (API baru)
- attendance-month-route.ts (API lama)
- attendance-save-route.ts (API lama)
- save-assessment-route.ts
- get-assessment-route.ts
- guru-profile-route.ts

### Components:
- sidebar.tsx

### Halaman Lain:
- raport-page.tsx
- penilaian-page.tsx

### Database:
- custom.db

## Cara Restore

### Restore Semua File:
```bash
BACKUP_DIR="/home/z/my-project/backups/20260326_132125_CHANGES"

# Halaman Absensi (format baru)
cp "$BACKUP_DIR/changed-files/absensi-page.tsx" /home/z/my-project/src/app/dashboard/guru/absensi/page.tsx

# API Routes baru
cp "$BACKUP_DIR/changed-files/student-month-route.ts" /home/z/my-project/src/app/api/guru/attendance/student-month/route.ts
cp "$BACKUP_DIR/changed-files/save-student-route.ts" /home/z/my-project/src/app/api/guru/attendance/save-student/route.ts

# API Routes lama (jika perlu)
cp "$BACKUP_DIR/changed-files/save-assessment-route.ts" /home/z/my-project/src/app/api/guru/save-assessment/route.ts
cp "$BACKUP_DIR/changed-files/get-assessment-route.ts" /home/z/my-project/src/app/api/guru/get-assessment/route.ts
cp "$BACKUP_DIR/changed-files/guru-profile-route.ts" /home/z/my-project/src/app/api/guru/profile/route.ts
cp "$BACKUP_DIR/changed-files/attendance-month-route.ts" /home/z/my-project/src/app/api/guru/attendance/month/route.ts
cp "$BACKUP_DIR/changed-files/attendance-save-route.ts" /home/z/my-project/src/app/api/guru/attendance/save/route.ts

# Components
cp "$BACKUP_DIR/changed-files/sidebar.tsx" /home/z/my-project/src/components/dashboard/sidebar.tsx

# Halaman lain (jika perlu)
cp "$BACKUP_DIR/changed-files/raport-page.tsx" /home/z/my-project/src/app/dashboard/guru/raport/page.tsx
cp "$BACKUP_DIR/changed-files/penilaian-page.tsx" /home/z/my-project/src/app/dashboard/guru/penilaian/page.tsx
```

### Restore Database:
```bash
cp "/home/z/my-project/backups/20260326_132125_CHANGES/database/custom.db" /home/z/my-project/db/custom.db
```

---
