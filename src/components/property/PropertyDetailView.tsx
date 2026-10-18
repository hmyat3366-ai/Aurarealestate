"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Property } from "@/types/property";
import { TourType } from "@/types/inquiry";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PhotoGallery } from "./PhotoGallery";
import { FactsBar } from "./FactsBar";
import { AmenitiesList } from "./AmenitiesList";
import { AgentCard } from "./AgentCard";
import { ViewingModal } from "@/components/inquiry/ViewingModal";
import { formatPrice, formatPricePerSqft, formatPriceCompact } from "@/lib/formatters";
import { useFavorites } from "@/context/FavoritesContext";
import { AuthContext } from "@/context/AuthContext";

export interface PropertyDetailViewProps {
  property: Property;
}

export function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const authContext = useContext(AuthContext);
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(property.id);
  const searchParams = useSearchParams();

  // Viewing modal control
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [modalTourType, setModalTourType] = useState<TourType>("in-person");
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (authContext && !authContext.isAuthenticated) {
      try {
        localStorage.setItem("aura_pending_save", property.id);
      } catch {
        // Ignore storage errors
      }
      const currentUrl =
        pathname ||
        (typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : `/properties/${property.slug || property.id}`);
      router.push(
        `/auth/signin?returnUrl=${encodeURIComponent(currentUrl)}&intent=save&propertyId=${encodeURIComponent(property.id)}`
      );
      return;
    }
    toggleFavorite(property.id);
  };

  // Auto-open viewing modal if return URL specifies action=viewing or viewing=true
  useEffect(() => {
    const action = searchParams?.get("action");
    const viewing = searchParams?.get("viewing");
    const requestedTourType = searchParams?.get("tourType") as TourType;
    if (requestedTourType === "video" || requestedTourType === "in-person") {
      setModalTourType(requestedTourType);
    }
    if (action === "viewing" || viewing === "true" || action === "schedule") {
      setIsViewingModalOpen(true);
    }
  }, [searchParams]);

  const openViewingModal = (type: TourType = "in-person") => {
    setModalTourType(type);
    setIsViewingModalOpen(true);
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const isRental = property.listingType === "rent";
  const parentFlowUrl = isRental ? "/rent" : "/buy";
  const parentFlowLabel = isRental ? "Leasing" : "Acquisitions";

  // Badge mapping
  const getBadgeVariant = (status: Property["status"]) => {
    switch (status) {
      case "Private Exclusive":
        return "private_exclusive";
      case "Coming Soon":
        return "coming_soon";
      case "Price Improvement":
        return "price_improvement";
      case "Under Contract":
        return "under_contract";
      case "Active":
      default:
        return "active";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-16">
      {/* ========================================================================= */}
      {/* 1. BREADCRUMBS NAVIGATION                                                 */}
      {/* ========================================================================= */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#63655E]">
          <li>
            <Link
              href="/"
              className="hover:text-[#121312] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] rounded-xs"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#D5D1C7]">/</li>
          <li>
            <Link
              href={parentFlowUrl}
              className="hover:text-[#121312] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] rounded-xs"
            >
              {parentFlowLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#D5D1C7]">/</li>
          <li>
            <Link
              href={`${parentFlowUrl}?location=${encodeURIComponent(property.address.neighborhood)}`}
              className="hover:text-[#121312] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] rounded-xs"
            >
              {property.address.neighborhood}
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#D5D1C7]">/</li>
          <li className="text-[#121312] font-medium truncate max-w-[200px] sm:max-w-xs" aria-current="page">
            {property.title}
          </li>
        </ol>
      </nav>

      {/* ========================================================================= */}
      {/* 2. EDITORIAL PROPERTY HEADER                                              */}
      {/* ========================================================================= */}
      <header className="mb-8 pb-6 border-b border-[#E6E4DE] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* Status & Exclusivity Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant={getBadgeVariant(property.status)}>
              {property.status}
            </Badge>
            {property.status === "Private Exclusive" && (
              <span className="font-mono text-[9px] uppercase tracking-wider bg-[#121312] text-[#FBFBF9] px-2.5 py-0.5 rounded-xs">
                Agency Exclusive
              </span>
            )}
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#78542E] bg-[#F4EDE2] px-2.5 py-0.5 rounded-xs">
              {isRental ? "Leasing Portfolio" : "Acquisitions Portfolio"}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-page-title font-normal text-[#121312] tracking-tight-editorial leading-tight">
            {property.title}
          </h1>

          {/* Subtitle / Narrative Anchor */}
          {property.subtitle && (
            <p className="mt-2 font-serif text-body-large text-[#63655E] italic max-w-lead">
              {property.subtitle}
            </p>
          )}

          {/* Address */}
          <p className="mt-2 font-sans text-body-small text-[#4A4C48] flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#78542E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>
              {property.address.street}
              {property.address.unit ? `, Unit ${property.address.unit}` : ""} — {property.address.neighborhood}, {property.address.city} {property.address.postalCode}
            </span>
          </p>
        </div>

        {/* Action Controls: Save & Share */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={saved ? `Remove ${property.title} from saved residences` : `Save ${property.title}`}
            aria-pressed={saved}
            className={`h-11 px-4 border rounded-xs font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              saved
                ? "bg-[#F4EDE2] border-[#D5C2A5] text-[#78542E]"
                : "bg-[#FFFFFF] border-[#E6E4DE] text-[#121312] hover:bg-[#FBFBF9]"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312]`}
          >
            <svg
              className={`w-4 h-4 ${saved ? "fill-[#78542E] text-[#78542E]" : "fill-none text-[#4A4C48]"}`}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span>{saved ? "Saved" : "Save Residence"}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share property link"
            className="h-11 px-4 bg-[#FFFFFF] border border-[#E6E4DE] hover:bg-[#FBFBF9] text-[#121312] rounded-xs font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312]"
          >
            <svg className="w-4 h-4 text-[#4A4C48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            <span>{copyFeedback ? "Copied Link!" : "Share"}</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. PHOTO GALLERY (Hero Mosaic + Mobile Carousel + Lightbox)               */}
      {/* ========================================================================= */}
      <PhotoGallery images={property.images} title={property.title} />

      {/* ========================================================================= */}
      {/* 4. STRUCTURED FACTS BAR                                                   */}
      {/* ========================================================================= */}
      <div className="my-8">
        <FactsBar property={property} />
      </div>

      {/* ========================================================================= */}
      {/* 5. TWO-COLUMN EDITORIAL ARRANGEMENT                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-10">
        {/* ======================================================================= */}
        {/* MAIN COLUMN (8 cols): Narrative, Amenities, Neighborhood, Specifications */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 space-y-12">
          {/* Architectural Narrative Description */}
          <section aria-labelledby="narrative-heading">
            <div className="border-b border-[#E6E4DE] pb-3 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#78542E]">
                Curation & Pedigree
              </span>
              <h2 id="narrative-heading" className="font-serif text-2xl lg:text-3xl font-normal text-[#121312] mt-1">
                Architectural Narrative & Design Overview
              </h2>
            </div>

            <div className="prose prose-neutral max-w-none space-y-4 font-sans text-sm sm:text-base text-[#4A4C48] leading-relaxed">
              {property.description && property.description.length > 0 ? (
                property.description.map((paragraph, idx) => (
                  <p key={idx} className="first-letter:font-serif first-letter:text-2xl first-letter:font-medium first-letter:mr-0.5">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>
                  Full architectural overview and interior specifications available upon consultation with the dedicated advisor.
                </p>
              )}
            </div>
          </section>

          {/* Categorized Amenities Matrix */}
          <AmenitiesList amenities={property.amenities} />

          {/* Neighborhood & Environs Context */}
          <section className="bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs p-6 sm:p-8" aria-labelledby="neighborhood-heading">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E6E4DE] pb-4 mb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#78542E]">
                  Environs & Locale
                </span>
                <h2 id="neighborhood-heading" className="font-serif text-section-title font-normal text-[#121312] mt-1">
                  {property.address.neighborhood}, {property.address.city}
                </h2>
              </div>
              {property.address.coordinates && (
                <span className="font-mono text-xs text-[#8E8A80]">
                  {property.address.coordinates.lat.toFixed(4)}° N, {Math.abs(property.address.coordinates.lng).toFixed(4)}° {property.address.coordinates.lng < 0 ? "W" : "E"}
                </span>
              )}
            </div>

            <p className="font-sans text-body-regular text-[#4A4C48] leading-relaxed mb-6">
              Situated in the historic heart of {property.address.neighborhood}, this residence enjoys immediate proximity to renowned cultural institutions, distinguished Michelin-starred dining, private gardens, and premier boutiques.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E6E4DE] text-xs font-mono">
              <div>
                <span className="text-[#8E8A80] block text-[10px] uppercase">Walkability</span>
                <span className="text-[#121312] font-semibold mt-0.5 block">98 / 100 Walker&apos;s Paradise</span>
              </div>
              <div>
                <span className="text-[#8E8A80] block text-[10px] uppercase">Transit Access</span>
                <span className="text-[#121312] font-semibold mt-0.5 block">100 / 100 Rider&apos;s Paradise</span>
              </div>
              <div>
                <span className="text-[#8E8A80] block text-[10px] uppercase">Historic District</span>
                <span className="text-[#121312] font-semibold mt-0.5 block">Designated Landmark</span>
              </div>
              <div>
                <span className="text-[#8E8A80] block text-[10px] uppercase">Listing Status</span>
                <span className="text-[#78542E] font-semibold mt-0.5 block">{property.status}</span>
              </div>
            </div>
          </section>

          {/* Spatial & Legal Details Table */}
          <section className="border border-[#E6E4DE] rounded-xs overflow-hidden" aria-labelledby="specs-heading">
            <div className="bg-[#FBFBF9] px-6 py-4 border-b border-[#E6E4DE]">
              <h3 id="specs-heading" className="font-serif text-section-h3 text-[#121312] font-medium">
                Property Specifications &amp; Administrative Records
              </h3>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:gap-x-8 px-6 py-4 text-xs font-sans">
              <div className="py-2.5 flex justify-between border-b border-[#E6E4DE]">
                <dt className="text-[#63655E]">Property Identifier</dt>
                <dd className="font-mono text-[#121312] uppercase">{property.id}</dd>
              </div>
              <div className="py-2.5 flex justify-between border-b border-[#E6E4DE]">
                <dt className="text-[#63655E]">Typology</dt>
                <dd className="font-medium text-[#121312] capitalize">{property.propertyType}</dd>
              </div>
              <div className="py-2.5 flex justify-between border-b border-[#E6E4DE]">
                <dt className="text-[#63655E]">Construction Year</dt>
                <dd className="font-mono text-[#121312]">{property.yearBuilt}</dd>
              </div>
              <div className="py-2.5 flex justify-between border-b border-[#E6E4DE]">
                <dt className="text-[#63655E]">Interior Scale</dt>
                <dd className="font-mono text-[#121312]">{property.squareFeet.toLocaleString()} sq ft</dd>
              </div>
              <div className="py-2.5 flex justify-between border-b border-[#E6E4DE]">
                <dt className="text-[#63655E]">Agency Exclusivity</dt>
                <dd className="text-[#78542E] font-medium">Sole Mandate</dd>
              </div>
              <div className="py-2.5 flex justify-between border-b border-[#E6E4DE]">
                <dt className="text-[#63655E]">Viewing Requirement</dt>
                <dd className="text-[#121312]">24-Hour Notice Required</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* ======================================================================= */}
        {/* STICKY SIDEBAR (4 cols): Pricing, Booking CTAs, Listing Advisor          */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4" aria-label="Acquisition and Advisor Summary">
          <div className="sticky top-24 space-y-6">
            {/* Price & Booking Card */}
            <div className="bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs p-6 shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] bg-[#F4EDE2] px-2.5 py-1 rounded-xs inline-block mb-3">
                {isRental ? "Turnkey Lease Mandate" : "Offered For Acquisition"}
              </span>

              {/* Price Display */}
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-serif text-property-price font-medium text-[#121312] tracking-tight">
                  {formatPrice(property.price)}
                </span>
                {!isRental && property.pricePerSqFt && (
                  <span className="font-mono text-xs text-[#63655E]">
                    {formatPricePerSqft(property.pricePerSqFt, property.price.currency)}
                  </span>
                )}
              </div>

              {/* Rental Details Subline */}
              {isRental && property.rentalDetails && (
                <div className="mt-3 pt-3 border-t border-[#E6E4DE] text-xs font-sans text-[#63655E] space-y-1">
                  <div className="flex justify-between">
                    <span>Lease Term:</span>
                    <span className="font-medium text-[#121312]">{property.rentalDetails.leaseTerm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span className="font-mono text-[#121312]">
                      {formatPrice({ amount: property.rentalDetails.depositAmount, currency: property.price.currency })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Furnished Status:</span>
                    <span className="font-medium text-[#121312]">{property.rentalDetails.furnished ? "Fully Furnished" : "Unfurnished"}</span>
                  </div>
                </div>
              )}

              {/* Primary & Secondary Action CTAs */}
              <div className="mt-6 space-y-3">
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  onClick={() => openViewingModal("in-person")}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  }
                >
                  Schedule Private Viewing
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => openViewingModal("video")}
                  leftIcon={
                    <svg className="w-4 h-4 text-[#78542E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  }
                >
                  Request Video Walkthrough
                </Button>
              </div>

              {/* Fiduciary Assurance / Trust Signal */}
              <p className="mt-4 text-[11px] font-sans text-[#8E8A80] text-center leading-normal">
                Direct consultation with exclusive partner. Private showings subject to 24h advance manual confirmation.
              </p>
            </div>

            {/* Listing Advisor Card */}
            <AgentCard
              agent={property.agent}
              propertyTitle={property.title}
              onInquire={() => openViewingModal("in-person")}
            />
          </div>
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* 6. MOBILE STICKY BOTTOM ACTION BAR                                        */}
      {/* ========================================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E6E4DE] px-4 py-3 flex items-center justify-between shadow-ambient-lg backdrop-blur-xs">
        <div>
          <span className="block font-serif text-lg font-medium text-[#121312] leading-none">
            {formatPriceCompact(property.price)}
          </span>
          <span className="block font-mono text-[10px] text-[#63655E] mt-0.5">
            {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bds`} • {property.bathrooms} ba
          </span>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => openViewingModal("in-person")}
        >
          Schedule Viewing
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 7. VIEWING REQUEST MODAL (Pending Confirmation Workflow)                  */}
      {/* ========================================================================= */}
      <ViewingModal
        isOpen={isViewingModalOpen}
        onClose={() => setIsViewingModalOpen(false)}
        property={property}
        initialTourType={modalTourType}
      />
    </div>
  );
}
