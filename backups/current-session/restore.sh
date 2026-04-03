#!/bin/bash

# Restore Script - Session Backup 2025-03-25

BACKUP_DIR="/home/z/my-project/backups/current-session"
DB_BACKUP="$BACKUP_DIR/custom.db"
FILE_BACKUP="$BACKUP_DIR/changed-files/export-pdf-route-v4-fixed.ts"
DB_TARGET="/home/z/my-project/db/custom.db"
FILE_TARGET="/home/z/my-project/src/app/api/rpp/export-pdf/route.ts"

echo "======================================"
echo "  Restore Script - Current Session    "
echo "======================================"
echo ""

# Check if backup exists
if [ ! -f "$DB_BACKUP" ]; then
    echo "❌ Database backup tidak ditemukan: $DB_BACKUP"
    exit 1
fi

if [ ! -f "$FILE_BACKUP" ]; then
    echo "❌ File backup tidak ditemukan: $FILE_BACKUP"
    exit 1
fi

echo "✓ Backup ditemukan"
echo ""

# Restore database
echo "📦 Restore database..."
cp "$DB_BACKUP" "$DB_TARGET"
if [ $? -eq 0 ]; then
    echo "✓ Database berhasil di-restore"
else
    echo "❌ Gagal restore database"
    exit 1
fi
echo ""

# Restore file
echo "📄 Restore export PDF route..."
cp "$FILE_BACKUP" "$FILE_TARGET"
if [ $? -eq 0 ]; then
    echo "✓ File berhasil di-restore"
else
    echo "❌ Gagal restore file"
    exit 1
fi
echo ""

echo "======================================"
echo "  Restore Selesai!                     "
echo "======================================"
echo ""
echo "Langkah selanjutnya:"
echo "1. Restart dev server: bun run dev"
echo "2. Buka http://localhost:3000 di browser"
echo "3. Verifikasi aplikasi berjalan normal"
echo ""
echo "Log tersimpan di: /home/z/my-project/dev.log"
