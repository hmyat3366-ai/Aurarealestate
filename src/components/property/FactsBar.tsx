"use client";

import React from "react";
import { Property } from "@/types/property";
import {
  formatPrice,
  formatPricePerSqft,
  formatSqft,
  formatBedrooms,
  formatBathrooms,
} from "@/lib/formatters";

export interface FactsBarProps {
  property: Property;
  className?: string;
}

export function FactsBar({ property, className = "" }: FactsBarProps) {
  const isRental = property.listingType === "rent";

  // Capitalize property type
  const formattedType =
    property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1);

  // Deposit calculation for rental
  const depositFormatted =
    isRental && property.rentalDetails?.depositAmount
      ? formatPrice({
          amount: property.rentalDetails.depositAmount,
          currency: property.price.currency,
        })
      : null;

  return (
    <div
      className={`w-full bg-[#FBFBF9] border-y md:border border-[#E6E4DE] rounded-none md:rounded-xs py-4 px-4 sm:px-6 shadow-xs ${className}`}
      data-testid="property-facts-bar"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-y-4 gap-x-3 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-[#E6E4DE]">
        {/* 1. Price */}
        <div className="flex flex-col justify-center sm:pr-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#63655E]">
            {isRental ? "Monthly Lease" : "Purchase Price"}
          </span>
          <span className="font-serif text-lg lg:text-xl font-medium text-[#121312] mt-0.5 truncate">
            {formatPrice(property.price)}
          </span>
        </div>

        {/* 2. Property Type */}
        <div className="flex flex-col justify-center pt-3 sm:pt-0 sm:px-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#63655E]">
            Typology
          </span>
          <span className="font-sans text-sm font-medium text-[#121312] mt-0.5 capitalize">
            {formattedType}
          </span>
        </div>

        {/* 3. Bedrooms */}
        <div className="flex flex-col justify-center pt-3 sm:pt-0 sm:px-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#63655E]">
            Bedrooms
          </span>
          <span className="font-sans text-sm font-medium text-[#121312] mt-0.5">
            {formatBedrooms(property.bedrooms)}
          </span>
        </div>

        {/* 4. Bathrooms */}
        <div className="flex flex-col justify-center pt-3 sm:pt-0 sm:px-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#63655E]">
            Bathrooms
          </span>
          <span className="font-sans text-sm font-medium text-[#121312] mt-0.5">
            {formatBathrooms(property.bathrooms)}
          </span>
        </div>

        {/* 5. Interior Square Feet */}
        <div className="flex flex-col justify-center pt-3 sm:pt-0 sm:px-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#63655E]">
            Interior Area
          </span>
          <span className="font-mono text-xs sm:text-sm text-[#121312] mt-0.5">
            {formatSqft(property.squareFeet)}
          </span>
        </div>

        {/* 6. Price/SqFt (Sale) OR Lease Term (Rent) */}
        <div className="flex flex-col justify-center pt-3 sm:pt-0 sm:px-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#63655E]">
            {isRental ? "Lease Term" : "Price / Sq Ft"}
          </span>
          <span className="font-mono text-xs sm:text-sm text-[#121312] mt-0.5 truncate">
            {isRental
              ? property.rentalDetails?.leaseTerm || "Annual (12+ Mo)"
              : property.pricePerSqFt
              ? formatPricePerSqft(property.pricePerSqFt, property.price.currency)
              : "N/A"}
          </span>
        </div>

        {/* 7. Year Built */}
        <div className="flex flex-col justify-center pt-3 sm:pt-0 sm:px-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#63655E]">
            Year Built
          </span>
          <span className="font-mono text-xs sm:text-sm text-[#121312] mt-0.5">
            {property.yearBuilt}
          </span>
        </div>

        {/* 8. HOA (Sale) OR Security Deposit (Rent) */}
        <div className="flex flex-col justify-center pt-3 sm:pt-0 sm:pl-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#63655E]">
            {isRental ? "Security Deposit" : "HOA / Common"}
          </span>
          <span className="font-mono text-xs sm:text-sm text-[#121312] mt-0.5 truncate">
            {isRental
              ? depositFormatted
                ? `${depositFormatted} Deposit`
                : "Upon Application"
              : "$1,850 / mo HOA"}
          </span>
        </div>
      </div>
    </div>
  );
}
