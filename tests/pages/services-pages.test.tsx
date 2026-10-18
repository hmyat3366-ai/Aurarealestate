import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FavoritesProvider } from "@/context/FavoritesContext";
import HomePage from "@/app/page";
import ServicesPage from "@/app/services/page";
import ResidentialSalesPage from "@/app/services/residential-sales/page";
import LettingsManagementPage from "@/app/services/lettings-management/page";
import PrivateOfficePage from "@/app/services/private-office/page";
import DevelopmentAdvisoryPage from "@/app/services/development-advisory/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Services & Advisory Navigation & Dedicated Pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("HomePage Services & Advisory Section", () => {
    it("renders all 4 service practice cards as fully clickable links with dedicated routes", () => {
      render(
        <FavoritesProvider>
          <HomePage />
        </FavoritesProvider>
      );

      // Section Heading
      expect(
        screen.getByRole("heading", { name: /services & advisory/i })
      ).toBeInTheDocument();

      // Explore all services header link
      const exploreAllLink = screen.getByRole("link", { name: /explore all services/i });
      expect(exploreAllLink).toHaveAttribute("href", "/services");

      // Verify the 4 cards are links with correct destinations
      const salesCard = screen.getByRole("link", { name: /residential sales/i });
      expect(salesCard).toHaveAttribute("href", "/services/residential-sales");

      const lettingsCard = screen.getByRole("link", { name: /lettings & management/i });
      expect(lettingsCard).toHaveAttribute("href", "/services/lettings-management");

      const privateOfficeCard = screen.getByRole("link", { name: /private office & acquisitions/i });
      expect(privateOfficeCard).toHaveAttribute("href", "/services/private-office");

      const developmentCard = screen.getByRole("link", { name: /development advisory/i });
      expect(developmentCard).toHaveAttribute("href", "/services/development-advisory");
    });

    it("does not nest any anchor or button tags inside the card links", () => {
      const { container } = render(
        <FavoritesProvider>
          <HomePage />
        </FavoritesProvider>
      );

      // Query the 4 card links
      const cardLinks = container.querySelectorAll('a[href^="/services/"]');
      expect(cardLinks.length).toBe(4);

      // Verify each card link does not contain another <a> or <button>
      cardLinks.forEach((cardLink) => {
        expect(cardLink.querySelectorAll("a").length).toBe(0);
        expect(cardLink.querySelectorAll("button").length).toBe(0);
      });
    });
  });

  describe("Services Overview Hub (/services)", () => {
    it("renders page title, narrative, and all 4 practice pillars with monographs", () => {
      render(
        <FavoritesProvider>
          <ServicesPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /four pillars of disciplined real estate advisory/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByRole("heading", { name: "Residential Sales" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Lettings & Management" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Private Office & Acquisitions" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Development Advisory" })).toBeInTheDocument();

      expect(screen.getByRole("link", { name: /explore sales advisory/i })).toHaveAttribute(
        "href",
        "/services/residential-sales"
      );
      expect(screen.getByRole("link", { name: /explore prime lettings/i })).toHaveAttribute(
        "href",
        "/services/lettings-management"
      );
      expect(screen.getByRole("link", { name: /engage private office/i })).toHaveAttribute(
        "href",
        "/services/private-office"
      );
      expect(screen.getByRole("link", { name: /consult development advisory/i })).toHaveAttribute(
        "href",
        "/services/development-advisory"
      );
    });
  });

  describe("Residential Sales Page (/services/residential-sales)", () => {
    it("renders editorial hero, acquisition pillars, and active sales collection", () => {
      render(
        <FavoritesProvider>
          <ResidentialSalesPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /acquisition counsel for architecturally rare residences/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByRole("link", { name: /view sales portfolio/i })).toHaveAttribute("href", "/buy");
      expect(screen.getByRole("link", { name: /engage sales advisory/i })).toHaveAttribute(
        "href",
        "/contact?subject=Residential%20Sales%20Advisory"
      );

      expect(screen.getByText("Off-Market Intelligence")).toBeInTheDocument();
      expect(screen.getByText("Forensic Due Diligence")).toBeInTheDocument();
      expect(screen.getByText("Fiduciary Price Negotiation")).toBeInTheDocument();
      expect(screen.getByText("Turnkey Post-Settlement Care")).toBeInTheDocument();
    });
  });

  describe("Lettings & Management Page (/services/lettings-management)", () => {
    it("renders editorial hero, stewardship pillars, and active lease collection", () => {
      render(
        <FavoritesProvider>
          <LettingsManagementPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /fiduciary tenancy curation & long-term asset stewardship/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByRole("link", { name: /view rental portfolio/i })).toHaveAttribute("href", "/rent");
      expect(screen.getByRole("link", { name: /instruct asset management/i })).toHaveAttribute(
        "href",
        "/contact?subject=Lettings%20and%20Management"
      );

      expect(screen.getByText("Vetted Corporate Tenancies")).toBeInTheDocument();
      expect(screen.getByText("Curatorial Asset Stewardship")).toBeInTheDocument();
      expect(screen.getByText("Yield & Fiduciary Optimization")).toBeInTheDocument();
      expect(screen.getByText("Comprehensive Compliance")).toBeInTheDocument();
    });
  });

  describe("Private Office Page (/services/private-office)", () => {
    it("renders editorial hero, governance pillars, and tri-city desks", () => {
      render(
        <FavoritesProvider>
          <PrivateOfficePage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /discreet capital placement & sovereign family office advisory/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByRole("link", { name: /engage private office/i })).toHaveAttribute(
        "href",
        "/contact?subject=Private%20Office%20Advisory"
      );

      expect(screen.getByText("Sole Partner Representation")).toBeInTheDocument();
      expect(screen.getByText("Bilateral Non-Disclosure Integrity")).toBeInTheDocument();
      expect(screen.getByText("Cross-Border Portfolio Allocation")).toBeInTheDocument();
      expect(screen.getByText("Unlisted Trophy Asset Access")).toBeInTheDocument();

      expect(screen.getByText("London Desk")).toBeInTheDocument();
      expect(screen.getByText("New York Desk")).toBeInTheDocument();
      expect(screen.getByText("Zurich Desk")).toBeInTheDocument();
    });
  });

  describe("Development Advisory Page (/services/development-advisory)", () => {
    it("renders editorial hero, advisory metrics bar, and development disciplines", () => {
      render(
        <FavoritesProvider>
          <DevelopmentAdvisoryPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /strategic value creation for prime residential schemes/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByRole("link", { name: /initiate development mandate/i })).toHaveAttribute(
        "href",
        "/contact?subject=Development%20Advisory"
      );
      expect(screen.getByRole("link", { name: /request project valuation/i })).toHaveAttribute(
        "href",
        "/sell#valuation-form"
      );

      expect(screen.getByText("Pre-Planning Spatial Optimization")).toBeInTheDocument();
      expect(screen.getByText("Empirical Pricing & Absorption Modeling")).toBeInTheDocument();
      expect(screen.getByText("Curatorial Monograph Marketing")).toBeInTheDocument();
      expect(screen.getByText("Global Client Roadshows & Sales")).toBeInTheDocument();

      expect(screen.getByText("Pipeline Advised")).toBeInTheDocument();
      expect(screen.getByText("Pricing Realization")).toBeInTheDocument();
    });
  });
});
