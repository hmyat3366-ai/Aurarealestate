/**
 * /api/account/profile
 * Manage authenticated user's profile details.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/auth';
import { AuthDatabase } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  return NextResponse.json({ user: auth.user }, { status: 200 });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const body = await req.json().catch(() => ({}));
    const { fullName, phone } = body;

    if (fullName !== undefined && (typeof fullName !== 'string' || fullName.trim().length < 2)) {
      return NextResponse.json(
        { error: 'Full name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    const updatedUser = AuthDatabase.updateUserProfile(auth.user.id, {
      fullName,
      phone,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile.' },
      { status: 500 }
    );
  }
}
