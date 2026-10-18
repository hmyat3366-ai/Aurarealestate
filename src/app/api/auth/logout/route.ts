/**
 * POST /api/auth/logout
 * Destroys server-side session and clears HttpOnly session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, clearSessionCookie } from '@/lib/server/auth';
import { AuthDatabase } from '@/lib/server/db';

export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUser(req);
    if (auth?.session) {
      AuthDatabase.deleteSession(auth.session.token);
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'Successfully signed out.',
      },
      { status: 200 }
    );

    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error('Error during sign out:', error);
    const response = NextResponse.json(
      { error: 'An unexpected error occurred during sign out.' },
      { status: 500 }
    );
    clearSessionCookie(response);
    return response;
  }
}
