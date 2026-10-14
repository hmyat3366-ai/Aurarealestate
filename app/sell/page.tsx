"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Building,
  FileCheck,
  Award,
  Lock,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { AGENCY_CONFIG } from "@/config/agency";

export default function SellWithUsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [propertyType, setPropertyType] = useState("apartment");
  const [estimatedValue, setEstimatedValue] = useState("");
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
      const res = await fetch("/api/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          propertyLocation,
          propertyType,
          estimatedValue,
          message,
          honeypot,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setFeedback(data.message);
      } else {
        setStatus("error");
        setFeedback(data.error || "Unable to send representation inquiry.");
      }
    } catch {
      setStatus("error");
      setFeedback(
        "Network transmission failed. Please use our direct email link below."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoSubject = encodeURIComponent(
    `Confidential Sale Inquiry: ${propertyLocation || "Prime Residence"}`
  );
  const mailtoBody = encodeURIComponent(
    `Dear Vane & Sterling Sales Directorate,\n\nI wish to request a confidential consultation regarding the representation and sale of my property:\n\nProperty Details:\n- Location / District: ${propertyLocation}\n- Property Type: ${propertyType}\n- Estimated Value: ${estimatedValue || "Confidential"}\n\nVendor Details:\n- Name: ${fullName}\n- Phone: ${phone}\n- Email: ${email}\n- Details / Notes: ${message}\n\nKind regards,\n${fullName}`
  );
  const mailtoUrl = `mailto:${AGENCY_CONFIG.contact.salesEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Hero Header */}
      <div className="max-w-3xl mb-14 space-y-4">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
          Private Client Advisory
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-agency-950 font-normal leading-tight">
          Sell with Vane & Sterling
        </h1>
        <p className="text-base sm:text-lg text-agency-600 font-light leading-relaxed">
          We represent homeowners and family offices who prioritize confidentiality, architectural appreciation, and access to verified international liquidity.
        </p>
      </div>

      {/* Strict Policy Notice */}
      <div className="p-4 sm:p-5 rounded-lg bg-surface-canvas border border-border-strong mb-12 flex items-start space-x-3.5 shadow-subtle">
        <Lock className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
        <div className="text-xs text-agency-700 leading-relaxed">
          <strong className="text-agency-950 block font-semibold mb-1 text-sm">
            Strict Agency-Curated Inventory Policy
          </strong>
          Vane & Sterling is an independent private brokerage, not an open public portal. Property owners cannot self-publish listings directly onto this website. All instructions undergo comprehensive legal vetting and partner approval before tailored representation begins.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column (Process & Advice) */}
        <div className="lg:col-span-7 space-y-12">
          {/* Section: The 4-Stage Selling Journey */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-agency-950 font-normal">
              Our Representation Process
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <span className="w-8 h-8 rounded-full bg-agency-950 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  01
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-agency-950">
                    Confidential Market Appraisal
                  </h3>
                  <p className="text-xs sm:text-sm text-agency-600 leading-relaxed">
                    A Senior Partner conducts an in-depth private assessment of your home’s provenance, condition, square footage, and micro-market comparables to establish realistic, robust pricing.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="w-8 h-8 rounded-full bg-agency-950 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  02
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-agency-950">
                    Bespoke Presentation & Editorial Curation
                  </h3>
                  <p className="text-xs sm:text-sm text-agency-600 leading-relaxed">
                    We commission leading architectural photographers, draft measured laser floor plans, and author narrative literature highlighting the property’s architectural integrity.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="w-8 h-8 rounded-full bg-agency-950 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  03
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-agency-950">
                    Targeted Off-Market or Global Campaign
                  </h3>
                  <p className="text-xs sm:text-sm text-agency-600 leading-relaxed">
                    Depending on your instruction, we introduce your property discreetly to pre-qualified high-net-worth buyers and family offices, or launch a prime international campaign.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="w-8 h-8 rounded-full bg-agency-950 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  04
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-agency-950">
                    Partner-Led Negotiation & Exchange
                  </h3>
                  <p className="text-xs sm:text-sm text-agency-600 leading-relaxed">
                    From initial offer validation through solicitor oversight and contract exchange, our partners remain actively immersed to protect your fiduciary interests.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What to Prepare */}
          <section className="p-6 rounded-lg bg-surface-canvas border border-border-subtle space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-agency-900 flex items-center">
              <FileCheck className="w-4 h-4 mr-2 text-accent-600" />
              <span>Recommended Information to Prepare</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-agency-600 pt-1">
              <li className="flex items-center">&bull; Proof of Title / Freehold or Leasehold details</li>
              <li className="flex items-center">&bull; Approximate internal area (sq ft / sq m)</li>
              <li className="flex items-center">&bull; Energy Performance Certificate (EPC) if active</li>
              <li className="flex items-center">&bull; Service charge & ground rent statements</li>
              <li className="flex items-center">&bull; Architectural renovation history</li>
              <li className="flex items-center">&bull; Preferred timeline for sale completion</li>
            </ul>
          </section>
        </div>

        {/* Right Column (Representation Inquiry Form) */}
        <div className="lg:col-span-5 bg-surface-canvas rounded-xl border border-border-strong shadow-premium p-6 sm:p-8">
          <div className="mb-6">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-accent-600 font-sans">
              Vendor Consultation
            </span>
            <h2 className="font-serif text-2xl text-agency-950 font-normal mt-1">
              Request Private Valuation
            </h2>
            <p className="text-xs text-agency-500 mt-1">
              Direct submission to the Vane & Sterling Senior Acquisitions Partner.
            </p>
          </div>

          {status === "success" ? (
            <div className="space-y-4 py-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-sm mb-1 text-emerald-950">Inquiry Acknowledged</p>
                  <p>{feedback}</p>
                </div>
              </div>
              <p className="text-xs text-agency-600">
                A Senior Partner will review your property information confidentially and contact you via telephone or email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot anti-spam */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="sell_website_hp"
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
                      Click here to email our Sales Director directly
                    </a>
                  </div>
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="sell-name"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="sell-name"
                  required
                  placeholder="e.g. Lady Catherine Howard"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="sell-email"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="sell-email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sell-phone"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                  >
                    Telephone *
                  </label>
                  <input
                    type="tel"
                    id="sell-phone"
                    required
                    placeholder="+44 7900 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                  />
                </div>
              </div>

              {/* Location / Postcode */}
              <div>
                <label
                  htmlFor="sell-location"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                >
                  Property Address or District *
                </label>
                <input
                  type="text"
                  id="sell-location"
                  required
                  placeholder="e.g. Eaton Square, Belgravia, SW1W"
                  value={propertyLocation}
                  onChange={(e) => setPropertyLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>

              {/* Property Type and Estimated Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="sell-type"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                  >
                    Architecture Type
                  </label>
                  <select
                    id="sell-type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                  >
                    <option value="apartment">Lateral Apartment</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="townhouse">Period Townhouse</option>
                    <option value="villa">Detached Villa</option>
                    <option value="mews">Mews House</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sell-value"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                  >
                    Approximate Guide Price
                  </label>
                  <select
                    id="sell-value"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-warm border border-border-strong rounded text-agency-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                  >
                    <option value="">Confidential / Advise Me</option>
                    <option value="£2m - £5m">£2,000,000 – £5,000,000</option>
                    <option value="£5m - £10m">£5,000,000 – £10,000,000</option>
                    <option value="£10m - £20m">£10,000,000 – £20,000,000</option>
                    <option value="£20m+">£20,000,000+</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="sell-message"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-agency-700 mb-1"
                >
                  Property Details or Special Instructions
                </label>
                <textarea
                  id="sell-message"
                  rows={3}
                  placeholder="Specify key architectural features, tenure, current occupancy, or preferred confidentiality requirements..."
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
                {isSubmitting ? "Transmitting..." : "Submit Representation Request"}
              </button>

              <div className="pt-2 text-center">
                <a
                  href={mailtoUrl}
                  className="text-xs text-agency-500 hover:text-accent-600 underline"
                >
                  Prefer to email via your mail client? Click here
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
