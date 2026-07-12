# EduSocial Deployment Guide

## Prerequisites
- Docker & Docker Compose
- Node.js 22+
- PostgreSQL 16+ (if not using Docker)
- Redis 7+ (if not using Docker)

## Quick Start (Docker)

```bash
# Clone and configure
cp backend/.env.example backend/.env
# Edit backend/.env with your secrets

# Start all services
cd backend
docker compose up -d

# Run migrations
docker compose exec backend npx prisma migrate deploy

# Seed database
docker compose exec backend npx prisma db seed

# Access the app
# Frontend: http://localhost:3000
# API: http://localhost:3001/api/v1
# Grafana: http://localhost:3000 (admin/admin)
# Prometheus: http://localhost:9090
# Meilisearch: http://localhost:7700
# MinIO Console: http://localhost:9001
```

## Development Setup

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run start:dev

# Frontend (new terminal)
npm install
npm run dev
```

## Environment Variables

See `backend/.env.example` for all variables. Key ones:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | JWT signing secret (64+ chars) |
| `JWT_REFRESH_SECRET` | Yes | Refresh token secret |
| `REDIS_HOST` | Yes | Redis host |
| `SENTRY_DSN` | No | Sentry DSN for error tracking |
| `OTEL_ENABLED` | No | Enable OpenTelemetry |
| `AI_PROVIDER` | No | Active AI provider |

## Production Deployment

### 1. Server Setup
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone repository
git clone <repo-url> edusocial
cd edusocial
```

### 2. Configure Environment
```bash
cp backend/.env.example backend/.env
# Generate secrets
openssl rand -hex 64  # Use for JWT_SECRET
openssl rand -hex 64  # Use for JWT_REFRESH_SECRET
# Edit backend/.env
```

### 3. Start Services
```bash
cd backend
docker compose -f docker-compose.yml up -d

# Run migrations
docker compose exec backend npx prisma migrate deploy

# Seed (first time only)
docker compose exec backend npx prisma db seed
```

### 4. SSL/TLS (Nginx)
```bash
# Place certs in nginx/ssl/
# Uncomment SSL lines in nginx/nginx.conf
docker compose restart nginx
```

## Backup & Restore

### Backup
```bash
# Manual backup
./scripts/backup.sh

# Automated (cron)
0 2 * * * /path/to/scripts/backup.sh
```

### Restore
```bash
./scripts/restore.sh ./backups/edusocial_20240101_020000.sql.gz
```

## Monitoring

### Health Checks
```bash
curl http://localhost:3001/health
curl http://localhost:3001/health/live
```

### Metrics
```bash
curl http://localhost:3001/metrics
```

### Logs
```bash
docker compose logs -f backend
docker compose logs -f nginx
```

## Scaling

### Horizontal Scaling
```bash
# Scale backend
docker compose up -d --scale backend=3

# Redis handles WebSocket state sharing
# PostgreSQL handles data persistence
```

### Performance Tuning
- Increase `worker_connections` in Nginx
- Tune PostgreSQL `shared_buffers`, `max_connections`
- Configure Redis `maxmemory` and eviction policy
- Enable Nginx gzip compression

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port conflict | Change ports in docker-compose.yml |
| JWT error | Ensure secrets are set in .env |
| DB connection | Check PostgreSQL is running |
| Redis connection | Check Redis is running |
| Build fails | Run `npx prisma generate` |
