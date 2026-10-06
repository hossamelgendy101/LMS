# Architecture Documentation

## System Architecture

```
┌─────────────────┐
│     Client      │
│  (Browser/App)  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│      Nginx      │
│  (Reverse Proxy)│
│  Rate Limiting  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Next.js App   │
│  (Pages Router) │
│                 │
│  ┌───────────┐  │
│  │   SSR/    │  │
│  │   SSG     │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  API      │  │
│  │  Routes   │  │
│  └───────────┘  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌────────┐
│PostgreSQL│ │ Redis  │
│(Prisma) │ │(Cache) │
└─────────┘ └────────┘
```

## Authentication Flow

```
1. User submits credentials
2. Server validates and hashes password
3. Server creates access token (15 min) and refresh token (7 days)
4. Tokens stored in HTTP-only cookies
5. Middleware validates access token on each request
6. If access token expires, client uses refresh token
7. Refresh token rotation for security
```

## Authorization

Role hierarchy:
```
SUPER_ADMIN > ADMIN > MODERATOR > INSTRUCTOR > TEACHING_ASSISTANT > STUDENT > GUEST
```

Permission checks:
- Middleware level: Route access control
- API level: Resource ownership and role verification
- UI level: Conditional rendering based on user role

## Data Flow

### Course Enrollment
```
1. Student browses courses (public API)
2. Student clicks enroll (authenticated API)
3. Server validates enrollment eligibility
4. Create enrollment record with progress tracking
5. Update course enrollment count
6. Send confirmation notification
7. Redirect to course learning page
```

### Quiz Submission
```
1. Student starts quiz (creates QuizAttempt)
2. Timer begins if configured
3. Student submits answers
4. Server grades automatically (MC/TF)
5. Manual grading queue for essays
6. Update enrollment progress
7. Generate results with explanations
```

## Security Measures

### Authentication Security
- JWT with short expiry (15 minutes)
- Refresh token rotation
- Secure cookie attributes (HttpOnly, SameSite, Secure)
- Password hashing with bcrypt (12 rounds)
- Rate limiting on auth endpoints (5 req/min)

### API Security
- Input validation with Zod schemas
- SQL injection prevention via Prisma ORM
- XSS prevention with output encoding
- CSRF protection via SameSite cookies
- Request size limits (50MB for uploads)

### Infrastructure Security
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Nginx rate limiting
- Docker non-root user execution
- Environment variable validation

## Performance Optimizations

### Frontend
- Next.js Image component for optimized images
- Code splitting via dynamic imports
- TanStack Query for server state caching
- Skeleton loaders for perceived performance

### Backend
- Database connection pooling via Prisma
- Query optimization with proper indexes
- Selective field fetching to reduce payload
- Server-side rendering for SEO-critical pages

### Infrastructure
- Nginx gzip compression
- Static asset caching (365 days)
- CDN-ready architecture
- Horizontal scaling support via Docker

## Monitoring & Logging

### Audit Logs
All significant actions are logged:
- User authentication events
- Course modifications
- Enrollment changes
- Administrative actions

### Error Tracking
- Structured error responses
- Console error logging
- Production error monitoring ready

## Scalability Considerations

### Database
- Read replicas for scaling reads
- Connection pooling
- Proper indexing strategy
- Archival strategy for old data

### Application
- Stateless design for horizontal scaling
- Redis for session sharing
- CDN for static assets
- Microservices-ready architecture
