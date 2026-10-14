"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, Phone, Mail, Calendar, ShieldCheck, Share2, Check } from "lucide-react";
import { Property } from "@/types/property";
import { formatPrice, getStoredShortlist, toggleStoredShortlist } from "@/lib/utils";
import { AGENCY_CONFIG } from "@/config/agency";

interface StickyInquiryPanelProps {
  property: Property;
  onRequestViewing: () => void;
}

export default function StickyInquiryPanel({
  property,
  onRequestViewing,
}: StickyInquiryPanelProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsSaved(getStoredShortlist().includes(property.id));
    const handleUpdate = () => {
      setIsSaved(getStoredShortlist().includes(property.id));
    };
    window.addEventListener("shortlist_updated", handleUpdate);
    return () => window.removeEventListener("shortlist_updated", handleUpdate);
  }, [property.id]);

  const handleToggleShortlist = () => {
    const updated = toggleStoredShortlist(property.id);
    setIsSaved(updated.includes(property.id));
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} - ${formatPrice(property.price, property.purpose, property.pricePeriod)}`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const mailtoSubject = encodeURIComponent(
    `Inquiry regarding ${property.title} (${property.reference})`
  );
  const mailtoUrl = `mailto:${
    property.purpose === "sale"
      ? AGENCY_CONFIG.contact.salesEmail
      : AGENCY_CONFIG.contact.lettingsEmail
  }?subject=${mailtoSubject}`;

  return (
    <aside className="bg-surface-canvas rounded-lg border border-border-subtle shadow-premium p-6 lg:p-7 sticky top-28 space-y-6">
      {/* Price & Status */}
      <div>
        <div className="flex items-center justify-between text-xs text-agency-500 mb-2">
          <span className="font-mono tracking-wider">REF: {property.reference}</span>
          <span className="uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-agency-100 text-agency-800">
            {property.purpose === "sale" ? "Guide Price" : "Asking Rent"}
          </span>
        </div>

        <div className="text-2xl lg:text-3xl font-semibold text-agency-950 tracking-tight">
          {formatPrice(
            property.price,
            property.purpose,
            property.pricePeriod,
            property.currency
          )}
        </div>

        {property.status === "under_offer" && (
          <p className="mt-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 p-2 rounded">
            Under Offer &bull; You may still register standby interest
          </p>
        )}
        {property.status === "let_agreed" && (
          <p className="mt-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 p-2 rounded">
            Let Agreed &bull; Contact our lettings desk for upcoming releases
          </p>
        )}
      </div>

      {/* Primary Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onRequestViewing}
          className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-accent-500 hover:bg-accent-600 rounded transition-colors flex items-center justify-center shadow-sm focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <Calendar className="w-4 h-4 mr-2" />
          <span>Request Private Viewing</span>
        </button>

        <a
          href={mailtoUrl}
          className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-agency-900 bg-surface-warm hover:bg-agency-100 border border-border-strong rounded transition-colors flex items-center justify-center"
        >
          <Mail className="w-4 h-4 mr-2 text-accent-500" />
          <span>Email Private Office</span>
        </a>
      </div>

      {/* Secondary Actions (Bookmark & Share) */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle">
        <button
          type="button"
          onClick={handleToggleShortlist}
          className={`py-2 px-3 text-xs font-medium rounded flex items-center justify-center border transition-colors ${
            isSaved
              ? "bg-accent-50 border-accent-300 text-accent-700"
              : "bg-surface-warm border-border-subtle text-agency-700 hover:text-agency-950"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 mr-1.5 ${isSaved ? "fill-accent-500 text-accent-500" : ""}`} />
          <span>{isSaved ? "Saved" : "Save Residence"}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="py-2 px-3 text-xs font-medium rounded flex items-center justify-center border border-border-subtle bg-surface-warm text-agency-700 hover:text-agency-950 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 mr-1.5 text-agency-500" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Advisory Contact & Hours */}
      <div className="pt-4 border-t border-border-subtle space-y-2 text-xs text-agency-600">
        <div className="flex items-center text-agency-900 font-medium">
          <Phone className="w-3.5 h-3.5 mr-2 text-accent-500" />
          <a
            href={`tel:${AGENCY_CONFIG.contact.phone.replace(/[^0-9+]/g, "")}`}
            className="hover:text-accent-600 transition-colors"
          >
            Direct Desk: {AGENCY_CONFIG.contact.phoneDisplay}
          </a>
        </div>
        <p className="text-[11px] text-agency-500">
          Client Advisory: Mon–Fri 08:30–18:30 &bull; Sat 10:00–16:00
        </p>
        <div className="flex items-center pt-2 text-[11px] text-agency-500">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
          <span>Strict Client Non-Disclosure & AML Adherence</span>
        </div>
      </div>
    </aside>
  );
}
