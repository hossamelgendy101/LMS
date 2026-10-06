import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyAccessToken } from '@/lib/auth/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);

    const payments = await prisma.payment.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
    });

    const courseIds = payments.map((payment) => payment.courseId);
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
      },
    });

    const courseMap = new Map(courses.map((course) => [course.id, course]));

    const data = payments.map((payment) => ({
      ...payment,
      course: courseMap.get(payment.courseId) ?? null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Payment history error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
