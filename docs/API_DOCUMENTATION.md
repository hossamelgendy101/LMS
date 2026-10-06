# API Documentation

## Authentication

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### POST /api/auth/login
Authenticate and receive access/refresh tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "rememberMe": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT"
    }
  }
}
```

### POST /api/auth/logout
Revoke refresh token and clear cookies.

### POST /api/auth/refresh
Refresh access token using refresh token.

### GET /api/auth/me
Get current authenticated user.

### POST /api/auth/forgot-password
Request password reset email.

### POST /api/auth/reset-password
Reset password with token.

### POST /api/auth/verify-email
Verify email with token.

## Courses

### GET /api/courses
List courses with search, filter, pagination.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 12)
- `search` (string)
- `category` (string)
- `level` (string: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `sortBy` (string, default: createdAt)
- `sortOrder` (string: asc, desc)
- `featured` (boolean)
- `minPrice` (number)
- `maxPrice` (number)

### GET /api/courses/:slug
Get course details with sections, lessons, reviews.

## Categories

### GET /api/categories
List all categories with subcategories and course counts.

## User

### GET /api/user/profile
Get current user profile.

### PATCH /api/user/profile
Update user profile.

### POST /api/user/change-password
Change account password.

## Enrollments

### GET /api/enrollments
List user enrollments with progress.

### POST /api/enrollments
Enroll in a course.

**Request Body:**
```json
{
  "courseId": "..."
}
```

## Dashboard

### GET /api/dashboard/stats
Get dashboard statistics (role-based).

## Notifications

### GET /api/notifications
List user notifications.

**Query Parameters:**
- `unread` (boolean) - Filter unread only

### PATCH /api/notifications
Mark notifications as read.

**Request Body:**
```json
{
  "id": "..." // or "all" to mark all as read
}
```

## Admin

### GET /api/admin/users
List all users (Admin/Super Admin only).

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `search` (string)
- `role` (string)

### GET /api/admin/courses
List all courses for moderation.

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Error Format

```json
{
  "success": false,
  "error": "Error message"
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |
