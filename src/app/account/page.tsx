"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { AccountViewing } from "@/types/auth";
import { Property } from "@/types/property";
import { formatPrice } from "@/lib/formatters";

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const { favorites, count: savedCount } = useFavorites();

  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [viewings, setViewings] = useState<AccountViewing[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    upcoming: 0,
    pending: 0,
    past: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function loadAccountData() {
      try {
        const [savedRes, viewingsRes] = await Promise.all([
          fetch("/api/account/saved"),
          fetch("/api/account/viewings"),
        ]);

        if (savedRes.ok) {
          const data = await savedRes.json();
          if (Array.isArray(data.properties)) {
            setSavedProperties(data.properties);
          }
        }

        if (viewingsRes.ok) {
          const data = await viewingsRes.json();
          if (Array.isArray(data.viewings)) {
            setViewings(data.viewings);
          }
          if (data.counts) {
            setCounts(data.counts);
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        setIsLoadingData(false);
      }
    }

    loadAccountData();
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingConfirmed = viewings.find(
    (v) => v.status === "confirmed" && v.preferredDate >= todayStr
  );
  const pendingUpcoming = viewings.find(
    (v) => v.status === "pending_confirmation" && v.preferredDate >= todayStr
  );
  const nextViewing =
    upcomingConfirmed ||
    pendingUpcoming ||
    viewings.find((v) => v.status === "confirmed" || v.status === "pending_confirmation");

  return (
    <div className="space-y-10">
      {/* 1. Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Metric 1: Saved Residences */}
        <Link
          href="/account/saved"
          className="group p-6 bg-[#FFFFFF] border border-[#E6E4DE] hover:border-[#121312] rounded-xs transition-all shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#63655E]">
              Saved Residences
            </span>
            <span className="w-8 h-8 rounded-full bg-[#F4EDE2] text-[#78542E] flex items-center justify-center text-xs">
              ★
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-section-title font-normal text-[#121312]">
              {savedCount}
            </span>
            <span className="font-sans text-xs text-[#8E8A80]">curated</span>
          </div>
          <span className="mt-4 inline-flex items-center text-xs font-mono text-[#78542E] group-hover:text-[#121312]">
            View portfolio →
          </span>
        </Link>

        {/* Metric 2: Upcoming Viewings */}
        <Link
          href="/account/viewings?tab=upcoming"
          className="group p-6 bg-[#FFFFFF] border border-[#E6E4DE] hover:border-[#121312] rounded-xs transition-all shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#63655E]">
              Confirmed Showings
            </span>
            <span className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#065F46] flex items-center justify-center text-xs font-mono font-bold">
              ✓
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-section-title font-normal text-[#121312]">
              {counts.upcoming}
            </span>
            <span className="font-sans text-xs text-[#8E8A80]">scheduled</span>
          </div>
          <span className="mt-4 inline-flex items-center text-xs font-mono text-[#78542E] group-hover:text-[#121312]">
            View schedule →
          </span>
        </Link>

        {/* Metric 3: Pending Confirmation Requests */}
        <Link
          href="/account/viewings?tab=pending"
          className="group p-6 bg-[#FFFFFF] border border-[#E6E4DE] hover:border-[#121312] rounded-xs transition-all shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#63655E]">
              Pending Confirmation
            </span>
            <span className="w-8 h-8 rounded-full bg-[#FFFBEB] text-[#92400E] flex items-center justify-center text-xs font-mono font-bold">
              !
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-section-title font-normal text-[#121312]">
              {counts.pending}
            </span>
            <span className="font-sans text-xs text-[#8E8A80]">in review</span>
          </div>
          <span className="mt-4 inline-flex items-center text-xs font-mono text-[#78542E] group-hover:text-[#121312]">
            Track requests →
          </span>
        </Link>
      </div>

      {/* 2. Next Scheduled Showing Spotlight */}
      {nextViewing && (
        <section aria-labelledby="next-showing-heading" className="bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6E4DE]">
            <div>
              <span className="font-mono text-eyebrow-label uppercase tracking-widest text-[#78542E]">
                Next Scheduled Showing
              </span>
              <h2 id="next-showing-heading" className="font-serif text-section-h3 text-[#121312] mt-0.5">
                {nextViewing.propertyTitle}
              </h2>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption-meta font-mono uppercase tracking-wider ${
                  nextViewing.status === "confirmed"
                    ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                    : "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                }`}
              >
                {nextViewing.status === "confirmed"
                  ? "✓ Confirmed"
                  : "⏱ Pending Confirmation"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-body-small font-sans">
            <div>
              <span className="block font-mono text-caption-meta uppercase text-[#8E8A80]">
                Date &amp; Bracket
              </span>
              <span className="font-medium text-[#121312] mt-1 block">
                {nextViewing.preferredDate} (
                {nextViewing.preferredTime.charAt(0).toUpperCase() +
                  nextViewing.preferredTime.slice(1)}
                )
              </span>
            </div>

            <div>
              <span className="block font-mono text-caption-meta uppercase text-[#8E8A80]">
                Modality
              </span>
              <span className="font-medium text-[#121312] mt-1 block capitalize">
                {nextViewing.tourType === "in-person"
                  ? "In-Person Private Showing"
                  : "Live Video Walkthrough"}
              </span>
            </div>

            <div>
              <span className="block font-mono text-caption-meta uppercase text-[#8E8A80]">
                Reference Code
              </span>
              <span className="font-mono font-medium text-[#121312] mt-1 block">
                {nextViewing.referenceCode}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E6E4DE] flex items-center justify-between">
            <div className="text-body-small font-mono text-[#63655E]">
              Dedicated Advisor:{" "}
              <span className="font-medium text-[#121312]">
                {nextViewing.advisorName || "AURA Listing Desk"}
              </span>
            </div>
            <Link
              href="/account/viewings"
              className="text-body-small font-mono text-[#78542E] hover:text-[#121312] transition-colors"
            >
              Manage Appointment →
            </Link>
          </div>
        </section>
      )}

      {/* 3. Recently Saved Residences Preview */}
      <section aria-labelledby="saved-preview-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="saved-preview-heading" className="font-serif text-section-h3 text-[#121312]">
            Recently Saved Residences
          </h2>
          <Link
            href="/account/saved"
            className="text-xs font-mono text-[#78542E] hover:text-[#121312] transition-colors"
          >
            View All ({savedCount}) →
          </Link>
        </div>

        {savedProperties.length === 0 ? (
          <div className="p-8 bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs text-center space-y-3">
            <p className="font-serif text-lg text-[#121312]">
              No saved residences in your portfolio yet.
            </p>
            <p className="font-sans text-body-small text-[#63655E] max-w-md mx-auto">
              Explore our curated inventory of prime architectural properties for sale and luxury tenancy.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/buy"
                className="px-4 py-2 bg-[#121312] text-[#FBFBF9] font-sans text-btn uppercase tracking-wider rounded-xs hover:bg-[#242624] transition-colors"
              >
                Browse for Sale
              </Link>
              <Link
                href="/rent"
                className="px-4 py-2 border border-[#D5D1C7] text-[#121312] font-sans text-btn uppercase tracking-wider rounded-xs hover:bg-[#F3F1EC] transition-colors"
              >
                Browse for Rent
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedProperties.slice(0, 3).map((property) => (
              <div
                key={property.id}
                className="group bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs overflow-hidden transition-all hover:border-[#121312] flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F3F1EC]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={property.images?.hero}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#121312]/80 text-[#FBFBF9] backdrop-blur-xs">
                      {property.listingType === "sale" ? "For Sale" : "For Rent"}
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <span className="font-mono text-caption-meta uppercase tracking-wider text-[#78542E]">
                      {property.address.neighborhood}, {property.address.city}
                    </span>
                    <h3 className="font-serif text-card-title text-[#121312] line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="font-mono text-property-price font-semibold text-[#121312]">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href={`/properties/${property.slug || property.id}`}
                    className="block w-full py-2 text-center text-btn font-mono border border-[#D5D1C7] hover:border-[#121312] rounded-xs transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Private Concierge Advisory Card */}
      <section className="bg-[#F4EDE2] border border-[#D5C2A5] rounded-xs p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="font-mono text-eyebrow-label uppercase tracking-widest text-[#78542E]">
            Private Concierge
          </span>
          <h2 className="font-serif text-section-h3 text-[#121312] mt-0.5">
            Bespoke Acquisitions &amp; Private Showings
          </h2>
          <p className="font-sans text-body-small text-[#4A4C48] mt-1 max-w-xl">
            Our Senior Partners coordinate discrete property viewings, off-market acquisitions, and legal fiduciary representation across London, New York, and Zurich.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="px-4 py-2 bg-[#121312] text-[#FBFBF9] text-xs font-sans uppercase tracking-wider rounded-xs hover:bg-[#242624] transition-colors"
          >
            Contact Advisor
          </Link>
          <Link
            href="/sell"
            className="px-4 py-2 border border-[#78542E] text-[#78542E] text-xs font-sans uppercase tracking-wider rounded-xs hover:bg-[#78542E] hover:text-[#FBFBF9] transition-colors"
          >
            Valuation Intake
          </Link>
        </div>
      </section>
    </div>
  );
}
