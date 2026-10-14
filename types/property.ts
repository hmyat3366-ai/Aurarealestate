export type PropertyPurpose = "sale" | "rent";

export type PropertyType =
  | "apartment"
  | "penthouse"
  | "townhouse"
  | "villa"
  | "mews";

export type PropertyStatus =
  | "available"
  | "under_offer"
  | "sold"
  | "let_agreed";

export type FurnishedStatus =
  | "Furnished"
  | "Unfurnished"
  | "Furnished / Unfurnished Flexible";

export interface PropertyLocation {
  address: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Property {
  id: string;
  reference: string;
  title: string;
  slug: string;
  description: string;
  purpose: PropertyPurpose;
  price: number;
  pricePeriod?: "pcm" | "pw";
  currency: "GBP" | "USD" | "EUR";
  propertyType: PropertyType;
  location: PropertyLocation;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  areaSqM: number;
  images: string[];
  features: string[];
  amenities: string[];
  epcRating?: "A" | "B" | "C" | "D" | "E";
  tenure?: string;
  councilTaxBand?: string;
  serviceCharge?: string;
  status: PropertyStatus;
  featured: boolean;
  availableDate?: string;
  furnishedStatus?: FurnishedStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  purpose?: PropertyPurpose;
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | string;
  bathrooms?: number | string;
  status?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "bedrooms";
}

export interface InquirySubmission {
  id: string;
  propertyId?: string;
  propertyReference?: string;
  propertyTitle?: string;
  type: "viewing" | "general" | "offer" | "sell";
  fullName: string;
  email: string;
  phone: string;
  preferredDate?: string;
  timeSlot?: "morning" | "afternoon" | "evening";
  message?: string;
  propertyLocation?: string; // For sell inquiries
  estimatedValue?: string; // For sell inquiries
  honeypot?: string;
  createdAt: string;
}
