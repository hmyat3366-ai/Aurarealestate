import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base Architectural Canvas & Surfaces
        canvas: {
          DEFAULT: '#FBFBF9', // Warm Alabaster base canvas
          secondary: '#F3F1EC', // Ivory Sand for filter bars and containers
          card: '#FFFFFF', // Pure White for elevated property cards and dialogs
          dark: '#121312', // Obsidian dark for inverted sections and primary CTA
          'dark-elevated': '#1C1E1C', // Dark elevated surfaces
        },
        // Editorial Palette Aliases
        alabaster: '#FBFBF9',
        ivory: '#F3F1EC',
        obsidian: {
          DEFAULT: '#121312',
          hover: '#282A27',
          elevated: '#1C1E1C',
        },
        graphite: '#4A4C48',
        mineral: '#63655E',

        // Typography Inks with WCAG 2.2 AA Contrast
        ink: {
          primary: '#121312', // 17.97:1 contrast on alabaster (WCAG AAA)
          secondary: '#4A4C48', // 8.38:1 contrast on alabaster (WCAG AAA)
          muted: '#63655E', // 5.70:1 contrast on alabaster (WCAG AA)
          inverse: '#FBFBF9', // High contrast on obsidian (WCAG AAA)
        },

        // Architectural Hairlines & Dividers
        hairline: {
          subtle: '#E6E3DC', // 1px architectural grid lines
          medium: '#D5D1C7', // Structural borders, card borders
          interactive: '#8E8A80', // Form inputs (3.32:1 non-text WCAG AA)
        },
        stone: {
          subtle: '#E6E3DC',
          medium: '#D5D1C7',
          interactive: '#8E8A80',
        },

        // Heritage Bronze Accents
        bronze: {
          DEFAULT: '#78542E', // Heritage Bronze (6.53:1 contrast WCAG AA)
          hover: '#614324',
          light: '#F4EDE2', // Subtle champagne badge background
          champagne: '#C5A880', // Brand reference champagne gold
          muted: '#9E8260', // Brand reference muted bronze
        },

        // Domain Financial & Status Badges
        badge: {
          sale: {
            bg: '#EEF2EE',
            text: '#23362A', // 12.1:1 contrast
          },
          rent: {
            bg: '#EAF0F6',
            text: '#192C3D', // 12.8:1 contrast
          },
          pending: {
            bg: '#F7EFE6',
            text: '#5A3B18', // 9.4:1 contrast
          },
        },
      },

      // Six-Tier Responsive Breakpoints
      screens: {
        xs: '360px',
        mobile: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        'desktop-lg': '1440px',
      },

      // Tripartite Typographic System
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Didot', 'Bodoni MT', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Montserrat', 'Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'Space Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },

      // Fluid Editorial & Semantic Font Scales (Min 360px Viewport to Max 1440px+ Viewport)
      fontSize: {
        // Semantic Responsive System Tokens
        hero: [
          'var(--text-hero, clamp(2.125rem, 1.35rem + 2.95vw, 4rem))',
          { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '400' },
        ],
        'page-title': [
          'var(--text-page-title, clamp(2rem, 1.45rem + 1.85vw, 3.25rem))',
          { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '400' },
        ],
        'section-title': [
          'var(--text-section-title, clamp(1.625rem, 1.25rem + 1.4vw, 2.625rem))',
          { lineHeight: '1.20', letterSpacing: '-0.02em', fontWeight: '400' },
        ],
        'section-h3': [
          'var(--text-section-h3, clamp(1.25rem, 1.05rem + 0.75vw, 1.75rem))',
          { lineHeight: '1.30', letterSpacing: '-0.015em', fontWeight: '500' },
        ],
        'card-title': [
          'var(--text-card-title, clamp(1rem, 0.9rem + 0.35vw, 1.25rem))',
          { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '400' },
        ],
        'property-price': [
          'var(--text-property-price, clamp(1.0625rem, 0.95rem + 0.5vw, 1.5rem))',
          { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '500' },
        ],
        'body-large': [
          'var(--text-body-large, clamp(1rem, 0.95rem + 0.2vw, 1.125rem))',
          { lineHeight: '1.65', letterSpacing: '-0.005em' },
        ],
        'body-regular': [
          'var(--text-body-regular, 1rem)',
          { lineHeight: '1.60', letterSpacing: '0' },
        ],
        'body-small': [
          'var(--text-body-small, 0.875rem)',
          { lineHeight: '1.50', letterSpacing: '+0.005em' },
        ],
        'caption-meta': [
          'var(--text-caption, 0.8125rem)',
          { lineHeight: '1.40', letterSpacing: '+0.02em' },
        ],
        'eyebrow-label': [
          'var(--text-eyebrow, 0.75rem)',
          { lineHeight: '1.20', letterSpacing: '0.14em', fontWeight: '500' },
        ],
        'nav-link': [
          'var(--text-nav, 0.8125rem)',
          { lineHeight: '1.30', letterSpacing: '0.08em', fontWeight: '500' },
        ],
        btn: [
          'var(--text-button, 0.8125rem)',
          { lineHeight: '1.30', letterSpacing: '0.10em', fontWeight: '600' },
        ],
        'form-lbl': [
          'var(--text-form-label, 0.8125rem)',
          { lineHeight: '1.35', letterSpacing: '0.04em', fontWeight: '500' },
        ],
        'form-inp': [
          'var(--text-form-input, 1rem)',
          { lineHeight: '1.50', letterSpacing: '0' },
        ],
        helper: [
          'var(--text-helper, 0.75rem)',
          { lineHeight: '1.40', letterSpacing: '0' },
        ],

        // Existing Typographic Scales (Preserved for 100% Backward Compatibility)
        'display-2xl': [
          'clamp(3.5rem, 6.5vw + 1rem, 7.5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '600' },
        ],
        'display-xl': [
          'clamp(2.75rem, 4.5vw + 1rem, 5.25rem)',
          { lineHeight: '1.00', letterSpacing: '-0.035em', fontWeight: '600' },
        ],
        'heading-1': [
          'clamp(2.25rem, 3.0vw + 0.75rem, 3.75rem)',
          { lineHeight: '1.10', letterSpacing: '-0.025em', fontWeight: '600' },
        ],
        'heading-2': [
          'clamp(1.75rem, 2.0vw + 0.5rem, 2.75rem)',
          { lineHeight: '1.20', letterSpacing: '-0.02em', fontWeight: '500' },
        ],
        'heading-3': [
          'clamp(1.35rem, 1.2vw + 0.5rem, 1.875rem)',
          { lineHeight: '1.30', letterSpacing: '-0.015em', fontWeight: '500' },
        ],
        'heading-4': [
          'clamp(1.125rem, 0.8vw + 0.5rem, 1.375rem)',
          { lineHeight: '1.40', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        'body-lg': [
          'clamp(1.125rem, 0.4vw + 0.95rem, 1.25rem)',
          { lineHeight: '1.65', letterSpacing: '-0.005em' },
        ],
        'body-base': [
          '1rem',
          { lineHeight: '1.60', letterSpacing: '0' },
        ],
        'body-sm': [
          '0.875rem',
          { lineHeight: '1.50', letterSpacing: '+0.005em' },
        ],
        caption: [
          '0.75rem',
          { lineHeight: '1.40', letterSpacing: '+0.02em' },
        ],
        overline: [
          '0.75rem',
          { lineHeight: '1.20', letterSpacing: '0.15em', fontWeight: '600' },
        ],
        'micro-mono': [
          '0.6875rem',
          { lineHeight: '1.20', letterSpacing: '0.18em', fontWeight: '700' },
        ],
      },

      // Custom Letter Spacing (Tracking) Utilities
      letterSpacing: {
        'tight-monumental': '-0.04em',
        'tight-editorial': '-0.025em',
        'tight-heading': '-0.02em',
        'tracked-normal': '0',
        'tracked-caps': '0.08em',
        'tracked-button': '0.10em',
        'tracked-eyebrow': '0.14em',
        'tracked-technical': '0.15em',
        'tracked-extreme': '0.22em',
        'tracked-descriptor': '0.28em',
        'tracked-wordmark': '0.35em',
      },

      // Maximum Reading Line Length (Editorial Readability 60-75ch)
      maxWidth: {
        prose: '65ch',
        lead: '60ch',
        heading: '26ch',
      },

      // Crisp Architectural Radiuses (Zero Bubble Corners)
      borderRadius: {
        none: '0px',
        xs: '2px', // Default for buttons, cards, inputs, filter chips
        sm: '4px', // Modals, flyouts
      },

      // Ambient Diffuse Shadows
      boxShadow: {
        'ambient-sm': '0 2px 12px -2px rgba(18, 19, 18, 0.04)',
        'ambient-md': '0 12px 32px -8px rgba(18, 19, 18, 0.08)',
        'ambient-lg': '0 24px 64px -16px rgba(18, 19, 18, 0.16)',
      },

      // Cinematic Micro-Interaction Easing & Keyframes
      transitionTimingFunction: {
        'editorial-ease': 'cubic-bezier(0.16, 1, 0.3, 1)', // Lusion signature ease-out
      },
      transitionDuration: {
        '700': '700ms',
        '1000': '1000ms',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideUp: 'slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        shimmer: 'shimmer 1.8s infinite linear',
      },
    },
  },
  plugins: [],
};

export default config;
