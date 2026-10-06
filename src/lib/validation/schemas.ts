import { z } from 'zod';

// ==================== AUTH SCHEMAS ====================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ==================== PROFILE SCHEMAS ====================

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  displayName: z.string().min(2).max(100).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  headline: z.string().max(200).optional().nullable(),
  website: z.string().url().optional().nullable(),
  twitter: z.string().max(50).optional().nullable(),
  linkedin: z.string().max(100).optional().nullable(),
  github: z.string().max(100).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  timezone: z.string().max(50).optional(),
  language: z.string().max(10).optional(),
  education: z.string().max(200).optional().nullable(),
  experience: z.string().max(2000).optional().nullable(),
  skills: z.array(z.string()).max(50).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ==================== COURSE SCHEMAS ====================

export const createCourseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000).optional(),
  shortDescription: z.string().max(500).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  language: z.string().default('en'),
  price: z.number().min(0).max(9999),
  comparePrice: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  duration: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).default('PUBLIC'),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.partial().extend({
  id: z.string(),
});

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

// ==================== SECTION SCHEMAS ====================

export const createSectionSchema = z.object({
  courseId: z.string(),
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  sortOrder: z.number().default(0),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;

// ==================== LESSON SCHEMAS ====================

export const createLessonSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(['VIDEO', 'PDF', 'ARTICLE', 'MARKDOWN', 'LIVE_SESSION', 'EXTERNAL_LINK', 'CODE_EXERCISE', 'DOWNLOADABLE']),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  videoDuration: z.number().optional(),
  fileUrl: z.string().optional(),
  fileSize: z.number().optional(),
  fileType: z.string().optional(),
  externalUrl: z.string().optional(),
  sortOrder: z.number().default(0),
  isPreview: z.boolean().default(false),
  isDownloadable: z.boolean().default(false),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;

// ==================== QUIZ SCHEMAS ====================

export const createQuizSchema = z.object({
  courseId: z.string(),
  sectionId: z.string().optional(),
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  timeLimit: z.number().min(1).max(180).optional(),
  passingScore: z.number().min(0).max(100).default(70),
  maxAttempts: z.number().min(1).max(100).default(3),
  shuffleQuestions: z.boolean().default(false),
  showCorrectAnswers: z.boolean().default(true),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

export const createQuestionSchema = z.object({
  quizId: z.string(),
  type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'MULTIPLE_ANSWER', 'SHORT_ANSWER', 'ESSAY']),
  question: z.string().min(5).max(5000),
  explanation: z.string().max(5000).optional(),
  points: z.number().min(1).max(100).default(1),
  options: z.array(z.object({
    optionText: z.string().min(1).max(1000),
    isCorrect: z.boolean().default(false),
  })).optional(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

// ==================== ASSIGNMENT SCHEMAS ====================

export const createAssignmentSchema = z.object({
  courseId: z.string(),
  sectionId: z.string().optional(),
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  instructions: z.string().max(10000).optional(),
  maxScore: z.number().min(1).max(1000).default(100),
  dueDate: z.string().optional(),
  allowLateSubmission: z.boolean().default(false),
  latePenaltyPercent: z.number().min(0).max(100).default(0),
  maxFileSize: z.number().default(10485760),
  allowedFileTypes: z.array(z.string()).default(['.pdf', '.doc', '.docx']),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

// ==================== REVIEW SCHEMAS ====================

export const createReviewSchema = z.object({
  courseId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).max(5000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// ==================== COUPON SCHEMAS ====================

export const createCouponSchema = z.object({
  code: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0),
  maxUses: z.number().min(1).optional(),
  minPurchase: z.number().min(0).optional(),
  validFrom: z.string(),
  validUntil: z.string(),
  courseId: z.string().optional(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

// ==================== SUPPORT TICKET SCHEMAS ====================

export const createTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  category: z.string().min(1).max(100),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const replyTicketSchema = z.object({
  ticketId: z.string(),
  content: z.string().min(1).max(5000),
});

export type ReplyTicketInput = z.infer<typeof replyTicketSchema>;

// ==================== PAGINATION SCHEMAS ====================

export const paginationSchema = z.object({
  page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default('10').transform(Number).pipe(z.number().min(1).max(100)),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
