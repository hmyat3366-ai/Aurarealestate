"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { Property } from "@/types/property";
import { formatPrice, formatSqft } from "@/lib/formatters";

export default function AccountSavedPage() {
  const { favorites, removeFavorite, toggleFavorite } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hydrated properties from server
  useEffect(() => {
    async function fetchSavedProperties() {
      try {
        const res = await fetch("/api/account/saved");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.properties)) {
            setProperties(data.properties);
          }
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedProperties();
  }, [favorites]);

  const handleRemove = (propertyId: string) => {
    if (removeFavorite) {
      removeFavorite(propertyId);
    } else {
      toggleFavorite(propertyId);
    }
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E6E4DE]">
        <div>
          <span className="font-mono text-eyebrow-label uppercase tracking-widest text-[#78542E]">
            Client Portfolio
          </span>
          <h1 className="font-serif text-page-title text-[#121312] mt-1">
            Saved Residences
          </h1>
          <p className="font-sans text-body-small text-[#63655E] mt-1">
            Server-persisted across all your devices and sessions.
          </p>
        </div>

        <span className="font-mono text-xs px-3 py-1 bg-[#F3F1EC] text-[#121312] rounded-full self-start sm:self-auto">
          {properties.length} {properties.length === 1 ? "residence" : "residences"}
        </span>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs h-72 animate-pulse p-4"
            />
          ))}
        </div>
      ) : properties.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-6 bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#F4EDE2] text-[#78542E] flex items-center justify-center text-lg">
            ★
          </div>
          <h2 className="font-serif text-section-title text-[#121312]">
            Your Saved Portfolio is Empty
          </h2>
          <p className="font-sans text-body-small text-[#63655E] max-w-md mx-auto leading-relaxed">
            Curate your personal collection of architectural penthouses, historic townhouses, and prime luxury residences. Saved items are securely synchronized to your account.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/buy"
              className="px-5 py-2.5 bg-[#121312] text-[#FBFBF9] font-sans text-btn uppercase tracking-[0.12em] rounded-xs hover:bg-[#242624] transition-colors"
            >
              Explore Buy Portfolio
            </Link>
            <Link
              href="/rent"
              className="px-5 py-2.5 border border-[#D5D1C7] text-[#121312] font-sans text-btn uppercase tracking-[0.12em] rounded-xs hover:bg-[#F3F1EC] transition-colors"
            >
              Explore Luxury Tenancies
            </Link>
          </div>
        </div>
      ) : (
        /* Properties Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group bg-[#FFFFFF] border border-[#E6E4DE] hover:border-[#121312] rounded-xs overflow-hidden transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Hero Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F3F1EC]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={property.images?.hero}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#121312]/80 text-[#FBFBF9] backdrop-blur-xs">
                      {property.listingType === "sale" ? "For Sale" : "For Rent"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#78542E]/90 text-[#FBFBF9] backdrop-blur-xs">
                      {property.propertyType}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(property.id)}
                    aria-label={`Remove ${property.title} from saved properties`}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[#FFFFFF]/90 hover:bg-[#DC2626] text-[#78542E] hover:text-[#FFFFFF] transition-colors shadow-xs"
                    title="Remove from Saved"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-caption-meta text-[#78542E] font-mono uppercase tracking-wider">
                    <span>
                      {property.address.neighborhood}, {property.address.city}
                    </span>
                  </div>

                  <h2 className="font-serif text-card-title text-[#121312] line-clamp-1 group-hover:text-[#78542E] transition-colors">
                    {property.title}
                  </h2>

                  <p className="font-mono text-property-price font-semibold text-[#121312]">
                    {formatPrice(property.price)}
                  </p>

                  {/* Facts Strip */}
                  <div className="flex items-center gap-3 pt-2 text-xs font-mono text-[#63655E] border-t border-[#E6E4DE]">
                    <span>{property.bedrooms} Beds</span>
                    <span>•</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>•</span>
                    <span>{formatSqft(property.squareFeet)}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-0 flex items-center gap-3">
                <Link
                  href={`/properties/${property.slug || property.id}`}
                  className="flex-1 py-2 text-center text-xs font-mono bg-[#121312] text-[#FBFBF9] hover:bg-[#242624] rounded-xs transition-colors"
                >
                  View Residence
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(property.id)}
                  className="px-3 py-2 text-xs font-mono text-[#DC2626] hover:bg-[#FEE2E2] rounded-xs transition-colors border border-[#FCA5A5]"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
