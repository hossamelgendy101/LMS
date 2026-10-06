import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const courseId = searchParams.get('courseId');

    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 404 });
    }

    // Validate coupon
    const now = new Date();
    if (!coupon.isActive) {
      return NextResponse.json({ success: false, error: 'Coupon is inactive' }, { status: 400 });
    }
    if (coupon.validFrom > now) {
      return NextResponse.json({ success: false, error: 'Coupon not yet valid' }, { status: 400 });
    }
    if (coupon.validUntil < now) {
      return NextResponse.json({ success: false, error: 'Coupon has expired' }, { status: 400 });
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 400 });
    }
    if (coupon.courseId && coupon.courseId !== courseId) {
      return NextResponse.json({ success: false, error: 'Coupon not valid for this course' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
