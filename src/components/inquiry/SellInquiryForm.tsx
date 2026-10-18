"use client";

import React, { useState, useEffect, useContext } from "react";
import { SellInquiry, SellingTimeline } from "@/types/inquiry";
import { PropertyType } from "@/types/property";
import { generateMailtoLink, AGENCY_ACQUISITIONS_EMAIL } from "@/lib/mailto";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthContext } from "@/context/AuthContext";

interface FormErrors {
  ownerName?: string;
  email?: string;
  phone?: string;
  propertyAddress?: string;
  propertyType?: string;
  estimatedBedrooms?: string;
  estimatedBathrooms?: string;
  general?: string;
}

export function SellInquiryForm() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [formData, setFormData] = useState<SellInquiry>({
    ownerName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    propertyAddress: "",
    unit: "",
    neighborhood: "",
    propertyType: "penthouse",
    estimatedBedrooms: 3,
    estimatedBathrooms: 3,
    estimatedValue: "$5,000,000 - $10,000,000",
    timeline: "1-3_months",
    marketingPreference: "private_exclusive",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        ownerName: prev.ownerName || user.fullName || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [inquiryReference, setInquiryReference] = useState("");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.ownerName || formData.ownerName.trim().length < 2) {
      newErrors.ownerName = "Owner name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please provide a valid email address.";
    }

    const digits = formData.phone.replace(/\D/g, "");
    if (!formData.phone || digits.length < 7) {
      newErrors.phone = "Please provide a valid telephone number.";
    }

    if (!formData.propertyAddress || formData.propertyAddress.trim().length < 5) {
      newErrors.propertyAddress = "Please specify the full property address or postal code.";
    }

    const validTypes: PropertyType[] = [
      "apartment",
      "penthouse",
      "villa",
      "townhouse",
      "estate",
      "loft",
    ];
    if (!formData.propertyType || !validTypes.includes(formData.propertyType)) {
      newErrors.propertyType = "Please select a valid property category.";
    }

    if (
      typeof formData.estimatedBedrooms !== "number" ||
      formData.estimatedBedrooms < 0
    ) {
      newErrors.estimatedBedrooms = "Please provide bedroom count.";
    }

    if (
      typeof formData.estimatedBathrooms !== "number" ||
      formData.estimatedBathrooms < 0
    ) {
      newErrors.estimatedBathrooms = "Please provide bathroom count.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate secure client-side submission without catalog contamination
    await new Promise((resolve) => setTimeout(resolve, 600));

    // STRICT FIDUCIARY INVARIANT:
    // This inquiry is routed exclusively to internal agency acquisitions.
    // It NEVER publishes or injects listings into the public property catalog.
    const refCode = `VS-SELL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setInquiryReference(refCode);
    setIsSubmitting(false);
    setSubmissionSuccess(true);
  };

  // Pre-filled RFC 2368 mailto fallback URL
  const mailtoUrl = generateMailtoLink(
    {
      ...formData,
      submissionMethod: "mailto",
    },
    AGENCY_ACQUISITIONS_EMAIL
  );

  if (submissionSuccess) {
    return (
      <div
        className="bg-[#FFFFFF] border border-[#E6E4DE] p-8 md:p-12 rounded-xs shadow-ambient-sm max-w-2xl mx-auto"
        role="status"
        aria-live="polite"
      >
        <div className="w-12 h-12 rounded-full bg-[#F3F1EC] border border-[#78542E]/30 flex items-center justify-center text-[#78542E] mb-6">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] mb-2">
          Consultation Received • {inquiryReference}
        </p>

        <h3 className="font-serif text-3xl md:text-4xl text-[#121312] font-normal mb-4">
          Valuation Request Received
        </h3>

        <div className="space-y-4 font-sans text-sm text-[#4A4C48] leading-relaxed mb-8">
          <p>
            Thank you, <strong className="text-[#121312]">{formData.ownerName}</strong>. Your confidential inquiry regarding{" "}
            <strong className="text-[#121312]">{formData.propertyAddress}</strong> has been transmitted directly to Managing Partners Julian Vane and Eleanor Sterling.
          </p>
          <p className="border-l-2 border-[#78542E] pl-4 py-1 text-xs text-[#63655E] bg-[#FBFBF9]">
            <strong>Strict Fiduciary Invariant:</strong> Your property details remain 100% confidential. No automated listing or public marketing has been created. All advisory occurs privately under mutual non-disclosure standards.
          </p>
          <p>
            An advisor will review municipal records, historical comparable sales, and architectural attributes, contacting you within 24 business hours.
          </p>
        </div>

        <div className="pt-6 border-t border-[#E6E4DE] flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setSubmissionSuccess(false);
              setErrors({});
            }}
          >
            Submit Another Property
          </Button>
          <a
            href={mailtoUrl}
            className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-[#78542E] hover:text-[#121312] transition-colors"
          >
            Backup via Email Client &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#E6E4DE] p-6 sm:p-10 lg:p-12 rounded-xs shadow-ambient-sm">
      {/* Form Header */}
      <div className="mb-8 border-b border-[#E6E4DE] pb-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
          Confidential Valuation &amp; Placement
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#121312] font-normal tracking-tight-editorial">
          Request Private Owner Consultation
        </h2>
        <p className="font-sans text-sm text-[#4A4C48] mt-2 leading-relaxed">
          Submit your property specifications for discreet off-market valuation. Our Managing Partners personally oversee all acquisitions and private exclusives.
        </p>
      </div>

      {/* Global Validation Alert if any errors */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="mb-8 p-4 bg-[#F3F1EC] border-l-2 border-[#78542E] text-xs font-sans text-[#121312] space-y-1"
        >
          <p className="font-mono uppercase tracking-wider font-semibold text-[#78542E]">
            Please resolve the following required fields:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[#4A4C48]">
            {Object.values(errors).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Section 1: Owner Contact Details */}
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#78542E] mb-4 pb-1 border-b border-[#E6E4DE]">
            1. Owner &amp; Representation Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              id="ownerName"
              name="ownerName"
              label="Owner Full Name"
              placeholder="e.g. Julian Vane or Family Office"
              value={formData.ownerName}
              onChange={(e) => {
                setFormData({ ...formData, ownerName: e.target.value });
                if (errors.ownerName) setErrors({ ...errors, ownerName: undefined });
              }}
              error={errors.ownerName}
              isRequired
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="owner@domain.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              isRequired
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              label="Telephone / Direct Mobile"
              placeholder="+44 20 7946 0880"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              error={errors.phone}
              isRequired
            />
          </div>
        </div>

        {/* Section 2: Property Specifications */}
        <div className="pt-2">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#78542E] mb-4 pb-1 border-b border-[#E6E4DE]">
            2. Residence Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-8">
              <Input
                id="propertyAddress"
                name="propertyAddress"
                label="Property Address &amp; Postal Code"
                placeholder="e.g. 14 Wilton Crescent, London SW1X or 55 Mercer St, New York"
                value={formData.propertyAddress}
                onChange={(e) => {
                  setFormData({ ...formData, propertyAddress: e.target.value });
                  if (errors.propertyAddress) setErrors({ ...errors, propertyAddress: undefined });
                }}
                error={errors.propertyAddress}
                isRequired
              />
            </div>
            <div className="md:col-span-4">
              <Input
                id="unit"
                name="unit"
                label="Unit / Suite (Optional)"
                placeholder="e.g. Penthouse A"
                value={formData.unit || ""}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
            {/* Property Typology */}
            <div>
              <label
                htmlFor="propertyType"
                className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
              >
                Property Typology <span className="text-[#78542E]">*</span>
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    propertyType: e.target.value as PropertyType,
                  })
                }
                className="w-full h-11 px-3.5 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
              >
                <option value="penthouse">Penthouse</option>
                <option value="apartment">Apartment</option>
                <option value="townhouse">Townhouse</option>
                <option value="villa">Villa / Detached Residence</option>
                <option value="estate">Historic Estate / Manor</option>
                <option value="loft">Cast-Iron Loft</option>
              </select>
            </div>

            {/* Estimated Bedrooms */}
            <div>
              <label
                htmlFor="estimatedBedrooms"
                className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
              >
                Bedrooms <span className="text-[#78542E]">*</span>
              </label>
              <select
                id="estimatedBedrooms"
                name="estimatedBedrooms"
                value={formData.estimatedBedrooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedBedrooms: Number(e.target.value),
                  })
                }
                className="w-full h-11 px-3.5 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
              >
                <option value="0">Studio / 0</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5 Bedrooms</option>
                <option value="6">6+ Bedrooms</option>
              </select>
            </div>

            {/* Estimated Bathrooms */}
            <div>
              <label
                htmlFor="estimatedBathrooms"
                className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
              >
                Bathrooms <span className="text-[#78542E]">*</span>
              </label>
              <select
                id="estimatedBathrooms"
                name="estimatedBathrooms"
                value={formData.estimatedBathrooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedBathrooms: Number(e.target.value),
                  })
                }
                className="w-full h-11 px-3.5 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
              >
                <option value="1">1 Bathroom</option>
                <option value="2">2 Bathrooms</option>
                <option value="3">3 Bathrooms</option>
                <option value="4">4 Bathrooms</option>
                <option value="5">5+ Bathrooms</option>
              </select>
            </div>

            {/* Estimated Value Bracket */}
            <div>
              <label
                htmlFor="estimatedValue"
                className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
              >
                Estimated Value Bracket
              </label>
              <select
                id="estimatedValue"
                name="estimatedValue"
                value={formData.estimatedValue}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedValue: e.target.value })
                }
                className="w-full h-11 px-3.5 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
              >
                <option value="Advise Me / Confidential">Advise Me / Undisclosed</option>
                <option value="$2,500,000 - $5,000,000">$2.5M – $5M / £2M – £4M</option>
                <option value="$5,000,000 - $10,000,000">$5M – $10M / £4M – £8M</option>
                <option value="$10,000,000 - $20,000,000">$10M – $20M / £8M – £16M</option>
                <option value="$20,000,000+">$20M+ / £16M+ (Ultra-Prime)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Strategic Preferences */}
        <div className="pt-2">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#78542E] mb-4 pb-1 border-b border-[#E6E4DE]">
            3. Representation Strategy &amp; Timeline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="marketingPreference"
                className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
              >
                Marketing Channel Preference
              </label>
              <select
                id="marketingPreference"
                name="marketingPreference"
                value={formData.marketingPreference}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    marketingPreference: e.target.value as "private_exclusive" | "public_debut",
                  })
                }
                className="w-full h-11 px-3.5 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
              >
                <option value="private_exclusive">
                  Private Exclusive (100% Off-Market / Direct Placement)
                </option>
                <option value="public_debut">
                  Editorial Public Debut (Architectural Digest &amp; Global Portals)
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="timeline"
                className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
              >
                Target Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeline: e.target.value as SellingTimeline,
                  })
                }
                className="w-full h-11 px-3.5 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
              >
                <option value="immediate">Immediate (Ready for Private Showings)</option>
                <option value="1-3_months">1 to 3 Months</option>
                <option value="3-6_months">3 to 6 Months</option>
                <option value="exploring">Exploring Valuation / Long-Term</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="notes"
              className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
            >
              Architectural Highlights &amp; Private Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Notable architects, ceiling heights, historical provenance, renovation details, or specific confidentiality instructions..."
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3.5 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
            />
          </div>
        </div>

        {/* Fiduciary Notice */}
        <div className="p-4 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs text-xs font-sans text-[#63655E] space-y-1">
          <p className="font-semibold text-[#121312]">
            Fiduciary Invariant &amp; Confidentiality Guarantee
          </p>
          <p>
            Submission of this intake does not create a publicly syndicated listing. Your property information will be encrypted and held privately for the sole review of Julian Vane and Eleanor Sterling.
          </p>
        </div>

        {/* Actions: Primary Submit + RFC 2368 mailto Fallback */}
        <div className="pt-4 border-t border-[#E6E4DE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Transmitting Inquiry..."
          >
            Submit Confidential Valuation Request
          </Button>

          {/* RFC 2368 mailto Fallback Protocol */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#8E8A80]">Or:</span>
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E6E4DE] text-[#121312] hover:bg-[#F3F1EC] rounded-xs uppercase tracking-wider transition-colors"
              title="Generate a pre-filled email in your default client"
            >
              <svg className="w-3.5 h-3.5 text-[#78542E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Open in Email Client
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
