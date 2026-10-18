import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BuyPage from "@/app/buy/page";
import RentPage from "@/app/rent/page";
import { FavoritesProvider } from "@/context/FavoritesContext";

describe("Discovery Pages Integration Test Suite", () => {
  describe("Buy Discovery Flow (/buy)", () => {
    it("renders Buy discovery page with editorial header, filter controls, and sale catalog", () => {
      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      // Verify Page Title
      expect(screen.getByText("Curated Residences for Acquisition")).toBeInTheDocument();
      expect(screen.getByText("Acquisitions Portfolio")).toBeInTheDocument();

      // Verify Header and Navigation
      expect(screen.getAllByText("AURA")[0]).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /^buy$/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /^rent$/i })).toBeInTheDocument();

      // Verify Filter Controls
      expect(screen.getByPlaceholderText(/search neighborhood/i)).toBeInTheDocument();
      expect(screen.getByRole("combobox", { name: /minimum price/i })).toBeInTheDocument();
      expect(screen.getByRole("combobox", { name: /maximum price/i })).toBeInTheDocument();

      // Verify 8 Sale residences rendered
      expect(screen.getByText(/Showing/i)).toHaveTextContent("8 residences");
      expect(screen.getByText("The Mercer Cast-Iron Penthouse")).toBeInTheDocument();
      expect(screen.getByText("$7,400,000")).toBeInTheDocument();

      // Verify Footer
      expect(screen.getByText(/14 Berkeley Square, Mayfair, London W1J 6BD/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Equal Housing Opportunity/i).length).toBeGreaterThan(0);
    });

    it("filters sale residences by location search", () => {
      render(
        <FavoritesProvider>
          <BuyPage />
        </FavoritesProvider>
      );

      const searchInput = screen.getByPlaceholderText(/search neighborhood/i);
      fireEvent.change(searchInput, { target: { value: "SoHo" } });
      fireEvent.blur(searchInput);

      // Mercer Cast-Iron Penthouse is in SoHo
      expect(screen.getByText("The Mercer Cast-Iron Penthouse")).toBeInTheDocument();
    });
  });

  describe("Rent Discovery Flow (/rent)", () => {
    it("renders Rent discovery page with lease banner, rental filters, and monthly rates", () => {
      render(
        <FavoritesProvider>
          <RentPage />
        </FavoritesProvider>
      );

      // Verify Page Title
      expect(screen.getByText("Curated Residences for Lease")).toBeInTheDocument();
      expect(screen.getByText("Leasing Portfolio")).toBeInTheDocument();

      // Verify Rental Specific Filters
      expect(screen.getByRole("combobox", { name: /minimum price/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/lease term/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/furnished only/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/pet-friendly/i)).toBeInTheDocument();

      // Verify 8 Rental residences rendered with /mo pricing
      expect(screen.getByText(/Showing/i)).toHaveTextContent("8 residences for lease");
      expect(screen.getByText("The MacDougal Alley Atelier Residence")).toBeInTheDocument();
      expect(screen.getByText(/\$6,500 \/ mo/)).toBeInTheDocument();
    });

    it("toggles rental filters cleanly", () => {
      render(
        <FavoritesProvider>
          <RentPage />
        </FavoritesProvider>
      );

      const furnishedCheckbox = screen.getByLabelText(/furnished only/i);
      expect(furnishedCheckbox).toBeInTheDocument();
      fireEvent.click(furnishedCheckbox);
    });
  });
});
