/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile and session state.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await getCurrentUser(req);

    if (!auth) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: auth.user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching current session:', error);
    return NextResponse.json(
      { error: 'Failed to inspect authentication state.' },
      { status: 500 }
    );
  }
}
