#!/bin/bash
set -euo pipefail

# ══════════════════════════════════════════════════════════════════════════════
# EduSocial Deploy Script — facebookedu.com
# ══════════════════════════════════════════════════════════════════════════════
#
# Usage:
#   ./deploy.sh setup     — First-time setup (install Docker, clone repo, SSL)
#   ./deploy.sh deploy    — Deploy/redeploy (build + restart)
#   ./deploy.sh ssl       — Renew SSL certificates
#   ./deploy.sh logs      — View logs
#   ./deploy.sh status    — Check service status
#   ./deploy.sh db-push   — Push Prisma schema to database
#   ./deploy.sh seed      — Seed the database
#   ./deploy.sh backup    — Backup database
#

DOMAIN="facebookedu.com"
PROJECT_DIR="/var/www/edusocial"
BRANCH="main"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()    { echo -e "${BLUE}[INFO]${NC} $1"; }
ok()     { echo -e "${GREEN}[OK]${NC} $1"; }
warn()   { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()    { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ─── Setup (first time on a fresh VPS) ──────────────────────────────────────
setup() {
    log "Setting up EduSocial on $DOMAIN..."

    # Update system
    apt-get update && apt-get upgrade -y

    # Install Docker
    if ! command -v docker &>/dev/null; then
        log "Installing Docker..."
        curl -fsSL https://get.docker.com | sh
        systemctl enable docker
        systemctl start docker
    fi

    # Install Docker Compose plugin
    if ! docker compose version &>/dev/null; then
        log "Installing Docker Compose plugin..."
        apt-get install -y docker-compose-plugin
    fi

    # Install certbot
    if ! command -v certbot &>/dev/null; then
        log "Installing certbot..."
        apt-get install -y certbot
    fi

    # Clone repo
    if [ ! -d "$PROJECT_DIR" ]; then
        log "Cloning repository..."
        mkdir -p /var/www
        git clone https://github.com/YOUR_USERNAME/edusocial.git "$PROJECT_DIR"
    fi

    cd "$PROJECT_DIR"
    git checkout "$BRANCH"

    # Create .env if not exists
    if [ ! -f .env ]; then
        cp .env .env.backup
        warn "Created .env from template. Edit it with real passwords!"
        warn "Run: nano $PROJECT_DIR/.env"
        warn "Then run: ./deploy.sh deploy"
        exit 0
    fi

    # Get SSL certificate (HTTP first, then switch to HTTPS)
    log "Getting SSL certificate for $DOMAIN..."
    mkdir -p /var/www/certbot
    certbot certonly --webroot -w /var/www/certbot \
        -d "$DOMAIN" -d "www.$DOMAIN" \
        --non-interactive --agree-tos --email "admin@$DOMAIN"

    # Copy certs to nginx ssl dir
    mkdir -p backend/nginx/ssl
    cp -L /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem backend/nginx/ssl/fullchain.pem
    cp -L /etc/letsencrypt/live/"$DOMAIN"/privkey.pem backend/nginx/ssl/privkey.pem

    # Deploy
    deploy

    ok "Setup complete! $DOMAIN is live."
}

# ─── Deploy ──────────────────────────────────────────────────────────────────
deploy() {
    log "Deploying EduSocial..."

    cd "$PROJECT_DIR"

    # Pull latest code
    if [ -d .git ]; then
        log "Pulling latest code..."
        git pull origin "$BRANCH"
    fi

    # Validate .env
    if [ ! -f .env ]; then
        err ".env file not found! Copy .env.example and fill in values."
    fi

    # Build and start
    log "Building and starting services..."
    docker compose -f docker-compose.prod.yml build --no-cache
    docker compose -f docker-compose.prod.yml up -d

    # Run database migrations
    log "Running database migrations..."
    docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

    log "Waiting for services to be healthy..."
    sleep 15

    # Check status
    status

    ok "Deploy complete! https://$DOMAIN"
}

# ─── SSL Renewal ─────────────────────────────────────────────────────────────
ssl() {
    log "Renewing SSL certificates..."
    certbot renew --quiet

    # Copy renewed certs
    cp -L /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem backend/nginx/ssl/fullchain.pem
    cp -L /etc/letsencrypt/live/"$DOMAIN"/privkey.pem backend/nginx/ssl/privkey.pem

    # Reload nginx
    docker compose -f docker-compose.prod.yml exec -T nginx nginx -s reload

    ok "SSL certificates renewed."
}

# ─── Logs ────────────────────────────────────────────────────────────────────
logs() {
    cd "$PROJECT_DIR"
    docker compose -f docker-compose.prod.yml logs -f --tail=100 "${1:-}"
}

# ─── Status ──────────────────────────────────────────────────────────────────
status() {
    cd "$PROJECT_DIR"
    echo ""
    log "Service Status:"
    docker compose -f docker-compose.prod.yml ps
    echo ""
}

# ─── DB Push ─────────────────────────────────────────────────────────────────
db_push() {
    cd "$PROJECT_DIR"
    log "Pushing Prisma schema..."
    docker compose -f docker-compose.prod.yml exec -T backend npx prisma db push
    docker compose -f docker-compose.prod.yml exec -T backend npx prisma generate
    ok "Database schema updated."
}

# ─── Seed ────────────────────────────────────────────────────────────────────
seed() {
    cd "$PROJECT_DIR"
    log "Seeding database..."
    docker compose -f docker-compose.prod.yml exec -T backend npx prisma db seed
    ok "Database seeded."
}

# ─── Backup ──────────────────────────────────────────────────────────────────
backup() {
    cd "$PROJECT_DIR"
    BACKUP_DIR="/var/backups/edusocial"
    mkdir -p "$BACKUP_DIR"
    BACKUP_FILE="$BACKUP_DIR/edusocial_$(date +%Y%m%d_%H%M%S).sql.gz"

    log "Backing up database..."
    docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres edusocial | gzip > "$BACKUP_FILE"

    ok "Backup saved to $BACKUP_FILE"

    # Keep only last 7 backups
    ls -t "$BACKUP_DIR"/edusocial_*.sql.gz | tail -n +8 | xargs -r rm
    log "Cleaned old backups (keeping last 7)."
}

# ─── Main ────────────────────────────────────────────────────────────────────
case "${1:-help}" in
    setup)   setup ;;
    deploy)  deploy ;;
    ssl)     ssl ;;
    logs)    logs "${2:-}" ;;
    status)  status ;;
    db-push) db_push ;;
    seed)    seed ;;
    backup)  backup ;;
    *)
        echo "Usage: $0 {setup|deploy|ssl|logs|status|db-push|seed|backup}"
        echo ""
        echo "Commands:"
        echo "  setup     First-time setup (Docker + SSL + deploy)"
        echo "  deploy    Build and deploy"
        echo "  ssl       Renew SSL certificates"
        echo "  logs      View logs (optional: logs backend|frontend|nginx)"
        echo "  status    Check service status"
        echo "  db-push   Push Prisma schema to database"
        echo "  seed      Seed the database"
        echo "  backup    Backup database"
        ;;
esac
