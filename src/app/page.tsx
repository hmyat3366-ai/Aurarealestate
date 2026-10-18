"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header, Footer, HeroArchitecturalBackground } from "@/components/layout";
import { QuickDiscoveryConsole } from "@/components/discovery/QuickDiscoveryConsole";
import { PropertyCard } from "@/components/discovery/PropertyCard";
import { PROPERTIES } from "@/data/properties";

// Curated architectural collections with direct discovery filters
const COLLECTIONS = [
  {
    id: "penthouses",
    title: "Penthouses of Mayfair & Tribeca",
    subtitle: "Skyline Pavilions with Wraparound Terraces",
    description:
      "Crowning landmark buildings with 360-degree panoramic skyline vistas, private lift access, and double-height entertaining salons.",
    href: "/buy?type=penthouse",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    typology: "Penthouse",
  },
  {
    id: "townhouses",
    title: "Historic Townhouses & Mansions",
    subtitle: "Regency & Georgian Architectural Provenance",
    description:
      "Multi-level private residences boasting original ceiling moldings, landscaped walled mews gardens, and comprehensive modern restorations.",
    href: "/buy?type=townhouse",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    typology: "Townhouse",
  },
  {
    id: "lofts",
    title: "Cast-Iron Lofts & Sanctuaries",
    subtitle: "SoHo & Tribeca Landmark Volumes",
    description:
      "Monumental 14-foot timber beams, fluted structural columns, and expansive gallery walls designed for museum-grade art collections.",
    href: "/buy?type=loft",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    typology: "Loft",
  },
  {
    id: "leases",
    title: "Turnkey Diplomatic & Corporate Leases",
    subtitle: "Serviced Prime Residences for Global Leaders",
    description:
      "Fully furnished, discrete executive residences with private 24/7 concierge, spa facilities, and flexible lease agreements.",
    href: "/rent",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    typology: "Turnkey Lease",
  },
];

// 6 Prime Neighborhoods with dual Buy / Rent navigation
const NEIGHBORHOODS = [
  {
    name: "Mayfair",
    city: "London",
    postcode: "W1",
    description:
      "The epicentre of London exclusivity, renowned for private member clubs, Michelin-starred gastronomy, and neoclassical garden squares.",
    buyHref: "/buy?location=Mayfair",
    rentHref: "/rent?location=Mayfair",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Belgravia",
    city: "London",
    postcode: "SW1",
    description:
      "Grand stucco-fronted Regency terraces, tranquil private mews, and diplomatic residences of international distinction.",
    buyHref: "/buy?location=Belgravia",
    rentHref: "/rent?location=Belgravia",
    image:
      "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Kensington",
    city: "London",
    postcode: "W8",
    description:
      "Royal palace gardens, cultural heritage institutions, and dignified red-brick Victorian and Queen Anne mansions.",
    buyHref: "/buy?location=Kensington",
    rentHref: "/rent?location=Kensington",
    image:
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Chelsea",
    city: "London",
    postcode: "SW3",
    description:
      "Artisanal heritage, Thames riverfront promenades, King's Road ateliers, and discreet artist studios.",
    buyHref: "/buy?location=Chelsea",
    rentHref: "/rent?location=Chelsea",
    image:
      "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Marylebone",
    city: "London",
    postcode: "W1U",
    description:
      "A distinguished urban village combining historic Georgian terraces, private medical enclaves, and bespoke boutiques.",
    buyHref: "/buy?location=Marylebone",
    rentHref: "/rent?location=Marylebone",
    image:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "SoHo",
    city: "New York",
    postcode: "10012",
    description:
      "Landmark cast-iron architectural district featuring cobblestone corridors, 14-foot ceiling lofts, and international art galleries.",
    buyHref: "/buy?location=SoHo",
    rentHref: "/rent?location=SoHo",
    image:
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80",
  },
];

