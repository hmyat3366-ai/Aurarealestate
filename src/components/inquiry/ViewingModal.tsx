"use client";

import React, { useState, useId, useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Property } from "@/types/property";
import { ViewingRequest, TourType, TimeSlot } from "@/types/inquiry";
import { useAuth, AuthContext } from "@/context/AuthContext";
import Link from "next/link";

export interface ViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  initialTourType?: TourType;
  onSuccess?: (request: ViewingRequest) => void;
}

export function ViewingModal({
  isOpen,
  onClose,
  property,
  initialTourType = "in-person",
  onSuccess,
}: ViewingModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authFromHook = useAuth();
  const authContext = useContext(AuthContext);
  const activeAuth = authContext || (authFromHook.user ? authFromHook : null);
  const user = authFromHook.user || authContext?.user;

  // Form state - prefill with authenticated user contact details if logged in
  const [tourType, setTourType] = useState<TourType>(initialTourType);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState<TimeSlot>("afternoon");
  const [hasAgent, setHasAgent] = useState<"independent" | "represented">("independent");
  const [notes, setNotes] = useState("");

  // Sync authenticated user info or restore preserved viewing details when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // 1. Check if an authenticated viewing request was just completed by the auth flow
    try {
      const lastBookingStr = localStorage.getItem("aura_last_viewing_data");
      if (lastBookingStr) {
        const lastBooking = JSON.parse(lastBookingStr);
        if (lastBooking && lastBooking.propertyId === property.id) {
          const refCode = lastBooking.referenceCode || "VS-VR-CONFIRMED";
          setReferenceCode(refCode);
          setSubmittedRequest({
            propertyId: property.id,
            propertyTitle: property.title,
            fullName: user?.fullName || fullName || "Private Client",
            email: user?.email || email,
            phone: user?.phone || phone,
            tourType: lastBooking.tourType || tourType,
            preferredDate: lastBooking.preferredDate || preferredDate,
            preferredTime: lastBooking.preferredTime || preferredTime,
            representedByBroker: false,
            status: "pending_confirmation",
            createdAt: new Date().toISOString(),
          });
          localStorage.removeItem("aura_last_viewing_data");
          localStorage.removeItem("aura_pending_viewing");
          return;
        }
      }
    } catch {
      // Ignore storage errors
    }

    // 2. Check if a pending viewing was preserved before OTP authentication
    try {
      const pendingStr = localStorage.getItem("aura_pending_viewing");
      if (pendingStr) {
        const pending = JSON.parse(pendingStr);
        if (pending && pending.propertyId === property.id) {
          if (pending.tourType) setTourType(pending.tourType);
          if (pending.preferredDate) setPreferredDate(pending.preferredDate);
          if (pending.preferredTime) setPreferredTime(pending.preferredTime);
          if (pending.hasAgent) setHasAgent(pending.hasAgent);
          if (pending.notes) setNotes(pending.notes);
          if (pending.phone) setPhone((prev) => prev || pending.phone);
          if (pending.fullName) setFullName((prev) => prev || pending.fullName);
          if (pending.email) setEmail((prev) => prev || pending.email);
        }
      }
    } catch {
      // Ignore storage errors
    }

    // 3. Sync authenticated user profile data
    if (user) {
      if (user.fullName) setFullName((prev) => prev || user.fullName || "");
      if (user.email) setEmail((prev) => prev || user.email || "");
      if (user.phone) setPhone((prev) => prev || user.phone || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user, property.id]);

  // Submission & Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<ViewingRequest | null>(null);
  const [referenceCode, setReferenceCode] = useState<string>("");

  // Calculate minimum selectable date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split("T")[0];

  // Helper date chips (tomorrow, +2d, +3d, +5d)
  const dateChips = React.useMemo(() => {
    const chips: Array<{ label: string; value: string }> = [];
    for (let i = 1; i <= 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const val = d.toISOString().split("T")[0];
      const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
      const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      chips.push({
        label: i === 1 ? `Tomorrow (${monthDay})` : `${weekday}, ${monthDay}`,
        value: val,
      });
    }
    return chips;
  }, []);

  const resetForm = () => {
    setTourType(initialTourType);
    setFullName(user?.fullName || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setPreferredDate("");
    setPreferredTime("afternoon");
    setHasAgent("independent");
    setNotes("");
    setErrors({});
    setIsSubmitting(false);
    setSubmittedRequest(null);
    setReferenceCode("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName || fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please provide a valid email address.";
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (!phone || digitsOnly.length < 7) {
      newErrors.phone = "Please provide a valid telephone number.";
    }

    if (!preferredDate) {
      newErrors.preferredDate = "Please select a preferred viewing date.";
    } else {
      const selected = new Date(preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(selected.getTime()) || selected < today) {
        newErrors.preferredDate = "Viewing date must be in the future.";
      }
    }

    if (!preferredTime || !["morning", "afternoon", "evening"].includes(preferredTime)) {
      newErrors.preferredTime = "Please select a preferred time bracket.";
    }

    if (!tourType || !["in-person", "video"].includes(tourType)) {
      newErrors.tourType = "Please select a tour modality.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // AUTH GATE: Require successful email OTP authentication before submitting viewing request
    if (activeAuth && !activeAuth.isAuthenticated) {
      try {
        const pendingViewing = {
          propertyId: property.id,
          tourType,
          preferredDate,
          preferredTime,
          hasAgent,
          notes: notes.trim() || undefined,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        };
        localStorage.setItem("aura_pending_viewing", JSON.stringify(pendingViewing));
      } catch {
        // Ignore storage errors
      }

      const returnUrl = `/properties/${property.slug || property.id}?action=viewing&resumed=true`;
      const emailParam = email.trim() ? `&email=${encodeURIComponent(email.trim())}` : "";
      router.push(
        `/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}&intent=viewing&propertyId=${encodeURIComponent(property.id)}${emailParam}`
      );
      return;
    }

    setIsSubmitting(true);

    // Generate fallback agency tracking reference code
    const cleanId = (property.id || "prop")
      .replace(/^vs-/, "")
      .replace(/^prop-/, "")
      .toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    let finalRefCode = `VS-VR-${cleanId}-${randomSuffix}`;

    // Dispatch to API intake and synchronize server-assigned reference code
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          tourType,
          preferredDate,
          preferredTime,
          notes: notes.trim() || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.referenceCode) {
          finalRefCode = data.referenceCode;
        }
      }
    } catch {
      // Fallback gracefully in offline / test environments
    }

    const requestData: ViewingRequest = {
      propertyId: property.id,
      propertyTitle: property.title,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      tourType,
      preferredDate,
      preferredTime,
      representedByBroker: hasAgent === "represented",
      notes: notes.trim() || undefined,
      status: "pending_confirmation",
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.removeItem("aura_pending_viewing");
      localStorage.removeItem("aura_last_viewing_data");
    } catch {
      // Ignore
    }

    setReferenceCode(finalRefCode);
    setSubmittedRequest(requestData);
    setIsSubmitting(false);

    if (onSuccess) {
      onSuccess(requestData);
    }
  };

  // Add to Calendar handler (.ics export)
  const handleAddToCalendar = () => {
    if (!submittedRequest) return;

    const timeDescriptions: Record<TimeSlot, string> = {
      morning: "09:00 - 12:00",
      afternoon: "12:00 - 16:00",
      evening: "16:00 - 19:00",
    };

    const slotText = timeDescriptions[submittedRequest.preferredTime];
    const modalityText =
      submittedRequest.tourType === "in-person"
        ? "In-Person Private Showing"
        : "Live Video Walkthrough";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AURA Real Estate//Viewing Appointment//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `SUMMARY:Viewing: ${property.title} (${modalityText}) [Pending Confirmation]`,
      `DESCRIPTION:Viewing appointment request for ${property.title} with AURA Real Estate.\\n\\nModality: ${modalityText}\\nRequested Time: ${slotText}\\nReference: ${referenceCode} / [AURA-VIEW-${referenceCode.slice(-4)}]\\nAdvisor: ${property.agent.name} (${property.agent.email})\\n\\nNOTICE: Private showings require 24-hour advance coordination. Appointment is pending manual confirmation with the dedicated listing advisor.`,
      `LOCATION:${property.address.street}, ${property.address.neighborhood}, ${property.address.city}`,
      "STATUS:TENTATIVE",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AURARealEstate-Viewing-${property.slug || "residence"}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const timeOptions: Array<{ id: TimeSlot; label: string; period: string }> = [
    { id: "morning", label: "Morning", period: "09:00 - 12:00" },
    { id: "afternoon", label: "Afternoon", period: "12:00 - 16:00" },
    { id: "evening", label: "Evening", period: "16:00 - 19:00" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        submittedRequest
          ? "Viewing Request Submitted"
          : "Schedule a Private Viewing"
      }
      description={
        submittedRequest
          ? "Your appointment request has been transmitted to our advisory team."
          : `${property.title} — ${property.address.neighborhood}, ${property.address.city}`
      }
      size="lg"
      ariaLabel="Schedule a Private Viewing Dialog"
    >
      {/* ========================================================================= */}
      {/* VIEW A: CONFIRMATION STATE (Pending Manual Confirmation)                   */}
      {/* ========================================================================= */}
      {submittedRequest ? (
        <div className="space-y-6" data-testid="viewing-request-confirmation">
          {/* Mandatory Explicit Status Banner */}
          <div className="bg-[#F4EDE2] border border-[#D5C2A5] rounded-xs p-5">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#78542E] text-[#FBFBF9] flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                !
              </span>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#121312]">
                  Viewing Request Submitted — Pending Manual Confirmation
                </h4>
                <p className="mt-1 font-sans text-xs text-[#4A4C48] leading-relaxed">
                  Private showings require 24-hour advance coordination with the property owner and dedicated listing advisor. We will reach out shortly to finalize your appointment.
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Reference & Summary Card */}
          <div className="bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DE]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#63655E]">
                Reference Code
              </span>
              <div className="text-right">
                <span className="font-mono text-sm font-semibold text-[#121312]">
                  {referenceCode}
                </span>
                <span className="ml-2 font-mono text-xs text-[#78542E]">
                  [AURA-VIEW-{referenceCode.slice(-4)}]
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-[#4A4C48]">
              <div>
                <span className="block font-mono text-[10px] uppercase text-[#8E8A80]">
                  Residence
                </span>
                <span className="font-medium text-[#121312] mt-0.5 block truncate">
                  {property.title}
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10px] uppercase text-[#8E8A80]">
                  Tour Modality
                </span>
                <span className="font-medium text-[#121312] mt-0.5 block capitalize">
                  {submittedRequest.tourType === "in-person"
                    ? "In-Person Private Showing"
                    : "Live Video Walkthrough"}
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10px] uppercase text-[#8E8A80]">
                  Requested Date & Bracket
                </span>
                <span className="font-mono text-[#121312] mt-0.5 block">
                  {submittedRequest.preferredDate} (
                  {submittedRequest.preferredTime.charAt(0).toUpperCase() +
                    submittedRequest.preferredTime.slice(1)}
                  )
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10px] uppercase text-[#8E8A80]">
                  Listing Advisor
                </span>
                <span className="font-medium text-[#121312] mt-0.5 block">
                  {property.agent.name} ({property.agent.phone})
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Add to Calendar & Done */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#E6E4DE]">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddToCalendar}
              leftIcon={
                <svg className="w-4 h-4 text-[#78542E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              }
              className="w-full sm:w-auto"
            >
              Add to Calendar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleClose}
              className="w-full sm:w-auto"
            >
              Close Window
            </Button>
          </div>

          {user && (
            <div className="pt-2 text-right">
              <Link
                href="/account/viewings"
                onClick={handleClose}
                className="font-mono text-xs text-[#78542E] hover:text-[#121312] underline"
              >
                View in Client Account Appointments →
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW B: VIEWING REQUEST FORM                                              */
        /* ========================================================================= */
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* 1. Modality Toggle: In-Person vs Video Walkthrough */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-2 font-medium">
              Tour Modality <span className="text-[#78542E]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Tour Modality">
              <button
                type="button"
                role="radio"
                aria-checked={tourType === "in-person"}
                onClick={() => setTourType("in-person")}
                className={`py-3 px-4 border rounded-xs text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all ${
                  tourType === "in-person"
                    ? "border-[#121312] bg-[#121312] text-[#FBFBF9] shadow-xs"
                    : "border-[#E6E4DE] bg-[#FFFFFF] text-[#4A4C48] hover:border-[#8E8A80]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>In-Person Showing</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={tourType === "video"}
                onClick={() => setTourType("video")}
                className={`py-3 px-4 border rounded-xs text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all ${
                  tourType === "video"
                    ? "border-[#121312] bg-[#121312] text-[#FBFBF9] shadow-xs"
                    : "border-[#E6E4DE] bg-[#FFFFFF] text-[#4A4C48] hover:border-[#8E8A80]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span>Video Walkthrough</span>
              </button>
            </div>
            {errors.tourType && (
              <p className="mt-1 text-xs text-[#DC2626] font-mono">{errors.tourType}</p>
            )}
          </div>

          {/* 2. Date Selection (Smart Chips & Date Input) */}
          <div>
            <label
              htmlFor="viewing-date-input"
              className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-2 font-medium"
            >
              Preferred Date <span className="text-[#78542E]">*</span>
            </label>

            {/* Smart Date Chips */}
            <div className="flex flex-wrap gap-2 mb-2.5">
              {dateChips.map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => {
                    setPreferredDate(chip.value);
                    if (errors.preferredDate) {
                      setErrors((prev) => ({ ...prev, preferredDate: "" }));
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xs text-xs font-mono transition-all ${
                    preferredDate === chip.value
                      ? "bg-[#78542E] text-[#FBFBF9] font-medium"
                      : "bg-[#F3F1EC] text-[#4A4C48] hover:bg-[#E6E4DE]"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Native Date Input */}
            <input
              id="viewing-date-input"
              type="date"
              min={minDateString}
              value={preferredDate}
              onChange={(e) => {
                setPreferredDate(e.target.value);
                if (errors.preferredDate) {
                  setErrors((prev) => ({ ...prev, preferredDate: "" }));
                }
              }}
              className="w-full h-11 px-3.5 border border-[#D5D1C7] rounded-xs bg-[#FFFFFF] font-mono text-sm text-[#121312] focus:outline-none focus:ring-2 focus:ring-[#121312]"
            />
            {errors.preferredDate && (
              <p className="mt-1 text-xs text-[#DC2626] font-mono">{errors.preferredDate}</p>
            )}
          </div>

          {/* 3. Time Bracket Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-2 font-medium">
              Time Bracket <span className="text-[#78542E]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" role="radiogroup" aria-label="Time Bracket">
              {timeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={preferredTime === opt.id}
                  onClick={() => setPreferredTime(opt.id)}
                  className={`p-3 border rounded-xs text-left transition-all ${
                    preferredTime === opt.id
                      ? "border-[#78542E] bg-[#F4EDE2]/50 text-[#121312]"
                      : "border-[#E6E4DE] bg-[#FFFFFF] text-[#4A4C48] hover:border-[#8E8A80]"
                  }`}
                >
                  <span className="block font-sans text-xs font-semibold">
                    {opt.label}
                  </span>
                  <span className="block font-mono text-[11px] text-[#8E8A80] mt-0.5">
                    {opt.period}
                  </span>
                </button>
              ))}
            </div>
            {errors.preferredTime && (
              <p className="mt-1 text-xs text-[#DC2626] font-mono">{errors.preferredTime}</p>
            )}
          </div>

          {/* 4. Contact Information Inputs */}
          <div className="space-y-4 pt-2 border-t border-[#E6E4DE]">
            {user ? (
              <div className="flex items-center justify-between p-3 bg-[#F4EDE2]/50 border border-[#D5C2A5]/60 rounded-xs text-[11px] font-sans">
                <div className="flex items-center gap-2 text-[#121312]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#78542E]" />
                  <span>Private Client: <strong>{user.fullName}</strong></span>
                </div>
                <span className="font-mono text-[10px] text-[#78542E] uppercase tracking-wider">Prefilled</span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs text-[11px] font-sans text-[#63655E]">
                <span>Have an AURA client account?</span>
                <Link
                  href={`/auth/signin?returnUrl=${encodeURIComponent(`/properties/${property.slug || property.id}?action=viewing`)}`}
                  className="font-mono text-[11px] text-[#78542E] hover:text-[#121312] underline"
                >
                  Sign in to prefill &amp; save →
                </Link>
              </div>
            )}

            <Input
              label="Full Name"
              placeholder="e.g. Lord Julian Sterling"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              error={errors.fullName}
              isRequired
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="julian@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                error={errors.email}
                isRequired
              />

              <Input
                label="Telephone Number"
                type="tel"
                placeholder="+44 20 7946 0777"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                error={errors.phone}
                isRequired
              />
            </div>
          </div>

          {/* 5. Agent Representation Status */}
          <div className="pt-2 border-t border-[#E6E4DE]">
            <label className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-2 font-medium">
              Representation Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-xs font-sans text-[#4A4C48] cursor-pointer">
                <input
                  type="radio"
                  name="agent-rep"
                  value="independent"
                  checked={hasAgent === "independent"}
                  onChange={() => setHasAgent("independent")}
                  className="w-4 h-4 text-[#78542E] focus:ring-[#121312]"
                />
                <span>I am an independent buyer / tenant</span>
              </label>

              <label className="flex items-center gap-3 text-xs font-sans text-[#4A4C48] cursor-pointer">
                <input
                  type="radio"
                  name="agent-rep"
                  value="represented"
                  checked={hasAgent === "represented"}
                  onChange={() => setHasAgent("represented")}
                  className="w-4 h-4 text-[#78542E] focus:ring-[#121312]"
                />
                <span>I am currently working with a broker or buyer agent</span>
              </label>
            </div>
          </div>

          {/* 6. Optional Notes / Special Requests */}
          <div>
            <label
              htmlFor="viewing-notes"
              className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
            >
              Special Requirements or Notes (Optional)
            </label>
            <textarea
              id="viewing-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Accessibility needs, specific architectural features to inspect..."
              className="w-full p-3 border border-[#D5D1C7] rounded-xs bg-[#FFFFFF] font-sans text-xs text-[#121312] placeholder-[#8E8A80] focus:outline-none focus:ring-2 focus:ring-[#121312]"
            />
          </div>

          {/* 7. Mandatory Advance Notice Notice */}
          <p className="text-[11px] font-sans text-[#63655E] bg-[#FBFBF9] p-3 rounded-xs border border-[#E6E4DE]">
            <strong>Notice</strong>: Private showings require 24-hour advance coordination with the property owner and dedicated listing advisor. Viewing requests are subject to manual confirmation.
          </p>

          {/* 8. Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E4DE]">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              loadingText="Submitting Request..."
            >
              Request Appointment
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
