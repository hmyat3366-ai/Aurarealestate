"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, ArrowRight, Trash2, Mail, Info } from "lucide-react";
import { PROPERTIES } from "@/data/properties";
import { Property } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";
import { getStoredShortlist } from "@/lib/utils";
import { AGENCY_CONFIG } from "@/config/agency";

export default function SavedPropertiesPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSavedIds(getStoredShortlist());
    setIsLoaded(true);

    const handleUpdate = () => {
      setSavedIds(getStoredShortlist());
    };

    window.addEventListener("shortlist_updated", handleUpdate);
    return () => window.removeEventListener("shortlist_updated", handleUpdate);
  }, []);

  const handleClearAll = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vane_sterling_shortlist");
      window.dispatchEvent(new Event("shortlist_updated"));
      setSavedIds([]);
    }
  };

  const savedProperties: Property[] = PROPERTIES.filter((p) =>
    savedIds.includes(p.id)
  );

  const mailtoSubject = encodeURIComponent("Inquiry regarding Shortlisted Portfolio");
  const mailtoBody = encodeURIComponent(
    `Dear Vane & Sterling Private Office,\n\nI have shortlisted the following residences on your platform and would like to request confidential advisory:\n\n${savedProperties
      .map((p) => `- ${p.title} (${p.reference}): ${p.location.address}`)
      .join("\n")}\n\nPlease contact me regarding viewing availability.\n\nThank you.`
  );
  const shortlistMailtoUrl = `mailto:${AGENCY_CONFIG.contact.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-border-subtle gap-4 mb-8">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
            Client Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-agency-950 font-normal mt-1">
            Saved Shortlist
          </h1>
          <p className="text-sm text-agency-600 mt-2">
            Review and compare your shortlisted residences.
          </p>
        </div>

        {savedProperties.length > 0 && (
          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-agency-600 hover:text-red-700 transition-colors flex items-center border border-border-strong rounded"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Clear Shortlist</span>
            </button>

            <a
              href={shortlistMailtoUrl}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-accent-500 hover:bg-accent-600 rounded transition-colors flex items-center shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              <span>Inquire All</span>
            </a>
          </div>
        )}
      </div>

      {/* Persistence Notice (per Master Prompt Section 6 Flow 4) */}
      <div className="p-4 rounded-lg bg-surface-canvas border border-border-subtle text-xs text-agency-600 flex items-start space-x-3 mb-10 shadow-subtle">
        <Info className="w-4 h-4 text-accent-600 shrink-0 mt-0.5" />
        <p>
          <strong>Private Local Storage:</strong> Your saved properties are stored locally within your current web browser. No account registration, password creation, or personal profiling is required to maintain your shortlist.
        </p>
      </div>

      {/* Grid or Empty */}
      {isLoaded && savedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : isLoaded ? (
        <div className="text-center py-20 bg-surface-canvas rounded-lg border border-border-subtle max-w-md mx-auto my-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-surface-warm border border-border-strong flex items-center justify-center text-agency-400">
            <Bookmark className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-agency-950 mb-2">
            Your Shortlist is Empty
          </h2>
          <p className="text-xs text-agency-600 mb-6 max-w-xs mx-auto">
            Click the bookmark icon on any property to save residences for later review and combined viewing inquiries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/buy"
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-agency-950 hover:bg-agency-900 rounded transition-colors"
            >
              Browse Properties for Sale
            </Link>
            <Link
              href="/rent"
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-agency-900 bg-surface-warm hover:bg-agency-100 border border-border-strong rounded transition-colors"
            >
              Browse Properties to Let
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
