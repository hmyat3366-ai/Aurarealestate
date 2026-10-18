import React from "react";

export interface HeroArchitecturalBackgroundProps {
  className?: string;
  gridOpacity?: number;
  ambientOpacity?: number;
  overlayOpacity?: number;
  showOverlay?: boolean;
  videoSrc?: string;
  showVideo?: boolean;
  style?: React.CSSProperties;
}

/**
 * HeroArchitecturalBackground
 *
 * Implements an editorial multi-layer architectural ambient background for the
 * AURA Real Estate homepage hero section:
 * - Layer 1: Stable warm ivory / alabaster base fallback.
 * - Layer 1B: High-definition cinematic video background (Knight Frank footage).
 * - Layer 1C: Dark luxury vignette & gradient overlay for contrast and WCAG AA legibility.
 * - Layer 2: Softly blurred ambient gradient light fields in champagne and warm beige tones
 *            with slow, continuous organic drift (15–30s cycle).
 * - Layer 3: Thin architectural geometric lines and blueprint grid with low opacity.
 * - Layer 4: Unaltered hero content sits in a higher z-index stacking context.
 *
 * All layers are strictly pointer-events: none, ensuring zero obstruction of clicks,
 * text selection, or search inputs.
 * Supports prefers-reduced-motion: reduce by halting all continuous movement.
 */
