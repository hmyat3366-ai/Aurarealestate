"use client";

import React, { useState, useEffect } from "react";

export interface ArchitecturalImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  priority?: boolean;
}

export const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

export const ARCHITECTURAL_SVG_FALLBACK =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1200' width='1600' height='1200'%3E%3Crect width='100%25' height='100%25' fill='%23F3F1EC'/%3E%3Cg stroke='%23C4A882' stroke-width='1.5' fill='none' opacity='0.5'%3E%3Cpath d='M200 1000 L800 300 L1400 1000 Z'/%3E%3Cpath d='M400 1000 L800 500 L1200 1000 Z'/%3E%3Cline x1='800' y1='300' x2='800' y2='1000'/%3E%3Cline x1='200' y1='1000' x2='1400' y2='1000' stroke-width='2' stroke='%2378542E'/%3E%3C/g%3E%3Ctext x='800' y='660' font-family='serif' font-size='28' fill='%23121312' text-anchor='middle' letter-spacing='0.2em'%3EAURA REAL ESTATE%3C/text%3E%3Ctext x='800' y='710' font-family='monospace' font-size='13' fill='%2378542E' text-anchor='middle' letter-spacing='0.25em'%3EARCHITECTURAL ARCHIVE%3C/text%3E%3C/svg%3E";

export const ArchitecturalImage: React.FC<ArchitecturalImageProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  onError,
  width = 1600,
  height = 1200,
  decoding = "async",
  priority,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    } else if (imgSrc !== ARCHITECTURAL_SVG_FALLBACK) {
      // Secondary fallback if remote fallback also fails or is unreachable
      setImgSrc(ARCHITECTURAL_SVG_FALLBACK);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      decoding={decoding}
      loading={priority ? "eager" : props.loading}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

