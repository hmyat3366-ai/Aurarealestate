import React from "react";
import Link from "next/link";
import { SearchX, RotateCcw, Mail } from "lucide-react";
import { AGENCY_CONFIG } from "@/config/agency";

interface EmptyStateProps {
  onReset?: () => void;
  purpose?: "sale" | "rent";
}

export default function EmptyState({ onReset, purpose = "sale" }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 bg-surface-canvas rounded-lg border border-border-subtle max-w-xl mx-auto my-12">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent-50 border border-accent-200/60 flex items-center justify-center text-accent-600">
        <SearchX className="w-7 h-7 stroke-[1.5]" />
      </div>

      <h3 className="font-serif text-2xl font-medium text-agency-950 mb-2">
        No Matching Residences Found
      </h3>

      <p className="text-sm text-agency-600 leading-relaxed mb-6 max-w-md mx-auto">
        We could not find any active {purpose === "sale" ? "sales" : "lettings"} listings matching your exact combination of criteria. As an exclusive agency, our curated portfolio is strictly vetted.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-agency-950 hover:bg-agency-900 rounded transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Clear Filter Criteria</span>
          </button>
        )}

        <Link
          href="/contact"
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-agency-900 bg-surface-warm hover:bg-agency-100 border border-border-strong rounded transition-colors flex items-center justify-center"
        >
          <Mail className="w-3.5 h-3.5 mr-1.5 text-accent-500" />
          <span>Register Off-Market Brief</span>
        </Link>
      </div>

      <p className="text-xs text-agency-400 mt-6">
        Many of our most prestigious transactions occur off-market. Contact{" "}
        <a
          href={`mailto:${AGENCY_CONFIG.contact.email}`}
          className="text-accent-600 underline hover:text-accent-700"
        >
          {AGENCY_CONFIG.contact.email}
        </a>{" "}
        for confidential private listings.
      </p>
    </div>
  );
}
