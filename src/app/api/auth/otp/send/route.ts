/**
 * POST /api/auth/otp/send
 * Request a 6-digit email OTP verification code.
 * Implements anti-enumeration (identical response regardless of existing status),
 * 60-second cooldown rate limiting, and 5-minute expiry.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthDatabase } from '@/lib/server/db';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Request OTP via AuthDatabase (enforces 60s cooldown and 5 per 10min rate limit)
    const result = AuthDatabase.requestOtp(trimmedEmail);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, cooldownSeconds: result.cooldownSeconds },
        { status: 429 }
      );
    }

    // In a live production environment with Resend / SMTP, we would dispatch the email here:
    // await sendOtpEmail(trimmedEmail, result.code);
    // In dev / test environments, log code:
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[AURA OTP Dispatch] Email: ${trimmedEmail} | Code: ${result.code}`);
    }

    // Anti-enumeration consistent response
    const response = NextResponse.json(
      {
        success: true,
        message: 'If your email is valid, a 6-digit verification code has been dispatched.',
        cooldownSeconds: 60,
      },
      { status: 200 }
    );

    // In non-production or test header if needed for debugging
    if (process.env.NODE_ENV !== 'production' && result.code) {
      response.headers.set('X-Aura-Test-Code', result.code);
    }

    return response;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
