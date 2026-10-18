"use client";

import React, { Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { PropertyCard, FilterBar, ActiveChips, SortSelect, EmptyState } from "@/components/discovery";
import { PropertyGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { PROPERTIES } from "@/data/properties";
import { filterProperties, sortProperties } from "@/lib/filters";
import { PropertyFilterParams, SortOption } from "@/types/filters";
import { PropertyType } from "@/types/property";
import { useFavorites } from "@/context/FavoritesContext";

function parseQueryParams(searchParams: URLSearchParams) {
  const filters: PropertyFilterParams = {};

  // Location
  const loc = searchParams.get("location");
  if (loc && loc.trim() !== "" && loc !== "all") {
    filters.location = loc.trim();
  }

  // Min Price
  const minP = searchParams.get("minPrice");
  if (minP !== null && minP.trim() !== "") {
    const num = Number(minP);
    if (!isNaN(num) && num >= 0) filters.minPrice = num;
  }

  // Max Price
  const maxP = searchParams.get("maxPrice");
  if (maxP !== null && maxP.trim() !== "") {
    const num = Number(maxP);
    if (!isNaN(num) && num >= 0) filters.maxPrice = num;
  }

  // Bedrooms
  const beds = searchParams.get("bedrooms");
  if (beds !== null && beds.trim() !== "" && beds !== "all") {
    if (beds.toLowerCase() === "studio") {
      filters.bedrooms = "studio";
    } else {
      const num = Number(beds);
      if (!isNaN(num) && num >= 0) filters.bedrooms = num;
    }
  }

  // Bathrooms
  const baths = searchParams.get("bathrooms");
  if (baths !== null && baths.trim() !== "" && baths !== "all") {
    const num = Number(baths);
    if (!isNaN(num) && num >= 0) filters.bathrooms = num;
  }

  // Property Types
  const typesFromGetAll = searchParams.getAll("type");
  const allTypes: string[] = [];
  typesFromGetAll.forEach((t) => {
    t.split(",").forEach((sub) => {
      const trimmed = sub.trim().toLowerCase();
      if (trimmed && trimmed !== "all") allTypes.push(trimmed);
    });
  });
  if (allTypes.length > 0) {
    filters.propertyTypes = Array.from(new Set(allTypes)) as PropertyFilterParams["propertyTypes"];
  }

  // Sort
  const sort = searchParams.get("sort");
  const validSorts: SortOption[] = ["featured", "newest", "price-asc", "price-desc", "sqft-desc"];
  const sortBy: SortOption = sort && validSorts.includes(sort as SortOption) ? (sort as SortOption) : "featured";

  const isSaved = searchParams.get("saved") === "true";

  return { filters, sortBy, isSaved };
}

function buildQueryString(filters: PropertyFilterParams, sortBy?: SortOption, isSaved?: boolean): string {
  const params = new URLSearchParams();

  if (filters.location && filters.location.trim() !== "" && filters.location !== "all") {
    params.set("location", filters.location.trim());
  }
  if (typeof filters.minPrice === "number" && !isNaN(filters.minPrice) && filters.minPrice >= 0) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (typeof filters.maxPrice === "number" && !isNaN(filters.maxPrice) && filters.maxPrice >= 0) {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.bedrooms !== undefined && filters.bedrooms !== "all") {
    params.set("bedrooms", String(filters.bedrooms));
  }
  if (filters.bathrooms !== undefined && filters.bathrooms !== "all") {
    params.set("bathrooms", String(filters.bathrooms));
  }
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    params.set("type", filters.propertyTypes.join(","));
  }
  if (sortBy && sortBy !== "featured") {
    params.set("sort", sortBy);
  }
  if (isSaved) {
    params.set("saved", "true");
  }

  const str = params.toString();
  return str ? `?${str}` : "";
}

function BuyDiscoveryContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isFavorite } = useFavorites();

  // Parse current state from URL
  const { filters, sortBy, isSaved } = useMemo(
    () => parseQueryParams(searchParams),
    [searchParams]
  );

  // Update URL helper (shallow URL sync)
  const updateUrl = useCallback(
    (newFilters: PropertyFilterParams, newSort: SortOption, newSaved?: boolean) => {
      const queryString = buildQueryString(newFilters, newSort, newSaved);
      router.replace(`${pathname}${queryString}`, { scroll: false });
    },
    [router, pathname]
  );

  // Filter change handler
  const handleFilterChange = (updatedFilters: PropertyFilterParams) => {
    updateUrl(updatedFilters, sortBy, isSaved);
  };

  // Sort change handler
  const handleSortChange = (newSort: SortOption) => {
    updateUrl(filters, newSort, isSaved);
  };

  // Single chip removal handler
  const handleRemoveChip = (key: keyof PropertyFilterParams, value?: any) => {
    const updated = { ...filters };
    if (key === "propertyTypes" && value && updated.propertyTypes) {
      const nextTypes = updated.propertyTypes.filter((t) => t !== value);
      updated.propertyTypes = nextTypes.length > 0 ? nextTypes : undefined;
    } else if (key === "minPrice" && updated.maxPrice !== undefined && updated.minPrice !== undefined) {
      // Clear both if cleared from range
      updated.minPrice = undefined;
      updated.maxPrice = undefined;
    } else {
      delete updated[key];
    }
    updateUrl(updated, sortBy, isSaved);
  };

  // Reset all filters handler
  const handleResetFilters = () => {
    updateUrl({}, "featured", false);
  };

  // 1. Strictly filter only 'sale' listings (never confuse with rent)
  const saleProperties = useMemo(() => {
    return PROPERTIES.filter((p) => p.listingType === "sale");
  }, []);

  // 2. Apply multi-attribute filters
  const filteredProperties = useMemo(() => {
    let result = filterProperties(saleProperties, {
      ...filters,
      listingType: "sale",
    });

    if (isSaved) {
      result = result.filter((p) => isFavorite(p.id));
    }

    return result;
  }, [saleProperties, filters, isSaved, isFavorite]);

  // 3. Apply 5-way sorting
  const sortedProperties = useMemo(() => {
    return sortProperties(filteredProperties, sortBy);
  }, [filteredProperties, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9]">
      <Header />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Editorial Header Banner */}
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E6E4DE]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] mb-2 font-medium">
                Acquisitions Portfolio
              </p>
              <h1 className="font-serif text-page-title font-normal text-[#121312] tracking-tight-editorial">
                Curated Residences for Acquisition
              </h1>
            </div>
            <p className="font-sans text-body-small text-[#63655E] max-w-md leading-relaxed">
              Discreet representation for premier cast-iron lofts, architectural penthouses, and private estates across London, New York, and Zurich.
            </p>
          </div>
        </section>

        {/* Discovery Filter Controls Console */}
        <section className="mb-6 space-y-4" aria-label="Search and filter options">
          <FilterBar
            filters={filters}
            onChange={handleFilterChange}
            listingType="sale"
          />

          {/* Active Filter Chips */}
          <ActiveChips
            filters={filters}
            onRemove={handleRemoveChip}
            onClearAll={handleResetFilters}
          />

          {/* Catalog Metrics & 5-Way Sorting Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="font-mono text-xs text-[#63655E]">
              Showing <span className="font-medium text-[#121312]">{sortedProperties.length}</span>{" "}
              {sortedProperties.length === 1 ? "residence" : "residences"}
              {isSaved && " in Saved Portfolio"}
            </div>

            <SortSelect value={sortBy} onChange={handleSortChange} />
          </div>
        </section>

        {/* Property Grid or Zero-Match Empty State */}
        <section aria-label="Acquisition residences listings">
          <h2 className="sr-only">Available Residences for Acquisition</h2>
          {sortedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  priority={index < 3}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              onReset={handleResetFilters}
              listingType="sale"
              message={
                isSaved
                  ? "You have not saved any residences to your acquisitions portfolio yet. Click the heart icon on any residence card to save it."
                  : undefined
              }
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function BuyPage() {
  return (
    <Suspense fallback={<PropertyGridSkeleton />}>
      <BuyDiscoveryContent />
    </Suspense>
  );
}
