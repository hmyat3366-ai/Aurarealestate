"use client";

import React from "react";
import { PropertyFilterParams } from "@/types/filters";
import { PropertyType } from "@/types/property";

export interface ActiveChipsProps {
  filters: PropertyFilterParams;
  onRemove: (key: keyof PropertyFilterParams, value?: any) => void;
  onClearAll: () => void;
  className?: string;
}

export function ActiveChips({ filters, onRemove, onClearAll, className = "" }: ActiveChipsProps) {
  const chips: { id: string; label: string; key: keyof PropertyFilterParams; value?: any }[] = [];

  // Location Chip
  if (filters.location && filters.location.trim() !== "" && filters.location !== "all") {
    chips.push({
      id: `location-${filters.location}`,
      label: `Location: ${filters.location}`,
      key: "location",
    });
  }

  // Price Range Chip
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    chips.push({
      id: `price-range`,
      label: `Price: $${filters.minPrice.toLocaleString()} – $${filters.maxPrice.toLocaleString()}`,
      key: "minPrice", // handler will clear both
    });
  } else if (filters.minPrice !== undefined) {
    chips.push({
      id: `min-price`,
      label: `Min: $${filters.minPrice.toLocaleString()}`,
      key: "minPrice",
    });
  } else if (filters.maxPrice !== undefined) {
    chips.push({
      id: `max-price`,
      label: `Max: $${filters.maxPrice.toLocaleString()}`,
      key: "maxPrice",
    });
  }

  // Bedrooms Chip
  if (filters.bedrooms !== undefined && filters.bedrooms !== "all") {
    const bedLabel =
      filters.bedrooms === "studio" || filters.bedrooms === 0 || filters.bedrooms === "0"
        ? "Studio"
        : `${filters.bedrooms} Beds`;
    chips.push({
      id: `beds-${filters.bedrooms}`,
      label: `Beds: ${bedLabel}`,
      key: "bedrooms",
    });
  }

  // Bathrooms Chip
  if (filters.bathrooms !== undefined && filters.bathrooms !== "all") {
    chips.push({
      id: `baths-${filters.bathrooms}`,
      label: `Baths: ${filters.bathrooms}+`,
      key: "bathrooms",
    });
  }

  // Property Types Chips
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    filters.propertyTypes.forEach((type) => {
      chips.push({
        id: `type-${type}`,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        key: "propertyTypes",
        value: type,
      });
    });
  }

  // Rental Specific: Lease Term
  const interval = filters.rentalInterval || filters.leaseTerm;
  if (interval && interval !== "all") {
    chips.push({
      id: `lease-${interval}`,
      label: `Lease: ${interval}`,
      key: "rentalInterval",
    });
  }

  // Rental Specific: Furnished
  if (filters.furnished === true) {
    chips.push({
      id: `furnished`,
      label: "Furnished",
      key: "furnished",
    });
  }

  // Rental Specific: Pets Allowed
  if (filters.petsAllowed === true) {
    chips.push({
      id: `pets`,
      label: "Pets Allowed",
      key: "petsAllowed",
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 py-3 ${className}`}
      aria-label="Active filters"
      role="region"
    >
      <span className="font-mono text-xs uppercase tracking-wider text-[#63655E] mr-1 hidden sm:inline">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F3F1EC] text-[#121312] border border-[#E6E4DE] rounded-full text-xs font-sans transition-colors"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={() => onRemove(chip.key, chip.value)}
            aria-label={`Remove filter: ${chip.label}`}
            className="p-0.5 -mr-1 text-[#63655E] hover:text-[#121312] hover:bg-[#EAE7DF] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312]"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-mono uppercase tracking-wider text-[#78542E] hover:text-[#121312] underline underline-offset-4 ml-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312]"
      >
        Clear All Filters
      </button>
    </div>
  );
}
