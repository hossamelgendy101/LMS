import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(paymentIntent);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { paymentId, userId, courseId, couponId } = session.metadata || {};

  if (!paymentId || !userId || !courseId) return;

  await prisma.$transaction(async (tx) => {
    // Update payment status
    await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        stripePaymentId: session.payment_intent as string,
        stripeCustomerId: session.customer as string,
      },
    });

    // Get course details for enrollment
    const course = await tx.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          where: { isPublished: true },
          include: {
            lessons: { where: { isPublished: true } },
          },
        },
      },
    });

    if (!course) return;

    const totalLessons = course.sections.reduce(
      (acc, section) => acc + section.lessons.length, 0
    );

    // Create enrollment
    await tx.enrollment.create({
      data: {
        userId,
        courseId,
        totalLessons,
        pricePaid: Number(session.amount_total) / 100,
        paymentId,
      },
    });

    // Update course enrollment count
    await tx.course.update({
      where: { id: courseId },
      data: { enrollmentCount: { increment: 1 } },
    });

    // Update coupon usage if applicable
    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Create notification
    await tx.notification.create({
      data: {
        userId,
        type: 'COURSE_ENROLLMENT',
        title: 'Enrollment Successful',
        message: `You have successfully enrolled in "${course.title}". Start learning now!`,
      },
    });
  });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { paymentId } = paymentIntent.metadata || {};
  if (!paymentId) return;

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: 'COMPLETED',
      stripePaymentId: paymentIntent.id,
    },
  });
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const { paymentId } = paymentIntent.metadata || {};
  if (!paymentId) return;

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: 'FAILED',
      stripePaymentId: paymentIntent.id,
    },
  });
}
