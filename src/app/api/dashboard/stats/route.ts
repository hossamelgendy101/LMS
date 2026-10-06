import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyAccessToken } from '@/lib/auth/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(token);

    let stats = {};

    if (payload.role === 'ADMIN' || payload.role === 'SUPER_ADMIN') {
      const [
        totalCourses,
        totalStudents,
        totalInstructors,
        completedRevenue,
        activeEnrollments,
        newEnrollmentsThisMonth,
      ] = await Promise.all([
        prisma.course.count(),
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
        prisma.payment.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true },
        }),
        prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
        prisma.enrollment.count({
          where: {
            enrolledAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
      ]);

      stats = {
        totalCourses,
        totalStudents,
        totalInstructors,
        totalRevenue: Number(completedRevenue._sum.amount ?? 0),
        activeEnrollments,
        newEnrollmentsThisMonth,
      };
    } else if (payload.role === 'INSTRUCTOR') {
      const [courses, totalStudents, instructorRevenue, averageRating] = await Promise.all([
        prisma.course.findMany({
          where: { instructorId: payload.userId },
          select: { id: true },
        }),
        prisma.enrollment.count({
          where: {
            course: { instructorId: payload.userId },
            status: 'ACTIVE',
          },
        }),
        prisma.payment.aggregate({
          where: {
            courseId: { in: [] },
            status: 'COMPLETED',
          },
          _sum: { amount: true },
        }),
        prisma.course.aggregate({
          where: { instructorId: payload.userId },
          _avg: { rating: true },
        }),
      ]);

      const courseIds = courses.map((course) => course.id);
      const revenueResult = await prisma.payment.aggregate({
        where: {
          courseId: { in: courseIds },
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      });

      stats = {
        totalCourses: courses.length,
        totalStudents,
        totalRevenue: Number(revenueResult._sum?.amount ?? 0),
        averageRating: Number(averageRating._avg?.rating ?? 0),
      };
    } else {
      // Student stats
      const [
        totalEnrollments,
        completedCourses,
        inProgressCourses,
        totalCertificates,
      ] = await Promise.all([
        prisma.enrollment.count({ where: { userId: payload.userId } }),
        prisma.enrollment.count({
          where: { userId: payload.userId, status: 'COMPLETED' },
        }),
        prisma.enrollment.count({
          where: { userId: payload.userId, status: 'ACTIVE' },
        }),
        prisma.certificate.count({ where: { userId: payload.userId } }),
      ]);

      stats = {
        totalEnrollments,
        completedCourses,
        inProgressCourses,
        totalCertificates,
      };
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