// Services 4-Pillar Grid Data
const SERVICES = [
  {
    title: "Residential Sales",
    tagline: "Prime & Super-Prime Acquisitions",
    description:
      "Discreet brokerage for landmark townhouses, architectural lofts, and private country estates across London and New York.",
    href: "/services/residential-sales",
    cta: "Explore Sales Advisory",
  },
  {
    title: "Lettings & Management",
    tagline: "Turnkey Corporate & Diplomatic Leases",
    description:
      "Comprehensive tenancy curation, discrete asset stewardship, and fiduciary property management for discerning landlords.",
    href: "/services/lettings-management",
    cta: "Explore Prime Lettings",
  },
  {
    title: "Private Office & Acquisitions",
    tagline: "Confidential Family Office Counsel",
    description:
      "Specialist single-point advisory for international private clients, sovereign entities, and family offices managing global portfolios.",
    href: "/services/private-office",
    cta: "Engage Private Office",
  },
  {
    title: "Development Advisory",
    tagline: "Architectural & Masterplan Consulting",
    description:
      "Strategic pricing, spatial planning, monograph production, and global launches for prime residential development projects.",
    href: "/services/development-advisory",
    cta: "Development Advisory",
  },
];

// Heritage & Global Reach Metrics Bar
const METRICS = [
  {
    stat: "125+",
    label: "Years Heritage",
    description: "Founded on enduring curatorial and fiduciary standards.",
  },
  {
    stat: "500+",
    label: "Global Partners",
    description: "Seamless advisory reach across key financial capitals.",
  },
  {
    stat: "£1.4B+",
    label: "Transacted Volume",
    description: "Direct portfolio volume, part of £50B+ global partner alliances.",
  },
  {
    stat: "16,000+",
    label: "Property Specialists",
    description: "RICS chartered surveyors, valuers, and private brokers worldwide.",
  },
];

