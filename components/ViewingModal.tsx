"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Mail, Phone } from "lucide-react";
import { Property } from "@/types/property";
import { AGENCY_CONFIG } from "@/config/agency";

interface ViewingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewingModal({
  property,
  isOpen,
  onClose,
}: ViewingModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon" | "evening">("morning");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [responseMessage, setResponseMessage] = useState("");

  // Calculate tomorrow's date for min date
  const tomorrowStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setStatus("idle");
      setResponseMessage("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setResponseMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          propertyReference: property.reference,
          propertyTitle: property.title,
          type: "viewing",
          fullName,
          email,
          phone,
          preferredDate,
          timeSlot,
          message,
          honeypot,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setResponseMessage(data.message);
      } else {
        setStatus("error");
        setResponseMessage(data.error || "An error occurred submitting your viewing request.");
      }
    } catch {
      setStatus("error");
      setResponseMessage(
        "Network connection failed. You may contact our Private Office directly via telephone or email below."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoSubject = encodeURIComponent(
    `Private Viewing Request: ${property.title} (${property.reference})`
  );
  const mailtoBody = encodeURIComponent(
    `Hello Vane & Sterling Private Office,\n\nI would like to request a private viewing for:\nProperty: ${property.title}\nReference: ${property.reference}\nPreferred Date: ${preferredDate || "Earliest available"}\nPreferred Time: ${timeSlot}\n\nClient Details:\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nNotes: ${message}\n\nThank you.`
  );
  const directMailtoUrl = `mailto:${AGENCY_CONFIG.contact.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewing-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-surface-canvas rounded-lg shadow-hover border border-border-subtle p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-agency-400 hover:text-agency-950 rounded-full focus-visible:ring-2 focus-visible:ring-accent-500"
          aria-label="Close viewing request modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-accent-500 font-sans">
            Private Appointment
          </span>
          <h2 id="viewing-modal-title" className="font-serif text-2xl text-agency-950 font-medium mt-1">
            Request a Viewing
          </h2>
          <p className="text-xs text-agency-500 mt-1">
            {property.title} &bull; Ref: <span className="font-mono text-agency-700">{property.reference}</span>
          </p>
        </div>

        {/* Success Feedback View */}
        {status === "success" ? (
          <div className="space-y-4 py-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-semibold text-sm mb-1 text-emerald-950">Viewing Request Transmitted</p>
                <p>{responseMessage}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-surface-warm border border-border-subtle text-xs text-agency-600 space-y-2">
              <p className="font-semibold text-agency-900">What happens next?</p>
              <p>
                Our Senior Sales & Lettings Associate will review keyholder access and contact you at{" "}
                <strong className="text-agency-900">{phone || email}</strong> to confirm the exact time.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-agency-950 hover:bg-agency-900 rounded transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field (hidden) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="preferred_broker_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Error Banner */}
            {status === "error" && (
              <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>{responseMessage}</p>
                  <a
                    href={directMailtoUrl}
                    className="inline-flex items-center text-accent-600 font-semibold underline mt-1"
                  >
                    <Mail className="w-3.5 h-3.5 mr-1" />
                    Click here to send viewing email directly via your mail client
                  </a>
                </div>
              </div>
            )}

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="viewing-date"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1 flex items-center"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1 text-accent-500" />
                  <span>Preferred Date *</span>
                </label>
                <input
                  type="date"
                  id="viewing-date"
                  required
                  min={tomorrowStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>

              <div>
                <label
                  htmlFor="viewing-time"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1 flex items-center"
                >
                  <Clock className="w-3.5 h-3.5 mr-1 text-accent-500" />
                  <span>Time Preference</span>
                </label>
                <select
                  id="viewing-time"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                >
                  <option value="morning">Morning (09:00 – 12:00)</option>
                  <option value="afternoon">Afternoon (12:00 – 16:00)</option>
                  <option value="evening">Evening (16:00 – 19:00)</option>
                </select>
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="viewing-name"
                className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="viewing-name"
                required
                placeholder="e.g. Lord Edward Sterling"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="viewing-email"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="viewing-email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>

              <div>
                <label
                  htmlFor="viewing-phone"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                >
                  Contact Telephone *
                </label>
                <input
                  type="tel"
                  id="viewing-phone"
                  required
                  placeholder="+44 7900 123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>
            </div>

            {/* Message / Special Requirements */}
            <div>
              <label
                htmlFor="viewing-message"
                className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
              >
                Specific Inquiries or Requirements (Optional)
              </label>
              <textarea
                id="viewing-message"
                rows={3}
                placeholder="e.g. Inquiring regarding service charges, parking allocation, or lease terms..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500 resize-none"
              />
            </div>

            {/* Trust and Fiduciary Disclaimer */}
            <div className="text-[11px] text-agency-500 leading-normal">
              * Note: Viewing requests are subject to agency and vendor confirmation. We do not use automated booking calendars. Your contact details remain strictly confidential under GDPR and our privacy policy.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-accent-500 hover:bg-accent-600 disabled:opacity-50 rounded transition-colors flex items-center justify-center shadow-sm"
            >
              {isSubmitting ? "Transmitting Request..." : "Submit Viewing Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
