#!/bin/bash
# EduSocial Database Restore Script
set -euo pipefail

# Configuration
DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/edusocial}"
BACKUP_FILE="${1:-}"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup-file.sql.gz>"
  echo ""
  echo "Available backups:"
  ls -la ./backups/edusocial_*.sql.gz 2>/dev/null || echo "  No backups found"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "ERROR: Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "=== EduSocial Database Restore ==="
echo "Backup file: $BACKUP_FILE"
echo "File size: $(du -h "$BACKUP_FILE" | cut -f1)"
echo "Target database: $(echo $DATABASE_URL | sed 's/.*@\([^:]*\):.*/\1/')"
echo ""

# Confirmation
read -p "This will DROP and recreate the database. Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Restore cancelled."
  exit 0
fi

# Extract connection details
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:]*\):\([^/]*\)/.*|\1|p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:]*\):\([^/]*\)/.*|\2|p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
DB_USER=$(echo "$DATABASE_URL" | sed -n 's|://\([^:]*\):.*|\1|p')

echo "Dropping and recreating database..."
PGPASSWORD="${DATABASE_URL#*:}" psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d postgres \
  -c "DROP DATABASE IF EXISTS $DB_NAME;"
PGPASSWORD="${DATABASE_URL#*:}" psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d postgres \
  -c "CREATE DATABASE $DB_NAME;"

echo "Restoring from backup..."
gunzip -c "$BACKUP_FILE" | PGPASSWORD="${DATABASE_URL#*:}" psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --quiet

echo ""
echo "Running Prisma migrations..."
npx prisma db push --skip-generate 2>/dev/null || echo "Note: Run 'npx prisma db push' manually if needed"

echo ""
echo "=== Restore Complete ==="
echo "Database: $DB_NAME"
echo "Restored from: $BACKUP_FILE"
