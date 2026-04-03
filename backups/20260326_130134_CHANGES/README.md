# Backup - Ubah warna hari Sabtu & Minggu dari gray ke merah di absensi matriks

**Waktu:** 2026-03-26 13:01:34
**Deskripsi:** Ubah warna hari Sabtu & Minggu dari gray ke merah di absensi matriks

## File yang Di-backup

### Halaman Dashboard:
- raport-page.tsx
- penilaian-page.tsx
- absensi-page.tsx

### API Routes:
- save-assessment-route.ts
- get-assessment-route.ts
- guru-profile-route.ts
- attendance-month-route.ts
- attendance-save-route.ts

### Components:
- sidebar.tsx

### Database:
- custom.db

## Cara Restore

### Restore Semua File:
```bash
BACKUP_DIR="/home/z/my-project/backups/20260326_130134_CHANGES"

cp "$BACKUP_DIR/changed-files/raport-page.tsx" /home/z/my-project/src/app/dashboard/guru/raport/page.tsx
cp "$BACKUP_DIR/changed-files/penilaian-page.tsx" /home/z/my-project/src/app/dashboard/guru/penilaian/page.tsx
cp "$BACKUP_DIR/changed-files/absensi-page.tsx" /home/z/my-project/src/app/dashboard/guru/absensi/page.tsx
cp "$BACKUP_DIR/changed-files/save-assessment-route.ts" /home/z/my-project/src/app/api/guru/save-assessment/route.ts
cp "$BACKUP_DIR/changed-files/get-assessment-route.ts" /home/z/my-project/src/app/api/guru/get-assessment/route.ts
cp "$BACKUP_DIR/changed-files/guru-profile-route.ts" /home/z/my-project/src/app/api/guru/profile/route.ts
cp "$BACKUP_DIR/changed-files/attendance-month-route.ts" /home/z/my-project/src/app/api/guru/attendance/month/route.ts
cp "$BACKUP_DIR/changed-files/attendance-save-route.ts" /home/z/my-project/src/app/api/guru/attendance/save/route.ts
cp "$BACKUP_DIR/changed-files/sidebar.tsx" /home/z/my-project/src/components/dashboard/sidebar.tsx
```

### Restore Database:
```bash
cp "/home/z/my-project/backups/20260326_130134_CHANGES/database/custom.db" /home/z/my-project/db/custom.db
```

---
