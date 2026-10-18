/**
 * POST /api/account/viewings/[id]/cancel
 * Allows authenticated user to cancel their pending or upcoming viewing appointment.
 * Enforces strict cross-account isolation (user can only cancel their own viewing).
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/auth';
import { AuthDatabase } from '@/lib/server/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const viewingId = params.id;
    if (!viewingId) {
      return NextResponse.json(
        { error: 'Viewing ID is required.' },
        { status: 400 }
      );
    }

    // Verify ownership
    const viewing = AuthDatabase.getUserViewingById(viewingId, auth.user.id);
    if (!viewing) {
      return NextResponse.json(
        { error: 'Viewing appointment not found or access denied.' },
        { status: 404 }
      );
    }

    if (viewing.status === 'cancelled') {
      return NextResponse.json(
        { message: 'Viewing appointment is already cancelled.', viewing },
        { status: 200 }
      );
    }

    const cancelledViewing = AuthDatabase.cancelUserViewing(viewingId, auth.user.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Viewing appointment has been cancelled.',
        viewing: cancelledViewing,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling viewing appointment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel viewing appointment.' },
      { status: 500 }
    );
  }
}
