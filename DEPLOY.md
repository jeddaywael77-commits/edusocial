# EduSocial — Free Deployment Guide (Vercel + Railway)

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Vercel (FREE)                                      │
│  ┌───────────────────────────────┐                  │
│  │  Next.js Frontend             │                  │
│  │  https://edusocial.vercel.app │                  │
│  └───────────────┬───────────────┘                  │
│                  │ API calls                        │
└──────────────────┼──────────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────────┐
│  Railway ($5 free/month)                            │
│  ┌───────────────────────────────┐                  │
│  │  NestJS Backend               │                  │
│  │  https://edusocial-api.up.railway.app │          │
│  └───────────────┬───────────────┘                  │
│  ┌───────────────┴───────────────┐                  │
│  │  PostgreSQL + Redis            │                 │
│  └───────────────────────────────┘                  │
└─────────────────────────────────────────────────────┘
```

---

## Step 1: Create GitHub Repo

```bash
# From your project root (D:\Desktop\edusocial)
git init
git add .
git commit -m "Initial commit: EduSocial full-stack app"
```

Go to https://github.com/new → Create repo `edusocial` → **keep it public**

```bash
git remote add origin https://github.com/YOUR_USERNAME/edusocial.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend on Railway

1. Go to https://railway.app → **Sign up with GitHub**
2. Click **New Project** → **Deploy from GitHub Repo**
3. Select `edusocial` repo → **Deploy**
4. Railway will detect the `backend/Dockerfile` → it builds automatically

### Add PostgreSQL database:
1. In Railway dashboard → **New** → **Database** → **PostgreSQL**
2. Railway auto-generates a `DATABASE_URL`
3. Go to your **backend service** → **Variables** tab → add:

```
DATABASE_URL=postgresql://postgres:password@host:5432/railway
```
(Railway gives you the actual URL in the PostgreSQL service Variables)

### Add environment variables:
Go to **Backend service** → **Variables** → **Raw Editor** → paste:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=paste_from_postgresql_service
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=run_openssl_rand_hex_32
JWT_REFRESH_SECRET=run_openssl_rand_hex_32
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
CORS_ORIGIN=https://edusocial.vercel.app
STORAGE_TYPE=local
LOG_LEVEL=info
GROQ_API_KEY=your-groq-api-key-here
GROQ_MODEL=llama-3-70b-8192
```

### Run Prisma migration:
In Railway → Backend service → **Settings** → **Deploy** → add **Custom start command**:

```
npx prisma migrate deploy && npx prisma generate && node dist/main
```

### Get your backend URL:
Railway gives you a URL like `https://edusocial-api.up.railway.app`

**Copy this URL** — you'll need it for the frontend.

---

## Step 3: Deploy Frontend on Vercel

1. Go to https://vercel.com → **Sign up with GitHub**
2. Click **New Project** → import `edusocial`
3. **Framework Preset**: Next.js
4. **Root Directory**: `./` (leave empty, it's the root)
5. **Build Command**: `npm run build`
6. **Install Command**: `npm install`

### Add environment variable:
In Vercel project → **Settings** → **Environment Variables**:

```env
NEXT_PUBLIC_API_URL=https://YOUR_RAILWAY_BACKEND_URL/api/v1
```

Replace `YOUR_RAILWAY_BACKEND_URL` with the actual Railway URL from Step 2.

7. Click **Deploy**

### Custom Domain (facebookedu.com):
1. In Vercel → **Settings** → **Domains**
2. Add `facebookedu.com` and `www.facebookedu.com`
3. Vercel gives you DNS records to add at your domain registrar

---

## Step 4: DNS Setup (for facebookedu.com)

At your domain registrar (Namecheap, GoDaddy, etc.):

| Type  | Name  | Value                        |
|-------|-------|------------------------------|
| A     | @     | 76.76.21.21                  |
| CNAME | www   | cname.vercel-dns.com         |

---

## Step 5: Update CORS

After both are deployed, update the Railway backend CORS:

```
CORS_ORIGIN=https://facebookedu.com,https://www.facebookedu.com,https://edusocial.vercel.app
```

---

## Done! 🎉

- **Frontend**: https://facebookedu.com (or https://edusocial.vercel.app)
- **Backend**: https://edusocial-api.up.railway.app

---

## Useful Commands

```bash
# Generate JWT secrets
openssl rand -hex 32

# Railway CLI (optional)
npm i -g @railway/cli
railway login
railway link
railway logs
```
