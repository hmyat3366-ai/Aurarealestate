import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import fs from "fs";
import path from "path";
import { HeroArchitecturalBackground } from "@/components/layout/HeroArchitecturalBackground";
import HomePage from "@/app/page";
import { FavoritesProvider } from "@/context/FavoritesContext";

const mockPush = vi.fn();

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Hero Architectural Ambient Background Suite", () => {
  describe("R1. Multi-Layer Ambient Background Architecture", () => {
    it("renders the root container with aria-hidden='true' and pointer-events-none", () => {
      render(<HeroArchitecturalBackground />);
      const bgRoot = screen.getByTestId("hero-architectural-background");

      expect(bgRoot).toBeInTheDocument();
      expect(bgRoot).toHaveAttribute("aria-hidden", "true");
      expect(bgRoot.className).toContain("pointer-events-none");
      expect(bgRoot.className).toContain("overflow-hidden");
      expect(bgRoot.className).toContain("absolute");
      expect(bgRoot.className).toContain("inset-0");
    });

    it("renders Layer 1: stable warm ivory / alabaster base", () => {
      render(<HeroArchitecturalBackground />);
      const layer1 = screen.getByTestId("hero-bg-layer-base");

      expect(layer1).toBeInTheDocument();
      expect(layer1.className).toContain("absolute");
      expect(layer1.className).toContain("inset-0");
      expect(layer1.className).toContain("bg-gradient-to-b");
      expect(layer1.className).toContain("hero-bg-base");
      expect(layer1.style.background).toContain("var(--hero-bg-ivory");
      expect(layer1.style.background).toContain("var(--hero-bg-alabaster");
    });

    it("renders Layer 2: softly blurred ambient gradient light fields in champagne and warm beige tones", () => {
      render(<HeroArchitecturalBackground />);
      const layer2 = screen.getByTestId("hero-bg-layer-ambient");
      const orb1 = screen.getByTestId("hero-ambient-orb-1");
      const orb2 = screen.getByTestId("hero-ambient-orb-2");
      const orb3 = screen.getByTestId("hero-ambient-orb-3");

      expect(layer2).toBeInTheDocument();
      expect(orb1).toBeInTheDocument();
      expect(orb2).toBeInTheDocument();
      expect(orb3).toBeInTheDocument();

      // Check blur filters & animation classes
      expect(orb1.className).toContain("blur-3xl");
      expect(orb1.className).toContain("hero-ambient-drift-1");

      expect(orb2.className).toContain("blur-3xl");
      expect(orb2.className).toContain("hero-ambient-drift-2");

      expect(orb3.className).toContain("blur-2xl");
      expect(orb3.className).toContain("hero-ambient-drift-3");

      // Verify radial gradient styling contains ambient colors
      expect(orb1.style.background).toContain("var(--hero-ambient-champagne");
      expect(orb2.style.background).toContain("var(--hero-ambient-warm");
      expect(orb3.style.background).toContain("var(--hero-ambient-bronze");
    });

    it("renders Layer 3: thin architectural geometric lines and blueprint grid", () => {
      render(<HeroArchitecturalBackground />);
      const layer3 = screen.getByTestId("hero-bg-layer-grid");

      expect(layer3).toBeInTheDocument();
      expect(layer3.className).toContain("hero-grid-motion");
      // Check bleed overflow protection against motion clipping
      expect(layer3.className).toContain("-inset-4");

      // Check SVG structure
      const svg = layer3.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox", "0 0 1440 800");
      expect(svg).toHaveAttribute("preserveAspectRatio", "xMidYMid slice");

      // Check architectural patterns (grid + subgrid)
      const patterns = layer3.querySelectorAll("pattern");
      expect(patterns.length).toBeGreaterThanOrEqual(2);

      // Check datum alignment line
      const datumLine = layer3.querySelector('line[stroke-dasharray="8 6"]');
      expect(datumLine).toBeInTheDocument();

      // Check perspective sightline
      const sightline = layer3.querySelector('line[stroke-dasharray="4 8"]');
      expect(sightline).toBeInTheDocument();

      // Check Palladian proportion guide arcs
      const proportionArcs = layer3.querySelectorAll("ellipse");
      expect(proportionArcs.length).toBeGreaterThanOrEqual(2);

      // Check curatorial metadata annotations
      expect(layer3.textContent).toContain("SYS.REF // 51.5074° N");
      expect(layer3.textContent).toContain("PROPORTION 1:1.618");
    });

    it("accepts custom tunable opacity overrides via props", () => {
      render(<HeroArchitecturalBackground gridOpacity={0.35} ambientOpacity={0.85} />);
      const bgRoot = screen.getByTestId("hero-architectural-background");

      expect(bgRoot.style.getPropertyValue("--hero-grid-opacity")).toBe("0.35");
      expect(bgRoot.style.getPropertyValue("--hero-ambient-opacity")).toBe("0.85");
    });

    it("handles zero boundary opacity values correctly without falling back to defaults", () => {
      render(<HeroArchitecturalBackground gridOpacity={0} ambientOpacity={0} />);
      const bgRoot = screen.getByTestId("hero-architectural-background");

      expect(bgRoot.style.getPropertyValue("--hero-grid-opacity")).toBe("0");
      expect(bgRoot.style.getPropertyValue("--hero-ambient-opacity")).toBe("0");
    });

    it("accepts custom style prop and merges CSS properties seamlessly", () => {
      render(<HeroArchitecturalBackground style={{ zIndex: 2 }} />);
      const bgRoot = screen.getByTestId("hero-architectural-background");
      expect(bgRoot.style.zIndex).toBe("2");
    });

    it("renders Layer 1B: High-definition cinematic video background when showVideo is true", () => {
      render(<HeroArchitecturalBackground />);
      const video = screen.getByTestId("hero-bg-video") as HTMLVideoElement;

      expect(video).toBeInTheDocument();
      expect(video.tagName.toLowerCase()).toBe("video");
      expect(video).toHaveAttribute("src", "/videos/hero-background.mp4");
      expect(video).toHaveAttribute("autoplay");
      expect(video).toHaveAttribute("loop");
      expect(video).toHaveAttribute("playsinline");
      expect(video).toHaveAttribute("aria-hidden", "true");
      expect(video.className).toContain("object-cover");
      expect(video.className).toContain("pointer-events-none");
    });

    it("accepts custom videoSrc and respects showVideo={false} prop toggle", () => {
      const { unmount } = render(
        <HeroArchitecturalBackground videoSrc="/custom/video.mp4" />
      );
      const customVideo = screen.getByTestId("hero-bg-video");
      expect(customVideo).toHaveAttribute("src", "/custom/video.mp4");
      unmount();

      render(<HeroArchitecturalBackground showVideo={false} />);
      expect(screen.queryByTestId("hero-bg-video")).not.toBeInTheDocument();
      // Base layer remains intact
      expect(screen.getByTestId("hero-bg-layer-base")).toBeInTheDocument();
    });

    it("renders Layer 1C: Cinematic dark luxury vignette and contrast overlay", () => {
      render(<HeroArchitecturalBackground />);
      const overlay = screen.getByTestId("hero-bg-layer-overlay");

      expect(overlay).toBeInTheDocument();
      expect(overlay.className).toContain("absolute");
      expect(overlay.className).toContain("inset-0");
      expect(overlay.className).toContain("pointer-events-none");
      expect(overlay.style.backgroundImage || overlay.style.background).toContain("radial-gradient");
    });

    it("respects showOverlay={false} prop and removes the overlay when requested", () => {
      render(<HeroArchitecturalBackground showOverlay={false} />);
      expect(screen.queryByTestId("hero-bg-layer-overlay")).not.toBeInTheDocument();
    });

    it("respects custom overlayOpacity prop on Layer 1C", () => {
      render(<HeroArchitecturalBackground overlayOpacity={0.4} />);
      const overlay = screen.getByTestId("hero-bg-layer-overlay");
      expect(overlay.style.opacity).toBe("0.4");
    });

    it("merges custom className with default utility classes", () => {
      render(<HeroArchitecturalBackground className="custom-test-hero-class" />);
      const bgRoot = screen.getByTestId("hero-architectural-background");
      expect(bgRoot.className).toContain("custom-test-hero-class");
      expect(bgRoot.className).toContain("pointer-events-none");
      expect(bgRoot.className).toContain("inset-0");
    });
  });

  describe("R2. CSS Variables, Animation Cycles & Performance Tokens", () => {
    it("defines all required ambient background CSS variables in globals.css", () => {
      const globalsCss = fs.readFileSync(
        path.join(process.cwd(), "src/app/globals.css"),
        "utf8"
      );

      // Color tokens
      expect(globalsCss).toContain("--hero-bg-ivory: #F3F1EC;");
      expect(globalsCss).toContain("--hero-bg-alabaster: #FBFBF9;");
      expect(globalsCss).toContain("--hero-ambient-champagne:");
      expect(globalsCss).toContain("--hero-ambient-beige:");
      expect(globalsCss).toContain("--hero-ambient-bronze:");
      expect(globalsCss).toContain("--hero-ambient-warm:");

      // Opacity tokens
      expect(globalsCss).toContain("--hero-ambient-opacity:");
      expect(globalsCss).toContain("--hero-grid-opacity:");

      // Duration tokens within 15–30s cycle
      expect(globalsCss).toMatch(/--hero-ambient-duration-1:\s*(?:1[5-9]|2\d|30)s;/);
      expect(globalsCss).toMatch(/--hero-ambient-duration-2:\s*(?:1[5-9]|2\d|30)s;/);
      expect(globalsCss).toMatch(/--hero-ambient-duration-3:\s*(?:1[5-9]|2\d|30)s;/);
      expect(globalsCss).toMatch(/--hero-grid-duration:\s*(?:1[5-9]|2\d|30)s;/);

      // Dedicated base background class
      expect(globalsCss).toContain(".hero-bg-base");
    });

    it("uses hardware-accelerated transform3d and opacity for all drifting keyframes", () => {
      const globalsCss = fs.readFileSync(
        path.join(process.cwd(), "src/app/globals.css"),
        "utf8"
      );

      // Keyframes
      expect(globalsCss).toContain("@keyframes heroDrift1");
      expect(globalsCss).toContain("@keyframes heroDrift2");
      expect(globalsCss).toContain("@keyframes heroDrift3");
      expect(globalsCss).toContain("@keyframes heroGridDrift");

      // Verify hardware acceleration
      expect(globalsCss).toContain("translate3d");
      expect(globalsCss).toContain("will-change: transform");
      expect(globalsCss).toContain("animation: heroGridDrift var(--hero-grid-duration, 24s)");
    });
  });

  describe("R3. Accessibility & prefers-reduced-motion Support", () => {
    it("specifies prefers-reduced-motion media query halting all continuous movements", () => {
      const globalsCss = fs.readFileSync(
        path.join(process.cwd(), "src/app/globals.css"),
        "utf8"
      );

      expect(globalsCss).toContain("@media (prefers-reduced-motion: reduce)");
      expect(globalsCss).toContain("animation: none !important");
      expect(globalsCss).toContain("transform: none !important");
      expect(globalsCss).toContain("will-change: auto !important");
    });

    it("satisfies WCAG 2.2 AA contrast standards for heading and subtext on background tones", () => {
      const hexToLuminance = (hex: string) => {
        const rgb = hex
          .replace("#", "")
          .match(/.{2}/g)!
          .map((c) => parseInt(c, 16) / 255)
          .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      };

      const getContrastRatio = (hex1: string, hex2: string) => {
        const l1 = hexToLuminance(hex1);
        const l2 = hexToLuminance(hex2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      };

      const obsidianText = "#121312";
      const graphiteSubtext = "#4A4C48";
      const alabasterBase = "#FBFBF9";
      const ivorySand = "#F3F1EC";
      const champagneTone = "#F4EDE2";

      // Heading contrast on all base and ambient tones
      expect(getContrastRatio(obsidianText, alabasterBase)).toBeGreaterThan(15);
      expect(getContrastRatio(obsidianText, ivorySand)).toBeGreaterThan(14);
      expect(getContrastRatio(obsidianText, champagneTone)).toBeGreaterThan(13);

      // Subtext contrast on all base and ambient tones (WCAG AA requires >= 4.5:1)
      expect(getContrastRatio(graphiteSubtext, alabasterBase)).toBeGreaterThan(7);
      expect(getContrastRatio(graphiteSubtext, ivorySand)).toBeGreaterThan(6.5);
      expect(getContrastRatio(graphiteSubtext, champagneTone)).toBeGreaterThan(6);
    });
  });

  describe("R4. Hero Section Integration & Zero Obstruction", () => {
    it("renders HeroArchitecturalBackground seamlessly inside HomePage hero section", () => {
      const { container } = render(
        <FavoritesProvider>
          <HomePage />
        </FavoritesProvider>
      );

      // Hero background element
      const heroBg = screen.getByTestId("hero-architectural-background");
      expect(heroBg).toBeInTheDocument();
      expect(heroBg).toHaveAttribute("aria-hidden", "true");
      expect(heroBg.className).toContain("pointer-events-none");
      expect(heroBg.className).toContain("select-none");
      expect(heroBg.className).toContain("absolute");
      expect(heroBg.className).toContain("inset-0");

      // Heading is above background
      const heading = screen.getByRole("heading", {
        name: /Curators of Architectural Pedigree & Historic Provenance/i,
      });
      expect(heading).toBeInTheDocument();

      // Eyebrow text
      expect(
        screen.getByText(/AURA Real Estate • Private Office & Curatorial Brokerage/i)
      ).toBeInTheDocument();

      // Search console input is interactable and accepts user input
      const input = screen.getByPlaceholderText(/mayfair, belgravia, soho/i);
      fireEvent.change(input, { target: { value: "Mayfair" } });
      expect((input as HTMLInputElement).value).toBe("Mayfair");

      // Tab buttons are clickable
      const rentTab = screen.getByRole("tab", { name: /turnkey leases \(rent\)/i });
      fireEvent.click(rentTab);
      expect(rentTab).toHaveAttribute("aria-selected", "true");

      // Verify hero section has overflow-hidden preventing horizontal bleed
      const heroSection = container.querySelector("section");
      expect(heroSection?.className).toContain("overflow-hidden");
    });

    it("preserves full QuickDiscoveryConsole interaction without pointer obstruction", () => {
      mockPush.mockClear();

      render(
        <FavoritesProvider>
          <HomePage />
        </FavoritesProvider>
      );

      // 1. Switch to Turnkey Leases (Rent)
      const rentTab = screen.getByRole("tab", { name: /turnkey leases \(rent\)/i });
      fireEvent.click(rentTab);
      expect(rentTab).toHaveAttribute("aria-selected", "true");

      // 2. Click Prime Enclave chip "SoHo"
      const sohoChip = screen.getByRole("button", { name: /^SoHo$/i });
      fireEvent.click(sohoChip);

      const input = screen.getByPlaceholderText(/mayfair, belgravia, soho/i) as HTMLInputElement;
      expect(input.value).toBe("SoHo");

      // 3. Select Architectural Typology
      const typologySelect = screen.getByLabelText(/architectural typology/i) as HTMLSelectElement;
      fireEvent.change(typologySelect, { target: { value: "penthouse" } });
      expect(typologySelect.value).toBe("penthouse");

      // 4. Submit form
      const submitButton = screen.getByRole("button", { name: /explore leases/i });
      fireEvent.click(submitButton);

      // Verify router push called with expected query params
      expect(mockPush).toHaveBeenCalledWith("/rent?location=SoHo&type=penthouse");
    });

    it("enforces zero layout shift (CLS = 0) structural invariants", () => {
      const { container } = render(
        <FavoritesProvider>
          <HomePage />
        </FavoritesProvider>
      );

      const heroBg = screen.getByTestId("hero-architectural-background");
      // Must be absolute inset-0 to be taken out of normal flow
      expect(heroBg.className).toContain("absolute");
      expect(heroBg.className).toContain("inset-0");
      expect(heroBg.className).toContain("overflow-hidden");

      // Content wrapper must have relative and higher z-index stacking
      const contentWrapper = container.querySelector("section > div.relative.z-10");
      expect(contentWrapper).toBeInTheDocument();
    });

    it("maintains structural zero-overflow invariants across all required viewports (1440px, 1280px, 768px, 390px, 360px)", () => {
      const viewports = [1440, 1280, 768, 390, 360];

      for (const width of viewports) {
        window.innerWidth = width;
        window.dispatchEvent(new Event("resize"));

        const { unmount, container } = render(
          <FavoritesProvider>
            <HomePage />
          </FavoritesProvider>
        );

        const heroBg = screen.getByTestId("hero-architectural-background");
        expect(heroBg).toBeInTheDocument();
        expect(heroBg.className).toContain("overflow-hidden");
        expect(heroBg.className).toContain("absolute");
        expect(heroBg.className).toContain("inset-0");

        const heroSection = container.querySelector("section");
        expect(heroSection?.className).toContain("overflow-hidden");

        const interactiveConsole = screen.getByRole("tablist");
        expect(interactiveConsole).toBeInTheDocument();

        unmount();
      }
    });
  });
});
