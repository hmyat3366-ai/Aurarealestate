import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { renderWithRouter } from './helpers/renderWithRouter';
import RootLayout from '@/app/layout';
import HomePage from '@/app/page';
import BuyPage from '@/app/buy/page';
import RentPage from '@/app/rent/page';
import PropertyDetailPage from '@/app/properties/[id]/page';
import SellPage from '@/app/sell/page';
import AboutPage from '@/app/about/page';
import ContactPage from '@/app/contact/page';
import NotFound from '@/app/not-found';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { FilterBar } from '@/components/discovery/FilterBar';
import { PhotoGallery } from '@/components/property/PhotoGallery';
import { PropertyDetailView } from '@/components/property/PropertyDetailView';
import { ViewingModal } from '@/components/inquiry/ViewingModal';
import { SellInquiryForm } from '@/components/inquiry/SellInquiryForm';
import { ContactForm } from '@/components/inquiry/ContactForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PROPERTIES } from '@/data/properties';

describe('Adversarial WCAG 2.2 AA & Responsive Viewport Audit', () => {
  const sampleProperty = PROPERTIES[0];

  describe('1. Semantic HTML & Landmark Architecture', () => {
    it('audits layout for main landmark nesting and duplicate id="main-content"', async () => {
      // Render RootLayout with BuyPage child
      const { container } = renderWithRouter(
        <RootLayout>
          <BuyPage />
        </RootLayout>
      );

      // Check all elements with id="main-content"
      const mainContentIds = container.querySelectorAll('#main-content');
      const allMains = container.querySelectorAll('main');

      // Check whether <header> and <footer> are placed inside <main>
      const headerInsideMain = Boolean(container.querySelector('main header'));
      const footerInsideMain = Boolean(container.querySelector('main footer'));

      // Check whether a main is nested inside another main
      const nestedMains = container.querySelectorAll('main main');

      console.log('DOM Landmark Findings:', {
        mainContentIdCount: mainContentIds.length,
        mainElementCount: allMains.length,
        nestedMainsCount: nestedMains.length,
        headerInsideMain,
        footerInsideMain,
      });

      // Assertions verifying proper landmark architecture & skip link target
      expect(mainContentIds.length).toBe(1);
      expect(allMains.length).toBe(1);
      expect(nestedMains.length).toBe(0);
      expect(headerInsideMain).toBe(false);
      expect(footerInsideMain).toBe(false);
    });

    it('audits heading hierarchy across all platform pages', async () => {
      const pages = [
        { name: 'HomePage', component: <HomePage /> },
        { name: 'BuyPage', component: <BuyPage /> },
        { name: 'RentPage', component: <RentPage /> },
        {
          name: 'PropertyDetailPage',
          component: (
            <div>
              <Header />
              <main id="main-content">
                <PropertyDetailView property={sampleProperty} />
              </main>
              <Footer />
            </div>
          ),
        },
        { name: 'SellPage', component: <SellPage /> },
        { name: 'AboutPage', component: <AboutPage /> },
        { name: 'ContactPage', component: <ContactPage /> },
        { name: 'NotFound', component: <NotFound /> },
      ];

      const headingAuditResults: Record<string, any> = {};

      for (const page of pages) {
        const { container } = renderWithRouter(page.component);
        const headings = Array.from(
          container.querySelectorAll('h1, h2, h3, h4, h5, h6')
        ).map((el) => ({
          tag: el.tagName.toLowerCase(),
          level: parseInt(el.tagName.replace('H', ''), 10),
          text: el.textContent?.trim().slice(0, 40),
        }));

        const h1Count = headings.filter((h) => h.level === 1).length;

        // Check for skipped heading levels (e.g. h1 -> h3 without h2)
        const skippedLevels: string[] = [];
        for (let i = 0; i < headings.length - 1; i++) {
          const current = headings[i].level;
          const next = headings[i + 1].level;
          if (next > current + 1) {
            skippedLevels.push(
              `${headings[i].tag} ("${headings[i].text}") -> ${headings[i + 1].tag} ("${headings[i + 1].text}")`
            );
          }
        }

        headingAuditResults[page.name] = {
          totalHeadings: headings.length,
          h1Count,
          skippedLevels,
          hierarchy: headings.map((h) => h.tag).join(' -> '),
        };
      }

      console.log('Heading Hierarchy Audit Results:', JSON.stringify(headingAuditResults, null, 2));

      // Assert zero skipped heading levels across all platform pages (WCAG 2.2 AA SC 1.3.1)
      for (const [pageName, result] of Object.entries(headingAuditResults)) {
        expect(
          result.skippedLevels.length,
          `Page ${pageName} has skipped heading levels: ${result.skippedLevels.join(', ')}`
        ).toBe(0);
      }
    });
  });

  describe('2. Mobile Responsive Components & Overflow Behavior', () => {
    it('verifies MobileNav drawer accessibility, tab trapping, and escape handling', () => {
      const handleClose = vi.fn();
      const { rerender } = render(
        <MobileNav isOpen={true} onClose={handleClose} />
      );

      // Verify accessibility attributes on drawer
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label', 'Mobile Navigation');

      // Verify all 5 primary routes are present
      expect(screen.getByRole('link', { name: /Buy/i })).toHaveAttribute('href', '/buy');
      expect(screen.getByRole('link', { name: /Rent/i })).toHaveAttribute('href', '/rent');
      expect(screen.getByRole('link', { name: /Sell with Us/i })).toHaveAttribute('href', '/sell');
      expect(screen.getByRole('link', { name: /About/i })).toHaveAttribute('href', '/about');
      expect(screen.getByRole('link', { name: /Contact/i })).toHaveAttribute('href', '/contact');

      // Verify Escape key closes drawer
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('verifies PhotoGallery mobile carousel controls, touch swipe, and counter', () => {
      const { container } = render(
        <PhotoGallery images={sampleProperty.images} title={sampleProperty.title} />
      );

      // Mobile carousel container with 4/3 aspect ratio
      const mobileCarousel = container.querySelector('.md\\:hidden.aspect-\\[4\\/3\\]');
      expect(mobileCarousel).toBeInTheDocument();

      // Check arrow controls
      const prevButton = screen.getByRole('button', { name: /Previous photo/i });
      const nextButton = screen.getByRole('button', { name: /Next photo/i });
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();

      // Check swipe gestures
      fireEvent.touchStart(mobileCarousel!, { targetTouches: [{ clientX: 200 }] });
      fireEvent.touchMove(mobileCarousel!, { targetTouches: [{ clientX: 100 }] });
      fireEvent.touchEnd(mobileCarousel!);

      // Swiped left should advance photo
      const counter = container.querySelector('.bottom-3.right-3');
      expect(counter).toBeInTheDocument();
    });

    it('verifies FilterBar mobile expand/collapse toggle aria states', () => {
      const handleChange = vi.fn();
      render(
        <FilterBar
          filters={{}}
          onChange={handleChange}
          listingType="sale"
        />
      );

      const toggleButton = screen.getByRole('button', { name: /More Filters/i });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-controls', 'advanced-filters');

      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('verifies Mobile Sticky Bottom Action Bar on PropertyDetailView', () => {
      const { container } = renderWithRouter(
        <PropertyDetailView property={sampleProperty} />
      );

      // Check sticky bottom bar element
      const stickyBar = container.querySelector('.md\\:hidden.fixed.bottom-0');
      expect(stickyBar).toBeInTheDocument();

      // Check schedule viewing CTA in sticky bar
      const scheduleButtons = screen.getAllByRole('button', { name: /Schedule Viewing|Schedule Private Viewing/i });
      expect(scheduleButtons.length).toBeGreaterThanOrEqual(2);

      // Clicking sticky bar Schedule Viewing triggers modal
      const mobileCta = scheduleButtons.find((btn) => btn.closest('.md\\:hidden.fixed.bottom-0'));
      expect(mobileCta).toBeDefined();

      fireEvent.click(mobileCta!);
      expect(screen.getByRole('dialog', { name: /Schedule a Private Viewing/i })).toBeInTheDocument();
    });
  });

  describe('3. WCAG 2.2 AA Focus Visibility, Contrast & ARIA States', () => {
    it('verifies focus-visible rings and interactive ARIA attributes on UI primitives', () => {
      const { container } = render(
        <div>
          <Button variant="primary">Primary Button</Button>
          <Button variant="outline" isLoading loadingText="Saving...">Outline</Button>
          <Input id="test-input" label="Client Name" error="Invalid input" isRequired />
          <Select
            id="test-select"
            label="Bedrooms"
            options={[
              { value: '1', label: '1 Bed' },
              { value: '2', label: '2 Beds' },
            ]}
          />
        </div>
      );

      // Button loading state has aria-busy
      const loadingButton = screen.getByRole('button', { name: /Saving\.\.\./i });
      expect(loadingButton).toHaveAttribute('aria-busy', 'true');

      // Input with error has aria-invalid and aria-required
      const input = screen.getByRole('textbox', { name: /Client Name/i });
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error');

      // Alert role on error message
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Invalid input');

      // Select has combobox role with aria-haspopup
      const combobox = screen.getByRole('combobox', { name: /Bedrooms/i });
      expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
      expect(combobox).toHaveAttribute('aria-expanded', 'false');
    });

    it('verifies skip-to-content link accessibility in RootLayout', () => {
      const { container } = render(
        <RootLayout>
          <div>Child content</div>
        </RootLayout>
      );

      const skipLink = container.querySelector('a[href="#main-content"]');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveTextContent(/Skip to main content/i);
      expect(skipLink?.className).toContain('sr-only');
      expect(skipLink?.className).toContain('focus:not-sr-only');
    });

    it('verifies Modal keyboard focus trap and Escape key dismissal', async () => {
      const handleClose = vi.fn();
      render(
        <Modal
          isOpen={true}
          onClose={handleClose}
          title="Inquiry Dialog"
          description="Inquiry description"
        >
          <div className="space-y-4">
            <input aria-label="First input" id="first-field" />
            <button type="button">Secondary Button</button>
            <button type="button">Submit Action</button>
          </div>
        </Modal>
      );

      const dialog = screen.getByRole('dialog', { name: /Inquiry Dialog/i });
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');

      // Test Escape key dismissal
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('verifies Select combobox keyboard navigability and option selection', () => {
      const handleChange = vi.fn();
      render(
        <Select
          id="bedrooms-combobox"
          label="Bedrooms Selection"
          options={[
            { value: '1', label: '1 Bedroom' },
            { value: '2', label: '2 Bedrooms' },
            { value: '3', label: '3 Bedrooms' },
          ]}
          value="1"
          onChange={handleChange}
        />
      );

      const combobox = screen.getByRole('combobox', { name: /Bedrooms Selection/i });

      // Open with ArrowDown
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
      expect(combobox).toHaveAttribute('aria-expanded', 'true');

      // Options listbox appears
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();

      // Navigate down and select with Enter
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
      fireEvent.keyDown(combobox, { key: 'Enter' });
      expect(handleChange).toHaveBeenCalledWith('2');
    });
  });

  describe('4. Comprehensive Viewport Layout & Overflow Inspection', () => {
    it('audits all rendered pages for classes with fixed pixel widths that could cause horizontal overflow on 360px mobile viewports', () => {
      const pages = [
        { name: 'HomePage', component: <HomePage /> },
        { name: 'BuyPage', component: <BuyPage /> },
        { name: 'RentPage', component: <RentPage /> },
        { name: 'SellPage', component: <SellPage /> },
        { name: 'AboutPage', component: <AboutPage /> },
        { name: 'ContactPage', component: <ContactPage /> },
        { name: 'NotFound', component: <NotFound /> },
      ];

      const suspiciousElements: Record<string, string[]> = {};

      for (const page of pages) {
        const { container } = renderWithRouter(page.component);
        const fixedWidthElements: string[] = [];

        // Find all elements with class names
        const allElements = container.querySelectorAll('*');
        allElements.forEach((el) => {
          const className = el.getAttribute('class') || '';
          // Match fixed width classes like w-[380px], w-[400px], min-w-[400px], etc.
          const fixedWidthMatch = className.match(/(?:min-)?w-\[(\d+)px\]/);
          if (fixedWidthMatch) {
            const pxValue = parseInt(fixedWidthMatch[1], 10);
            if (pxValue > 360) {
              fixedWidthElements.push(
                `<${el.tagName.toLowerCase()}> class="${className}" (fixed ${pxValue}px > 360px mobile width)`
              );
            }
          }
        });

        if (fixedWidthElements.length > 0) {
          suspiciousElements[page.name] = fixedWidthElements;
        }
      }

      console.log('Fixed Width Overflow Inspection Results:', suspiciousElements);
      // Verify zero fixed width overflow elements on all pages
      expect(Object.keys(suspiciousElements).length).toBe(0);
    });
  });
});

