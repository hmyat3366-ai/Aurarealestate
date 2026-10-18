/**
 * POST /api/account/saved/sync
 * Merges guest saved property IDs from localStorage into user's account
 * without duplicate entries or data loss.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/auth';
import { AuthDatabase } from '@/lib/server/db';
import { PROPERTIES } from '@/data/properties';

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const body = await req.json().catch(() => ({}));
    const { propertyIds } = body;

    const idsToMerge = Array.isArray(propertyIds) ? propertyIds : [];
    const mergedIds = AuthDatabase.mergeSavedProperties(auth.user.id, idsToMerge);

    const properties = mergedIds
      .map((id) => PROPERTIES.find((p) => p.id === id))
      .filter(Boolean);

    return NextResponse.json(
      {
        success: true,
        savedIds: mergedIds,
        properties,
        count: mergedIds.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error synchronizing saved properties:', error);
    return NextResponse.json(
      { error: 'Failed to synchronize saved properties.' },
      { status: 500 }
    );
  }
}
