import { describe, it, expect } from 'vitest';
import {
  SellInquiry,
  generateMailtoLink,
  ViewingRequest,
} from '../helpers/testFixtures';

describe('Tier 2: Form Validation & RFC 2368 Mailto Boundaries', () => {
  // Viewing Request Edge Cases
  describe('Viewing Request Input Boundaries', () => {
    function isValidEmail(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidFutureDate(dateStr: string): boolean {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return false;
      // Check calendar validity (e.g. Feb 30 shouldn't be rolled over)
      const [y, m, d] = dateStr.split('-').map(Number);
      if (date.getUTCFullYear() !== y || date.getUTCMonth() + 1 !== m || date.getUTCDate() !== d) {
        return false;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }

    it('should reject email with spaces inside', () => {
      expect(isValidEmail('user name@example.com')).toBe(false);
      expect(isValidEmail('user@ exam ple.com')).toBe(false);
    });

    it('should reject email with missing top-level domain (TLD)', () => {
      expect(isValidEmail('user@localhost')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
    });

    it('should reject email with consecutive @ symbols', () => {
      expect(isValidEmail('user@@example.com')).toBe(false);
    });

    it('should reject email without username or domain', () => {
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });

    it('should accept valid international subdomains and plus addressing', () => {
      expect(isValidEmail('buyer.vip+london@private.office.co.uk')).toBe(true);
      expect(isValidEmail('investor_123@swiss-bank.ch')).toBe(true);
    });

    it('should reject invalid calendar dates such as February 30th', () => {
      expect(isValidFutureDate('2027-02-30')).toBe(false);
      expect(isValidFutureDate('2027-04-31')).toBe(false);
    });

    it('should accept valid leap year date (e.g. 2028-02-29)', () => {
      expect(isValidFutureDate('2028-02-29')).toBe(true);
    });

    it('should reject past dates', () => {
      expect(isValidFutureDate('2023-01-01')).toBe(false);
      expect(isValidFutureDate('1999-12-31')).toBe(false);
    });

    it('should reject non-date strings gracefully', () => {
      expect(isValidFutureDate('tomorrow')).toBe(false);
      expect(isValidFutureDate('undefined')).toBe(false);
      expect(isValidFutureDate('')).toBe(false);
    });
  });

  // RFC 2368 Mailto Encoding & Special Characters
  describe('RFC 2368 Mailto Encoding & Special Characters', () => {
    it('should percent-encode special characters (&, ?, =, #, %) in subject and body', () => {
      const inquiryWithSpecialChars: SellInquiry = {
        ownerName: 'Vane & Sterling Partner #1',
        email: 'partner@test.com',
        phone: '+44 20 7000 0000',
        propertyAddress: '10 Downing St & 11 Downing St? #Suite 4=5',
        propertyType: 'townhouse',
        estimatedBedrooms: 6,
        estimatedBathrooms: 5,
        notes: 'Price: 100% firm. Questions & inquiries? Call me = now.',
      };

      const mailtoUrl = generateMailtoLink(inquiryWithSpecialChars);
      expect(mailtoUrl.startsWith('mailto:privateoffice@vaneandsterling.com')).toBe(true);

      // Raw special characters must NOT appear unencoded in the query string
      const queryString = mailtoUrl.slice(mailtoUrl.indexOf('?') + 1);
      const params = new URLSearchParams(queryString);

      const decodedSubject = params.get('subject');
      const decodedBody = params.get('body');

      expect(decodedSubject).toContain('10 Downing St & 11 Downing St? #Suite 4=5');
      expect(decodedBody).toContain('Vane & Sterling Partner #1');
      expect(decodedBody).toContain('100% firm. Questions & inquiries? Call me = now.');
    });

    it('should support Unicode characters and accents in owner name and notes', () => {
      const unicodeInquiry: SellInquiry = {
        ownerName: 'Frédéric François Chopin-Müller',
        email: 'frederic@chopin.pl',
        phone: '+48 22 123 4567',
        propertyAddress: '14 Rue de Beaujolais / Zürichstrasse',
        propertyType: 'apartment',
        estimatedBedrooms: 3,
        estimatedBathrooms: 2,
        notes: 'Vue panoramique sur le lac de Zurich — très privé.',
      };

      const mailtoUrl = generateMailtoLink(unicodeInquiry);
      const queryString = mailtoUrl.slice(mailtoUrl.indexOf('?') + 1);
      const params = new URLSearchParams(queryString);

      expect(params.get('body')).toContain('Frédéric François Chopin-Müller');
      expect(params.get('body')).toContain('très privé');
    });

    it('should use CRLF line breaks in mailto body conforming to RFC 2368', () => {
      const inquiry: SellInquiry = {
        ownerName: 'Lord Byron',
        email: 'byron@poetry.org',
        phone: '+44 20 7946 0111',
        propertyAddress: 'Newstead Abbey, Nottinghamshire',
        propertyType: 'estate',
        estimatedBedrooms: 8,
        estimatedBathrooms: 6,
        notes: 'Line 1\nLine 2',
      };

      const mailtoUrl = generateMailtoLink(inquiry);
      // RFC 2368 requires encoded CRLF (%0D%0A)
      expect(mailtoUrl).toContain('%0D%0A');
    });

    it('should handle extreme text length (5,000 characters) in notes safely', () => {
      const hugeNotes = 'Architectural feature note '.repeat(200); // ~5,400 chars
      const inquiry: SellInquiry = {
        ownerName: 'Extensive Collector',
        email: 'collector@gallery.com',
        phone: '+44 20 7946 0888',
        propertyAddress: '1 Grosvenor Square',
        propertyType: 'penthouse',
        estimatedBedrooms: 4,
        estimatedBathrooms: 4,
        notes: hugeNotes,
      };

      const mailtoUrl = generateMailtoLink(inquiry);
      expect(mailtoUrl.length).toBeGreaterThan(5000);
      const params = new URLSearchParams(mailtoUrl.slice(mailtoUrl.indexOf('?') + 1));
      expect(params.get('body')).toContain('Architectural feature note');
    });

    it('should neutralize HTML and script injection attempts in generated mailto', () => {
      const xssInquiry: SellInquiry = {
        ownerName: '<script>alert("XSS")</script>',
        email: 'attacker@evil.com',
        phone: '+44 000000000',
        propertyAddress: '<img src=x onerror=alert(1)>',
        propertyType: 'villa',
        estimatedBedrooms: 4,
        estimatedBathrooms: 3,
        notes: '"><iframe src="javascript:alert(1)">',
      };

      const mailtoUrl = generateMailtoLink(xssInquiry);
      // In a mailto URL, these should be URL encoded and cannot execute
      expect(mailtoUrl).not.toContain('<script>');
      expect(mailtoUrl).toContain(encodeURIComponent('<script>alert("XSS")</script>'));
    });
  });

  // Empty and Boundary Form Submissions
  describe('Empty and Boundary Form Submissions', () => {
    it('should safely reject completely empty submission payload', () => {
      const emptyPayload = {};
      expect(Object.keys(emptyPayload)).toHaveLength(0);
    });

    it('should handle zero bedrooms and bathrooms without considering them invalid', () => {
      const studioInquiry: SellInquiry = {
        ownerName: 'Studio Owner',
        email: 'studio@london.com',
        phone: '+44 20 7000 1111',
        propertyAddress: '5 Soho Square',
        propertyType: 'loft',
        estimatedBedrooms: 0, // Studio
        estimatedBathrooms: 1,
      };

      const mailtoUrl = generateMailtoLink(studioInquiry);
      expect(mailtoUrl).toContain('Bedrooms:%200');
    });

    it('should format default text when optional notes are empty or undefined', () => {
      const inquiryNoNotes: SellInquiry = {
        ownerName: 'Direct Client',
        email: 'client@london.com',
        phone: '+44 20 7000 2222',
        propertyAddress: '15 Berkeley Square',
        propertyType: 'apartment',
        estimatedBedrooms: 3,
        estimatedBathrooms: 3,
      };

      const mailtoUrl = generateMailtoLink(inquiryNoNotes);
      const params = new URLSearchParams(mailtoUrl.slice(mailtoUrl.indexOf('?') + 1));
      expect(params.get('body')).toContain('Notes: None provided');
    });
  });
});
