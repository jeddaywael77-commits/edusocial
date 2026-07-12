#!/bin/bash
# EduSocial Database Backup Script
set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/edusocial}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/edusocial_${TIMESTAMP}.sql.gz"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "=== EduSocial Database Backup ==="
echo "Timestamp: $TIMESTAMP"
echo "Database: $(echo $DATABASE_URL | sed 's/.*@\([^:]*\):.*/\1/')"
echo "Backup file: $BACKUP_FILE"
echo ""

# Extract connection details from DATABASE_URL
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:]*\):\([^/]*\)/.*|\1|p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:]*\):\([^/]*\)/.*|\2|p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
DB_USER=$(echo "$DATABASE_URL" | sed -n 's|://\([^:]*\):.*|\1|p')

# Run pg_dump
echo "Running pg_dump..."
PGPASSWORD="${DATABASE_URL#*:}" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-owner \
  --no-privileges \
  -Fc \
  | gzip > "$BACKUP_FILE"

# Verify backup
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
  FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "Backup completed successfully!"
  echo "File: $BACKUP_FILE"
  echo "Size: $FILE_SIZE"
else
  echo "ERROR: Backup file is empty or missing"
  exit 1
fi

# Cleanup old backups
echo ""
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "edusocial_*.sql.gz" -mtime +$RETENTION_DAYS -delete
REMAINING=$(find "$BACKUP_DIR" -name "edusocial_*.sql.gz" | wc -l)
echo "Remaining backups: $REMAINING"

echo ""
echo "=== Backup Complete ==="
