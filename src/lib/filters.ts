/**
 * src/lib/filters.ts
 * Pure functional filtering and sorting pipeline for AURA Real Estate properties.
 */

import { PropertyFilterParams, SortOption } from '@/types/filters';
import { Property } from '@/types/property';

/**
 * Filters a list of properties based on multi-attribute criteria.
 * Pure function: does not mutate the original array.
 */
export function filterProperties(
  properties: Property[],
  filters: PropertyFilterParams
): Property[] {
  if (!properties || !Array.isArray(properties)) return [];

  return properties.filter((property) => {
    // 1. Listing Type (Sale vs Rent)
    if (filters.listingType && property.listingType !== filters.listingType) {
      return false;
    }

    // 2. Location / Neighborhood Search (case-insensitive substring)
    if (filters.location && filters.location.trim() !== '' && filters.location !== 'all') {
      const q = filters.location.trim().toLowerCase();
      const matchNeighborhood = property.address.neighborhood.toLowerCase().includes(q);
      const matchCity = property.address.city.toLowerCase().includes(q);
      const matchStreet = property.address.street.toLowerCase().includes(q);
      const matchTitle = property.title.toLowerCase().includes(q);
      const matchPostal = property.address.postalCode.toLowerCase().includes(q);

      if (!matchNeighborhood && !matchCity && !matchStreet && !matchTitle && !matchPostal) {
        return false;
      }
    }

    // 3. Minimum Price
    if (typeof filters.minPrice === 'number' && !isNaN(filters.minPrice)) {
      if (property.price.amount < filters.minPrice) {
        return false;
      }
    }

    // 4. Maximum Price
    if (typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice)) {
      if (property.price.amount > filters.maxPrice) {
        return false;
      }
    }

    // 5. Bedrooms
    if (filters.bedrooms !== undefined && filters.bedrooms !== 'all') {
      if (filters.bedrooms === 'studio' || filters.bedrooms === 0 || filters.bedrooms === '0') {
        if (property.bedrooms !== 0) return false;
      } else {
        const numBeds = typeof filters.bedrooms === 'string'
          ? parseInt(filters.bedrooms.replace('+', ''), 10)
          : filters.bedrooms;

        if (!isNaN(numBeds) && property.bedrooms < numBeds) {
          return false;
        }
      }
    }

    // 6. Bathrooms
    if (filters.bathrooms !== undefined && filters.bathrooms !== 'all') {
      const numBaths = typeof filters.bathrooms === 'string'
        ? parseFloat(filters.bathrooms.replace('+', ''))
        : filters.bathrooms;

      if (!isNaN(numBaths) && property.bathrooms < numBaths) {
        return false;
      }
    }

    // 7. Property Types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      if (!filters.propertyTypes.includes(property.propertyType)) {
        return false;
      }
    }

    // 8. Rental Interval / Lease Term (Rent only)
    const intervalFilter = filters.rentalInterval || filters.leaseTerm;
    if (intervalFilter && intervalFilter !== 'all') {
      if (!property.rentalDetails?.leaseTerm) return false;
      const termNormalized = property.rentalDetails.leaseTerm.toLowerCase();
      const filterNormalized = intervalFilter.toLowerCase();
      if (!termNormalized.includes(filterNormalized)) {
        return false;
      }
    }

    // 9. Furnished (Rent only)
    if (typeof filters.furnished === 'boolean') {
      if (property.rentalDetails?.furnished !== filters.furnished) {
        return false;
      }
    }

    // 10. Pets Allowed (Rent only)
    if (typeof filters.petsAllowed === 'boolean') {
      if (property.rentalDetails?.petsAllowed !== filters.petsAllowed) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts properties using a pure 5-way sorting strategy.
 * Does not mutate the source array.
 */
export function sortProperties(
  properties: Property[],
  sortBy: SortOption = 'featured'
): Property[] {
  if (!properties || !Array.isArray(properties)) return [];

  const copy = [...properties];

  switch (sortBy) {
    case 'featured':
      return copy.sort((a, b) => {
        const aFeat = a.featured ? 1 : 0;
        const bFeat = b.featured ? 1 : 0;
        if (bFeat !== aFeat) return bFeat - aFeat;
        return b.yearBuilt - a.yearBuilt;
      });

    case 'newest':
      return copy.sort((a, b) => b.yearBuilt - a.yearBuilt);

    case 'price-asc':
      return copy.sort((a, b) => a.price.amount - b.price.amount);

    case 'price-desc':
      return copy.sort((a, b) => b.price.amount - a.price.amount);

    case 'sqft-desc':
      return copy.sort((a, b) => b.squareFeet - a.squareFeet);

    default:
      return copy;
  }
}
