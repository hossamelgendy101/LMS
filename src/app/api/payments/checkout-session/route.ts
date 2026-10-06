import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyAccessToken } from '@/lib/auth/auth';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    const { courseId, couponCode } = await request.json();

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Check existing enrollment
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: payload.userId, courseId } },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'Already enrolled' }, { status: 409 });
    }

    // Calculate final price
    let finalPrice = Number(course.price);
    let discountAmount = 0;
    let appliedCouponId: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive && coupon.validFrom <= new Date() && coupon.validUntil >= new Date()) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          if (!coupon.minPurchase || finalPrice >= Number(coupon.minPurchase)) {
            if (!coupon.courseId || coupon.courseId === courseId) {
              if (coupon.discountType === 'percentage') {
                discountAmount = finalPrice * (Number(coupon.discountValue) / 100);
              } else {
                discountAmount = Number(coupon.discountValue);
              }
              finalPrice = Math.max(0, finalPrice - discountAmount);
              appliedCouponId = coupon.id;
            }
          }
        }
      }
    }

    finalPrice = Math.round(finalPrice * 100) / 100;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: payload.userId,
        courseId,
        amount: finalPrice,
        currency: course.currency,
        status: 'PENDING',
        couponId: appliedCouponId,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: course.currency.toLowerCase(),
            product_data: {
              name: course.title,
              description: course.shortDescription || undefined,
              images: course.thumbnail ? [`${appUrl}${course.thumbnail}`] : undefined,
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/course/${course.slug}?payment=cancelled`,
      metadata: {
        paymentId: payment.id,
        userId: payload.userId,
        courseId,
        couponId: appliedCouponId || '',
      },
      customer_email: payload.email,
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create checkout session' }, { status: 500 });
  }
}
