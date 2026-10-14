"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilterBar from "@/components/PropertyFilterBar";
import EmptyState from "@/components/EmptyState";
import { PROPERTIES } from "@/data/properties";
import { Property, PropertyFilters } from "@/types/property";
import { filterProperties, sortProperties } from "@/lib/utils";

function RentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<PropertyFilters>({
    purpose: "rent",
    location: searchParams.get("location") || "all",
    propertyType: searchParams.get("propertyType") || "all",
    bedrooms: searchParams.get("bedrooms") || "all",
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    sortBy: (searchParams.get("sortBy") as any) || "newest",
  });

  useEffect(() => {
    setFilters({
      purpose: "rent",
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

    const params = new URLSearchParams();
    if (newFilters.location && newFilters.location !== "all") params.set("location", newFilters.location);
    if (newFilters.propertyType && newFilters.propertyType !== "all") params.set("propertyType", newFilters.propertyType);
    if (newFilters.bedrooms && newFilters.bedrooms !== "all") params.set("bedrooms", String(newFilters.bedrooms));
    if (newFilters.maxPrice) params.set("maxPrice", String(newFilters.maxPrice));
    if (newFilters.sortBy && newFilters.sortBy !== "newest") params.set("sortBy", newFilters.sortBy);

    const queryString = params.toString();
    router.replace(queryString ? `/rent?${queryString}` : "/rent", { scroll: false });
  };

  const handleReset = () => {
    const defaultFilters: PropertyFilters = {
      purpose: "rent",
      location: "all",
      propertyType: "all",
      bedrooms: "all",
      maxPrice: undefined,
      sortBy: "newest",
    };
    handleFiltersChange(defaultFilters);
  };

  const filtered = filterProperties(PROPERTIES, { ...filters, purpose: "rent" });
  const sorted = sortProperties(filtered, filters.sortBy);

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Editorial Header */}
      <div className="mb-8 max-w-2xl">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
          Executive & Corporate Lettings
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-agency-950 font-normal mt-1">
          Properties to Let
        </h1>
        <p className="text-sm text-agency-600 mt-2 leading-relaxed">
          Curated prime residences for discerning tenants, corporate relocations, and embassy personnel. All rental fees and deposit regulations conform to the Tenant Fees Act 2019.
        </p>
      </div>

      {/* Filter Toolbar */}
      <PropertyFilterBar
        purpose="rent"
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleReset}
        totalResults={sorted.length}
      />

      {/* Rental Grid or Empty State */}
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
        <EmptyState onReset={handleReset} purpose="rent" />
      )}
    </div>
  );
}

export default function RentPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-content mx-auto px-4 py-16 text-center text-sm text-agency-500">
          Loading lettings portfolio...
        </div>
      }
    >
      <RentPageContent />
    </Suspense>
  );
}
