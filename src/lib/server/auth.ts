/**
 * src/lib/server/auth.ts
 * Server-side authentication helpers, cookie management, and route guards.
 */

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { AuthDatabase } from './db';
import { User, UserSession } from '@/types/auth';

export const SESSION_COOKIE_NAME = 'aura_session';

/**
 * Get current session and user from Request or next/headers cookies
 */
export async function getCurrentUser(
  req?: NextRequest
): Promise<{ user: User; session: UserSession } | null> {
  let token: string | undefined;

  // 1. Check Authorization Bearer header
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Check cookies if no Bearer header
  if (!token) {
    if (req) {
      token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    }
    if (!token) {
      try {
        const cookieStore = cookies();
        token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      } catch {
        // In certain headless or test contexts where next/headers is unavailable
      }
    }
  }

  if (!token) {
    return null;
  }

  return AuthDatabase.getSession(token);
}

/**
 * Require authenticated user in API route handler. Returns user or sends 401.
 */
export async function requireAuth(
  req?: NextRequest
): Promise<
  | { user: User; session: UserSession; response?: never }
  | { user?: never; session?: never; response: NextResponse }
> {
  const result = await getCurrentUser(req);
  if (!result) {
    return {
      response: NextResponse.json(
        { error: 'Authentication required. Please sign in.' },
        { status: 401 }
      ),
    };
  }
  return result;
}

/**
 * Set HttpOnly session cookie on a response or in next/headers
 */
export function setSessionCookie(
  sessionToken: string,
  response?: NextResponse
): void {
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
  } catch {
    // If called where cookies() cannot be mutated directly, attach to response
  }

  if (response) {
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
  }
}

/**
 * Clear HttpOnly session cookie
 */
export function clearSessionCookie(response?: NextResponse): void {
  try {
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  } catch {
    // If called where cookies() cannot be mutated directly
  }

  if (response) {
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  }
}

export { sanitizeReturnUrl } from '../auth-utils';

