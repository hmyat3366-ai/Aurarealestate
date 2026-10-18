/**
 * src/lib/brand-tokens.ts
 * Centralized Brand Tokens for AURA Real Estate
 * Derived directly from official brand identity reference board.
 */

export const BRAND_COLORS = {
  // Primary Charcoal / Near-Black (Dominant ink, inverted backgrounds)
  charcoal: {
    DEFAULT: "#121312",
    pure: "#0D0E0D",
    hover: "#242624",
    surface: "#1C1E1C",
  },

  // Warm Ivory / Alabaster (Primary architectural canvas)
  ivory: {
    DEFAULT: "#F7F5F0",
    canvas: "#FBFBF9",
    warm: "#F5F2EB",
    sand: "#F3F1EC",
    card: "#FFFFFF",
  },

  // Muted Bronze / Champagne Gold (Signature luxury accents & monogram)
  bronze: {
    DEFAULT: "#9E8260", // Muted Bronze from brand reference
    champagne: "#C5A880", // Champagne Gold accent
    heritage: "#78542E", // Deep heritage bronze (WCAG AAA)
    light: "#F4EDE2", // Champagne badge/tint
    hover: "#876D4E",
    monogram: "#A88E6D",
  },

  // Supporting Neutral Grays & Hairlines
  neutral: {
    graphite: "#4A4C48",
    mineral: "#63655E",
    hairline: "#E6E4DE",
    hairlineMedium: "#D5D1C7",
    interactive: "#8E8A80",
    divider: "#C5A880",
  },
} as const;

