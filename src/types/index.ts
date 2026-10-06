import { UserRole, UserStatus, CourseStatus, CourseLevel, CourseVisibility, LessonType, QuestionType, EnrollmentStatus, NotificationType, TicketStatus, TicketPriority, PaymentStatus, SubmissionStatus, AuditAction } from '@prisma/client';

// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithProfile extends User {
  profile: UserProfile | null;
  instructorProfile: InstructorProfile | null;
}

export interface UserProfile {
  id: string;
  headline: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  github: string | null;
  location: string | null;
  timezone: string;
  language: string;
  skills: string[];
}

export interface InstructorProfile {
  id: string;
  title: string | null;
  expertise: string[];
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

// ==================== COURSE TYPES ====================

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  thumbnail: string | null;
  previewVideo: string | null;
  instructorId: string;
  categoryId: string;
  subcategoryId: string | null;
  level: CourseLevel;
  language: string;
  status: CourseStatus;
  visibility: CourseVisibility;
  price: number;
  comparePrice: number | null;
  currency: string;
  duration: number | null;
  isFeatured: boolean;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  totalLessons: number;
  totalQuizzes: number;
  totalAssignments: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseWithRelations extends Course {
  instructor: User;
  category: Category;
  subcategory: Subcategory | null;
  sections: Section[];
  tags: { tag: Tag }[];
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// ==================== SECTION & LESSON TYPES ====================

export interface Section {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isPublished: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  description: string | null;
  type: LessonType;
  content: string | null;
  videoUrl: string | null;
  videoDuration: number | null;
  fileUrl: string | null;
  fileSize: number | null;
  fileType: string | null;
  externalUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  isPreview: boolean;
  isDownloadable: boolean;
}

// ==================== ENROLLMENT TYPES ====================

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  enrolledAt: Date;
  completedAt: Date | null;
  lastAccessedAt: Date | null;
  course: Course;
}

// ==================== REVIEW TYPES ====================

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  title: string | null;
  content: string;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Date;
  user: User;
}

// ==================== NOTIFICATION TYPES ====================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: string | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
  totalRevenue: number;
  activeEnrollments: number;
  completionRate: number;
  averageRating: number;
  newEnrollmentsThisMonth: number;
}

export interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  monthlyRevenue: { month: string; revenue: number }[];
  coursePerformance: { courseId: string; courseName: string; students: number; revenue: number }[];
}

export interface StudentStats {
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  totalCertificates: number;
  totalHoursLearned: number;
  recentActivity: { courseName: string; progress: number; lastAccessed: Date }[];
}
