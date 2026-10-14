import { NextResponse } from "next/server";
import { AGENCY_CONFIG } from "@/config/agency";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      propertyLocation,
      propertyType,
      estimatedValue,
      message,
      honeypot,
    } = body;

    // Anti-spam honeypot
    if (honeypot) {
      return NextResponse.json(
        { error: "Spam submission rejected" },
        { status: 400 }
      );
    }

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide your full name." },
        { status: 422 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 422 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 6) {
      return NextResponse.json(
        { error: "Please provide a valid contact phone number." },
        { status: 422 }
      );
    }

    if (!propertyLocation || typeof propertyLocation !== "string" || propertyLocation.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide the general location or postcode of your property." },
        { status: 422 }
      );
    }

    // Notice: We strictly DO NOT auto-publish user listings to public catalog.
    // The submission is routed exclusively to the senior acquisitions team.
    const sellRecord = {
      id: `sell-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      propertyLocation: propertyLocation.trim(),
      propertyType: propertyType || "unspecified",
      estimatedValue: estimatedValue || "confidential",
      message: message ? message.trim() : null,
      receivedAt: new Date().toISOString(),
      dispatchedTo: AGENCY_CONFIG.contact.salesEmail,
      autoPublished: false, // Strict agency rule
    };

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for contacting Vane & Sterling. Your property representation inquiry has been transmitted to our Senior Sales Partner. We will contact you confidentially within 24 hours.",
        recordId: sellRecord.id,
        timestamp: sellRecord.receivedAt,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to send your request. Please contact our Sales Partner directly via telephone or our direct email address.",
      },
      { status: 500 }
    );
  }
}
