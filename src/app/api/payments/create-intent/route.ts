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

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: payload.userId, courseId } },
    });

    if (existingEnrollment) {
      return NextResponse.json({ success: false, error: 'Already enrolled in this course' }, { status: 409 });
    }

    // Calculate price with coupon
    let finalPrice = Number(course.price);
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive && coupon.validFrom <= new Date() && coupon.validUntil >= new Date()) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          if (!coupon.minPurchase || finalPrice >= Number(coupon.minPurchase)) {
            if (!coupon.courseId || coupon.courseId === courseId) {
              if (coupon.discountType === 'percentage') {
                finalPrice = finalPrice * (1 - Number(coupon.discountValue) / 100);
              } else {
                finalPrice = Math.max(0, finalPrice - Number(coupon.discountValue));
              }
              appliedCoupon = coupon;
            }
          }
        }
      }
    }

    finalPrice = Math.round(finalPrice * 100) / 100; // Round to 2 decimals

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: payload.userId,
        courseId,
        amount: finalPrice,
        currency: course.currency,
        status: 'PENDING',
        couponId: appliedCoupon?.id || null,
      },
    });

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalPrice * 100), // Convert to cents
      currency: course.currency.toLowerCase(),
      metadata: {
        paymentId: payment.id,
        userId: payload.userId,
        courseId,
        couponId: appliedCoupon?.id || '',
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id,
        amount: finalPrice,
        currency: course.currency,
        courseName: course.title,
      },
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create payment intent' }, { status: 500 });
  }
}
