import React from "react";
import { BRAND_COLORS, BRAND_IDENTITY } from "@/lib/brand-tokens";

export type AuraLogoVariant = "horizontal" | "stacked" | "primary" | "monogram" | "wordmark";
export type AuraLogoTheme = "light" | "dark" | "monochrome" | "bronze";

export interface AuraLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AuraLogoVariant;
  theme?: AuraLogoTheme;
  align?: "left" | "center";
  className?: string;
  ariaLabel?: string;
  height?: number | string;
  width?: number | string;
}

export const AuraLogo: React.FC<AuraLogoProps> = ({
  variant = "horizontal",
  theme = "light",
  align = "center",
  className = "",
  ariaLabel = BRAND_IDENTITY.name,
  height,
  width,
  ...props
}) => {
  const isDark = theme === "dark";
  const isMonochrome = theme === "monochrome";
  const isBronze = theme === "bronze";

  const monogramColor = isMonochrome
    ? isDark
      ? "#FFFFFF"
      : "#121312"
    : isDark
    ? BRAND_COLORS.bronze.champagne
    : BRAND_COLORS.bronze.DEFAULT;

  const wordmarkColor = isMonochrome
    ? isDark
      ? "#FFFFFF"
      : "#121312"
    : isBronze
    ? BRAND_COLORS.bronze.DEFAULT
    : isDark
    ? BRAND_COLORS.ivory.DEFAULT
    : BRAND_COLORS.charcoal.DEFAULT;

  const dividerColor = isDark ? "#4A4C48" : BRAND_COLORS.bronze.champagne;
  const descriptorColor = isDark ? BRAND_COLORS.bronze.champagne : BRAND_COLORS.bronze.DEFAULT;

  // 1. Monogram Variant
  if (variant === "monogram") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width={width || height || 36}
          height={height || width || 36}
          fill="none"
          role="img"
          aria-label={ariaLabel}
          className="shrink-0"
        >
          <g id="aura-monogram">
            {/* Left Leg: Delicate architectural hairline with flared pedestal foot */}
            <path
              d="M 50 15.5 L 22.8 74 C 20.2 78.8 16.8 81.2 13 82 C 12.2 82.2 12.2 81 13 80.4 C 16.2 79 19.2 76.5 21.6 72.4 L 48.8 15.5 Z"
              fill={monogramColor}
            />
            {/* Right Leg: Monumental high-contrast pillar with flared pedestal foot */}
            <path
              d="M 48.5 15.5 L 51.5 15.5 L 81 74 C 83.2 78 86.2 80.5 89 81.6 C 89.8 82 89.5 83 88.5 82.8 C 84.5 81.8 81 78.8 78 73 L 53 18.5 Z"
              fill={monogramColor}
            />
            {/* Vaulted Architectural Arch */}
            <path
              d="M 28.5 61.5 C 33 49 42 41.5 50 41.5 C 58.5 41.5 68 49 74.5 59.5 C 79 66.5 84 71 88 71.5 C 88.6 71.5 88.8 70.8 88.2 70.3 C 83.5 67 78.5 61 74 54.5 C 67.5 45 58 38.5 50 38.5 C 41.5 38.5 32.5 46.5 27.5 59.5 C 27.2 60.5 28 62 28.5 61.5 Z"
              fill={monogramColor}
            />
            {/* Central 4-Point Diamond Star */}
            <path
              d="M 50 59.5 C 50.2 64.5 51.5 66.2 56.5 66.5 C 51.5 66.8 50.2 68.5 50 73.5 C 49.8 68.5 48.5 66.8 43.5 66.5 C 48.5 66.2 49.8 64.5 50 59.5 Z"
              fill={monogramColor}
            />
          </g>
        </svg>
      </div>
    );
  }

  // 2. Horizontal Variant (Header signature lockup: AURA | REAL ESTATE)
  if (variant === "horizontal") {
    return (
      <div
        className={`inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 shrink-0 ${className}`}
        role="img"
        aria-label={ariaLabel}
        {...props}
      >
        {/* AURA Wordmark with responsive scaling */}
        <span
          className="font-serif text-xl sm:text-2xl md:text-[28px] tracking-[0.18em] sm:tracking-[0.22em] font-normal leading-none select-none transition-colors duration-200"
          style={{ color: wordmarkColor }}
        >
          AURA
        </span>

        {/* Architectural Hairline Divider */}
        <span
          className="w-[1px] h-3.5 sm:h-4 md:h-5 shrink-0 transition-colors duration-200"
          style={{ backgroundColor: dividerColor }}
          aria-hidden="true"
        />

        {/* REAL ESTATE Descriptor with responsive scaling */}
        <span
          className="font-sans text-[7.5px] sm:text-[8.5px] md:text-[9.5px] uppercase tracking-[0.24em] sm:tracking-[0.32em] font-medium leading-none select-none whitespace-nowrap transition-colors duration-200"
          style={{ color: descriptorColor }}
        >
          REAL ESTATE
        </span>
      </div>
    );
  }

  // 3. Stacked Variant (Wordmark centered or left-aligned over REAL ESTATE)
  if (variant === "stacked") {
    return (
      <div
        className={`inline-flex flex-col shrink-0 ${
          align === "left" ? "items-start text-left" : "items-center justify-center text-center"
        } ${className}`}
        role="img"
        aria-label={ariaLabel}
        {...props}
      >
        <span
          className="font-serif text-3xl sm:text-4xl tracking-[0.24em] font-normal leading-none select-none"
          style={{ color: wordmarkColor }}
        >
          AURA
        </span>
        <span
          className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.34em] font-medium leading-none mt-2 select-none"
          style={{ color: descriptorColor }}
        >
          REAL ESTATE
        </span>
      </div>
    );
  }

  // 4. Wordmark Variant (Wordmark only without descriptor or monogram)
  if (variant === "wordmark") {
    return (
      <div
        className={`inline-flex shrink-0 ${
          align === "left" ? "items-start text-left" : "items-center justify-center text-center"
        } ${className}`}
        role="img"
        aria-label={ariaLabel}
        {...props}
      >
        <span
          className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-[0.24em] font-normal leading-none select-none"
          style={{ color: wordmarkColor }}
        >
          AURA
        </span>
      </div>
    );
  }

  // 4. Primary Variant: Monogram Symbol + AURA Wordmark + REAL ESTATE Descriptor (Complete Lockup)
  return (
    <div
      className={`inline-flex flex-col shrink-0 ${
        align === "left" ? "items-start text-left" : "items-center justify-center text-center"
      } ${className}`}
      role="img"
      aria-label={ariaLabel}
      {...props}
    >
      {/* Monogram Symbol */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={height ? (typeof height === "number" ? height * 0.5 : "48px") : 48}
        height={height ? (typeof height === "number" ? height * 0.5 : "48px") : 48}
        fill="none"
        aria-hidden="true"
        className="mb-2 shrink-0"
      >
        <g id="aura-monogram-primary">
          <path
            d="M 50 15.5 L 22.8 74 C 20.2 78.8 16.8 81.2 13 82 C 12.2 82.2 12.2 81 13 80.4 C 16.2 79 19.2 76.5 21.6 72.4 L 48.8 15.5 Z"
            fill={monogramColor}
          />
          <path
            d="M 48.5 15.5 L 51.5 15.5 L 81 74 C 83.2 78 86.2 80.5 89 81.6 C 89.8 82 89.5 83 88.5 82.8 C 84.5 81.8 81 78.8 78 73 L 53 18.5 Z"
            fill={monogramColor}
          />
          <path
            d="M 28.5 61.5 C 33 49 42 41.5 50 41.5 C 58.5 41.5 68 49 74.5 59.5 C 79 66.5 84 71 88 71.5 C 88.6 71.5 88.8 70.8 88.2 70.3 C 83.5 67 78.5 61 74 54.5 C 67.5 45 58 38.5 50 38.5 C 41.5 38.5 32.5 46.5 27.5 59.5 C 27.2 60.5 28 62 28.5 61.5 Z"
            fill={monogramColor}
          />
          <path
            d="M 50 59.5 C 50.2 64.5 51.5 66.2 56.5 66.5 C 51.5 66.8 50.2 68.5 50 73.5 C 49.8 68.5 48.5 66.8 43.5 66.5 C 48.5 66.2 49.8 64.5 50 59.5 Z"
            fill={monogramColor}
          />
        </g>
      </svg>

      {/* Wordmark */}
      <span
        className="font-serif text-2xl sm:text-3xl tracking-[0.24em] font-normal leading-none select-none"
        style={{ color: wordmarkColor }}
      >
        AURA
      </span>

      {/* Descriptor */}
      <span
        className="font-sans text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.34em] font-medium leading-none mt-2 select-none"
        style={{ color: descriptorColor }}
      >
        REAL ESTATE
      </span>
    </div>
  );
};