export const BRAND_TYPOGRAPHY = {
  // Primary Serif: High-contrast architectural editorial display
  serif: {
    family: "var(--font-serif), 'Playfair Display', 'Cormorant Garamond', 'Didot', 'Bodoni MT', Georgia, serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
    },
    tracking: {
      tight: "-0.025em",
      normal: "0em",
      display: "+0.35em", // +350 tracking for AURA wordmark
    },
  },

  // Secondary Sans: Clean architectural uppercase descriptor
  sans: {
    family: "var(--font-sans), 'Montserrat', 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
    },
    tracking: {
      descriptor: "0.28em", // +280 tracking for REAL ESTATE descriptor
      caps: "0.14em",
      extreme: "0.25em",
    },
  },

  // Monospace: Architectural metadata and coordinate tags
  mono: {
    family: "var(--font-mono), 'Space Mono', 'SFMono-Regular', Menlo, monospace",
  },

  // Six-Tier Standard Responsive Viewport Breakpoints
  breakpoints: {
    desktopLarge: { min: 1440, label: "Large Desktop" },
    desktop: { min: 1280, max: 1439, label: "Desktop" },
    laptop: { min: 1024, max: 1279, label: "Small Desktop / Laptop" },
    tablet: { min: 768, max: 1023, label: "Tablet" },
    mobile: { min: 480, max: 767, label: "Mobile" },
    mobileSmall: { min: 360, max: 479, label: "Small Mobile" },
  },

  // Centralized Responsive Semantic Scale Reference Values
  scale: {
    heroH1: {
      clamp: "clamp(2.125rem, 1.35rem + 2.95vw, 4rem)",
      lineHeight: 1.05,
      tracking: "-0.035em",
      weights: { regular: 400, medium: 500, semibold: 600 },
      viewportTargetPx: {
        360: 34,
        390: 36,
        768: 42,
        1024: 48,
        1280: 56,
        1440: 64,
      },
    },
    pageH1: {
      clamp: "clamp(2rem, 1.45rem + 1.85vw, 3.25rem)",
      lineHeight: 1.15,
      tracking: "-0.025em",
      weights: { regular: 400, medium: 500, semibold: 600 },
      viewportTargetPx: {
        360: 32,
        768: 38,
        1280: 48,
        1440: 52,
      },
    },
    sectionH2: {
      clamp: "clamp(1.625rem, 1.25rem + 1.4vw, 2.625rem)",
      lineHeight: 1.20,
      tracking: "-0.02em",
      weights: { regular: 400, medium: 500 },
      viewportTargetPx: {
        360: 26,
        768: 31,
        1280: 38,
        1440: 42,
      },
    },
    sectionH3: {
      clamp: "clamp(1.25rem, 1.05rem + 0.75vw, 1.75rem)",
      lineHeight: 1.30,
      tracking: "-0.015em",
      weights: { medium: 500, semibold: 600 },
      viewportTargetPx: {
        360: 20,
        768: 22,
        1280: 26,
        1440: 28,
      },
    },
    cardTitle: {
      clamp: "clamp(1rem, 0.9rem + 0.35vw, 1.25rem)",
      lineHeight: 1.35,
      tracking: "-0.01em",
      weights: { regular: 400, medium: 500 },
      viewportTargetPx: {
        360: 16,
        768: 18,
        1440: 20,
      },
    },
    propertyPrice: {
      clamp: "clamp(1.0625rem, 0.95rem + 0.5vw, 1.5rem)",
      lineHeight: 1.25,
      tracking: "-0.015em",
      weights: { medium: 500 },
      viewportTargetPx: {
        360: 17,
        768: 19,
        1440: 24,
      },
    },
    bodyLarge: {
      clamp: "clamp(1rem, 0.95rem + 0.2vw, 1.125rem)",
      lineHeight: 1.65,
      tracking: "-0.005em",
      viewportTargetPx: {
        360: 16,
        768: 17,
        1440: 18,
      },
    },
    bodyRegular: {
      size: "1rem", // 16px
      lineHeight: 1.60,
      tracking: "0em",
    },
    bodySmall: {
      size: "0.875rem", // 14px
      lineHeight: 1.50,
      tracking: "+0.005em",
    },
    caption: {
      size: "0.8125rem", // 13px
      lineHeight: 1.40,
      tracking: "+0.02em",
    },
    eyebrow: {
      size: "0.75rem", // 12px
      lineHeight: 1.20,
      tracking: "0.14em",
      textTransform: "uppercase" as const,
    },
    nav: {
      desktop: "0.8125rem", // 13px
      mobile: "1rem", // 16px
      lineHeight: 1.30,
      tracking: "0.08em",
      textTransform: "uppercase" as const,
    },
    button: {
      size: "0.8125rem", // 13px
      lineHeight: 1.30,
      tracking: "0.10em",
      textTransform: "uppercase" as const,
    },
    formLabel: {
      size: "0.8125rem", // 13px
      lineHeight: 1.35,
      tracking: "0.04em",
    },
    formInput: {
      size: "1rem", // 16px minimum (prevents mobile Safari auto-zoom)
      lineHeight: 1.50,
      tracking: "0em",
    },
    helper: {
      size: "0.75rem", // 12px
      lineHeight: 1.40,
    },
  },

  // Reading Width Constraints
  maxWidth: {
    prose: "65ch",
    lead: "60ch",
    heading: "26ch",
  },
} as const;

export const BRAND_LOGO_SIZES = {
  monogram: {
    sm: { width: 24, height: 24 },
    md: { width: 36, height: 36 },
    lg: { width: 48, height: 48 },
    xl: { width: 72, height: 72 },
  },
  horizontal: {
    sm: { width: 140, height: 28 },
    md: { width: 180, height: 36 },
    lg: { width: 220, height: 44 },
  },
  stacked: {
    sm: { width: 120, height: 50 },
    md: { width: 160, height: 68 },
    lg: { width: 220, height: 94 },
  },
  primary: {
    sm: { width: 140, height: 90 },
    md: { width: 180, height: 116 },
    lg: { width: 240, height: 154 },
  },
} as const;

export const BRAND_IDENTITY = {
  name: "AURA Real Estate",
  shortName: "AURA",
  descriptor: "REAL ESTATE",
  legalName: "AURA Real Estate LLP",
  tagline: "Curators of Architectural Pedigree & Historic Provenance",
  domain: "aurarealestate.com",
  establishedYear: 2014,
  pillars: ["PREMIUM", "ARCHITECTURAL", "DISCREET", "TIMELESS"] as const,
} as const;
