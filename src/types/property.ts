/**
 * src/types/property.ts
 * Core domain types and interfaces for the AURA Real Estate platform.
 */

export type ListingType = 'sale' | 'rent';

export type PropertyType =
  | 'apartment'
  | 'penthouse'
  | 'villa'
  | 'townhouse'
  | 'estate'
  | 'loft';

export type PropertyStatus =
  | 'Active'
  | 'Private Exclusive'
  | 'Coming Soon'
  | 'Price Improvement'
  | 'Under Contract';

export type LeaseTerm =
  | 'Annual (12+ Months)'
  | 'Flexible (3-11 Months)'
  | 'Short-Term (< 3 Months)';

export interface Price {
  amount: number;
  currency: 'USD' | 'GBP' | 'EUR';
  rentalPeriod?: 'month' | 'year' | null;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  unit?: string;
  neighborhood: string;
  city: string;
  state?: string;
  postalCode: string;
  coordinates?: Coordinates;
}

export interface Amenities {
  interior: string[];
  outdoor: string[];
  building: string[];
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
  bio?: string;
}

export interface RentalDetails {
  availableDate: string; // ISO format: YYYY-MM-DD
  leaseTerm: LeaseTerm;
  furnished: boolean;
  petsAllowed: boolean;
  depositAmount: number;
}

export interface PropertyImages {
  hero: string;
  gallery: string[];
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: Price;
  pricePerSqFt?: number; // Present on sale listings, absent on rental listings
  bedrooms: number;      // 0 represents Studio
  bathrooms: number;     // e.g. 2.5 represents 2 full baths, 1 powder room
  squareFeet: number;
  yearBuilt: number;
  address: Address;
  description: string[]; // Multi-paragraph architectural narrative
  images: PropertyImages;
  amenities: Amenities;
  rentalDetails?: RentalDetails; // Defined strictly for rental listings
  agent: Agent;
  featured?: boolean;
}
