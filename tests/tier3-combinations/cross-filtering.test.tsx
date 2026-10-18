import { describe, it, expect } from 'vitest';
import {
  MOCK_SALE_PROPERTIES,
  MOCK_RENT_PROPERTIES,
  ALL_PROPERTIES,
  filterProperties,
  sortProperties,
} from '../helpers/testFixtures';

describe('Tier 3: Pairwise Combinatorial Cross-Filtering', () => {
  // Pairwise Matrix on Sale Properties
  describe('Pairwise Dimension Combinations on Sale Catalog', () => {
    it('Combination 1: Location (Belgravia) + Price ($10M - $20M)', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        location: 'Belgravia',
        minPrice: 10_000_000,
        maxPrice: 20_000_000,
      });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('The Belgravia Crescent Penthouse');
    });

    it('Combination 2: Location (Kensington) + Bedrooms (6+)', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        location: 'Kensington',
        bedrooms: 6,
      });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Holland Park Modernist Villa');
    });

    it('Combination 3: Location (Marylebone) + Property Type (townhouse)', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        location: 'Marylebone',
        propertyTypes: ['townhouse'],
      });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('The Marylebone High Townhouse');
    });

    it('Combination 4: Price (< $5M) + Property Type (loft)', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        maxPrice: 5_000_000,
        propertyTypes: ['loft'],
      });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('The Mayfair Heritage Loft');
    });

    it('Combination 5: Price (> $20M) + Property Type (estate)', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        minPrice: 20_000_000,
        propertyTypes: ['estate'],
      });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Knightsbridge Garden Estate');
    });

    it('Combination 6: Bedrooms (3+) + Bathrooms (3+) + Property Type (apartment)', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        bedrooms: 3,
        bathrooms: 3,
        propertyTypes: ['apartment'],
      });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Chelsea Embankment Riverside Duplex');
    });

    it('Combination 7: Dual Property Types (penthouse, villa) + Min Price ($15M)', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        propertyTypes: ['penthouse', 'villa'],
        minPrice: 15_000_000,
      });
      expect(results.length).toBeGreaterThanOrEqual(2);
      results.forEach((p) => {
        expect(['penthouse', 'villa']).toContain(p.propertyType);
        expect(p.price.amount).toBeGreaterThanOrEqual(15_000_000);
      });
    });

    it('Combination 8: Triple Constraint yielding Exactly 1 Unique Match', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        location: 'Regent',
        minPrice: 15_000_000,
        propertyTypes: ['villa'],
      });
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('vs-sale-07');
    });

    it('Combination 9: Disjoint Constraint Intersection yielding Exactly 0 Matches', () => {
      // Loft in Knightsbridge does not exist in our catalog
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        location: 'Knightsbridge',
        propertyTypes: ['loft'],
      });
      expect(results).toHaveLength(0);
    });
  });

  // Pairwise Matrix on Rental Properties
  describe('Pairwise Dimension Combinations on Rental Catalog', () => {
    it('Rental Combo 1: Location (Mayfair) + Monthly Rate (< $15,000/mo) + Furnished (true)', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        location: 'Mayfair',
        maxPrice: 15_000,
        furnished: true,
      });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('The Connaught Square Residence');
    });

    it('Rental Combo 2: Lease Term (Annual) + Pets Allowed (true)', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        rentalInterval: 'Annual (12+ Months)',
        petsAllowed: true,
      });
      expect(results.length).toBeGreaterThanOrEqual(2);
      results.forEach((p) => {
        expect(p.rentalDetails?.leaseTerm).toBe('Annual (12+ Months)');
        expect(p.rentalDetails?.petsAllowed).toBe(true);
      });
    });

    it('Rental Combo 3: Property Type (villa) + Bedrooms (5+) + Monthly Rate ($15k+)', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        propertyTypes: ['villa'],
        bedrooms: 5,
        minPrice: 15_000,
      });
      expect(results).toHaveLength(2);
      results.forEach((p) => {
        expect(p.propertyType).toBe('villa');
        expect(p.bedrooms).toBeGreaterThanOrEqual(5);
        expect(p.price.amount).toBeGreaterThanOrEqual(15_000);
      });
    });

    it('Rental Combo 4: Flexible Lease (< 12 months) + Furnished (true)', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        rentalInterval: 'Flexible (3-11 Months)',
        furnished: true,
      });
      expect(results.length).toBeGreaterThanOrEqual(2);
      results.forEach((p) => {
        expect(p.rentalDetails?.leaseTerm).toBe('Flexible (3-11 Months)');
        expect(p.rentalDetails?.furnished).toBe(true);
      });
    });

    it('Rental Combo 5: Short-Term (< 3 Months) + Soho Loft', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        location: 'Soho',
        rentalInterval: 'Short-Term (< 3 Months)',
      });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Soho Artist Loft & Terrace');
    });
  });

  // Filter Combinations with Sorting
  describe('Filter Combinations with Sorting Interaction', () => {
    it('should filter by Bedrooms (4+) and sort by price descending', () => {
      const filtered = filterProperties(MOCK_SALE_PROPERTIES, { bedrooms: 4 });
      const sorted = sortProperties(filtered, 'price-desc');
      expect(sorted.length).toBeGreaterThan(1);
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].price.amount).toBeGreaterThanOrEqual(sorted[i + 1].price.amount);
      }
    });

    it('should filter by Property Type (penthouse) and sort by square footage descending', () => {
      const filtered = filterProperties(MOCK_SALE_PROPERTIES, { propertyTypes: ['penthouse'] });
      const sorted = sortProperties(filtered, 'sqft-desc');
      expect(sorted.length).toBeGreaterThanOrEqual(2);
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].squareFeet).toBeGreaterThanOrEqual(sorted[i + 1].squareFeet);
      }
    });

    it('should maintain sorted order after further narrowing the filter', () => {
      const initialFiltered = filterProperties(MOCK_SALE_PROPERTIES, { minPrice: 5_000_000 });
      const initialSorted = sortProperties(initialFiltered, 'price-asc');

      const narrowed = filterProperties(initialSorted, { minPrice: 7_000_000 });
      const narrowedSorted = sortProperties(narrowed, 'price-asc');

      for (let i = 0; i < narrowedSorted.length - 1; i++) {
        expect(narrowedSorted[i].price.amount).toBeLessThanOrEqual(narrowedSorted[i + 1].price.amount);
      }
    });
  });
});
