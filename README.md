# LMS Platform

A complete, production-ready Learning Management System built with Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Role-based access control (7 roles: Guest, Student, Instructor, TA, Moderator, Admin, Super Admin)
- Email verification, password reset, session management
- Secure cookie handling with HttpOnly, SameSite, and Secure flags

### Course System
- Course creation with sections and lessons
- Multiple lesson types: Video, PDF, Article, Markdown, Live Session, External Link, Code Exercise, Downloadable
- Course categories and subcategories with tags
- Course versioning, draft/published states, visibility controls
- Student enrollment with progress tracking

### Quiz & Assignment System
- Multiple question types: Multiple Choice, True/False, Multiple Answer, Short Answer, Essay
- Quiz timer, random questions, attempt limits, passing scores
- Assignment submissions with file upload, deadlines, late submission handling
- Grading rubrics and instructor feedback

### Certificate System
- Auto-generated certificates with unique IDs
- QR code verification
- PDF download and share functionality
- Certificate templates

### Communication
- In-app notifications and email notifications
- Course announcements and discussion boards
- Comments and replies with moderation
- Direct messaging architecture

### Admin Panel
- User management with role assignment
- Course moderation and approval
- Revenue analytics and reporting
- Support ticket management
- System settings and configuration
- Audit logs

### Security
- CSRF protection, XSS protection, SQL injection prevention
- Rate limiting on API endpoints
- Secure headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Input validation with Zod schemas
- Password hashing with bcrypt

### Performance
- Server-side rendering (SSR) for SEO
- Image optimization and lazy loading
- Code splitting and bundle optimization
- Database indexing and query optimization
- Redis caching support

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- ARIA labels and roles
- Screen reader compatibility
- Responsive design for all screen sizes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| State | TanStack Query, Zustand |
| Forms | React Hook Form, Zod |
| Animations | Framer Motion |
| Backend | Next.js API Routes |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT (jose), bcryptjs |
| Email | Nodemailer |
| Payments | Stripe (ready architecture) |
| Storage | Local (S3-ready abstraction) |
| DevOps | Docker, Docker Compose, Nginx |

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+ (optional)
- npm 10+

## Installation

### 1. Clone and Install

```bash
git clone <repository-url>
cd lms-platform
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lms_platform?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/lms_platform?schema=public"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Email
EMAIL_FROM="noreply@yourdomain.com"
EMAIL_HOST="smtp.resend.com"
EMAIL_PORT=465
EMAIL_USER="resend"
EMAIL_PASSWORD="your-api-key"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@lms.com | Password123! |
| Admin | admin@lms.com | Password123! |
| Instructor | instructor@lms.com | Password123! |
| Student | student@lms.com | Password123! |
| Moderator | moderator@lms.com | Password123! |
| TA | ta@lms.com | Password123! |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript check |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run docker:up` | Start Docker services |

## Project Structure

```
lms-platform/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── admin/        # Admin panel
│   │   ├── courses/      # Course catalog
│   │   └── ...
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   ├── landing/      # Landing page sections
│   │   └── dashboard/    # Dashboard components
│   ├── lib/              # Utilities and services
│   │   ├── auth/         # Authentication
│   │   ├── db/           # Database client
│   │   ├── email/        # Email service
│   │   ├── storage/      # File storage
│   │   ├── utils/        # Utility functions
│   │   └── validation/   # Zod schemas
│   ├── types/            # TypeScript types
│   └── styles/           # Global styles
├── prisma/               # Database schema and seeds
├── tests/                # Test files
├── docker/               # Docker configuration
├── docs/                 # Documentation
└── scripts/              # Build scripts
```

## License

MIT License