export const HeroArchitecturalBackground: React.FC<HeroArchitecturalBackgroundProps> = ({
  className = "",
  gridOpacity,
  ambientOpacity,
  overlayOpacity,
  showOverlay = true,
  videoSrc = "/videos/hero-background.mp4",
  showVideo = true,
  style,
}) => {
  return (
    <div
      aria-hidden="true"
      data-testid="hero-architectural-background"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      style={{
        ...(gridOpacity !== undefined ? ({ "--hero-grid-opacity": String(gridOpacity) } as React.CSSProperties) : {}),
        ...(ambientOpacity !== undefined ? ({ "--hero-ambient-opacity": String(ambientOpacity) } as React.CSSProperties) : {}),
        ...style,
      }}
    >
      {/* LAYER 1: Stable warm ivory / alabaster base */}
      <div
        data-testid="hero-bg-layer-base"
        className="hero-bg-base absolute inset-0 bg-gradient-to-b"
        style={{
          background:
            "linear-gradient(180deg, var(--hero-bg-ivory, #F3F1EC) 0%, var(--hero-bg-alabaster, #FBFBF9) 60%, var(--hero-bg-alabaster, #FBFBF9) 100%)",
        }}
      />

      {/* LAYER 1B: High-Definition Cinematic Ambient Video Background */}
      {showVideo && (
        <video
          data-testid="hero-bg-video"
          className="hero-bg-video absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-100"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          preload="auto"
        />
      )}

      {/* LAYER 1C: Cinematic Dark Luxury Vignette & Contrast Overlay */}
      {showOverlay && (
        <div
          data-testid="hero-bg-layer-overlay"
          className="hero-bg-overlay absolute inset-0 pointer-events-none"
          style={{
            ...(overlayOpacity !== undefined ? { opacity: overlayOpacity } : {}),
            backgroundImage:
              "radial-gradient(circle at 50% 40%, rgba(18, 19, 18, 0.45) 0%, rgba(18, 19, 18, 0.75) 60%, rgba(10, 11, 10, 0.95) 100%)",
          }}
        />
      )}

      {/* LAYER 2: Softly blurred ambient gradient light fields in champagne & warm beige tones */}
      <div
        data-testid="hero-bg-layer-ambient"
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: "var(--hero-ambient-opacity, 0.7)" }}
      >
        {/* Orb 1: Upper-right champagne & warm beige drifting field */}
        <div
          data-testid="hero-ambient-orb-1"
          className="hero-ambient-drift-1 absolute -top-24 -right-16 w-3/5 h-[85%] rounded-full blur-3xl opacity-80"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, var(--hero-ambient-champagne, rgba(244, 237, 226, 0.75)) 0%, var(--hero-ambient-beige, rgba(234, 228, 217, 0.65)) 55%, transparent 75%)",
          }}
        />

        {/* Orb 2: Mid-left warm ivory & alabaster drifting field */}
        <div
          data-testid="hero-ambient-orb-2"
          className="hero-ambient-drift-2 absolute top-1/4 -left-20 w-1/2 h-[75%] rounded-full blur-3xl opacity-70"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--hero-ambient-warm, rgba(248, 245, 240, 0.9)) 0%, var(--hero-ambient-beige, rgba(234, 228, 217, 0.55)) 50%, transparent 75%)",
          }}
        />

        {/* Orb 3: Lower-center heritage bronze & champagne warmth */}
        <div
          data-testid="hero-ambient-orb-3"
          className="hero-ambient-drift-3 absolute -bottom-16 right-1/4 w-2/5 h-3/5 rounded-full blur-2xl opacity-60"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--hero-ambient-bronze, rgba(213, 196, 177, 0.35)) 0%, var(--hero-ambient-champagne, rgba(244, 237, 226, 0.5)) 45%, transparent 70%)",
          }}
        />
      </div>

      {/* LAYER 3: Thin architectural geometric lines & blueprint grid with edge-bleed protection */}
      <div
        data-testid="hero-bg-layer-grid"
        className="hero-grid-motion absolute -inset-4 text-[var(--hero-grid-stroke,#78542E)]"
        style={{ opacity: "var(--hero-grid-opacity, 0.18)" }}
      >
        <svg
          className="w-full h-full"
          width="100%"
          height="100%"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Primary architectural grid pattern */}
            <pattern
              id="hero-arch-grid-pattern"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              {/* Orthogonal hairline grid */}
              <path
                d="M 80 0 L 0 0 L 0 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeOpacity="0.5"
              />
              {/* Corner intersection registration dot */}
              <circle cx="0" cy="0" r="1" fill="currentColor" fillOpacity="0.75" />
            </pattern>

            {/* Finer technical subdivision pattern */}
            <pattern
              id="hero-arch-subgrid-pattern"
              width="240"
              height="240"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="240"
                height="240"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.35"
              />
              {/* Central crosshair in 240px module */}
              <path
                d="M 114 120 L 126 120 M 120 114 L 120 126"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeOpacity="0.6"
              />
            </pattern>
          </defs>

          {/* Base Grid Fill */}
          <rect width="100%" height="100%" fill="url(#hero-arch-grid-pattern)" />
          <rect width="100%" height="100%" fill="url(#hero-arch-subgrid-pattern)" />

          {/* Architectural Elevation & Proportion Guides */}
          {/* Horizontal Datum Alignment Line */}
          <line
            x1="0"
            y1="540"
            x2="1440"
            y2="540"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="8 6"
            strokeOpacity="0.6"
          />

          {/* Diagonal Architectural Sightline / Ray */}
          <line
            x1="120"
            y1="0"
            x2="1320"
            y2="800"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="4 8"
            strokeOpacity="0.4"
          />

          {/* Palladian Curatorial Proportion Arcs in upper right background */}
          <ellipse
            cx="1180"
            cy="220"
            rx="220"
            ry="220"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="4 6"
            strokeOpacity="0.5"
          />
          <ellipse
            cx="1180"
            cy="220"
            rx="360"
            ry="360"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2 6"
            strokeOpacity="0.3"
          />

          {/* Architectural Corner Registration Marks */}
          <g stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.6">
            {/* Top Left Registration */}
            <path d="M 40 28 L 40 52 M 28 40 L 52 40" />
            {/* Top Right Registration */}
            <path d="M 1400 28 L 1400 52 M 1388 40 L 1412 40" />
            {/* Bottom Datum Elevation Tick Marks */}
            <line x1="360" y1="532" x2="360" y2="548" />
            <line x1="720" y1="532" x2="720" y2="548" />
            <line x1="1080" y1="532" x2="1080" y2="548" />
          </g>

          {/* Subtle Curatorial Architectural Coordinates (Technical Metadata) */}
          <text
            x="40"
            y="76"
            fill="currentColor"
            fontSize="9"
            letterSpacing="0.2em"
            fontFamily="var(--font-mono), monospace"
            fillOpacity="0.55"
          >
            SYS.REF // 51.5074° N, 0.1278° W • 40.7128° N, 74.0060° W
          </text>
          <text
            x="40"
            y="92"
            fill="currentColor"
            fontSize="8"
            letterSpacing="0.22em"
            fontFamily="var(--font-mono), monospace"
            fillOpacity="0.4"
          >
            PROPORTION 1:1.618 // DATUM ELEVATION +12.4M
          </text>
        </svg>
      </div>
    </div>
  );
};

export default HeroArchitecturalBackground;
