import { PrismaClient, UserRole, UserStatus, CourseStatus, CourseLevel, CourseVisibility, LessonType, QuestionType, NotificationType, EnrollmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.userAchievement.deleteMany(),
    prisma.achievement.deleteMany(),
    prisma.ticketReply.deleteMany(),
    prisma.supportTicket.deleteMany(),
    prisma.message.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.discussion.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.review.deleteMany(),
    prisma.certificate.deleteMany(),
    prisma.certificateTemplate.deleteMany(),
    prisma.assignmentSubmission.deleteMany(),
    prisma.assignmentRubric.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.quizAnswer.deleteMany(),
    prisma.questionOption.deleteMany(),
    prisma.question.deleteMany(),
    prisma.quizAttempt.deleteMany(),
    prisma.quiz.deleteMany(),
    prisma.lessonProgress.deleteMany(),
    prisma.note.deleteMany(),
    prisma.bookmark.deleteMany(),
    prisma.enrollment.deleteMany(),
    prisma.wishlist.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.section.deleteMany(),
    prisma.courseTag.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.course.deleteMany(),
    prisma.subcategory.deleteMany(),
    prisma.category.deleteMany(),
    prisma.instructorProfile.deleteMany(),
    prisma.userProfile.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.passwordReset.deleteMany(),
    prisma.emailVerification.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
    prisma.siteSetting.deleteMany(),
  ]);

  const hashedPassword = await bcrypt.hash('Password123!', 12);

  // ==================== USERS ====================
  console.log('Creating users...');

  await prisma.user.create({
    data: {
      email: 'superadmin@lms.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      displayName: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'Platform Administrator',
          location: 'San Francisco, CA',
          timezone: 'America/Los_Angeles',
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@lms.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      displayName: 'System Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'System Administrator',
          location: 'New York, NY',
          timezone: 'America/New_York',
        },
      },
    },
  });

  const instructor1 = await prisma.user.create({
    data: {
      email: 'instructor@lms.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Smith',
      displayName: 'John Smith',
      role: UserRole.INSTRUCTOR,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      bio: 'Senior Software Engineer with 10+ years of experience in full-stack development.',
      profile: {
        create: {
          headline: 'Senior Software Engineer & Educator',
          website: 'https://johnsmith.dev',
          twitter: '@johnsmith',
          linkedin: 'johnsmith',
          location: 'Austin, TX',
          timezone: 'America/Chicago',
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
        },
      },
      instructorProfile: {
        create: {
          title: 'Senior Software Engineer',
          expertise: ['Web Development', 'React', 'Node.js', 'System Design'],
          totalStudents: 0,
          totalCourses: 0,
          totalRevenue: 0,
          rating: 4.8,
          reviewCount: 0,
          isVerified: true,
          verifiedAt: new Date(),
          commissionRate: 70.00,
        },
      },
    },
  });

  const instructor2 = await prisma.user.create({
    data: {
      email: 'sarah@lms.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      displayName: 'Sarah Johnson',
      role: UserRole.INSTRUCTOR,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      bio: 'Data Scientist and Machine Learning expert with a passion for teaching.',
      profile: {
        create: {
          headline: 'Data Scientist & ML Engineer',
          website: 'https://sarahjohnson.ai',
          linkedin: 'sarahjohnson',
          location: 'Boston, MA',
          timezone: 'America/New_York',
          skills: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow', 'SQL'],
        },
      },
      instructorProfile: {
        create: {
          title: 'Data Scientist',
          expertise: ['Machine Learning', 'Data Science', 'Python', 'Deep Learning'],
          totalStudents: 0,
          totalCourses: 0,
          totalRevenue: 0,
          rating: 4.9,
          reviewCount: 0,
          isVerified: true,
          verifiedAt: new Date(),
          commissionRate: 70.00,
        },
      },
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student@lms.com',
      password: hashedPassword,
      firstName: 'Alex',
      lastName: 'Williams',
      displayName: 'Alex Williams',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'Aspiring Full-Stack Developer',
          location: 'Seattle, WA',
          timezone: 'America/Los_Angeles',
          skills: ['HTML', 'CSS', 'JavaScript'],
        },
      },
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'emma@lms.com',
      password: hashedPassword,
      firstName: 'Emma',
      lastName: 'Davis',
      displayName: 'Emma Davis',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'Data Science Enthusiast',
          location: 'Chicago, IL',
          timezone: 'America/Chicago',
          skills: ['Python', 'Statistics', 'SQL'],
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: 'moderator@lms.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Brown',
      displayName: 'Mike Brown',
      role: UserRole.MODERATOR,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'Community Manager',
          location: 'Denver, CO',
          timezone: 'America/Denver',
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: 'ta@lms.com',
      password: hashedPassword,
      firstName: 'Lisa',
      lastName: 'Chen',
      displayName: 'Lisa Chen',
      role: UserRole.TEACHING_ASSISTANT,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'Teaching Assistant',
          location: 'Portland, OR',
          timezone: 'America/Los_Angeles',
          skills: ['JavaScript', 'React', 'Teaching'],
        },
      },
    },
  });

  // ==================== CATEGORIES ====================
  console.log('Creating categories...');

  const categories = await prisma.$transaction([
    prisma.category.create({
      data: {
        name: 'Development',
        slug: 'development',
        description: 'Programming and software development courses',
        icon: 'Code',
        color: '#3B82F6',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Data Science',
        slug: 'data-science',
        description: 'Data analysis, machine learning, and AI courses',
        icon: 'BarChart',
        color: '#10B981',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX design, graphic design, and creative courses',
        icon: 'Palette',
        color: '#F59E0B',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Business',
        slug: 'business',
        description: 'Business management, marketing, and entrepreneurship',
        icon: 'Briefcase',
        color: '#EF4444',
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Marketing',
        slug: 'marketing',
        description: 'Digital marketing, SEO, and content strategy',
        icon: 'Megaphone',
        color: '#8B5CF6',
        sortOrder: 5,
      },
    }),
  ]);

  const [devCategory, dsCategory, designCategory, businessCategory, marketingCategory] = categories;

  // ==================== SUBCATEGORIES ====================
  console.log('Creating subcategories...');

  const subcategories = await prisma.$transaction([
    // Development subcategories
    prisma.subcategory.create({
      data: { name: 'Web Development', slug: 'web-development', categoryId: devCategory.id, sortOrder: 1 },
    }),
    prisma.subcategory.create({
      data: { name: 'Mobile Development', slug: 'mobile-development', categoryId: devCategory.id, sortOrder: 2 },
    }),
    prisma.subcategory.create({
      data: { name: 'Backend Development', slug: 'backend-development', categoryId: devCategory.id, sortOrder: 3 },
    }),
    // Data Science subcategories
    prisma.subcategory.create({
      data: { name: 'Machine Learning', slug: 'machine-learning', categoryId: dsCategory.id, sortOrder: 1 },
    }),
    prisma.subcategory.create({
      data: { name: 'Data Analysis', slug: 'data-analysis', categoryId: dsCategory.id, sortOrder: 2 },
    }),
    // Design subcategories
    prisma.subcategory.create({
      data: { name: 'UI/UX Design', slug: 'ui-ux-design', categoryId: designCategory.id, sortOrder: 1 },
    }),
    prisma.subcategory.create({
      data: { name: 'Graphic Design', slug: 'graphic-design', categoryId: designCategory.id, sortOrder: 2 },
    }),
  ]);

  const [webDevSub, mobileDevSub, backendDevSub, mlSub, dataAnalysisSub, uiUxSub, graphicDesignSub] = subcategories;

  // ==================== TAGS ====================
  console.log('Creating tags...');

  const tags = await prisma.$transaction([
    prisma.tag.create({ data: { name: 'JavaScript', slug: 'javascript' } }),
    prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.tag.create({ data: { name: 'React', slug: 'react' } }),
    prisma.tag.create({ data: { name: 'Next.js', slug: 'nextjs' } }),
    prisma.tag.create({ data: { name: 'Node.js', slug: 'nodejs' } }),
    prisma.tag.create({ data: { name: 'Python', slug: 'python' } }),
    prisma.tag.create({ data: { name: 'Machine Learning', slug: 'machine-learning' } }),
    prisma.tag.create({ data: { name: 'Data Science', slug: 'data-science' } }),
    prisma.tag.create({ data: { name: 'UI Design', slug: 'ui-design' } }),
    prisma.tag.create({ data: { name: 'UX Design', slug: 'ux-design' } }),
    prisma.tag.create({ data: { name: 'Figma', slug: 'figma' } }),
    prisma.tag.create({ data: { name: 'SQL', slug: 'sql' } }),
    prisma.tag.create({ data: { name: 'Docker', slug: 'docker' } }),
    prisma.tag.create({ data: { name: 'AWS', slug: 'aws' } }),
    prisma.tag.create({ data: { name: 'Git', slug: 'git' } }),
  ]);

  // ==================== COURSES ====================
  console.log('Creating courses...');

  const course1 = await prisma.course.create({
    data: {
      title: 'Complete Web Development Bootcamp',
      slug: 'complete-web-development-bootcamp',
      description: 'Master modern web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.',
      shortDescription: 'Become a full-stack web developer with hands-on projects',
      instructorId: instructor1.id,
      categoryId: devCategory.id,
      subcategoryId: webDevSub.id,
      level: CourseLevel.BEGINNER,
      language: 'en',
      status: CourseStatus.PUBLISHED,
      visibility: CourseVisibility.PUBLIC,
      price: 89.99,
      comparePrice: 199.99,
      currency: 'USD',
      duration: 2880, // 48 hours
      isFeatured: true,
      isCertificateEnabled: true,
      enrollmentCount: 1250,
      rating: 4.7,
      reviewCount: 320,
      totalLessons: 120,
      totalQuizzes: 12,
      totalAssignments: 8,
      publishedAt: new Date('2024-01-15'),
      tags: {
        create: [
          { tagId: tags[0].id },
          { tagId: tags[1].id },
          { tagId: tags[2].id },
          { tagId: tags[3].id },
          { tagId: tags[4].id },
        ],
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced React Patterns & Performance',
      slug: 'advanced-react-patterns-performance',
      description: 'Deep dive into advanced React concepts including hooks, context, performance optimization, server components, and modern patterns used by top tech companies.',
      shortDescription: 'Master advanced React patterns and build high-performance applications',
      instructorId: instructor1.id,
      categoryId: devCategory.id,
      subcategoryId: webDevSub.id,
      level: CourseLevel.ADVANCED,
      language: 'en',
      status: CourseStatus.PUBLISHED,
      visibility: CourseVisibility.PUBLIC,
      price: 129.99,
      comparePrice: 249.99,
      currency: 'USD',
      duration: 1440, // 24 hours
      isFeatured: true,
      isCertificateEnabled: true,
      enrollmentCount: 890,
      rating: 4.9,
      reviewCount: 215,
      totalLessons: 80,
      totalQuizzes: 8,
      totalAssignments: 6,
      publishedAt: new Date('2024-02-01'),
      tags: {
        create: [
          { tagId: tags[1].id },
          { tagId: tags[2].id },
          { tagId: tags[3].id },
        ],
      },
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Machine Learning Fundamentals',
      slug: 'machine-learning-fundamentals',
      description: 'Comprehensive introduction to machine learning with Python. Cover supervised learning, unsupervised learning, neural networks, and real-world applications.',
      shortDescription: 'Learn ML from scratch with Python and real-world projects',
      instructorId: instructor2.id,
      categoryId: dsCategory.id,
      subcategoryId: mlSub.id,
      level: CourseLevel.INTERMEDIATE,
      language: 'en',
      status: CourseStatus.PUBLISHED,
      visibility: CourseVisibility.PUBLIC,
      price: 99.99,
      comparePrice: 179.99,
      currency: 'USD',
      duration: 2160, // 36 hours
      isFeatured: true,
      isCertificateEnabled: true,
      enrollmentCount: 2100,
      rating: 4.8,
      reviewCount: 450,
      totalLessons: 95,
      totalQuizzes: 10,
      totalAssignments: 7,
      publishedAt: new Date('2024-01-20'),
      tags: {
        create: [
          { tagId: tags[5].id },
          { tagId: tags[6].id },
          { tagId: tags[7].id },
          { tagId: tags[11].id },
        ],
      },
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: 'UI/UX Design Masterclass',
      slug: 'ui-ux-design-masterclass',
      description: 'Learn to design beautiful, user-friendly interfaces. Master Figma, design systems, prototyping, and user research methodologies.',
      shortDescription: 'Master UI/UX design with Figma and real-world projects',
      instructorId: instructor2.id,
      categoryId: designCategory.id,
      subcategoryId: uiUxSub.id,
      level: CourseLevel.BEGINNER,
      language: 'en',
      status: CourseStatus.PUBLISHED,
      visibility: CourseVisibility.PUBLIC,
      price: 79.99,
      comparePrice: 149.99,
      currency: 'USD',
      duration: 1680, // 28 hours
      isFeatured: false,
      isCertificateEnabled: true,
      enrollmentCount: 750,
      rating: 4.6,
      reviewCount: 180,
      totalLessons: 65,
      totalQuizzes: 6,
      totalAssignments: 5,
      publishedAt: new Date('2024-03-01'),
      tags: {
        create: [
          { tagId: tags[8].id },
          { tagId: tags[9].id },
          { tagId: tags[10].id },
        ],
      },
    },
  });

  const course5 = await prisma.course.create({
    data: {
      title: 'Backend Development with Node.js',
      slug: 'backend-development-nodejs',
      description: 'Build scalable backend systems with Node.js, Express, MongoDB, and PostgreSQL. Learn API design, authentication, caching, and deployment strategies.',
      shortDescription: 'Build production-ready backend systems with Node.js',
      instructorId: instructor1.id,
      categoryId: devCategory.id,
      subcategoryId: backendDevSub.id,
      level: CourseLevel.INTERMEDIATE,
      language: 'en',
      status: CourseStatus.PUBLISHED,
      visibility: CourseVisibility.PUBLIC,
      price: 109.99,
      comparePrice: 199.99,
      currency: 'USD',
      duration: 1920, // 32 hours
      isFeatured: false,
      isCertificateEnabled: true,
      enrollmentCount: 620,
      rating: 4.5,
      reviewCount: 145,
      totalLessons: 75,
      totalQuizzes: 8,
      totalAssignments: 6,
      publishedAt: new Date('2024-02-15'),
      tags: {
        create: [
          { tagId: tags[1].id },
          { tagId: tags[4].id },
          { tagId: tags[11].id },
          { tagId: tags[12].id },
        ],
      },
    },
  });

  // ==================== SECTIONS & LESSONS ====================
  console.log('Creating sections and lessons...');

  // Course 1 Sections
  const c1s1 = await prisma.section.create({
    data: {
      courseId: course1.id,
      title: 'Introduction to Web Development',
      description: 'Get started with web development fundamentals',
      sortOrder: 1,
      isPublished: true,
      lessons: {
        create: [
          { title: 'Course Overview', type: LessonType.VIDEO, videoDuration: 300, sortOrder: 1, isPublished: true, isPreview: true },
          { title: 'Setting Up Your Development Environment', type: LessonType.VIDEO, videoDuration: 900, sortOrder: 2, isPublished: true, isPreview: true },
          { title: 'How the Web Works', type: LessonType.VIDEO, videoDuration: 600, sortOrder: 3, isPublished: true },
          { title: 'Web Development Roadmap', type: LessonType.ARTICLE, sortOrder: 4, isPublished: true },
        ],
      },
    },
  });

  const c1s2 = await prisma.section.create({
    data: {
      courseId: course1.id,
      title: 'HTML & CSS Fundamentals',
      description: 'Master the building blocks of the web',
      sortOrder: 2,
      isPublished: true,
      lessons: {
        create: [
          { title: 'HTML Document Structure', type: LessonType.VIDEO, videoDuration: 720, sortOrder: 1, isPublished: true },
          { title: 'HTML Elements and Tags', type: LessonType.VIDEO, videoDuration: 900, sortOrder: 2, isPublished: true },
          { title: 'CSS Selectors and Properties', type: LessonType.VIDEO, videoDuration: 840, sortOrder: 3, isPublished: true },
          { title: 'CSS Box Model', type: LessonType.VIDEO, videoDuration: 600, sortOrder: 4, isPublished: true },
          { title: 'CSS Flexbox', type: LessonType.VIDEO, videoDuration: 900, sortOrder: 5, isPublished: true },
          { title: 'CSS Grid Layout', type: LessonType.VIDEO, videoDuration: 780, sortOrder: 6, isPublished: true },
          { title: 'Responsive Design', type: LessonType.VIDEO, videoDuration: 960, sortOrder: 7, isPublished: true },
          { title: 'HTML & CSS Cheat Sheet', type: LessonType.PDF, sortOrder: 8, isPublished: true, isDownloadable: true },
        ],
      },
    },
  });

  const c1s3 = await prisma.section.create({
    data: {
      courseId: course1.id,
      title: 'JavaScript Essentials',
      description: 'Learn JavaScript programming from scratch',
      sortOrder: 3,
      isPublished: true,
      lessons: {
        create: [
          { title: 'JavaScript Basics', type: LessonType.VIDEO, videoDuration: 900, sortOrder: 1, isPublished: true },
          { title: 'Variables and Data Types', type: LessonType.VIDEO, videoDuration: 720, sortOrder: 2, isPublished: true },
          { title: 'Functions and Scope', type: LessonType.VIDEO, videoDuration: 840, sortOrder: 3, isPublished: true },
          { title: 'Arrays and Objects', type: LessonType.VIDEO, videoDuration: 960, sortOrder: 4, isPublished: true },
          { title: 'DOM Manipulation', type: LessonType.VIDEO, videoDuration: 1080, sortOrder: 5, isPublished: true },
          { title: 'Event Handling', type: LessonType.VIDEO, videoDuration: 780, sortOrder: 6, isPublished: true },
          { title: 'Async JavaScript', type: LessonType.VIDEO, videoDuration: 900, sortOrder: 7, isPublished: true },
          { title: 'ES6+ Features', type: LessonType.VIDEO, videoDuration: 1020, sortOrder: 8, isPublished: true },
        ],
      },
    },
  });

  // Course 2 Sections
  const c2s1 = await prisma.section.create({
    data: {
      courseId: course2.id,
      title: 'Advanced React Concepts',
      description: 'Deep dive into React internals',
      sortOrder: 1,
      isPublished: true,
      lessons: {
        create: [
          { title: 'React Reconciliation', type: LessonType.VIDEO, videoDuration: 900, sortOrder: 1, isPublished: true },
          { title: 'Custom Hooks Deep Dive', type: LessonType.VIDEO, videoDuration: 1200, sortOrder: 2, isPublished: true },
          { title: 'Context API Patterns', type: LessonType.VIDEO, videoDuration: 840, sortOrder: 3, isPublished: true },
          { title: 'Server Components', type: LessonType.VIDEO, videoDuration: 1080, sortOrder: 4, isPublished: true },
        ],
      },
    },
  });

  // Course 3 Sections
  const c3s1 = await prisma.section.create({
    data: {
      courseId: course3.id,
      title: 'Introduction to Machine Learning',
      description: 'Understanding ML fundamentals',
      sortOrder: 1,
      isPublished: true,
      lessons: {
        create: [
          { title: 'What is Machine Learning?', type: LessonType.VIDEO, videoDuration: 600, sortOrder: 1, isPublished: true, isPreview: true },
          { title: 'Types of Machine Learning', type: LessonType.VIDEO, videoDuration: 780, sortOrder: 2, isPublished: true },
          { title: 'Setting Up Python for ML', type: LessonType.VIDEO, videoDuration: 900, sortOrder: 3, isPublished: true },
          { title: 'NumPy and Pandas Basics', type: LessonType.VIDEO, videoDuration: 1020, sortOrder: 4, isPublished: true },
        ],
      },
    },
  });

  // ==================== QUIZZES ====================
  console.log('Creating quizzes...');

  const quiz1 = await prisma.quiz.create({
    data: {
      courseId: course1.id,
      title: 'HTML & CSS Fundamentals Quiz',
      description: 'Test your knowledge of HTML and CSS basics',
      timeLimit: 30,
      passingScore: 70,
      maxAttempts: 3,
      isPublished: true,
      sortOrder: 1,
      questions: {
        create: [
          {
            type: QuestionType.MULTIPLE_CHOICE,
            question: 'What does HTML stand for?',
            explanation: 'HTML stands for HyperText Markup Language',
            points: 1,
            sortOrder: 1,
            options: {
              create: [
                { optionText: 'HyperText Markup Language', isCorrect: true, sortOrder: 1 },
                { optionText: 'HighText Machine Language', isCorrect: false, sortOrder: 2 },
                { optionText: 'HyperText Machine Language', isCorrect: false, sortOrder: 3 },
                { optionText: 'HyperText Marking Language', isCorrect: false, sortOrder: 4 },
              ],
            },
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            question: 'Which CSS property is used to change the text color?',
            explanation: 'The color property sets the color of text',
            points: 1,
            sortOrder: 2,
            options: {
              create: [
                { optionText: 'text-color', isCorrect: false, sortOrder: 1 },
                { optionText: 'color', isCorrect: true, sortOrder: 2 },
                { optionText: 'font-color', isCorrect: false, sortOrder: 3 },
                { optionText: 'text-style', isCorrect: false, sortOrder: 4 },
              ],
            },
          },
          {
            type: QuestionType.TRUE_FALSE,
            question: 'CSS Grid and Flexbox can be used together in the same layout.',
            explanation: 'CSS Grid and Flexbox complement each other and can be used together',
            points: 1,
            sortOrder: 3,
            options: {
              create: [
                { optionText: 'True', isCorrect: true, sortOrder: 1 },
                { optionText: 'False', isCorrect: false, sortOrder: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  // ==================== ASSIGNMENTS ====================
  console.log('Creating assignments...');

  const assignment1 = await prisma.assignment.create({
    data: {
      courseId: course1.id,
      title: 'Build a Personal Portfolio Website',
      description: 'Create a responsive personal portfolio website using HTML and CSS.',
      instructions: 'Build a single-page portfolio with sections for About, Projects, Skills, and Contact. Use Flexbox and Grid for layout. Make it responsive for mobile, tablet, and desktop.',
      maxScore: 100,
      dueDate: new Date('2024-12-31'),
      allowLateSubmission: true,
      latePenaltyPercent: 10,
      maxFileSize: 10485760,
      allowedFileTypes: ['.zip', '.html', '.css'],
      isPublished: true,
      sortOrder: 1,
      rubrics: {
        create: [
          { criteria: 'HTML Structure and Semantics', maxPoints: 25, sortOrder: 1 },
          { criteria: 'CSS Styling and Layout', maxPoints: 25, sortOrder: 2 },
          { criteria: 'Responsive Design', maxPoints: 25, sortOrder: 3 },
          { criteria: 'Code Quality and Organization', maxPoints: 25, sortOrder: 4 },
        ],
      },
    },
  });

  // ==================== ENROLLMENTS ====================
  console.log('Creating enrollments...');

  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course1.id,
      status: EnrollmentStatus.ACTIVE,
      progress: 35,
      completedLessons: 14,
      totalLessons: 40,
      enrolledAt: new Date('2024-03-01'),
      lastAccessedAt: new Date(),
      pricePaid: 89.99,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course2.id,
      status: EnrollmentStatus.ACTIVE,
      progress: 10,
      completedLessons: 3,
      totalLessons: 30,
      enrolledAt: new Date('2024-03-15'),
      lastAccessedAt: new Date(),
      pricePaid: 129.99,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student2.id,
      courseId: course3.id,
      status: EnrollmentStatus.ACTIVE,
      progress: 50,
      completedLessons: 20,
      totalLessons: 40,
      enrolledAt: new Date('2024-02-20'),
      lastAccessedAt: new Date(),
      pricePaid: 99.99,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student2.id,
      courseId: course4.id,
      status: EnrollmentStatus.ACTIVE,
      progress: 20,
      completedLessons: 6,
      totalLessons: 30,
      enrolledAt: new Date('2024-04-01'),
      lastAccessedAt: new Date(),
      pricePaid: 79.99,
    },
  });

  // ==================== WISHLISTS ====================
  console.log('Creating wishlists...');

  await prisma.wishlist.create({
    data: { userId: student1.id, courseId: course3.id },
  });

  await prisma.wishlist.create({
    data: { userId: student2.id, courseId: course1.id },
  });

  // ==================== REVIEWS ====================
  console.log('Creating reviews...');

  await prisma.review.create({
    data: {
      userId: student1.id,
      courseId: course1.id,
      rating: 5,
      title: 'Excellent course for beginners!',
      content: 'This course completely transformed my understanding of web development. The instructor explains complex concepts in a very accessible way. Highly recommended!',
      isApproved: true,
      helpfulCount: 45,
    },
  });

  await prisma.review.create({
    data: {
      userId: student2.id,
      courseId: course3.id,
      rating: 5,
      title: 'Best ML course I have taken',
      content: 'Sarah is an amazing instructor. The projects are practical and the explanations are clear. I feel confident applying ML concepts now.',
      isApproved: true,
      helpfulCount: 32,
    },
  });

  // ==================== CERTIFICATE TEMPLATES ====================
  console.log('Creating certificate templates...');

  await prisma.certificateTemplate.create({
    data: {
      name: 'Standard Certificate',
      description: 'Default certificate template',
      htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Georgia', serif; text-align: center; padding: 40px; }
    .certificate { border: 10px solid #1a365d; padding: 40px; }
    h1 { color: #1a365d; font-size: 36px; margin-bottom: 20px; }
    .recipient { font-size: 28px; font-weight: bold; margin: 30px 0; }
    .course { font-size: 22px; color: #4a5568; margin: 20px 0; }
    .date { font-size: 16px; color: #718096; margin-top: 40px; }
    .signature { margin-top: 60px; font-style: italic; }
  </style>
</head>
<body>
  <div class="certificate">
    <h1>Certificate of Completion</h1>
    <p>This certifies that</p>
    <div class="recipient">{{studentName}}</div>
    <p>has successfully completed</p>
    <div class="course">{{courseName}}</div>
    <div class="date">Issued on {{date}}</div>
    <div class="signature">{{instructorName}}</div>
  </div>
</body>
</html>`,
      isDefault: true,
      isActive: true,
    },
  });

  // ==================== ANNOUNCEMENTS ====================
  console.log('Creating announcements...');

  await prisma.announcement.create({
    data: {
      courseId: course1.id,
      authorId: instructor1.id,
      title: 'Welcome to the course!',
      content: 'Welcome everyone! I am excited to have you all in this course. Please make sure to complete the setup lesson first. Feel free to ask questions in the discussion forum.',
      isPinned: true,
    },
  });

  await prisma.announcement.create({
    data: {
      courseId: course3.id,
      authorId: instructor2.id,
      title: 'New project files available',
      content: 'I have uploaded the project files for Module 3. Please download them before starting the lessons.',
      isPinned: false,
    },
  });

  // ==================== DISCUSSIONS ====================
  console.log('Creating discussions...');

  await prisma.discussion.create({
    data: {
      courseId: course1.id,
      authorId: student1.id,
      title: 'Help with CSS Grid',
      content: 'I am having trouble understanding CSS Grid. Can someone explain the difference between grid-template-columns and grid-auto-columns?',
      viewCount: 45,
    },
  });

  // ==================== NOTIFICATIONS ====================
  console.log('Creating notifications...');

  await prisma.notification.create({
    data: {
      userId: student1.id,
      type: NotificationType.COURSE_ENROLLMENT,
      title: 'Welcome to Complete Web Development Bootcamp',
      message: 'You have successfully enrolled in the course. Start learning now!',
    },
  });

  await prisma.notification.create({
    data: {
      userId: student1.id,
      type: NotificationType.NEW_LESSON,
      title: 'New Lesson Available',
      message: 'A new lesson "CSS Grid Layout" has been added to your course.',
    },
  });

  // ==================== COUPONS ====================
  console.log('Creating coupons...');

  await prisma.coupon.create({
    data: {
      code: 'WELCOME50',
      description: '50% off for new students',
      discountType: 'percentage',
      discountValue: 50.00,
      maxUses: 100,
      usedCount: 12,
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'SUMMER25',
      description: '25% off summer sale',
      discountType: 'percentage',
      discountValue: 25.00,
      maxUses: 200,
      usedCount: 45,
      validFrom: new Date('2024-06-01'),
      validUntil: new Date('2024-08-31'),
      isActive: true,
    },
  });

  // ==================== SITE SETTINGS ====================
  console.log('Creating site settings...');

  await prisma.siteSetting.createMany({
    data: [
      { key: 'site_name', value: 'LMS Platform', type: 'string', category: 'general', isPublic: true },
      { key: 'site_description', value: 'The best online learning platform', type: 'string', category: 'general', isPublic: true },
      { key: 'site_logo', value: '/logo.png', type: 'string', category: 'general', isPublic: true },
      { key: 'contact_email', value: 'support@lms.com', type: 'string', category: 'general', isPublic: true },
      { key: 'enable_registration', value: 'true', type: 'boolean', category: 'auth', isPublic: true },
      { key: 'enable_email_verification', value: 'true', type: 'boolean', category: 'auth', isPublic: false },
      { key: 'default_currency', value: 'USD', type: 'string', category: 'payment', isPublic: true },
      { key: 'instructor_commission', value: '70', type: 'number', category: 'payment', isPublic: false },
      { key: 'maintenance_mode', value: 'false', type: 'boolean', category: 'system', isPublic: true },
    ],
  });

  // ==================== ACHIEVEMENTS ====================
  console.log('Creating achievements...');

  await prisma.achievement.createMany({
    data: [
      { name: 'First Steps', description: 'Complete your first lesson', icon: 'Footprints', criteria: '{"type":"lessons_completed","count":1}', points: 10 },
      { name: 'Quick Learner', description: 'Complete 10 lessons', icon: 'Zap', criteria: '{"type":"lessons_completed","count":10}', points: 50 },
      { name: 'Course Finisher', description: 'Complete your first course', icon: 'Trophy', criteria: '{"type":"courses_completed","count":1}', points: 100 },
      { name: 'Knowledge Seeker', description: 'Enroll in 5 courses', icon: 'BookOpen', criteria: '{"type":"courses_enrolled","count":5}', points: 75 },
      { name: 'Quiz Master', description: 'Score 100% on a quiz', icon: 'Target', criteria: '{"type":"perfect_quiz","count":1}', points: 50 },
    ],
  });

  console.log('✅ Database seed completed successfully!');
  console.log('');
  console.log('=== SEED DATA SUMMARY ===');
  console.log('Users: 7 (Super Admin, Admin, 2 Instructors, 2 Students, 1 Moderator, 1 TA)');
  console.log('Categories: 5');
  console.log('Subcategories: 7');
  console.log('Tags: 15');
  console.log('Courses: 5');
  console.log('Sections: 5');
  console.log('Lessons: 30+');
  console.log('Quizzes: 1');
  console.log('Assignments: 1');
  console.log('Enrollments: 4');
  console.log('Reviews: 2');
  console.log('Announcements: 2');
  console.log('Discussions: 1');
  console.log('Notifications: 2');
  console.log('Coupons: 2');
  console.log('Site Settings: 9');
  console.log('Achievements: 5');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
