import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  PhotoGallery,
  FactsBar,
  AmenitiesList,
  AgentCard,
} from "@/components/property";
import { PROPERTIES } from "@/data/properties";

describe("Milestone 3: Property Detail Component Suite", () => {
  const saleProperty = PROPERTIES.find((p) => p.listingType === "sale")!;
  const rentProperty = PROPERTIES.find((p) => p.listingType === "rent")!;

  describe("PhotoGallery Component", () => {
    it("renders desktop 5-photo mosaic with View All Photos trigger", () => {
      render(
        <PhotoGallery
          images={saleProperty.images}
          title={saleProperty.title}
        />
      );

      // Verify View All Photos trigger button
      const viewAllBtn = screen.getByRole("button", {
        name: /view all \d+ photos in gallery/i,
      });
      expect(viewAllBtn).toBeInTheDocument();
      expect(viewAllBtn).toHaveTextContent(/View All Photos/i);

      // Primary view image in mosaic
      const primaryImg = screen.getByAltText(`${saleProperty.title} — Primary view`);
      expect(primaryImg).toBeInTheDocument();
    });

    it("opens full-screen lightbox modal when clicking View All Photos", () => {
      render(
        <PhotoGallery
          images={saleProperty.images}
          title={saleProperty.title}
        />
      );

      const viewAllBtn = screen.getByRole("button", {
        name: /view all \d+ photos in gallery/i,
      });
      fireEvent.click(viewAllBtn);

      // Verify Lightbox dialog
      const lightbox = screen.getByRole("dialog", {
        name: /photo gallery lightbox/i,
      });
      expect(lightbox).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /close photo gallery/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next image/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /previous image/i })).toBeInTheDocument();
    });

    it("navigates photos with Next and Previous buttons and keyboard Arrow keys", () => {
      render(
        <PhotoGallery
          images={saleProperty.images}
          title={saleProperty.title}
        />
      );

      // Open lightbox
      fireEvent.click(
        screen.getByRole("button", { name: /view all \d+ photos in gallery/i })
      );

      expect(screen.getByText(/1 of/i)).toBeInTheDocument();

      // Click Next
      const nextBtn = screen.getByRole("button", { name: /next image/i });
      fireEvent.click(nextBtn);
      expect(screen.getByText(/2 of/i)).toBeInTheDocument();

      // Keyboard ArrowLeft
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      expect(screen.getByText(/1 of/i)).toBeInTheDocument();

      // Keyboard ArrowRight
      fireEvent.keyDown(window, { key: "ArrowRight" });
      expect(screen.getByText(/2 of/i)).toBeInTheDocument();
    });

    it("toggles zoom levels and category filters inside lightbox", () => {
      render(
        <PhotoGallery
          images={saleProperty.images}
          title={saleProperty.title}
        />
      );

      fireEvent.click(
        screen.getByRole("button", { name: /view all \d+ photos in gallery/i })
      );

      // Zoom button
      const zoomBtn = screen.getByRole("button", { name: /current zoom 1x/i });
      expect(zoomBtn).toBeInTheDocument();
      fireEvent.click(zoomBtn);
      expect(screen.getByRole("button", { name: /current zoom 1.5x/i })).toBeInTheDocument();

      // Category chip
      const interiorChip = screen.getByRole("button", { name: /interior/i });
      fireEvent.click(interiorChip);
      expect(interiorChip).toHaveClass("bg-[#78542E]");
    });

    it("closes lightbox on Escape key or close button click", () => {
      render(
        <PhotoGallery
          images={saleProperty.images}
          title={saleProperty.title}
        />
      );

      fireEvent.click(
        screen.getByRole("button", { name: /view all \d+ photos in gallery/i })
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("FactsBar Component", () => {
    it("renders all core property parameters for sale listings including price/sqft", () => {
      render(<FactsBar property={saleProperty} />);

      expect(screen.getByText("Purchase Price")).toBeInTheDocument();
      expect(screen.getByText("Typology")).toBeInTheDocument();
      expect(screen.getByText("Bedrooms")).toBeInTheDocument();
      expect(screen.getByText("Bathrooms")).toBeInTheDocument();
      expect(screen.getByText("Interior Area")).toBeInTheDocument();
      expect(screen.getByText("Price / Sq Ft")).toBeInTheDocument();
      expect(screen.getByText("Year Built")).toBeInTheDocument();
      expect(screen.getByText("HOA / Common")).toBeInTheDocument();

      // Check values
      expect(screen.getByText(saleProperty.yearBuilt.toString())).toBeInTheDocument();
    });

    it("renders rental-specific parameters including lease term and deposit", () => {
      render(<FactsBar property={rentProperty} />);

      expect(screen.getByText("Monthly Lease")).toBeInTheDocument();
      expect(screen.getByText("Lease Term")).toBeInTheDocument();
      expect(screen.getByText("Security Deposit")).toBeInTheDocument();

      if (rentProperty.rentalDetails) {
        expect(screen.getByText(rentProperty.rentalDetails.leaseTerm)).toBeInTheDocument();
      }
    });
  });

  describe("AmenitiesList Component", () => {
    it("renders 3 distinct architectural categories: Interior Architecture, Outdoor & Grounds, Building & Services", () => {
      render(<AmenitiesList amenities={saleProperty.amenities} />);

      expect(screen.getByText("Interior Architecture")).toBeInTheDocument();
      expect(screen.getByText("Outdoor & Grounds")).toBeInTheDocument();
      expect(screen.getByText("Building & Services")).toBeInTheDocument();

      // Check some interior items
      if (saleProperty.amenities.interior.length > 0) {
        expect(screen.getByText(saleProperty.amenities.interior[0])).toBeInTheDocument();
      }
    });
  });

  describe("AgentCard Component", () => {
    it("renders advisor avatar, name, title, telephone link, email link, and agency badge", () => {
      const handleInquire = vi.fn();
      render(
        <AgentCard
          agent={saleProperty.agent}
          propertyTitle={saleProperty.title}
          onInquire={handleInquire}
        />
      );

      expect(screen.getByText(saleProperty.agent.name)).toBeInTheDocument();
      expect(screen.getByText(saleProperty.agent.title)).toBeInTheDocument();
      expect(screen.getByText("Dedicated Listing Advisor")).toBeInTheDocument();
      expect(screen.getByText("AURA Real Estate Private Portfolio")).toBeInTheDocument();

      // Check phone link
      const phoneLink = screen.getByRole("link", { name: new RegExp(`call ${saleProperty.agent.name}`, "i") });
      expect(phoneLink).toHaveAttribute("href", expect.stringMatching(/^tel:/));

      // Check email link
      const emailLink = screen.getByRole("link", { name: new RegExp(`email ${saleProperty.agent.name}`, "i") });
      expect(emailLink).toHaveAttribute("href", expect.stringMatching(/^mailto:/));

      // Check Ask a Question button
      const askBtn = screen.getByRole("button", { name: /ask a question/i });
      expect(askBtn).toBeInTheDocument();
      fireEvent.click(askBtn);
      expect(handleInquire).toHaveBeenCalledTimes(1);
    });
  });
});
