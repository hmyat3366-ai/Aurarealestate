import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PropertyCard } from "@/components/discovery/PropertyCard";
import { FilterBar } from "@/components/discovery/FilterBar";
import { ActiveChips } from "@/components/discovery/ActiveChips";
import { SortSelect } from "@/components/discovery/SortSelect";
import { EmptyState } from "@/components/discovery/EmptyState";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { MOCK_SALE_PROPERTIES, MOCK_RENT_PROPERTIES } from "../helpers/testFixtures";

describe("Milestone 2 Discovery Components Suite", () => {
  // 1. PropertyCard Tests
  describe("PropertyCard Component", () => {
    it("renders sale property with total purchase price, $/sqft, and status badge", () => {
      const saleProp = MOCK_SALE_PROPERTIES[0];
      render(
        <FavoritesProvider>
          <PropertyCard property={saleProp} />
        </FavoritesProvider>
      );

      // Verify purchase price
      expect(screen.getByText("$14,500,000")).toBeInTheDocument();
      // Verify price per sqft
      expect(screen.getByText(/\$3,452 \/ sq ft/)).toBeInTheDocument();
      // Verify specs
      expect(screen.getByText("4 Beds")).toBeInTheDocument();
      expect(screen.getByText("4 Baths")).toBeInTheDocument();
      expect(screen.getByText("4,200 sq ft")).toBeInTheDocument();
      // Verify status badge
      expect(screen.getByText(saleProp.status)).toBeInTheDocument();
      // Verify address and neighborhood
      expect(screen.getByText(saleProp.title)).toBeInTheDocument();
      expect(screen.getByText(saleProp.address.neighborhood)).toBeInTheDocument();
    });

    it("renders rental property with monthly lease rate and rental details", () => {
      const rentProp = MOCK_RENT_PROPERTIES[0];
      render(
        <FavoritesProvider>
          <PropertyCard property={rentProp} />
        </FavoritesProvider>
      );

      // Verify monthly rate has /mo
      expect(screen.getByText(/\$14,000 \/ mo/)).toBeInTheDocument();
      // Verify no price per sqft shown on primary quote
      expect(screen.queryByText(/\(\$\d+.*\/ sq ft\)/)).not.toBeInTheDocument();
      // Verify lease term
      expect(screen.getByText(rentProp.rentalDetails!.leaseTerm)).toBeInTheDocument();
    });

    it("navigates photo carousel on next and previous arrow clicks", () => {
      const propWithGallery = {
        ...MOCK_SALE_PROPERTIES[0],
        images: {
          hero: "https://example.com/hero.jpg",
          gallery: ["https://example.com/gallery1.jpg", "https://example.com/gallery2.jpg"],
        },
      };

      render(
        <FavoritesProvider>
          <PropertyCard property={propWithGallery} />
        </FavoritesProvider>
      );

      const nextBtn = screen.getByRole("button", { name: /next photo/i });
      const prevBtn = screen.getByRole("button", { name: /previous photo/i });

      expect(screen.getByText("1 / 3")).toBeInTheDocument();

      fireEvent.click(nextBtn);
      expect(screen.getByText("2 / 3")).toBeInTheDocument();

      fireEvent.click(prevBtn);
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("toggles favorite state on heart button click", () => {
      const saleProp = MOCK_SALE_PROPERTIES[0];
      render(
        <FavoritesProvider>
          <PropertyCard property={saleProp} />
        </FavoritesProvider>
      );

      const favBtn = screen.getByRole("button", { name: new RegExp(`Save ${saleProp.title}`, "i") });
      expect(favBtn).toHaveAttribute("aria-pressed", "false");

      fireEvent.click(favBtn);
      expect(favBtn).toHaveAttribute("aria-pressed", "true");

      fireEvent.click(favBtn);
      expect(favBtn).toHaveAttribute("aria-pressed", "false");
    });
  });

  // 2. FilterBar Tests
  describe("FilterBar Component", () => {
    it("handles location input change and submit", () => {
      const handleChange = vi.fn();
      render(<FilterBar filters={{}} onChange={handleChange} listingType="sale" />);

      const input = screen.getByPlaceholderText(/search neighborhood/i);
      fireEvent.change(input, { target: { value: "Belgravia" } });
      fireEvent.blur(input);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ location: "Belgravia" })
      );
    });

    it("handles price selection and bed/bath segmented pills", () => {
      const handleChange = vi.fn();
      render(<FilterBar filters={{}} onChange={handleChange} listingType="sale" />);

      // Click "3+" bedrooms
      const bedGroup = screen.getByRole("group", { name: /bedrooms filter/i });
      const bed3Btn = bedGroup.querySelector('button[aria-pressed="false"]:nth-child(5)') as HTMLElement || screen.getAllByRole("button", { name: "3+" })[0];
      fireEvent.click(bed3Btn);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ bedrooms: 3 })
      );
    });

    it("renders rental-specific lease term and furnished toggles when listingType is rent", () => {
      const handleChange = vi.fn();
      render(<FilterBar filters={{}} onChange={handleChange} listingType="rent" />);

      expect(screen.getByLabelText(/lease term/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/furnished only/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/pet-friendly/i)).toBeInTheDocument();

      // Check furnished toggle
      const furnishedCheckbox = screen.getByLabelText(/furnished only/i);
      fireEvent.click(furnishedCheckbox);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ furnished: true })
      );
    });
  });

  // 3. ActiveChips Tests
  describe("ActiveChips Component", () => {
    it("renders dismissible tokens and handles individual remove", () => {
      const handleRemove = vi.fn();
      const handleClearAll = vi.fn();

      render(
        <ActiveChips
          filters={{
            location: "SoHo",
            minPrice: 5000000,
            bedrooms: 2,
            propertyTypes: ["penthouse"],
          }}
          onRemove={handleRemove}
          onClearAll={handleClearAll}
        />
      );

      expect(screen.getByText("Location: SoHo")).toBeInTheDocument();
      expect(screen.getByText("Min: $5,000,000")).toBeInTheDocument();
      expect(screen.getByText("Beds: 2 Beds")).toBeInTheDocument();
      expect(screen.getByText("Penthouse")).toBeInTheDocument();

      // Remove SoHo chip
      const removeLocationBtn = screen.getByRole("button", { name: /remove filter: location: soho/i });
      fireEvent.click(removeLocationBtn);
      expect(handleRemove).toHaveBeenCalledWith("location", undefined);

      // Clear all
      const clearAllBtn = screen.getByRole("button", { name: /clear all filters/i });
      fireEvent.click(clearAllBtn);
      expect(handleClearAll).toHaveBeenCalledTimes(1);
    });

    it("renders nothing when no filters are active", () => {
      const { container } = render(
        <ActiveChips filters={{}} onRemove={vi.fn()} onClearAll={vi.fn()} />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  // 4. SortSelect Tests
  describe("SortSelect Component", () => {
    it("renders 5-way sort dropdown and triggers onChange", () => {
      const handleChange = vi.fn();
      render(<SortSelect value="featured" onChange={handleChange} />);

      const combobox = screen.getByRole("combobox", { name: /sort residences by/i });
      expect(combobox).toBeInTheDocument();

      // Open select
      fireEvent.click(combobox);
      const priceAscOption = screen.getByRole("option", { name: /price: low to high/i });
      fireEvent.click(priceAscOption);

      expect(handleChange).toHaveBeenCalledWith("price-asc");
    });
  });

  // 5. EmptyState Tests
  describe("EmptyState Component", () => {
    it("renders zero-match headline and invokes onReset", () => {
      const handleReset = vi.fn();
      render(<EmptyState onReset={handleReset} listingType="sale" />);

      expect(screen.getByText(/no residences match your current criteria/i)).toBeInTheDocument();
      const resetBtn = screen.getByRole("button", { name: /reset all filters/i });
      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalledTimes(1);
    });
  });

  // 6. Header & Footer Tests
  describe("Header & Footer Layout Components", () => {
    it("renders Header with wordmark, primary nav links, and guest Sign In button", () => {
      render(
        <FavoritesProvider>
          <Header />
        </FavoritesProvider>
      );

      expect(screen.getByText("AURA")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /^buy$/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /^rent$/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /^sell with us$/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /^about$/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /^contact$/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /^sign in$/i })).toBeInTheDocument();
      expect(screen.queryByLabelText(/saved residences/i)).not.toBeInTheDocument();
    });

    it("renders Footer with centralized agency offices and statutory compliance disclosures", () => {
      render(<Footer />);

      // Check offices
      expect(screen.getByText(/14 Berkeley Square, Mayfair, London W1J 6BD/i)).toBeInTheDocument();
      expect(screen.getByText(/767 Fifth Avenue, New York, NY 10153/i)).toBeInTheDocument();
      expect(screen.getByText(/Bahnhofstrasse 45, 8001 Zürich, Switzerland/i)).toBeInTheDocument();

      // Check compliance notices
      expect(screen.getAllByText(/Equal Housing Opportunity/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Fair Housing Act/i)).toBeInTheDocument();
      expect(screen.getByText(/Regulated by RICS/i)).toBeInTheDocument();
      expect(screen.getByText(/Money Laundering Regulations/i)).toBeInTheDocument();
      expect(screen.getByText(/© 2026 AURA Real Estate/i)).toBeInTheDocument();
    });
  });
});
