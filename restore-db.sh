#!/bin/bash

# Restore database script
BACKUP_DIR="/home/z/my-project/backups"
DB_FILE="/home/z/my-project/db/custom.db"

# List available backups
echo "Available backups:"
ls -lth "$BACKUP_DIR"/custom_db_*.db 2>/dev/null || echo "No backups found"

# Ask which backup to restore
if [ -z "$1" ]; then
    echo ""
    echo "Usage: ./restore-db.sh <backup_file>"
    echo "Example: ./restore-db.sh custom_db_20250115_123045.db"
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

# Check if backup exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Restore database
cp "$BACKUP_FILE" "$DB_FILE"
echo "Database restored from: $BACKUP_FILE"
