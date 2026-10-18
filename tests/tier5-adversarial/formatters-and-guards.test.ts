/**
 * tests/tier5-adversarial/formatters-and-guards.test.ts
 * Milestone 5 Tier 5: White-Box Adversarial Hardening for Formatters, Filters, and Null Guards.
 * 
 * Verifies exhaustive boundary handling for formatting functions and filter algorithms
 * against null, undefined, NaN, negative, zero, and irregular inputs.
 */

import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatPriceCompact,
  formatSqft,
  formatPricePerSqft,
  formatDate,
  formatBedrooms,
  formatBathrooms,
} from '@/lib/formatters';
import { filterProperties, sortProperties } from '@/lib/filters';
import { PROPERTIES } from '@/data/properties';
import { Price, Property } from '@/types/property';

describe('Tier 5 Adversarial: Formatters, Filters, and Null Guards', () => {
  describe('formatPrice Null Guards and Edge Cases', () => {
    it('handles null, undefined, and non-numeric price objects safely', () => {
      expect(formatPrice(null as any)).toBe('Price Upon Request');
      expect(formatPrice(undefined as any)).toBe('Price Upon Request');
      expect(formatPrice({ amount: NaN, currency: 'USD' })).toBe('Price Upon Request');
      expect(formatPrice({ amount: '5000' as any, currency: 'USD' })).toBe('Price Upon Request');
      expect(formatPrice({} as any)).toBe('Price Upon Request');
    });

    it('formats zero price correctly as currency', () => {
      expect(formatPrice({ amount: 0, currency: 'USD' })).toBe('$0');
    });

    it('formats negative prices with standard negative formatting without crashing', () => {
      expect(formatPrice({ amount: -1500000, currency: 'USD' })).toBe('$-1,500,000');
    });

    it('formats currencies (USD, GBP, EUR) and falls back to $ for unsupported currency', () => {
      expect(formatPrice({ amount: 1000000, currency: 'USD' })).toBe('$1,000,000');
      expect(formatPrice({ amount: 1000000, currency: 'GBP' })).toBe('£1,000,000');
      expect(formatPrice({ amount: 1000000, currency: 'EUR' })).toBe('€1,000,000');
      expect(formatPrice({ amount: 1000000, currency: 'CHF' as any })).toBe('$1,000,000');
    });

    it('formats rental periods (month, year) and supports spaced separator option', () => {
      const monthlyPrice: Price = { amount: 14000, currency: 'USD', rentalPeriod: 'month' };
      expect(formatPrice(monthlyPrice)).toBe('$14,000 / mo');
      expect(formatPrice(monthlyPrice, { spaced: false })).toBe('$14,000/mo');

      const annualPrice: Price = { amount: 168000, currency: 'GBP', rentalPeriod: 'year' };
      expect(formatPrice(annualPrice)).toBe('£168,000 / yr');
      expect(formatPrice(annualPrice, { spaced: false })).toBe('£168,000/yr');
    });
  });

  describe('formatPriceCompact Null Guards and Range Scaling', () => {
    it('handles null and invalid types', () => {
      expect(formatPriceCompact(null as any)).toBe('Price Upon Request');
      expect(formatPriceCompact(undefined as any)).toBe('Price Upon Request');
      expect(formatPriceCompact({} as any)).toBe('Price Upon Request');
    });

    it('compacts millions ($X.XM and $XM without trailing .0)', () => {
      expect(formatPriceCompact({ amount: 7400000, currency: 'USD' })).toBe('$7.4M');
      expect(formatPriceCompact({ amount: 2000000, currency: 'USD' })).toBe('$2M');
      expect(formatPriceCompact({ amount: 14500000, currency: 'GBP' })).toBe('£14.5M');
      expect(formatPriceCompact({ amount: 1000000, currency: 'EUR' })).toBe('€1M');
    });

    it('compacts thousands ($Xk) and rental month suffix', () => {
      expect(formatPriceCompact({ amount: 14000, currency: 'USD', rentalPeriod: 'month' })).toBe('$14K / mo');
      expect(formatPriceCompact({ amount: 50000, currency: 'USD' })).toBe('$50K');
      expect(formatPriceCompact({ amount: 950, currency: 'USD' })).toBe('$950');
    });
  });

  describe('formatSqft, formatPricePerSqft, and formatDate Guards', () => {
    it('formatSqft guards against zero, negative, NaN, and non-numeric inputs', () => {
      expect(formatSqft(0)).toBe('0 sq ft');
      expect(formatSqft(-500)).toBe('0 sq ft');
      expect(formatSqft(NaN)).toBe('0 sq ft');
      expect(formatSqft(null as any)).toBe('0 sq ft');
      expect(formatSqft(undefined as any)).toBe('0 sq ft');
      expect(formatSqft(3450)).toBe('3,450 sq ft');
    });

    it('formatPricePerSqft guards against zero, negative, NaN, and non-numeric inputs', () => {
      expect(formatPricePerSqft(0)).toBe('N/A');
      expect(formatPricePerSqft(-100)).toBe('N/A');
      expect(formatPricePerSqft(NaN)).toBe('N/A');
      expect(formatPricePerSqft(undefined)).toBe('N/A');
      expect(formatPricePerSqft(2145, 'USD')).toBe('$2,145 / sq ft');
      expect(formatPricePerSqft(1950, 'GBP')).toBe('£1,950 / sq ft');
      expect(formatPricePerSqft(3200, 'EUR')).toBe('€3,200 / sq ft');
    });

    it('formatDate guards against empty and invalid date strings', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate(null as any)).toBe('');
      expect(formatDate(undefined as any)).toBe('');
      expect(formatDate('invalid-date')).toBe('invalid-date');
      expect(formatDate('2026-11-01')).toBe('November 1, 2026');
    });

    it('formatBedrooms and formatBathrooms format cleanly', () => {
      expect(formatBedrooms(0)).toBe('Studio');
      expect(formatBedrooms(1)).toBe('1 Bed');
      expect(formatBedrooms(4)).toBe('4 Beds');

      expect(formatBathrooms(1)).toBe('1 Bath');
      expect(formatBathrooms(2.5)).toBe('2.5 Baths');
      expect(formatBathrooms(4)).toBe('4 Baths');
    });
  });

  describe('filterProperties Defensive Guards and Pipeline Resilience', () => {
    it('returns empty array when properties list is null or undefined or not an array', () => {
      expect(filterProperties(null as any, {})).toEqual([]);
      expect(filterProperties(undefined as any, {})).toEqual([]);
      expect(filterProperties('not-an-array' as any, {})).toEqual([]);
      expect(filterProperties([], {})).toEqual([]);
    });

    it('does not mutate original properties array', () => {
      const copy = [...PROPERTIES];
      const filtered = filterProperties(PROPERTIES, { minPrice: 10000000 });
      expect(PROPERTIES.length).toBe(copy.length);
      expect(filtered.length).toBeLessThan(PROPERTIES.length);
    });

    it('filters accurately with studio bedroom criterion', () => {
      // Create mock catalog with a studio
      const mockProps: Property[] = [
        {
          ...PROPERTIES[0],
          id: 'test-studio',
          bedrooms: 0,
        },
        {
          ...PROPERTIES[1],
          id: 'test-1bed',
          bedrooms: 1,
        },
      ];

      const studioResult = filterProperties(mockProps, { bedrooms: 'studio' });
      expect(studioResult).toHaveLength(1);
      expect(studioResult[0].id).toBe('test-studio');

      const numZeroResult = filterProperties(mockProps, { bedrooms: 0 });
      expect(numZeroResult).toHaveLength(1);
      expect(numZeroResult[0].id).toBe('test-studio');

      const stringZeroResult = filterProperties(mockProps, { bedrooms: '0' });
      expect(stringZeroResult).toHaveLength(1);
      expect(stringZeroResult[0].id).toBe('test-studio');
    });

    it('filters by multiple property types simultaneously', () => {
      const multiType = filterProperties(PROPERTIES, {
        propertyTypes: ['penthouse', 'loft'],
      });
      multiType.forEach((prop) => {
        expect(['penthouse', 'loft']).toContain(prop.propertyType);
      });
    });

    it('filters rental properties by furnished and petsAllowed booleans safely', () => {
      const rentOnly = PROPERTIES.filter((p) => p.listingType === 'rent');

      const furnishedOnly = filterProperties(rentOnly, { furnished: true });
      furnishedOnly.forEach((p) => {
        expect(p.rentalDetails?.furnished).toBe(true);
      });

      const unfurnishedOnly = filterProperties(rentOnly, { furnished: false });
      unfurnishedOnly.forEach((p) => {
        expect(p.rentalDetails?.furnished).toBe(false);
      });

      const petsOnly = filterProperties(rentOnly, { petsAllowed: true });
      petsOnly.forEach((p) => {
        expect(p.rentalDetails?.petsAllowed).toBe(true);
      });
    });
  });

  describe('sortProperties Defensive Guards and Stability', () => {
    it('returns empty array when source is null or undefined', () => {
      expect(sortProperties(null as any)).toEqual([]);
      expect(sortProperties(undefined as any)).toEqual([]);
    });

    it('handles all 5 sort options correctly without mutating original array', () => {
      const original = [...PROPERTIES];

      const featured = sortProperties(PROPERTIES, 'featured');
      expect(featured[0].featured).toBe(true);

      const newest = sortProperties(PROPERTIES, 'newest');
      for (let i = 0; i < newest.length - 1; i++) {
        expect(newest[i].yearBuilt).toBeGreaterThanOrEqual(newest[i + 1].yearBuilt);
      }

      const priceAsc = sortProperties(PROPERTIES, 'price-asc');
      for (let i = 0; i < priceAsc.length - 1; i++) {
        expect(priceAsc[i].price.amount).toBeLessThanOrEqual(priceAsc[i + 1].price.amount);
      }

      const priceDesc = sortProperties(PROPERTIES, 'price-desc');
      for (let i = 0; i < priceDesc.length - 1; i++) {
        expect(priceDesc[i].price.amount).toBeGreaterThanOrEqual(priceDesc[i + 1].price.amount);
      }

      const sqftDesc = sortProperties(PROPERTIES, 'sqft-desc');
      for (let i = 0; i < sqftDesc.length - 1; i++) {
        expect(sqftDesc[i].squareFeet).toBeGreaterThanOrEqual(sqftDesc[i + 1].squareFeet);
      }

      // Verify original is untouched
      expect(PROPERTIES[0].id).toBe(original[0].id);
    });

    it('falls back to returning copy of array on unknown sort option', () => {
      const result = sortProperties(PROPERTIES, 'unknown-sort' as any);
      expect(result).toHaveLength(PROPERTIES.length);
    });
  });
});
