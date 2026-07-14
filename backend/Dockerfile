FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Install all dependencies (including dev for build + prisma CLI)
FROM base AS deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app/backend
COPY --from=deps /app/backend/node_modules ./node_modules
COPY backend/ .
RUN npx prisma generate
RUN npm run build

# Production dependencies only
FROM base AS prod-deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# Production image
FROM base AS runner
WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built artifacts
COPY --from=builder --chown=nestjs:nodejs /app/backend/dist ./dist
COPY --from=prod-deps --chown=nestjs:nodejs /app/backend/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/backend/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/backend/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nestjs:nodejs /app/backend/node_modules/@prisma ./node_modules/@prisma

# Copy prisma CLI for migrations (it's a dev dep but needed at runtime for migrate)
COPY --from=builder --chown=nestjs:nodejs /app/backend/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder --chown=nestjs:nodejs /app/backend/node_modules/prisma ./node_modules/prisma

RUN mkdir -p /app/backend/uploads && chown nestjs:nodejs /app/backend/uploads

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3001/health/live || exit 1

CMD ["sh", "-c", "echo \"DATABASE_URL=$DATABASE_URL\" && ./node_modules/.bin/prisma migrate deploy --schema prisma/schema.prisma && node dist/main"]
