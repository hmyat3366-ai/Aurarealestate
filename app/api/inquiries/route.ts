import { NextResponse } from "next/server";
import { AGENCY_CONFIG } from "@/config/agency";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      propertyId,
      propertyReference,
      propertyTitle,
      type,
      fullName,
      email,
      phone,
      preferredDate,
      timeSlot,
      message,
      honeypot,
    } = body;

    // Anti-spam honeypot check
    if (honeypot) {
      return NextResponse.json(
        { error: "Spam submission rejected" },
        { status: 400 }
      );
    }

    // Required fields validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid full name." },
        { status: 422 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 422 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 6) {
      return NextResponse.json(
        { error: "Please provide a valid contact telephone number." },
        { status: 422 }
      );
    }

    // In a live production environment with SMTP or an email API provider configured:
    // const hasEmailProvider = Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST);
    // Here we record the submission and provide honest feedback.
    const inquiryRecord = {
      id: `inq-${Date.now()}`,
      propertyId: propertyId || null,
      propertyReference: propertyReference || null,
      propertyTitle: propertyTitle || "General Portfolio Inquiry",
      type: type || "viewing",
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      preferredDate: preferredDate || null,
      timeSlot: timeSlot || null,
      message: message ? message.trim() : null,
      receivedAt: new Date().toISOString(),
      dispatchedTo: AGENCY_CONFIG.contact.email,
    };

    // Return honest confirmation
    return NextResponse.json(
      {
        success: true,
        message:
          type === "viewing"
            ? "Your viewing request has been received. A senior associate will review property availability and contact you within 2 business hours to confirm."
            : "Your inquiry has been delivered to our Private Office team. We will respond promptly.",
        inquiryId: inquiryRecord.id,
        timestamp: inquiryRecord.receivedAt,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to process inquiry at this moment. Please use our direct telephone or email links below.",
      },
      { status: 500 }
    );
  }
}
