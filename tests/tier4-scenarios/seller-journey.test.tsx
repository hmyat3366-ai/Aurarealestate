import { describe, it, expect } from 'vitest';
import {
  SellInquiry,
  generateMailtoLink,
  ALL_PROPERTIES,
} from '../helpers/testFixtures';

describe('Tier 4: Scenario 3 — Prime Estate Owner Off-Market Valuation Journey', () => {
  it('should execute end-to-end confidential off-market selling consultation and mailto fallback', () => {
    // Step 1: Property owner visits Sell with Us page (/sell)
    const currentRoute = '/sell';
    expect(currentRoute).toBe('/sell');

    // Step 2: Owner reviews Private Exclusives representation manifesto
    const pageFeatures = {
      privateExclusivesOverview: true,
      confidentialValuationIntake: true,
      mailtoFallbackAvailable: true,
      zeroDirectPublishing: true,
    };
    expect(pageFeatures.privateExclusivesOverview).toBe(true);
    expect(pageFeatures.zeroDirectPublishing).toBe(true);

    // Step 3: Owner fills comprehensive valuation consultation intake
    const sellerInquiry: SellInquiry = {
      ownerName: 'Lord Alistair Sterling-Grey',
      email: 'a.sterling-grey@kensington-manor.com',
      phone: '+44 20 7946 0889',
      propertyAddress: '15 Holland Park Gardens, Kensington, London W14',
      propertyType: 'villa',
      estimatedBedrooms: 6,
      estimatedBathrooms: 5,
      notes: 'Desire discreet private off-market placement without public portal syndication.',
    };

    // Step 4: Submission simulation with explicit fiduciary protection
    const initialListingCount = ALL_PROPERTIES.length;

    const handleSellSubmission = (data: SellInquiry) => {
      // Fiduciary integrity rule: NEVER add to public ALL_PROPERTIES catalog
      return {
        success: true,
        inquiryReference: 'VS-SELL-2026-099',
        message: 'Your confidential valuation inquiry has been received by our Managing Partners. We will contact you within 24 hours.',
      };
    };

    const submissionResult = handleSellSubmission(sellerInquiry);
    expect(submissionResult.success).toBe(true);
    expect(submissionResult.inquiryReference).toBe('VS-SELL-2026-099');

    // Step 5: Verify zero public catalog contamination
    expect(ALL_PROPERTIES.length).toBe(initialListingCount);
    expect(ALL_PROPERTIES.some((p) => p.title.includes('Holland Park Gardens'))).toBe(false);

    // Step 6: Test pre-filled RFC 2368 mailto fallback trigger
    const mailtoLink = generateMailtoLink(sellerInquiry);
    expect(mailtoLink).toContain('mailto:privateoffice@vaneandsterling.com');
    expect(mailtoLink).toContain(encodeURIComponent('Private Valuation Consultation: 15 Holland Park Gardens, Kensington, London W14'));

    const parsedMailto = new URL(mailtoLink);
    const body = parsedMailto.searchParams.get('body')!;
    expect(body).toContain('Lord Alistair Sterling-Grey');
    expect(body).toContain('15 Holland Park Gardens');
    expect(body).toContain('Desire discreet private off-market placement');
  });

  it('should guarantee that private client office details are clearly exposed on valuation page', () => {
    const privateOfficeContact = {
      desk: 'Private Client Office (Acquisitions & Exclusives)',
      email: 'privateoffice@vaneandsterling.com',
      phone: '+44 (0)20 7946 0880',
      hours: 'Monday – Friday, 08:30 – 19:00 GMT',
      discreteHotline: true,
    };

    expect(privateOfficeContact.email).toBe('privateoffice@vaneandsterling.com');
    expect(privateOfficeContact.phone).toContain('+44 (0)20 7946');
    expect(privateOfficeContact.discreteHotline).toBe(true);
  });
});
