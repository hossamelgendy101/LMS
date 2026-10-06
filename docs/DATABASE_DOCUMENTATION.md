# Database Documentation

## Overview

The LMS Platform uses PostgreSQL with Prisma ORM. The schema includes 30+ tables covering users, courses, content, assessments, payments, and system management.

## Entity Relationship Diagram

```
User (1) --- (*) Account
User (1) --- (*) Session
User (1) --- (*) RefreshToken
User (1) --- (*) Enrollment
User (1) --- (*) Wishlist
User (1) --- (*) Review
User (1) --- (*) QuizAttempt
User (1) --- (*) AssignmentSubmission
User (1) --- (*) Certificate
User (1) --- (*) Notification
User (1) --- (*) Message
User (1) --- (*) AuditLog

User (1) --- (1) UserProfile
User (1) --- (1) InstructorProfile

Course (1) --- (*) Section
Course (1) --- (*) Enrollment
Course (1) --- (*) Review
Course (1) --- (*) Certificate
Course (1) --- (*) Announcement
Course (1) --- (*) Coupon

Section (1) --- (*) Lesson
Section (1) --- (*) Quiz
Section (1) --- (*) Assignment

Quiz (1) --- (*) Question
Question (1) --- (*) QuestionOption
Question (1) --- (*) QuizAnswer

Quiz (1) --- (*) QuizAttempt
QuizAttempt (1) --- (*) QuizAnswer

Assignment (1) --- (*) AssignmentSubmission
Assignment (1) --- (*) AssignmentRubric

Category (1) --- (*) Subcategory
Category (1) --- (*) Course

Subcategory (1) --- (*) Course

Tag (*) --- (*) Course (via CourseTag)

Discussion (1) --- (*) Comment
Comment (1) --- (*) Comment (self-referencing replies)
```

## Key Tables

### users
- Primary user accounts with role-based access
- Supports soft delete via deletedAt
- Indexes: email, role, status, createdAt

### courses
- Core course information with versioning
- Status: DRAFT, PENDING_REVIEW, PUBLISHED, ARCHIVED, REJECTED
- Visibility: PUBLIC, PRIVATE, UNLISTED
- Indexes: slug, instructorId, categoryId, status, visibility

### sections & lessons
- Hierarchical course content
- Lesson types: VIDEO, PDF, ARTICLE, MARKDOWN, LIVE_SESSION, EXTERNAL_LINK, CODE_EXERCISE, DOWNLOADABLE
- Sort order for custom sequencing

### enrollments
- Student course enrollments with progress tracking
- Status: ACTIVE, COMPLETED, DROPPED, EXPIRED, REFUNDED
- Unique constraint: userId + courseId

### quizzes & questions
- Flexible quiz system with multiple question types
- Support for timed quizzes, randomization, attempt limits
- Question options with correct answer flagging

### assignments
- File submission assignments with rubrics
- Late submission support with penalty calculation
- Grading with feedback

### certificates
- Auto-generated certificates with unique IDs
- QR code verification support
- Revocation tracking

### payments
- Stripe integration ready
- Status: PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED

## Indexes

All foreign keys and frequently queried fields are indexed:
- User: email, role, status, createdAt
- Course: slug, instructorId, categoryId, status, visibility, isFeatured
- Enrollment: userId, courseId, status
- LessonProgress: enrollmentId, lessonId
- QuizAttempt: quizId, userId
- Review: courseId, rating
- Notification: userId, isRead, createdAt

## Migrations

Migrations are managed by Prisma Migrate. To create a new migration:

```bash
npx prisma migrate dev --name <migration-name>
```

To deploy migrations in production:

```bash
npx prisma migrate deploy
```
