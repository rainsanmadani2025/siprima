#!/bin/bash
# Quick Backup Script - Backup file penting setelah perubahan
# Gunakan ini setelah perbaikan/perubahan yang berhasil

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/z/my-project/backups/${TIMESTAMP}_QUICK_BACKUP"
CHANGED_FILES_DIR="$BACKUP_DIR/changed-files"

echo "==================================="
echo "QUICK BACKUP - RA INSAN MADANI"
echo "==================================="
echo "Waktu: $(date)"
echo "Lokasi: $BACKUP_DIR"
echo ""

# Buat direktori backup
mkdir -p "$CHANGED_FILES_DIR"

# Backup file penting
echo "Membuat backup file penting..."

FILES_TO_BACKUP=(
  "package.json"
  "prisma/schema.prisma"
  ".env"
  "src/app/page.tsx"
  "src/lib/db.ts"
)

PROJECT_DIR="/home/z/my-project"
for file in "${FILES_TO_BACKUP[@]}"; do
  if [ -f "$PROJECT_DIR/$file" ]; then
    cp "$PROJECT_DIR/$file" "$CHANGED_FILES_DIR/"
    echo "✓ $file"
  fi
done

# Copy dokumentasi perbaikan error
ERROR_GUIDE="/home/z/my-project/backups/20260325_125045_PREVIEW_PANEL_RECOVERY/docs/PANDUAN_PERBAIKAN_ERROR.md"
if [ -f "$ERROR_GUIDE" ]; then
  mkdir -p "$BACKUP_DIR/docs"
  cp "$ERROR_GUIDE" "$BACKUP_DIR/docs/"
  echo "✓ PANDUAN_PERBAIKAN_ERROR.md"
fi

# Copy server management guide
if [ -f "$PROJECT_DIR/SERVER_MANAGEMENT_GUIDE.md" ]; then
  mkdir -p "$BACKUP_DIR/docs"
  cp "$PROJECT_DIR/SERVER_MANAGEMENT_GUIDE.md" "$BACKUP_DIR/docs/"
  echo "✓ SERVER_MANAGEMENT_GUIDE.md"
fi

# Buat README
cat > "$BACKUP_DIR/README.md" << EOF
# Quick Backup - $TIMESTAMP

**Waktu:** $(date)
**Tipe:** Quick Backup (file penting saja)

## File yang Di-backup
$(ls -la "$CHANGED_FILES_DIR" | tail -n +2 | awk '{print "- " $NF}')

## Cara Restore
\`\`\`bash
BACKUP_DIR="$BACKUP_DIR"
cp "\$BACKUP_DIR/changed-files/"* /home/z/my-project/
# Restart dev server jika perlu
\`\`\`
EOF

echo ""
echo "==================================="
echo "✓ BACKUP SELESAI"
echo "==================================="
echo "Lokasi: $BACKUP_DIR"
echo "Total file: $(ls "$CHANGED_FILES_DIR" | wc -l)"
echo ""
echo "Gunakan 'bun run backup:full' untuk backup lengkap (termasuk database)"
