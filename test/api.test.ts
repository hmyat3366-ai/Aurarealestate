import { describe, it, expect } from "vitest";
import { POST as handleInquiry } from "@/app/api/inquiries/route";
import { POST as handleSell } from "@/app/api/sell/route";

describe("API Route: /api/inquiries", () => {
  it("rejects automated spam when honeypot field is present", async () => {
    const request = new Request("http://localhost:3000/api/inquiries", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Spam Bot",
        email: "bot@spam.com",
        phone: "+44123456789",
        honeypot: "I am a bot",
      }),
    });

    const res = await handleInquiry(request);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Spam");
  });

  it("validates required name and email format", async () => {
    const reqInvalidEmail = new Request("http://localhost:3000/api/inquiries", {
      method: "POST",
      body: JSON.stringify({
        fullName: "John Doe",
        email: "invalid-email-address",
        phone: "+44123456789",
      }),
    });

    const res = await handleInquiry(reqInvalidEmail);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("email");
  });

  it("accepts valid viewing request and returns honest confirmation status", async () => {
    const request = new Request("http://localhost:3000/api/inquiries", {
      method: "POST",
      body: JSON.stringify({
        propertyId: "prop-sale-01",
        propertyReference: "VS-MAY-0101",
        propertyTitle: "The Grosvenor Penthouse",
        type: "viewing",
        fullName: "Lord Sterling",
        email: "sterling@mayfair.co.uk",
        phone: "+442079460880",
        preferredDate: "2026-04-10",
        timeSlot: "morning",
      }),
    });

    const res = await handleInquiry(request);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain("viewing request has been received");
    expect(body.inquiryId).toBeDefined();
  });
});

describe("API Route: /api/sell (Sell with Us)", () => {
  it("rejects submissions without property address or location", async () => {
    const request = new Request("http://localhost:3000/api/sell", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Lady Catherine",
        email: "catherine@chelsea.com",
        phone: "+447911122334",
        propertyLocation: "", // missing
      }),
    });

    const res = await handleSell(request);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("location");
  });

  it("processes representation request without auto-publishing", async () => {
    const request = new Request("http://localhost:3000/api/sell", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Lady Catherine",
        email: "catherine@chelsea.com",
        phone: "+447911122334",
        propertyLocation: "Cheyne Walk, Chelsea, SW3",
        propertyType: "townhouse",
        estimatedValue: "£5m - £10m",
        message: "Requesting discreet private valuation.",
      }),
    });

    const res = await handleSell(request);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain("Senior Sales Partner");
  });
});
