# EduSocial Developer Guide

## Project Structure

```
edusocial/
├── backend/                     # NestJS API
│   ├── src/
│   │   ├── common/              # Shared utilities
│   │   │   ├── decorators/      # @CurrentUser, @Roles, @ApiPaginated
│   │   │   ├── enums/           # Shared enums
│   │   │   ├── filters/         # Exception filters
│   │   │   ├── guards/          # RolesGuard
│   │   │   ├── interceptors/    # Logging, transform
│   │   │   ├── observability/   # Metrics, Sentry, tracing
│   │   │   ├── pipes/           # Validation pipes
│   │   │   └── utils/           # Helper functions
│   │   ├── config/              # App, DB, JWT, Redis config
│   │   ├── database/            # Prisma module + service
│   │   └── modules/             # 31 feature modules
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema (29 models)
│   │   ├── seed.ts              # Seed data
│   │   └── migrations/          # Database migrations
│   ├── scripts/                 # Backup/restore scripts
│   ├── test/                    # E2E tests + load tests
│   ├── monitoring/              # Prometheus + Grafana configs
│   ├── nginx/                   # Nginx config
│   ├── Dockerfile               # Multi-stage build
│   └── docker-compose.yml       # All services
├── src/                         # Next.js frontend
│   ├── app/                     # App Router pages
│   │   ├── (auth)/              # Login, register
│   │   └── (main)/              # Dashboard pages
│   ├── features/                # Feature modules
│   │   ├── ai/                  # AI chat, tools
│   │   ├── auth/                # Authentication
│   │   ├── calendar/            # Calendar events
│   │   ├── courses/             # Course management
│   │   ├── documents/           # File management
│   │   ├── feed/                # Social feed
│   │   ├── friends/             # Friend connections
│   │   ├── groups/              # Study groups
│   │   ├── marketplace/         # Buy/sell
│   │   ├── messages/            # Direct messaging
│   │   ├── notifications/       # Notifications
│   │   ├── posts/               # Post management
│   │   ├── profile/             # User profiles
│   │   └── settings/            # User settings
│   └── shared/                  # Shared components
│       ├── hooks/               # Custom hooks
│       ├── lib/                 # API client, utilities
│       └── ui/                  # Shadcn UI components
└── docs/                        # Documentation
```

## Development Workflow

### Adding a New Module (Backend)

1. Create module directory:
```bash
mkdir -p backend/src/modules/my-module/dto
```

2. Create files:
- `my-module.module.ts` - Module definition
- `my-module.controller.ts` - REST endpoints
- `my-module.service.ts` - Business logic
- `dto/my-module.dto.ts` - Validation DTOs
- `my-module.service.spec.ts` - Unit tests

3. Register in `app.module.ts`:
```typescript
import { MyModule } from './modules/my-module/my-module.module';
// Add to imports array
```

4. Follow conventions:
- Use `@ApiTags('My Module')` for Swagger
- Use `@UseGuards(JwtAuthGuard)` for auth
- Use `@Roles(UserRole.ADMIN)` for RBAC
- Use `@CurrentUser('sub') userId: string` for user ID
- Use `PrismaService` for database operations
- Use `SocketGateway` for real-time events

### Adding a New Page (Frontend)

1. Create page in `src/app/(main)/my-page/page.tsx`
2. Create feature hooks in `src/features/my-page/hooks/`
3. Create components in `src/features/my-page/components/`
4. Add to navigation if needed

### Running Tests

```bash
# Unit tests
cd backend && npm run test

# Unit tests with coverage
cd backend && npm run test:cov

# E2E tests
cd backend && npm run test:e2e

# Load tests
cd backend && npm run load:baseline
```

## Code Style

### Backend
- Use NestJS conventions (modules, controllers, services)
- DTOs with class-validator decorators
- Swagger decorators on all endpoints
- Proper error handling with NestJS exceptions
- Structured logging with Logger

### Frontend
- React Query for server state
- Shadcn UI components
- Tailwind CSS for styling
- Framer Motion for animations
- Feature-based file organization

## Database

### Adding a Model
1. Add to `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_model`
3. Run `npx prisma generate`
4. Update/create service files

### Common Patterns
```typescript
// Pagination
const [items, total] = await Promise.all([
  this.prisma.model.findMany({ skip, take: limit, orderBy }),
  this.prisma.model.count({ where }),
]);

// Transaction
await this.prisma.$transaction([
  this.prisma.model.update({ ... }),
  this.prisma.model.create({ ... }),
]);
```

## API Client

Frontend uses `apiClient` (default export from `@/shared/lib/axios`):
```typescript
import apiClient from '@/shared/lib/axios';

// GET
const { data } = await apiClient.get('/posts', { params: { page: 1 } });

// POST
const { data } = await apiClient.post('/posts', { content: 'Hello' });

// With auth (automatic via interceptor)
const { data } = await apiClient.get('/profile');
```

## WebSocket

Frontend connection:
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: { token: accessToken },
});

socket.on('chat:receive-message', (message) => {
  // Handle new message
});
```
