/**
 * src/lib/mailto.ts
 * RFC 2368 compliant mailto URL generator for private seller and contact inquiries.
 */

import { ContactInquiry, SellInquiry } from '@/types/inquiry';

export const AGENCY_CONTACT_EMAIL = 'contact@vaneandsterling.com';
export const AGENCY_SELL_EMAIL = 'sell@vaneandsterling.com';
export const AGENCY_ACQUISITIONS_EMAIL = 'acquisitions@vaneandsterling.com';
export const AGENCY_CONCIERGE_EMAIL = 'concierge@vaneandsterling.com';
export const AGENCY_PRIVATE_OFFICE_EMAIL = 'privateoffice@vaneandsterling.com';

/**
 * Type guard for SellInquiry vs ContactInquiry.
 */
export function isSellInquiry(inquiry: SellInquiry | ContactInquiry): inquiry is SellInquiry {
  return 'propertyAddress' in inquiry || 'ownerName' in inquiry;
}

/**
 * Generates an RFC 2368 compliant mailto URI.
 * Guarantees proper URL encoding of recipient, subject, and multi-line body with CRLF (\r\n).
 */
export function generateMailtoLink(
  inquiry: SellInquiry | ContactInquiry,
  customRecipient?: string
): string {
  if (isSellInquiry(inquiry)) {
    const recipient = customRecipient || AGENCY_SELL_EMAIL;
    const addressLine = inquiry.propertyAddress || 'Confidential Property';
    const subject = `Private Valuation Inquiry — ${addressLine}`;

    const bodyLines = [
      'Dear AURA Real Estate Private Office,',
      '',
      'I would like to request confidential advice regarding the valuation and representation of my property.',
      '',
      '--- PROPERTY OWNER DETAILS ---',
      `Owner Name: ${inquiry.ownerName || 'Not provided'}`,
      `Telephone: ${inquiry.phone || 'Not provided'}`,
      `Email Address: ${inquiry.email || 'Not provided'}`,
      '',
      '--- RESIDENCE SPECIFICATIONS ---',
      `Property Address: ${inquiry.propertyAddress || 'Not provided'}${inquiry.unit ? ` (Unit: ${inquiry.unit})` : ''}`,
      inquiry.neighborhood ? `Neighborhood / District: ${inquiry.neighborhood}` : '',
      `Property Type: ${inquiry.propertyType || 'Not specified'}`,
      `Estimated Bedrooms: ${inquiry.estimatedBedrooms ?? 'Not specified'}`,
      `Estimated Bathrooms: ${inquiry.estimatedBathrooms ?? 'Not specified'}`,
      `Estimated Value Bracket: ${inquiry.estimatedValue || 'Advise Me / Confidential'}`,
      `Intended Timeline: ${inquiry.timeline ? inquiry.timeline.replace(/_/g, ' ') : 'Exploring options'}`,
      `Marketing Preference: ${inquiry.marketingPreference === 'private_exclusive' ? 'Private Exclusive (Off-Market)' : 'Public Debut'}`,
      '',
      '--- OWNER NOTES & ARCHITECTURAL HIGHLIGHTS ---',
      inquiry.notes && inquiry.notes.trim() !== '' ? inquiry.notes : 'None provided.',
      '',
      'I understand this inquiry is strictly confidential and does not create an automated public listing.',
      '',
      'Sincerely,',
      inquiry.ownerName || 'Property Owner',
    ].filter((line) => line !== '');

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(bodyLines.join('\r\n'));

    return `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  // Otherwise, handle general ContactInquiry
  const recipient = customRecipient || AGENCY_CONTACT_EMAIL;
  const subject = inquiry.subject
    ? `General Inquiry: ${inquiry.subject}`
    : 'Client Inquiry — AURA Real Estate Private Office';

  const bodyLines = [
    'Dear AURA Real Estate Advisory Desk,',
    '',
    'I am contacting the agency regarding the following matter:',
    '',
    `Client Name: ${inquiry.fullName || 'Not provided'}`,
    `Email Address: ${inquiry.email || 'Not provided'}`,
    inquiry.phone ? `Telephone: ${inquiry.phone}` : '',
    inquiry.preferredOffice ? `Preferred Office: ${inquiry.preferredOffice}` : '',
    '',
    '--- MESSAGE CONTENT ---',
    inquiry.message || 'No message provided.',
    '',
    'Sincerely,',
    inquiry.fullName || 'Prospective Client',
  ].filter((line) => line !== '');

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyLines.join('\r\n'));

  return `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
}
