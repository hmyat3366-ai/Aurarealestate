import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FavoritesProvider } from "@/context/FavoritesContext";
import HomePage from "@/app/page";
import InsightsHubPage from "@/app/insights/page";
import BelgraviaMayfairInsightPage from "@/app/insights/belgravia-mayfair-capital-values/page";
import PenthouseValuationsInsightPage from "@/app/insights/global-super-prime-penthouse-valuations/page";
import RegencyProvenanceInsightPage from "@/app/insights/regency-provenance-listed-heritage-facades/page";
import WealthReportFlagshipPage from "@/app/insights/wealth-report-2026/page";

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

describe("The Wealth Report & Insights Navigation & Dedicated Pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("HomePage Market Intelligence Section", () => {
    it("renders The Wealth Report & Insights section with dedicated links", () => {
      render(
        <FavoritesProvider>
          <HomePage />
        </FavoritesProvider>
      );

      // Section heading
      expect(
        screen.getByRole("heading", { name: /the wealth report & insights/i })
      ).toBeInTheDocument();

      // Explore Research Archive link in header
      const archiveLink = screen.getByRole("link", { name: /explore research archive/i });
      expect(archiveLink).toHaveAttribute("href", "/insights");

      // Flagship publication card CTAs
      const downloadSummaryLink = screen.getByRole("link", { name: /download executive summary/i });
      expect(downloadSummaryLink).toHaveAttribute("href", "/insights/wealth-report-2026");

      const exploreAllResearchLink = screen.getByRole("link", { name: /explore all research/i });
      expect(exploreAllResearchLink).toHaveAttribute("href", "/insights");

      // Verify the 3 stacked research feed links
      const belgraviaLink = screen.getByRole("link", {
        name: /pcl capital values & yield trajectories in belgravia & mayfair/i,
      });
      expect(belgraviaLink).toHaveAttribute("href", "/insights/belgravia-mayfair-capital-values");

      const penthouseLink = screen.getByRole("link", {
        name: /the global super-prime frontier: penthouse valuations/i,
      });
      expect(penthouseLink).toHaveAttribute("href", "/insights/global-super-prime-penthouse-valuations");

      const regencyLink = screen.getByRole("link", {
        name: /regency provenance: why listed heritage facades command a 28% value premium/i,
      });
      expect(regencyLink).toHaveAttribute("href", "/insights/regency-provenance-listed-heritage-facades");
    });
  });

  describe("Insights Overview Hub (/insights)", () => {
    it("renders page title, flagship report card, and all 3 insight monographs", () => {
      render(
        <FavoritesProvider>
          <InsightsHubPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /the wealth report & market insights/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("heading", {
          name: /the wealth report: global super-prime & heritage real estate dynamics/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByRole("link", { name: /read full report/i })).toHaveAttribute(
        "href",
        "/insights/wealth-report-2026"
      );

      expect(
        screen.getByRole("heading", {
          name: /pcl capital values & yield trajectories in belgravia & mayfair/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("heading", {
          name: /the global super-prime frontier: penthouse valuations across leading financial capitals/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("heading", {
          name: /regency provenance: why listed heritage facades command a 28% value premium/i,
        })
      ).toBeInTheDocument();
    });
  });

  describe("Belgravia & Mayfair Article (/insights/belgravia-mayfair-capital-values)", () => {
    it("renders article headline, data points, narrative, and advisory CTA", () => {
      render(
        <FavoritesProvider>
          <BelgraviaMayfairInsightPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /pcl capital values & yield trajectories in belgravia & mayfair/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByText("Average Value Benchmark")).toBeInTheDocument();
      expect(screen.getByText("£2,450 / sq ft")).toBeInTheDocument();
      expect(screen.getByText("Prime Gross Yield")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /consult london desk/i })).toHaveAttribute(
        "href",
        "/contact?subject=PCL%20Market%20Advisory"
      );
    });
  });

  describe("Penthouse Valuations Article (/insights/global-super-prime-penthouse-valuations)", () => {
    it("renders article headline, data points, narrative, and private office CTA", () => {
      render(
        <FavoritesProvider>
          <PenthouseValuationsInsightPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /the global super-prime frontier: penthouse valuations across leading financial capitals/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByText("London £10M+ Volume")).toBeInTheDocument();
      expect(screen.getByText("£1.85B")).toBeInTheDocument();
      expect(screen.getByText("Manhattan $15M+ Volume")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /engage private office/i })).toHaveAttribute(
        "href",
        "/contact?subject=Super-Prime%20Penthouse%20Advisory"
      );
    });
  });

  describe("Regency Provenance Article (/insights/regency-provenance-listed-heritage-facades)", () => {
    it("renders article headline, data points, narrative, and valuation CTA", () => {
      render(
        <FavoritesProvider>
          <RegencyProvenanceInsightPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /regency provenance: why listed heritage facades command a 28% value premium/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByText("Listed Building Premium")).toBeInTheDocument();
      expect(screen.getByText("+28.4%")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /request heritage appraisal/i })).toHaveAttribute(
        "href",
        "/sell#valuation-form"
      );
    });
  });

  describe("Wealth Report Flagship Page (/insights/wealth-report-2026)", () => {
    it("renders flagship publication headline, chapters, and executive monograph request", () => {
      render(
        <FavoritesProvider>
          <WealthReportFlagshipPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /the wealth report: global super-prime & heritage real estate dynamics/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByText("Chapter 01")).toBeInTheDocument();
      expect(screen.getByText("Global Macroeconomic Wealth Allocations")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /request monograph dispatch/i })).toHaveAttribute(
        "href",
        "/contact?subject=The%20Wealth%20Report%202026%20Download"
      );
    });
  });
});
