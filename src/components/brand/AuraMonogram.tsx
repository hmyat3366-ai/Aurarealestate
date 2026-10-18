import React from "react";
import { BRAND_COLORS } from "@/lib/brand-tokens";

export interface AuraMonogramProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  theme?: "bronze" | "charcoal" | "white" | "champagne";
  color?: string;
  className?: string;
  ariaLabel?: string;
}

export const AuraMonogram: React.FC<AuraMonogramProps> = ({
  size = 36,
  theme = "bronze",
  color,
  className = "",
  ariaLabel = "AURA Architectural Monogram",
  ...props
}) => {
  const resolvedColor =
    color ||
    (theme === "charcoal"
      ? BRAND_COLORS.charcoal.DEFAULT
      : theme === "white"
      ? BRAND_COLORS.ivory.DEFAULT
      : theme === "champagne"
      ? BRAND_COLORS.bronze.champagne
      : BRAND_COLORS.bronze.DEFAULT);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={ariaLabel}
      className={`shrink-0 ${className}`}
      {...props}
    >
      <g id="aura-monogram-paths">
        {/* Left Leg: Delicate architectural hairline with flared pedestal foot */}
        <path
          d="M 50 15.5 L 22.8 74 C 20.2 78.8 16.8 81.2 13 82 C 12.2 82.2 12.2 81 13 80.4 C 16.2 79 19.2 76.5 21.6 72.4 L 48.8 15.5 Z"
          fill={resolvedColor}
        />

        {/* Right Leg: Monumental high-contrast pillar with flared pedestal foot */}
        <path
          d="M 48.5 15.5 L 51.5 15.5 L 81 74 C 83.2 78 86.2 80.5 89 81.6 C 89.8 82 89.5 83 88.5 82.8 C 84.5 81.8 81 78.8 78 73 L 53 18.5 Z"
          fill={resolvedColor}
        />

        {/* Vaulted Architectural Arch: Sweeping celestial curve through the structural portal */}
        <path
          d="M 28.5 61.5 C 33 49 42 41.5 50 41.5 C 58.5 41.5 68 49 74.5 59.5 C 79 66.5 84 71 88 71.5 C 88.6 71.5 88.8 70.8 88.2 70.3 C 83.5 67 78.5 61 74 54.5 C 67.5 45 58 38.5 50 38.5 C 41.5 38.5 32.5 46.5 27.5 59.5 C 27.2 60.5 28 62 28.5 61.5 Z"
          fill={resolvedColor}
        />

        {/* Central 4-Point Diamond Star: Architectural focal nexus */}
        <path
          d="M 50 59.5 C 50.2 64.5 51.5 66.2 56.5 66.5 C 51.5 66.8 50.2 68.5 50 73.5 C 49.8 68.5 48.5 66.8 43.5 66.5 C 48.5 66.2 49.8 64.5 50 59.5 Z"
          fill={resolvedColor}
        />
      </g>
    </svg>
  );
};
