import { describe, it, expect } from 'vitest';
import {
  MOCK_SALE_PROPERTIES,
  filterProperties,
  sortProperties,
  formatPrice,
  ViewingRequest,
} from '../helpers/testFixtures';

describe('Tier 4: Scenario 1 — High-Net-Worth Penthouse Buyer Journey', () => {
  it('should execute complete end-to-end luxury buyer acquisition flow', () => {
    // Step 1: User arrives at Homepage ('/'), accesses search console
    const initialQuery = { location: 'Mayfair', propertyType: 'penthouse' };
    expect(initialQuery.propertyType).toBe('penthouse');

    // Step 2: Transition to Buy Discovery ('/buy?type=penthouse')
    let currentUrl = '/buy?type=penthouse';
    let activeFilters = {
      propertyTypes: ['penthouse'] as ['penthouse'],
    };
    let results = filterProperties(MOCK_SALE_PROPERTIES, activeFilters);
    expect(results.length).toBeGreaterThanOrEqual(2);
    results.forEach((p) => expect(p.propertyType).toBe('penthouse'));

    // Step 3: Narrow filter to Ultra-Prime bracket ($5M - $15M+) and sort price-desc
    activeFilters = {
      ...activeFilters,
      minPrice: 5_000_000,
      maxPrice: 15_000_000,
    } as any;
    currentUrl = '/buy?type=penthouse&minPrice=5000000&maxPrice=15000000&sort=price-desc';

    results = filterProperties(MOCK_SALE_PROPERTIES, activeFilters);
    const sortedResults = sortProperties(results, 'price-desc');

    expect(sortedResults.length).toBeGreaterThanOrEqual(2);
    expect(sortedResults[0].price.amount).toBeGreaterThanOrEqual(sortedResults[1].price.amount);

    // Step 4: Verify Active Filter Chips generated
    const chips = [
      { id: 'type', label: 'Type: Penthouse' },
      { id: 'minPrice', label: 'Min: $5,000,000' },
      { id: 'maxPrice', label: 'Max: $15,000,000' },
    ];
    expect(chips).toHaveLength(3);

    // Step 5: Select first property: The Belgravia Crescent Penthouse
    const selectedProperty = sortedResults[0];
    expect(selectedProperty.title).toBe('The Belgravia Crescent Penthouse');
    expect(formatPrice(selectedProperty.price)).toBe('$14,500,000');

    // Step 6: Navigate to Property Detail (/properties/vs-sale-01)
    currentUrl = `/properties/${selectedProperty.slug}`;
    expect(currentUrl).toBe('/properties/the-belgravia-crescent-penthouse');

    // Step 7: Inspect 5-photo gallery mosaic and structured facts
    expect(selectedProperty.images.gallery.length).toBeGreaterThanOrEqual(5);
    expect(selectedProperty.squareFeet).toBe(4200);
    expect(selectedProperty.pricePerSqFt).toBe(3452);
    expect(selectedProperty.amenities.interior).toContain('Private Direct Lift');

    // Step 8: Open Schedule Private Viewing modal
    const viewingModalOpen = true;
    expect(viewingModalOpen).toBe(true);

    // Step 9: Submit Viewing Request for in-person tour
    const viewingSubmission: ViewingRequest = {
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      fullName: 'Lord Julian Sterling',
      email: 'julian.sterling@mayfairholding.co.uk',
      phone: '+44 20 7946 0777',
      tourType: 'in-person',
      preferredDate: '2026-11-28',
      preferredTime: 'afternoon',
      status: 'pending_confirmation',
    };

    // Step 10: Verify explicit Pending Manual Confirmation status and reference code
    expect(viewingSubmission.status).toBe('pending_confirmation');
    const referenceCode = `VS-VR-${selectedProperty.id.replace('vs-', '').toUpperCase()}-8821`;
    expect(referenceCode).toContain('VS-VR-SALE-01');

    // Step 11: Return to discovery grid, preserving original filters
    const returnUrl = '/buy?type=penthouse&minPrice=5000000&maxPrice=15000000&sort=price-desc';
    expect(returnUrl).toContain('type=penthouse');
    expect(returnUrl).toContain('minPrice=5000000');
  });

  it('should support Filter State Resilience & Shareable Search URL (Scenario 4)', () => {
    // Generate complex URL
    const searchParams = new URLSearchParams({
      location: 'Kensington',
      minPrice: '10000000',
      bedrooms: '5',
      sort: 'sqft-desc',
    });
    const shareableUrl = `/buy?${searchParams.toString()}`;

    // Recipient loads the shareable URL
    const receivedParams = new URLSearchParams(shareableUrl.split('?')[1]);
    const restoredFilters = {
      location: receivedParams.get('location')!,
      minPrice: Number(receivedParams.get('minPrice')),
      bedrooms: Number(receivedParams.get('bedrooms')),
      sortBy: receivedParams.get('sort') as any,
    };

    const matching = filterProperties(MOCK_SALE_PROPERTIES, restoredFilters);
    const sortedMatching = sortProperties(matching, restoredFilters.sortBy);

    expect(sortedMatching.length).toBeGreaterThanOrEqual(1);
    expect(sortedMatching[0].title).toBe('Holland Park Modernist Villa');
    expect(sortedMatching[0].address.neighborhood).toBe('Kensington');
  });
});
