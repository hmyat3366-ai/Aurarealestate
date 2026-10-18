"use client";

import React, { useState, useEffect } from "react";
import { PropertyFilterParams } from "@/types/filters";
import { PropertyType, ListingType } from "@/types/property";
import { Select } from "@/components/ui/Select";

export interface FilterBarProps {
  filters: PropertyFilterParams;
  onChange: (filters: PropertyFilterParams) => void;
  listingType?: ListingType;
  className?: string;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "penthouse", label: "Penthouse" },
  { value: "villa", label: "Villa" },
  { value: "townhouse", label: "Townhouse" },
  { value: "estate", label: "Estate" },
  { value: "loft", label: "Loft" },
];

const BED_OPTIONS = [
  { value: "all", label: "Any" },
  { value: "studio", label: "Studio" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

const BATH_OPTIONS = [
  { value: "all", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

// Price options for Buy vs Rent
const SALE_MIN_PRICES = [
  { value: "all", label: "No Min" },
  { value: "1000000", label: "$1,000,000" },
  { value: "2500000", label: "$2,500,000" },
  { value: "5000000", label: "$5,000,000" },
  { value: "7500000", label: "$7,500,000" },
  { value: "10000000", label: "$10,000,000" },
  { value: "15000000", label: "$15,000,000" },
];

const SALE_MAX_PRICES = [
  { value: "all", label: "No Max" },
  { value: "5000000", label: "$5,000,000" },
  { value: "7500000", label: "$7,500,000" },
  { value: "10000000", label: "$10,000,000" },
  { value: "15000000", label: "$15,000,000" },
  { value: "20000000", label: "$20,000,000" },
  { value: "30000000", label: "$30,000,000+" },
];

const RENT_MIN_PRICES = [
  { value: "all", label: "No Min" },
  { value: "5000", label: "$5,000 / mo" },
  { value: "10000", label: "$10,000 / mo" },
  { value: "15000", label: "$15,000 / mo" },
  { value: "20000", label: "$20,000 / mo" },
  { value: "25000", label: "$25,000 / mo" },
];

const RENT_MAX_PRICES = [
  { value: "all", label: "No Max" },
  { value: "12000", label: "$12,000 / mo" },
  { value: "16000", label: "$16,000 / mo" },
  { value: "20000", label: "$20,000 / mo" },
  { value: "30000", label: "$30,000 / mo" },
  { value: "40000", label: "$40,000+ / mo" },
];

const LEASE_TERMS = [
  { value: "all", label: "All Terms" },
  { value: "annual", label: "Annual (12+ Months)" },
  { value: "flexible", label: "Flexible (3-11 Months)" },
  { value: "short-term", label: "Short-Term (< 3 Months)" },
];

export function FilterBar({ filters, onChange, listingType = "sale", className = "" }: FilterBarProps) {
  const [localLocation, setLocalLocation] = useState(filters.location || "");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalLocation(filters.location || "");
  }, [filters.location]);

  // Handle location input debounced submit or on blur / Enter
  const handleLocationSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = localLocation.trim();
    if (trimmed !== (filters.location || "")) {
      onChange({
        ...filters,
        location: trimmed !== "" ? trimmed : undefined,
      });
    }
  };

  const handlePriceChange = (type: "min" | "max", val: string) => {
    const num = val === "all" ? undefined : Number(val);
    onChange({
      ...filters,
      [type === "min" ? "minPrice" : "maxPrice"]: num,
    });
  };

  const handleBedroomsChange = (val: string) => {
    if (val === "all") {
      onChange({ ...filters, bedrooms: undefined });
    } else if (val === "studio") {
      onChange({ ...filters, bedrooms: "studio" });
    } else {
      onChange({ ...filters, bedrooms: Number(val) });
    }
  };

  const handleBathroomsChange = (val: string) => {
    if (val === "all") {
      onChange({ ...filters, bathrooms: undefined });
    } else {
      onChange({ ...filters, bathrooms: Number(val) });
    }
  };

  const handleTypeToggle = (type: PropertyType) => {
    const currentTypes = filters.propertyTypes || [];
    const exists = currentTypes.includes(type);
    const updated = exists ? currentTypes.filter((t) => t !== type) : [...currentTypes, type];
    onChange({
      ...filters,
      propertyTypes: updated.length > 0 ? updated : undefined,
    });
  };

  const handleLeaseTermChange = (term: string) => {
    onChange({
      ...filters,
      rentalInterval: term === "all" ? undefined : term,
      leaseTerm: term === "all" ? undefined : term,
    });
  };

  const isRental = listingType === "rent";
  const minPriceOptions = isRental ? RENT_MIN_PRICES : SALE_MIN_PRICES;
  const maxPriceOptions = isRental ? RENT_MAX_PRICES : SALE_MAX_PRICES;

  const currentBedValue =
    filters.bedrooms === undefined
      ? "all"
      : filters.bedrooms === "studio" || filters.bedrooms === 0 || filters.bedrooms === "0"
      ? "studio"
      : String(filters.bedrooms);

  const currentBathValue =
    filters.bathrooms === undefined ? "all" : String(filters.bathrooms);

  return (
    <div className={`w-full bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs p-4 sm:p-5 shadow-xs ${className}`}>
      {/* Primary Row: Location Search & Price Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Location Typeahead Search */}
        <div className="md:col-span-5 lg:col-span-5">
          <form onSubmit={handleLocationSubmit} className="relative">
            <label htmlFor="filter-location" className="sr-only">
              Search by neighborhood or city
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#63655E]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                id="filter-location"
                type="text"
                placeholder="Search neighborhood (e.g. Mayfair, Tribeca, SoHo)..."
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                onBlur={() => handleLocationSubmit()}
                className="w-full pl-10 pr-9 py-2.5 bg-[#FBFBF9] border border-[#D5D1C7] rounded-xs text-sm font-sans text-[#121312] placeholder-[#8E8A80] focus:outline-none focus:ring-1 focus:ring-[#121312] focus:border-[#121312] transition-colors"
              />
              {localLocation && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalLocation("");
                    onChange({ ...filters, location: undefined });
                  }}
                  aria-label="Clear location input"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8E8A80] hover:text-[#121312]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Min Price Dropdown */}
        <div className="md:col-span-3 lg:col-span-3">
          <Select
            id="filter-min-price"
            ariaLabel="Minimum price"
            options={minPriceOptions}
            value={filters.minPrice !== undefined ? String(filters.minPrice) : "all"}
            onChange={(val) => handlePriceChange("min", val)}
            className="text-xs"
          />
        </div>

        {/* Max Price Dropdown */}
        <div className="md:col-span-3 lg:col-span-3">
          <Select
            id="filter-max-price"
            ariaLabel="Maximum price"
            options={maxPriceOptions}
            value={filters.maxPrice !== undefined ? String(filters.maxPrice) : "all"}
            onChange={(val) => handlePriceChange("max", val)}
            className="text-xs"
          />
        </div>

        {/* Toggle Filters Button */}
        <div className="md:col-span-1 lg:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls="advanced-filters"
            className="w-full md:w-auto h-[44px] px-3 border border-[#D5D1C7] bg-[#FBFBF9] hover:bg-[#F3F1EC] rounded-xs flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#121312] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312]"
          >
            <span className="md:hidden">More Filters</span>
            <svg
              className={`w-4 h-4 text-[#4A4C48] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable Secondary Filters */}
      <div
        id="advanced-filters"
        className={`pt-5 mt-5 border-t border-[#E6E4DE] space-y-5 transition-all ${
          isExpanded ? "block" : "hidden md:block"
        }`}
      >
        {/* Bedrooms & Bathrooms Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Bedrooms Segmented Selector */}
          <div className="lg:col-span-6 space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-[0.14em] text-[#4A4C48] font-medium">
              Bedrooms
            </label>
            <div className="flex flex-wrap gap-1" role="group" aria-label="Bedrooms filter">
              {BED_OPTIONS.map((opt) => {
                const isSelected = currentBedValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleBedroomsChange(opt.value)}
                    aria-pressed={isSelected}
                    className={`px-3 py-1.5 rounded-xs text-xs font-mono uppercase tracking-wider transition-all duration-150 border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] ${
                      isSelected
                        ? "bg-[#121312] text-[#FBFBF9] border-[#121312]"
                        : "bg-[#FFFFFF] text-[#4A4C48] border-[#D5D1C7] hover:border-[#121312]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bathrooms Segmented Selector */}
          <div className="lg:col-span-6 space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-[0.14em] text-[#4A4C48] font-medium">
              Bathrooms
            </label>
            <div className="flex flex-wrap gap-1" role="group" aria-label="Bathrooms filter">
              {BATH_OPTIONS.map((opt) => {
                const isSelected = currentBathValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleBathroomsChange(opt.value)}
                    aria-pressed={isSelected}
                    className={`px-3.5 py-1.5 rounded-xs text-xs font-mono uppercase tracking-wider transition-all duration-150 border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] ${
                      isSelected
                        ? "bg-[#121312] text-[#FBFBF9] border-[#121312]"
                        : "bg-[#FFFFFF] text-[#4A4C48] border-[#D5D1C7] hover:border-[#121312]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Property Types Chips Row */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-[0.14em] text-[#4A4C48] font-medium">
            Property Typologies
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Property types filter">
            {PROPERTY_TYPES.map((type) => {
              const isSelected = filters.propertyTypes?.includes(type.value) || false;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeToggle(type.value)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-xs text-xs font-sans transition-all duration-150 border flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] ${
                    isSelected
                      ? "bg-[#F4EDE2] text-[#121312] border-[#78542E] font-medium"
                      : "bg-[#FFFFFF] text-[#4A4C48] border-[#D5D1C7] hover:border-[#121312]"
                  }`}
                >
                  <span>{type.label}</span>
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 text-[#78542E]" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rental Specific Filters (Rent flow only) */}
        {isRental && (
          <div className="pt-4 border-t border-[#E6E4DE] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Lease Term Dropdown */}
            <div className="sm:col-span-6">
              <label htmlFor="filter-lease-term" className="block text-xs font-mono uppercase tracking-[0.14em] text-[#4A4C48] font-medium mb-1.5">
                Lease Term
              </label>
              <Select
                id="filter-lease-term"
                ariaLabel="Lease term interval"
                options={LEASE_TERMS}
                value={filters.rentalInterval || filters.leaseTerm || "all"}
                onChange={handleLeaseTermChange}
                className="text-xs"
              />
            </div>

            {/* Furnished & Pet Friendly Toggles */}
            <div className="sm:col-span-6 flex items-center gap-4 pt-4 sm:pt-6">
              {/* Furnished Toggle */}
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.furnished === true}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      furnished: e.target.checked ? true : undefined,
                    })
                  }
                  className="w-4 h-4 rounded-xs border-[#D5D1C7] text-[#121312] focus:ring-1 focus:ring-[#121312]"
                />
                <span className="font-sans text-xs text-[#121312]">Furnished Only</span>
              </label>

              {/* Pets Allowed Toggle */}
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.petsAllowed === true}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      petsAllowed: e.target.checked ? true : undefined,
                    })
                  }
                  className="w-4 h-4 rounded-xs border-[#D5D1C7] text-[#121312] focus:ring-1 focus:ring-[#121312]"
                />
                <span className="font-sans text-xs text-[#121312]">Pet-Friendly</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
