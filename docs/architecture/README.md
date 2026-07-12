# EduSocial Architecture

## Overview

EduSocial is a full-stack social educational platform built with Next.js 16 (frontend) and NestJS 11 (backend).

## System Architecture

```
                    ┌─────────────┐
                    │   Browser   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    Nginx    │  :80/:443
                    │  (Reverse   │
                    │   Proxy)    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐
        │  Next.js  │ │ NestJS│ │  Static   │
        │  Frontend │ │  API  │ │  Uploads  │
        │   :3000   │ │ :3001 │ │           │
        └───────────┘ └───┬───┘ └───────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
   ┌─────▼─────┐  ┌──────▼──────┐  ┌─────▼─────┐
   │ PostgreSQL │  │    Redis    │  │Meilisearch│
   │    :5432   │  │    :6379    │  │   :7700   │
   └───────────┘  └─────────────┘  └───────────┘
                          │
                   ┌──────▼──────┐
                   │   Qdrant    │
                   │   :6333     │
                   └─────────────┘
```

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS v4, Shadcn UI
- **State**: React Query v5 (server state), Zustand removed
- **Real-time**: Socket.IO client
- **Animation**: Framer Motion

### Backend
- **Framework**: NestJS 11 (TypeScript)
- **ORM**: Prisma 7 (PostgreSQL)
- **Auth**: Passport JWT (access + refresh tokens)
- **Real-time**: Socket.IO + Redis adapter
- **Queue**: BullMQ
- **Search**: Meilisearch
- **Vectors**: Qdrant
- **AI**: OpenAI, Groq, Ollama, Gemini (ProviderFactory pattern)

### Infrastructure
- **Container**: Docker (multi-stage builds)
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: Pino (structured)
- **Tracing**: OpenTelemetry
- **Error Tracking**: Sentry

## Module Architecture (Backend)

### 31 NestJS Modules

| Module | Description | RBAC |
|--------|-------------|------|
| Admin | User management, content moderation, audit logs | ADMIN |
| Auth | Registration, login, JWT, refresh tokens | Public/JWT |
| Users | User profiles, search, settings | JWT |
| Posts | CRUD, feed, sharing, reporting | JWT |
| Comments | Threaded comments (5 levels deep) | JWT |
| Likes | Reactions (post + comment) | JWT |
| Stories | 24h stories with view tracking | JWT |
| Friends | Friend requests, connections | JWT |
| Followers | Follow/unfollow users | JWT |
| Groups | Study groups, clubs | JWT |
| Group Members | Membership, roles, moderation | JWT |
| Courses | Course management, enrollment | JWT/Teacher |
| Lessons | Course lessons | JWT/Teacher |
| Assignments | Homework, grading | JWT/Teacher |
| Submissions | Student submissions | JWT |
| Exams | Exam management | JWT/Teacher |
| Documents | File management | JWT |
| Chat | Direct messaging, conversations | JWT |
| Notifications | Push notifications | JWT |
| Calendar | Events, deadlines | JWT |
| Marketplace | Buy/sell items | JWT |
| Gamification | Badges, XP, levels | JWT/Admin |
| Leaderboard | Rankings | JWT |
| Media | File upload, processing, storage | JWT |
| Search | Full-text search (Meilisearch) | JWT/Admin |
| AI | Chat, RAG, 12+ AI features | JWT |
| Health | Health checks | Public |
| Upload | Simplified upload facade | JWT |
| Socket | WebSocket gateway | WS-JWT |
| Observability | Metrics, logging, tracing | Public |
| Metrics | Prometheus endpoint | Internal |

## Security Architecture

### Authentication Flow
```
Client → POST /auth/register → Hash password → Store user → Return JWT pair
Client → POST /auth/login → Verify password → Return JWT pair
Client → GET /api/* (Bearer token) → JwtAuthGuard → Controller
Client → POST /auth/refresh → JwtRefreshGuard → Bcrypt verify → Return new pair
```

### RBAC Hierarchy
```
ADMIN > TEACHER > MODERATOR > STUDENT
```

### Security Middleware Stack
1. Helmet (HTTP headers)
2. CORS (origin whitelist)
3. Rate Limiting (ThrottlerGuard global, 100 req/min)
4. Request ID (X-Request-Id, X-Correlation-Id)
5. Auth (JWT access token validation)
6. RBAC (RolesGuard + @Roles decorator)
7. Validation (class-validator, DTOs)

## Data Architecture

### 29 Prisma Models
- **Users**: User, FriendRequest, Friendship, Follower
- **Content**: Post, Comment, Reaction, CommentReaction, Story, StoryViewer
- **Saves/Shares**: PostSave, PostShare, PostReport, CommentReport
- **Messaging**: Conversation, ConversationParticipant, Message
- **Groups**: Group, GroupMember
- **Education**: Course, Enrollment, Lesson, Assignment, Submission, Exam
- **Files**: Document, Media
- **System**: Notification, CalendarEvent, MarketplaceItem, Badge, UserBadge, AuditLog

### Key Relationships
- User → Posts, Comments, Reactions (cascade)
- Group → GroupMember, Post (cascade/set null)
- Course → Lesson, Assignment, Exam, Enrollment (cascade)
- Post → Comment, Reaction, Report (cascade)
