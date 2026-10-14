"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, ArrowRight, PoundSterling } from "lucide-react";
import { PropertyPurpose } from "@/types/property";

interface SearchBarProps {
  initialPurpose?: PropertyPurpose;
  className?: string;
}

export default function SearchBar({
  initialPurpose = "sale",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const [purpose, setPurpose] = useState<PropertyPurpose>(initialPurpose);
  const [location, setLocation] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (location && location !== "all") params.set("location", location);
    if (propertyType && propertyType !== "all") params.set("propertyType", propertyType);
    if (maxPrice && maxPrice !== "all") params.set("maxPrice", maxPrice);

    const targetRoute = purpose === "sale" ? "/buy" : "/rent";
    const queryString = params.toString();
    router.push(queryString ? `${targetRoute}?${queryString}` : targetRoute);
  };

  return (
    <div
      className={`bg-surface-canvas rounded-lg shadow-premium border border-border-subtle p-4 sm:p-6 transition-all ${className}`}
    >
      {/* Purpose Tabs: Buy vs Rent */}
      <div className="flex items-center space-x-2 border-b border-border-subtle pb-4 mb-4">
        <button
          type="button"
          onClick={() => {
            setPurpose("sale");
            setMaxPrice("all");
          }}
          className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${
            purpose === "sale"
              ? "bg-agency-950 text-white shadow-sm"
              : "text-agency-600 hover:text-agency-950 hover:bg-agency-100"
          }`}
          aria-selected={purpose === "sale"}
          role="tab"
        >
          Buy Properties
        </button>
        <button
          type="button"
          onClick={() => {
            setPurpose("rent");
            setMaxPrice("all");
          }}
          className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${
            purpose === "rent"
              ? "bg-agency-950 text-white shadow-sm"
              : "text-agency-600 hover:text-agency-950 hover:bg-agency-100"
          }`}
          aria-selected={purpose === "rent"}
          role="tab"
        >
          Rent Properties
        </button>
      </div>

      {/* Filter Inputs Grid */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Location Field */}
        <div>
          <label
            htmlFor="home-search-location"
            className="block text-[11px] uppercase tracking-wider font-semibold text-agency-600 mb-1.5 flex items-center"
          >
            <MapPin className="w-3.5 h-3.5 mr-1 text-accent-500" />
            <span>Prime District</span>
          </label>
          <select
            id="home-search-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            <option value="all">All Prime Districts</option>
            <option value="Mayfair">Mayfair (W1)</option>
            <option value="Kensington">Kensington & Holland Park (W8 / W14)</option>
            <option value="Chelsea">Chelsea (SW3 / SW10)</option>
            <option value="Belgravia">Belgravia (SW1)</option>
            <option value="Marylebone">Marylebone (W1G / W1U)</option>
            <option value="Richmond">Richmond upon Thames (TW10)</option>
          </select>
        </div>

        {/* Property Type Field */}
        <div>
          <label
            htmlFor="home-search-type"
            className="block text-[11px] uppercase tracking-wider font-semibold text-agency-600 mb-1.5 flex items-center"
          >
            <Home className="w-3.5 h-3.5 mr-1 text-accent-500" />
            <span>Architecture Type</span>
          </label>
          <select
            id="home-search-type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            <option value="all">All Architectural Types</option>
            <option value="penthouse">Penthouse</option>
            <option value="apartment">Lateral Apartment</option>
            <option value="townhouse">Period Townhouse</option>
            <option value="villa">Detached Villa</option>
            <option value="mews">Mews House</option>
          </select>
        </div>

        {/* Maximum Price Field */}
        <div>
          <label
            htmlFor="home-search-price"
            className="block text-[11px] uppercase tracking-wider font-semibold text-agency-600 mb-1.5 flex items-center"
          >
            <PoundSterling className="w-3.5 h-3.5 mr-1 text-accent-500" />
            <span>{purpose === "sale" ? "Budget (Max Price)" : "Monthly Budget (Max)"}</span>
          </label>
          <select
            id="home-search-price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            <option value="all">Any Price</option>
            {purpose === "sale" ? (
              <>
                <option value="3000000">Up to £3,000,000</option>
                <option value="5000000">Up to £5,000,000</option>
                <option value="7500000">Up to £7,500,000</option>
                <option value="10000000">Up to £10,000,000</option>
                <option value="15000000">Up to £15,000,000</option>
              </>
            ) : (
              <>
                <option value="5000">Up to £5,000 pcm</option>
                <option value="7500">Up to £7,500 pcm</option>
                <option value="10000">Up to £10,000 pcm</option>
                <option value="15000">Up to £15,000 pcm</option>
                <option value="20000">Up to £20,000 pcm</option>
              </>
            )}
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full h-[42px] px-6 text-xs font-semibold uppercase tracking-wider text-white bg-accent-500 hover:bg-accent-600 rounded flex items-center justify-center transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500"
          >
            <Search className="w-4 h-4 mr-2" />
            <span>Discover Properties</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
