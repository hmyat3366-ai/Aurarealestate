import React from "react";
import Link from "next/link";
import { AuraLogo } from "@/components/brand";

export function Footer() {
  return (
    <footer className="w-full bg-[#121312] text-[#FBFBF9] border-t border-[#4A4C48] mt-auto">
      {/* Upper Footer: Brand & Offices Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block" aria-label="AURA Real Estate — Return to Homepage">
              <AuraLogo variant="primary" theme="dark" align="left" height={44} />
            </Link>
            <p className="font-sans text-sm text-[#D5D1C7] leading-relaxed max-w-sm">
              Curators of exceptional architectural residences, historic cast-iron lofts, and rare off-market estates. Guided by curatorial discernment, strict client confidentiality, and fiduciary excellence.
            </p>
            <div className="flex items-center gap-6 pt-2 text-[#8E8A80]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FBFBF9] transition-colors text-xs font-mono uppercase tracking-wider"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FBFBF9] transition-colors text-xs font-mono uppercase tracking-wider"
              >
                LinkedIn
              </a>
              <Link
                href="/insights"
                className="hover:text-[#FBFBF9] transition-colors text-xs font-mono uppercase tracking-wider"
              >
                Journal &amp; Insights
              </Link>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-mono text-eyebrow-label uppercase tracking-[0.2em] text-[#78542E] font-medium">
              Portfolio &amp; Advisory
            </h3>
            <ul className="space-y-3 font-sans text-body-small text-[#D5D1C7]">
              <li>
                <Link href="/buy" className="hover:text-[#FBFBF9] transition-colors">
                  Residences for Acquisition
                </Link>
              </li>
              <li>
                <Link href="/rent" className="hover:text-[#FBFBF9] transition-colors">
                  Turnkey Luxury Leases
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-[#FBFBF9] transition-colors">
                  Sell with Us &amp; Valuation
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#FBFBF9] transition-colors">
                  Services &amp; Practice Pillars
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-[#FBFBF9] transition-colors">
                  The Wealth Report &amp; Insights
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FBFBF9] transition-colors">
                  Curatorial Standards &amp; Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FBFBF9] transition-colors">
                  Private Client Offices
                </Link>
              </li>
            </ul>
          </div>

          {/* Centralized Agency Office Locations */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-mono text-eyebrow-label uppercase tracking-[0.2em] text-[#78542E] font-medium">
              Agency Offices
            </h3>
            <div className="space-y-4 font-sans text-xs text-[#D5D1C7] leading-relaxed">
              {/* London Office */}
              <div className="border-l border-[#4A4C48] pl-3">
                <span className="font-mono uppercase tracking-wider text-caption-meta text-[#FBFBF9] block">
                  London — Mayfair
                </span>
                <p>14 Berkeley Square, Mayfair, London W1J 6BD</p>
                <p className="text-[#8E8A80] mt-0.5">+44 (0)20 7946 0880</p>
              </div>

              {/* New York Office */}
              <div className="border-l border-[#4A4C48] pl-3">
                <span className="font-mono uppercase tracking-wider text-caption-meta text-[#FBFBF9] block">
                  New York — Fifth Avenue
                </span>
                <p>767 Fifth Avenue, New York, NY 10153</p>
                <p className="text-[#8E8A80] mt-0.5">+1 (212) 555-0180</p>
              </div>

              {/* Zurich Office */}
              <div className="border-l border-[#4A4C48] pl-3">
                <span className="font-mono uppercase tracking-wider text-caption-meta text-[#FBFBF9] block">
                  Zurich — Bahnhofstrasse
                </span>
                <p>Bahnhofstrasse 45, 8001 Zürich, Switzerland</p>
                <p className="text-[#8E8A80] mt-0.5">+41 44 211 0180</p>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory & Compliance Disclosures */}
        <div className="mt-14 pt-8 border-t border-[#4A4C48]/60 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Equal Housing & Fair Housing Notice */}
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-[#8E8A80] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <p className="font-sans text-xs text-[#8E8A80]">
                <strong>Equal Housing Opportunity.</strong> We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the Nation. We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, color, religion, sex, handicap, familial status, or national origin under the Fair Housing Act.
              </p>
            </div>
          </div>

          <p className="font-sans text-[11px] text-[#63655E] leading-normal">
            Regulated by RICS (Royal Institution of Chartered Surveyors). Subject to Money Laundering Regulations 2017 &amp; 2019. AURA Real Estate Private Real Estate LLP is a licensed real estate broker. All property descriptions, dimensions, and specifications are approximate and compiled from sources deemed reliable, subject to prior sale, lease, or withdrawal.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="mt-8 pt-6 border-t border-[#4A4C48]/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#8E8A80]">
          <p>© 2026 AURA Real Estate Private Real Estate LLP. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/about" className="hover:text-[#FBFBF9] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-[#FBFBF9] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-[#FBFBF9] transition-colors">
              Anti-Money Laundering
            </Link>
            <Link href="/contact" className="hover:text-[#FBFBF9] transition-colors">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
