import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        agency: {
          50: "#F9FAF9",
          100: "#F3F4F3",
          200: "#E5E7E5",
          300: "#D1D5D2",
          400: "#9CA39E",
          500: "#69726B",
          600: "#4B534D",
          700: "#363C38",
          800: "#242925",
          900: "#141715",
          950: "#0C0E0D",
        },
        accent: {
          50: "#FAF7F2",
          100: "#F4EDE2",
          200: "#E8D9C2",
          300: "#DABFA0",
          400: "#C69F74",
          500: "#A87C4F", // Signature bronze
          600: "#8C633B",
          700: "#6E4C2C",
          800: "#52371F",
          900: "#382414",
        },
        surface: {
          warm: "#FBFBF9",
          canvas: "#FFFFFF",
          card: "#FFFFFF",
          muted: "#F5F5F3",
          dark: "#111413",
          darkcard: "#191E1C",
        },
        border: {
          subtle: "#EAEAE6",
          strong: "#D2D2CC",
          dark: "#262D2A",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Baskerville", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      maxWidth: {
        "8xl": "88rem",
        "content": "1280px",
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'hover': '0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
};

export default config;
