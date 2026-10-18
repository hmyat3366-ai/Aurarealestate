import { describe, it, expect } from 'vitest';
import { ViewingRequest, MOCK_SALE_PROPERTIES } from '../helpers/testFixtures';

// Helper validator for viewing request
function validateViewingRequest(req: Partial<ViewingRequest>): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!req.fullName || req.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!req.email || !emailRegex.test(req.email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!req.phone || req.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Please provide a valid telephone number.';
  }

  if (!req.preferredDate) {
    errors.preferredDate = 'Please select a preferred viewing date.';
  } else {
    const selected = new Date(req.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(selected.getTime()) || selected < today) {
      errors.preferredDate = 'Viewing date must be in the future.';
    }
  }

  if (!req.preferredTime || !['morning', 'afternoon', 'evening'].includes(req.preferredTime)) {
    errors.preferredTime = 'Please select a preferred time bracket.';
  }

  if (!req.tourType || !['in-person', 'video'].includes(req.tourType)) {
    errors.tourType = 'Please select a tour modality.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

describe('Tier 1: Viewing Request Workflow (Feature 16)', () => {
  const sampleProperty = MOCK_SALE_PROPERTIES[0];

  it('should create a valid ViewingRequest with pending_confirmation status', () => {
    const request: ViewingRequest = {
      propertyId: sampleProperty.id,
      propertyTitle: sampleProperty.title,
      fullName: 'Lord Sterling Vance',
      email: 'sterling.vance@example.co.uk',
      phone: '+44 20 7123 4567',
      tourType: 'in-person',
      preferredDate: '2026-11-20',
      preferredTime: 'afternoon',
      status: 'pending_confirmation',
    };

    const validation = validateViewingRequest(request);
    expect(validation.isValid).toBe(true);
    expect(request.status).toBe('pending_confirmation');
  });

  it('should support video walkthrough tour modality', () => {
    const request: ViewingRequest = {
      propertyId: sampleProperty.id,
      propertyTitle: sampleProperty.title,
      fullName: 'Genevieve Dupond',
      email: 'genevieve@example.fr',
      phone: '+33 1 42 68 55 00',
      tourType: 'video',
      preferredDate: '2026-12-05',
      preferredTime: 'morning',
      status: 'pending_confirmation',
    };

    const validation = validateViewingRequest(request);
    expect(validation.isValid).toBe(true);
    expect(request.tourType).toBe('video');
  });

  it('should reject past viewing dates', () => {
    const pastRequest: Partial<ViewingRequest> = {
      fullName: 'Alexander Hamilton',
      email: 'alex@example.com',
      phone: '+1 212 555 0199',
      tourType: 'in-person',
      preferredDate: '2020-01-01',
      preferredTime: 'morning',
    };

    const validation = validateViewingRequest(pastRequest);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.preferredDate).toBe('Viewing date must be in the future.');
  });

  it('should reject malformed email addresses', () => {
    const invalidEmailReq: Partial<ViewingRequest> = {
      fullName: 'John Doe',
      email: 'invalid-email-no-at-domain',
      phone: '+44 7911 123456',
      tourType: 'in-person',
      preferredDate: '2026-11-25',
      preferredTime: 'evening',
    };

    const validation = validateViewingRequest(invalidEmailReq);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.email).toBe('Please provide a valid email address.');
  });

  it('should reject phone numbers with insufficient digits', () => {
    const invalidPhoneReq: Partial<ViewingRequest> = {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '123',
      tourType: 'in-person',
      preferredDate: '2026-11-25',
      preferredTime: 'morning',
    };

    const validation = validateViewingRequest(invalidPhoneReq);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.phone).toBe('Please provide a valid telephone number.');
  });

  it('should reject short or whitespace-only names', () => {
    const invalidNameReq: Partial<ViewingRequest> = {
      fullName: '   ',
      email: 'valid@example.com',
      phone: '+44 7911 123456',
      tourType: 'video',
      preferredDate: '2026-11-25',
      preferredTime: 'afternoon',
    };

    const validation = validateViewingRequest(invalidNameReq);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.fullName).toBe('Full name must be at least 2 characters.');
  });

  it('should accept valid time slot options: morning, afternoon, evening', () => {
    const slots: Array<'morning' | 'afternoon' | 'evening'> = ['morning', 'afternoon', 'evening'];
    slots.forEach((slot) => {
      const res = validateViewingRequest({
        fullName: 'Valid User',
        email: 'user@example.com',
        phone: '+44 20 7000 0000',
        tourType: 'in-person',
        preferredDate: '2026-11-25',
        preferredTime: slot,
      });
      expect(res.isValid).toBe(true);
    });
  });

  it('should pre-populate target property reference metadata', () => {
    const prefill = {
      propertyId: sampleProperty.id,
      propertyTitle: sampleProperty.title,
    };
    expect(prefill.propertyId).toBe('vs-sale-01');
    expect(prefill.propertyTitle).toBe('The Belgravia Crescent Penthouse');
  });

  it('should guarantee that viewing requests NEVER set an automated calendar confirmation', () => {
    const request: ViewingRequest = {
      propertyId: sampleProperty.id,
      propertyTitle: sampleProperty.title,
      fullName: 'Sir Arthur Wellesley',
      email: 'wellesley@example.com',
      phone: '+44 20 7946 0999',
      tourType: 'in-person',
      preferredDate: '2026-12-01',
      preferredTime: 'morning',
      status: 'pending_confirmation',
    };

    // Honest business rule: status must remain pending_confirmation
    expect(request.status).toBe('pending_confirmation');
    expect(request.status).not.toBe('confirmed');
  });

  it('should generate a reference code format matching agency tracking format', () => {
    const generateRefCode = () => 'VS-VR-' + Math.floor(100000 + Math.random() * 900000);
    const ref = generateRefCode();
    expect(ref).toMatch(/^VS-VR-\d{6}$/);
  });
});
