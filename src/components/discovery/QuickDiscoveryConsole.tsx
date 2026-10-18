"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function QuickDiscoveryConsole() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    const trimmedLoc = location.trim();
    if (trimmedLoc && trimmedLoc !== "all") {
      params.set("location", trimmedLoc);
    }

    if (propertyType && propertyType !== "all") {
      params.set("type", propertyType);
    }

    if (priceRange && priceRange !== "all") {
      if (priceRange === "1m-3m") {
        params.set("minPrice", "1000000");
        params.set("maxPrice", "3000000");
      } else if (priceRange === "3m-5m") {
        params.set("minPrice", "3000000");
        params.set("maxPrice", "5000000");
      } else if (priceRange === "5m-10m") {
        params.set("minPrice", "5000000");
        params.set("maxPrice", "10000000");
      } else if (priceRange === "10m-plus") {
        params.set("minPrice", "10000000");
      }
    }

    if (bedrooms && bedrooms !== "all") {
      params.set("bedrooms", bedrooms);
    }

    const queryString = params.toString();
    const targetRoute = activeTab === "rent" ? "/rent" : "/buy";
    const fullUrl = queryString ? `${targetRoute}?${queryString}` : targetRoute;

    router.push(fullUrl);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#FFFFFF] border border-[#E6E4DE] shadow-ambient-md rounded-xs overflow-hidden">
      {/* Mode Switcher Tabs (Buy / Rent) */}
      <div role="tablist" aria-label="Discovery mode" className="flex border-b border-[#E6E4DE] bg-[#FBFBF9]">
        <button
          type="button"
          onClick={() => setActiveTab("buy")}
          className={`flex-1 py-3.5 px-6 font-mono text-xs uppercase tracking-[0.14em] transition-all duration-200 border-b-2 text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] ${
            activeTab === "buy"
              ? "border-[#121312] bg-[#FFFFFF] text-[#121312] font-semibold"
              : "border-transparent text-[#63655E] hover:text-[#121312] hover:bg-[#F3F1EC]"
          }`}
          aria-selected={activeTab === "buy"}
          aria-label="Acquisitions (Buy)"
          role="tab"
        >
          Buy / For Sale
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("rent")}
          className={`flex-1 py-3.5 px-6 font-mono text-xs uppercase tracking-[0.14em] transition-all duration-200 border-b-2 text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] ${
            activeTab === "rent"
              ? "border-[#121312] bg-[#FFFFFF] text-[#121312] font-semibold"
              : "border-transparent text-[#63655E] hover:text-[#121312] hover:bg-[#F3F1EC]"
          }`}
          aria-selected={activeTab === "rent"}
          aria-label="Turnkey Leases (Rent)"
          role="tab"
        >
          Rent / To Let
        </button>
      </div>

      {/* Discovery Form */}
      <form onSubmit={handleSearch} className="p-4 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
          {/* Location Input */}
          <div className="sm:col-span-2 lg:col-span-4">
            <label
              htmlFor="quick-search-location"
              className="block text-[11px] font-mono uppercase tracking-[0.14em] text-[#4A4C48] mb-1.5 font-medium"
            >
              Location / Prime Enclave
            </label>
            <div className="relative">
              <input
                id="quick-search-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mayfair, Belgravia, SoHo, Tribeca..."
                className="w-full h-12 pl-10 pr-4 bg-[#FBFBF9] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans placeholder:text-[#8E8A80] focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
              />
              <svg
                className="w-4 h-4 text-[#8E8A80] absolute left-3.5 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
          </div>

          {/* Property Typology Selector */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label
              htmlFor="quick-search-type"
              className="block text-[11px] font-mono uppercase tracking-[0.14em] text-[#4A4C48] mb-1.5 font-medium"
            >
              Architectural Typology
            </label>
            <select
              id="quick-search-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full h-12 px-3 bg-[#FBFBF9] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
            >
              <option value="all">All Typologies</option>
              <option value="penthouse">Penthouses</option>
              <option value="townhouse">Townhouses</option>
              <option value="loft">Cast-Iron Lofts</option>
              <option value="apartment">Apartments</option>
              <option value="villa">Villas</option>
              <option value="estate">Estates</option>
            </select>
          </div>

          {/* Price Range Selector */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label
              htmlFor="quick-search-price"
              className="block text-[11px] font-mono uppercase tracking-[0.14em] text-[#4A4C48] mb-1.5 font-medium"
            >
              Price Range
            </label>
            <select
              id="quick-search-price"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full h-12 px-3 bg-[#FBFBF9] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
            >
              <option value="all">Any Price</option>
              <option value="1m-3m">£1M – £3M</option>
              <option value="3m-5m">£3M – £5M</option>
              <option value="5m-10m">£5M – £10M</option>
              <option value="10m-plus">£10M+</option>
            </select>
          </div>

          {/* Bedrooms Selector */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label
              htmlFor="quick-search-bedrooms"
              className="block text-[11px] font-mono uppercase tracking-[0.14em] text-[#4A4C48] mb-1.5 font-medium"
            >
              Bedrooms
            </label>
            <select
              id="quick-search-bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full h-12 px-3 bg-[#FBFBF9] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
            >
              <option value="all">Any Bedrooms</option>
              <option value="1">1+ Bedroom</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>

          {/* Search CTA */}
          <div className="sm:col-span-1 lg:col-span-2">
            <button
              type="submit"
              aria-label={
                activeTab === "buy"
                  ? "Explore Acquisitions — Search Properties"
                  : "Explore Leases — Search Properties"
              }
              className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
            >
              <span>Search Properties</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-4 pt-3.5 border-t border-[#E6E4DE]/60 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-[#8E8A80] text-[11px] uppercase tracking-wider mr-1">
            Popular:
          </span>
          {["Mayfair", "Belgravia", "Kensington", "Chelsea", "Cotswolds", "SoHo", "Tribeca"].map(
            (enclave) => (
              <button
                key={enclave}
                type="button"
                onClick={() => setLocation(enclave)}
                className={`px-2.5 py-1 rounded-xs text-[11px] transition-colors ${
                  location === enclave
                    ? "bg-[#121312] text-[#FBFBF9]"
                    : "bg-[#F3F1EC] text-[#4A4C48] hover:text-[#121312] hover:bg-[#E6E4DE]"
                }`}
              >
                {enclave}
              </button>
            )
          )}
        </div>
      </form>
    </div>
  );
}
