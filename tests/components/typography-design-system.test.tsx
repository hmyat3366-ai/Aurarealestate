import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { BRAND_TYPOGRAPHY } from "@/lib/brand-tokens";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

describe("AURA Real Estate Responsive Typography Design System", () => {
  describe("Brand Typography Tokens & Font Hierarchy", () => {
    it("preserves authoritative brand serif, sans, and monospace typefaces", () => {
      expect(BRAND_TYPOGRAPHY.serif.family).toContain("Playfair Display");
      expect(BRAND_TYPOGRAPHY.sans.family).toContain("Montserrat");
      expect(BRAND_TYPOGRAPHY.mono.family).toContain("Space Mono");
    });

    it("defines 6 standard responsive viewport breakpoint tiers", () => {
      expect(BRAND_TYPOGRAPHY.breakpoints).toBeDefined();
      expect(BRAND_TYPOGRAPHY.breakpoints.desktopLarge.min).toBe(1440);
      expect(BRAND_TYPOGRAPHY.breakpoints.desktop.min).toBe(1280);
      expect(BRAND_TYPOGRAPHY.breakpoints.laptop.min).toBe(1024);
      expect(BRAND_TYPOGRAPHY.breakpoints.tablet.min).toBe(768);
      expect(BRAND_TYPOGRAPHY.breakpoints.mobile.min).toBe(480);
      expect(BRAND_TYPOGRAPHY.breakpoints.mobileSmall.min).toBe(360);
    });

    it("defines complete typography scale hierarchy from hero to helper", () => {
      const scale = BRAND_TYPOGRAPHY.scale;
      expect(scale.heroH1).toBeDefined();
      expect(scale.pageH1).toBeDefined();
      expect(scale.sectionH2).toBeDefined();
      expect(scale.sectionH3).toBeDefined();
      expect(scale.propertyPrice).toBeDefined();
      expect(scale.cardTitle).toBeDefined();
      expect(scale.bodyLarge).toBeDefined();
      expect(scale.bodyRegular).toBeDefined();
      expect(scale.bodySmall).toBeDefined();
      expect(scale.caption).toBeDefined();
      expect(scale.eyebrow).toBeDefined();
    });

    it("verifies hero H1 fluid clamp bounds match specification (34px - 64px)", () => {
      const hero = BRAND_TYPOGRAPHY.scale.heroH1;
      expect(hero.viewportTargetPx[360]).toBe(34);
      expect(hero.viewportTargetPx[390]).toBe(36);
      expect(hero.viewportTargetPx[768]).toBe(42);
      expect(hero.viewportTargetPx[1024]).toBe(48);
      expect(hero.viewportTargetPx[1280]).toBe(56);
      expect(hero.viewportTargetPx[1440]).toBe(64);
      expect(hero.clamp).toContain("clamp(2.125rem");
      expect(hero.lineHeight).toBe(1.05);
    });

    it("verifies standard page H1 fluid clamp bounds match specification (32px - 52px)", () => {
      const pageH1 = BRAND_TYPOGRAPHY.scale.pageH1;
      expect(pageH1.viewportTargetPx[360]).toBe(32);
      expect(pageH1.viewportTargetPx[768]).toBe(38);
      expect(pageH1.viewportTargetPx[1280]).toBe(48);
      expect(pageH1.viewportTargetPx[1440]).toBe(52);
      expect(pageH1.clamp).toContain("clamp(2rem");
      expect(pageH1.lineHeight).toBe(1.15);
    });

    it("verifies section H2 fluid clamp bounds match specification (26px - 42px)", () => {
      const h2 = BRAND_TYPOGRAPHY.scale.sectionH2;
      expect(h2.viewportTargetPx[360]).toBe(26);
      expect(h2.viewportTargetPx[768]).toBe(31);
      expect(h2.viewportTargetPx[1280]).toBe(38);
      expect(h2.viewportTargetPx[1440]).toBe(42);
      expect(h2.clamp).toContain("clamp(1.625rem");
      expect(h2.lineHeight).toBe(1.20);
    });

    it("verifies section H3 fluid clamp bounds match specification (20px - 28px)", () => {
      const h3 = BRAND_TYPOGRAPHY.scale.sectionH3;
      expect(h3.viewportTargetPx[360]).toBe(20);
      expect(h3.viewportTargetPx[768]).toBe(22);
      expect(h3.viewportTargetPx[1280]).toBe(26);
      expect(h3.viewportTargetPx[1440]).toBe(28);
      expect(h3.clamp).toContain("clamp(1.25rem");
      expect(h3.lineHeight).toBe(1.30);
    });

    it("verifies property card title fluid clamp bounds (16px - 20px)", () => {
      const cardTitle = BRAND_TYPOGRAPHY.scale.cardTitle;
      expect(cardTitle.viewportTargetPx[360]).toBe(16);
      expect(cardTitle.viewportTargetPx[768]).toBe(18);
      expect(cardTitle.viewportTargetPx[1440]).toBe(20);
      expect(cardTitle.lineHeight).toBe(1.35);
    });
  });

  describe("Form Input Accessibility & iOS Safari Auto-Zoom Prevention", () => {
    it("ensures Input component renders with at least 16px (text-base) font-size", () => {
      render(
        <Input
          label="Client Full Name"
          name="fullName"
          placeholder="e.g. Eleanor Sterling"
        />
      );

      const input = screen.getByPlaceholderText("e.g. Eleanor Sterling");
      expect(input.className).toContain("text-base");
      expect(input.className).toContain("font-sans");
    });

    it("ensures Select component trigger renders with at least 16px (text-base) font-size", () => {
      render(
        <Select
          label="Architectural Typology"
          options={[
            { label: "Stucco Townhouse", value: "townhouse" },
            { label: "Cast-Iron Loft", value: "loft" },
          ]}
          value="townhouse"
          onChange={() => {}}
        />
      );

      const button = screen.getByRole("combobox", { name: /architectural typology/i });
      expect(button.className).toContain("text-base");
      expect(button.className).toContain("font-sans");
    });
  });

  describe("CSS Variables & Tailwind Config Integration", () => {
    it("verifies globals.css defines fluid CSS typography tokens and utility classes", () => {
      const globalsCssPath = path.resolve(process.cwd(), "src/app/globals.css");
      const globalsCss = fs.readFileSync(globalsCssPath, "utf-8");

      expect(globalsCss).toContain("--text-hero:");
      expect(globalsCss).toContain("--text-page-title:");
      expect(globalsCss).toContain("--text-section-title:");
      expect(globalsCss).toContain("--text-section-h3:");
      expect(globalsCss).toContain("--text-card-title:");
      expect(globalsCss).toContain("--text-property-price:");
      expect(globalsCss).toContain("--text-body-large:");
      expect(globalsCss).toContain("--text-body-regular:");
      expect(globalsCss).toContain("--text-body-small:");
      expect(globalsCss).toContain("--text-caption:");
      expect(globalsCss).toContain("--text-eyebrow:");
      expect(globalsCss).toContain("--text-nav:");
      expect(globalsCss).toContain("--text-button:");
      expect(globalsCss).toContain("--text-form-label:");
      expect(globalsCss).toContain("--text-form-input:");
      expect(globalsCss).toContain("--text-helper:");

      // Line heights and tracking
      expect(globalsCss).toContain("--tracking-display-wordmark:");
      expect(globalsCss).toContain("--tracking-descriptor:");
      expect(globalsCss).toContain("--tracking-eyebrow:");

      // Utility classes
      expect(globalsCss).toContain(".type-hero");
      expect(globalsCss).toContain(".type-page-title");
      expect(globalsCss).toContain(".type-section-title");
      expect(globalsCss).toContain(".type-section-h3");
      expect(globalsCss).toContain(".type-card-title");
    });

    it("verifies tailwind.config.ts configures 6-tier responsive screens and semantic fontSize tokens", () => {
      const tailwindConfigPath = path.resolve(process.cwd(), "tailwind.config.ts");
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, "utf-8");

      expect(tailwindConfig).toContain("xs: '360px'");
      expect(tailwindConfig).toContain("mobile: '480px'");
      expect(tailwindConfig).toContain("sm: '640px'");
      expect(tailwindConfig).toContain("md: '768px'");
      expect(tailwindConfig).toContain("lg: '1024px'");
      expect(tailwindConfig).toContain("xl: '1280px'");
      expect(tailwindConfig).toContain("'2xl': '1440px'");

      expect(tailwindConfig).toContain("hero: [");
      expect(tailwindConfig).toContain("'page-title': [");
      expect(tailwindConfig).toContain("'section-title': [");
      expect(tailwindConfig).toContain("'section-h3': [");
      expect(tailwindConfig).toContain("'card-title': [");
      expect(tailwindConfig).toContain("'property-price': [");
      expect(tailwindConfig).toContain("'body-large': [");
      expect(tailwindConfig).toContain("'body-regular': [");
      expect(tailwindConfig).toContain("'body-small': [");
      expect(tailwindConfig).toContain("'caption-meta': [");
      expect(tailwindConfig).toContain("'eyebrow-label': [");
      expect(tailwindConfig).toContain("'nav-link': [");
      expect(tailwindConfig).toContain("btn: [");
      expect(tailwindConfig).toContain("'form-lbl': [");
      expect(tailwindConfig).toContain("'form-inp': [");
      expect(tailwindConfig).toContain("helper: [");

      // Reading width constraints
      expect(tailwindConfig).toContain("prose: '65ch'");
      expect(tailwindConfig).toContain("lead: '60ch'");
      expect(tailwindConfig).toContain("heading: '26ch'");
    });

    it("verifies figma-tokens.json synchronizes with the responsive typography scale", () => {
      const figmaTokensPath = path.resolve(process.cwd(), "figma-tokens.json");
      const figmaTokens = JSON.parse(fs.readFileSync(figmaTokensPath, "utf-8"));

      expect(figmaTokens.fontFamilies).toBeDefined();
      expect(figmaTokens.fontSize).toBeDefined();
      expect(figmaTokens.fontSize["hero-h1"].value).toContain("clamp(34px");
      expect(figmaTokens.fontSize["page-h1"].value).toContain("clamp(32px");
      expect(figmaTokens.fontSize["section-h2"].value).toContain("clamp(26px");
      expect(figmaTokens.fontSize["property-price"].value).toContain("clamp(17px");
      expect(figmaTokens.letterSpacing.wordmark.value).toBe("0.35em");
      expect(figmaTokens.letterSpacing.descriptor.value).toBe("0.28em");
    });
  });
});
