#!/bin/bash
# Script untuk backup perubahan setelah testing normal
# Usage: ./backup-changes.sh "Deskripsi perubahan"

DESCRIPTION="${1:-Backup tanpa deskripsi}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/z/my-project/backups/${TIMESTAMP}_CHANGES"

echo "==================================="
echo "BACKUP SCRIPT - RA INSAN MADANI"
echo "==================================="
echo "Waktu: $(date)"
echo "Deskripsi: $DESCRIPTION"
echo "Lokasi Backup: $BACKUP_DIR"
echo ""

# Buat direktori backup
mkdir -p "$BACKUP_DIR/changed-files"
mkdir -p "$BACKUP_DIR/database"
mkdir -p "$BACKUP_DIR/api"
mkdir -p "$BACKUP_DIR/pages"
mkdir -p "$BACKUP_DIR/components"

echo "✓ Direktori backup dibuat"

# Backup file penting
FILES_TO_BACKUP=(
  "src/app/dashboard/guru/raport/page.tsx:changed-files/raport-page.tsx"
  "src/app/dashboard/guru/penilaian/page.tsx:changed-files/penilaian-page.tsx"
  "src/app/dashboard/guru/absensi/page.tsx:changed-files/absensi-page.tsx"
  "src/app/api/guru/save-assessment/route.ts:changed-files/save-assessment-route.ts"
  "src/app/api/guru/get-assessment/route.ts:changed-files/get-assessment-route.ts"
  "src/app/api/guru/profile/route.ts:changed-files/guru-profile-route.ts"
  "src/app/api/guru/attendance/month/route.ts:changed-files/attendance-month-route.ts"
  "src/app/api/guru/attendance/save/route.ts:changed-files/attendance-save-route.ts"
  "src/components/dashboard/sidebar.tsx:changed-files/sidebar.tsx"
  "db/custom.db:database/custom.db"
)

BACKED_UP_COUNT=0
FAILED_COUNT=0

for FILE_MAPPING in "${FILES_TO_BACKUP[@]}"; do
  SOURCE="${FILE_MAPPING%%:*}"
  DEST="$BACKUP_DIR/${FILE_MAPPING##*:}"
  
  if [ -f "/home/z/my-project/$SOURCE" ]; then
    cp "/home/z/my-project/$SOURCE" "/home/z/my-project/$DEST"
    echo "✓ $SOURCE"
    ((BACKED_UP_COUNT++))
  else
    echo "✗ $SOURCE (FILE TIDAK DITEMUKAN)"
    ((FAILED_COUNT++))
  fi
done

echo ""
echo "==================================="
echo "BACKUP SUMMARY"
echo "==================================="
echo "Berhasil backup: $BACKED_UP_COUNT file"
echo "Gagal backup: $FAILED_COUNT file"
echo "Lokasi: $BACKUP_DIR"
echo ""

# Buat file dokumentasi
cat > "$BACKUP_DIR/README.md" <<EOF
# Backup - $DESCRIPTION

**Waktu:** $(date '+%Y-%m-%d %H:%M:%S')
**Deskripsi:** $DESCRIPTION

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
\`\`\`bash
BACKUP_DIR="$BACKUP_DIR"

cp "\$BACKUP_DIR/changed-files/raport-page.tsx" /home/z/my-project/src/app/dashboard/guru/raport/page.tsx
cp "\$BACKUP_DIR/changed-files/penilaian-page.tsx" /home/z/my-project/src/app/dashboard/guru/penilaian/page.tsx
cp "\$BACKUP_DIR/changed-files/absensi-page.tsx" /home/z/my-project/src/app/dashboard/guru/absensi/page.tsx
cp "\$BACKUP_DIR/changed-files/save-assessment-route.ts" /home/z/my-project/src/app/api/guru/save-assessment/route.ts
cp "\$BACKUP_DIR/changed-files/get-assessment-route.ts" /home/z/my-project/src/app/api/guru/get-assessment/route.ts
cp "\$BACKUP_DIR/changed-files/guru-profile-route.ts" /home/z/my-project/src/app/api/guru/profile/route.ts
cp "\$BACKUP_DIR/changed-files/attendance-month-route.ts" /home/z/my-project/src/app/api/guru/attendance/month/route.ts
cp "\$BACKUP_DIR/changed-files/attendance-save-route.ts" /home/z/my-project/src/app/api/guru/attendance/save/route.ts
cp "\$BACKUP_DIR/changed-files/sidebar.tsx" /home/z/my-project/src/components/dashboard/sidebar.tsx
\`\`\`

### Restore Database:
\`\`\`bash
cp "$BACKUP_DIR/database/custom.db" /home/z/my-project/db/custom.db
\`\`\`

---
EOF

echo "✓ Dokumentasi dibuat: $BACKUP_DIR/README.md"

if [ $FAILED_COUNT -eq 0 ]; then
  echo ""
  echo "✅ BACKUP BERHASIL - Semua file ter-backup"
  echo ""
  echo "Catatan: Tambahkan catatan perubahan di $BACKUP_DIR/CHANGELOG.md jika perlu"
else
  echo ""
  echo "⚠️  BACKUP SELESAI DENGAN WARNING - $FAILED_COUNT file gagal di-backup"
  echo "Silakan cek file yang tidak ditemukan di atas"
fi

echo ""
echo "==================================="
