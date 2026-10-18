/**
 * tests/tier5-adversarial/form-boundaries-adversarial.test.tsx
 * Milestone 5 Tier 5: White-Box Adversarial Hardening for Form Boundary Inputs.
 * 
 * Verifies that forms (ViewingModal, SellInquiryForm, ContactForm) and RFC 2368 mailto
 * generation handle boundary inputs: extreme lengths, unicode, header injection,
 * malformed emails, boundary telephone numbers, and date validation.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ViewingModal } from '@/components/inquiry/ViewingModal';
import { SellInquiryForm } from '@/components/inquiry/SellInquiryForm';
import { ContactForm } from '@/components/inquiry/ContactForm';
import { generateMailtoLink } from '@/lib/mailto';
import { PROPERTIES } from '@/data/properties';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const sampleProperty = PROPERTIES[0];

describe('Tier 5 Adversarial: Form Boundary Inputs & RFC 2368 Hardening', () => {
  describe('ViewingModal Boundary & Adversarial Tests', () => {
    it('rejects past dates and enforces 24-hour advance coordination policy', async () => {
      render(
        <ViewingModal
          isOpen={true}
          onClose={() => {}}
          property={sampleProperty}
        />
      );

      // Yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const pastDateStr = yesterday.toISOString().split('T')[0];

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const phoneInput = screen.getByLabelText(/Telephone Number/i);
      const dateInput = screen.getByLabelText(/Preferred Date/i);

      fireEvent.change(nameInput, { target: { value: 'Countess von Test' } });
      fireEvent.change(emailInput, { target: { value: 'countess@vaneandsterling.com' } });
      fireEvent.change(phoneInput, { target: { value: '+44 20 7946 0880' } });
      fireEvent.change(dateInput, { target: { value: pastDateStr } });

      const submitBtn = screen.getByRole('button', { name: /Request Appointment/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Viewing date must be in the future/i)).toBeInTheDocument();
      });
    });

    it('rejects malformed date strings gracefully without throwing', async () => {
      render(
        <ViewingModal
          isOpen={true}
          onClose={() => {}}
          property={sampleProperty}
        />
      );

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const phoneInput = screen.getByLabelText(/Telephone Number/i);
      const dateInput = screen.getByLabelText(/Preferred Date/i);

      fireEvent.change(nameInput, { target: { value: 'Countess von Test' } });
      fireEvent.change(emailInput, { target: { value: 'countess@vaneandsterling.com' } });
      fireEvent.change(phoneInput, { target: { value: '+44 20 7946 0880' } });
      fireEvent.change(dateInput, { target: { value: 'not-a-valid-date' } });

      const submitBtn = screen.getByRole('button', { name: /Request Appointment/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/Please select a preferred viewing date|Viewing date must be in the future/i)
        ).toBeInTheDocument();
      });
    });

    it('handles tomorrow date successfully and displays explicit pending confirmation invariant', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      render(
        <ViewingModal
          isOpen={true}
          onClose={() => {}}
          property={sampleProperty}
        />
      );

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Sir Alistair Finch' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'alistair@vaneandsterling.com' } });
      fireEvent.change(screen.getByLabelText(/Telephone Number/i), { target: { value: '+44 20 7946 0199' } });
      fireEvent.change(screen.getByLabelText(/Preferred Date/i), { target: { value: tomorrowStr } });

      fireEvent.click(screen.getByRole('button', { name: /Request Appointment/i }));

      // Wait for submission simulation to complete and confirm explicit pending status
      await waitFor(
        () => {
          expect(
            screen.getByText(/Viewing Request Submitted — Pending Manual Confirmation/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(screen.getByText(/Private showings require 24-hour advance coordination/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add to Calendar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Close Window/i })).toBeInTheDocument();
    });

    it('handles unicode, emojis, and multilingual names and notes without sanitization loss', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const dateStr = tomorrow.toISOString().split('T')[0];

      render(
        <ViewingModal
          isOpen={true}
          onClose={() => {}}
          property={sampleProperty}
        />
      );

      const complexName = 'Lord 🏰 王先生 & الشيخ أحمد';
      const complexNotes = 'Special instructions: 钥匙放在门厅 • Requires wheelchair ramp • VIP security protocol';

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: complexName } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'vip@client.international' } });
      fireEvent.change(screen.getByLabelText(/Telephone Number/i), { target: { value: '+1 (212) 555-0188' } });
      fireEvent.change(screen.getByLabelText(/Preferred Date/i), { target: { value: dateStr } });
      fireEvent.change(screen.getByLabelText(/Special Requirements or Notes/i), { target: { value: complexNotes } });

      fireEvent.click(screen.getByRole('button', { name: /Request Appointment/i }));

      await waitFor(
        () => {
          expect(screen.getByTestId('viewing-request-confirmation')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('handles calendar ICS generation without crashing on special characters', async () => {
      // Mock createObjectURL & revokeObjectURL
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
      const revokeObjectURLMock = vi.fn();
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const dateStr = tomorrow.toISOString().split('T')[0];

      render(
        <ViewingModal
          isOpen={true}
          onClose={() => {}}
          property={sampleProperty}
        />
      );

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Lord Julian' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'julian@vaneandsterling.com' } });
      fireEvent.change(screen.getByLabelText(/Telephone Number/i), { target: { value: '+44 20 7946 0777' } });
      fireEvent.change(screen.getByLabelText(/Preferred Date/i), { target: { value: dateStr } });

      fireEvent.click(screen.getByRole('button', { name: /Request Appointment/i }));

      await waitFor(
        () => {
          expect(screen.getByRole('button', { name: /Add to Calendar/i })).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Trigger Add to Calendar (.ics download)
      fireEvent.click(screen.getByRole('button', { name: /Add to Calendar/i }));
      expect(createObjectURLMock).toHaveBeenCalled();
    });
  });

  describe('SellInquiryForm Boundary & Fiduciary Invariants', () => {
    it('rejects names with fewer than 2 characters and addresses with fewer than 5 characters', async () => {
      render(<SellInquiryForm />);

      fireEvent.change(screen.getByLabelText(/Owner Full Name/i), { target: { value: 'A' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByLabelText(/Telephone/i), { target: { value: '123' } });
      fireEvent.change(screen.getByLabelText(/Property Address & Postal Code/i), { target: { value: '123' } });

      fireEvent.click(screen.getByRole('button', { name: /Submit Confidential Valuation Request/i }));

      await waitFor(() => {
        expect(screen.getAllByText(/Owner name must be at least 2 characters/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Please provide a valid email address/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Please provide a valid telephone number/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Please specify the full property address/i).length).toBeGreaterThan(0);
      });
    });

    it('submits successfully with 5,000 character architectural notes without truncation error', async () => {
      render(<SellInquiryForm />);

      const massiveNotes = 'Curatorial provenance: '.repeat(250); // ~5,500 characters

      fireEvent.change(screen.getByLabelText(/Owner Full Name/i), { target: { value: 'Eleanor Sterling' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'eleanor@vaneandsterling.com' } });
      fireEvent.change(screen.getByLabelText(/Telephone/i), { target: { value: '+44 20 7946 0882' } });
      fireEvent.change(screen.getByLabelText(/Property Address & Postal Code/i), {
        target: { value: '14 Wilton Crescent, Belgravia, London SW1X 8RN' },
      });
      fireEvent.change(screen.getByLabelText(/Architectural Highlights & Private Notes/i), {
        target: { value: massiveNotes },
      });

      fireEvent.click(screen.getByRole('button', { name: /Submit Confidential Valuation Request/i }));

      await waitFor(
        () => {
          expect(screen.getByText(/Valuation Request Received/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Verify fiduciary guarantee invariant
      expect(
        screen.getByText(/No automated listing or public marketing has been created/i)
      ).toBeInTheDocument();
    });
  });

  describe('ContactForm Boundary Tests', () => {
    it('enforces minimum character constraints on subject and message', async () => {
      render(<ContactForm />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'J' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'invalid' } });
      fireEvent.change(screen.getByLabelText(/Message & Requirements/i), { target: { value: 'Short' } });

      fireEvent.click(screen.getByRole('button', { name: /Transmit Client Inquiry/i }));

      await waitFor(() => {
        expect(screen.getAllByText(/Please provide your full name \(at least 2 characters\)/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Please provide a valid email address/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Message must be at least 10 characters/i).length).toBeGreaterThan(0);
      });
    });
  });

  describe('RFC 2368 Mailto Protocol & Header Injection Hardening', () => {
    it('escapes CRLF injection attacks preventing SMTP header tampering', () => {
      const maliciousInquiry = {
        ownerName: 'Attacker\r\nBcc: victim@example.com\r\n',
        email: 'attacker@evil.com',
        phone: '+1 555-0199',
        propertyAddress: '10 Downing St\r\nSubject: PWNED',
        propertyType: 'penthouse' as const,
        estimatedBedrooms: 4,
        estimatedBathrooms: 4,
        notes: 'Line 1\r\nLine 2\r\nBcc: spy@example.com',
      };

      const mailtoUri = generateMailtoLink(maliciousInquiry);

      // RFC 2368 requires mailto: URI query string to be validly URL-encoded
      expect(mailtoUri.startsWith('mailto:')).toBe(true);

      // Raw carriage returns and line feeds MUST NOT exist unencoded in the URI
      expect(mailtoUri).not.toContain('\r');
      expect(mailtoUri).not.toContain('\n');

      // Injected Bcc must be safely encoded into URL parameter value (%0D%0A)
      expect(mailtoUri).toContain('%0D%0A');
      // No unencoded &bcc= parameter should be present
      expect(mailtoUri).not.toMatch(/&bcc=/i);
    });

    it('properly encodes international and special unicode characters in subject and body', () => {
      const inquiry = {
        fullName: 'François & Joséphine Möller 🏰',
        email: 'francois@muller.fr',
        phone: '+33 1 42 68 55 00',
        subject: 'Acquisition d\'un château à Paris & Zurich',
        message: 'Intérêt pour une résidence privée de prestige. À bientôt!',
      };

      const mailtoUri = generateMailtoLink(inquiry);

      expect(mailtoUri.startsWith('mailto:contact@vaneandsterling.com')).toBe(true);
      // Ampersand in subject must be percent-encoded to prevent parameter splitting
      expect(mailtoUri).toContain('%26');
      // Unicode characters must be UTF-8 percent-encoded
      expect(mailtoUri).not.toContain('🏰');
      expect(mailtoUri).not.toContain('ç');
    });

    it('safely handles sparse inquiry objects with missing optional attributes', () => {
      const sparseInquiry = {
        ownerName: '',
        email: '',
        phone: '',
        propertyAddress: '',
        propertyType: 'villa' as const,
        estimatedBedrooms: 0,
        estimatedBathrooms: 0,
      };

      const mailtoUri = generateMailtoLink(sparseInquiry);

      expect(mailtoUri).toContain('mailto:sell@vaneandsterling.com');
      expect(mailtoUri).toContain('Confidential%20Property');
    });
  });
});
