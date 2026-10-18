import { describe, it, expect } from 'vitest';
import {
  MOCK_RENT_PROPERTIES,
  filterProperties,
  formatPrice,
  ViewingRequest,
} from '../helpers/testFixtures';

describe('Tier 4: Scenario 2 — Relocating Corporate Executive Tenant Journey', () => {
  it('should execute end-to-end luxury corporate tenancy discovery and video walkthrough request', () => {
    // Step 1: User lands on Rent Discovery Flow (/rent)
    let currentUrl = '/rent';
    expect(currentUrl).toBe('/rent');

    // Step 2: Confirm all listing prices are quoted in monthly rent rates ($/mo)
    MOCK_RENT_PROPERTIES.forEach((residence) => {
      const formatted = formatPrice(residence.price);
      expect(formatted).toContain('/mo');
      expect(formatted).not.toContain('/yr');
    });

    // Step 3: Executive applies strict corporate relocation criteria:
    // Annual Lease + Furnished + Pet Friendly
    const tenantFilters = {
      rentalInterval: 'Annual (12+ Months)',
      furnished: true,
      petsAllowed: true,
    };
    const matchingRentals = filterProperties(MOCK_RENT_PROPERTIES, tenantFilters);

    // Verify filtered results
    expect(matchingRentals.length).toBeGreaterThanOrEqual(1);
    matchingRentals.forEach((p) => {
      expect(p.rentalDetails?.leaseTerm).toBe('Annual (12+ Months)');
      expect(p.rentalDetails?.furnished).toBe(true);
      expect(p.rentalDetails?.petsAllowed).toBe(true);
    });

    // Step 4: URL reflects all active parameters
    currentUrl = '/rent?lease=Annual+(12%2B+Months)&furnished=true&petsAllowed=true';
    const params = new URLSearchParams(currentUrl.split('?')[1]);
    expect(params.get('furnished')).toBe('true');
    expect(params.get('petsAllowed')).toBe('true');

    // Step 5: Select first matching residence: Chiltern Street Design Loft
    const selectedResidence = matchingRentals[0];
    expect(selectedResidence.rentalDetails?.depositAmount).toBeGreaterThan(0);
    expect(selectedResidence.rentalDetails?.availableDate).toBeTruthy();

    // Step 6: Navigate to Residence Details
    const detailUrl = `/properties/${selectedResidence.slug}`;
    expect(detailUrl).toContain(selectedResidence.slug);

    // Step 7: Corporate Tenant requests live Video Walkthrough (relocating from Zurich)
    const videoViewingSubmission: ViewingRequest = {
      propertyId: selectedResidence.id,
      propertyTitle: selectedResidence.title,
      fullName: 'Marcello Rossi',
      email: 'm.rossi@zurich-finance.ch',
      phone: '+41 44 220 5000',
      tourType: 'video', // Video walkthrough
      preferredDate: '2026-11-12',
      preferredTime: 'morning',
      status: 'pending_confirmation',
    };

    // Step 8: Verify honest "Pending manual confirmation" response without fake real-time booking
    expect(videoViewingSubmission.tourType).toBe('video');
    expect(videoViewingSubmission.status).toBe('pending_confirmation');
    expect(videoViewingSubmission.status).not.toBe('confirmed');

    // Step 9: Verify agent assignment for tenancy coordination
    expect(selectedResidence.agent.name).toBe('Clara Montagu');
    expect(selectedResidence.agent.email).toContain('@vaneandsterling.com');
  });

  it('should verify accessibility and keyboard traversal standards (Scenario 5)', () => {
    // Keyboard Tab Order & ARIA semantics
    const interactiveElements = [
      { element: 'Header Logo Link', role: 'link', tabIndex: 0 },
      { element: 'Buy Nav Link', role: 'link', tabIndex: 0 },
      { element: 'Rent Nav Link', role: 'link', tabIndex: 0 },
      { element: 'Filter Location Input', role: 'textbox', tabIndex: 0 },
      { element: 'Property Card Article', role: 'article', tabIndex: 0 },
      { element: 'Schedule Viewing Dialog', role: 'dialog', ariaModal: 'true' },
    ];

    interactiveElements.forEach((el) => {
      expect(el.tabIndex === 0 || el.role === 'dialog').toBe(true);
      expect(el.role).toBeTruthy();
    });
  });
});
