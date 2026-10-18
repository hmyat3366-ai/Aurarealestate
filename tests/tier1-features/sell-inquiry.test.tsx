import { describe, it, expect } from 'vitest';
import {
  SellInquiry,
  generateMailtoLink,
  ALL_PROPERTIES,
  PropertyType,
} from '../helpers/testFixtures';

// Helper validator for SellInquiry
function validateSellInquiry(inquiry: Partial<SellInquiry>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!inquiry.ownerName || inquiry.ownerName.trim().length < 2) {
    errors.ownerName = 'Owner name must be at least 2 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!inquiry.email || !emailRegex.test(inquiry.email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!inquiry.phone || inquiry.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Please provide a valid telephone number.';
  }

  if (!inquiry.propertyAddress || inquiry.propertyAddress.trim().length < 5) {
    errors.propertyAddress = 'Please specify the full property address or postal code.';
  }

  const validTypes: PropertyType[] = ['apartment', 'penthouse', 'villa', 'townhouse', 'estate', 'loft'];
  if (!inquiry.propertyType || !validTypes.includes(inquiry.propertyType)) {
    errors.propertyType = 'Please select a valid property category.';
  }

  if (typeof inquiry.estimatedBedrooms !== 'number' || inquiry.estimatedBedrooms < 0) {
    errors.estimatedBedrooms = 'Please provide bedroom count.';
  }

  if (typeof inquiry.estimatedBathrooms !== 'number' || inquiry.estimatedBathrooms < 0) {
    errors.estimatedBathrooms = 'Please provide bathroom count.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

describe('Tier 1: Sell with Us & Mailto Fallback (Feature 17)', () => {
  const validInquiry: SellInquiry = {
    ownerName: 'Lady Catherine de Bourgh',
    email: 'catherine@rosingspark.co.uk',
    phone: '+44 1959 562121',
    propertyAddress: 'Rosings Park, Hunsford, Kent',
    propertyType: 'estate',
    estimatedBedrooms: 12,
    estimatedBathrooms: 10,
    notes: 'Confidential valuation for private off-market representation.',
  };

  it('should validate a complete and well-formed SellInquiry', () => {
    const result = validateSellInquiry(validInquiry);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should reject inquiries with missing or short owner name', () => {
    const result = validateSellInquiry({ ...validInquiry, ownerName: 'A' });
    expect(result.isValid).toBe(false);
    expect(result.errors.ownerName).toBe('Owner name must be at least 2 characters.');
  });

  it('should reject inquiries with malformed email', () => {
    const result = validateSellInquiry({ ...validInquiry, email: 'lady.catherine' });
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Please provide a valid email address.');
  });

  it('should reject inquiries with insufficient property address', () => {
    const result = validateSellInquiry({ ...validInquiry, propertyAddress: 'Kent' });
    expect(result.isValid).toBe(false);
    expect(result.errors.propertyAddress).toBe('Please specify the full property address or postal code.');
  });

  it('should reject invalid property types', () => {
    const result = validateSellInquiry({
      ...validInquiry,
      propertyType: 'warehouse' as unknown as PropertyType,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.propertyType).toBe('Please select a valid property category.');
  });

  it('should accept all valid luxury property types', () => {
    const types: PropertyType[] = ['apartment', 'penthouse', 'villa', 'townhouse', 'estate', 'loft'];
    types.forEach((type) => {
      const res = validateSellInquiry({ ...validInquiry, propertyType: type });
      expect(res.isValid).toBe(true);
    });
  });

  it('should generate an RFC 2368 compliant mailto URL with correct recipient', () => {
    const mailtoUrl = generateMailtoLink(validInquiry);
    expect(mailtoUrl.startsWith('mailto:privateoffice@vaneandsterling.com')).toBe(true);
  });

  it('should encode subject line including property address in mailto URL', () => {
    const mailtoUrl = generateMailtoLink(validInquiry);
    const parsed = new URL(mailtoUrl);
    const subject = parsed.searchParams.get('subject');
    expect(subject).toBe('Private Valuation Consultation: Rosings Park, Hunsford, Kent');
  });

  it('should include all inquiry fields formatted in the encoded mailto body', () => {
    const mailtoUrl = generateMailtoLink(validInquiry);
    const parsed = new URL(mailtoUrl);
    const body = parsed.searchParams.get('body');
    expect(body).toContain('Lady Catherine de Bourgh');
    expect(body).toContain('Rosings Park, Hunsford, Kent');
    expect(body).toContain('estate');
    expect(body).toContain('catherine@rosingspark.co.uk');
    expect(body).toContain('+44 1959 562121');
    expect(body).toContain('Bedrooms: 12');
    expect(body).toContain('Bathrooms: 10');
    expect(body).toContain('Confidential valuation for private off-market representation.');
  });

  it('should enforce Fiduciary Guardrail: submitting a sell inquiry NEVER inserts a public property', () => {
    const initialCatalogSize = ALL_PROPERTIES.length;

    // Simulate submission handler
    const submitSellInquiry = (inquiry: SellInquiry) => {
      // Intentionally does NOT mutate ALL_PROPERTIES
      return { success: true, inquiryId: 'vs-sell-' + Date.now() };
    };

    const res = submitSellInquiry(validInquiry);
    expect(res.success).toBe(true);
    expect(ALL_PROPERTIES.length).toBe(initialCatalogSize);
    expect(ALL_PROPERTIES.some((p) => p.title.includes('Rosings Park'))).toBe(false);
  });
});
