#!/bin/bash
# Full Backup Script - Backup lengkap termasuk database
# Gunakan ini setelah perubahan besar atau sebelum operasi berisiko

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/z/my-project/backups/${TIMESTAMP}_FULL_BACKUP"
CHANGED_FILES_DIR="$BACKUP_DIR/changed-files"
DATABASE_DIR="$BACKUP_DIR/database"
DOCS_DIR="$BACKUP_DIR/docs"

echo "==================================="
echo "FULL BACKUP - RA INSAN MADANI"
echo "==================================="
echo "Waktu: $(date)"
echo "Lokasi: $BACKUP_DIR"
echo ""

# Buat direktori backup
mkdir -p "$CHANGED_FILES_DIR"
mkdir -p "$DATABASE_DIR"
mkdir -p "$DOCS_DIR"

# Backup file penting
echo "Membuat backup file penting..."

FILES_TO_BACKUP=(
  "package.json"
  "prisma/schema.prisma"
  ".env"
  "src/app/page.tsx"
  "src/lib/db.ts"
  "src/components/dashboard/dashboard-layout.tsx"
)

PROJECT_DIR="/home/z/my-project"
for file in "${FILES_TO_BACKUP[@]}"; do
  if [ -f "$PROJECT_DIR/$file" ]; then
    cp "$PROJECT_DIR/$file" "$CHANGED_FILES_DIR/"
    echo "✓ $file"
  fi
done

# Backup database
echo ""
echo "Membuat backup database..."
if [ -f "$PROJECT_DIR/db/custom.db" ]; then
  cp "$PROJECT_DIR/db/custom.db" "$DATABASE_DIR/custom.db"
  echo "✓ Database: custom.db ($(du -h "$DATABASE_DIR/custom.db" | cut -f1))"
fi

# Copy dokumentasi perbaikan error
echo ""
echo "Membuat backup dokumentasi..."
ERROR_GUIDE="/home/z/my-project/backups/20260325_125045_PREVIEW_PANEL_RECOVERY/docs/PANDUAN_PERBAIKAN_ERROR.md"
if [ -f "$ERROR_GUIDE" ]; then
  cp "$ERROR_GUIDE" "$DOCS_DIR/"
  echo "✓ PANDUAN_PERBAIKAN_ERROR.md"
fi

if [ -f "$PROJECT_DIR/worklog.md" ]; then
  cp "$PROJECT_DIR/worklog.md" "$DOCS_DIR/"
  echo "✓ worklog.md"
fi

if [ -f "$PROJECT_DIR/SERVER_MANAGEMENT_GUIDE.md" ]; then
  cp "$PROJECT_DIR/SERVER_MANAGEMENT_GUIDE.md" "$DOCS_DIR/"
  echo "✓ SERVER_MANAGEMENT_GUIDE.md"
fi

# Buat README
cat > "$BACKUP_DIR/README.md" << EOF
# Full Backup - $TIMESTAMP

**Waktu:** $(date)
**Tipe:** Full Backup (termasuk database)

## File yang Di-backup

### Changed Files:
$(ls "$CHANGED_FILES_DIR" | sed 's/^/- /')

### Database:
$(ls "$DATABASE_DIR" | sed 's/^/- /')

### Documentation:
$(ls "$DOCS_DIR" | sed 's/^/- /')

## Cara Restore

### Restore File:
\`\`\`bash
BACKUP_DIR="$BACKUP_DIR"
cp "\$BACKUP_DIR/changed-files/"* /home/z/my-project/
\`\`\`

### Restore Database:
\`\`\`bash
BACKUP_DIR="$BACKUP_DIR"
cp "\$BACKUP_DIR/database/custom.db" /home/z/my-project/db/
\`\`\`

### Restore Semua:
\`\`\`bash
BACKUP_DIR="$BACKUP_DIR"
cp "\$BACKUP_DIR/changed-files/"* /home/z/my-project/
cp "\$BACKUP_DIR/database/custom.db" /home/z/my-project/db/
# Restart dev server
\`\`\`
EOF

echo ""
echo "==================================="
echo "✓ FULL BACKUP SELESAI"
echo "==================================="
echo "Lokasi: $BACKUP_DIR"
echo "File penting: $(ls "$CHANGED_FILES_DIR" | wc -l)"
echo "Database: $(ls "$DATABASE_DIR" | wc -l)"
echo "Dokumentasi: $(ls "$DOCS_DIR" | wc -l)"
echo ""
echo "Gunakan 'bun run backup:quick' untuk backup cepat (tanpa database)"
