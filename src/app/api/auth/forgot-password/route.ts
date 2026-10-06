import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateSecureToken } from '@/lib/auth/auth';
import { forgotPasswordSchema } from '@/lib/validation/schemas';
import { sendEmail, getPasswordResetTemplate } from '@/lib/email/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a password reset email has been sent.',
      });
    }

    // Invalidate existing tokens
    await prisma.passwordReset.updateMany({
      where: { email: user.email, usedAt: null },
      data: { usedAt: new Date() },
    });

    const resetToken = generateSecureToken(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await prisma.passwordReset.create({
      data: {
        email: user.email,
        token: resetToken,
        expiresAt,
      },
    });

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      await sendEmail({
        to: user.email,
        subject: 'Password Reset - LMS Platform',
        html: getPasswordResetTemplate(resetToken, appUrl),
      });
    } catch {
      // Email failed
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a password reset email has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
