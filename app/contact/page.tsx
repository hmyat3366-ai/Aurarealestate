"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
} from "lucide-react";
import { AGENCY_CONFIG } from "@/config/agency";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState<"buying" | "renting" | "selling" | "general">("buying");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setFeedback("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          type: "general",
          message: `[Inquiry Type: ${inquiryType}] ${message}`,
          honeypot,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setFeedback(data.message);
      } else {
        setStatus("error");
        setFeedback(data.error || "Unable to send inquiry.");
      }
    } catch {
      setStatus("error");
      setFeedback(
        "Network transmission issue. Please use our direct telephone or email links."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoSubject = encodeURIComponent(
    `Client Inquiry - ${inquiryType.toUpperCase()}`
  );
  const mailtoUrl = `mailto:${AGENCY_CONFIG.contact.email}?subject=${mailtoSubject}`;

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="max-w-3xl mb-14 space-y-4">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
          Private Office
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-agency-950 font-normal leading-tight">
          Contact Vane & Sterling
        </h1>
        <p className="text-base sm:text-lg text-agency-600 font-light leading-relaxed">
          For sales inquiries, executive lettings, private valuations, or confidential acquisition mandates, connect directly with our Mayfair headquarters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Office Details */}
        <div className="lg:col-span-5 space-y-8">
          {/* Address & Office */}
          <div className="p-6 rounded-xl bg-surface-canvas border border-border-subtle shadow-subtle space-y-4">
            <h2 className="font-serif text-2xl text-agency-950 font-normal">
              Mayfair Headquarters
            </h2>

            <div className="space-y-3 text-sm text-agency-700">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-accent-600 shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-agency-950">
                    {AGENCY_CONFIG.legalName}
                  </p>
                  <p>{AGENCY_CONFIG.address.line1}</p>
                  <p>{AGENCY_CONFIG.address.line2}</p>
                  <p>
                    {AGENCY_CONFIG.address.city} {AGENCY_CONFIG.address.postalCode}
                  </p>
                  <p>{AGENCY_CONFIG.address.country}</p>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <Phone className="w-4 h-4 mr-3 text-accent-600 shrink-0" />
                <a
                  href={`tel:${AGENCY_CONFIG.contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="font-medium hover:text-accent-600 transition-colors"
                >
                  {AGENCY_CONFIG.contact.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-accent-600 shrink-0" />
                <a
                  href={`mailto:${AGENCY_CONFIG.contact.email}`}
                  className="hover:text-accent-600 transition-colors"
                >
                  {AGENCY_CONFIG.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="p-6 rounded-xl bg-surface-canvas border border-border-subtle shadow-subtle space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-agency-900 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-accent-600" />
              <span>Advisory Hours</span>
            </h3>
            <ul className="space-y-2 text-xs text-agency-600">
              {AGENCY_CONFIG.officeHours.map((oh) => (
                <li key={oh.days} className="flex justify-between py-1 border-b border-border-subtle/50">
                  <span className="font-medium text-agency-800">{oh.days}</span>
                  <span>{oh.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Department Directory */}
          <div className="p-6 rounded-xl bg-surface-canvas border border-border-subtle shadow-subtle space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-agency-900 flex items-center">
              <Building className="w-4 h-4 mr-2 text-accent-600" />
              <span>Departmental Inquiries</span>
            </h3>
            <div className="space-y-2 text-xs text-agency-600">
              <div className="flex justify-between">
                <span>Prime Sales Directorate</span>
                <a href={`mailto:${AGENCY_CONFIG.contact.salesEmail}`} className="text-accent-600 underline">
                  {AGENCY_CONFIG.contact.salesEmail}
                </a>
              </div>
              <div className="flex justify-between">
                <span>Executive Lettings</span>
                <a href={`mailto:${AGENCY_CONFIG.contact.lettingsEmail}`} className="text-accent-600 underline">
                  {AGENCY_CONFIG.contact.lettingsEmail}
                </a>
              </div>
              <div className="flex justify-between">
                <span>Press & Editorial Inquiries</span>
                <a href={`mailto:${AGENCY_CONFIG.contact.pressEmail}`} className="text-accent-600 underline">
                  {AGENCY_CONFIG.contact.pressEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-surface-canvas rounded-xl border border-border-strong shadow-premium p-6 sm:p-8">
          <div className="mb-6">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-accent-600 font-sans">
              Direct Inquiries
            </span>
            <h2 className="font-serif text-2xl text-agency-950 font-normal mt-1">
              Send an Inquiry
            </h2>
            <p className="text-xs text-agency-500 mt-1">
              Your inquiry is handled directly by our senior advisory partners under strict professional confidentiality.
            </p>
          </div>

          {status === "success" ? (
            <div className="space-y-4 py-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-sm mb-1 text-emerald-950">Inquiry Delivered</p>
                  <p>{feedback}</p>
                </div>
              </div>
              <p className="text-xs text-agency-600">
                A partner will review your inquiry and respond within two business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-spam Honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="contact_sec_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {status === "error" && (
                <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p>{feedback}</p>
                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center text-accent-600 font-semibold underline mt-1"
                    >
                      <Mail className="w-3.5 h-3.5 mr-1" />
                      Email us directly via your email client
                    </a>
                  </div>
                </div>
              )}

              {/* Inquiry Type Tabs */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-2">
                  Nature of Inquiry *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["buying", "renting", "selling", "general"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInquiryType(type)}
                      className={`py-2 px-3 text-xs font-semibold uppercase tracking-wider rounded border transition-colors ${
                        inquiryType === type
                          ? "bg-agency-950 text-white border-agency-950"
                          : "bg-surface-warm border-border-strong text-agency-700 hover:text-agency-950"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="contact-name"
                  required
                  placeholder="e.g. Alexander Hamilton"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                  >
                    Telephone *
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    required
                    placeholder="+44 7900 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                >
                  Message or Acquisition Brief *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Please describe your property search criteria, specific questions, or valuation inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-agency-950 hover:bg-agency-900 disabled:opacity-50 rounded transition-colors flex items-center justify-center shadow-sm"
              >
                {isSubmitting ? "Transmitting..." : "Send Client Inquiry"}
              </button>

              <div className="pt-2 text-center">
                <a
                  href={mailtoUrl}
                  className="text-xs text-agency-500 hover:text-accent-600 underline"
                >
                  Prefer to send directly via your desktop mail client? Click here
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
