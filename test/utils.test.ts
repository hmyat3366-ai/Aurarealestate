import { describe, it, expect, beforeEach } from "vitest";
import {
  formatPrice,
  formatArea,
  filterProperties,
  sortProperties,
  getStoredShortlist,
  toggleStoredShortlist,
} from "@/lib/utils";
import { PROPERTIES } from "@/data/properties";

describe("Pricing and Specification Formatting", () => {
  it("formats outright sale price with British pound sign and commas", () => {
    const formatted = formatPrice(9750000, "sale", undefined, "GBP");
    expect(formatted).toBe("£9,750,000");
  });

  it("formats rental price with PCM and weekly equivalent calculation", () => {
    // 6500 pcm -> (6500 * 12) / 52 = 1500 pw
    const formatted = formatPrice(6500, "rent", "pcm", "GBP");
    expect(formatted).toContain("£6,500 pcm");
    expect(formatted).toContain("£1,500 pw");
  });

  it("formats area in square feet and square meters", () => {
    expect(formatArea(4620, 429)).toBe("4,620 sq ft / 429 sq m");
    expect(formatArea(3500)).toBe("3,500 sq ft");
  });
});

describe("Property Filtering Engine", () => {
  it("strictly separates sales and rental portfolios", () => {
    const salesOnly = filterProperties(PROPERTIES, { purpose: "sale" });
    expect(salesOnly.length).toBeGreaterThan(0);
    salesOnly.forEach((p) => {
      expect(p.purpose).toBe("sale");
    });

    const rentOnly = filterProperties(PROPERTIES, { purpose: "rent" });
    expect(rentOnly.length).toBeGreaterThan(0);
    rentOnly.forEach((p) => {
      expect(p.purpose).toBe("rent");
    });

    // Ensure no overlap
    const saleIds = new Set(salesOnly.map((p) => p.id));
    rentOnly.forEach((p) => {
      expect(saleIds.has(p.id)).toBe(false);
    });
  });

  it("filters accurately by district / neighborhood", () => {
    const mayfairProps = filterProperties(PROPERTIES, { location: "Mayfair" });
    expect(mayfairProps.length).toBeGreaterThan(0);
    mayfairProps.forEach((p) => {
      expect(
        p.location.neighborhood.toLowerCase().includes("mayfair") ||
          p.location.address.toLowerCase().includes("mayfair")
      ).toBe(true);
    });
  });

  it("filters accurately by property architecture type", () => {
    const penthouses = filterProperties(PROPERTIES, { propertyType: "penthouse" });
    expect(penthouses.length).toBeGreaterThan(0);
    penthouses.forEach((p) => {
      expect(p.propertyType).toBe("penthouse");
    });
  });

  it("filters accurately by minimum bedrooms", () => {
    const minFourBeds = filterProperties(PROPERTIES, { bedrooms: 4 });
    expect(minFourBeds.length).toBeGreaterThan(0);
    minFourBeds.forEach((p) => {
      expect(p.bedrooms).toBeGreaterThanOrEqual(4);
    });
  });

  it("filters accurately by maximum budget", () => {
    const salesUnder5m = filterProperties(PROPERTIES, {
      purpose: "sale",
      maxPrice: 5000000,
    });
    expect(salesUnder5m.length).toBeGreaterThan(0);
    salesUnder5m.forEach((p) => {
      expect(p.price).toBeLessThanOrEqual(5000000);
      expect(p.purpose).toBe("sale");
    });
  });

  it("returns empty array when criteria match no properties", () => {
    const impossible = filterProperties(PROPERTIES, {
      location: "NonExistentDistrictXYZ",
      bedrooms: 10,
    });
    expect(impossible).toEqual([]);
  });
});

describe("Property Sorting Engine", () => {
  it("sorts by price ascending", () => {
    const sorted = sortProperties(PROPERTIES, "price_asc");
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].price).toBeLessThanOrEqual(sorted[i + 1].price);
    }
  });

  it("sorts by price descending", () => {
    const sorted = sortProperties(PROPERTIES, "price_desc");
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i + 1].price);
    }
  });

  it("sorts by bedrooms descending", () => {
    const sorted = sortProperties(PROPERTIES, "bedrooms");
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].bedrooms).toBeGreaterThanOrEqual(sorted[i + 1].bedrooms);
    }
  });
});

describe("Client-side Shortlist Local Storage Management", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with empty shortlist", () => {
    expect(getStoredShortlist()).toEqual([]);
  });

  it("adds and toggles property IDs in shortlist without duplicates", () => {
    const id1 = "prop-sale-01";
    const res1 = toggleStoredShortlist(id1);
    expect(res1).toContain(id1);
    expect(getStoredShortlist()).toContain(id1);

    // Toggle again removes it
    const res2 = toggleStoredShortlist(id1);
    expect(res2).not.toContain(id1);
    expect(getStoredShortlist()).not.toContain(id1);
  });
});
