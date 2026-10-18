import { describe, it, expect } from 'vitest';
import {
  ALL_PROPERTIES,
  MOCK_SALE_PROPERTIES,
  MOCK_RENT_PROPERTIES,
  filterProperties,
  PropertyFilterParams,
  PropertyType,
} from '../helpers/testFixtures';

describe('Tier 2: Filter Boundary & Edge Cases', () => {
  // Extreme Price Boundaries
  describe('Extreme Price Ranges & Inverted Bounds', () => {
    it('should handle zero minPrice (0) gracefully by returning all properties up to maxPrice', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, { minPrice: 0, maxPrice: 10_000_000 });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => expect(p.price.amount).toBeLessThanOrEqual(10_000_000));
    });

    it('should ignore negative minPrice (e.g. -5000) or treat as 0 without crashing', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, { minPrice: -5000 });
      expect(results).toHaveLength(MOCK_SALE_PROPERTIES.length);
    });

    it('should return empty array when minPrice is greater than maxPrice (inverted bounds)', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        minPrice: 15_000_000,
        maxPrice: 5_000_000,
      });
      // No property amount can be >= 15M AND <= 5M
      expect(results).toHaveLength(0);
    });

    it('should return 0 matches for astronomical minPrice (e.g. $100M+)', () => {
      const results = filterProperties(ALL_PROPERTIES, { minPrice: 100_000_000 });
      expect(results).toHaveLength(0);
    });

    it('should return exact match when minPrice equals maxPrice and matches a property exactly', () => {
      const target = MOCK_SALE_PROPERTIES[0];
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        minPrice: target.price.amount,
        maxPrice: target.price.amount,
      });
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(target.id);
    });

    it('should return 0 matches when minPrice equals maxPrice but matches no property', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        minPrice: 12_345_678,
        maxPrice: 12_345_678,
      });
      expect(results).toHaveLength(0);
    });

    it('should handle NaN minPrice without throwing and ignore it', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, { minPrice: NaN });
      expect(results).toHaveLength(MOCK_SALE_PROPERTIES.length);
    });

    it('should handle NaN maxPrice without throwing and ignore it', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, { maxPrice: NaN });
      expect(results).toHaveLength(MOCK_SALE_PROPERTIES.length);
    });
  });

  // String & Special Character Boundaries in Location Search
  describe('Location Query Boundaries & Special Characters', () => {
    it('should safely handle special regex meta-characters (*, +, ?, ^, $, (, )) in location without crash', () => {
      const regexChars = ['*', '+', '?', '^', '$', '(', ')', '[', ']', '{', '}', '|', '\\'];
      regexChars.forEach((char) => {
        expect(() => {
          const res = filterProperties(ALL_PROPERTIES, { location: `Mayfair${char}` });
          expect(Array.isArray(res)).toBe(true);
        }).not.toThrow();
      });
    });

    it('should handle Unicode and diacritics in location search (e.g. "Zürich", "St. John\'s")', () => {
      const resultsWithApostrophe = filterProperties(ALL_PROPERTIES, { location: "St John's" });
      expect(resultsWithApostrophe.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle HTML tag injection in location search gracefully', () => {
      const injection = '<script>alert("xss")</script>';
      const results = filterProperties(ALL_PROPERTIES, { location: injection });
      expect(results).toHaveLength(0);
    });

    it('should handle SQL injection strings in location search safely', () => {
      const sqlInjection = "' OR 1=1 --";
      const results = filterProperties(ALL_PROPERTIES, { location: sqlInjection });
      expect(results).toHaveLength(0);
    });

    it('should handle extremely long string (1000 characters) in location without hanging', () => {
      const longQuery = 'A'.repeat(1000);
      const start = Date.now();
      const results = filterProperties(ALL_PROPERTIES, { location: longQuery });
      const duration = Date.now() - start;
      expect(results).toHaveLength(0);
      expect(duration).toBeLessThan(100);
    });

    it('should handle control characters and newlines in location string', () => {
      const queryWithNewline = 'Mayfair\n\r\t';
      const results = filterProperties(ALL_PROPERTIES, { location: queryWithNewline });
      expect(results.length).toBeGreaterThanOrEqual(2);
    });
  });

  // Bedroom & Bathroom Edge Cases
  describe('Bedroom & Bathroom Edge Cases', () => {
    it('should return 0 matches when required bedrooms exceeds catalog maximum (e.g. 20 bedrooms)', () => {
      const results = filterProperties(ALL_PROPERTIES, { bedrooms: 20 });
      expect(results).toHaveLength(0);
    });

    it('should return 0 matches when required bathrooms exceeds catalog maximum (e.g. 15 bathrooms)', () => {
      const results = filterProperties(ALL_PROPERTIES, { bathrooms: 15 });
      expect(results).toHaveLength(0);
    });

    it('should handle decimal bedroom values by checking greater-than-or-equal', () => {
      const results = filterProperties(ALL_PROPERTIES, { bedrooms: 3.5 });
      results.forEach((p) => {
        expect(p.bedrooms).toBeGreaterThanOrEqual(3.5);
      });
    });

    it('should ignore negative bedroom requests', () => {
      const results = filterProperties(ALL_PROPERTIES, { bedrooms: -1 });
      expect(results).toHaveLength(ALL_PROPERTIES.length);
    });

    it('should ignore negative bathroom requests', () => {
      const results = filterProperties(ALL_PROPERTIES, { bathrooms: -2 });
      expect(results).toHaveLength(ALL_PROPERTIES.length);
    });
  });

  // Property Type Edge Cases
  describe('Property Type Filter Boundaries', () => {
    it('should return 0 matches when filtering by non-existent property type', () => {
      const results = filterProperties(ALL_PROPERTIES, {
        propertyTypes: ['space_station' as unknown as PropertyType],
      });
      expect(results).toHaveLength(0);
    });

    it('should handle array with duplicate property types without duplicate results', () => {
      const results = filterProperties(MOCK_SALE_PROPERTIES, {
        propertyTypes: ['penthouse', 'penthouse', 'penthouse'],
      });
      const uniqueIds = new Set(results.map((p) => p.id));
      expect(uniqueIds.size).toBe(results.length);
      results.forEach((p) => expect(p.propertyType).toBe('penthouse'));
    });

    it('should return all properties when propertyTypes array includes all valid types', () => {
      const allTypes: PropertyType[] = ['apartment', 'penthouse', 'villa', 'townhouse', 'estate', 'loft'];
      const results = filterProperties(ALL_PROPERTIES, { propertyTypes: allTypes });
      expect(results).toHaveLength(ALL_PROPERTIES.length);
    });
  });
});
