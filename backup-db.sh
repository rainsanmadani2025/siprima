#!/bin/bash

# Backup database script
BACKUP_DIR="/home/z/my-project/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_FILE="/home/z/my-project/db/custom.db"

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Backup database
cp "$DB_FILE" "$BACKUP_DIR/custom_db_$TIMESTAMP.db"

# Keep only last 10 backups
cd "$BACKUP_DIR"
ls -t custom_db_*.db | tail -n +11 | xargs -r rm --

echo "Database backed up: custom_db_$TIMESTAMP.db"
echo "Total backups: $(ls -1 custom_db_*.db | wc -l)"
