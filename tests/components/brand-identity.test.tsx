import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { AuraLogo, AuraMonogram } from "@/components/brand";
import { BRAND_COLORS, BRAND_IDENTITY, BRAND_TYPOGRAPHY, BRAND_LOGO_SIZES } from "@/lib/brand-tokens";

describe("AURA Real Estate Brand Identity & Assets Suite", () => {
  describe("Brand Design Tokens", () => {
    it("defines authoritative brand identity tokens matching reference board", () => {
      expect(BRAND_IDENTITY.name).toBe("AURA Real Estate");
      expect(BRAND_IDENTITY.shortName).toBe("AURA");
      expect(BRAND_IDENTITY.descriptor).toBe("REAL ESTATE");
      expect(BRAND_IDENTITY.pillars).toEqual(["PREMIUM", "ARCHITECTURAL", "DISCREET", "TIMELESS"]);
    });

    it("defines warm ivory, primary charcoal, and muted bronze color palettes", () => {
      expect(BRAND_COLORS.charcoal.DEFAULT).toBe("#121312");
      expect(BRAND_COLORS.ivory.DEFAULT).toBe("#F7F5F0");
      expect(BRAND_COLORS.bronze.DEFAULT).toBe("#9E8260");
      expect(BRAND_COLORS.bronze.champagne).toBe("#C5A880");
    });

    it("specifies Playfair Display serif and Montserrat sans typography specifications", () => {
      expect(BRAND_TYPOGRAPHY.serif.family).toContain("Playfair Display");
      expect(BRAND_TYPOGRAPHY.sans.family).toContain("Montserrat");
      expect(BRAND_TYPOGRAPHY.serif.tracking.display).toBe("+0.35em");
      expect(BRAND_TYPOGRAPHY.sans.tracking.descriptor).toBe("0.28em");
    });
  });

  describe("AuraMonogram Component", () => {
    it("renders the architectural A monogram with arch and 4-point star", () => {
      const { container } = render(<AuraMonogram size={48} theme="bronze" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox", "0 0 100 100");
      expect(svg).toHaveAttribute("aria-label", "AURA Architectural Monogram");

      // Verify monogram paths (left leg, right pillar, arch, central star)
      const paths = container.querySelectorAll("path");
      expect(paths.length).toBe(4);
    });

    it("supports charcoal, white, champagne, and bronze themes", () => {
      const { container: charcoalContainer } = render(<AuraMonogram theme="charcoal" />);
      expect(charcoalContainer.querySelector("path")?.getAttribute("fill")).toBe(BRAND_COLORS.charcoal.DEFAULT);

      const { container: whiteContainer } = render(<AuraMonogram theme="white" />);
      expect(whiteContainer.querySelector("path")?.getAttribute("fill")).toBe(BRAND_COLORS.ivory.DEFAULT);

      const { container: champagneContainer } = render(<AuraMonogram theme="champagne" />);
      expect(champagneContainer.querySelector("path")?.getAttribute("fill")).toBe(BRAND_COLORS.bronze.champagne);
    });
  });

  describe("AuraLogo Component Variants", () => {
    it("renders horizontal variant (AURA | REAL ESTATE) for header integration", () => {
      render(<AuraLogo variant="horizontal" theme="light" />);
      expect(screen.getByText("AURA")).toBeInTheDocument();
      expect(screen.getByText("REAL ESTATE")).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "AURA Real Estate" })).toBeInTheDocument();
    });

    it("renders stacked variant for centered layouts", () => {
      render(<AuraLogo variant="stacked" theme="light" />);
      expect(screen.getByText("AURA")).toBeInTheDocument();
      expect(screen.getByText("REAL ESTATE")).toBeInTheDocument();
    });

    it("renders primary variant with monogram and wordmark for footer and manifesto", () => {
      const { container } = render(<AuraLogo variant="primary" theme="dark" />);
      expect(screen.getByText("AURA")).toBeInTheDocument();
      expect(screen.getByText("REAL ESTATE")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders monogram variant when variant='monogram'", () => {
      const { container } = render(<AuraLogo variant="monogram" theme="bronze" />);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(screen.queryByText("REAL ESTATE")).not.toBeInTheDocument();
    });

    it("renders wordmark variant without descriptor or monogram when variant='wordmark'", () => {
      const { container } = render(<AuraLogo variant="wordmark" theme="light" />);
      expect(screen.getByText("AURA")).toBeInTheDocument();
      expect(screen.queryByText("REAL ESTATE")).not.toBeInTheDocument();
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });
  });

  describe("Production SVG Asset Verification", () => {
    const requiredAssets = [
      "aura-monogram-bronze.svg",
      "aura-monogram-charcoal.svg",
      "aura-monogram-white.svg",
      "aura-monogram-champagne.svg",
      "aura-favicon.svg",
      "aura-logo-primary-light.svg",
      "aura-logo-primary-dark.svg",
      "aura-logo-primary-monochrome.svg",
      "aura-logo-horizontal-light.svg",
      "aura-logo-horizontal-dark.svg",
      "aura-logo-horizontal-monochrome.svg",
      "aura-logo-stacked-light.svg",
      "aura-logo-stacked-dark.svg",
      "aura-logo-stacked-monochrome.svg",
    ];

    it.each(requiredAssets)("verifies production asset %s exists and contains valid SVG XML", (filename) => {
      const assetPath = path.resolve("public/brand", filename);
      expect(fs.existsSync(assetPath)).toBe(true);

      const content = fs.readFileSync(assetPath, "utf8");
      expect(content).toContain("<svg");
      expect(content).toContain("</svg>");
      expect(content).toContain("xmlns=\"http://www.w3.org/2000/svg\"");
    });

    it("verifies wordmark SVG assets have correct letter kerning without overlapping letterforms", () => {
      const wordmarkAssets = [
        "aura-logo-primary-light.svg",
        "aura-logo-primary-dark.svg",
        "aura-logo-primary-monochrome.svg",
        "aura-logo-horizontal-light.svg",
        "aura-logo-horizontal-dark.svg",
        "aura-logo-horizontal-monochrome.svg",
        "aura-logo-stacked-light.svg",
        "aura-logo-stacked-dark.svg",
        "aura-logo-stacked-monochrome.svg",
      ];

      wordmarkAssets.forEach((filename) => {
        const content = fs.readFileSync(path.resolve("public/brand", filename), "utf8");
        // Ensure Letter 4 is translated past Letter 3 (x=260) and does not overlap (x=205)
        expect(content).toContain('translate(260, 0)');
        expect(content).not.toContain('translate(205, 0)');
      });
    });

    it("verifies favicon and app icon files exist", () => {
      expect(fs.existsSync(path.resolve("public/icon.svg"))).toBe(true);
      expect(fs.existsSync(path.resolve("public/favicon.ico"))).toBe(true);
      expect(fs.existsSync(path.resolve("src/app/icon.svg"))).toBe(true);
      expect(fs.existsSync(path.resolve("src/app/apple-icon.svg"))).toBe(true);
    });
  });
});
