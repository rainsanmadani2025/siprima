# Quick Backup - 20260327_010413

**Waktu:** Fri Mar 27 01:04:13 UTC 2026
**Tipe:** Quick Backup (file penting saja)

## File yang Di-backup
- .
- ..
- .env
- db.ts
- package.json
- page.tsx
- schema.prisma

## Cara Restore
```bash
BACKUP_DIR="/home/z/my-project/backups/20260327_010413_QUICK_BACKUP"
cp "$BACKUP_DIR/changed-files/"* /home/z/my-project/
# Restart dev server jika perlu
```
