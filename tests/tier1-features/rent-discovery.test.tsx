import { describe, it, expect } from 'vitest';
import {
  MOCK_RENT_PROPERTIES,
  ALL_PROPERTIES,
  filterProperties,
  sortProperties,
  formatPrice,
} from '../helpers/testFixtures';

describe('Tier 1: Rent Discovery Experience (/rent)', () => {
  // Feature 4: Rent Discovery Experience
  describe('Feature 4: Rental Catalog & Presentation', () => {
    it('should return exactly 8 agency-managed properties for Rent', () => {
      const rentalProperties = ALL_PROPERTIES.filter((p) => p.listingType === 'rent');
      expect(rentalProperties).toHaveLength(8);
      rentalProperties.forEach((p) => {
        expect(p.listingType).toBe('rent');
        expect(p.price.amount).toBeLessThan(100_000); // monthly rates
      });
    });

    it('should format rental pricing with "/mo" suffix', () => {
      const sample = MOCK_RENT_PROPERTIES[0];
      const formatted = formatPrice(sample.price);
      expect(formatted).toBe('$14,000/mo');
      expect(formatted).toContain('/mo');
    });

    it('should include rental details with availability date and deposit amount', () => {
      MOCK_RENT_PROPERTIES.forEach((property) => {
        expect(property.rentalDetails).toBeDefined();
        expect(property.rentalDetails?.availableDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(property.rentalDetails?.depositAmount).toBeGreaterThan(0);
      });
    });

    it('should display valid lease terms among standard luxury tenancy durations', () => {
      const validTerms = [
        'Annual (12+ Months)',
        'Flexible (3-11 Months)',
        'Short-Term (< 3 Months)',
      ];
      MOCK_RENT_PROPERTIES.forEach((property) => {
        expect(validTerms).toContain(property.rentalDetails?.leaseTerm);
      });
    });

    it('should render rich specs on rental property cards', () => {
      const property = MOCK_RENT_PROPERTIES[0];
      expect(property.bedrooms).toBe(3);
      expect(property.bathrooms).toBe(3);
      expect(property.squareFeet).toBe(2450);
      expect(property.address.neighborhood).toBe('Mayfair');
    });
  });

  // Feature 5: Buy vs Rent Separation (Rent Integrity)
  describe('Feature 5: Buy vs Rent Financial Separation (Rental Integrity)', () => {
    it('should ensure all rental properties define rentalPeriod as "month"', () => {
      MOCK_RENT_PROPERTIES.forEach((property) => {
        expect(property.price.rentalPeriod).toBe('month');
      });
    });

    it('should ensure no rental property price has a multi-million capital amount', () => {
      MOCK_RENT_PROPERTIES.forEach((property) => {
        expect(property.price.amount).toBeLessThan(1_000_000);
      });
    });

    it('should exclude sale-only attributes like pricePerSqFt from primary rental quote', () => {
      // Primary quote for rentals must be monthly lease
      MOCK_RENT_PROPERTIES.forEach((property) => {
        const formatted = formatPrice(property.price);
        expect(formatted).toContain('/mo');
      });
    });

    it('should prevent purchase-scale filters from returning rental listings', () => {
      // If user erroneously applies a $5M minimum price on rentals, 0 matches should return
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        minPrice: 5_000_000,
      });
      expect(results).toHaveLength(0);
    });

    it('should guarantee rental listings never have status "Under Contract" without rental details', () => {
      const underContract = MOCK_RENT_PROPERTIES.filter((p) => p.status === 'Under Contract');
      underContract.forEach((p) => {
        expect(p.rentalDetails).toBeDefined();
      });
    });
  });

  // Feature 10: Rental-Specific Filters (Lease, Furnished, Pets)
  describe('Feature 10: Rental-Specific Filters (Lease, Furnished, Pets)', () => {
    it('should filter rentals by Annual (12+ Months) lease term', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        rentalInterval: 'Annual (12+ Months)',
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.rentalDetails?.leaseTerm).toBe('Annual (12+ Months)');
      });
    });

    it('should filter rentals by Flexible (3-11 Months) lease term', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        rentalInterval: 'Flexible (3-11 Months)',
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.rentalDetails?.leaseTerm).toBe('Flexible (3-11 Months)');
      });
    });

    it('should filter rentals by Short-Term (< 3 Months) lease term', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        rentalInterval: 'Short-Term (< 3 Months)',
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.rentalDetails?.leaseTerm).toBe('Short-Term (< 3 Months)');
      });
    });

    it('should filter for furnished residences only', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        furnished: true,
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.rentalDetails?.furnished).toBe(true);
      });
    });

    it('should filter for unfurnished residences only', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        furnished: false,
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.rentalDetails?.furnished).toBe(false);
      });
    });

    it('should filter for pet-friendly rental properties', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        petsAllowed: true,
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.rentalDetails?.petsAllowed).toBe(true);
      });
    });

    it('should combine rental filters: Annual lease + Furnished + Pet friendly', () => {
      const results = filterProperties(MOCK_RENT_PROPERTIES, {
        rentalInterval: 'Annual (12+ Months)',
        furnished: true,
        petsAllowed: true,
      });
      results.forEach((p) => {
        expect(p.rentalDetails?.leaseTerm).toBe('Annual (12+ Months)');
        expect(p.rentalDetails?.furnished).toBe(true);
        expect(p.rentalDetails?.petsAllowed).toBe(true);
      });
    });
  });

  // Feature 7: Rental Monthly Price Range Filtering
  describe('Feature 7: Rental Monthly Price Range Filtering', () => {
    it('should filter rentals by minimum monthly rate', () => {
      const minPrice = 15_000;
      const results = filterProperties(MOCK_RENT_PROPERTIES, { minPrice });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.price.amount).toBeGreaterThanOrEqual(minPrice);
      });
    });

    it('should filter rentals by maximum monthly rate', () => {
      const maxPrice = 12_000;
      const results = filterProperties(MOCK_RENT_PROPERTIES, { maxPrice });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.price.amount).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should filter rentals within dual-bounded monthly rate bracket', () => {
      const minPrice = 7_000;
      const maxPrice = 16_000;
      const results = filterProperties(MOCK_RENT_PROPERTIES, { minPrice, maxPrice });
      results.forEach((p) => {
        expect(p.price.amount).toBeGreaterThanOrEqual(minPrice);
        expect(p.price.amount).toBeLessThanOrEqual(maxPrice);
      });
    });
  });

  // Feature 13: Sorting on Rental Listings
  describe('Feature 13: Sorting on Rental Listings', () => {
    it('should sort rentals by monthly price ascending (cheapest rent first)', () => {
      const sorted = sortProperties(MOCK_RENT_PROPERTIES, 'price-asc');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].price.amount).toBeLessThanOrEqual(sorted[i + 1].price.amount);
      }
    });

    it('should sort rentals by monthly price descending (most expensive rent first)', () => {
      const sorted = sortProperties(MOCK_RENT_PROPERTIES, 'price-desc');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].price.amount).toBeGreaterThanOrEqual(sorted[i + 1].price.amount);
      }
    });

    it('should sort rentals by square footage descending', () => {
      const sorted = sortProperties(MOCK_RENT_PROPERTIES, 'sqft-desc');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].squareFeet).toBeGreaterThanOrEqual(sorted[i + 1].squareFeet);
      }
    });
  });
});
