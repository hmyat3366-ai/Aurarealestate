/**
 * tests/tier5-adversarial/query-params-adversarial.test.tsx
 * Milestone 5 Tier 5: White-Box Adversarial Hardening for URL Query Parameters.
 * 
 * Verifies that malformed, unexpected, duplicated, out-of-bounds, and hostile query parameters
 * are safely handled by the discovery flows (/buy and /rent) with zero uncaught exceptions,
 * zero infinite loops, and 100% deterministic fallback behavior.
 */

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import BuyPage from '@/app/buy/page';
import RentPage from '@/app/rent/page';
import { FavoritesProvider } from '@/context/FavoritesContext';
import * as navigation from 'next/navigation';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Tier 5 Adversarial: Query Parameters Hardening', () => {
  describe('Malformed & Hostile Numbers in Price Range', () => {
    it('handles non-numeric string values in minPrice and maxPrice gracefully without throwing', () => {
      const searchParams = new URLSearchParams({
        minPrice: 'not-a-number',
        maxPrice: 'one_hundred_thousand',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Should safely ignore non-numeric values and display full catalog
      expect(screen.getByText(/Acquisitions Portfolio/i)).toBeInTheDocument();
      expect(screen.getByText(/Showing/i)).toHaveTextContent('8 residences');
    });

    it('handles negative price parameters without rendering negative filters or crashing', () => {
      const searchParams = new URLSearchParams({
        minPrice: '-5000000',
        maxPrice: '-100',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Negative prices are discarded by num >= 0 check, displaying catalog safely
      expect(screen.getByText(/Showing/i)).toHaveTextContent('8 residences');
    });

    it('handles Infinity and -Infinity in price query parameters', () => {
      const searchParams = new URLSearchParams({
        minPrice: 'Infinity',
        maxPrice: '-Infinity',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Should render without runtime exception
      expect(screen.getByText(/Acquisitions Portfolio/i)).toBeInTheDocument();
    });

    it('handles inverted price bounds (minPrice > maxPrice) resulting in empty state without crash', () => {
      const searchParams = new URLSearchParams({
        minPrice: '15000000',
        maxPrice: '2000000',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // No property can satisfy min $15M AND max $2M -> EmptyState rendered cleanly
      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset All Filters/i })).toBeInTheDocument();
    });

    it('handles formatted price strings with commas and currency symbols gracefully (?minPrice=$1,000,000)', () => {
      const searchParams = new URLSearchParams({
        minPrice: '$1,000,000',
        maxPrice: '£5,000,000',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Number('$1,000,000') evaluates to NaN, correctly ignored
      expect(screen.getByText(/Showing/i)).toHaveTextContent('8 residences');
    });

    it('handles astronomical price numbers without memory leak or overflow', () => {
      const searchParams = new URLSearchParams({
        minPrice: '999999999999999999999',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
    });
  });

  describe('Adversarial Bedroom and Bathroom Query Parameters', () => {
    it('handles invalid non-numeric tokens in bedrooms without throwing', () => {
      const searchParams = new URLSearchParams({
        bedrooms: 'triple-penthouse-beds',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Showing/i)).toHaveTextContent('8 residences');
    });

    it('handles case-insensitive studio parameter (?bedrooms=STUDIO and ?bedrooms=Studio)', () => {
      const searchParams = new URLSearchParams({
        bedrooms: 'STUDIO',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Sale catalog has no 0-bedroom studio residences -> displays EmptyState cleanly
      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
    });

    it('handles negative bedroom and bathroom counts by discarding them', () => {
      const searchParams = new URLSearchParams({
        bedrooms: '-3',
        bathrooms: '-2.5',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Showing/i)).toHaveTextContent('8 residences');
    });

    it('handles fractional and decimal bathroom parameters (?bathrooms=3.5)', () => {
      const searchParams = new URLSearchParams({
        bathrooms: '3.5',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Mercer Cast-Iron Penthouse has 3.5 bathrooms
      expect(screen.getByRole('heading', { name: /The Mercer Cast-Iron Penthouse/i })).toBeInTheDocument();
    });

    it('handles extreme bedroom counts (?bedrooms=50) showing zero matching without crash', () => {
      const searchParams = new URLSearchParams({
        bedrooms: '50',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
    });
  });

  describe('Unrecognized & Tampered Property Types', () => {
    it('handles non-existent fabricated property typologies (?type=spaceship,castle,igloo)', () => {
      const searchParams = new URLSearchParams({
        type: 'spaceship,castle,igloo',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Fabricated types return zero matches and render empty state cleanly
      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
    });

    it('handles mix of valid and invalid property types (?type=penthouse,spaceship,villa)', () => {
      const searchParams = new URLSearchParams({
        type: 'penthouse,spaceship,villa',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Valid penthouses and villas should still match
      expect(screen.getByRole('heading', { name: /The Mercer Cast-Iron Penthouse/i })).toBeInTheDocument();
    });

    it('handles repeated duplicate type keys (?type=penthouse&type=penthouse&type=villa)', () => {
      const searchParams = new URLSearchParams();
      searchParams.append('type', 'penthouse');
      searchParams.append('type', 'penthouse');
      searchParams.append('type', 'villa');
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Should deduplicate and show penthouses and villas
      expect(screen.getByRole('heading', { name: /The Mercer Cast-Iron Penthouse/i })).toBeInTheDocument();
    });

    it('handles empty type values (?type= or ?type=all)', () => {
      const searchParams = new URLSearchParams({
        type: 'all',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Showing/i)).toHaveTextContent('8 residences');
    });
  });

  describe('Hostile Strings, XSS, and Injection Vectors', () => {
    it('handles SQL injection payloads in location without executing or crashing', () => {
      const searchParams = new URLSearchParams({
        location: "' OR 1=1; DROP TABLE properties; --",
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // String does not match any neighborhood -> empty state rendered cleanly
      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
    });

    it('handles XSS script tags in location safely in UI without execution', () => {
      const searchParams = new URLSearchParams({
        location: '<script>alert("xss")</script>',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
      // Active chip should safely display text content without HTML injection
      expect(screen.getByText(/Location: <script>alert\("xss"\)<\/script>/i)).toBeInTheDocument();
    });

    it('handles unicode emojis and foreign scripts in search location', () => {
      const searchParams = new URLSearchParams({
        location: '🏰 豪华阁楼 مرحبا Москва',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
      expect(screen.getByText(/Location: 🏰 豪华阁楼 مرحبا Москва/i)).toBeInTheDocument();
    });

    it('handles regex special characters in location search without regex syntax errors', () => {
      const searchParams = new URLSearchParams({
        location: '.*+?^${}()|[]\\',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
    });

    it('handles extremely large string payloads (2,000 characters) in location without crashing', () => {
      const largeLocation = 'A'.repeat(2000);
      const searchParams = new URLSearchParams({
        location: largeLocation,
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
    });
  });

  describe('Adversarial Rental Specific Parameters in /rent', () => {
    it('handles unexpected leaseTerm parameter values gracefully', () => {
      const searchParams = new URLSearchParams({
        leaseTerm: 'century-long-contract',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <RentPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Zero Matching Residences/i)).toBeInTheDocument();
    });

    it('handles furnished=false and petsAllowed=false without treating them as true', () => {
      const searchParams = new URLSearchParams({
        furnished: 'false',
        petsAllowed: 'false',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <RentPage />
        </FavoritesProvider>
      );

      // furnished is only active when === 'true'
      expect(screen.getByText(/Showing/i)).toHaveTextContent('8 residences for lease');
    });

    it('handles duplicate contradictory keys (?furnished=true&furnished=false)', () => {
      const searchParams = new URLSearchParams();
      searchParams.append('furnished', 'true');
      searchParams.append('furnished', 'false');
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <RentPage />
        </FavoritesProvider>
      );

      expect(screen.getByText(/Curated Residences for Lease/i)).toBeInTheDocument();
    });
  });

  describe('Invalid Sort Options and Fallbacks', () => {
    it('falls back safely to featured when sort option is unrecognized (?sort=hacker_sort)', () => {
      const searchParams = new URLSearchParams({
        sort: 'hacker_sort',
      });
      vi.spyOn(navigation, 'useSearchParams').mockReturnValue(searchParams as any);

      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Default sorting option should remain 'featured'
      expect(screen.getByText(/Acquisitions Portfolio/i)).toBeInTheDocument();
      expect(screen.getByText(/Showing/i)).toHaveTextContent('8 residences');
    });
  });
});
