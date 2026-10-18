/**
 * tests/tier5-adversarial/state-sync-and-navigation.test.tsx
 * Milestone 5 Tier 5: White-Box Adversarial Hardening for State Sync & Cross-Route Navigation.
 * 
 * Verifies strict financial isolation between Buy and Rent flows, query param contamination
 * defense, saved portfolio partition integrity, and history traversal resilience.
 */

import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import BuyPage from '@/app/buy/page';
import RentPage from '@/app/rent/page';
import { FavoritesProvider, useFavorites } from '@/context/FavoritesContext';
import * as navigation from 'next/navigation';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

// Helper component to seed favorites for testing
function FavoritesSeeder({ ids }: { ids: string[] }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  React.useEffect(() => {
    ids.forEach((id) => {
      if (!isFavorite(id)) {
        toggleFavorite(id);
      }
    });
  }, [ids, isFavorite, toggleFavorite]);
  return null;
}

describe('Tier 5 Adversarial: State Synchronization & Navigation Hardening', () => {
  describe('Cross-Route Parameter Pollution Immunity', () => {
    it('ensures /buy flow completely ignores rental-specific parameters (leaseTerm, furnished, petsAllowed)', () => {
      // Simulate malicious or mistaken URL with rental parameters on /buy
      const searchParams = new URLSearchParams({
        leaseTerm: 'annual',
        furnished: 'true',
        petsAllowed: 'true',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Buy page must still render all 8 Sale properties, never crashing or displaying /mo lease rates
      expect(screen.getByText(/Showing/i)).toHaveTextContent('8 residences');
      expect(screen.getByText('The Mercer Cast-Iron Penthouse')).toBeInTheDocument();
      expect(screen.getByText('$7,400,000')).toBeInTheDocument();
      expect(screen.queryByText(/ \/ mo/)).not.toBeInTheDocument();
    });

    it('ensures /rent flow strictly filters only rent properties with monthly rates even if sale parameters are present', () => {
      const searchParams = new URLSearchParams({
        listingType: 'sale', // hostile parameter trying to force sale on /rent
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <RentPage />
        </FavoritesProvider>
      );

      // Rent flow strictly bounds rentProperties to PROPERTIES.filter(p => p.listingType === 'rent')
      // No sale properties should ever bleed into rent page
      expect(screen.queryByText('The Mercer Cast-Iron Penthouse')).not.toBeInTheDocument();
      expect(screen.getByText('The Water Street Clocktower Loft')).toBeInTheDocument();
      expect(screen.getByText(/\$6,500 \/ mo/)).toBeInTheDocument();
    });
  });

  describe('Saved Portfolio State Separation Between Buy and Rent', () => {
    it('isolates saved sale properties so they do NOT appear on /rent?saved=true', () => {
      // Seed a sale property into favorites: prop-sale-01 ('The Mercer Cast-Iron Penthouse')
      const searchParams = new URLSearchParams({
        saved: 'true',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <FavoritesSeeder ids={['prop-sale-01']} />
          <RentPage />
        </FavoritesProvider>
      );

      // Even though prop-sale-01 is favorited, on /rent it must NOT display
      expect(screen.queryByText('The Mercer Cast-Iron Penthouse')).not.toBeInTheDocument();

      // Should display EmptyState specifically for rental portfolio
      expect(
        screen.getByText(/You have not saved any rental residences to your portfolio yet/i)
      ).toBeInTheDocument();
    });

    it('isolates saved rent properties so they do NOT appear on /buy?saved=true', () => {
      // Seed a rent property into favorites: prop-rent-01 ('The Water Street Clocktower Loft')
      const searchParams = new URLSearchParams({
        saved: 'true',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <FavoritesSeeder ids={['prop-rent-01']} />
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.queryByText('The Water Street Clocktower Loft')).not.toBeInTheDocument();

      // Should display EmptyState specifically for acquisitions portfolio
      expect(
        screen.getByText(/You have not saved any residences to your acquisitions portfolio yet/i)
      ).toBeInTheDocument();
    });

    it('correctly displays matching saved properties on their respective flows', () => {
      const searchParams = new URLSearchParams({
        saved: 'true',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <FavoritesSeeder ids={['prop-sale-01', 'prop-sale-02']} />
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.getByRole('heading', { name: 'The Mercer Cast-Iron Penthouse' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'The Perry Street Glass Pavilion' })).toBeInTheDocument();
      expect(screen.getByText(/Showing/i)).toHaveTextContent('2 residences in Saved Portfolio');
    });
  });

  describe('Rapid Navigation & Filter Dismissal Transitions', () => {
    it('handles removal of active chips when query parameter state changes', () => {
      const replaceSpy = vi.fn();
      vi.spyOn(navigation, 'useRouter').mockReturnValue({
        replace: replaceSpy,
        push: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      });

      const searchParams = new URLSearchParams({
        location: 'SoHo',
        minPrice: '5000000',
        maxPrice: '10000000',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Verify active chips are rendered
      expect(screen.getByText(/Location: SoHo/i)).toBeInTheDocument();
      expect(screen.getByText(/Price: \$5,000,000 – \$10,000,000/i)).toBeInTheDocument();

      // Click remove on location chip
      const removeLocationBtn = screen.getByLabelText(/Remove filter: Location: SoHo/i);
      fireEvent.click(removeLocationBtn);

      expect(replaceSpy).toHaveBeenCalled();
    });

    it('handles Clear All Filters button triggering shallow URL update with clean state', () => {
      const replaceSpy = vi.fn();
      vi.spyOn(navigation, 'useRouter').mockReturnValue({
        replace: replaceSpy,
        push: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      });

      const searchParams = new URLSearchParams({
        location: 'Mayfair',
        type: 'penthouse',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      const clearAllBtn = screen.getByRole('button', { name: /Clear All Filters/i });
      fireEvent.click(clearAllBtn);

      expect(replaceSpy).toHaveBeenCalledWith('/', { scroll: false });
    });
  });
});
