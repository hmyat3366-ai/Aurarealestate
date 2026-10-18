/**
 * POST /api/auth/register
 * Completes new user registration with required full name and optional telephone number.
 * Establishes session and sets HttpOnly cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthDatabase } from '@/lib/server/db';
import { setSessionCookie } from '@/lib/server/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { registrationToken, fullName, phone } = body;

    if (!registrationToken || typeof registrationToken !== 'string') {
      return NextResponse.json(
        { error: 'Valid registration session token is required.' },
        { status: 400 }
      );
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Full name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    const result = AuthDatabase.completeRegistration({
      registrationToken,
      fullName: fullName.trim(),
      phone: phone && typeof phone === 'string' ? phone.trim() : undefined,
    });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Failed to complete registration.' },
        { status: 400 }
      );
    }

    // Establish session for newly registered user with session rotation
    const priorToken = req.cookies.get('aura_session')?.value;
    if (priorToken) {
      AuthDatabase.deleteSession(priorToken);
    }
    const session = AuthDatabase.createSession(result.user.id);
    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
        sessionToken: session.token,
      },
      { status: 201 }
    );

    setSessionCookie(session.token, response);
    return response;
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during profile completion.' },
      { status: 500 }
    );
  }
}
