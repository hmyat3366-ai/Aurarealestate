/**
 * /api/account/saved
 * Saved properties management for authenticated users.
 * Supports GET (hydrated list), POST (save), and DELETE (unsave).
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/auth';
import { AuthDatabase } from '@/lib/server/db';
import { PROPERTIES } from '@/data/properties';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  const savedIds = AuthDatabase.getUserSavedPropertyIds(auth.user.id);
  // Hydrate with catalog properties, preserving order
  const properties = savedIds
    .map((id) => PROPERTIES.find((p) => p.id === id))
    .filter(Boolean);

  return NextResponse.json(
    {
      savedIds,
      properties,
      count: savedIds.length,
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const body = await req.json().catch(() => ({}));
    const { propertyId } = body;

    if (!propertyId || typeof propertyId !== 'string') {
      return NextResponse.json(
        { error: 'Property ID is required.' },
        { status: 400 }
      );
    }

    const updatedIds = AuthDatabase.addSavedProperty(auth.user.id, propertyId);
    return NextResponse.json(
      {
        success: true,
        savedIds: updatedIds,
        count: updatedIds.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving property:', error);
    return NextResponse.json(
      { error: 'Failed to save property.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  try {
    let propertyId = req.nextUrl.searchParams.get('propertyId');
    if (!propertyId) {
      const body = await req.json().catch(() => ({}));
      propertyId = body.propertyId;
    }

    if (!propertyId || typeof propertyId !== 'string') {
      return NextResponse.json(
        { error: 'Property ID is required.' },
        { status: 400 }
      );
    }

    const updatedIds = AuthDatabase.removeSavedProperty(auth.user.id, propertyId);
    return NextResponse.json(
      {
        success: true,
        savedIds: updatedIds,
        count: updatedIds.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing saved property:', error);
    return NextResponse.json(
      { error: 'Failed to remove saved property.' },
      { status: 500 }
    );
  }
}
