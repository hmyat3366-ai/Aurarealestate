/**
 * src/lib/formatters.ts
 * Editorial currency, spatial, area, and date formatting utilities.
 */

import { Price } from '@/types/property';

/**
 * Formats a Price object according to real estate editorial conventions.
 * Examples:
 * - Sale: "$7,400,000"
 * - Rent: "$14,000 / mo"
 * - Rent Annual: "$168,000 / yr"
 */
export function formatPrice(price: Price, options?: { spaced?: boolean }): string {
  if (!price || typeof price.amount !== 'number' || isNaN(price.amount)) {
    return 'Price Upon Request';
  }

  const currencySymbolMap: Record<Price['currency'], string> = {
    USD: '$',
    GBP: '£',
    EUR: '€',
  };

  const symbol = currencySymbolMap[price.currency] || '$';
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(price.amount);

  const spaced = options?.spaced ?? true;
  const separator = spaced ? ' / ' : '/';

  if (price.rentalPeriod === 'month') {
    return `${symbol}${formattedNumber}${separator}mo`;
  }

  if (price.rentalPeriod === 'year') {
    return `${symbol}${formattedNumber}${separator}yr`;
  }

  return `${symbol}${formattedNumber}`;
}

/**
 * Compact price formatter for badges and mobile headers.
 * Examples:
 * - $7.4M
 * - $14K / mo
 */
export function formatPriceCompact(price: Price): string {
  if (!price || typeof price.amount !== 'number') return 'Price Upon Request';

  const symbol = price.currency === 'GBP' ? '£' : price.currency === 'EUR' ? '€' : '$';
  const amt = price.amount;

  let formatted = '';
  if (amt >= 1_000_000) {
    const millions = (amt / 1_000_000).toFixed(1).replace(/\.0$/, '');
    formatted = `${symbol}${millions}M`;
  } else if (amt >= 1_000) {
    const thousands = (amt / 1_000).toFixed(0);
    formatted = `${symbol}${thousands}K`;
  } else {
    formatted = `${symbol}${amt}`;
  }

  if (price.rentalPeriod === 'month') {
    return `${formatted} / mo`;
  }

  return formatted;
}

/**
 * Formats interior square footage with comma separation.
 * Example: 3450 -> "3,450 sq ft"
 */
export function formatSqft(sqft: number): string {
  if (typeof sqft !== 'number' || isNaN(sqft) || sqft <= 0) {
    return '0 sq ft';
  }
  return `${new Intl.NumberFormat('en-US').format(sqft)} sq ft`;
}

/**
 * Formats price per square foot.
 * Example: 2145 -> "$2,145 / sq ft"
 */
export function formatPricePerSqft(amount?: number, currency: Price['currency'] = 'USD'): string {
  if (!amount || typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return 'N/A';
  }
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  return `${symbol}${new Intl.NumberFormat('en-US').format(Math.round(amount))} / sq ft`;
}

/**
 * Formats ISO date string (YYYY-MM-DD) into editorial human format.
 * Example: "2026-11-01" -> "November 1, 2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const parsed = new Date(dateString);
  if (isNaN(parsed.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

/**
 * Formats bedroom count cleanly.
 * Example: 0 -> "Studio", 1 -> "1 Bed", 3 -> "3 Beds"
 */
export function formatBedrooms(bedrooms: number): string {
  if (bedrooms === 0) return 'Studio';
  if (bedrooms === 1) return '1 Bed';
  return `${bedrooms} Beds`;
}

/**
 * Formats bathroom count cleanly.
 * Example: 1 -> "1 Bath", 2.5 -> "2.5 Baths"
 */
export function formatBathrooms(bathrooms: number): string {
  if (bathrooms === 1) return '1 Bath';
  return `${bathrooms} Baths`;
}
