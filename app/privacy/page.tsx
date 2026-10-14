import React from "react";
import Link from "next/link";
import { AGENCY_CONFIG } from "@/config/agency";

export const metadata = {
  title: "Privacy Policy | Vane & Sterling",
  description: "Client data confidentiality, GDPR compliance, and privacy policies.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <span className="text-xs uppercase tracking-widest font-semibold text-accent-600 block mb-2">
        Regulatory & Compliance
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl text-agency-950 font-normal mb-8">
        Privacy & Cookie Policy
      </h1>

      <div className="prose prose-agency text-xs sm:text-sm text-agency-700 leading-relaxed space-y-6">
        <p>
          At <strong>{AGENCY_CONFIG.legalName}</strong> (&quot;Vane &amp; Sterling&quot;, &quot;we&quot;, &quot;us&quot;), we maintain an unyielding commitment to the confidentiality and data security of our clients, purchasers, vendors, and tenants in compliance with the UK Data Protection Act 2018 and the General Data Protection Regulation (UK GDPR).
        </p>

        <h2 className="font-serif text-xl sm:text-2xl text-agency-950 font-normal pt-4">
          1. Data Collected
        </h2>
        <p>
          We only gather personal data when you deliberately provide it through our private viewing requests, vendor representation forms, or direct telephone/email inquiries. This data typically includes your full name, telephone number, email address, and property requirements.
        </p>

        <h2 className="font-serif text-xl sm:text-2xl text-agency-950 font-normal pt-4">
          2. Anti-Money Laundering (AML) Compliance
        </h2>
        <p>
          As an RICS-regulated firm subject to the Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017, we are legally required to verify the identity and source of funds for all parties involved in property transactions. Such identification records are handled under strict encryption and disclosed only to competent statutory authorities.
        </p>

        <h2 className="font-serif text-xl sm:text-2xl text-agency-950 font-normal pt-4">
          3. Local Storage vs. Cookies
        </h2>
        <p>
          We utilize minimal browser local storage strictly to preserve your shortlisted properties without requiring you to log in or create an account. We do not sell or monetize personal browsing information to third-party advertising networks.
        </p>

        <h2 className="font-serif text-xl sm:text-2xl text-agency-950 font-normal pt-4">
          4. Contact Our Data Controller
        </h2>
        <p>
          For queries concerning your personal data or to request data erasure, write to our appointed Data Controller at{" "}
          <a href={`mailto:${AGENCY_CONFIG.contact.email}`} className="text-accent-600 underline">
            {AGENCY_CONFIG.contact.email}
          </a>{" "}
          or at {AGENCY_CONFIG.address.line1}, {AGENCY_CONFIG.address.city} {AGENCY_CONFIG.address.postalCode}.
        </p>
      </div>
    </div>
  );
}
