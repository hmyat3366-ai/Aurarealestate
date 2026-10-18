/**
 * POST /api/auth/otp/verify
 * Verify the 6-digit OTP code.
 * If user exists: establishes server session, sets HttpOnly cookie, returns user.
 * If user does not exist: issues temporary registrationToken for profile completion.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthDatabase } from '@/lib/server/db';
import { setSessionCookie } from '@/lib/server/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, code } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string' || code.trim().length !== 6) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit verification code.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const result = AuthDatabase.verifyOtp(trimmedEmail, code);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          remainingAttempts: result.remainingAttempts,
        },
        { status: 400 }
      );
    }

    // Existing user direct session establishment with session rotation
    if (!result.isNewUser && result.user) {
      const priorToken = req.cookies.get('aura_session')?.value;
      if (priorToken) {
        AuthDatabase.deleteSession(priorToken);
      }
      const session = AuthDatabase.createSession(result.user.id);
      const response = NextResponse.json(
        {
          success: true,
          isNewUser: false,
          user: result.user,
          sessionToken: session.token,
        },
        { status: 200 }
      );

      setSessionCookie(session.token, response);
      return response;
    }

    // New user profile completion required
    return NextResponse.json(
      {
        success: true,
        isNewUser: true,
        registrationToken: result.registrationToken,
        email: trimmedEmail,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during verification.' },
      { status: 500 }
    );
  }
}
