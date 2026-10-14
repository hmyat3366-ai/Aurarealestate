"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  CheckCircle,
  FileText,
  Building,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { Property } from "@/types/property";
import PropertyGallery from "./PropertyGallery";
import StickyInquiryPanel from "./StickyInquiryPanel";
import ViewingModal from "./ViewingModal";
import PropertyCard from "./PropertyCard";
import { formatPrice } from "@/lib/utils";

interface PropertyDetailClientProps {
  property: Property;
  relatedProperties: Property[];
}

export default function PropertyDetailClient({
  property,
  relatedProperties,
}: PropertyDetailClientProps) {
  const [viewingModalOpen, setViewingModalOpen] = useState(false);

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-agency-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-agency-950 transition-colors">
              Home
            </Link>
          </li>
          <li>&bull;</li>
          <li>
            <Link
              href={property.purpose === "sale" ? "/buy" : "/rent"}
              className="hover:text-agency-950 transition-colors"
            >
              {property.purpose === "sale" ? "Buy" : "Rent"}
            </Link>
          </li>
          <li>&bull;</li>
          <li>
            <Link
              href={`/locations/${property.location.neighborhood.toLowerCase()}`}
              className="hover:text-agency-950 transition-colors"
            >
              {property.location.neighborhood}
            </Link>
          </li>
          <li>&bull;</li>
          <li className="text-agency-900 font-medium truncate max-w-xs">
            {property.title}
          </li>
        </ol>
      </nav>

      {/* Header Info (Title, Location, Price) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-border-subtle gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-3 text-xs text-agency-600 mb-2">
            <span className="font-semibold uppercase tracking-widest text-accent-600">
              {property.purpose === "sale" ? "Prime Acquisition" : "Executive Letting"}
            </span>
            <span>&bull;</span>
            <span className="font-mono text-agency-500">REF: {property.reference}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-agency-950 font-normal leading-tight">
            {property.title}
          </h1>

          <div className="flex items-center text-sm text-agency-600 mt-2">
            <MapPin className="w-4 h-4 mr-1.5 text-accent-500 shrink-0" />
            <span>
              {property.location.address}, {property.location.neighborhood}, {property.location.city} {property.location.postalCode}
            </span>
          </div>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="block text-xs uppercase tracking-wider text-agency-500 font-medium">
            {property.purpose === "sale" ? "Guide Price" : "Rental Value"}
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-agency-950 tracking-tight">
            {formatPrice(
              property.price,
              property.purpose,
              property.pricePeriod,
              property.currency
            )}
          </div>
          {property.furnishedStatus && (
            <span className="text-xs text-agency-500 block mt-0.5">
              Furnishing: {property.furnishedStatus}
            </span>
          )}
        </div>
      </div>

      {/* Editorial Photo Gallery Mosaic */}
      <PropertyGallery images={property.images} title={property.title} />

      {/* Main Content & Sticky Inquiry Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-14 items-start">
        {/* Left 2 Columns: Description, Key Features, Specifications */}
        <div className="lg:col-span-2 space-y-12">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-5 bg-surface-canvas rounded-lg border border-border-subtle shadow-subtle">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-medium text-agency-500 flex items-center">
                <Bed className="w-3.5 h-3.5 mr-1 text-accent-500" />
                <span>Bedrooms</span>
              </span>
              <p className="text-lg sm:text-xl font-semibold text-agency-950">
                {property.bedrooms}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-medium text-agency-500 flex items-center">
                <Bath className="w-3.5 h-3.5 mr-1 text-accent-500" />
                <span>Bathrooms</span>
              </span>
              <p className="text-lg sm:text-xl font-semibold text-agency-950">
                {property.bathrooms}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-medium text-agency-500 flex items-center">
                <Maximize2 className="w-3.5 h-3.5 mr-1 text-accent-500" />
                <span>Internal Area</span>
              </span>
              <p className="text-lg sm:text-xl font-semibold text-agency-950">
                {property.areaSqFt.toLocaleString()}{" "}
                <span className="text-xs font-normal text-agency-500">sq ft</span>
              </p>
            </div>

            <div className="space-y-1 hidden sm:block">
              <span className="text-[11px] uppercase tracking-wider font-medium text-agency-500 flex items-center">
                <Building className="w-3.5 h-3.5 mr-1 text-accent-500" />
                <span>Type</span>
              </span>
              <p className="text-lg sm:text-xl font-semibold text-agency-950 capitalize">
                {property.propertyType}
              </p>
            </div>
          </div>

          {/* Editorial Description */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-agency-950 font-normal">
              Property Overview
            </h2>
            <div className="prose prose-agency text-agency-700 leading-relaxed text-base space-y-4">
              <p>{property.description}</p>
            </div>
          </section>

          {/* Key Architectural Features */}
          <section className="space-y-4 pt-6 border-t border-border-subtle">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-accent-600" />
              <h2 className="font-serif text-2xl text-agency-950 font-normal">
                Architectural & Interior Highlights
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {property.features.map((feat) => (
                <div
                  key={feat}
                  className="flex items-start space-x-2.5 p-3 rounded bg-surface-canvas border border-border-subtle text-xs text-agency-800"
                >
                  <CheckCircle className="w-4 h-4 text-accent-600 shrink-0 mt-0.5" />
                  <span className="leading-normal">{feat}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Amenities & Services */}
          <section className="space-y-4 pt-6 border-t border-border-subtle">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-accent-600" />
              <h2 className="font-serif text-2xl text-agency-950 font-normal">
                Amenities & Building Services
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-surface-canvas border border-border-strong text-agency-800"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </section>

          {/* Technical Specifications Table */}
          <section className="space-y-4 pt-6 border-t border-border-subtle">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-accent-600" />
              <h2 className="font-serif text-2xl text-agency-950 font-normal">
                Property Specifications & Tenure
              </h2>
            </div>
            <div className="bg-surface-canvas rounded-lg border border-border-subtle overflow-hidden text-xs">
              <div className="divide-y divide-border-subtle">
                <div className="flex justify-between py-3 px-4">
                  <span className="text-agency-500 font-medium">Property Reference</span>
                  <span className="font-mono text-agency-900 font-semibold">{property.reference}</span>
                </div>
                {property.tenure && (
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-agency-500 font-medium">Tenure</span>
                    <span className="text-agency-900 font-medium">{property.tenure}</span>
                  </div>
                )}
                {property.epcRating && (
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-agency-500 font-medium">Energy Performance (EPC)</span>
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                      Band {property.epcRating}
                    </span>
                  </div>
                )}
                {property.councilTaxBand && (
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-agency-500 font-medium">Local Authority & Council Tax</span>
                    <span className="text-agency-900 font-medium">{property.councilTaxBand}</span>
                  </div>
                )}
                {property.serviceCharge && (
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-agency-500 font-medium">Service Charge</span>
                    <span className="text-agency-900 font-medium">{property.serviceCharge}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 px-4">
                  <span className="text-agency-500 font-medium">Total Metric Floor Area</span>
                  <span className="text-agency-900 font-medium">{property.areaSqM} sq meters</span>
                </div>
                <div className="flex justify-between py-3 px-4">
                  <span className="text-agency-500 font-medium">Representation</span>
                  <span className="text-agency-900 font-medium">Exclusive Agency Direct Mandate</span>
                </div>
              </div>
            </div>
          </section>

          {/* Location & Neighborhood Context */}
          <section className="space-y-4 pt-6 border-t border-border-subtle">
            <h2 className="font-serif text-2xl text-agency-950 font-normal">
              The Neighborhood
            </h2>
            <p className="text-sm text-agency-600 leading-relaxed">
              Situated in the esteemed district of {property.location.neighborhood}, the property enjoys swift access to world-class private clubs, international designer boutiques, manicured royal parks, and celebrated Michelin-starred dining.
            </p>
            <div className="pt-2">
              <Link
                href={`/locations/${property.location.neighborhood.toLowerCase()}`}
                className="text-xs font-semibold uppercase tracking-wider text-accent-600 hover:text-accent-700 underline"
              >
                Read full {property.location.neighborhood} area guide &rarr;
              </Link>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Inquiry & Advisory Panel */}
        <div className="lg:col-span-1">
          <StickyInquiryPanel
            property={property}
            onRequestViewing={() => setViewingModalOpen(true)}
          />
        </div>
      </div>

      {/* Related Properties */}
      {relatedProperties.length > 0 && (
        <section className="mt-24 pt-12 border-t border-border-subtle">
          <div className="mb-8">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
              Curated Recommendations
            </span>
            <h2 className="font-serif text-3xl text-agency-950 font-normal mt-1">
              Similar Prime Residences
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProperties.map((rel) => (
              <PropertyCard key={rel.id} property={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-canvas/95 backdrop-blur-md border-t border-border-subtle p-4 flex items-center justify-between gap-3 shadow-hover">
        <div>
          <span className="text-[10px] text-agency-500 uppercase tracking-wider block">
            {property.purpose === "sale" ? "Guide Price" : "Asking Rent"}
          </span>
          <span className="text-base font-semibold text-agency-950">
            {formatPrice(
              property.price,
              property.purpose,
              property.pricePeriod,
              property.currency
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setViewingModalOpen(true)}
          className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-accent-500 hover:bg-accent-600 rounded transition-colors flex items-center"
        >
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          <span>Request Viewing</span>
        </button>
      </div>

      {/* Viewing Request Modal */}
      <ViewingModal
        property={property}
        isOpen={viewingModalOpen}
        onClose={() => setViewingModalOpen(false)}
      />
    </div>
  );
}
