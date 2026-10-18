"use client";

import React, { useState } from "react";
import { ContactInquiry } from "@/types/inquiry";
import { generateMailtoLink, AGENCY_CONCIERGE_EMAIL } from "@/lib/mailto";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ContactErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactInquiry>({
    fullName: "",
    email: "",
    phone: "",
    subject: "Private Acquisition Advisory",
    preferredOffice: "London",
    message: "",
  });

  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [inquiryReference, setInquiryReference] = useState("");

  const validate = (): boolean => {
    const newErrors: ContactErrors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please provide your full name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please provide a valid email address.";
    }

    if (!formData.subject || formData.subject.trim().length < 3) {
      newErrors.subject = "Please enter an inquiry subject.";
    }

    if (!formData.message || formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
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
    await new Promise((resolve) => setTimeout(resolve, 500));

    const ref = `VS-CON-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setInquiryReference(ref);
    setIsSubmitting(false);
    setSubmissionSuccess(true);
  };

  const mailtoUrl = generateMailtoLink(formData, AGENCY_CONCIERGE_EMAIL);

  if (submissionSuccess) {
    return (
      <div
        className="bg-[#FFFFFF] border border-[#E6E4DE] p-8 md:p-12 rounded-xs shadow-ambient-sm max-w-xl mx-auto"
        role="status"
        aria-live="polite"
      >
        <div className="w-12 h-12 rounded-full bg-[#F3F1EC] border border-[#78542E]/30 flex items-center justify-center text-[#78542E] mb-6">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] mb-2">
          Message Transmitted • {inquiryReference}
        </p>

        <h3 className="font-serif text-3xl text-[#121312] font-normal mb-4">
          Client Inquiry Received
        </h3>

        <p className="font-sans text-sm text-[#4A4C48] leading-relaxed mb-6">
          Thank you, <strong className="text-[#121312]">{formData.fullName}</strong>. Your correspondence has been routed to our <strong className="text-[#121312]">{formData.preferredOffice}</strong> desk. A private client advisor will respond within 24 business hours.
        </p>

        <div className="pt-6 border-t border-[#E6E4DE] flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setSubmissionSuccess(false);
              setErrors({});
            }}
          >
            Send Another Message
          </Button>
          <a
            href={mailtoUrl}
            className="text-xs font-mono uppercase tracking-wider text-[#78542E] hover:text-[#121312] transition-colors"
          >
            Open in Email Client &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#E6E4DE] p-6 sm:p-10 rounded-xs shadow-ambient-sm">
      <div className="mb-6 border-b border-[#E6E4DE] pb-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-1 font-medium">
          Direct Client Desk
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#121312] font-normal tracking-tight-editorial">
          General Client Inquiry
        </h2>
      </div>

      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="mb-6 p-4 bg-[#F3F1EC] border-l-2 border-[#78542E] text-xs font-sans text-[#121312] space-y-1"
        >
          <p className="font-mono uppercase tracking-wider font-semibold text-[#78542E]">
            Please review the following fields:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[#4A4C48]">
            {Object.values(errors).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="fullName"
            name="fullName"
            label="Full Name"
            placeholder="e.g. Alistair Finch"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              if (errors.fullName) setErrors({ ...errors, fullName: undefined });
            }}
            error={errors.fullName}
            isRequired
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="client@domain.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            error={errors.email}
            isRequired
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Telephone (Optional)"
            placeholder="+44 20 7946 0880"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <div>
            <label
              htmlFor="preferredOffice"
              className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
            >
              Preferred Office Desk
            </label>
            <select
              id="preferredOffice"
              name="preferredOffice"
              value={formData.preferredOffice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferredOffice: e.target.value as "London" | "New York" | "Zurich",
                })
              }
              className="w-full h-11 px-3.5 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
            >
              <option value="London">London — Mayfair (Global HQ)</option>
              <option value="New York">New York — Fifth Avenue</option>
              <option value="Zurich">Zurich — Bahnhofstrasse</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
          >
            Inquiry Subject <span className="text-[#78542E]">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full h-11 px-3.5 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
          >
            <option value="Private Acquisition Advisory">Private Acquisition Advisory (Buy)</option>
            <option value="Turnkey Leasing Consultation">Turnkey Luxury Leasing (Rent)</option>
            <option value="Property Owner Representation">Property Owner Representation (Sell)</option>
            <option value="Corporate & Family Office Relocation">Corporate &amp; Family Office Relocation</option>
            <option value="Press, Editorial & Media">Press, Editorial &amp; Media Inquiries</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
          >
            Message &amp; Requirements <span className="text-[#78542E]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Please detail your architectural requirements, preferred districts, investment timeline, or specific property references..."
            value={formData.message}
            onChange={(e) => {
              setFormData({ ...formData, message: e.target.value });
              if (errors.message) setErrors({ ...errors, message: undefined });
            }}
            className="w-full p-3.5 bg-[#FFFFFF] border border-[#E6E4DE] text-[#121312] text-sm rounded-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#121312] transition-colors"
          />
          {errors.message && (
            <p className="mt-1 text-xs text-[#9B2C2C] font-sans">{errors.message}</p>
          )}
        </div>

        <div className="pt-3 border-t border-[#E6E4DE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Transmitting..."
          >
            Transmit Client Inquiry
          </Button>

          <a
            href={mailtoUrl}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E6E4DE] text-[#121312] hover:bg-[#F3F1EC] rounded-xs uppercase tracking-wider text-xs font-mono transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#78542E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Open in Email Client
          </a>
        </div>
      </form>
    </div>
  );
}
