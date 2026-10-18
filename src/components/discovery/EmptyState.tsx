"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  onReset: () => void;
  message?: string;
  listingType?: "sale" | "rent";
}

export function EmptyState({ onReset, message, listingType = "sale" }: EmptyStateProps) {
  const typeText = listingType === "sale" ? "for acquisition" : "for lease";

  return (
    <div
      role="region"
      aria-label="No results found"
      className="py-20 px-6 max-w-xl mx-auto text-center flex flex-col items-center justify-center bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs my-8"
    >
      {/* Editorial Architectural Icon */}
      <div className="w-14 h-14 mb-6 rounded-full bg-[#F3F1EC] flex items-center justify-center text-[#78542E]">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.25">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] mb-2 font-medium">
        Zero Matching Residences
      </p>

      <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#121312] tracking-tight-editorial mb-3">
        No residences match your current criteria
      </h3>

      <p className="font-sans text-sm text-[#63655E] max-w-md mx-auto leading-relaxed mb-8">
        {message ||
          `We could not find any curated private residences ${typeText} matching your applied search parameters. Try expanding your location or price range, or reset your filters to inspect the full agency portfolio.`}
      </p>

      <Button
        variant="primary"
        onClick={onReset}
        className="px-6 py-2.5 text-xs font-mono uppercase tracking-wider"
      >
        Reset All Filters
      </Button>
    </div>
  );
}
