/**
 * tests/unit/domain.test.ts
 * Vitest suite verifying domain models, 16 curated listings, formatters, filters, and mailto.
 */

import { describe, expect, it } from 'vitest';
import {
  PROPERTIES,
  saleProperties,
  rentProperties,
  getPropertyById,
  getPropertyBySlug,
} from '@/data/properties';
import {
  formatPrice,
  formatPriceCompact,
  formatSqft,
  formatDate,
  formatBedrooms,
  formatBathrooms,
} from '@/lib/formatters';
import { filterProperties, sortProperties } from '@/lib/filters';
import { generateMailtoLink, AGENCY_SELL_EMAIL, AGENCY_CONTACT_EMAIL } from '@/lib/mailto';

describe('Domain Data Integrity: Curated Catalog', () => {
  it('contains exactly 16 curated properties', () => {
    expect(PROPERTIES).toHaveLength(16);
  });

  it('contains exactly 8 properties for Sale and 8 properties for Rent', () => {
    expect(saleProperties).toHaveLength(8);
    expect(rentProperties).toHaveLength(8);
  });

  it('enforces strict separation between Sale and Rent schemas', () => {
    // Sale properties
    for (const prop of saleProperties) {
      expect(prop.listingType).toBe('sale');
      expect(prop.price.rentalPeriod).toBeUndefined();
      expect(prop.pricePerSqFt).toBeGreaterThan(0);
      expect(prop.rentalDetails).toBeUndefined();
      expect(prop.price.amount).toBeGreaterThanOrEqual(2_400_000);
      expect(prop.price.amount).toBeLessThanOrEqual(18_500_000);
      expect(prop.images.hero).toMatch(/^https:\/\/images\.unsplash\.com\//);
      expect(prop.images.gallery.length).toBeGreaterThanOrEqual(4);
    }

    // Rent properties
    for (const prop of rentProperties) {
      expect(prop.listingType).toBe('rent');
      expect(prop.price.rentalPeriod).toBe('month');
      expect(prop.pricePerSqFt).toBeUndefined();
      expect(prop.rentalDetails).toBeDefined();
      expect(prop.rentalDetails?.leaseTerm).toBeDefined();
      expect(typeof prop.rentalDetails?.furnished).toBe('boolean');
      expect(typeof prop.rentalDetails?.petsAllowed).toBe('boolean');
      expect(prop.rentalDetails?.depositAmount).toBeGreaterThan(0);
      expect(prop.price.amount).toBeGreaterThanOrEqual(6_500);
      expect(prop.price.amount).toBeLessThanOrEqual(32_000);
      expect(prop.images.hero).toMatch(/^https:\/\/images\.unsplash\.com\//);
      expect(prop.images.gallery.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('resolves properties by ID and slug', () => {
    const sale01 = getPropertyById('prop-sale-01');
    expect(sale01).toBeDefined();
    expect(sale01?.slug).toBe('mercer-cast-iron-penthouse');

    const rent01 = getPropertyBySlug('water-street-clocktower-loft');
    expect(rent01).toBeDefined();
    expect(rent01?.id).toBe('prop-rent-01');
  });
});

describe('Formatters Utility', () => {
  it('formats sale prices without rental interval suffix', () => {
    expect(formatPrice({ amount: 7400000, currency: 'USD' })).toBe('$7,400,000');
    expect(formatPriceCompact({ amount: 7400000, currency: 'USD' })).toBe('$7.4M');
  });

  it('formats rental prices with monthly rate suffix', () => {
    expect(formatPrice({ amount: 14000, currency: 'USD', rentalPeriod: 'month' })).toBe('$14,000 / mo');
    expect(formatPriceCompact({ amount: 14000, currency: 'USD', rentalPeriod: 'month' })).toBe('$14K / mo');
  });

  it('formats square footage with comma notation', () => {
    expect(formatSqft(3450)).toBe('3,450 sq ft');
    expect(formatSqft(0)).toBe('0 sq ft');
  });

  it('formats dates into long human representation', () => {
    expect(formatDate('2026-11-01')).toBe('November 1, 2026');
  });

  it('formats bedrooms and bathrooms cleanly', () => {
    expect(formatBedrooms(0)).toBe('Studio');
    expect(formatBedrooms(1)).toBe('1 Bed');
    expect(formatBedrooms(4)).toBe('4 Beds');
    expect(formatBathrooms(1)).toBe('1 Bath');
    expect(formatBathrooms(3.5)).toBe('3.5 Baths');
  });
});

describe('Pure Functional Filtering & Sorting', () => {
  it('filters by location', () => {
    const soho = filterProperties(PROPERTIES, { location: 'SoHo' });
    expect(soho.length).toBeGreaterThan(0);
    expect(soho.every((p) => p.address.neighborhood === 'SoHo')).toBe(true);
  });

  it('filters by price boundaries', () => {
    const filtered = filterProperties(saleProperties, { minPrice: 5_000_000, maxPrice: 10_000_000 });
    expect(filtered.every((p) => p.price.amount >= 5_000_000 && p.price.amount <= 10_000_000)).toBe(true);
  });

  it('filters by bedroom threshold', () => {
    const filtered = filterProperties(PROPERTIES, { bedrooms: 4 });
    expect(filtered.every((p) => p.bedrooms >= 4)).toBe(true);
  });

  it('filters by rental pet policy and furnishing', () => {
    const petFriendly = filterProperties(rentProperties, { petsAllowed: true });
    expect(petFriendly.every((p) => p.rentalDetails?.petsAllowed === true)).toBe(true);

    const furnished = filterProperties(rentProperties, { furnished: true });
    expect(furnished.every((p) => p.rentalDetails?.furnished === true)).toBe(true);
  });

  it('sorts properties by price ascending and descending without mutating source', () => {
    const originalFirstId = saleProperties[0].id;
    const sortedAsc = sortProperties(saleProperties, 'price-asc');
    const sortedDesc = sortProperties(saleProperties, 'price-desc');

    expect(saleProperties[0].id).toBe(originalFirstId); // Source unmutated
    expect(sortedAsc[0].price.amount).toBeLessThanOrEqual(sortedAsc[1].price.amount);
    expect(sortedDesc[0].price.amount).toBeGreaterThanOrEqual(sortedDesc[1].price.amount);
  });

  it('sorts properties by square footage descending', () => {
    const sortedSqft = sortProperties(PROPERTIES, 'sqft-desc');
    expect(sortedSqft[0].squareFeet).toBeGreaterThanOrEqual(sortedSqft[1].squareFeet);
  });
});

describe('RFC 2368 Mailto Link Generator', () => {
  it('generates a valid mailto link for SellInquiry', () => {
    const link = generateMailtoLink({
      ownerName: 'Jonathan Sterling',
      email: 'j.sterling@example.com',
      phone: '+1 (415) 555-0142',
      propertyAddress: '2840 Broadway Street',
      propertyType: 'penthouse',
      estimatedBedrooms: 3,
      estimatedBathrooms: 3.5,
      estimatedValue: '$8,500,000',
    });

    expect(link.startsWith(`mailto:${AGENCY_SELL_EMAIL}?`)).toBe(true);
    expect(link).toContain('subject=Private%20Valuation%20Inquiry%20%E2%80%94%202840%20Broadway%20Street');
    expect(link).toContain(encodeURIComponent('Owner Name: Jonathan Sterling'));
    expect(link).toContain(encodeURIComponent('Property Type: penthouse'));
  });

  it('generates a valid mailto link for ContactInquiry', () => {
    const link = generateMailtoLink({
      fullName: 'Sophia Kensington',
      email: 'sophia@example.com',
      subject: 'Private Acquisition Advisory',
      message: 'Inquiring regarding private exclusive penthouses in SoHo.',
      preferredOffice: 'New York',
    });

    expect(link.startsWith(`mailto:${AGENCY_CONTACT_EMAIL}?`)).toBe(true);
    expect(link).toContain('subject=General%20Inquiry%3A%20Private%20Acquisition%20Advisory');
    expect(link).toContain(encodeURIComponent('Sophia Kensington'));
    expect(link).toContain(encodeURIComponent('Preferred Office: New York'));
  });
});
