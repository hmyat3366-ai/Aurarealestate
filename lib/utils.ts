import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Property, PropertyFilters } from "@/types/property";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number,
  purpose: "sale" | "rent",
  pricePeriod: "pcm" | "pw" = "pcm",
  currency: string = "GBP"
): string {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  const formatted = price.toLocaleString("en-GB");

  if (purpose === "rent") {
    const weeklyEquivalent = Math.round((price * 12) / 52).toLocaleString("en-GB");
    return `${symbol}${formatted} pcm (${symbol}${weeklyEquivalent} pw)`;
  }

  return `${symbol}${formatted}`;
}

export function formatArea(sqFt: number, sqM?: number): string {
  if (sqM) {
    return `${sqFt.toLocaleString()} sq ft / ${sqM} sq m`;
  }
  return `${sqFt.toLocaleString()} sq ft`;
}

export function filterProperties(
  properties: Property[],
  filters: PropertyFilters
): Property[] {
  return properties.filter((prop) => {
    // Purpose filter
    if (filters.purpose && prop.purpose !== filters.purpose) {
      return false;
    }

    // Location filter
    if (filters.location && filters.location !== "all") {
      const loc = filters.location.toLowerCase();
      const match =
        prop.location.neighborhood.toLowerCase().includes(loc) ||
        prop.location.city.toLowerCase().includes(loc) ||
        prop.location.address.toLowerCase().includes(loc);
      if (!match) return false;
    }

    // Property Type filter
    if (filters.propertyType && filters.propertyType !== "all") {
      if (prop.propertyType !== filters.propertyType) return false;
    }

    // Min Price filter
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      if (prop.price < filters.minPrice) return false;
    }

    // Max Price filter
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      if (prop.price > filters.maxPrice) return false;
    }

    // Bedrooms filter
    if (filters.bedrooms && filters.bedrooms !== "all") {
      const minBeds = Number(filters.bedrooms);
      if (!isNaN(minBeds) && prop.bedrooms < minBeds) {
        return false;
      }
    }

    // Bathrooms filter
    if (filters.bathrooms && filters.bathrooms !== "all") {
      const minBaths = Number(filters.bathrooms);
      if (!isNaN(minBaths) && prop.bathrooms < minBaths) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      if (prop.status !== filters.status) return false;
    }

    return true;
  });
}

export function sortProperties(
  properties: Property[],
  sortBy: PropertyFilters["sortBy"] = "newest"
): Property[] {
  const cloned = [...properties];
  switch (sortBy) {
    case "price_asc":
      return cloned.sort((a, b) => a.price - b.price);
    case "price_desc":
      return cloned.sort((a, b) => b.price - a.price);
    case "bedrooms":
      return cloned.sort((a, b) => b.bedrooms - a.bedrooms);
    case "newest":
    default:
      return cloned.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

// Local storage shortlist utilities (safe with SSR)
const SHORTLIST_STORAGE_KEY = "vane_sterling_shortlist";

export function getStoredShortlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHORTLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleStoredShortlist(id: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getStoredShortlist();
    const exists = current.includes(id);
    const updated = exists ? current.filter((x) => x !== id) : [...current, id];
    localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("shortlist_updated"));
    return updated;
  } catch {
    return [];
  }
}
