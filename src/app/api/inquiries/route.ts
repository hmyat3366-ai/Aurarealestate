/**
 * POST /api/inquiries
 * Public intake route for general inquiries and guest viewing requests.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthDatabase } from '@/lib/server/db';
import { getCurrentUser } from '@/lib/server/auth';
import { PROPERTIES } from '@/data/properties';
import { TourType, TimeSlot } from '@/types/inquiry';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      propertyId,
      fullName,
      email,
      phone,
      tourType = 'in-person',
      preferredDate,
      preferredTime = 'afternoon',
      notes,
      honeypot,
    } = body;

    if (honeypot) {
      return NextResponse.json({ error: 'Spam submission rejected' }, { status: 400 });
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid full name (at least 2 characters).' },
        { status: 422 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 422 }
      );
    }

    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (!phone || cleanPhone.length < 7) {
      return NextResponse.json(
        { error: 'Please provide a valid contact telephone number.' },
        { status: 422 }
      );
    }

    // Generate tracking reference code
    const cleanId = (propertyId || 'prop')
      .replace(/^vs-/, '')
      .replace(/^prop-/, '')
      .toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `VS-VR-${cleanId}-${randomSuffix}`;

    // If an authenticated user submitted this, also save to their account viewings:
    const auth = await getCurrentUser(request);
    let userViewingId: string | undefined;

    if (auth?.user && propertyId && preferredDate) {
      const property = PROPERTIES.find((p) => p.id === propertyId);
      const viewing = AuthDatabase.createUserViewing(auth.user.id, {
        propertyId,
        propertyTitle: property ? property.title : 'Private Architectural Residence',
        propertyLocation: property
          ? `${property.address.neighborhood}, ${property.address.city}`
          : undefined,
        propertyPrice: property?.price?.amount,
        propertyCurrency: property?.price?.currency,
        propertyListingType: property?.listingType,
        propertyImageUrl: property?.images?.hero,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        tourType: tourType as TourType,
        preferredDate,
        preferredTime: preferredTime as TimeSlot,
        notes: notes ? String(notes).trim() : undefined,
        status: 'pending_confirmation',
        referenceCode,
        advisorName: property?.agent?.name,
        advisorPhone: property?.agent?.phone,
        advisorEmail: property?.agent?.email,
      });
      userViewingId = viewing.id;
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Viewing request submitted — pending manual confirmation. A dedicated listing advisor will review and contact you within 2 business hours.',
        referenceCode,
        status: 'pending_confirmation',
        viewingId: userViewingId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing inquiry:', error);
    return NextResponse.json(
      { error: 'Unable to process inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
