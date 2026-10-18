"use client";

import React, { useState, useEffect, useContext, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Property } from "@/types/property";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatPricePerSqft, formatSqft, formatBedrooms, formatBathrooms } from "@/lib/formatters";
import { useFavorites } from "@/context/FavoritesContext";
import { AuthContext } from "@/context/AuthContext";
import { useOptionalToast } from "@/components/ui/Toast";

export interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useOptionalToast();
  const authContext = useContext(AuthContext);

  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(property.id);

  // Combine hero and gallery images for photo carousel, filtering invalid or duplicate URLs
  const images = useMemo(() => {
    const rawImages = [
      property.images?.hero,
      ...(property.images?.gallery || []),
    ].filter((img): img is string => typeof img === "string" && img.trim().length > 0);
    const set = Array.from(new Set(rawImages));
    return set.length > 0 ? set : [property.images?.hero || "/placeholder-residence.jpg"];
  }, [property.images?.hero, property.images?.gallery]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrorIndices, setImageErrorIndices] = useState<Record<number, boolean>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const FALLBACK_SVG =
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23F3F1EC'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%238E8A80'%3EAURA Real Estate%3C/text%3E%3C/svg%3E";

  const displaySrc = imageErrorIndices[currentImageIndex]
    ? FALLBACK_SVG
    : images[currentImageIndex] || images[0] || FALLBACK_SVG;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Guest user in authenticated app context: preserve property ID and redirect to OTP auth flow
    if (authContext && !authContext.isAuthenticated) {
      try {
        localStorage.setItem("aura_pending_save", property.id);
      } catch {
        // Ignore storage errors
      }
      const currentUrl =
        pathname || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/buy");
      router.push(
        `/auth/signin?returnUrl=${encodeURIComponent(currentUrl)}&intent=save&propertyId=${encodeURIComponent(property.id)}`
      );
      return;
    }

    setSaveError(null);
    const result = toggleFavorite(property.id);
    if (result instanceof Promise) {
      result.then((ok) => {
        if (ok === false) {
          setSaveError("Failed to save property");
          toast?.toast({
            title: "Save Failed",
            description: "Could not update saved residences on your account.",
            type: "error",
          });
        }
      }).catch(() => {
        setSaveError("Network error");
      });
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("button, a, input, select, textarea, [role='button']")) {
      return;
    }
    router.push(`/properties/${property.id}`);
  };

  // Status badge styling map
  const getBadgeVariant = (status: Property["status"]) => {
    switch (status) {
      case "Private Exclusive":
        return "private_exclusive";
      case "Coming Soon":
        return "coming_soon";
      case "Price Improvement":
        return "price_improvement";
      case "Under Contract":
        return "under_contract";
      case "Active":
      default:
        return "active";
    }
  };

  const isRental = property.listingType === "rent";

  return (
    <article
      className="group relative bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs overflow-hidden flex flex-col transition-all duration-300 hover:shadow-ambient-md hover:border-[#D5D1C7] cursor-pointer"
      data-testid={`property-card-${property.id}`}
      onClick={handleCardClick}
    >
      {/* 4:3 Media Frame / Image Carousel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F1EC]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displaySrc}
          alt={`${property.title} — Photo ${currentImageIndex + 1} of ${images.length}`}
          loading={priority ? "eager" : "lazy"}
          onError={() => {
            setImageErrorIndices((prev) => ({ ...prev, [currentImageIndex]: true }));
          }}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />

        {/* Carousel Image Controls (when multiple photos exist) */}
        {images.length > 1 && (
          <>
            {/* Prev Image Arrow */}
            <button
              type="button"
              onClick={prevImage}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                }
              }}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-[#121312]/70 text-[#FBFBF9] backdrop-blur-xs flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus:opacity-100 transition-opacity duration-200 hover:bg-[#121312] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBFBF9] active:scale-95 touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Image Arrow */}
            <button
              type="button"
              onClick={nextImage}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                }
              }}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-[#121312]/70 text-[#FBFBF9] backdrop-blur-xs flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus:opacity-100 transition-opacity duration-200 hover:bg-[#121312] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBFBF9] active:scale-95 touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Photo Counter Pill */}
            <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-xs bg-[#121312]/80 backdrop-blur-xs text-[10px] font-mono text-[#FBFBF9] tracking-wider pointer-events-none select-none">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* Top Badges Overlay: Status + Exclusivity */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <Badge variant={getBadgeVariant(property.status)}>
            {property.status}
          </Badge>
          {property.status === "Private Exclusive" && (
            <span className="font-mono text-[9px] uppercase tracking-wider bg-[#121312] text-[#FBFBF9] px-2 py-0.5 rounded-xs">
              Agency Exclusive
            </span>
          )}
        </div>

        {/* Save / Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
            }
          }}
          aria-label={saved ? `Remove ${property.title} from saved residences` : `Save ${property.title}`}
          aria-pressed={saved}
          className="absolute top-2.5 right-2.5 z-10 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-[#FBFBF9]/90 hover:bg-[#FFFFFF] text-[#121312] backdrop-blur-xs flex items-center justify-center shadow-xs transition-transform duration-150 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] touch-manipulation"
        >
          <svg
            className={`w-4 h-4 transition-colors ${
              saved ? "text-[#78542E] fill-current" : "text-[#4A4C48] fill-none hover:text-[#121312]"
            }`}
            stroke="currentColor"
            strokeWidth="1.75"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Transient save error notification */}
        {saveError && (
          <div
            role="alert"
            className="absolute top-12 right-2.5 z-20 max-w-[200px] bg-[#121312] text-[#FBFBF9] text-[10px] font-mono px-2 py-1 rounded-xs shadow-md border border-[#DC2626]"
          >
            {saveError}
          </div>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Price Header Strip */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="font-serif text-property-price tracking-tight text-[#121312] font-medium">
                {formatPrice(property.price)}
              </span>
              {/* For Buy listings: Price per Square Foot */}
              {!isRental && property.pricePerSqFt && (
                <span className="ml-2 font-mono text-xs text-[#63655E]">
                  ({formatPricePerSqft(property.pricePerSqFt, property.price.currency)})
                </span>
              )}
            </div>

            {/* Neighborhood Tag */}
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] bg-[#F4EDE2] px-2 py-0.5 rounded-xs shrink-0">
              {property.address.neighborhood}
            </span>
          </div>

          {/* Core Specifications Line: X bds • Y ba • Z sqft */}
          <div className="mt-2.5 font-mono text-xs text-[#4A4C48] flex items-center gap-2">
            <span>{formatBedrooms(property.bedrooms)}</span>
            <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
            <span>{formatBathrooms(property.bathrooms)}</span>
            <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
            <span>{formatSqft(property.squareFeet)}</span>
          </div>

          {/* Title & Two-tier Address */}
          <div className="mt-3">
            <h3 className="font-serif text-card-title text-[#121312] group-hover:text-[#78542E] transition-colors leading-snug">
              <Link
                href={`/properties/${property.id}`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/properties/${property.id}`);
                }}
                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] rounded-xs"
              >
                {property.title}
              </Link>
            </h3>
            <p className="mt-1 font-sans text-body-small text-[#63655E] truncate">
              {property.address.street}{property.address.unit ? `, Unit ${property.address.unit}` : ""}
            </p>
            <p className="font-sans text-caption-meta text-[#8E8A80]">
              {property.address.neighborhood}, {property.address.city} {property.address.postalCode}
            </p>
          </div>
        </div>

        {/* Rental specific attributes / Lease badges if rental */}
        {isRental && property.rentalDetails && (
          <div className="pt-3 border-t border-[#E6E4DE] flex items-center justify-between text-[11px] font-sans text-[#63655E]">
            <span className="font-mono text-[10px] text-[#4A4C48]">
              {property.rentalDetails.leaseTerm}
            </span>
            <div className="flex items-center gap-3">
              {property.rentalDetails.furnished && (
                <span className="text-[#121312] font-medium">Furnished</span>
              )}
              {property.rentalDetails.petsAllowed && (
                <span className="text-[#78542E]">Pets Allowed</span>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
