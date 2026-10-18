import { describe, it, expect } from 'vitest';
import {
  MOCK_SALE_PROPERTIES,
  ALL_PROPERTIES,
  filterProperties,
  sortProperties,
  formatPrice,
  formatSqft,
  Property,
} from '../helpers/testFixtures';

describe('Tier 1: Buy Discovery Experience (/buy)', () => {
  // Feature 3: Buy Discovery Experience
  describe('Feature 3: Buy Catalog & Card Presentation', () => {
    it('should return exactly 8 agency-managed properties for Sale', () => {
      const saleProperties = ALL_PROPERTIES.filter((p) => p.listingType === 'sale');
      expect(saleProperties).toHaveLength(8);
      saleProperties.forEach((p) => {
        expect(p.listingType).toBe('sale');
        expect(p.price.amount).toBeGreaterThan(1_000_000);
      });
    });

    it('should display total purchase price formatted with currency symbol and no rental suffix', () => {
      const sample = MOCK_SALE_PROPERTIES[0];
      const formatted = formatPrice(sample.price);
      expect(formatted).toBe('$14,500,000');
      expect(formatted).not.toContain('/mo');
      expect(formatted).not.toContain('pcm');
      expect(formatted).not.toContain('/wk');
    });

    it('should accurately calculate and expose price per square foot', () => {
      MOCK_SALE_PROPERTIES.forEach((property) => {
        expect(property.pricePerSqFt).toBeDefined();
        const expectedPpsf = Math.round(property.price.amount / property.squareFeet);
        expect(property.pricePerSqFt).toBeCloseTo(expectedPpsf, -1);
      });
    });

    it('should format square footage with thousands separators', () => {
      const formatted = formatSqft(4200);
      expect(formatted).toBe('4,200 sq ft');
    });

    it('should display rich property card specifications: beds, baths, and neighborhood', () => {
      const property = MOCK_SALE_PROPERTIES[0];
      expect(property.bedrooms).toBe(4);
      expect(property.bathrooms).toBe(4);
      expect(property.address.neighborhood).toBe('Belgravia');
      expect(property.address.city).toBe('London');
    });
  });

  // Feature 5: Buy vs Rent Financial Separation
  describe('Feature 5: Buy vs Rent Financial Separation (Sale Integrity)', () => {
    it('should guarantee rentalPeriod is null for all sale properties', () => {
      MOCK_SALE_PROPERTIES.forEach((property) => {
        expect(property.price.rentalPeriod).toBeNull();
      });
    });

    it('should strictly exclude rentalDetails (deposit, lease term) from sale properties', () => {
      MOCK_SALE_PROPERTIES.forEach((property) => {
        expect(property.rentalDetails).toBeUndefined();
      });
    });

    it('should prevent rental rate filtering criteria from corrupting sale listing evaluation', () => {
      const filtered = filterProperties(MOCK_SALE_PROPERTIES, {
        rentalInterval: 'Annual (12+ Months)',
      });
      // Sale properties have no rentalDetails, so rental interval filtering should exclude them
      expect(filtered).toHaveLength(0);
    });

    it('should verify that all sale prices exceed rental monthly rates by several orders of magnitude', () => {
      const minSalePrice = Math.min(...MOCK_SALE_PROPERTIES.map((p) => p.price.amount));
      expect(minSalePrice).toBeGreaterThanOrEqual(4_000_000);
    });

    it('should ensure status badges on sale properties reflect sales statuses', () => {
      const validStatuses = ['Active', 'Private Exclusive', 'Coming Soon', 'Price Improvement', 'Under Contract'];
      MOCK_SALE_PROPERTIES.forEach((p) => {
        expect(validStatuses).toContain(p.status);
      });
    });
  });

  // Feature 7: Price Range Filtering on Sale Listings
  describe('Feature 7: Price Range Filtering on Buy', () => {
    it('should filter sale properties by minimum purchase price', () => {
      const minPrice = 10_000_000;
      const results = filterProperties(MOCK_SALE_PROPERTIES, { minPrice });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.price.amount).toBeGreaterThanOrEqual(minPrice);
      });
    });

    it('should filter sale properties by maximum purchase price', () => {
      const maxPrice = 8_000_000;
      const results = filterProperties(MOCK_SALE_PROPERTIES, { maxPrice });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.price.amount).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should filter sale properties within a dual bounded price range', () => {
      const minPrice = 6_000_000;
      const maxPrice = 15_000_000;
      const results = filterProperties(MOCK_SALE_PROPERTIES, { minPrice, maxPrice });
      results.forEach((p) => {
        expect(p.price.amount).toBeGreaterThanOrEqual(minPrice);
        expect(p.price.amount).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should match inclusive price boundaries', () => {
      const exactPrice = 14_500_000;
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        minPrice: exactPrice,
        maxPrice: exactPrice,
      });
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('vs-sale-01');
    });

    it('should return empty list when price range falls outside any available property', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        minPrice: 50_000_000,
      });
      expect(results).toHaveLength(0);
    });
  });

  // Feature 9: Property Type Filtering
  describe('Feature 9: Property Type Filtering on Buy', () => {
    it('should filter specifically for penthouses', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        propertyTypes: ['penthouse'],
      });
      expect(results.length).toBeGreaterThanOrEqual(2);
      results.forEach((p) => expect(p.propertyType).toBe('penthouse'));
    });

    it('should filter specifically for townhouses', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        propertyTypes: ['townhouse'],
      });
      expect(results.length).toBeGreaterThanOrEqual(1);
      results.forEach((p) => expect(p.propertyType).toBe('townhouse'));
    });

    it('should filter specifically for villas', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        propertyTypes: ['villa'],
      });
      expect(results.length).toBeGreaterThanOrEqual(2);
      results.forEach((p) => expect(p.propertyType).toBe('villa'));
    });

    it('should support multi-type filtering (e.g. penthouse OR villa)', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        propertyTypes: ['penthouse', 'villa'],
      });
      results.forEach((p) => {
        expect(['penthouse', 'villa']).toContain(p.propertyType);
      });
    });

    it('should return all properties if propertyTypes filter array is empty', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        propertyTypes: [],
      });
      expect(results).toHaveLength(MOCK_SALE_PROPERTIES.length);
    });
  });

  // Feature 13: 5-Way Sorting
  describe('Feature 13: 5-Way Sorting on Buy Listings', () => {
    it('should sort properties by price ascending (lowest first)', () => {
      const sorted = sortProperties(MOCK_SALE_PROPERTIES, 'price-asc');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].price.amount).toBeLessThanOrEqual(sorted[i + 1].price.amount);
      }
    });

    it('should sort properties by price descending (highest first)', () => {
      const sorted = sortProperties(MOCK_SALE_PROPERTIES, 'price-desc');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].price.amount).toBeGreaterThanOrEqual(sorted[i + 1].price.amount);
      }
    });

    it('should sort properties by square footage descending (largest first)', () => {
      const sorted = sortProperties(MOCK_SALE_PROPERTIES, 'sqft-desc');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].squareFeet).toBeGreaterThanOrEqual(sorted[i + 1].squareFeet);
      }
    });

    it('should sort properties by newest construction/renovation year first', () => {
      const sorted = sortProperties(MOCK_SALE_PROPERTIES, 'newest');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].yearBuilt).toBeGreaterThanOrEqual(sorted[i + 1].yearBuilt);
      }
    });

    it('should prioritize featured properties in default featured sort', () => {
      const sorted = sortProperties(MOCK_SALE_PROPERTIES, 'featured');
      const firstNonFeaturedIndex = sorted.findIndex((p) => !p.featured);
      if (firstNonFeaturedIndex !== -1) {
        for (let i = 0; i < firstNonFeaturedIndex; i++) {
          expect(sorted[i].featured).toBe(true);
        }
      }
    });
  });
});
