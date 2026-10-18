/**
 * src/types/filters.ts
 * Filter contracts for multi-attribute property discovery.
 */

import { ListingType, PropertyType } from './property';

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'sqft-desc';

export interface PropertyFilterParams {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'studio' | string; // supports e.g. 3, 'studio', '3+'
  bathrooms?: number | string;           // supports e.g. 2, '2+'
  propertyTypes?: PropertyType[];
  rentalInterval?: string;               // e.g. 'annual', 'flexible'
  leaseTerm?: string;                    // alias for rentalInterval
  furnished?: boolean;
  petsAllowed?: boolean;
  sortBy?: SortOption;
  listingType?: ListingType;
}

export interface ActiveFilterChip {
  id: string;
  label: string;
  paramKey: keyof PropertyFilterParams;
  value: any;
}
