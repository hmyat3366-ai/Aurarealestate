import { describe, it, expect } from 'vitest';
import { PropertyFilterParams } from '../helpers/testFixtures';

// Resilient query parser for edge-case URL strings
function parseResilientQuery(queryString: string): PropertyFilterParams {
  const params: PropertyFilterParams = {};
  if (!queryString || queryString.trim() === '') return params;

  let cleaned = queryString;
  if (cleaned.includes('?')) {
    cleaned = cleaned.split('?')[1];
  } else if (!cleaned.includes('=')) {
    return params;
  }
  cleaned = cleaned.split('#')[0].replace(/^[?#]/, '');
  if (!cleaned) return params;

  try {
    const searchParams = new URLSearchParams(cleaned);

    // Location
    const loc = searchParams.get('location');
    if (loc && loc.trim() !== '' && loc !== 'all') {
      params.location = loc.trim();
    }

    // Min Price
    const minP = searchParams.get('minPrice');
    if (minP !== null && minP.trim() !== '') {
      const num = Number(minP);
      if (!isNaN(num) && num >= 0) {
        params.minPrice = num;
      }
    }

    // Max Price
    const maxP = searchParams.get('maxPrice');
    if (maxP !== null && maxP.trim() !== '') {
      const num = Number(maxP);
      if (!isNaN(num) && num >= 0) {
        params.maxPrice = num;
      }
    }

    // Bedrooms
    const beds = searchParams.get('bedrooms');
    if (beds !== null && beds.trim() !== '' && beds !== 'all') {
      if (beds.toLowerCase() === 'studio') {
        params.bedrooms = 'studio';
      } else {
        const num = Number(beds);
        if (!isNaN(num) && num >= 0) {
          params.bedrooms = num;
        }
      }
    }

    // Bathrooms
    const baths = searchParams.get('bathrooms');
    if (baths !== null && baths.trim() !== '' && baths !== 'all') {
      const num = Number(baths);
      if (!isNaN(num) && num >= 0) {
        params.bathrooms = num;
      }
    }

    // Property Types (handles both comma-separated and repeated keys)
    const typesFromGetAll = searchParams.getAll('type');
    const allTypes: string[] = [];
    typesFromGetAll.forEach((t) => {
      t.split(',').forEach((sub) => {
        if (sub.trim() && sub !== 'all') allTypes.push(sub.trim());
      });
    });
    if (allTypes.length > 0) {
      params.propertyTypes = Array.from(new Set(allTypes)) as PropertyFilterParams['propertyTypes'];
    }

    // Sort
    const sort = searchParams.get('sort');
    const validSorts: PropertyFilterParams['sortBy'][] = [
      'featured',
      'newest',
      'price-asc',
      'price-desc',
      'sqft-desc',
    ];
    if (sort && validSorts.includes(sort as PropertyFilterParams['sortBy'])) {
      params.sortBy = sort as PropertyFilterParams['sortBy'];
    }
  } catch (e) {
    // Graceful recovery on totally invalid URL syntax
    return {};
  }

  return params;
}

describe('Tier 2: URL Synchronization Edge Cases', () => {
  it('should ignore non-numeric string values in minPrice and maxPrice without throwing', () => {
    const parsed = parseResilientQuery('?minPrice=millionaire&maxPrice=billion');
    expect(parsed.minPrice).toBeUndefined();
    expect(parsed.maxPrice).toBeUndefined();
  });

  it('should ignore negative price values in query string', () => {
    const parsed = parseResilientQuery('?minPrice=-500000&maxPrice=-100');
    expect(parsed.minPrice).toBeUndefined();
    expect(parsed.maxPrice).toBeUndefined();
  });

  it('should ignore invalid sort options and default safely', () => {
    const parsed = parseResilientQuery('?sort=arbitrary_hack_sort');
    expect(parsed.sortBy).toBeUndefined();
  });

  it('should safely handle empty parameter keys and values (?location=&minPrice=&type=)', () => {
    const parsed = parseResilientQuery('?location=&minPrice=&type=&bedrooms=&bathrooms=');
    expect(parsed.location).toBeUndefined();
    expect(parsed.minPrice).toBeUndefined();
    expect(parsed.propertyTypes).toBeUndefined();
    expect(parsed.bedrooms).toBeUndefined();
  });

  it('should preserve recognized filters while safely ignoring unknown query parameters (e.g. utm_source, ref)', () => {
    const parsed = parseResilientQuery('?utm_source=google_ads&location=Mayfair&ref=affiliate_123&minPrice=5000000');
    expect(parsed.location).toBe('Mayfair');
    expect(parsed.minPrice).toBe(5000000);
    // Unknown keys should not pollute PropertyFilterParams
    expect((parsed as any).utm_source).toBeUndefined();
    expect((parsed as any).ref).toBeUndefined();
  });

  it('should support repeated keys for property types (?type=penthouse&type=villa)', () => {
    const parsed = parseResilientQuery('?type=penthouse&type=villa');
    expect(parsed.propertyTypes).toEqual(['penthouse', 'villa']);
  });

  it('should support comma-separated values for property types (?type=penthouse,villa,townhouse)', () => {
    const parsed = parseResilientQuery('?type=penthouse,villa,townhouse');
    expect(parsed.propertyTypes).toEqual(['penthouse', 'villa', 'townhouse']);
  });

  it('should deduplicate property types when repeated in both query styles', () => {
    const parsed = parseResilientQuery('?type=penthouse,villa&type=penthouse');
    expect(parsed.propertyTypes).toEqual(['penthouse', 'villa']);
  });

  it('should safely parse query string containing hash fragment (?location=Belgravia#catalog-view)', () => {
    const parsed = parseResilientQuery('?location=Belgravia#catalog-view');
    expect(parsed.location).toBe('Belgravia');
  });

  it('should handle percent-encoded location strings (?location=Regent%27s%20Park)', () => {
    const parsed = parseResilientQuery('?location=Regent%27s%20Park');
    expect(parsed.location).toBe("Regent's Park");
  });

  it('should handle plus signs as spaces in query string (?location=St+John%27s+Wood)', () => {
    const parsed = parseResilientQuery('?location=St+John%27s+Wood');
    expect(parsed.location).toBe("St John's Wood");
  });

  it('should handle studio bedroom parameter in query string (?bedrooms=studio)', () => {
    const parsed = parseResilientQuery('?bedrooms=studio');
    expect(parsed.bedrooms).toBe('studio');
  });

  it('should handle uppercase studio parameter (?bedrooms=STUDIO)', () => {
    const parsed = parseResilientQuery('?bedrooms=STUDIO');
    expect(parsed.bedrooms).toBe('studio');
  });

  it('should return empty filter params for empty or blank query string', () => {
    expect(parseResilientQuery('')).toEqual({});
    expect(parseResilientQuery('?')).toEqual({});
    expect(parseResilientQuery('???')).toEqual({});
  });

  it('should simulate back and forward browser history states preserving filter criteria', () => {
    const historyStack: string[] = [];

    // User starts on /buy
    historyStack.push('/buy');
    expect(parseResilientQuery(historyStack[historyStack.length - 1])).toEqual({});

    // User filters by Mayfair
    historyStack.push('/buy?location=Mayfair');
    expect(parseResilientQuery(historyStack[historyStack.length - 1]).location).toBe('Mayfair');

    // User adds price filter
    historyStack.push('/buy?location=Mayfair&minPrice=5000000');
    expect(parseResilientQuery(historyStack[historyStack.length - 1]).minPrice).toBe(5000000);

    // User navigates back (pops last state)
    historyStack.pop();
    const previousState = parseResilientQuery(historyStack[historyStack.length - 1]);
    expect(previousState.location).toBe('Mayfair');
    expect(previousState.minPrice).toBeUndefined();

    // User navigates back to initial /buy
    historyStack.pop();
    const initialState = parseResilientQuery(historyStack[historyStack.length - 1]);
    expect(initialState.location).toBeUndefined();
  });
});
