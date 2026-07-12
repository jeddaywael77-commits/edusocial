# EduSocial API Documentation

## Base URL
```
Development: http://localhost:3001/api/v1
Production:  https://your-domain.com/api/v1
```

## Authentication
All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Auth (`/api/v1/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login |
| POST | `/refresh` | No | Refresh tokens |
| POST | `/logout` | JWT | Logout |
| GET | `/profile` | JWT | Get profile |

### Posts (`/api/v1/posts`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | JWT | Create post |
| GET | `/` | JWT | Get feed |
| GET | `/:id` | JWT | Get post |
| PUT | `/:id` | JWT | Update post |
| DELETE | `/:id` | JWT | Delete post |
| POST | `/:id/share` | JWT | Share post |
| POST | `/:id/save` | JWT | Toggle save |
| POST | `/:id/report` | JWT | Report post |
| GET | `/hashtag/:tag` | JWT | Posts by hashtag |

### Comments (`/api/v1/posts/:postId/comments`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | JWT | Create comment |
| GET | `/` | JWT | List comments |
| GET | `/:commentId/replies` | JWT | Get replies |
| PUT | `/:commentId` | JWT | Update comment |
| DELETE | `/:commentId` | JWT | Delete comment |

### Groups (`/api/v1/groups`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | JWT | Create group |
| GET | `/` | No | List groups |
| GET | `/:id` | No | Get group |
| PUT | `/:id` | JWT | Update group |
| DELETE | `/:id` | JWT | Delete group |
| POST | `/:id/join` | JWT | Join group |
| DELETE | `/:id/leave` | JWT | Leave group |

### Group Members (`/api/v1/groups/:groupId/members`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | JWT | List members |
| GET | `/stats` | JWT | Member stats |
| GET | `/:userId` | JWT | Get member |
| PUT | `/:userId/role` | JWT | Update role (admin/mod) |
| DELETE | `/:userId` | JWT | Remove member (admin/mod) |
| POST | `/transfer-ownership` | JWT | Transfer ownership |

### Courses (`/api/v1/courses`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | JWT/Teacher | Create course |
| GET | `/` | JWT | List courses (paginated) |
| GET | `/:id` | JWT | Get course |
| PUT | `/:id` | JWT | Update course |
| DELETE | `/:id` | JWT | Delete course |
| POST | `/:id/enroll` | JWT | Enroll |

### Chat (`/api/v1/chat`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/conversations` | JWT | List conversations (paginated) |
| POST | `/conversations` | JWT | Create conversation |
| GET | `/conversations/:id/messages` | JWT | Get messages (paginated) |
| POST | `/conversations/:id/messages` | JWT | Send message |

### AI (`/api/v1/ai`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chat` | JWT | AI chat (streaming SSE) |
| POST | `/explain` | JWT | Explain concept |
| POST | `/summarize` | JWT | Summarize text |
| POST | `/quiz` | JWT | Generate quiz |
| POST | `/flashcards` | JWT | Generate flashcards |
| POST | `/essay-review` | JWT | Review essay |
| POST | `/code-review` | JWT | Review code |
| POST | `/tutor` | JWT | AI tutor |
| POST | `/study-plan` | JWT | Generate study plan |
| POST | `/search` | JWT | AI-enhanced search |
| POST | `/rag` | JWT | RAG query |
| GET | `/analytics` | JWT | Usage analytics |
| PUT | `/providers/:name` | JWT/Admin | Switch provider |
| GET | `/analytics/global` | JWT/Admin | Global analytics |

### Search (`/api/v1/search`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | JWT | Global search |
| GET | `/autocomplete` | JWT | Autocomplete |
| GET | `/stats` | JWT/Admin | Index stats |
| POST | `/index/:entityType` | JWT/Admin | Reindex |
| POST | `/initialize` | JWT/Admin | Initialize indexes |

### Media (`/api/v1/media`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload` | JWT | Upload file |
| POST | `/upload/multiple` | JWT | Upload multiple |
| GET | `/mine` | JWT | My media |
| GET | `/stats` | JWT | Media stats |
| GET | `/:id` | JWT | Get media |
| GET | `/:id/signed-url` | JWT | Signed URL |
| PUT | `/:id/replace` | JWT | Replace media |
| DELETE | `/:id` | JWT | Delete media |
| POST | `/bulk-delete` | JWT | Bulk delete |

### Upload (`/api/v1/upload`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/single` | JWT | Simple upload |
| POST | `/multiple` | JWT | Simple bulk upload |
| GET | `/history` | JWT | Upload history |
| GET | `/stats` | JWT | Upload stats |
| GET | `/quota` | JWT | Upload quota |
| GET | `/recent` | JWT | Recent uploads |
| GET | `/:id` | JWT | Get upload |
| GET | `/:id/signed-url` | JWT | Signed URL |
| PUT | `/:id/replace` | JWT | Replace upload |
| DELETE | `/:id` | JWT | Delete upload |
| POST | `/batch-delete` | JWT | Batch delete |

### Admin (`/api/v1/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | JWT/Admin | Dashboard stats |
| GET | `/users` | JWT/Admin | List users |
| GET | `/users/:id` | JWT/Admin | Get user |
| PUT | `/users/:id/role` | JWT/Admin | Update role |
| PUT | `/users/:id/active` | JWT/Admin | Toggle active |
| DELETE | `/users/:id` | JWT/Admin | Delete user |
| GET | `/reports` | JWT/Admin | List reports |
| PUT | `/reports/post/:id` | JWT/Admin | Resolve post report |
| PUT | `/reports/comment/:id` | JWT/Admin | Resolve comment report |
| GET | `/audit-logs` | JWT/Admin | Audit logs |

### Health (`/health`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Full health check (DB, memory) |
| GET | `/health/live` | No | Liveness check |

### Metrics (`/metrics`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/metrics` | Internal | Prometheus metrics |

## WebSocket Events
Connect to `ws://localhost:3001` with JWT auth.

### Client → Server
- `join-room` - Join a room
- `leave-room` - Leave a room
- `chat:send-message` - Send chat message
- `chat:typing` - Typing indicator
- `chat:stop-typing` - Stop typing
- `mark-read` - Mark messages as read

### Server → Client
- `chat:receive-message` - New chat message
- `notification:new` - New notification
- `feed:new-post` - New post in feed
- `feed:new-comment` - New comment
- `friend:request-sent` - Friend request
- `presence:online/offline` - User presence
- `gamification:xp-gained` - XP gained
- `gamification:badge-earned` - Badge earned

## Pagination
Most list endpoints support cursor-based or offset pagination:
```
GET /api/v1/posts?page=1&limit=20
GET /api/v1/chat/conversations?cursor=<messageId>&limit=20
```

Response format:
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```
