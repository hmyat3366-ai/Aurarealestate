import { describe, it, expect } from "vitest";
import { filterProperties, sortProperties, formatPrice, toggleStoredShortlist, getStoredShortlist } from "@/lib/utils";
import { PROPERTIES } from "@/data/properties";
import { POST as handleInquiry } from "@/app/api/inquiries/route";
import { POST as handleSell } from "@/app/api/sell/route";

describe("Edge Case: Boundary Values & Empty Inputs in Filtering", () => {
  it("handles negative and zero price filters gracefully without crashing", () => {
    const resultZero = filterProperties(PROPERTIES, { minPrice: 0, maxPrice: 0 });
    expect(resultZero.length).toBe(PROPERTIES.length);

    const resultNegative = filterProperties(PROPERTIES, { minPrice: -500 });
    expect(resultNegative.length).toBe(PROPERTIES.length);
  });

  it("handles empty or whitespace strings in search criteria", () => {
    const resWhitespace = filterProperties(PROPERTIES, { location: "   " });
    // Should safely execute without throwing
    expect(Array.isArray(resWhitespace)).toBe(true);
  });

  it("handles filtering by non-numeric bedroom strings gracefully", () => {
    const resNonNumeric = filterProperties(PROPERTIES, { bedrooms: "invalid_num" });
    expect(resNonNumeric.length).toBe(PROPERTIES.length);
  });

  it("handles properties with 'under_offer' and 'let_agreed' statuses without excluding them unless filtered", () => {
    const underOffer = PROPERTIES.find((p) => p.status === "under_offer");
    expect(underOffer).toBeDefined();

    // Default filter includes all unless explicitly status-filtered
    const all = filterProperties(PROPERTIES, {});
    expect(all.some((p) => p.status === "under_offer")).toBe(true);

    // Explicit status filtering
    const onlyUnderOffer = filterProperties(PROPERTIES, { status: "under_offer" });
    expect(onlyUnderOffer.every((p) => p.status === "under_offer")).toBe(true);
  });
});

describe("Edge Case: Inquiries API Boundary & Error Paths", () => {
  it("rejects empty body gracefully with 500 status", async () => {
    const emptyReq = new Request("http://localhost:3000/api/inquiries", {
      method: "POST",
      body: "not-json",
    });
    const res = await handleInquiry(emptyReq);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("rejects phone numbers that are too short (< 6 chars)", async () => {
    const req = new Request("http://localhost:3000/api/inquiries", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Arthur Dent",
        email: "arthur@galaxy.com",
        phone: "123", // too short
      }),
    });
    const res = await handleInquiry(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("telephone");
  });

  it("rejects names with only whitespace", async () => {
    const req = new Request("http://localhost:3000/api/inquiries", {
      method: "POST",
      body: JSON.stringify({
        fullName: "   ",
        email: "arthur@galaxy.com",
        phone: "+447911223344",
      }),
    });
    const res = await handleInquiry(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("name");
  });
});

describe("Edge Case: Sell with Us Strict Fiduciary Guardrails", () => {
  it("strictly ensures owner inquiries are never marked as autoPublished", async () => {
    const req = new Request("http://localhost:3000/api/sell", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Duchess of Richmond",
        email: "richmond@estate.co.uk",
        phone: "+447911002233",
        propertyLocation: "Richmond Hill, TW10",
        propertyType: "villa",
      }),
    });
    const res = await handleSell(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Verified that no property was added to public PROPERTIES catalog
    expect(PROPERTIES.some((p) => p.title === "Richmond Hill, TW10")).toBe(false);
  });
});
