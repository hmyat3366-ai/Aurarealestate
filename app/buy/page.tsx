"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilterBar from "@/components/PropertyFilterBar";
import EmptyState from "@/components/EmptyState";
import { PROPERTIES } from "@/data/properties";
import { Property, PropertyFilters } from "@/types/property";
import { filterProperties, sortProperties } from "@/lib/utils";

function BuyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract initial filters from search params
  const [filters, setFilters] = useState<PropertyFilters>({
    purpose: "sale",
    location: searchParams.get("location") || "all",
    propertyType: searchParams.get("propertyType") || "all",
    bedrooms: searchParams.get("bedrooms") || "all",
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    sortBy: (searchParams.get("sortBy") as any) || "newest",
  });

  // Sync with searchParams if URL changes externally
  useEffect(() => {
    setFilters({
      purpose: "sale",
      location: searchParams.get("location") || "all",
      propertyType: searchParams.get("propertyType") || "all",
      bedrooms: searchParams.get("bedrooms") || "all",
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      sortBy: (searchParams.get("sortBy") as any) || "newest",
    });
  }, [searchParams]);

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);

    // Sync to URL query parameters
    const params = new URLSearchParams();
    if (newFilters.location && newFilters.location !== "all") params.set("location", newFilters.location);
    if (newFilters.propertyType && newFilters.propertyType !== "all") params.set("propertyType", newFilters.propertyType);
    if (newFilters.bedrooms && newFilters.bedrooms !== "all") params.set("bedrooms", String(newFilters.bedrooms));
    if (newFilters.maxPrice) params.set("maxPrice", String(newFilters.maxPrice));
    if (newFilters.sortBy && newFilters.sortBy !== "newest") params.set("sortBy", newFilters.sortBy);

    const queryString = params.toString();
    router.replace(queryString ? `/buy?${queryString}` : "/buy", { scroll: false });
  };

  const handleReset = () => {
    const defaultFilters: PropertyFilters = {
      purpose: "sale",
      location: "all",
      propertyType: "all",
      bedrooms: "all",
      maxPrice: undefined,
      sortBy: "newest",
    };
    handleFiltersChange(defaultFilters);
  };

  // Filter properties
  const filtered = filterProperties(PROPERTIES, { ...filters, purpose: "sale" });
  const sorted = sortProperties(filtered, filters.sortBy);

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Editorial Header */}
      <div className="mb-8 max-w-2xl">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
          Prime Central London Acquisitions
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-agency-950 font-normal mt-1">
          Properties for Sale
        </h1>
        <p className="text-sm text-agency-600 mt-2 leading-relaxed">
          Explore our exclusively represented sales inventory. Each property offers unique architectural merit, verifiable tenure, and dedicated partner representation.
        </p>
      </div>

      {/* Comprehensive Filter Toolbar */}
      <PropertyFilterBar
        purpose="sale"
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleReset}
        totalResults={sorted.length}
      />

      {/* Results Grid or Empty State */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map((property, idx) => (
            <PropertyCard
              key={property.id}
              property={property}
              priority={idx < 3}
            />
          ))}
        </div>
      ) : (
        <EmptyState onReset={handleReset} purpose="sale" />
      )}
    </div>
  );
}

export default function BuyPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-content mx-auto px-4 py-16 text-center text-sm text-agency-500">
          Loading acquisition portfolio...
        </div>
      }
    >
      <BuyPageContent />
    </Suspense>
  );
}
