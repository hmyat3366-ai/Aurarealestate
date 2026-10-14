import React from "react";
import Link from "next/link";
import { AGENCY_CONFIG } from "@/config/agency";

export const metadata = {
  title: "Terms of Business | Vane & Sterling",
  description: "Terms of business, property particulars notice, and agency disclaimers.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <span className="text-xs uppercase tracking-widest font-semibold text-accent-600 block mb-2">
        Legal Disclosures
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl text-agency-950 font-normal mb-8">
        Terms of Business & Particulars Notice
      </h1>

      <div className="prose prose-agency text-xs sm:text-sm text-agency-700 leading-relaxed space-y-6">
        <p>
          These Terms of Business govern the use of this website and outline our standard agency notices under the Property Misdescriptions Act and consumer protection regulations.
        </p>

        <h2 className="font-serif text-xl sm:text-2xl text-agency-950 font-normal pt-4">
          1. Important Notice Regarding Property Particulars
        </h2>
        <p>
          {AGENCY_CONFIG.legalName} and their clients give notice that:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            They are not authorized to make or give any representations or warranties in relation to the property either here or elsewhere, either on their own behalf or on behalf of their client or otherwise.
          </li>
          <li>
            These particulars do not form part of any offer or contract and must not be relied upon as statements or representations of fact.
          </li>
          <li>
            Any areas, measurements or distances are approximate. The text, images and plans are for guidance only and are not necessarily comprehensive.
          </li>
          <li>
            It should not be assumed that the property has all necessary planning, building regulation or other consents and Vane &amp; Sterling have not tested any services, equipment or facilities. Purchasers or tenants must satisfy themselves by inspection or otherwise.
          </li>
        </ul>

        <h2 className="font-serif text-xl sm:text-2xl text-agency-950 font-normal pt-4">
          2. Inventory Exclusivity
        </h2>
        <p>
          All properties listed on this platform are represented under direct client agency instructions. Unauthorized reproduction, web scraping, or syndication of our photographs, floor plans, or property descriptions without written authorization from {AGENCY_CONFIG.legalName} is strictly prohibited.
        </p>

        <h2 className="font-serif text-xl sm:text-2xl text-agency-950 font-normal pt-4">
          3. Redress & Professional Regulation
        </h2>
        <p>
          Vane &amp; Sterling is regulated by the Royal Institution of Chartered Surveyors (RICS) and is a member of The Property Ombudsman scheme. In the event of an unresolved grievance, our formal complaints handling procedure is available upon written request.
        </p>
      </div>
    </div>
  );
}
