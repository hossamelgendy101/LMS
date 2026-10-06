import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, generateSecureToken } from '@/lib/auth/auth';
import { registerSchema } from '@/lib/validation/schemas';
import { sendEmail, getVerificationEmailTemplate } from '@/lib/email/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Check if registration is enabled
    const registrationSetting = await prisma.siteSetting.findUnique({
      where: { key: 'enable_registration' },
    });

    if (registrationSetting?.value === 'false') {
      return NextResponse.json(
        { success: false, error: 'Registration is currently disabled' },
        { status: 403 }
      );
    }

    const hashedPassword = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        email: validated.email.toLowerCase(),
        password: hashedPassword,
        firstName: validated.firstName,
        lastName: validated.lastName,
        displayName: `${validated.firstName} ${validated.lastName}`,
        role: 'STUDENT',
        status: 'PENDING_VERIFICATION',
        profile: {
          create: {},
        },
      },
    });

    // Create email verification token
    const verificationToken = generateSecureToken(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.emailVerification.create({
      data: {
        email: user.email,
        token: verificationToken,
        expiresAt,
      },
    });

    // Send verification email
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      await sendEmail({
        to: user.email,
        subject: 'Verify Your Email - LMS Platform',
        html: getVerificationEmailTemplate(verificationToken, appUrl),
      });
    } catch {
      // Email failed but user is created
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
