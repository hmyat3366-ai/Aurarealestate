"use client";

import React from "react";
import { Select } from "@/components/ui/Select";
import { SortOption } from "@/types/filters";

export interface SortSelectProps {
  value?: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest Additions" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "sqft-desc", label: "Area: Largest First" },
];

export function SortSelect({ value = "featured", onChange, className = "" }: SortSelectProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="font-mono text-xs uppercase tracking-wider text-[#63655E] shrink-0 hidden sm:inline">
        Sort By:
      </span>
      <div className="w-48 sm:w-56">
        <Select
          id="sort-select"
          ariaLabel="Sort residences by"
          options={SORT_OPTIONS}
          value={value}
          onChange={(val) => onChange(val as SortOption)}
          className="text-xs"
        />
      </div>
    </div>
  );
}