export default function HomePage() {
  const [listingCategory, setListingCategory] = useState<"all" | "prime_central" | "country_estates" | "penthouses">("all");
  const [dispatchEmail, setDispatchEmail] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "submitted">("idle");

  // Filter listings based on active tab
  const getFilteredProperties = () => {
    if (listingCategory === "prime_central") {
      return PROPERTIES.filter((p) =>
        ["Mayfair", "Belgravia", "Kensington", "Chelsea", "Marylebone"].includes(p.address.neighborhood)
      ).slice(0, 6);
    }
    if (listingCategory === "country_estates") {
      return PROPERTIES.filter((p) =>
        ["estate", "villa", "townhouse"].includes(p.propertyType)
      ).slice(0, 6);
    }
    if (listingCategory === "penthouses") {
      return PROPERTIES.filter((p) => p.propertyType === "penthouse").slice(0, 6);
    }
    return PROPERTIES.filter((p) => p.featured).slice(0, 6);
  };

  const displayedProperties = getFilteredProperties();

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dispatchEmail.trim() && dispatchEmail.includes("@")) {
      setDispatchStatus("submitted");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF9] text-[#121312]">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* 1. KNIGHT FRANK CINEMATIC HERO SECTION WITH FLOATING SEARCH CONSOLE */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-[#282A27] bg-[#121312] overflow-hidden">
          {/* Multi-Layer Ambient Background Architecture */}
          <HeroArchitecturalBackground
            ambientOpacity={0}
            showOverlay={false}
            style={{
              "--hero-bg-ivory": "#121312",
              "--hero-bg-alabaster": "#181A18",
              "--hero-grid-stroke": "rgba(197, 168, 128, 0.28)",
            } as React.CSSProperties}
          />

          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Eyebrow & Brand Authority */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#C5A880]" aria-hidden="true" />
              <p className="font-mono text-eyebrow-label uppercase tracking-[0.25em] text-[#C5A880] font-medium">
                AURA Real Estate • Private Office &amp; Curatorial Brokerage
              </p>
            </div>

            {/* Monumental Editorial Heading */}
            <div className="max-w-5xl mb-6">
              <h1 className="font-serif text-hero font-normal tracking-tight-editorial text-[#FBFBF9] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                Curators of Architectural Pedigree &amp; Historic Provenance.
              </h1>
            </div>

            {/* Refined Subtext */}
            <p className="font-sans text-body-large text-[#E6E4DE] max-w-lead leading-relaxed mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              Representing an uncompromising portfolio of historic townhouses, soaring cast-iron lofts, and rare private estates across London, New York, and Zurich. Driven by architectural discernment and strict fiduciary discretion.
            </p>

            {/* Knight Frank Floating Tabbed Search Console */}
            <div className="relative z-10 mb-8 sm:mb-10">
              <QuickDiscoveryConsole />
            </div>

            {/* Brand Essence Pillars directly derived from reference board */}
            <div className="relative z-10 pt-6 border-t border-[#282A27]/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-12 text-[#C5A880] font-mono text-[10px] sm:text-xs uppercase tracking-[0.28em] select-none">
              <span>PREMIUM</span>
              <span className="text-[#4A4C48] hidden sm:inline" aria-hidden="true">•</span>
              <span>ARCHITECTURAL</span>
              <span className="text-[#4A4C48] hidden sm:inline" aria-hidden="true">•</span>
              <span>DISCREET</span>
              <span className="text-[#4A4C48] hidden sm:inline" aria-hidden="true">•</span>
              <span>TIMELESS</span>
            </div>
          </div>
        </section>

        {/* 2. VALUATION & ADVISORY FEATURE CALLOUT STRIP */}
        <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-[#F3F1EC] border-b border-[#E6E4DE]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#121312] text-[#FBFBF9] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#FBFBF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-lg sm:text-xl text-[#121312] font-medium">
                  Thinking of selling or letting your home?
                </p>
                <p className="font-sans text-xs sm:text-sm text-[#4A4C48]">
                  Request a confidential market valuation from our local partners and chartered surveyors.
                </p>
              </div>
            </div>

            <Link
              href="/sell"
              className="inline-flex items-center justify-center h-11 px-6 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shrink-0 shadow-sm"
            >
              Request a Valuation &rarr;
            </Link>
          </div>
        </section>

        {/* 3. CURATED LISTINGS SECTION (KNIGHT FRANK FEATURED PROPERTIES WITH CATEGORY TABS) */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FBFBF9]">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-[#E6E4DE] pb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                  Curatorial Selection
                </span>
                <h2 className="font-serif text-section-title text-[#121312] font-normal tracking-tight-editorial">
                  Featured Private Portfolio
                </h2>
              </div>

              {/* Direct Route Links */}
              <div className="flex items-center gap-4">
                <Link
                  href="/buy"
                  className="font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors pb-1 border-b border-[#121312]"
                >
                  All Acquisitions ({PROPERTIES.filter((p) => p.listingType === "sale").length}) &rarr;
                </Link>
                <Link
                  href="/rent"
                  className="font-mono text-xs uppercase tracking-wider text-[#63655E] hover:text-[#121312] transition-colors pb-1 border-b border-[#E6E4DE]"
                >
                  Turnkey Leases ({PROPERTIES.filter((p) => p.listingType === "rent").length}) &rarr;
                </Link>
              </div>
            </div>

            {/* Knight Frank Style Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-[#E6E4DE] pb-4">
              {[
                { id: "all", label: "All Curated" },
                { id: "prime_central", label: "Prime Central" },
                { id: "country_estates", label: "Country Estates" },
                { id: "penthouses", label: "Penthouses" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setListingCategory(tab.id as typeof listingCategory)}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-xs transition-colors ${
                    listingCategory === tab.id
                      ? "bg-[#121312] text-[#FBFBF9] font-medium"
                      : "bg-[#FFFFFF] text-[#4A4C48] border border-[#E6E4DE] hover:border-[#121312] hover:text-[#121312]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Responsive 3-Column Knight Frank Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-14 text-center">
              <Link
                href="/buy"
                className="inline-flex items-center justify-center h-12 px-8 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm"
              >
                Discover Complete Private Catalog
              </Link>
            </div>
          </div>
        </section>

        {/* 4. CURATED ARCHITECTURAL COLLECTIONS */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-[#E6E4DE] pb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                  Architectural Typologies
                </span>
                <h2 className="font-serif text-section-title text-[#121312] font-normal tracking-tight-editorial">
                  Curated Collections
                </h2>
              </div>
              <p className="font-sans text-body-small text-[#4A4C48] max-w-md leading-relaxed">
                Every residence in our private inventory is cataloged by its spatial integrity, historical context, and curatorial significance.
              </p>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {COLLECTIONS.map((col) => (
                <Link
                  key={col.id}
                  href={col.href}
                  className="group flex flex-col bg-[#FBFBF9] border border-[#E6E4DE] overflow-hidden rounded-xs transition-all duration-300 hover:border-[#121312] hover:shadow-ambient-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F3F1EC]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 bg-[#121312]/90 backdrop-blur-sm text-[#FBFBF9] font-mono text-[10px] uppercase tracking-wider rounded-xs">
                        {col.typology}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#78542E] block mb-1">
                        {col.subtitle}
                      </span>
                      <h3 className="font-serif text-section-h3 text-[#121312] font-normal mb-3 group-hover:text-[#78542E] transition-colors">
                        {col.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-[#4A4C48] leading-relaxed mb-6">
                        {col.description}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-mono uppercase tracking-wider text-[#121312] group-hover:text-[#78542E] transition-colors pt-4 border-t border-[#E6E4DE]">
                      <span>Explore Collection</span>
                      <svg width="14" height="14" className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 5. DESTINATION & PRIME NEIGHBORHOODS MATRIX ("Explore by Location" bento grid with dual action buttons) */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FBFBF9]">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-[#E6E4DE] pb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                  District Profiles &amp; Enclaves
                </span>
                <h2 className="font-serif text-section-title text-[#121312] font-normal tracking-tight-editorial">
                  Neighborhood Vignettes
                </h2>
              </div>
              <p className="font-sans text-body-small text-[#4A4C48] max-w-md leading-relaxed">
                Curated neighborhood intelligence across London and New York. Discover prime properties filtered directly by postal district.
              </p>
            </div>

            {/* Vignettes Cards with Dual Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {NEIGHBORHOODS.map((hood) => (
                <div
                  key={hood.name}
                  className="group flex flex-col bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs overflow-hidden transition-all duration-300 hover:border-[#121312] hover:shadow-ambient-md"
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#F3F1EC]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hood.image}
                      alt={`${hood.name}, ${hood.city}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#121312]/80 backdrop-blur-sm px-2.5 py-1 text-[#FBFBF9] font-mono text-[10px] uppercase tracking-wider rounded-xs">
                      {hood.city} • {hood.postcode}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-serif text-section-h3 text-[#121312] font-normal mb-2">
                        {hood.name}
                      </h3>
                      <p className="font-sans text-xs text-[#4A4C48] leading-relaxed mb-6">
                        {hood.description}
                      </p>
                    </div>

                    {/* Dual Action Buttons: View for Sale & View to Rent */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E6E4DE] text-xs font-mono">
                      <Link
                        href={hood.buyHref}
                        className="text-center py-2.5 px-3 border border-[#E6E4DE] bg-[#FBFBF9] hover:bg-[#121312] hover:text-[#FBFBF9] text-[#121312] rounded-xs uppercase tracking-wider transition-colors"
                      >
                        View for Sale &rarr;
                      </Link>
                      <Link
                        href={hood.rentHref}
                        className="text-center py-2.5 px-3 border border-[#E6E4DE] bg-[#FBFBF9] hover:bg-[#121312] hover:text-[#FBFBF9] text-[#121312] rounded-xs uppercase tracking-wider transition-colors"
                      >
                        View to Rent &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. SERVICES & ADVISORY 4-PILLAR GRID */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-[#E6E4DE] pb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                  Practice Areas &amp; Stewardship
                </span>
                <h2 className="font-serif text-section-title text-[#121312] font-normal tracking-tight-editorial">
                  Services &amp; Advisory
                </h2>
              </div>
              <div className="flex flex-col md:items-end gap-2">
                <p className="font-sans text-body-small text-[#4A4C48] max-w-md leading-relaxed md:text-right">
                  Comprehensive advisory spanning private acquisitions, discreet sales, prime lettings, and development counsel.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors font-medium group"
                >
                  <span>Explore All Services</span>
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((srv) => (
                <Link
                  key={srv.title}
                  href={srv.href}
                  className="group flex flex-col justify-between p-6 sm:p-8 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs transition-all duration-300 hover:border-[#121312] hover:shadow-ambient-md hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
                >
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] block mb-2 font-medium">
                      {srv.tagline}
                    </span>
                    <h3 className="font-serif text-section-h3 text-[#121312] font-normal mb-3 group-hover:text-[#78542E] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#4A4C48] leading-relaxed mb-6">
                      {srv.description}
                    </p>
                  </div>

                  <div
                    className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-[#121312] group-hover:text-[#78542E] transition-colors pt-4 border-t border-[#E6E4DE]"
                  >
                    <span>{srv.cta}</span>
                    <svg
                      width="14"
                      height="14"
                      className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 7. MARKET INTELLIGENCE & RESEARCH ("The Wealth Report & Insights" editorial split) */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FBFBF9]">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-[#E6E4DE] pb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                  Global Intelligence &amp; Thought Leadership
                </span>
                <h2 className="font-serif text-section-title text-[#121312] font-normal tracking-tight-editorial">
                  The Wealth Report &amp; Insights
                </h2>
              </div>
              <div className="flex flex-col md:items-end gap-2">
                <p className="font-sans text-body-small text-[#4A4C48] max-w-md leading-relaxed md:text-right">
                  Definitive empirical market studies, prime residential indices, and private wealth capital flows authored by our global research partners.
                </p>
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors font-medium group"
                >
                  <span>Explore Research Archive</span>
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Editorial Split: Left Featured Publication, Right Stacked Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Left: Large Featured Publication Card */}
              <div className="lg:col-span-7 flex flex-col bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs overflow-hidden transition-all duration-300 hover:border-[#121312] hover:shadow-ambient-md">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F3F1EC]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                    alt="The Wealth Report 2026 cover"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-[#121312]/90 backdrop-blur-sm px-3 py-1 text-[#FBFBF9] font-mono text-[10px] uppercase tracking-wider rounded-xs">
                    Flagship Publication 2026
                  </div>
                </div>

                <div className="p-8 sm:p-10 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-[#78542E] block mb-2 font-medium">
                      Annual Global Intelligence
                    </span>
                    <h3 className="font-serif text-section-h3 text-[#121312] font-normal mb-4 leading-snug">
                      The Wealth Report: Global Super-Prime &amp; Heritage Real Estate Dynamics
                    </h3>
                    <p className="font-sans text-sm text-[#4A4C48] leading-relaxed mb-8">
                      Our definitive annual study tracking private wealth allocations, super-prime residential values, and architectural capital migration across London, New York, and European financial capitals.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#E6E4DE]">
                    <Link
                      href="/insights/wealth-report-2026"
                      className="inline-flex items-center justify-center h-11 px-6 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm"
                    >
                      Download Executive Summary
                    </Link>
                    <Link
                      href="/insights"
                      className="inline-flex items-center justify-center h-11 px-6 border border-[#E6E4DE] hover:border-[#121312] text-[#121312] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors"
                    >
                      Explore All Research &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right: 3-Item Stacked Research Feed */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                {[
                  {
                    category: "Prime Central London",
                    date: "October 2026",
                    readTime: "5 min read",
                    title: "PCL Capital Values & Yield Trajectories in Belgravia & Mayfair",
                    snippet:
                      "An analysis of transaction liquidity, international buyer origins, and price stability across London SW1 and W1 garden squares.",
                    href: "/insights/belgravia-mayfair-capital-values",
                  },
                  {
                    category: "Super-Prime Residential",
                    date: "September 2026",
                    readTime: "7 min read",
                    title: "The Global Super-Prime Frontier: Penthouse Valuations Across Leading Financial Capitals",
                    snippet:
                      "Tracking landmark transactions exceeding £10M in London and $15M in Manhattan across landmark developments.",
                    href: "/insights/global-super-prime-penthouse-valuations",
                  },
                  {
                    category: "Architectural Preservation",
                    date: "August 2026",
                    readTime: "4 min read",
                    title: "Regency Provenance: Why Listed Heritage Facades Command a 28% Value Premium",
                    snippet:
                      "Evaluating the structural asset durability and historic preservation premiums of Grade I and Grade II* listed buildings.",
                    href: "/insights/regency-provenance-listed-heritage-facades",
                  },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group p-6 bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs transition-all duration-300 hover:border-[#121312] hover:shadow-ambient-sm flex flex-col justify-between flex-1"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-[#78542E] mb-2">
                        <span className="uppercase tracking-wider font-medium">{item.category}</span>
                        <span className="text-[#D5D1C7]">•</span>
                        <span className="text-[#8E8A80]">{item.date}</span>
                        <span className="text-[#D5D1C7]">•</span>
                        <span className="text-[#8E8A80]">{item.readTime}</span>
                      </div>
                      <h3 className="font-serif text-card-title text-[#121312] font-normal group-hover:text-[#78542E] transition-colors leading-snug mb-2">
                        {item.title}
                      </h3>
                      <p className="font-sans text-xs text-[#4A4C48] leading-relaxed line-clamp-2">
                        {item.snippet}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-mono uppercase tracking-wider text-[#121312] group-hover:text-[#78542E] transition-colors pt-3 mt-3 border-t border-[#E6E4DE]/60">
                      <span>Read Insight</span>
                      <svg width="14" height="14" className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. HERITAGE & GLOBAL REACH METRICS BAR + AGENCY MANIFESTO */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#121312] text-[#FBFBF9]">
          <div className="max-w-7xl mx-auto">
            {/* Top 4 Metrics Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-16 border-b border-[#282A27] mb-16">
              {METRICS.map((metric) => (
                <div key={metric.label} className="p-6 bg-[#1D1F1C] border border-[#4A4C48]/60 rounded-xs">
                  <p className="font-serif text-3xl sm:text-4xl text-[#FBFBF9] mb-1 font-normal">
                    {metric.stat}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] mb-2 font-medium">
                    {metric.label}
                  </p>
                  <p className="font-sans text-xs text-[#8E8A80] leading-relaxed">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Manifesto Statement & Fiduciary Standards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-[#78542E]" aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#78542E]">
                    Agency Manifesto • Fiduciary Standards
                  </span>
                </div>
                <h2 className="font-serif text-section-title text-[#FBFBF9] font-normal tracking-tight-editorial">
                  Private Exclusive Representation. Without Compromise.
                </h2>
                <blockquote className="font-serif italic text-lg sm:text-xl text-[#D5D1C7] border-l-2 border-[#78542E] pl-6 py-1 leading-relaxed">
                  &ldquo;We reject the commodification of architecture. Exceptional residences are not mere inventory—they are cultural assets deserving curatorial discretion, bespoke monograph documentation, and direct partner stewardship.&rdquo;
                </blockquote>
                <p className="font-sans text-xs sm:text-sm text-[#8E8A80] leading-relaxed">
                  Julian Vane &amp; Eleanor Sterling — Founding Partners
                </p>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    href="/sell"
                    className="inline-flex items-center justify-center h-12 px-6 bg-[#78542E] hover:bg-[#614324] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors"
                  >
                    Sell with Us (Valuation Consultation)
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center h-12 px-6 border border-[#4A4C48] text-[#FBFBF9] hover:bg-[#282A27] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors"
                  >
                    Consult an Advisor
                  </Link>
                </div>
              </div>

              {/* Fiduciary Pillars Grid */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-6 bg-[#1D1F1C] border border-[#4A4C48]/60 rounded-xs">
                  <p className="font-serif text-3xl sm:text-4xl text-[#FBFBF9] mb-1 font-normal">
                    100%
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] mb-2 font-medium">
                    Private Representation
                  </p>
                  <p className="font-sans text-xs text-[#8E8A80] leading-relaxed">
                    No unsolicited syndication or unauthorized public exposure.
                  </p>
                </div>

                <div className="p-6 bg-[#1D1F1C] border border-[#4A4C48]/60 rounded-xs">
                  <p className="font-serif text-3xl sm:text-4xl text-[#FBFBF9] mb-1 font-normal">
                    RICS
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] mb-2 font-medium">
                    Chartered Standards
                  </p>
                  <p className="font-sans text-xs text-[#8E8A80] leading-relaxed">
                    Regulated by the Royal Institution of Chartered Surveyors.
                  </p>
                </div>

                <div className="p-6 bg-[#1D1F1C] border border-[#4A4C48]/60 rounded-xs">
                  <p className="font-serif text-3xl sm:text-4xl text-[#FBFBF9] mb-1 font-normal">
                    24h
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] mb-2 font-medium">
                    Advisory SLA
                  </p>
                  <p className="font-sans text-xs text-[#8E8A80] leading-relaxed">
                    Direct senior partner response on all confidential inquiries.
                  </p>
                </div>

                <div className="p-6 bg-[#1D1F1C] border border-[#4A4C48]/60 rounded-xs">
                  <p className="font-serif text-3xl sm:text-4xl text-[#FBFBF9] mb-1 font-normal">
                    Global
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] mb-2 font-medium">
                    Private Office Reach
                  </p>
                  <p className="font-sans text-xs text-[#8E8A80] leading-relaxed">
                    Connecting capital across London, New York, and Zurich.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. PRIVATE ADVISORY & NEWSLETTER DISPATCH MODULE */}
        <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F3F1EC] border-b border-[#E6E4DE]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-3 font-medium">
              Editorial Dispatches &amp; Market Intelligence
            </span>
            <h2 className="font-serif text-section-title text-[#121312] font-normal tracking-tight-editorial mb-4">
              The Private Client Dispatch
            </h2>
            <p className="font-sans text-body-regular text-[#4A4C48] max-w-xl mx-auto leading-relaxed mb-8">
              Subscribe to receive confidential quarterly market intelligence, bespoke architectural monographs, and unlisted off-market opportunities directly to your inbox.
            </p>

            {dispatchStatus === "submitted" ? (
              <div className="p-6 bg-[#FFFFFF] border border-[#78542E] rounded-xs max-w-md mx-auto" role="status">
                <p className="font-serif text-lg text-[#121312] mb-1 font-medium">
                  Subscription Confirmed
                </p>
                <p className="font-sans text-xs text-[#4A4C48]">
                  Thank you. Your private subscription has been registered. You will receive our next quarterly market dispatch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDispatchSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={dispatchEmail}
                  onChange={(e) => setDispatchEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-grow h-12 px-4 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans placeholder:text-[#8E8A80] focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
                  aria-label="Private email address for editorial dispatch"
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shrink-0 shadow-sm"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="font-sans text-[11px] text-[#8E8A80] mt-4">
              Strict confidentiality guaranteed. We never syndicate or share private client contact details.
            </p>
          </div>
        </section>
      </main>

      {/* 10. COMPREHENSIVE MULTI-COLUMN FOOTER */}
      <Footer />
    </div>
  );
}
