/**
 * /api/account/viewings
 * Viewing appointments management for authenticated users.
 * Supports GET (list with filtering) and POST (create request).
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/auth';
import { AuthDatabase } from '@/lib/server/db';
import { PROPERTIES } from '@/data/properties';
import { TourType, TimeSlot } from '@/types/inquiry';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const viewings = AuthDatabase.getUserViewings(auth.user.id);
    const filter = req.nextUrl.searchParams.get('tab'); // 'all', 'upcoming', 'pending', 'past'

    const todayStr = new Date().toISOString().split('T')[0];

    const upcoming = viewings.filter(
      (v) => v.status === 'confirmed' && v.preferredDate >= todayStr
    );
    const pending = viewings.filter((v) => v.status === 'pending_confirmation');
    const past = viewings.filter(
      (v) =>
        v.status === 'completed' ||
        v.status === 'cancelled' ||
        (v.status === 'confirmed' && v.preferredDate < todayStr)
    );

    let filtered = viewings;
    if (filter === 'upcoming') {
      filtered = upcoming;
    } else if (filter === 'pending') {
      filtered = pending;
    } else if (filter === 'past') {
      filtered = past;
    }

    return NextResponse.json(
      {
        viewings: filtered,
        counts: {
          all: viewings.length,
          upcoming: upcoming.length,
          pending: pending.length,
          past: past.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching viewings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch viewing appointments.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const body = await req.json().catch(() => ({}));
    const {
      propertyId,
      tourType = 'in-person',
      preferredDate,
      preferredTime = 'afternoon',
      phone,
      notes,
    } = body;

    if (!propertyId || typeof propertyId !== 'string') {
      return NextResponse.json(
        { error: 'Property ID is required.' },
        { status: 400 }
      );
    }

    if (!preferredDate || typeof preferredDate !== 'string') {
      return NextResponse.json(
        { error: 'Preferred date is required.' },
        { status: 400 }
      );
    }

    // Validate date is in the future
    const selectedDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      return NextResponse.json(
        { error: 'Viewing date must be in the future.' },
        { status: 400 }
      );
    }

    // Hydrate property metadata
    const property = PROPERTIES.find((p) => p.id === propertyId);
    const cleanId = (propertyId || 'prop')
      .replace(/^vs-/, '')
      .replace(/^prop-/, '')
      .toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `VS-VR-${cleanId}-${randomSuffix}`;

    const newViewing = AuthDatabase.createUserViewing(auth.user.id, {
      propertyId,
      propertyTitle: property ? property.title : 'Private Architectural Residence',
      propertyLocation: property
        ? `${property.address.neighborhood}, ${property.address.city}`
        : undefined,
      propertyPrice: property?.price?.amount,
      propertyCurrency: property?.price?.currency,
      propertyListingType: property?.listingType,
      propertyImageUrl: property?.images?.hero,
      fullName: auth.user.fullName,
      email: auth.user.email,
      phone: (phone || auth.user.phone || '').trim(),
      tourType: tourType as TourType,
      preferredDate,
      preferredTime: preferredTime as TimeSlot,
      notes: notes ? String(notes).trim() : undefined,
      status: 'pending_confirmation', // Honest invariant: always starts as pending_confirmation
      referenceCode,
      advisorName: property?.agent?.name,
      advisorPhone: property?.agent?.phone,
      advisorEmail: property?.agent?.email,
    });

    return NextResponse.json(
      {
        success: true,
        viewing: newViewing,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating viewing request:', error);
    return NextResponse.json(
      { error: 'Failed to schedule viewing appointment.' },
      { status: 500 }
    );
  }
}
