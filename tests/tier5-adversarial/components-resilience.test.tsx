/**
 * tests/tier5-adversarial/components-resilience.test.tsx
 * Milestone 5 Tier 5: White-Box Adversarial Hardening for Component Edge Cases & Resilience.
 * 
 * Verifies UI component resilience under sparse/incomplete data schemas, storage corruption,
 * accessible keyboard trapping, and modal focus management.
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { PropertyDetailView } from '@/components/property/PropertyDetailView';
import { PhotoGallery } from '@/components/property/PhotoGallery';
import { ActiveChips } from '@/components/discovery/ActiveChips';
import { Select } from '@/components/ui/Select';
import { FavoritesProvider, useFavorites } from '@/context/FavoritesContext';
import { Property } from '@/types/property';
import { PROPERTIES } from '@/data/properties';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

// Sparse property fixture missing optional and non-critical fields
const sparseProperty: Property = {
  id: 'sparse-01',
  slug: 'sparse-residence',
  title: 'Sparse Architectural Residence',
  subtitle: '',
  listingType: 'sale',
  propertyType: 'apartment',
  status: 'Active',
  price: { amount: 3500000, currency: 'USD' },
  bedrooms: 2,
  bathrooms: 2,
  squareFeet: 1800,
  yearBuilt: 1950,
  address: {
    street: '1 Minimalist Way',
    neighborhood: 'SoHo',
    city: 'New York',
    postalCode: '10013',
  },
  description: [],
  images: {
    hero: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    gallery: [],
  },
  amenities: {
    interior: [],
    outdoor: [],
    building: [],
  },
  agent: PROPERTIES[0].agent,
};

describe('Tier 5 Adversarial: Component Resilience & Sparse Schema Hardening', () => {
  describe('PropertyDetailView with Sparse Data', () => {
    it('renders cleanly without throwing when subtitle, description, and amenities are empty', () => {
      render(
        <FavoritesProvider>
          <PropertyDetailView property={sparseProperty} />
        </FavoritesProvider>
      );

      expect(screen.getByRole('heading', { level: 1, name: 'Sparse Architectural Residence' })).toBeInTheDocument();
      expect(screen.getByText(/Full architectural overview and interior specifications available/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Specific features available upon request/i).length).toBe(3);
      expect(screen.getAllByText(/\$3,500,000/).length).toBeGreaterThan(0);
    });

    it('renders rental property without rentalDetails without throwing', () => {
      const sparseRental: Property = {
        ...sparseProperty,
        listingType: 'rent',
        price: { amount: 12000, currency: 'USD', rentalPeriod: 'month' },
        rentalDetails: undefined,
      };

      render(
        <FavoritesProvider>
          <PropertyDetailView property={sparseRental} />
        </FavoritesProvider>
      );

      expect(screen.getAllByText(/\$12,000 \/ mo/).length).toBeGreaterThan(0);
      expect(screen.getByText(/Leasing Portfolio/i)).toBeInTheDocument();
    });
  });

  describe('PhotoGallery Adversarial Traversal & Lightbox Trap', () => {
    it('renders safely when gallery array is empty and deduplicates hero image', () => {
      render(
        <PhotoGallery
          images={{
            hero: 'https://images.unsplash.com/photo-1?w=800',
            gallery: ['https://images.unsplash.com/photo-1?w=800'], // duplicate of hero
          }}
          title="Single Photo Penthouse"
        />
      );

      // Should display hero image and 1 photo counter
      expect(screen.getByText(/View All Photos \(1\)/i)).toBeInTheDocument();
    });

    it('opens lightbox, cycles images, tests keyboard navigation and zoom toggle', () => {
      const photos = [
        'https://images.unsplash.com/photo-1?w=800',
        'https://images.unsplash.com/photo-2?w=800',
        'https://images.unsplash.com/photo-3?w=800',
      ];

      render(
        <PhotoGallery
          images={{
            hero: photos[0],
            gallery: [photos[1], photos[2]],
          }}
          title="Multi Photo Villa"
        />
      );

      // Open lightbox via View All Photos button
      fireEvent.click(screen.getByText(/View All Photos \(3\)/i));

      // Lightbox modal should appear
      expect(screen.getByRole('dialog', { name: /Photo Gallery Lightbox/i })).toBeInTheDocument();
      expect(screen.getByText(/1 of 3/i)).toBeInTheDocument();

      // Click next image
      fireEvent.click(screen.getByRole('button', { name: /Next image/i }));
      expect(screen.getByText(/2 of 3/i)).toBeInTheDocument();

      // Keyboard Right Arrow
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText(/3 of 3/i)).toBeInTheDocument();

      // Keyboard Left Arrow
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByText(/2 of 3/i)).toBeInTheDocument();

      // Zoom level toggle
      const zoomBtn = screen.getByRole('button', { name: /Current zoom/i });
      expect(zoomBtn).toHaveTextContent('1x');
      fireEvent.click(zoomBtn);
      expect(zoomBtn).toHaveTextContent('1.5x');
      fireEvent.click(zoomBtn);
      expect(zoomBtn).toHaveTextContent('2x');
      fireEvent.click(zoomBtn);
      expect(zoomBtn).toHaveTextContent('1x');

      // Escape key closes lightbox
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog', { name: /Photo Gallery Lightbox/i })).not.toBeInTheDocument();
    });
  });

  describe('ActiveChips Range and Multi-Value Removal', () => {
    it('clears both minPrice and maxPrice when price range chip is dismissed', () => {
      const onRemoveMock = vi.fn();
      render(
        <ActiveChips
          filters={{
            minPrice: 5000000,
            maxPrice: 10000000,
          }}
          onRemove={onRemoveMock}
          onClearAll={() => {}}
        />
      );

      const removeBtn = screen.getByLabelText(/Remove filter: Price: \$5,000,000 – \$10,000,000/i);
      fireEvent.click(removeBtn);

      expect(onRemoveMock).toHaveBeenCalledWith('minPrice', undefined);
    });

    it('passes specific value when dismissing individual property typology chip', () => {
      const onRemoveMock = vi.fn();
      render(
        <ActiveChips
          filters={{
            propertyTypes: ['penthouse', 'villa', 'loft'],
          }}
          onRemove={onRemoveMock}
          onClearAll={() => {}}
        />
      );

      const removeVillaBtn = screen.getByLabelText(/Remove filter: Villa/i);
      fireEvent.click(removeVillaBtn);

      expect(onRemoveMock).toHaveBeenCalledWith('propertyTypes', 'villa');
    });

    it('returns null and renders nothing when no filters are active', () => {
      const { container } = render(
        <ActiveChips
          filters={{}}
          onRemove={() => {}}
          onClearAll={() => {}}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('FavoritesContext Storage Fault Tolerance', () => {
    function FavoritesConsumer() {
      const { favorites, toggleFavorite, count } = useFavorites();
      return (
        <div>
          <span data-testid="count">{count}</span>
          <button type="button" onClick={() => toggleFavorite('prop-test')}>
            Toggle
          </button>
        </div>
      );
    }

    it('handles corrupted JSON in localStorage gracefully without throwing', () => {
      localStorage.setItem('vane_sterling_favorites', '{corrupt json!!!');

      render(
        <FavoritesProvider>
          <FavoritesConsumer />
        </FavoritesProvider>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
      fireEvent.click(screen.getByRole('button', { name: /Toggle/i }));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });

    it('handles localStorage throwing SecurityError (e.g. private browsing mode)', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      });

      render(
        <FavoritesProvider>
          <FavoritesConsumer />
        </FavoritesProvider>
      );

      // Should still update in-memory state gracefully without unhandled exception
      fireEvent.click(screen.getByRole('button', { name: /Toggle/i }));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });

  describe('Select Combobox Edge Cases and Keyboard Traversal', () => {
    it('handles empty options array gracefully without crashing', () => {
      render(
        <Select
          id="empty-select"
          options={[]}
          placeholder="No options available"
        />
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('No options available');
      fireEvent.click(trigger);
      // No listbox options rendered, no crash
      expect(screen.getByRole('listbox')).toBeEmptyDOMElement();
    });

    it('supports Home and End key navigation in listbox', () => {
      const options = [
        { value: '1', label: 'First' },
        { value: '2', label: 'Second' },
        { value: '3', label: 'Third' },
      ];

      render(
        <Select
          id="keyboard-select"
          options={options}
        />
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger); // Open listbox

      // Press End key -> highlights last option
      fireEvent.keyDown(trigger, { key: 'End' });
      // Press Enter to select
      fireEvent.keyDown(trigger, { key: 'Enter' });

      expect(trigger).toHaveTextContent('Third');
    });
  });
});
