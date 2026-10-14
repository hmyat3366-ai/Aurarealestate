"use client";

import React from "react";
import { X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { PropertyFilters, PropertyPurpose } from "@/types/property";

interface PropertyFilterBarProps {
  purpose: PropertyPurpose;
  filters: PropertyFilters;
  onChange: (newFilters: PropertyFilters) => void;
  onReset: () => void;
  totalResults: number;
}

export default function PropertyFilterBar({
  purpose,
  filters,
  onChange,
  onReset,
  totalResults,
}: PropertyFilterBarProps) {
  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  // Determine active filter chips
  const activeChips: { key: keyof PropertyFilters; label: string }[] = [];

  if (filters.location && filters.location !== "all") {
    activeChips.push({
      key: "location",
      label: `District: ${filters.location}`,
    });
  }

  if (filters.propertyType && filters.propertyType !== "all") {
    const typeLabel =
      filters.propertyType.charAt(0).toUpperCase() +
      filters.propertyType.slice(1);
    activeChips.push({
      key: "propertyType",
      label: `Type: ${typeLabel}`,
    });
  }

  if (filters.bedrooms && filters.bedrooms !== "all") {
    activeChips.push({
      key: "bedrooms",
      label: `${filters.bedrooms}+ Bedrooms`,
    });
  }

  if (filters.maxPrice && filters.maxPrice > 0) {
    const formatted =
      purpose === "sale"
        ? `Max £${(filters.maxPrice / 1000000).toFixed(1)}M`
        : `Max £${filters.maxPrice.toLocaleString()} pcm`;
    activeChips.push({
      key: "maxPrice",
      label: formatted,
    });
  }

  return (
    <div className="bg-surface-canvas rounded-lg border border-border-subtle shadow-subtle p-5 sm:p-6 mb-8">
      {/* Top Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* District Filter */}
        <div>
          <label
            htmlFor="filter-location"
            className="block text-[11px] uppercase tracking-wider font-semibold text-agency-600 mb-1.5"
          >
            District
          </label>
          <select
            id="filter-location"
            value={filters.location || "all"}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            <option value="all">All Prime Districts</option>
            <option value="Mayfair">Mayfair</option>
            <option value="Kensington">Kensington & Holland Park</option>
            <option value="Chelsea">Chelsea</option>
            <option value="Belgravia">Belgravia</option>
            <option value="Marylebone">Marylebone</option>
            <option value="Richmond">Richmond upon Thames</option>
          </select>
        </div>

        {/* Architecture Type Filter */}
        <div>
          <label
            htmlFor="filter-property-type"
            className="block text-[11px] uppercase tracking-wider font-semibold text-agency-600 mb-1.5"
          >
            Architecture
          </label>
          <select
            id="filter-property-type"
            value={filters.propertyType || "all"}
            onChange={(e) => handleFilterChange("propertyType", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            <option value="all">All Types</option>
            <option value="penthouse">Penthouse</option>
            <option value="apartment">Lateral Apartment</option>
            <option value="townhouse">Period Townhouse</option>
            <option value="villa">Detached Villa</option>
            <option value="mews">Mews House</option>
          </select>
        </div>

        {/* Bedrooms Filter */}
        <div>
          <label
            htmlFor="filter-bedrooms"
            className="block text-[11px] uppercase tracking-wider font-semibold text-agency-600 mb-1.5"
          >
            Bedrooms
          </label>
          <select
            id="filter-bedrooms"
            value={filters.bedrooms || "all"}
            onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            <option value="all">Any Bedrooms</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
            <option value="5">5+ Bedrooms</option>
          </select>
        </div>

        {/* Maximum Budget Filter */}
        <div>
          <label
            htmlFor="filter-max-price"
            className="block text-[11px] uppercase tracking-wider font-semibold text-agency-600 mb-1.5"
          >
            {purpose === "sale" ? "Max Price" : "Max Monthly Rent"}
          </label>
          <select
            id="filter-max-price"
            value={filters.maxPrice || "all"}
            onChange={(e) =>
              handleFilterChange(
                "maxPrice",
                e.target.value === "all" ? undefined : Number(e.target.value)
              )
            }
            className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            <option value="all">No Maximum</option>
            {purpose === "sale" ? (
              <>
                <option value="4000000">Up to £4,000,000</option>
                <option value="6000000">Up to £6,000,000</option>
                <option value="8000000">Up to £8,000,000</option>
                <option value="10000000">Up to £10,000,000</option>
                <option value="15000000">Up to £15,000,000</option>
              </>
            ) : (
              <>
                <option value="6000">Up to £6,000 pcm</option>
                <option value="9000">Up to £9,000 pcm</option>
                <option value="12000">Up to £12,000 pcm</option>
                <option value="16000">Up to £16,000 pcm</option>
                <option value="20000">Up to £20,000 pcm</option>
              </>
            )}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label
            htmlFor="filter-sort"
            className="block text-[11px] uppercase tracking-wider font-semibold text-agency-600 mb-1.5 flex items-center"
          >
            <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-agency-500" />
            <span>Sort By</span>
          </label>
          <select
            id="filter-sort"
            value={filters.sortBy || "newest"}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            <option value="newest">Recently Curated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="bedrooms">Most Bedrooms</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips & Results Header */}
      <div className="mt-5 pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-agency-700">
            {totalResults} {totalResults === 1 ? "residence" : "residences"} matching criteria:
          </span>

          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent-50 text-accent-800 border border-accent-200/60 font-medium"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={() => handleFilterChange(chip.key, undefined)}
                className="ml-1.5 p-0.5 hover:text-accent-950 focus:outline-none"
                aria-label={`Remove filter ${chip.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {activeChips.length > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="text-agency-500 hover:text-agency-900 underline ml-2 transition-colors"
            >
              Reset all filters
            </button>
          )}
        </div>

        <div className="text-agency-500 text-[11px] tracking-wide uppercase font-sans">
          Exclusive Agency Inventory &bull; RICS Regulated
        </div>
      </div>
    </div>
  );
}
