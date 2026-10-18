"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AccountViewing } from "@/types/auth";
import { Button } from "@/components/ui/Button";

type ViewingTab = "all" | "upcoming" | "pending" | "past";

export default function AccountViewingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = (searchParams?.get("tab") as ViewingTab) || "all";

  const [viewings, setViewings] = useState<AccountViewing[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    upcoming: 0,
    pending: 0,
    past: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch viewings
  const fetchViewings = async () => {
    try {
      const res = await fetch("/api/account/viewings");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.viewings)) {
          setViewings(data.viewings);
        }
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchViewings();
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Filter viewings by active tab
  const displayedViewings = useMemo(() => {
    switch (activeTab) {
      case "upcoming":
        return viewings.filter(
          (v) => v.status === "confirmed" && v.preferredDate >= todayStr
        );
      case "pending":
        return viewings.filter((v) => v.status === "pending_confirmation");
      case "past":
        return viewings.filter(
          (v) =>
            v.status === "completed" ||
            v.status === "cancelled" ||
            (v.status === "confirmed" && v.preferredDate < todayStr)
        );
      case "all":
      default:
        return viewings;
    }
  }, [viewings, activeTab, todayStr]);

  // Handle Cancel
  const handleCancelViewing = async (viewingId: string) => {
    if (!confirm("Are you sure you wish to cancel this viewing appointment request?")) {
      return;
    }

    setCancellingId(viewingId);
    try {
      const res = await fetch(`/api/account/viewings/${viewingId}/cancel`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchViewings();
      }
    } catch {
      alert("Failed to cancel viewing appointment. Please contact your advisor directly.");
    } finally {
      setCancellingId(null);
    }
  };

  // Add to Calendar (.ics download)
  const handleDownloadCalendar = (viewing: AccountViewing) => {
    const timeDescriptions = {
      morning: "09:00 - 12:00",
      afternoon: "12:00 - 16:00",
      evening: "16:00 - 19:00",
    };

    const slotText = timeDescriptions[viewing.preferredTime] || viewing.preferredTime;
    const modalityText =
      viewing.tourType === "in-person"
        ? "In-Person Private Showing"
        : "Live Video Walkthrough";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AURA Real Estate//Viewing Appointment//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `SUMMARY:Viewing: ${viewing.propertyTitle} (${modalityText}) [${viewing.status === "confirmed" ? "Confirmed" : "Pending Confirmation"}]`,
      `DESCRIPTION:Viewing appointment for ${viewing.propertyTitle} with AURA Real Estate.\\n\\nModality: ${modalityText}\\nRequested Time: ${slotText}\\nReference: ${viewing.referenceCode}\\nAdvisor: ${viewing.advisorName || "Listing Advisor"} (${viewing.advisorEmail || ""})\\n\\nNOTICE: Private showings require 24-hour advance coordination.`,
      `LOCATION:${viewing.propertyLocation || "AURA Private Portfolio"}`,
      viewing.status === "confirmed" ? "STATUS:CONFIRMED" : "STATUS:TENTATIVE",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AURA-Viewing-${viewing.referenceCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const setTab = (tab: ViewingTab) => {
    router.push(`/account/viewings?tab=${tab}`);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E6E4DE]">
        <div>
          <span className="font-mono text-eyebrow-label uppercase tracking-widest text-[#78542E]">
            Private Appointments
          </span>
          <h1 className="font-serif text-page-title text-[#121312] mt-1">
            Viewing Appointments &amp; History
          </h1>
          <p className="font-sans text-body-small text-[#63655E] mt-1">
            Track private showings, confirmed walk-throughs, and consultation requests.
          </p>
        </div>

        <Link
          href="/buy"
          className="px-4 py-2 bg-[#121312] text-[#FBFBF9] font-sans text-btn uppercase tracking-wider rounded-xs hover:bg-[#242624] transition-colors self-start sm:self-auto"
        >
          Request New Viewing
        </Link>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 border-b border-[#E6E4DE] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`px-3 py-1.5 rounded-xs text-xs font-mono transition-colors ${
            activeTab === "all"
              ? "bg-[#121312] text-[#FBFBF9] font-medium"
              : "text-[#63655E] hover:text-[#121312] hover:bg-[#F3F1EC]"
          }`}
        >
          All Viewings ({counts.all})
        </button>

        <button
          type="button"
          onClick={() => setTab("upcoming")}
          className={`px-3 py-1.5 rounded-xs text-xs font-mono transition-colors ${
            activeTab === "upcoming"
              ? "bg-[#121312] text-[#FBFBF9] font-medium"
              : "text-[#63655E] hover:text-[#121312] hover:bg-[#F3F1EC]"
          }`}
        >
          Upcoming Confirmed ({counts.upcoming})
        </button>

        <button
          type="button"
          onClick={() => setTab("pending")}
          className={`px-3 py-1.5 rounded-xs text-xs font-mono transition-colors ${
            activeTab === "pending"
              ? "bg-[#121312] text-[#FBFBF9] font-medium"
              : "text-[#63655E] hover:text-[#121312] hover:bg-[#F3F1EC]"
          }`}
        >
          Pending Confirmation ({counts.pending})
        </button>

        <button
          type="button"
          onClick={() => setTab("past")}
          className={`px-3 py-1.5 rounded-xs text-xs font-mono transition-colors ${
            activeTab === "past"
              ? "bg-[#121312] text-[#FBFBF9] font-medium"
              : "text-[#63655E] hover:text-[#121312] hover:bg-[#F3F1EC]"
          }`}
        >
          Past &amp; Completed ({counts.past})
        </button>
      </div>

      {/* Viewings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs h-40 animate-pulse p-6"
            />
          ))}
        </div>
      ) : displayedViewings.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-6 bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs text-center space-y-3">
          <p className="font-serif text-lg text-[#121312]">
            No viewing appointments found in this category.
          </p>
          <p className="font-sans text-xs text-[#63655E] max-w-md mx-auto">
            {activeTab === "pending"
              ? "You have no viewing requests awaiting advisor confirmation."
              : activeTab === "upcoming"
              ? "You have no upcoming confirmed private showings scheduled."
              : "Explore our properties and request a private showing with an advisor."}
          </p>
          <div className="pt-3">
            <Link
              href="/buy"
              className="inline-block px-5 py-2.5 bg-[#121312] text-[#FBFBF9] font-sans text-xs uppercase tracking-wider rounded-xs hover:bg-[#242624] transition-colors"
            >
              Browse Residences
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedViewings.map((viewing) => {
            const isPending = viewing.status === "pending_confirmation";
            const isConfirmed = viewing.status === "confirmed";
            const isCancelled = viewing.status === "cancelled";
            const isCompleted = viewing.status === "completed";

            return (
              <div
                key={viewing.id}
                className="bg-[#FFFFFF] border border-[#E6E4DE] hover:border-[#8E8A80] rounded-xs p-6 transition-all shadow-xs space-y-6"
              >
                {/* Header: Title, Reference Code, and Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E6E4DE]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#78542E]">
                        Reference: {viewing.referenceCode}
                      </span>
                      <span className="text-[#8E8A80]">•</span>
                      <span className="font-mono text-[10px] uppercase text-[#63655E]">
                        {viewing.tourType === "in-person"
                          ? "In-Person Showing"
                          : "Live Video Walkthrough"}
                      </span>
                    </div>

                    <h2 className="font-serif text-section-h3 text-[#121312] mt-1">
                      {viewing.propertyTitle}
                    </h2>

                    {viewing.propertyLocation && (
                      <p className="font-sans text-body-small text-[#63655E] mt-0.5">
                        {viewing.propertyLocation}
                      </p>
                    )}
                  </div>

                  {/* Status Badge with Honest Explanations */}
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider ${
                        isConfirmed
                          ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                          : isPending
                          ? "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                          : isCancelled
                          ? "bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5]"
                          : "bg-[#F3F1EC] text-[#4A4C48] border border-[#D5D1C7]"
                      }`}
                    >
                      {isConfirmed && "✓ Confirmed"}
                      {isPending && "⏱ Pending Confirmation"}
                      {isCancelled && "✕ Cancelled"}
                      {isCompleted && "✓ Completed"}
                    </span>
                  </div>
                </div>

                {/* Status Notice if Pending */}
                {isPending && (
                  <div className="bg-[#F4EDE2] border border-[#D5C2A5] rounded-xs p-4 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#78542E] text-[#FBFBF9] flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                      !
                    </span>
                    <p className="font-sans text-xs text-[#4A4C48] leading-relaxed">
                      <strong>Advance Notice Coordination:</strong> Private showings require 24-hour advance coordination with the property owner and listing advisor. Your dedicated associate is reviewing access availability.
                    </p>
                  </div>
                )}

                {/* Grid Details */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-sans">
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-[#8E8A80]">
                      Requested Date
                    </span>
                    <span className="font-medium text-[#121312] mt-0.5 block font-mono">
                      {viewing.preferredDate}
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase text-[#8E8A80]">
                      Time Bracket
                    </span>
                    <span className="font-medium text-[#121312] mt-0.5 block capitalize">
                      {viewing.preferredTime} (
                      {viewing.preferredTime === "morning"
                        ? "09:00 - 12:00"
                        : viewing.preferredTime === "afternoon"
                        ? "12:00 - 16:00"
                        : "16:00 - 19:00"}
                      )
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase text-[#8E8A80]">
                      Listing Advisor
                    </span>
                    <span className="font-medium text-[#121312] mt-0.5 block">
                      {viewing.advisorName || "AURA Listing Desk"}
                    </span>
                    {viewing.advisorPhone && (
                      <span className="font-mono text-[11px] text-[#63655E] block">
                        {viewing.advisorPhone}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase text-[#8E8A80]">
                      Client Contact
                    </span>
                    <span className="font-medium text-[#121312] mt-0.5 block">
                      {viewing.fullName}
                    </span>
                    <span className="font-mono text-[11px] text-[#63655E] block">
                      {viewing.phone || viewing.email}
                    </span>
                  </div>
                </div>

                {viewing.notes && (
                  <div className="p-3 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs text-xs font-sans text-[#4A4C48]">
                    <span className="font-mono text-[10px] uppercase text-[#8E8A80] block mb-1">
                      Notes &amp; Architectural Focus:
                    </span>
                    {viewing.notes}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E6E4DE]">
                  <Link
                    href={`/properties/${viewing.propertyId}`}
                    className="text-xs font-mono text-[#78542E] hover:text-[#121312] transition-colors"
                  >
                    View Property Details →
                  </Link>

                  <div className="flex items-center gap-3">
                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => handleDownloadCalendar(viewing)}
                        className="px-3 py-1.5 border border-[#D5D1C7] text-xs font-mono text-[#121312] hover:bg-[#F3F1EC] rounded-xs transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-[#78542E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Add to Calendar (.ics)
                      </button>
                    )}

                    {(isPending || isConfirmed) && (
                      <button
                        type="button"
                        onClick={() => handleCancelViewing(viewing.id)}
                        disabled={cancellingId === viewing.id}
                        className="px-3 py-1.5 text-xs font-mono text-[#DC2626] border border-[#FCA5A5] hover:bg-[#FEF2F2] rounded-xs transition-colors disabled:opacity-50"
                      >
                        {cancellingId === viewing.id ? "Cancelling..." : "Cancel Request"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
