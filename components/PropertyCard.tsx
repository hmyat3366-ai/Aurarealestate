"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Bed, Bath, Maximize2, MapPin } from "lucide-react";
import { Property } from "@/types/property";
import { formatPrice, formatArea, getStoredShortlist, toggleStoredShortlist } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  className?: string;
  priority?: boolean;
}

export default function PropertyCard({
  property,
  className = "",
  priority = false,
}: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const list = getStoredShortlist();
    setIsSaved(list.includes(property.id));

    const handleUpdate = () => {
      setIsSaved(getStoredShortlist().includes(property.id));
    };

    window.addEventListener("shortlist_updated", handleUpdate);
    return () => window.removeEventListener("shortlist_updated", handleUpdate);
  }, [property.id]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleStoredShortlist(property.id);
    setIsSaved(updated.includes(property.id));
  };

  const getStatusBadge = () => {
    switch (property.status) {
      case "under_offer":
        return (
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-agency-800/90 text-white backdrop-blur-sm rounded">
            Under Offer
          </span>
        );
      case "let_agreed":
        return (
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-agency-800/90 text-white backdrop-blur-sm rounded">
            Let Agreed
          </span>
        );
      case "sold":
        return (
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-agency-900/90 text-white backdrop-blur-sm rounded">
            Sold
          </span>
        );
      default:
        return property.purpose === "rent" && property.availableDate ? (
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-white/95 text-agency-900 shadow-sm backdrop-blur-sm rounded">
            Avail: {property.availableDate}
          </span>
        ) : null;
    }
  };

  return (
    <article
      className={`group relative bg-surface-canvas rounded-lg overflow-hidden border border-border-subtle shadow-subtle hover:shadow-hover transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Property Image Container */}
      <Link
        href={`/properties/${property.slug}`}
        className="relative block w-full aspect-[4/3] overflow-hidden bg-agency-100"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-agency-950/80 text-white backdrop-blur-sm rounded">
            {property.purpose === "sale" ? "For Sale" : "To Let"}
          </span>
          {getStatusBadge()}
        </div>

        {/* Shortlist Bookmark Toggle */}
        <button
          type="button"
          onClick={handleToggleSave}
          aria-label={isSaved ? `Remove ${property.title} from shortlist` : `Save ${property.title} to shortlist`}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            isSaved
              ? "bg-accent-500 text-white shadow-md"
              : "bg-white/80 hover:bg-white text-agency-800 hover:text-accent-500 backdrop-blur-sm shadow-sm"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
        </button>
      </Link>

      {/* Property Info Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location / Neighborhood */}
          <div className="flex items-center text-xs text-agency-500 font-medium tracking-wide mb-1.5">
            <MapPin className="w-3.5 h-3.5 mr-1 text-accent-500 shrink-0" />
            <span>
              {property.location.neighborhood}, {property.location.city}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg sm:text-xl font-medium text-agency-950 group-hover:text-accent-600 transition-colors line-clamp-1 mb-2">
            <Link href={`/properties/${property.slug}`}>
              {property.title}
            </Link>
          </h3>

          {/* Price */}
          <div className="text-xl sm:text-2xl font-semibold text-agency-950 tracking-tight mb-4">
            {formatPrice(
              property.price,
              property.purpose,
              property.pricePeriod,
              property.currency
            )}
          </div>
        </div>

        {/* Property Metadata Specs */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-agency-600">
          <div className="flex items-center space-x-1" title="Bedrooms">
            <Bed className="w-4 h-4 text-agency-500" />
            <span className="font-medium text-agency-800">{property.bedrooms}</span>
            <span className="text-agency-500">Beds</span>
          </div>
          <div className="flex items-center space-x-1" title="Bathrooms">
            <Bath className="w-4 h-4 text-agency-500" />
            <span className="font-medium text-agency-800">{property.bathrooms}</span>
            <span className="text-agency-500">Baths</span>
          </div>
          <div className="flex items-center space-x-1" title="Floor Area">
            <Maximize2 className="w-4 h-4 text-agency-500" />
            <span className="font-medium text-agency-800">{property.areaSqFt.toLocaleString()}</span>
            <span className="text-agency-500">sq ft</span>
          </div>
        </div>
      </div>
    </article>
  );
}
