import { describe, it, expect } from 'vitest';
import {
  ALL_PROPERTIES,
  MOCK_SALE_PROPERTIES,
  MOCK_RENT_PROPERTIES,
  Property,
} from '../helpers/testFixtures';

describe('Tier 1: Property Detail View & Domain Data Model', () => {
  // Feature 2: Domain Data Model & Curated Listings
  describe('Feature 2: Domain Data Model & Catalog Integrity', () => {
    it('should contain exactly 16 curated properties (8 Sale, 8 Rent)', () => {
      expect(ALL_PROPERTIES).toHaveLength(16);
      const saleCount = ALL_PROPERTIES.filter((p) => p.listingType === 'sale').length;
      const rentCount = ALL_PROPERTIES.filter((p) => p.listingType === 'rent').length;
      expect(saleCount).toBe(8);
      expect(rentCount).toBe(8);
    });

    it('should ensure all properties have unique IDs and unique URL slugs', () => {
      const ids = new Set(ALL_PROPERTIES.map((p) => p.id));
      const slugs = new Set(ALL_PROPERTIES.map((p) => p.slug));
      expect(ids.size).toBe(16);
      expect(slugs.size).toBe(16);
    });

    it('should verify all properties have valid geographic coordinates and addresses', () => {
      ALL_PROPERTIES.forEach((property) => {
        expect(property.address.street).toBeTruthy();
        expect(property.address.neighborhood).toBeTruthy();
        expect(property.address.city).toBe('London');
        expect(property.address.postalCode).toBeTruthy();
        expect(property.address.coordinates).toBeDefined();
        expect(property.address.coordinates?.lat).toBeGreaterThan(51.4);
        expect(property.address.coordinates?.lat).toBeLessThan(51.6);
        expect(property.address.coordinates?.lng).toBeGreaterThan(-0.4);
        expect(property.address.coordinates?.lng).toBeLessThan(0.0);
      });
    });

    it('should verify assigned agents have complete contact metadata', () => {
      ALL_PROPERTIES.forEach((property) => {
        const agent = property.agent;
        expect(agent.id).toBeTruthy();
        expect(agent.name).toBeTruthy();
        expect(agent.title).toBeTruthy();
        expect(agent.email).toContain('@vaneandsterling.com');
        expect(agent.phone).toMatch(/^\+44/);
        expect(agent.avatar).toContain('https://images.unsplash.com');
      });
    });

    it('should verify images contain a hero image and at least one gallery image', () => {
      ALL_PROPERTIES.forEach((property) => {
        expect(property.images.hero).toContain('https://images.unsplash.com');
        expect(property.images.gallery.length).toBeGreaterThanOrEqual(1);
        property.images.gallery.forEach((url) => {
          expect(url).toContain('https://images.unsplash.com');
        });
      });
    });

    it('should verify amenities are categorized into interior, outdoor, and building', () => {
      ALL_PROPERTIES.forEach((property) => {
        expect(Array.isArray(property.amenities.interior)).toBe(true);
        expect(Array.isArray(property.amenities.outdoor)).toBe(true);
        expect(Array.isArray(property.amenities.building)).toBe(true);
        expect(property.amenities.interior.length).toBeGreaterThan(0);
      });
    });
  });

  // Feature 15: Property Detail View (/properties/[id])
  describe('Feature 15: Property Detail View (/properties/[id])', () => {
    it('should resolve a property by its unique ID', () => {
      const target = ALL_PROPERTIES.find((p) => p.id === 'vs-sale-01');
      expect(target).toBeDefined();
      expect(target?.title).toBe('The Belgravia Crescent Penthouse');
    });

    it('should resolve a property by its URL slug', () => {
      const target = ALL_PROPERTIES.find((p) => p.slug === 'the-belgravia-crescent-penthouse');
      expect(target).toBeDefined();
      expect(target?.id).toBe('vs-sale-01');
    });

    it('should render structured facts bar for Sale properties (including price/sqft)', () => {
      const property = MOCK_SALE_PROPERTIES[0];
      const facts = {
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet,
        yearBuilt: property.yearBuilt,
        pricePerSqFt: property.pricePerSqFt,
        propertyType: property.propertyType,
      };
      expect(facts.bedrooms).toBe(4);
      expect(facts.bathrooms).toBe(4);
      expect(facts.squareFeet).toBe(4200);
      expect(facts.yearBuilt).toBe(2021);
      expect(facts.pricePerSqFt).toBe(3452);
      expect(facts.propertyType).toBe('penthouse');
    });

    it('should render structured facts bar for Rental properties (including lease terms & deposit)', () => {
      const property = MOCK_RENT_PROPERTIES[0];
      expect(property.rentalDetails).toBeDefined();
      const rentalFacts = {
        availableDate: property.rentalDetails?.availableDate,
        leaseTerm: property.rentalDetails?.leaseTerm,
        depositAmount: property.rentalDetails?.depositAmount,
        furnished: property.rentalDetails?.furnished,
        petsAllowed: property.rentalDetails?.petsAllowed,
      };
      expect(rentalFacts.leaseTerm).toBe('Annual (12+ Months)');
      expect(rentalFacts.depositAmount).toBe(28000);
      expect(rentalFacts.furnished).toBe(true);
      expect(rentalFacts.petsAllowed).toBe(false);
    });

    it('should contain editorial multi-paragraph description', () => {
      ALL_PROPERTIES.forEach((property) => {
        expect(Array.isArray(property.description)).toBe(true);
        expect(property.description.length).toBeGreaterThanOrEqual(1);
        expect(property.description[0].length).toBeGreaterThan(30);
      });
    });

    it('should include dedicated listing advisor with direct contact links', () => {
      const property = MOCK_SALE_PROPERTIES[0];
      const advisor = property.agent;
      expect(advisor.name).toBe('Eleanor Sterling');
      expect(advisor.title).toBe('Senior Partner, Private Estates');
      expect(advisor.email).toBe('eleanor@vaneandsterling.com');
      expect(advisor.phone).toBe('+44 (0)20 7946 0882');
    });

    it('should return undefined when looking up non-existent property ID or slug', () => {
      const nonExistent = ALL_PROPERTIES.find((p) => p.id === 'vs-non-existent-99');
      expect(nonExistent).toBeUndefined();

      const nonExistentSlug = ALL_PROPERTIES.find((p) => p.slug === 'unknown-property-slug');
      expect(nonExistentSlug).toBeUndefined();
    });
  });
});
